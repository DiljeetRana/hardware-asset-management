import connectDB from "@/lib/connection";
import Employee from "@/models/employee";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();
    console.log("Login attempt — email:", email, "password:", password);

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
      const admin = await Employee.findOne({ email }).select("+password");
      if (!admin) {
        return NextResponse.json(
          { error: "Admin not found" },
          { status: 404 }
        );
      }
      console.log("admin.password:", admin.password);
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
      // After successful login / token generation
      const res = NextResponse.json({ success: true, role: admin.role }, { status: 200 });
      res.cookies.set("token", token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        secure: process.env.NODE_ENV === "production",
      });
      return res;

      // return NextResponse.json(
      //   { message: "Admin login successful", role: "admin" },
      //   {
      //     status: 200,
      //     headers: {
      //       "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=${
      //         7 * 24 * 60 * 60
      //       }; SameSite=Lax${
      //         process.env.NODE_ENV === "production" ? "; Secure" : ""
      //       }`,
      //     },
      //   }
      // );
    }

    // ===============================
    // EMPLOYEE LOGIN
    // ===============================
    const employee = await Employee.findOne({ email }).select("+password");
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
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60
            }; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""
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

