"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Users, Mail, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
export default function EmployeesPage() {
   const { toast } = useToast()
   const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const router = useRouter()


 const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/admin/employee")
        if (!res.ok) throw new Error("Failed to fetch device types")
        const data: Employee[] = await res.json()
      
      console.log("Fetched employees:", data);
        setEmployees(data)
      } catch (error) {
        console.error(error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        })
      }
    }

  // Fetch device types with counts
  useEffect(() => {
    fetchEmployees()
  }, [])


  useEffect(() => {
    applyFilters()
  }, [employees, searchTerm, filterDepartment, filterStatus])

  const applyFilters = () => {
    let filtered = [...employees]

    if (searchTerm) {
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
           e.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.department.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterDepartment !== "all") {
      filtered = filtered.filter((e) => e.department === filterDepartment)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((e) => e.status === filterStatus)
    }

    setFilteredEmployees(filtered)
  }


  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-gray-100 text-gray-600 border-gray-200"
  }

  const departments = ["Engineering", "Design","Management", "Product", "Marketing", "Sales", "Testing","HR", "Finance", "Operations"];
const status=["Active", "Inactive"];
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#1e4d7b] to-[#2563a8] bg-clip-text text-transparent mb-2">
            Employees
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage staff members and assignments</p>
        </div>
        <Button
          onClick={() => router.push("/admin/employees/add")}
          className="premium-gradient text-white w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <Card className="glass-card mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
               {departments.map((dept) => (
                   <SelectItem key={dept} value={dept}>
                     {dept}
                   </SelectItem>
                 ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {status.map((stat) => (
                                                       <SelectItem key={stat} value={stat}>
                                                         {stat}
                                                       </SelectItem>
                                                     ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.map((employee) => (
          <Card
            key={employee.id}
            className="glass-card cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-primary/50"
            onClick={() => router.push(`/admin/employees/${employee.id}`)}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-[#1e4d7b] to-[#3b82f6] flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusColor(employee.status)}`}
                >
                  {employee.status}
                </span>
              </div>
              <CardTitle className="text-base sm:text-lg text-foreground">{employee.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{employee.position}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground truncate">{employee.email|| "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{employee.phone||"N/A"}</span>
                </div>
                <div className="flex justify-between pt-2 mt-2 border-t">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="text-foreground font-medium">{employee.department||"N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employee ID:</span>
                  <span className="text-foreground font-mono text-xs">{employee.employeeCode|| "N/A"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No employees found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
