import { NextResponse } from "next/server";
import connectDB from "@/lib/connection";
import Employee from "@/models/employee";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;  // 🔥 FIX: await the params Promise

    console.log("API HIT - ID PARAM:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid employee ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const employee = await Employee.findById(id);

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee, { status: 200 });

  } catch (error: any) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.toString() },
      { status: 500 }
    );
  }
}


// =============================
// UPDATE Employee by ID
// =============================
export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid employee ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    await connectDB();
    const updatedEmployee = await Employee.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEmployee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Employee updated successfully", employee: updatedEmployee },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.toString() },
      { status: 500 }
    );
  }
}


// =============================
// DELETE EMPLOYEE
// =============================
export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params; // 🔥 FIX applied here also

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid employee ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const deleted = await Employee.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error", error: error.toString() },
      { status: 500 }
    );
  }
}
