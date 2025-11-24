"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Laptop, Smartphone, Monitor, Package, Calendar, History } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EmployeeDashboard() {
  const [userName, setUserName] = useState("")
  const [assignedDevices, setAssignedDevices] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalAssignments: 0,
    activeDevices: 0,
    returnedDevices: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Employee"
    const userId = localStorage.getItem("userId") || ""
    setUserName(name)

    // Load assigned devices
    const assignments = JSON.parse(localStorage.getItem("assignments") || "[]")
    const devices = JSON.parse(localStorage.getItem("devices") || "[]")

    const myAssignments = assignments.filter((a: any) => a.employeeId === userId)
    const activeAssignments = myAssignments.filter((a: any) => !a.returnDate)

    const myDevices = activeAssignments.map((a: any) => {
      const device = devices.find((d: any) => d.id === a.deviceId)
      return { ...device, assignedDate: a.assignedDate }
    })

    setAssignedDevices(myDevices)
    setStats({
      totalAssignments: myAssignments.length,
      activeDevices: activeAssignments.length,
      returnedDevices: myAssignments.length - activeAssignments.length,
    })
  }, [])

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Laptop":
        return Laptop
      case "Mobile":
        return Smartphone
      case "Desktop":
        return Monitor
      default:
        return Package
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#1e4d7b] to-[#2563a8] bg-clip-text text-transparent mb-2">
          Welcome, {userName}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 lg:mb-8">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Active Devices</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#1e4d7b] to-[#3b82f6] flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1e4d7b]">{stats.activeDevices}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently assigned</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Assignments</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{stats.totalAssignments}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="stat-card sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Returned</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <History className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-violet-600">{stats.returnedDevices}</div>
            <p className="text-xs text-muted-foreground mt-1">Past devices</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="text-foreground">Currently Assigned Devices</CardTitle>
          <CardDescription>Devices currently in your possession</CardDescription>
        </CardHeader>
        <CardContent>
          {assignedDevices.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No devices assigned to you yet</p>
              <p className="text-sm text-muted-foreground/70 mt-2">Contact your administrator if you need hardware</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assignedDevices.map((device) => {
                const Icon = getDeviceIcon(device.deviceType)
                return (
                  <div
                    key={device.id}
                    className="p-4 bg-gradient-to-br from-white to-slate-50 rounded-lg border border-slate-200 hover:border-[#1e4d7b]/50 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => router.push(`/employee/devices/${device.id}`)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#1e4d7b] to-[#3b82f6] flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {device.brand} {device.modelName}
                        </h3>
                        <p className="text-xs text-muted-foreground">{device.deviceType}</p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span>Asset: </span>
                      <span className="text-foreground font-mono">{device.assetTag}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button
              onClick={() => router.push("/employee/devices")}
              className="w-full text-left p-3 bg-gradient-to-r from-[#1e4d7b]/5 to-[#3b82f6]/5 hover:from-[#1e4d7b]/10 hover:to-[#3b82f6]/10 rounded-lg transition-colors border border-slate-200"
            >
              <p className="font-medium text-foreground">View All My Devices</p>
              <p className="text-sm text-muted-foreground">See details of assigned hardware</p>
            </button>
            <button
              onClick={() => router.push("/employee/history")}
              className="w-full text-left p-3 bg-gradient-to-r from-[#1e4d7b]/5 to-[#3b82f6]/5 hover:from-[#1e4d7b]/10 hover:to-[#3b82f6]/10 rounded-lg transition-colors border border-slate-200"
            >
              <p className="font-medium text-foreground">Assignment History</p>
              <p className="text-sm text-muted-foreground">View past device assignments</p>
            </button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-foreground">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground text-sm mb-4">
              For issues with your assigned devices or to request new hardware, please contact the IT support team.
            </p>
            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <p className="text-[#1e4d7b] font-medium text-sm">IT Support</p>
              <p className="text-muted-foreground text-sm">support@antheminfotech.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
