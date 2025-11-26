import connectDB from "@/lib/connection";
import Employee from "@/models/employee";
import Resource from "@/models/resource";
import ResourceType from "@/models/resourcetype";
import Allocation from "@/models/allocation";   // your allocation model
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Total Employees
    const totalEmployees = await Employee.countDocuments();
    // Count Active employees
    const activeEmployees = await Employee.countDocuments({ status: "Active" });


    // Total Devices
    const totalDevicesAgg = await Resource.aggregate([
      { $group: { _id: null, total: { $sum: "$totalResourceCount" } } },
    ]);
    const totalDevices = totalDevicesAgg[0]?.total || 0;

    // Available Devices
    const availableDevicesAgg = await Resource.aggregate([
      { $group: { _id: null, total: { $sum: "$avaliableResourceCount" } } },
    ]);
    const availableDevices = availableDevicesAgg[0]?.total || 0;

    // Assigned Devices
    const assignedDevices = totalDevices - availableDevices;

    // Devices by Type
    const devicesByType = await Resource.aggregate([
      {
        $group: { 
          _id: "$resourceType",
          count: { $sum: "$totalResourceCount" }
        }
      },
      {
        $lookup: {
          from: "resourcetypes",
          localField: "_id",
          foreignField: "_id",
          as: "type"
        }
      },
      { $unwind: "$type" },
      {
        $project: {
          _id: 0,
          type: "$type.name",
          count: 1
        }
      }
    ]);

    // 🔵 EMPLOYEE DETAILS WITH ACTIVE ALLOCATIONS (status = "Allocated")
    const employeeDetails = await Employee.aggregate([
      {
        $lookup: {
          from: "allocations",       // collection name
          localField: "_id",
          foreignField: "employee",
          as: "allocations"
        }
      },
      {
        $addFields: {
          assignedDevices: {
            $size: {
              $filter: {
                input: "$allocations",
                as: "a",
                cond: { $eq: ["$$a.status", "Allocated"] }
              }
            }
          }
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          department: 1,
          status: 1,
          assignedDevices: 1
        }
      }
    ]);

    return NextResponse.json({
      totalEmployees,
      activeEmployees,
      totalDevices,
      availableDevices,
      assignedDevices,
      devicesByType,
      employeeDetails,
    });

  } catch (error) {
    console.error("Dashboard data error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



// // app/api/admin/dashboarddata/route.ts
// import connectDB from "@/lib/connection";
// import Employee from "@/models/employee";
// import Resource from "@/models/resource";
// import ResourceType from "@/models/resourcetype";
// import Allocation from "@/models/allocation"; 
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await connectDB();

//     // Total Employees
//     const totalEmployees = await Employee.countDocuments();

//     // Total Devices
//     const totalDevicesAgg = await Resource.aggregate([
//       {
//         $group: {
//           _id: null,
//           total: { $sum: "$totalResourceCount" },
//         },
//       },
//     ]);
//     const totalDevices = totalDevicesAgg[0]?.total || 0;

//     // Available Devices
//     const availableDevicesAgg = await Resource.aggregate([
//       {
//         $group: {
//           _id: null,
//           total: { $sum: "$avaliableResourceCount" },
//         },
//       },
//     ]);
//     const availableDevices = availableDevicesAgg[0]?.total || 0;

//     // Assigned Devices = total - available
//     const assignedDevices = totalDevices - availableDevices;

//     // Devices by Type (Laptop, Phone, etc.)
//     const devicesByType = await Resource.aggregate([
//       {
//         $group: {
//           _id: "$resourceType",
//           count: { $sum: "$totalResourceCount" },
//         },
//       },
//       {
//         $lookup: {
//           from: "resourcetypes",
//           localField: "_id",
//           foreignField: "_id",
//           as: "type",
//         },
//       },
//       { $unwind: "$type" },
//       {
//         $project: {
//           _id: 0,
//           type: "$type.name",
//           count: 1,
//         },
//       },
//     ]);

//     return NextResponse.json({
//       totalEmployees,
//       totalDevices,
//       availableDevices,
//       assignedDevices,
//       devicesByType,
//     });
//   } catch (error) {
//     console.error("Dashboard data error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
