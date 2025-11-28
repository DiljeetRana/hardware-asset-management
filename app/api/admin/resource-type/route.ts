import Resource from "@/models/resource";
import ResourceType from "@/models/resourcetype";
import  connectDB  from "@/lib/connection";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const typeCounts = await ResourceType.aggregate([
      {
        $lookup: {
          from: "resources",
          localField: "_id",
          foreignField: "resourceType",
          as: "resources",
        },
      },
      {
        $project: {
          _id: 1,
          type: "$name",
          description: 1,
          totalDevices: { $sum: "$resources.totalResourceCount" }, // will be 0 if no resources
        },
      },
    ]);

    return new Response(JSON.stringify(typeCounts));
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}


// POST /api/admin/device-types
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Device type name is required" }, { status: 400 });
    }

    // Check if already exists
    const existing = await ResourceType.findOne({ name });
    if (existing) {
      return NextResponse.json({ error: "Device type already exists" }, { status: 400 });
    }

    const newType = await ResourceType.create({ name, description });
    return NextResponse.json({ message: "Device type added", deviceType: newType });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


