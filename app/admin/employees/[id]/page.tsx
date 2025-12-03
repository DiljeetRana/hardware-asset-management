"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Trash2, Mail, Phone, Calendar, Briefcase, Delete } from "lucide-react"
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
import { EditEmployeeModal } from "@/components/edit-employee-modal"

export interface Employee {
  _id: string
  id?: string
  name: string
  email: string
  phone: string
  employeeCode: string
  birthday: string
  department: string
  position: string
  hireDate: string
  status: string
}

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [currentDevices, setCurrentDevices] = useState<any[]>([])
  const [enrichedAssignments, setEnrichedAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const { toast } = useToast()

useEffect(() => {
    if (!params.id) {  // ✅ Changed from employeeCode to id
      console.error("No employee ID in params:", params)
      setLoading(false)
      return
    }
    console.log("API HIT - PARAM ID:", params.id)  // ✅ Changed log
    fetchEmployeeDetails();
    fetchEmployeeAssignments(params.id);
  }, [params.id])  // ✅ Changed dependency

  const fetchEmployeeDetails = async () => {
    const employeeId = params.id as string  // ✅ Changed from employeeCode to id
    console.log("🔍 Fetching employee with ID:", employeeId)
    
    if (!employeeId) {
      console.error("❌ Employee ID is undefined")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      // ✅ Changed API endpoint to use id instead of employeeCode
      const res = await fetch(`/api/admin/employee/${employeeId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      console.log("📊 Full API Response:", data)

      let employeeData = null
      
      if (data.employee) {
        employeeData = data.employee
      } else if (data._id) {
        employeeData = data
      } else {
        console.error("❌ No valid employee data found")
        toast({
          title: "Employee Not Found",
          description: `Employee with ID ${employeeId} not found`,
          variant: "destructive",
        })
        setEmployee(null)
        return
      }

      const mappedEmployee: Employee = {
        _id: employeeData._id || '',
        id: employeeData._id || '',  // ✅ This will be used for routing
        name: employeeData.name || '',
        email: employeeData.email || '',
        phone: employeeData.phone || '',
        employeeCode: employeeData.employeeCode || '',
        birthday: employeeData.birthday || '',
        department: employeeData.department || '',
        position: employeeData.position || '',
        hireDate: employeeData.hireDate || '',
        status: employeeData.status || 'Active'
      }

      console.log("✅ Employee mapped successfully:", mappedEmployee)
      setEmployee(mappedEmployee)

      toast({
        title: "Success",
        description: `Welcome, ${mappedEmployee.name}!`,
        duration: 2000
      })
    } catch (error: any) {
      console.error("❌ Error fetching employee details:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch employee details",
        variant: "destructive",
      })
      setEmployee(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployeeAssignments = async (employeeId: string) => {
    
  try {
    const res = await fetch(`/api/employee/allocation/${employeeId}`);
    const data = await res.json();
   console.log("assignmnet history:",data);
    if (!res.ok || !data.success) {
      console.error("Failed to load assignments");
      return;
    }

    const assignments = data.data; // array

    // Current devices → those with no returnDate
    const active = assignments.filter((a: any) => a.returnDate === null);

    // History → all assignments (including returned)
    const history = assignments;

    setCurrentDevices(active);
    setEnrichedAssignments(history);

    console.log("Active devices:", active);
    console.log("Assignment history:", history);

  } catch (error) {
    console.error("Error loading assignments:", error);
  }
};

const handleUpdate = async (_id: string, updates: Partial<Employee>) => {
    const res = await fetch(`/api/admin/employee/${_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })

    const data = await res.json()

    if (!res.ok) {
      toast({
        title: "Error",
        description: data.message,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Updated",
      description: "Employee updated successfully",
    })

    setShowEditModal(false)
    fetchEmployeeDetails(_id)
  }


  const handleDelete = async () => {
    if (!employee?._id) return
   
    try {
      // ✅ Using _id for delete API
      const res = await fetch(`api/admin/employee/${employee._id}`, {
        method: "DELETE",
      })
     
      if (res.ok) {
        toast({
          title: "Success",
          description: "Employee deleted successfully",
        })
        router.back()
      } else {
        throw new Error("Failed to delete employee")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      })
    }
  }

  const updateEmployee = () => {
    fetchEmployeeDetails()
    setShowEditModal(false)
  }

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            Loading employee details...
          </div>
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Employee Not Found</h2>
            <p className="text-slate-400 mb-6">
              The employee you're looking for doesn't exist or has been deleted.
            </p>
            <Button 
              onClick={() => router.push('/admin/employees')} 
              className="bg-slate-700 hover:bg-slate-600"
            >
              Back to Employees
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ✅ Rest of your JSX remains the same...
  return (
    <div className="p-8">
      {/* Your existing JSX code here - no changes needed */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Employees
      </Button>
      
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{employee.name}</h1>
            <span className={`text-sm px-3 py-1 rounded-full border font-medium ${getStatusColor(employee.status)}`}>
              {employee.status}
            </span>
          </div>
          <p className="text-slate-400">
            {employee.position} • {employee.department}
          </p>
          <p className="text-sm text-slate-500 mt-1 font-mono">
            ID: {employee.employeeCode}
          </p>
        </div>
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowEditModal(true)}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          {/* Action buttons */}
<div className="flex gap-2">
  {/* DELETE CONFIRMATION POPUP */}
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        variant="outline"
        className="border-slate-600 text-red-600 hover:bg-slate-800"
      >
        <Trash2 className="h-4 w-4 mr-2 text-red-600" />
        Delete
      </Button>
    </AlertDialogTrigger>

    <AlertDialogContent className="bg-slate-900 border-slate-700">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-red-400">Delete Employee?</AlertDialogTitle>
        <AlertDialogDescription className="text-slate-400">
          This action cannot be undone. This will permanently delete the employee record.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel className="bg-slate-800 text-white border-slate-700">
          Cancel
        </AlertDialogCancel>

        <AlertDialogAction
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</div>
        </div>
      </div>

      {/* Tabs and content - same as before */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">Current Devices ({currentDevices.length})</TabsTrigger>
          <TabsTrigger value="history">Assignment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg">
                  <Mail className="h-4 w-4 text-slate-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Email</p>
                    <p className="text-white truncate" title={employee.email}>
                      {employee.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg">
                  <Phone className="h-4 w-4 text-slate-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Phone</p>
                    <p className="text-white" title={employee.phone}>
                      {employee.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg">
                  <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Date of Birth</p>
                    <p className="text-white">
                      {employee.birthday ? new Date(employee.birthday).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg">
                  <Briefcase className="h-4 w-4 text-slate-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Department</p>
                    <p className="text-white font-medium">{employee.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg">
                  <div className="h-4 w-4 text-slate-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Position</p>
                    <p className="text-white font-medium">{employee.position}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg">
                  <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Date of Joining</p>
                    <p className="text-white">
                      {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg">
                  <div className="h-4 w-4 bg-blue-500/20 rounded flex items-center justify-center shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Employee ID</p>
                    <p className="text-white font-mono font-semibold text-sm">{employee.employeeCode}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Devices and History tabs - same as before */}
        {/* <TabsContent value="devices" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Currently Assigned Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No devices currently assigned</p>
                <p className="text-slate-500 mt-2">
                  This employee doesn't have any active device assignments.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
        <TabsContent value="devices" className="mt-6">
  <Card className="bg-slate-800 border-slate-700">
    <CardHeader>
      <CardTitle className="text-white">Currently Assigned Devices</CardTitle>
    </CardHeader>
    <CardContent>
      {currentDevices.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No devices currently assigned</p>
          <p className="text-slate-500 mt-2">
            This employee doesn't have any active device assignments.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentDevices.map((item: any) => (
            <div
              key={item._id}
              className="p-4 rounded-lg bg-slate-700 border border-slate-600"
            >
              <p className="text-white font-semibold">
                {item.resource?.name || "Unnamed Device"}
              </p>

              <p className="text-slate-400 text-sm">
                Serial: {item.resource?.serialNumber}
              </p>

              <p className="text-slate-400 text-sm mt-1">
                Allocated Date:{" "}
                {new Date(item.AllocatedDate).toLocaleDateString()}
              </p>

              <p className="text-green-400 font-medium mt-2">
                Status: {item.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>


        {/* <TabsContent value="history" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Device Assignment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No assignment history</p>
                <p className="text-slate-500 mt-2">
                  This employee has no device assignment history.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
        <TabsContent value="history" className="mt-6">
  <Card className="bg-slate-800 border-slate-700">
    <CardHeader>
      <CardTitle className="text-white">Device Assignment History</CardTitle>
    </CardHeader>

    <CardContent>
      {enrichedAssignments.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No assignment history</p>
          <p className="text-slate-500 mt-2">
            This employee has no device assignment history.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {enrichedAssignments.map((item: any) => (
            <div
              key={item._id}
              className="p-4 rounded-lg bg-slate-700 border border-slate-600"
            >
              <p className="text-white font-semibold">
                {item.resource?.name || "Unnamed Device"}
              </p>

              <p className="text-slate-400 text-sm">
                Serial: {item.resource?.serialNumber}
              </p>

              <p className="text-slate-400 text-sm mt-1">
                Allocated:{" "}
                {new Date(item.AllocatedDate).toLocaleDateString()}
              </p>

              <p className="text-slate-400 text-sm">
                Returned:{" "}
                {item.returnDate
                  ? new Date(item.returnDate).toLocaleDateString()
                  : "Not returned"}
              </p>

              <p
                className={`mt-2 font-medium ${
                  item.status === "Allocated"
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                Status: {item.status}
              </p>
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
        onUpdate={handleUpdate}
      />
    </div>
  )
}