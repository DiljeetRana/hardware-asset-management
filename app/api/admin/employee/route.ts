import connectDB from "@/lib/connection";
import Employee from "@/models/employee";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      name,
      email,
      position,
      department,
      hireDate,
      status,
      employeeCode,
      birthday,
      phone,
    } = body;

    if (!name || !email || !employeeCode || !birthday || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existing = await Employee.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Employee with this email already exists" },
        { status: 400 }
      );
    }

    const newEmployee = await Employee.create({
      name,
      email,
      position,
      department,
      hireDate,
      status,
      employeeCode,
      birthday,
      phone,
      role: "employee",
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const employees = await Employee.find({ isDeleted: false }).sort({
      createdAt: -1,
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
