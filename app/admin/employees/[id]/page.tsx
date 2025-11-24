"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Trash2, Mail, Phone, Calendar, Briefcase } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDataStore } from "@/lib/hooks/use-data-store"
import { EditEmployeeModal } from "@/components/edit-employee-modal"

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { employees, devices, getEmployee, getEmployeeAssignments, deleteEmployee, updateEmployee, isLoaded } =
    useDataStore()
  const [showEditModal, setShowEditModal] = useState(false)

  const employee = getEmployee(params.id as string)
  const assignments = getEmployeeAssignments(params.id as string)

  const enrichedAssignments = assignments.map((a) => {
    const device = devices.find((d) => d.id === a.deviceId)
    return { ...a, device }
  })

  const currentDevices = enrichedAssignments.filter((a) => a.status === "Active")

  const handleDelete = () => {
    deleteEmployee(params.id as string)
    toast({
      title: "Employee Deleted",
      description: "The employee has been removed from the system",
    })
    router.push("/admin/employees")
  }

  if (!isLoaded) {
    return (
      <div className="p-8">
        <p className="text-slate-400">Loading...</p>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="p-8">
        <p className="text-slate-400">Employee not found</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }

  return (
    <div className="p-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Employees
      </Button>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{employee.name}</h1>
            <span className={`text-sm px-3 py-1 rounded border ${getStatusColor(employee.status)}`}>
              {employee.status}
            </span>
          </div>
          <p className="text-slate-400">
            {employee.designation} • {employee.department}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowEditModal(true)}
            className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
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
                  This will permanently delete this employee from the system. This action cannot be undone.
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">Current Devices ({currentDevices.length})</TabsTrigger>
          <TabsTrigger value="history">Assignment History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-white">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="text-white">{employee.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-400">Department</p>
                    <p className="text-white">{employee.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-400">Date of Joining</p>
                    <p className="text-white">{new Date(employee.dateOfJoining).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4" />
                  <div>
                    <p className="text-xs text-slate-400">Employee ID</p>
                    <p className="text-white font-mono">{employee.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Currently Assigned Devices</CardTitle>
            </CardHeader>
            <CardContent>
              {currentDevices.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No devices currently assigned</p>
              ) : (
                <div className="space-y-4">
                  {currentDevices.map((assignment) => (
                    <div key={assignment.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium">
                            {assignment.device?.brand} {assignment.device?.modelName}
                          </p>
                          <p className="text-sm text-slate-400">{assignment.device?.deviceType}</p>
                          <p className="text-xs text-slate-500 mt-1 font-mono">{assignment.device?.assetTag}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Active</span>
                      </div>
                      <div className="mt-3 text-sm">
                        <span className="text-slate-500">Assigned on: </span>
                        <span className="text-slate-300">{new Date(assignment.assignedDate).toLocaleDateString()}</span>
                      </div>
                      {assignment.notes && <p className="text-sm text-slate-400 mt-2">{assignment.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Device Assignment History</CardTitle>
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
                          <p className="text-white font-medium">
                            {assignment.device?.brand} {assignment.device?.modelName}
                          </p>
                          <p className="text-sm text-slate-400">
                            {assignment.device?.deviceType} • {assignment.device?.assetTag}
                          </p>
                        </div>
                        {assignment.status === "Active" ? (
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                            Currently Assigned
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-slate-500/20 text-slate-400 rounded">Returned</span>
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

      <EditEmployeeModal
        employee={employee}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onUpdate={updateEmployee}
      />
    </div>
  )
}
