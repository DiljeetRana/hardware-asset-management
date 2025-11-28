import connectDB from "@/lib/connection";
import Employee from "@/models/employee";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // ===============================
    // ADMIN LOGIN
    // ===============================
    if (email === "admin@antheminfotech.com") {
      const admin = await Employee.findOne({ email });
      if (!admin) {
        return NextResponse.json(
          { error: "Admin not found" },
          { status: 404 }
        );
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Invalid admin password" },
          { status: 401 }
        );
      }

      const token = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      return NextResponse.json(
        { message: "Admin login successful", role: "admin" },
        {
          status: 200,
          headers: {
            "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=${
              7 * 24 * 60 * 60
            }; SameSite=Lax${
              process.env.NODE_ENV === "production" ? "; Secure" : ""
            }`,
          },
        }
      );
    }

    // ===============================
    // EMPLOYEE LOGIN
    // ===============================
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }
   const birthYear = new Date(employee.birthday).getFullYear();
    const expectedFirstPassword =
      employee.employeeCode.slice(-3) +
      "#" +
      employee.phone.slice(-4) +
      "@" +
      birthYear;

    // First-time login: no password stored
    if (!employee.password) {
      if (password !== expectedFirstPassword) {
        return NextResponse.json(
          { error: "Invalid password" },
          { status: 401 }
        );
      }

      employee.password = await bcrypt.hash(password, 10);
      await employee.save();
    }

    // Normal login
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      { message: "Login successful", role: employee.role },
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=${
            7 * 24 * 60 * 60
          }; SameSite=Lax${
            process.env.NODE_ENV === "production" ? "; Secure" : ""
          }`,
        },
      }
    );
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}



// import connectDB from "@/lib/connection";
// import Employee from "@/lib/models/employee";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// export async function POST(req: Request) {
//   try {
//     await connectDB();

//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return Response.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // =====================================
//     // 1️⃣  ADMIN LOGIN
//     // =====================================
//     if (email === "admin@antheminfotech.com") {
//       const admin = await Employee.findOne({ email });

//       if (!admin) {
//         return Response.json({ error: "Admin not found" }, { status: 404 });
//       }

//       const isMatch = await bcrypt.compare(password, admin.password);

//       if (!isMatch) {
//         return Response.json(
//           { error: "Invalid admin password" },
//           { status: 401 }
//         );
//       }

//       const token = jwt.sign(
//         { id: admin._id, role: "admin" },
//         process.env.JWT_SECRET!,
//         { expiresIn: "7d" }
//       );

//       // Set HttpOnly Cookie
//       cookies().set("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         path: "/",
//         sameSite: "strict",
//         maxAge: 7 * 24 * 60 * 60,
//       });

//       return Response.json({
//         message: "Admin login successful",
//         role: "admin",
//       });
//     }

//     // =====================================
//     // 2️⃣  EMPLOYEE LOGIN
//     // =====================================

//     const employee = await Employee.findOne({ email });

//     if (!employee) {
//       return Response.json({ error: "Employee not found" }, { status: 404 });
//     }

//     // Generate FIRST-TIME password
//     const expectedFirstPassword =
//       employee.employeeCode.slice(-3) +
//       "#" +
//       employee.phone.slice(-4) +
//       "@" +
//       employee.birthYear;

//     // ==========================
//     // 👉 CASE A: FIRST LOGIN
//     // ==========================
//     if (!employee.password) {
//       if (password !== expectedFirstPassword) {
//         return Response.json({ error: "Invalid password" }, { status: 401 });
//       }

//       employee.password = await bcrypt.hash(password, 10);
//       await employee.save();
//     }

//     // ==========================
//     // 👉 CASE B: NORMAL LOGIN
//     // ==========================
//     else {
//       const isMatch = await bcrypt.compare(password, employee.password);

//       if (!isMatch) {
//         return Response.json(
//           { error: "Invalid credentials" },
//           { status: 401 }
//         );
//       }
//     }

//     // Create Token
//     const token = jwt.sign(
//       { id: employee._id, role: employee.role },
//       process.env.JWT_SECRET!,
//       { expiresIn: "7d" }
//     );

//     // Set Cookie
//     cookies().set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       path: "/",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60,
//     });

//     return Response.json({
//       message: "Login successful",
//       role: employee.role,
//     });

//   } catch (error: any) {
//     console.error("Login error:", error);
//     return Response.json(
//       { error: error.message || "Server error" },
//       { status: 500 }
//     );
//   }
// }