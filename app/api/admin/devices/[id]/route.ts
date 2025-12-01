import { NextResponse } from "next/server";
import connectDB from "@/lib/connection";
import Resource from "@/models/resource";
import mongoose from "mongoose";
import resourcetype from "@/models/resourcetype";

connectDB();

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    console.log("🔍 GET API HIT - ID:", id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Valid device ID is required" }, 
        { status: 400 }
      );
    }

    const device = await Resource.findOne({ 
      _id: id, 
      isDeleted: false 
    })
      .populate('resourceType', 'name description')
      .select('-__v')
      .lean();

    if (!device) {
      return NextResponse.json(
        { error: "Device not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      device: {
        id: device._id.toString(),
        _id: device._id.toString(),
        ...device
      }
    });

  } catch (error: any) {
    console.error("❌ Error fetching device:", error);
    return NextResponse.json(
      { error: "Failed to fetch device", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const body = await req.json();

    // ✅ COMPLETE DEBUG LOGS
    console.log("🔍=== PUT API DEBUG ===");
    console.log("🔍 Device ID:", id);
    console.log("📝 Raw request body:", body);
    console.log("🔍 ResourceType in body:", body.resourceType);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ Invalid device ID");
      return NextResponse.json(
        { error: "Valid device ID is required" },
        { status: 400 }
      );
    }

    if (!body) {
      console.log("❌ No request body");
      return NextResponse.json(
        { error: "Update data is required" },
        { status: 400 }
      );
    }

    // ✅ FIXED: Initialize updateData properly
    const updateData: any = {
      updatedAt: new Date(),
      ...body
    };

    // ✅ FIXED: Handle date fields safely
    if (body.purchaseDate && body.purchaseDate !== '') {
      try {
        updateData.purchaseDate = new Date(body.purchaseDate);
        if (isNaN(updateData.purchaseDate.getTime())) {
          delete updateData.purchaseDate;
        }
      } catch {
        delete updateData.purchaseDate;
      }
    }

    if (body.warrantyExpiryDate && body.warrantyExpiryDate !== '') {
      try {
        updateData.warrantyExpiryDate = new Date(body.warrantyExpiryDate);
        if (isNaN(updateData.warrantyExpiryDate.getTime())) {
          delete updateData.warrantyExpiryDate;
        }
      } catch {
        delete updateData.warrantyExpiryDate;
      }
    }

    // ✅ FIXED: Handle numeric fields safely
    if (body.purchaseCost !== undefined && body.purchaseCost !== '') {
      updateData.purchaseCost = Number(body.purchaseCost);
      if (isNaN(updateData.purchaseCost)) {
        updateData.purchaseCost = 0;
      }
    }

    // ✅ FIXED: Handle resourceType SAFELY (CRITICAL FIX)
    if (body.resourceType !== undefined) {
      console.log("🔧 Processing resourceType:", body.resourceType);
      
      // If resourceType is empty string or null, don't update it
      if (!body.resourceType || body.resourceType === '') {
        console.log("⚠️ Empty resourceType - skipping update");
        delete updateData.resourceType;
      } 
      // If resourceType is provided, validate it
      else if (mongoose.Types.ObjectId.isValid(body.resourceType)) {
        console.log("✅ Valid ObjectId for resourceType");
        try {
          // Verify resourceType exists
          const resourceType = await resourcetype.findById(body.resourceType);
          if (resourceType) {
            updateData.resourceType = new mongoose.Types.ObjectId(body.resourceType);
            console.log("✅ Valid resourceType found");
          } else {
            console.log("⚠️ ResourceType exists but invalid - keeping existing");
            delete updateData.resourceType;
          }
        } catch (error) {
          console.log("❌ ResourceType validation error:", error);
          delete updateData.resourceType;
        }
      } else {
        console.log("❌ Invalid resourceType format - skipping");
        delete updateData.resourceType;
      }
    }

    // ✅ FIXED: Remove undefined/empty values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || 
          updateData[key] === null || 
          updateData[key] === '' ||
          (typeof updateData[key] === 'string' && updateData[key].trim() === '')) {
        delete updateData[key];
      }
    });

    console.log("🔧 Final updateData:", updateData);

    // If no valid fields to update, return success
    if (Object.keys(updateData).length <= 1) { // Only updatedAt
      console.log("⚠️ No valid fields to update");
      const device = await Resource.findOne({ _id: id, isDeleted: false })
        .populate('resourceType', 'type description')
        .lean();
      
      return NextResponse.json({
        success: true,
        message: "No changes needed",
        device: device ? {
          id: device._id.toString(),
          _id: device._id.toString(),
          ...device
        } : null
      });
    }

    // ✅ FIXED: Update device
    const updatedDevice = await Resource.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('resourceType', 'type description')
      .select('-__v')
      .lean();

    if (!updatedDevice) {
      console.log("❌ Device not found for update");
      return NextResponse.json(
        { error: "Device not found or already deleted" },
        { status: 404 }
      );
    }

    console.log("✅ Device updated successfully!");
    console.log("✅ Updated device:", updatedDevice);

    return NextResponse.json({
      success: true,
      message: "Device updated successfully! ✅",
      device: {
        id: updatedDevice._id.toString(),
        _id: updatedDevice._id.toString(),
        ...updatedDevice
      }
    });

  } catch (error: any) {
    console.error("❌=== COMPLETE ERROR DEBUG ===");
    console.error("❌ Error name:", error.name);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      return NextResponse.json(
        { 
          error: `Device with this ${field === 'serialNumber' ? 'Serial Number' : 'Asset Tag'} already exists` 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to update device", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    console.log("🗑️ DELETE API HIT - ID:", id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ Invalid device ID for delete");
      return NextResponse.json(
        { 
          error: "Valid device ID is required",
          receivedId: id 
        },
        { status: 400 }
      );
    }

    // ✅ FIXED: Soft delete instead of hard delete
    const deletedDevice = await Resource.findOneAndUpdate(
      { 
        _id: id, 
        isDeleted: false 
      },
      { 
        $set: { 
          isDeleted: true,
          status: "Retired",
          updatedAt: new Date()
        } 
      },
      { 
        new: true 
      }
    );

    if (!deletedDevice) {
      console.log("❌ Device not found for delete");
      return NextResponse.json(
        { 
          error: "Device not found or already deleted" 
        },
        { status: 404 }
      );
    }

    console.log("✅ Device soft deleted successfully");
    
    return NextResponse.json({
      success: true,
      message: "Device deleted successfully! 🗑️",
      device: {
        id: deletedDevice._id.toString(),
        name: deletedDevice.name,
        status: deletedDevice.status,
        isDeleted: deletedDevice.isDeleted
      }
    });

  } catch (error: any) {
    console.error("❌ Error deleting device:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete device", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
