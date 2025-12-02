import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connection";
import mongoose from "mongoose";
import Allocation from "@/models/allocation";
import "@/models/resource"; 
import "@/models/employee"; 

connectDB();

export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Use the new Next.js 16 approach to extract params from the URL
    const { pathname } = new URL(req.url);
    const parts = pathname.split("/"); 
    // The last part is the dynamic ID
    const id = parts[parts.length - 1];
    console.log("RECEIVED ID:", id);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID missing in URL" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Employee ID" },
        { status: 400 }
      );
    }

    let allocations;
try {
  allocations = await Allocation.find({ employee: id })
    .populate("employee")
    .populate("resource");
    console.log("Allocations without populate:", allocations);
} catch (dbErr) {
  console.error("DB Query Error:", dbErr);
  return NextResponse.json({ success: false, message: "DB query failed" }, { status: 500 });
}


    return NextResponse.json({ success: true, data: allocations });
  } catch (err) {
    console.error("Allocation API error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}




// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/lib/connection";
// import mongoose from "mongoose";
// import Allocation from "@/models/allocation";
// connectDB();

// export async function GET(req: NextRequest, context: { params: { id: string } }) {
//   try {
//     // params is now available as a plain object (no Promise needed)
//     const id = context.params.id;
//     console.log("RECEIVED ID:", id);

//     if (!id) {
//       return NextResponse.json(
//         { success: false, message: "ID missing in URL" },
//         { status: 400 }
//       );
//     }

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, message: "Invalid Employee ID" },
//         { status: 400 }
//       );
//     }

//     const allocations = await Allocation.find({ employee: id })
//       .populate("employee")
//       .populate("resource");

//     return NextResponse.json({ success: true, data: allocations });
//   } catch (err) {
//     console.error("Allocation API error:", err);
//     return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
//   }
// }
