import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/connection";
import Employee from "@/models/employee"; 

connectDB();
export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    let token: string | null = null;

    if (cookieHeader) {
      const match = cookieHeader.match(/token=([^;]+)/);
      token = match ? match[1] : null;
    }

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decoded as any).id;

    // Fetch user from DB to get the name
    const user = await Employee.findById(userId).select("name role");
    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id,
      name: user.name, // ✅ include name
      role: user.role,
    });
  } catch (err) {
    console.error("Profile error:", err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}



// export async function GET(req: Request) {
//   try {
//     // Parse cookies manually from the request headers
//     const cookieHeader = req.headers.get("cookie"); // string | null
//     let token: string | null = null;

//     if (cookieHeader) {
//       const match = cookieHeader.match(/token=([^;]+)/);
//       token = match ? match[1] : null;
//     }

//     if (!token) {
//       return NextResponse.json({ user: null }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     return NextResponse.json({ id: (decoded as any).id, role: (decoded as any).role });
//   } catch (err) {
//     console.error("Profile error:", err);
//     return NextResponse.json({ user: null }, { status: 401 });
//   }
// }
