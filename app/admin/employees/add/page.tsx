"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import employee from "@/models/employee"

export default function AddEmployeePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthday:"",
    employeeCode:"",
    department: "",
    position: "",
    hireDate: "",
    status: "Active",
   
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    console.log(formData.hireDate)
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      employeeCode: formData.employeeCode,   // ✅ added
      birthday: formData.birthday,                     // ✅ added
      department: formData.department,
      position: formData.position,
     hireDate: formData.hireDate,
      status: formData.status || "Active ",
    }

    console.log("Sending employee data:", payload)

    const res = await fetch("/api/admin/employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || "Failed to create employee")
    }

    toast({
      title: "Employee Added",
      description: `${formData.name} has been added successfully`,
    })

    setTimeout(() => {
      router.push("/admin/employees")
    }, 1000)

  } catch (error: any) {
    console.error("Error adding employee:", error)
    toast({
      title: "Error",
      description: error.message || "Something went wrong",
      variant: "destructive",
    })
  } finally {
    setIsSubmitting(false)
  }
}

const departments = ["Engineering", "Design","Management", "Product", "Marketing", "Sales","Testing", "HR", "Finance", "Operations"];
const status=["Active", "Inactive"];
  return (
    <div className="p-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Employees
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Add New Employee</h1>
        <p className="text-slate-400">Register a new staff member</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="bg-slate-800 border-slate-700 max-w-2xl">
          <CardHeader>
            <CardTitle className="text-white">Employee Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-200">
                Full Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="bg-slate-900/50 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john.doe@antheminfotech.com"
                className="bg-slate-900/50 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-200">
                Phone Number *
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+1 (555) 123-4567"
                className="bg-slate-900/50 border-slate-600 text-white"
              />
            </div>




            {/*  Employee Code */}
  <div className="space-y-2">
    <Label htmlFor="employeeCode" className="text-slate-200">
      Employee Code *
    </Label>
    <Input
      id="employeeCode"
      name="employeeCode"
      value={formData.employeeCode}
      onChange={handleChange}
      required
      placeholder="e.g., 089"
      className="bg-slate-900/50 border-slate-600 text-white"
    />
  </div>

  {/*  birthday */}
  <div className="space-y-2">
    <Label htmlFor="birthday" className="text-slate-200">
      Date of Birth *
    </Label>
    <Input
      id="birthday"
      name="birthday"
      type="date"
      value={formData.birthday}
      onChange={handleChange}
      required
      className="bg-slate-900/50 border-slate-600 text-white"
    />
  </div>


            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="department" className="text-slate-200">
                  Department *
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange("department", value)}
                  required
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
    <SelectItem key={dept} value={dept}>
      {dept}
    </SelectItem>
  ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-slate-200">
                  Designation *
                </Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Senior Developer"
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hireDate" className="text-slate-200">
                 Hire Date *
                </Label>
                <Input
                  id="hireDate"
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleChange}
                  required
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-slate-200">
                  Status *
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)} required>
                  <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     {status.map((stat) => (
                                       <SelectItem key={stat} value={stat}>
                                         {stat}
                                       </SelectItem>
                                     ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6 max-w-2xl">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? "Adding Employee..." : "Add Employee"}
          </Button>
        </div>
      </form>
    </div>
  )
}
