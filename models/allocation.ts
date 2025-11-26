import mongoose, { Schema, Document } from "mongoose";

export interface IAllocation extends Document {
  employee: mongoose.Schema.Types.ObjectId;
  resource: mongoose.Schema.Types.ObjectId;
  AllocatedDate: Date;
  returnDate?: Date;
  status: string; // Assigned, Returned, Lost, Damage etc.
}

const AllocationSchema = new Schema<IAllocation>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    resource: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },
    AllocatedDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Allocated", "Returned", "Lost", "Damage"],
      default: "Allocated",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Allocation ||
  mongoose.model<IAllocation>("Allocation", AllocationSchema);
