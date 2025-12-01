import connectDB from "@/lib/connection";
import mongoose from "mongoose";
import ResourceType from "@/models/resourcetype";
import Resource from "@/models/resource";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  console.log("PARAM ID =", id);
  try {
    await connectDB();

    // Check if exists BEFORE deleting
    const exists = await ResourceType.findById(id);
    console.log("FOUND RESOURCE TYPE =", exists);

    if (!exists) {
      return NextResponse.json(
        { error: "Device Type not found (pre-check)" },
        { status: 404 }
      );
    }

    // Check linked devices
    const linkedDevicesCount = await Resource.countDocuments({ resourceType: id });
    console.log("LINKED DEVICES COUNT =", linkedDevicesCount);

    if (linkedDevicesCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete. Devices exist under this type." },
        { status: 400 }
      );
    }

    // Delete the device type
    const deleted = await ResourceType.findByIdAndDelete(id);
    console.log("DELETED =", deleted);

    return NextResponse.json(
      { message: "Device Type deleted successfully", id },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error deleting device type:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    await connectDB();

    const body = await req.json();
    const { name, description } = body;

    const updated = await ResourceType.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Device type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Device type updated successfully", updated },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
