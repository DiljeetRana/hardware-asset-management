import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/connection";
import Allocation from "@/models/allocation";
import Resource from "@/models/resource";
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { resourceId, employeeId, assignedDate, notes } = body;

    if (!resourceId || !employeeId || !assignedDate) {
      return NextResponse.json(
        { error: "resourceId, employeeId and assignedDate are required" },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(resourceId) ||
      !mongoose.Types.ObjectId.isValid(employeeId)
    ) {
      return NextResponse.json(
        { error: "Invalid resourceId or employeeId" },
        { status: 400 }
      );
    }

    // ↓ Corrected field name
    const resDoc = await Resource.findByIdAndUpdate(
      resourceId,
      {
        $inc: { availableResourceCount: -1 },
        status: "Allocated",
      },
      { new: true }
    );

    if (!resDoc) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    // Check if count is going negative
    if (resDoc.availableResourceCount < 0) {

      // Roll back
      await Resource.findByIdAndUpdate(resourceId, {
        $inc: { availableResourceCount: 1 },
      });

      return NextResponse.json(
        { error: "No available units to allocate" },
        { status: 400 }
      );
    }

    const newAlloc = await Allocation.create({
      resource: resourceId,
      employee: employeeId,
      AllocatedDate: new Date(assignedDate),
      status: "Allocated",
      notes: notes || "",
    });

    const populatedAlloc = await Allocation.findById(newAlloc._id).populate(
      "employee"
    );

    return NextResponse.json(
      { success: true, allocation: populatedAlloc },
      { status: 201 }
    );

  } catch (err) {
    console.error("Error creating allocation:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}




export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const resourceId = req.nextUrl.searchParams.get("resourceId");

    if (!resourceId) {
      return NextResponse.json(
        { error: "resourceId is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return NextResponse.json(
        { error: "Invalid resourceId" },
        { status: 400 }
      );
    }

    const allocations = await Allocation.find({ resource: resourceId })
      .populate("employee")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { allocations },
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

