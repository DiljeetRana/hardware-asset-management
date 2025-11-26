import mongoose, { Schema, Document } from "mongoose";

export interface IResource extends Document {
  name: string;
  resourceType: mongoose.Types.ObjectId;
  description: string;
  images: { url: string; public_id: string }[];
  documents: { url: string; public_id: string }[];
  totalResourceCount: number;
  avaliableResourceCount: number;
  purchaseDate: Date;
  warrantyExpiryDate: Date;
  status: string;
  isDeleted: boolean;
}

const ResourceSchema = new Schema(
  {
    name: { type: String, required: true },

    resourceType: {
      type: Schema.Types.ObjectId,
      ref: "ResourceType",
      required: true,
    },

    description: { type: String },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    documents: [
      {
        url: { type: String },
        public_id: { type: String },
      },
    ],

    totalResourceCount: { type: Number, default: 0 },
    avaliableResourceCount: { type: Number, default: 0 },

    purchaseDate: { type: Date },
    warrantyExpiryDate: { type: Date },

    status: {
      type: String,
      enum: ["Available", "Allocated", "Under Repair", "Retired"],
      default: "Available",
    },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Resource||
  mongoose.model<IResource>("Resource", ResourceSchema);
