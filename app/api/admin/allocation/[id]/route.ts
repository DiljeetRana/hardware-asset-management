import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/connection";
import Allocation from "@/models/allocation";
import Resource from "@/models/resource";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: allocationId } = await context.params;
    console.log("allocation id:", allocationId);

    const body = await request.json();
    const { notes, returnDate, status } = body;

    if (!mongoose.Types.ObjectId.isValid(allocationId)) {
      return NextResponse.json(
        { error: "Invalid allocation ID" },
        { status: 400 }
      );
    }

    const allocation = await Allocation.findById(allocationId);

    if (!allocation) {
      return NextResponse.json(
        { error: "Allocation not found" },
        { status: 404 }
      );
    }

    // Prevent duplicate return updates
    if (allocation.status === "Returned") {
      return NextResponse.json(
        { error: "Device already returned!" },
        { status: 400 }
      );
    }

    // Update allocation
    allocation.status = status || "Returned";
    allocation.returnDate = returnDate ? new Date(returnDate) : new Date();
    allocation.notes = notes || allocation.notes;
    await allocation.save();

    // Update resource count
    await Resource.findByIdAndUpdate(allocation.resource, {
      $inc: { availableResourceCount: 1 },
      status: "Available",
    });

    return NextResponse.json(
      { success: true, message: "Device returned successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error returning device:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
