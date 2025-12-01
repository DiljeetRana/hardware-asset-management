"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Calendar, User, Laptop, ArrowRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AssignmentLogsPage() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [filteredAssignments, setFilteredAssignments] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const router = useRouter()
  const { toast } = useToast()

  // Fetch all assignments with employee and device populated
  const fetchAssignments = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/allocation-log")
      const data = await res.json()
      if (data.success) {
        setAssignments(data.allocations)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch assignment logs",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error fetching assignments:", err)
      toast({
        title: "Error",
        description: "Failed to fetch assignment logs",
        variant: "destructive",
      })
    }
  }, [toast])

  useEffect(() => {
    fetchAssignments()
  }, [fetchAssignments])

  // Enrich assignments for easier rendering
  const enrichedAssignments = useMemo(() => {
    return assignments
      .map((a) => ({
        ...a,
        device: a.resource,
        employee: a.employee,
        isActive: !a.returnDate,
        assignedDate: a.AllocatedDate,
      }))
      .sort(
        (a, b) =>
          new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime()
      )
  }, [assignments])

  useEffect(() => {
    applyFilters()
  }, [enrichedAssignments, searchTerm, filterStatus, filterType])

  const applyFilters = () => {
    let filtered = [...enrichedAssignments]

    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.device?.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.device?.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.device?.assetTag.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus === "active") filtered = filtered.filter((a) => a.isActive)
    else if (filterStatus === "returned") filtered = filtered.filter((a) => !a.isActive)

    if (filterType !== "all") filtered = filtered.filter((a) => a.device?.deviceType === filterType)

    setFilteredAssignments(filtered)
  }

  const getStatusBadge = (isActive: boolean) =>
    isActive ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-gray-100 text-gray-700 border-gray-200"

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignment Logs</h1>
        <p className="text-gray-600">Track all device assignments and returns</p>
      </div>

      <Card className="bg-white border-gray-200 mb-6 shadow-sm">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-gray-50 border-gray-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignments</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-gray-50 border-gray-200">
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
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <Card
            key={assignment._id}
            className="bg-white border-gray-200 hover:border-blue-300 transition-colors shadow-sm"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-gray-900 font-medium">{assignment.employee?.name || "Unknown Employee"}</p>
                        <p className="text-xs text-gray-500">{assignment.employee?.department}</p>
                      </div>
                    </div>

                    <ArrowRight className="h-4 w-4 text-gray-400" />

                    <div className="flex items-center gap-2">
                      <Laptop className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-gray-900 font-medium">{assignment.device?.brand} {assignment.device?.modelName}</p>
                        <p className="text-xs text-gray-500">{assignment.device?.assetTag}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-500">Assigned:</span>
                      <span className="text-gray-900">{new Date(assignment.assignedDate).toLocaleDateString()}</span>
                    </div>

                    {assignment.returnDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500">Returned:</span>
                        <span className="text-gray-900">{new Date(assignment.returnDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {assignment.notes && (
                    <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">{assignment.notes}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs px-2 py-1 rounded border ${getStatusBadge(assignment.isActive)}`}>
                    {assignment.isActive ? "Active" : "Returned"}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => router.push(`/admin/devices/${assignment.device._id}`)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View Device
                    </button>
                    <span className="text-gray-400">•</span>
                    <button
                      onClick={() => router.push(`/admin/employees/${assignment.employee._id}`)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View Employee
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAssignments.length === 0 && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No assignment logs found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
