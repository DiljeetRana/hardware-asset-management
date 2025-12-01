"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Laptop, Smartphone, Monitor, Tablet, Package, Calendar, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDataStore } from "@/lib/hooks/use-data-store"

export default function EmployeeDevicesPage() {
  const [assignedDevices, setAssignedDevices] = useState<any[]>([])
  const { assignments, devices } = useDataStore()
  const router = useRouter()

  useEffect(() => {
    loadAssignedDevices()
  }, [assignments, devices])

  const loadAssignedDevices = () => {
    const userId = localStorage.getItem("userId") || ""
    const myAssignments = assignments.filter((a: any) => a.employeeId === userId && !a.returnDate)

    const myDevices = myAssignments.map((a: any) => {
      const device = devices.find((d: any) => d.id === a.deviceId)
      return { ...device, assignedDate: a.assignedDate, assignmentNotes: a.notes }
    })

    setAssignedDevices(myDevices)
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

  const getWarrantyColor = (status: string) => {
    return status === "Valid" ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Devices</h1>
        <p className="text-gray-600">View all devices currently assigned to you</p>
      </div>

      {assignedDevices.length === 0 ? (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No devices assigned to you yet</p>
            <p className="text-sm text-gray-400 mt-2">Contact your administrator if you need hardware</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignedDevices.map((device) => {
            const Icon = getDeviceIcon(device.deviceType)
            return (
              <Card
                key={device.id}
                className="bg-white border-gray-200 hover:border-blue-300 transition-colors cursor-pointer shadow-sm"
                onClick={() => router.push(`/employee/devices/${device.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded border border-green-200">
                      Active
                    </span>
                  </div>
                  <CardTitle className="text-gray-900 text-lg">
                    {device.brand} {device.modelName}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{device.deviceType}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">Assigned:</span>
                    <span className="text-gray-900">{new Date(device.assignedDate).toLocaleDateString()}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Asset Tag:</span>
                      <span className="text-gray-900 font-mono text-xs">{device.assetTag}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Serial:</span>
                      <span className="text-gray-900 font-mono text-xs">{device.serialNumber}</span>
                    </div>
                    {device.warrantyStatus && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Warranty:</span>
                        <span className={getWarrantyColor(device.warrantyStatus)}>{device.warrantyStatus}</span>
                      </div>
                    )}
                  </div>

                  {device.assignmentNotes && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-600">{device.assignmentNotes}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
