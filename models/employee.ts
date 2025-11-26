import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
     password: { type: String, default: null },
    position: { type: String, default: "Admin" },
    department: { type: String, default: "Management" },
    status: { type: String, default: "Active" },
    profilePicture: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    isDeleted: { type: Boolean, default: false },
    hireDate: { type: Date, default: Date.now },

    // NEW fields for password hint logic
    birthday: { type: String, default: null },
    employeeCode: { type: String, default: null },
    phone: { type: String, default: null },
    birthYear: { type: String, default: null },

    role: { type: String, enum: ["admin", "employee"], default: "admin" },
  },
  { timestamps: true }
);

export default mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
