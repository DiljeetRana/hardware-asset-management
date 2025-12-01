import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connection";
import Allocation from "@/models/allocation";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get limit from query params, default to 5
    const limitParam = req.nextUrl.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : 5;

    const recentAssignments = await Allocation.find()
      .populate("employee")
      .populate("resource")
      .sort({ AllocatedDate: -1 }) // newest first
      .limit(limit);

    return NextResponse.json({ success: true, recentAssignments }, { status: 200 });
  } catch (err) {
    console.error("Error fetching recent assignments:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
