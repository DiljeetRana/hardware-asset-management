"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Laptop, Monitor, Smartphone, Tablet, Package } from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDataStore } from "@/lib/hooks/use-data-store"

export default function DevicesPage() {
  const { devices, isLoaded } = useDataStore()
  const [filteredDevices, setFilteredDevices] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const router = useRouter()

  useEffect(() => {
    applyFilters()
  }, [devices, searchTerm, filterType, filterStatus])

  const applyFilters = () => {
    let filtered = [...devices]

    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.assetTag.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterType !== "all") {
      filtered = filtered.filter((d) => d.deviceType === filterType)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((d) => d.status === filterStatus)
    }

    setFilteredDevices(filtered)
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Laptop":
        return Laptop
      case "Desktop":
        return Monitor
      case "Mobile":
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
      case "Assigned":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Under Repair":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "Retired":
        return "bg-gray-100 text-gray-600 border-gray-200"
      case "Lost":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-slate-100 text-slate-600 border-slate-200"
    }
  }

  if (!isLoaded) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <p className="text-muted-foreground">Loading devices...</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#1e4d7b] to-[#2563a8] bg-clip-text text-transparent mb-2">
            Devices
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage all hardware assets</p>
        </div>
        <Button
          onClick={() => router.push("/admin/devices/add")}
          className="premium-gradient text-white w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </Button>
      </div>

      <Card className="glass-card mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search devices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Device Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Laptop">Laptop</SelectItem>
                <SelectItem value="Desktop">Desktop</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
                <SelectItem value="Tablet">Tablet</SelectItem>
                <SelectItem value="Peripheral">Peripheral</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Assigned">Assigned</SelectItem>
                <SelectItem value="Under Repair">Under Repair</SelectItem>
                <SelectItem value="Retired">Retired</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDevices.map((device) => {
          const Icon = getDeviceIcon(device.deviceType)
          return (
            <Card
              key={device.id}
              className="glass-card cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-primary/50"
              onClick={() => router.push(`/admin/devices/${device.id}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#1e4d7b] to-[#3b82f6] flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusColor(device.status)}`}
                  >
                    {device.status}
                  </span>
                </div>
                <CardTitle className="text-base sm:text-lg text-foreground">
                  {device.brand} {device.modelName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="text-foreground font-medium">{device.deviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Asset Tag:</span>
                    <span className="text-foreground font-mono text-xs">{device.assetTag}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Serial:</span>
                    <span className="text-foreground font-mono text-xs truncate max-w-[150px]">
                      {device.serialNumber}
                    </span>
                  </div>
                  {device.warrantyStatus && (
                    <div className="flex justify-between pt-2 mt-2 border-t">
                      <span className="text-muted-foreground">Warranty:</span>
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

      {filteredDevices.length === 0 && (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No devices found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
