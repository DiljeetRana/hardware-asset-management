"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Laptop, Users, Package, AlertCircle, TrendingUp, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalDevices: 0,
    availableDevices: 0,
    totalEmployees: 0,
    assignedDevices: 0,
    activeEmployees: 0,
    underRepair: 0,
  })
  const [recentAssignments, setRecentAssignments] = useState<any[]>([])
  const [devicesByType, setDevicesByType] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

const loadDashboardData = async () => {
  try {
    const res = await fetch("/api/admin/dashboarddata", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return;

    const data = await res.json();

    setStats({
      totalDevices: data.totalDevices,
      availableDevices: data.availableDevices,
      totalEmployees: data.totalEmployees,
      assignedDevices: data.assignedDevices,
      activeEmployees: data.activeEmployees,
      underRepair: data.underRepair,
    });

    // setRecentAssignments(data.recentAssignments);
    setDevicesByType(data.devicesByType);
  } catch (error) {
    console.error("Dashboard API Error:", error);
  }
};


  const statCards = [
    {
      title: "Total Devices",
      value: stats.totalDevices,
      icon: Package,
      description: "All hardware assets",
      gradient: "from-[#005A9C] to-[#0077CC]",
      link: "/admin/devices",
    },
    {
      title: "Available",
      value: stats.availableDevices,
      icon: Laptop,
      description: "Ready for assignment",
      gradient: "from-emerald-500 to-teal-500",
      link: "/admin/devices",
    },
    {
      title: "Assigned",
      value: stats.assignedDevices,
      icon: TrendingUp,
      description: "Currently in use",
      gradient: "from-orange-500 to-amber-500",
      link: "/admin/logs",
    },
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: Users,
      description: `${stats.activeEmployees} active`,
      gradient: "from-purple-500 to-pink-500",
      link: "/admin/employees",
    },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-linear-to-br from-blue-50/50 via-white to-slate-50/50 min-h-screen">
      <div className="mb-6 lg:mb-8 animate-slide-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl anthem-gradient flex items-center justify-center shadow-lg animate-pulse">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#005A9C]">Dashboard</h1>
        </div>
        <p className="text-slate-600">Welcome back to Anthem InfoTech Asset Management System</p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 lg:mb-8">
        {statCards.map((stat, index) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden bg-white border-2 border-slate-200/60 hover:border-[#005A9C]/50 hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer group animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => router.push(stat.link)}
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${stat.gradient}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700">{stat.title}</CardTitle>
              <div
                className={`h-11 w-11 rounded-xl bg-linear-to-br ${stat.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl sm:text-4xl font-bold text-[#005A9C]">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1 font-medium">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.underRepair > 0 && (
        <Card className="bg-linear-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 mb-6 shadow-md">
          <CardContent className="py-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-amber-900 font-semibold">
                {stats.underRepair} device{stats.underRepair > 1 ? "s" : ""} under repair
              </p>
              <p className="text-amber-700 text-sm">Requires attention from IT team</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="glass-card border-2">
          <CardHeader>
            <CardTitle className="text-[#1e4d7b] flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#1e4d7b] animate-pulse" />
              Recent Assignments
            </CardTitle>
            <CardDescription className="text-slate-600">Latest device assignments</CardDescription>
          </CardHeader>
          <CardContent>
            {recentAssignments.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No recent assignments</p>
            ) : (
              <div className="space-y-3">
                {recentAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 bg-linear-to-r from-slate-50 to-blue-50/50 rounded-xl hover:shadow-md transition-all cursor-pointer border border-slate-200/50"
                    onClick={() => router.push(`/admin/devices/${assignment.deviceId}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 font-semibold truncate">
                        {assignment.device?.brand} {assignment.device?.modelName}
                      </p>
                      <p className="text-sm text-slate-600">Assigned to {assignment.employee?.name}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-slate-500">{new Date(assignment.assignedDate).toLocaleDateString()}</p>
                      {!assignment.returnDate && (
                        <span className="text-xs px-2 py-1 bg-linear-to-r from-[#1e4d7b] to-[#2563a8] text-white rounded-full shadow-sm">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-2">
          <CardHeader>
            <CardTitle className="text-[#1e4d7b] flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#1e4d7b] animate-pulse" />
              Devices by Type
            </CardTitle>
            <CardDescription className="text-slate-600">Hardware distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {devicesByType.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No devices</p>
            ) : (
              <div className="space-y-4">
                {devicesByType.map((item: any) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">{item.type}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-linear-to-r from-[#1e4d7b] to-[#2563a8] rounded-full shadow-sm"
                          style={{
                            width: `${(item.count / stats.totalDevices) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-slate-900 font-bold w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card border-2">
          <CardHeader>
            <CardTitle className="text-[#1e4d7b] text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button
              onClick={() => router.push("/admin/devices/add")}
              className="w-full text-left p-4 bg-linear-to-r from-[#1e4d7b]/10 to-[#2563a8]/10 hover:from-[#1e4d7b]/20 hover:to-[#2563a8]/20 rounded-xl transition-all border border-[#1e4d7b]/20 hover:shadow-md"
            >
              <p className="font-semibold text-[#1e4d7b]">Add New Device</p>
              <p className="text-sm text-slate-600">Register hardware asset</p>
            </button>
            <button
              onClick={() => router.push("/admin/employees/add")}
              className="w-full text-left p-4 bg-linear-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all border border-purple-200 hover:shadow-md"
            >
              <p className="font-semibold text-purple-700">Add Employee</p>
              <p className="text-sm text-slate-600">Register staff member</p>
            </button>
            <button
              onClick={() => router.push("/admin/logs")}
              className="w-full text-left p-4 bg-linear-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-xl transition-all border border-slate-200 hover:shadow-md"
            >
              <p className="font-semibold text-slate-700">View Assignment Logs</p>
              <p className="text-sm text-slate-600">Track all assignments</p>
            </button>
          </CardContent>
        </Card>

        <Card className="glass-card border-2 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-[#1e4d7b] text-lg">System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-linear-to-br from-blue-50 to-slate-50 rounded-xl border border-slate-200/50">
                <p className="text-sm text-slate-600 mb-3 font-medium">Device Utilization</p>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-4xl font-bold text-[#1e4d7b]">
                    {stats.totalDevices > 0 ? Math.round((stats.assignedDevices / stats.totalDevices) * 100) : 0}
                  </span>
                  <span className="text-slate-600 mb-2 font-semibold">%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-linear-to-r from-[#1e4d7b] to-[#2563a8] rounded-full shadow-sm"
                    style={{
                      width: `${stats.totalDevices > 0 ? (stats.assignedDevices / stats.totalDevices) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/50">
                <p className="text-sm text-slate-600 mb-3 font-medium">Employee Activity</p>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-4xl font-bold text-emerald-600">
                    {stats.totalEmployees > 0 ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100) : 0}
                  </span>
                  <span className="text-slate-600 mb-2 font-semibold">%</span>
                </div>
                <div className="w-full h-3 bg-emerald-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-linear-to-r from-emerald-500 to-teal-500 rounded-full shadow-sm"
                    style={{
                      width: `${stats.totalEmployees > 0 ? (stats.activeEmployees / stats.totalEmployees) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="col-span-2 pt-4 border-t border-slate-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/50">
                    <p className="text-3xl font-bold text-emerald-600">{stats.availableDevices}</p>
                    <p className="text-xs text-slate-600 mt-1 font-medium">Available</p>
                  </div>
                  <div className="p-3 bg-linear-to-br from-blue-50 to-slate-50 rounded-xl border border-blue-200/50">
                    <p className="text-3xl font-bold text-[#1e4d7b]">{stats.assignedDevices}</p>
                    <p className="text-xs text-slate-600 mt-1 font-medium">Assigned</p>
                  </div>
                  <div className="p-3 bg-linear-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200/50">
                    <p className="text-3xl font-bold text-amber-600">{stats.underRepair}</p>
                    <p className="text-xs text-slate-600 mt-1 font-medium">Under Repair</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
