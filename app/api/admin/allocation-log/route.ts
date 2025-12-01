import { NextResponse } from "next/server";
import connectDB from "@/lib/connection";
import Allocation from "@/models/allocation";

export async function GET() {
  try {
    await connectDB();

    // Fetch all allocations and populate employee & resource
    const allocations = await Allocation.find()
      .populate("employee")   // populate employee details
      .populate("resource")   // populate device/resource details
      .sort({ AllocatedDate: -1 }); // sort latest first

    return NextResponse.json(
      { success: true, allocations },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching allocations:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
