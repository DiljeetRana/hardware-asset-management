"use client";

import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/context/authcontext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || role !== "employee") {
        router.push("/login"); // redirect if not employee
      }
    }
  }, [user, role, loading, router]);

  if (loading || !user) return <p>Loading...</p>;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-900">
        <AppSidebar role="employee" />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}


// import type React from "react"
// import { SidebarProvider } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/app-sidebar"

// export default function EmployeeLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen w-full bg-slate-900">
//         <AppSidebar role="employee" />
//         <main className="flex-1 overflow-y-auto">{children}</main>
//       </div>
//     </SidebarProvider>
//   )
// }
