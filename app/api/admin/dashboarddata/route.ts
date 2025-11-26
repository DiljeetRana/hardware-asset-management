// app/api/admin/dashboarddata/route.ts
import connectDB from "@/lib/connection";
import Employee from "@/lib/models/employee";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const totalEmployees = await Employee.countDocuments();

    return NextResponse.json({
      
      totalEmployees,
    });
  } catch (error: unknown) {
    console.error("Dashboard data error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
