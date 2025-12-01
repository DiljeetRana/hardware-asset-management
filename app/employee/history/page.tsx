"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Laptop, Monitor, Smartphone, Tablet, Package } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDataStore } from "@/lib/hooks/use-data-store"

export default function EmployeeHistoryPage() {
  const [assignmentHistory, setAssignmentHistory] = useState<any[]>([])
  const { assignments, devices } = useDataStore()
  const router = useRouter()

  useEffect(() => {
    loadHistory()
  }, [assignments, devices])

  const loadHistory = () => {
    const userId = localStorage.getItem("userId") || ""
    const myAssignments = assignments.filter((a: any) => a.employeeId === userId)

    const enriched = myAssignments.map((a: any) => {
      const device = devices.find((d: any) => d.id === a.deviceId)
      return {
        ...a,
        device,
        isActive: !a.returnDate,
      }
    })

    enriched.sort((a: any, b: any) => new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime())

    setAssignmentHistory(enriched)
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

  const calculateDuration = (start: string, end: string | null) => {
    const startDate = new Date(start)
    const endDate = end ? new Date(end) : new Date()
    const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    if (days < 30) {
      return `${days} day${days !== 1 ? "s" : ""}`
    } else if (days < 365) {
      const months = Math.floor(days / 30)
      return `${months} month${months !== 1 ? "s" : ""}`
    } else {
      const years = Math.floor(days / 365)
      const months = Math.floor((days % 365) / 30)
      return `${years} year${years !== 1 ? "s" : ""}${months > 0 ? `, ${months} month${months !== 1 ? "s" : ""}` : ""}`
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignment History</h1>
        <p className="text-gray-600">View all devices assigned to you over time</p>
      </div>

      {assignmentHistory.length === 0 ? (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No assignment history available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignmentHistory.map((assignment) => {
            const Icon = getDeviceIcon(assignment.device?.deviceType)
            return (
              <Card
                key={assignment.id}
                className="bg-white border-gray-200 hover:border-blue-300 transition-colors shadow-sm"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-gray-900 font-semibold text-lg">
                            {assignment.device?.brand} {assignment.device?.modelName}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {assignment.device?.deviceType} • {assignment.device?.assetTag}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded border ${
                            assignment.isActive
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {assignment.isActive ? "Currently Assigned" : "Returned"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Assigned Date</p>
                            <p className="text-gray-900 text-sm">
                              {new Date(assignment.assignedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {assignment.returnDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Return Date</p>
                              <p className="text-gray-900 text-sm">
                                {new Date(assignment.returnDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="text-gray-900 text-sm">
                              {calculateDuration(assignment.assignedDate, assignment.returnDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {assignment.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{assignment.notes}</p>
                        </div>
                      )}

                      {assignment.isActive && (
                        <div className="mt-4">
                          <button
                            onClick={() => router.push(`/employee/devices/${assignment.device?.id}`)}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View Device Details →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Card className="bg-white border-gray-200 mt-6 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 text-lg">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Assignments</p>
              <p className="text-gray-900 text-2xl font-bold">{assignmentHistory.length}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Currently Active</p>
              <p className="text-gray-900 text-2xl font-bold">{assignmentHistory.filter((a) => a.isActive).length}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Returned</p>
              <p className="text-gray-900 text-2xl font-bold">{assignmentHistory.filter((a) => !a.isActive).length}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Device Types</p>
              <p className="text-gray-900 text-2xl font-bold">
                {new Set(assignmentHistory.map((a) => a.device?.deviceType)).size}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
