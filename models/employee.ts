import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  name: string;
  email: string;
  password: string;
  position: string;
  department: string;
  hireDate: Date;
  status: string;
  // profilePicture?: {
  //   url: string;
  //   public_id: string;
  // };
  employeeCode: string;
  dob: Date;
  phone: string;
  isDeleted: boolean;
}

const EmployeeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    position: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    hireDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Terminated"],
      default: "Active",
    },

    // profilePicture: {
    //   url: { type: String },
    //   public_id: { type: String },
    // },

    employeeCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    birthday: {
      type: Date,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String, enum: ["admin", "employee"], default: "employee"
    },
    password: { type: String,required:false }
  },

  { timestamps: true }
);

export default mongoose.models.Employee ||
  mongoose.model<IEmployee>("Employee", EmployeeSchema);

