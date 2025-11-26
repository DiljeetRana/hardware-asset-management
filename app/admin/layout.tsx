"use client";

import { ReactNode, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/context/authcontext";
import { useRouter } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ⛔ Don't redirect until loading is finished
    if (loading) return;

    // ❌ No user or not admin → redirect
    if (!user || role !== "admin") {
      router.replace("/login");
    }

    // No else — let admin access the page
  }, [loading, user, role, router]);

  // ⏳ While loading, keep UI blank to avoid flicker
  if (loading) {
    return <p className="text-white">Loading...</p>;
  }

  // If not admin, don't briefly show the dashboard
  if (!user || role !== "admin") {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-900">
        <AppSidebar role="admin" />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}



// "use client";

// import type React from "react";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
// import { useAuth } from "@/context/authcontext";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user, role, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading) {
//       if (!user || role !== "admin") {
//         router.push("/login"); // redirect if not admin
//       }
//     }
//   }, [user, role, loading, router]);

//   if (loading || !user) return <p>Loading...</p>;

//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen w-full bg-slate-900">
//         <AppSidebar role="admin" />
//         <main className="flex-1 overflow-y-auto">{children}</main>
//       </div>
//     </SidebarProvider>
//   );
// }




// import type React from "react"
// import { SidebarProvider } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/app-sidebar"


// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen w-full bg-slate-900">
//         <AppSidebar role="admin" />
//         <main className="flex-1 overflow-y-auto">{children}</main>
//       </div>
//     </SidebarProvider>
//   )
// }
