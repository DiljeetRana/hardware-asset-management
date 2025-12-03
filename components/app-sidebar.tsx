"use client"

import type * as React from "react"
import { LayoutDashboard, Laptop, Users, FileText, Settings, LogOut, Package, Tag } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: "admin" | "employee"
}

const adminNavItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Devices",
    url: "/admin/devices",
    icon: Laptop,
  },
  {
    title: "Device Types",
    url: "/admin/device-types",
    icon: Tag,
  },
  {
    title: "Employees",
    url: "/admin/employees",
    icon: Users,
  },
  {
    title: "Assignment Logs",
    url: "/admin/logs",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

const employeeNavItems = [
  {
    title: "Dashboard",
    url: "/employee/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Devices",
    url: "/employee/devices",
    icon: Package,
  },
  {
    title: "Assignment History",
    url: "/employee/history",
    icon: FileText,
  },
]

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const navItems = role === "admin" ? adminNavItems : employeeNavItems


  const handleLogout = async () => {
  try {
    // Call logout API to clear HTTP-only cookie
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include", // send cookie
    });

    // Optionally clear any client-side state (if any)
    // e.g., context user, role, etc.
    // setUser(null);
    // setRole(null);

    // Redirect to login
    router.push("/login");
  } catch (err) {
    console.error("Logout error:", err);
  }
};


  // const handleLogout = () => {
  //   localStorage.clear()
  //   router.push("/login")
  // }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-slate-200 p-4 bg-linear-to-br from-[#005A9C]/5 to-blue-50">
        <div className="flex items-center gap-3 mb-1 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-[#005A9C]/20 rounded-full blur-md opacity-50 animate-pulse" />
            <div className="relative h-12 w-12 rounded-full bg-white shadow-lg transform hover:scale-110 transition-all duration-300 hover:shadow-xl">
              <img src="/images/logo-icon.png" alt="Anthem InfoTech" className="h-full w-full object-contain" />
            </div>
          </div>
          <div>
            <p className="font-bold text-[#005A9C] text-sm leading-tight">Anthem InfoTech</p>
            <p className="text-xs text-slate-500 font-medium">
              {role === "admin" ? "Admin Portal" : "Employee Portal"}
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4 bg-linear-to-b from-transparent to-blue-50/30">
        <SidebarMenu>
          {navItems.map((item, index) => (
            <SidebarMenuItem
              key={item.title}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                className="hover:bg-[#005A9C]/10 data-[active=true]:anthem-gradient data-[active=true]:text-black data-[active=true]:shadow-md transition-all duration-300 mb-1 rounded-lg"
              >
                <a href={item.url} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-200 p-4 bg-slate-50/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="hover:bg-red-50 hover:text-red-600 transition-all duration-300 rounded-lg font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
