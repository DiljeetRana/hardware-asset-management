import connectDB from "@/lib/connection";
import mongoose from "mongoose";
import ResourceType from "@/models/resourcetype";
import Resource from "@/models/resource";
import { NextResponse } from "next/server";
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    console.log("PARAM ID =", id);

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
