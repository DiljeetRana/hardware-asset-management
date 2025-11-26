import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    // Parse cookies manually from the request headers
    const cookieHeader = req.headers.get("cookie"); // string | null
    let token: string | null = null;

    if (cookieHeader) {
      const match = cookieHeader.match(/token=([^;]+)/);
      token = match ? match[1] : null;
    }

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ id: (decoded as any).id, role: (decoded as any).role });
  } catch (err) {
    console.error("Profile error:", err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}


// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export async function GET(req: Request) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token) return NextResponse.json({ user: null }, { status: 401 });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     return NextResponse.json({ id: (decoded as any).id, role: (decoded as any).role });
//   } catch (err) {
//     console.error("Profile error:", err);
//     return NextResponse.json({ user: null }, { status: 401 });
//   }
// }
