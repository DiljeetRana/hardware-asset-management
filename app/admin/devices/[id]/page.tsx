"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Trash2, UserPlus, UserMinus } from "lucide-react"
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
import { useDataStore } from "@/lib/hooks/use-data-store"

export default function DeviceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { devices, employees, getDevice, getDeviceAssignments, deleteDevice, updateDevice, isLoaded } = useDataStore()
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showUnassignModal, setShowUnassignModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const device = getDevice(params.id as string)
  const assignments = getDeviceAssignments(params.id as string)

  const enrichedAssignments = assignments.map((a) => {
    const employee = employees.find((e) => e.id === a.employeeId)
    return { ...a, employeeName: employee?.name || "Unknown" }
  })

  const currentAssignment = enrichedAssignments.find((a) => a.status === "Active")

  const handleDelete = () => {
    deleteDevice(params.id as string)
    toast({
      title: "Device Deleted",
      description: "The device has been removed from the system",
    })
    router.push("/admin/devices")
  }

  if (!isLoaded) {
    return (
      <div className="p-8">
        <p className="text-slate-400">Loading...</p>
      </div>
    )
  }

  if (!device) {
    return (
      <div className="p-8">
        <p className="text-slate-400">Device not found</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500/20 text-green-400 border-green-500/30"
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

  return (
    <div className="p-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Devices
      </Button>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">
              {device.brand} {device.modelName}
            </h1>
            <span className={`text-sm px-3 py-1 rounded border ${getStatusColor(device.status)}`}>{device.status}</span>
          </div>
          <p className="text-slate-400">{device.deviceType}</p>
        </div>
        <div className="flex gap-2">
          {device.status === "Available" && (
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAssignModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Device
            </Button>
          )}
          {device.status === "Assigned" && (
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => setShowUnassignModal(true)}>
              <UserMinus className="h-4 w-4 mr-2" />
              Unassign Device
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setShowEditModal(true)}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-950 bg-transparent">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-800 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  This will permanently delete this device from the system. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-700 text-white border-slate-600">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {device.status === "Assigned" && currentAssignment && (
        <Card className="bg-blue-500/10 border-blue-500/30 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-400 mb-1">Currently Assigned To</p>
                <p className="text-white font-semibold text-lg">{currentAssignment.employeeName}</p>
                <p className="text-slate-400 text-sm">
                  Since {new Date(currentAssignment.assignedDate).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/employees/${currentAssignment.employeeId}`)}
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
              >
                View Employee
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="logs">Assignment Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Device Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Device ID:</span>
                  <span className="text-white font-mono">{device.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Asset Tag:</span>
                  <span className="text-white font-mono">{device.assetTag}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Serial Number:</span>
                  <span className="text-white font-mono text-sm">{device.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Brand:</span>
                  <span className="text-white">{device.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Model:</span>
                  <span className="text-white">{device.modelName}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Purchase Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Purchase Date:</span>
                  <span className="text-white">{new Date(device.purchaseDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Purchase Cost:</span>
                  <span className="text-white">${device.purchaseCost?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vendor:</span>
                  <span className="text-white">{device.vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Warranty Status:</span>
                  <span className={device.warrantyStatus === "Valid" ? "text-green-400" : "text-red-400"}>
                    {device.warrantyStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Warranty Expiry:</span>
                  <span className="text-white">{new Date(device.warrantyExpiryDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {device.notes && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{device.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="specs">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {device.processor && (
                <div className="space-y-1">
                  <span className="text-slate-400 text-sm">Processor</span>
                  <p className="text-white">{device.processor}</p>
                </div>
              )}
              {device.ram && (
                <div className="space-y-1">
                  <span className="text-slate-400 text-sm">RAM</span>
                  <p className="text-white">{device.ram}</p>
                </div>
              )}
              {device.storage && (
                <div className="space-y-1">
                  <span className="text-slate-400 text-sm">Storage</span>
                  <p className="text-white">{device.storage}</p>
                </div>
              )}
              {device.graphics && (
                <div className="space-y-1">
                  <span className="text-slate-400 text-sm">Graphics</span>
                  <p className="text-white">{device.graphics}</p>
                </div>
              )}
              {device.os && (
                <div className="space-y-1">
                  <span className="text-slate-400 text-sm">Operating System</span>
                  <p className="text-white">{device.os}</p>
                </div>
              )}
              {device.imei && (
                <div className="space-y-1">
                  <span className="text-slate-400 text-sm">IMEI</span>
                  <p className="text-white font-mono">{device.imei}</p>
                </div>
              )}
              {device.accessories && (
                <div className="space-y-1">
                  <span className="text-slate-400 text-sm">Accessories</span>
                  <p className="text-white">{device.accessories}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Assignment History</CardTitle>
            </CardHeader>
            <CardContent>
              {enrichedAssignments.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No assignment history available</p>
              ) : (
                <div className="space-y-4">
                  {enrichedAssignments.map((assignment) => (
                    <div key={assignment.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-medium">{assignment.employeeName}</p>
                          <p className="text-sm text-slate-400">{assignment.employeeId}</p>
                        </div>
                        {assignment.status === "Active" && (
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                            Currently Assigned
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                        <div>
                          <span className="text-slate-500">Assigned:</span>
                          <p className="text-slate-300">{new Date(assignment.assignedDate).toLocaleDateString()}</p>
                        </div>
                        {assignment.returnedDate && (
                          <div>
                            <span className="text-slate-500">Returned:</span>
                            <p className="text-slate-300">{new Date(assignment.returnedDate).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                      {assignment.notes && <p className="text-sm text-slate-400 mt-2">{assignment.notes}</p>}
                    </div>
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
        onAssigned={() => {}}
      />

      <UnassignDeviceModal
        open={showUnassignModal}
        onOpenChange={setShowUnassignModal}
        device={device}
        assignment={currentAssignment}
        onUnassigned={() => {}}
      />

      <EditDeviceModal device={device} open={showEditModal} onOpenChange={setShowEditModal} onUpdate={updateDevice} />
    </div>
  )
}
