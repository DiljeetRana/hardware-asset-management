"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  UserPlus, 
  UserMinus, 
  Loader2,
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  Package 
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AssignDeviceModal } from "@/components/assign-device-modal"
import { UnassignDeviceModal } from "@/components/unassign-device-modal"
import { EditDeviceModal } from "@/components/edit-device-modal"

interface Device {
  id: string
  _id: string
  name: string
  brand: string
  modelName: string
  serialNumber: string
  assetTag: string
  purchaseCost: number
  purchaseDate: string
  vendorName: string
  warrantyStatus: string
  warrantyExpiryDate: string
  status: string
  processor?: string
  ram?: string
  storage?: string
  graphics?: string
  os?: string
  imei?: string
  accessories?: string | string[]
  notes?: string
  images: any[]
  resourceType: {
    _id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}
export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  employeeCode: string
  dob: string
  department: string
  position: string
   hireDate: string
  status: string
}
interface Assignment {
  id: string
  employeeId: string
  employeeName: string
  assignedDate: string
  returnedDate?: string
  status: string
  notes?: string
}

export default function DeviceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  // States
  const [device, setDevice] = useState<Device | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  // Modal states
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showUnassignModal, setShowUnassignModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)




  // ✅ FIXED: getDeviceIcon function inside component
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

  // Fetch device details
  const fetchDevice = useCallback(async () => {
    if (!params.id) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/devices/${params.id}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      if (data.success && data.device) {
        console.log("fetched device details:",data.device)
        setDevice(data.device)
      } else {
        throw new Error("Device not found in response")
      }
    } catch (error) {
      console.error("Error fetching device:", error)
      toast({
        title: "Error",
        description: "Failed to load device details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [params.id, toast])



// Fetch assignments
const fetchAssignments = useCallback(async () => {
  if (!device?._id) {
    setAssignments([]);
    return;
  }
  try {
    const res = await fetch(`/api/admin/allocation?resourceId=${device._id}`);
    if (!res.ok) throw new Error("Failed to fetch assignments");
    const data = await res.json();
    // assume data.allocations is array
    const mapped: Assignment[] = data.allocations.map((a: any) => ({
      id: a._id,
      employeeId: a.employee._id,
      employeeName: a.employee.name,      // if you populated employee in backend
      assignedDate: a.AllocatedDate,
      returnedDate: a.returnDate,
      status: a.status,
      notes: a.notes,
    }));
    setAssignments(mapped);
    console.log("mapped assignments:",mapped);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    setAssignments([]);
  }
}, [device?._id]);

useEffect(() => {
  console.log("Assignments in parent:", assignments);
}, [assignments]);

const handleUpdateDevice = async (id: string, updates: any) => {
  try {
    const response = await fetch(`/api/admin/devices/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update device');
    }

    // Refresh data
    await fetchDevice();
    
    toast({
      title: "Success! ✅",
      description: "Device updated successfully",
    });
  } catch (error) {
    console.error('Error updating device:', error);
    throw error; // Re-throw to be caught by modal
  }
};

  // Delete device
const handleDelete = async () => {
  if (!device?._id) return

  try {
    setDeleting(true)
    
    // ✅ FIXED: Use correct API endpoint (plural 'devices')
    const response = await fetch(`/api/admin/devices/${device._id}`, {
      method: "DELETE",
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || result.message || "Failed to delete device")
    }
    
    toast({
      title: "Success! 🎉",
      description: "Device deleted successfully",
    })
    router.push("/admin/devices") // Redirect to devices list
  } catch (error) {
    console.error("Delete error:", error)
    toast({
      title: "Error! ❌",
      description: "Failed to delete device",
      variant: "destructive",
    })
  } finally {
    setDeleting(false)
  }
}

 
   // Combined refresh — fetch both device & assignments
  const refreshData = async () => {
    await fetchDevice()
    await fetchAssignments()
    // Optional: router.refresh(), if you have server components/data caching
    router.refresh()
  }

  // Initial load
  useEffect(() => {
    if (params.id) {
      fetchDevice()
      fetchAssignments()
    }
  }, [params.id, fetchDevice, fetchAssignments])

  const onAssigned = () => {
    refreshData();
  }

  const onUnassigned=()=>{
    refreshData();
  }
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-400">Loading device details...</p>
        </div>
      </div>
    )
  }

  if (!device) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center py-12">
          <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Device Not Found</h2>
          <p className="text-slate-400 mb-6">The device you're looking for doesn't exist.</p>
          <Button 
            onClick={() => router.push("/admin/devices")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Devices
          </Button>
        </div>
      </div>
    )
  }

  const enrichedAssignments = assignments.map((a) => ({
    ...a,
    employeeName: a.employeeName || "Unknown Employee"
  }))
const activeAssignment = assignments.find(a => a.status === "Allocated");
const currentAssignment = enrichedAssignments.find((a) => a.status === "Active")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Allocated":
      case "Assigned":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Under Repair":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Retired":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      case "Lost":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // ✅ FIXED: Proper JSX syntax for device icon
  const DeviceIcon = device.resourceType ? getDeviceIcon(device.resourceType.name) : Package

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Devices
      </Button>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Device Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full lg:w-auto">
          <div className="flex items-center gap-4">
            <div className="hidden sm:block p-3 bg-linear-to-br from-blue-500/20 to-indigo-500/20 rounded-xl">
              <div className="h-12 w-12 bg-linear-to-br from-[#1e4d7b] to-[#3b82f6] rounded-lg flex items-center justify-center">
                {/* ✅ FIXED: Correct JSX syntax */}
                <DeviceIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  {device.brand} {device.modelName}
                </h1>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(device.status)}`}>
                  {device.status}
                </span>
              </div>
              <p className="text-slate-400">
                {device.resourceType?.name || 'Unknown Type'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-start lg:justify-end">
          {device.status === "Available" && (
            <Button 
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              onClick={() => setShowAssignModal(true)}
            >
              <UserPlus className="h-4 w-4" />
              Assign Device
            </Button>
          )}
          {(device.status === "Allocated" || device.status === "Assigned") && (
            <Button 
              className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
              onClick={() => setShowUnassignModal(true)}
              
            >
              <UserMinus className="h-4 w-4" />
              Unassign Device
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setShowEditModal(true)}
            className="border-slate-600 text-slate-300 hover:bg-slate-800 flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Device
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="border-red-600 text-red-400 hover:bg-red-950/20 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Device
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-800 border-slate-700 max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Delete Device?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  This action cannot be undone. The device "{device.brand} {device.modelName}" 
                  will be permanently removed from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-700 text-white border-slate-600">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete} 
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Device"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Current Assignment Card */}
      {(device.status === "Allocated" || device.status === "Assigned") && currentAssignment && (
        <Card className="bg-linear-to-br from-blue-500/10 via-purple-500/5 to-indigo-500/10 border-blue-500/30 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-blue-400 font-medium">Currently Assigned To</p>
                  <p className="text-white font-semibold text-lg">{currentAssignment.employeeName}</p>
                  <p className="text-slate-400 text-sm">
                    Assigned on {formatDate(currentAssignment.assignedDate)}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 w-full sm:w-auto"
                onClick={() => router.push(`/admin/employees/${currentAssignment.employeeId}`)}
              >
                View Employee
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-800/80 backdrop-blur-sm border-slate-700/50 grid grid-cols-3">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700/50">Overview</TabsTrigger>
          <TabsTrigger value="specs" className="data-[state=active]:bg-slate-700/50">Specifications</TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-slate-700/50">Assignment Logs</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Device Information */}
            <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Device Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <span className="text-sm text-slate-400">Device ID</span>
                    <span className="text-white font-mono text-sm bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700/50">
                      {device._id}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <span className="text-sm text-slate-400">Asset Tag</span>
                    <span className="text-white font-mono font-semibold">{device.assetTag}</span>
                  </div>
                  <div className="space-y-3">
                    <span className="text-sm text-slate-400">Serial Number</span>
                    <span className="text-white font-mono">{device.serialNumber}</span>
                  </div>
                  <div className="space-y-3">
                    <span className="text-sm text-slate-400">Brand</span>
                    <span className="text-white font-semibold">{device.brand}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Information */}
            <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Purchase Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                    <span className="text-sm text-slate-400">Purchase Date</span>
                    <span className="text-white font-mono">{formatDate(device.purchaseDate)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                    <span className="text-sm text-slate-400">Purchase Cost</span>
                    <span className="text-white font-semibold">{formatCurrency(device.purchaseCost)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                    <span className="text-sm text-slate-400">Vendor</span>
                    <span className="text-white font-medium">{device.vendorName}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                    <span className="text-sm text-slate-400">Warranty Status</span>
                    <span className={device.warrantyStatus === "Valid" ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
                      {device.warrantyStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Warranty Expiry</span>
                    <span className="text-white font-mono">{formatDate(device.warrantyExpiryDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {device.notes && (
            <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Notes</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-300 whitespace-pre-wrap">{device.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Specifications Tab */}
        <TabsContent value="specs" className="mt-6">
          <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { key: 'processor', label: 'Processor', icon: '💻' },
                { key: 'ram', label: 'RAM', icon: '🧠' },
                { key: 'storage', label: 'Storage', icon: '💾' },
                { key: 'graphics', label: 'Graphics Card', icon: '🎮' },
                { key: 'os', label: 'Operating System', icon: '🖥️' },
                { key: 'imei', label: 'IMEI', icon: '📱' }
              ].map(({ key, label, icon }) => {
                const value = device[key as keyof Device]
                if (!value || (typeof value === 'string' && !value.trim())) return null
                
                return (
                  <div key={key} className="space-y-2">
                    <span className="text-sm text-slate-400 flex items-center gap-2">
                      <span>{icon}</span>
                      {label}
                    </span>
                    <p className="text-white font-mono bg-slate-900/30 px-4 py-3 rounded-lg border border-slate-700/50">
                      {value}
                    </p>
                  </div>
                )
              })}
              
              {device.accessories && (
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <span className="text-sm text-slate-400 flex items-center gap-2">
                    <span>📦</span>
                    Accessories
                  </span>
                  <div className="bg-slate-900/30 px-4 py-3 rounded-lg border border-slate-700/50">
                    <p className="text-white">
                      {Array.isArray(device.accessories) 
                        ? device.accessories.join(', ') 
                        : device.accessories
                      }
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignment Logs Tab */}
        <TabsContent value="logs" className="mt-6">
          <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Assignment History</CardTitle>
            </CardHeader>
            <CardContent>
              {enrichedAssignments.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlus className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-400 mb-2">No Assignment History</h3>
                  <p className="text-sm text-slate-500">
                    This device has not been assigned to any employee yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrichedAssignments.map((assignment) => (
                    <Card 
                      key={assignment.id} 
                      className="bg-linear-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                              <UserPlus className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                              <p className="text-white font-semibold">{assignment.employeeName}</p>
                              <p className="text-sm text-slate-400">ID: {assignment.employeeId}</p>
                            </div>
                          </div>
                          <span 
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              assignment.status === "Active" 
                                ? "bg-green-500/20 text-green-400 border-green-500/30 border" 
                                : "bg-slate-500/20 text-slate-400 border-slate-500/30 border"
                            }`}
                          >
                            {assignment.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                          <div className="space-y-1">
                            <span className="text-slate-500">Assigned Date</span>
                            <p className="text-white font-mono">{formatDate(assignment.assignedDate)}</p>
                          </div>
                          {assignment.returnedDate && (
                            <div className="space-y-1">
                              <span className="text-slate-500">Returned Date</span>
                              <p className="text-white font-mono">{formatDate(assignment.returnedDate)}</p>
                            </div>
                          )}
                          {assignment.notes && (
                            <div className="md:col-span-2 lg:col-span-2 space-y-1">
                              <span className="text-slate-500">Notes</span>
                              <p className="text-slate-300 italic bg-slate-900/30 px-3 py-2 rounded-lg border border-slate-700/50">
                                {assignment.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AssignDeviceModal
        open={showAssignModal}
        onOpenChange={setShowAssignModal}
        device={device}
        onAssigned={onAssigned}
      />

      <UnassignDeviceModal
        open={showUnassignModal}
        onOpenChange={setShowUnassignModal}
        device={device}
          assignment={activeAssignment} 
        // assignment={currentAssignment}
        onUnassigned={onUnassigned}
      />
<EditDeviceModal
  device={device} 
  open={showEditModal} 
  onOpenChange={setShowEditModal} 
  onUpdate={handleUpdateDevice} 
/>
    </div>
  )
}