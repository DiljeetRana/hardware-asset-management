"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Laptop, Monitor, Smartphone, Tablet, Package, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Device {
  id: string
  _id: string
  name: string
  brand: string
  modelName: string
  serialNumber: string
  assetTag: string
  status: string
  purchaseCost: number
  purchaseDate: string
  warrantyStatus?: string
  warrantyExpiryDate: string
  availableResourceCount: number
  totalResourceCount: number
  resourceType: {
    _id: string
    type: string
  }
  images: any[]
  createdAt: string
  updatedAt: string
}

interface DeviceTypeWithCount {
  _id: string  
  type: string
  totalDevices: number
  description?: string
}

interface ApiResponse {
  success: boolean
  devices: Device[]
  pagination: {
    current: number
    pages: number
    total: number
    limit: number
  }
}

export default function DevicesPage() {
  const { toast } = useToast()
  const router = useRouter()
  
  // States
  const [devices, setDevices] = useState<Device[]>([])
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([])
  const [deviceTypes, setDeviceTypes] = useState<DeviceTypeWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<any>({})
  
  // Fetch devices from API
  const fetchDevices = useCallback(async (page: number = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        search: searchTerm,
        status: filterStatus === 'all' ? '' : filterStatus,
        deviceType: filterType === 'all' ? '' : filterType,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })

      const response = await fetch(`/api/admin/devices?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: ApiResponse = await response.json()
      
      if (data.success) {
        setDevices(data.devices)
        setFilteredDevices(data.devices)
        setPagination(data.pagination)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error("Error fetching devices:", error)
      toast({
        title: "Error",
        description: "Failed to fetch devices",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filterType, filterStatus, toast])

  // Fetch device types
  const fetchDeviceTypes = async () => {
    try {
      const res = await fetch("/api/admin/resource-type")
      if (!res.ok) throw new Error("Failed to fetch device types")
      const data: DeviceTypeWithCount[] = await res.json()
      setDeviceTypes(data)
    } catch (error) {
      console.error("Error fetching device types:", error)
      toast({
        title: "Error",
        description: "Failed to fetch device types",
        variant: "destructive",
      })
    }
  }

  // Initial load
  useEffect(() => {
    fetchDeviceTypes()
    fetchDevices(1)
  }, [])

  // Refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDevices(1)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, filterType, filterStatus, fetchDevices])

  const statusOptions = ["all", "Available", "Allocated", "Under Repair", "Retired"]

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Laptop":
        return Laptop
      case "Desktop":
        return Monitor
      case "Mobile":
      case "Smartphone":
        return Smartphone
      case "Tablet":
        return Tablet
      default:
        return Package
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "Allocated":
      case "Assigned":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Under Repair":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "Retired":
        return "bg-gray-100 text-gray-600 border-gray-200"
      default:
        return "bg-slate-100 text-slate-600 border-slate-200"
    }
  }

  const getDeviceTypeName = (deviceTypeId: string) => {
    const type = deviceTypes.find(t => t._id === deviceTypeId)
    return type?.type || 'Unknown'
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    fetchDevices(page)
  }

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === pagination.pages

  if (loading && devices.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading devices...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#1e4d7b] to-[#2563a8] bg-clip-text text-transparent mb-2">
            Devices
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage all hardware assets ({pagination.total || 0} total)
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/devices/add")}
          className="premium-gradient text-white w-full sm:w-auto flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Device
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by brand, model, serial or asset tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {deviceTypes.map((type) => (
                  <SelectItem key={type._id} value={type._id}>
                    {type.type} ({type.totalDevices})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Status" : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 lg:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setFilterType("all")
                  setFilterStatus("all")
                  fetchDevices(1)
                }}
                className="border-slate-300"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Devices</p>
                <p className="text-2xl font-bold text-foreground">{pagination.total || 0}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {devices.filter(d => d.status === 'Available').length}
                </p>
              </div>
              <Laptop className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned</p>
                <p className="text-2xl font-bold text-blue-600">
                  {devices.filter(d => d.status === 'Allocated').length}
                </p>
              </div>
              <Smartphone className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Under Repair</p>
                <p className="text-2xl font-bold text-amber-600">
                  {devices.filter(d => d.status === 'Under Repair').length}
                </p>
              </div>
              <Tablet className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Devices Grid */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>Device Inventory</span>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {pagination.pages || 1}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && devices.length === 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-12">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="glass-card animate-pulse">
                  <CardHeader className="space-y-2">
                    <div className="h-10 w-10 bg-slate-200 rounded-lg animate-pulse"></div>
                    <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-3 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No devices found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDevices.map((device) => {
                const Icon = getDeviceIcon(getDeviceTypeName(device.resourceType?._id || ''))
                return (
                  <Card
                    key={device.id}
                    className="glass-card cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-primary/50 group"
                    onClick={() => router.push(`/admin/devices/${device.id}`)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="h-12 w-12 rounded-xl bg-linear-to-r from-[#1e4d7b] to-[#3b82f6] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span
                          className={`text-xs px-3 py-1.5 rounded-full border font-medium ${getStatusColor(device.status)}`}
                        >
                          {device.status}
                        </span>
                      </div>
                      <CardTitle className="text-base sm:text-lg leading-tight mt-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {device.brand} {device.modelName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Type</span>
                          <span className="font-medium text-foreground">
                            {getDeviceTypeName(device.resourceType?._id || '')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Asset Tag</span>
                          <span className="font-mono text-xs bg-muted/20 px-2 py-1 rounded-md">
                            {device.assetTag}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Serial</span>
                          <span className="font-mono text-xs text-foreground truncate max-w-[120px]">
                            {device.serialNumber}
                          </span>
                        </div>
                        {device.warrantyStatus && (
                          <div className="flex justify-between items-center pt-2 mt-2 border-t border-border/50">
                            <span className="text-muted-foreground">Warranty</span>
                            <span
                              className={
                                device.warrantyStatus === "Valid"
                                  ? "text-emerald-600 font-medium"
                                  : "text-red-600 font-medium"
                              }
                            >
                              {device.warrantyStatus}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.pages && pagination.pages > 1 && (
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * (pagination.limit || 12)) + 1} to{' '}
                {Math.min(currentPage * (pagination.limit || 12), pagination.total || 0)} of{' '}
                {pagination.total || 0} devices
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={isFirstPage || loading}
                  className="border-slate-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={isLastPage || loading}
                  className="border-slate-300"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}