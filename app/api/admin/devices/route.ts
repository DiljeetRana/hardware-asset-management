import { NextResponse } from "next/server";
import connectDB from "@/lib/connection";
import Resource from "@/models/resource";
import mongoose from "mongoose";
import Resourcetype from "@/models/resourcetype";

connectDB();

interface DeviceQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  deviceType?: string;
  sortBy?: string;
  sortOrder?: string;
}

// ✅ GET: Get all devices with pagination, search, filter
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const deviceType = searchParams.get('deviceType') || '';

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter
    const filter: any = { isDeleted: false };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { modelName: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } },
        { assetTag: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (deviceType) {
      filter.resourceType = deviceType;
    }

    // Get total count
    const total = await Resource.countDocuments(filter);

    // Get devices
    const devices = await Resource.find(filter)
      .populate('resourceType', 'type description')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Format response
    const formattedDevices = devices.map(device => ({
      id: device._id,
      name: device.name,
      brand: device.brand,
      modelName: device.modelName,
      serialNumber: device.serialNumber,
      assetTag: device.assetTag,
      status: device.status,
      purchaseCost: device.purchaseCost,
      purchaseDate: device.purchaseDate,
      warrantyStatus: device.warrantyStatus,
      warrantyExpiryDate: device.warrantyExpiryDate,
      availableResourceCount: device.availableResourceCount,
      totalResourceCount: device.totalResourceCount,
      resourceType: device.resourceType,
      images: device.images || [],
      createdAt: device.createdAt,
      updatedAt: device.updatedAt
    }));

    return NextResponse.json({
      success: true,
      devices: formattedDevices,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });

  } catch (error: any) {
    console.error("❌ Error fetching devices:", error);
    return NextResponse.json(
      { error: "Failed to fetch devices", details: error.message },
      { status: 500 }
    );
  }
}

// ✅ POST: Create new device
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 Received body:", body);

    const { 
      deviceType, 
      brand, 
      modelName, 
      serialNumber, 
      assetTag, 
      purchaseDate, 
      purchaseCost, 
      vendorName, 
      warrantyExpiryDate, 
      warrantyStatus,
      status = "Available",
      images = [],
      ...otherFields 
    } = body;

    // ✅ Comprehensive validation
    if (!deviceType || !brand || !modelName || !serialNumber || !assetTag || 
        !purchaseDate || !purchaseCost || !vendorName || !warrantyExpiryDate || !warrantyStatus) {
      return NextResponse.json(
        { 
          error: "Missing required fields",
          required: [
            "deviceType", "brand", "modelName", "serialNumber", "assetTag", 
            "purchaseDate", "purchaseCost", "vendorName", "warrantyExpiryDate", "warrantyStatus"
          ]
        },
        { status: 400 }
      );
    }

    // ✅ VALIDATE AND FIND ResourceType (Fixed import issue)
    let resourceTypeId: mongoose.Types.ObjectId;
    
    if (mongoose.Types.ObjectId.isValid(deviceType)) {
      resourceTypeId = new mongoose.Types.ObjectId(deviceType);
      
      const resourceType = await Resourcetype.findById(resourceTypeId);
      if (!resourceType) {
        return NextResponse.json(
          { error: "Invalid device type selected" },
          { status: 400 }
        );
      }
    } else {
      const resourceType = await ResourceType.findOne({ type: deviceType });
      if (!resourceType) {
        return NextResponse.json(
          { error: `Device type "${deviceType}" not found` },
          { status: 400 }
        );
      }
      resourceTypeId = resourceType._id;
    }

    // ✅ Generate name
    const name = `${brand} ${modelName}`.trim();

    // ✅ Process images
    let processedImages: any[] = [];
    if (images && Array.isArray(images) && images.length > 0) {
      processedImages = images.map((image: any, index: number) => ({
        url: typeof image === 'string' ? image : image.url || '',
        public_id: `device_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`
      }));
    }

    // ✅ Create resource
    const newResource = new Resource({
      name,
      resourceType: resourceTypeId,
      purchaseDate: new Date(purchaseDate),
      warrantyExpiryDate: new Date(warrantyExpiryDate),
      purchaseCost: Number(purchaseCost),
      brand: brand.trim(),
      modelName: modelName.trim(),
      serialNumber: serialNumber.trim(),
      assetTag: assetTag.trim(),
      vendorName: vendorName.trim(),
      warrantyStatus,
      status,
      totalResourceCount: 1,
      availableResourceCount: 1,
      images: processedImages,
      
      // Optional fields
      ...(otherFields.processor && otherFields.processor.trim() && { processor: otherFields.processor.trim() }),
      ...(otherFields.ram && otherFields.ram.trim() && { ram: otherFields.ram.trim() }),
      ...(otherFields.storage && otherFields.storage.trim() && { storage: otherFields.storage.trim() }),
      ...(otherFields.graphics && otherFields.graphics.trim() && { graphics: otherFields.graphics.trim() }),
      ...(otherFields.os && otherFields.os.trim() && { os: otherFields.os.trim() }),
      ...(otherFields.imei && otherFields.imei.trim() && { imei: otherFields.imei.trim() }),
      ...(otherFields.accessories && otherFields.accessories.trim() && { 
        accessories: otherFields.accessories.split(',').map((acc: string) => acc.trim()).filter(Boolean) 
      }),
      ...(otherFields.lastServiceDate && otherFields.lastServiceDate.trim() && { 
        lastServiceDate: new Date(otherFields.lastServiceDate) 
      }),
      ...(otherFields.notes && otherFields.notes.trim() && { notes: otherFields.notes.trim() }),
    });

    const savedResource = await newResource.save();

    return NextResponse.json(
      { 
        success: true,
        message: "Device added successfully! 🎉",
        device: {
          id: savedResource._id,
          name: savedResource.name,
          brand: savedResource.brand,
          modelName: savedResource.modelName,
          serialNumber: savedResource.serialNumber,
          assetTag: savedResource.assetTag,
          status: savedResource.status,
          resourceType: resourceTypeId
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("❌ Error adding device:", error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      return NextResponse.json(
        { 
          error: `Device with this ${field === 'serialNumber' ? 'Serial Number' : 'Asset Tag'} already exists`,
          field: field
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add device", details: error.message },
      { status: 500 }
    );
  }
}