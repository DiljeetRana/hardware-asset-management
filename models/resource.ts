import mongoose, { Schema, Document } from "mongoose";

export interface IResource extends Document {
  name: string;
  resourceType: mongoose.Types.ObjectId;
  description?: string;
  images: { url: string; public_id: string }[];
  documents: { url: string; public_id: string }[];
  totalResourceCount: number;
  availableResourceCount: number;
  purchaseDate: Date;
  warrantyExpiryDate: Date;
  status: string;
  isDeleted: boolean;

  // Device specific fields
  brand: string;
  modelName: string;
  serialNumber: string;
  assetTag: string;
  purchaseCost: number;
  vendorName: string;
  warrantyStatus: string;
  processor?: string;
  ram?: string;
  storage?: string;
  graphics?: string;
  os?: string;
  imei?: string;
  accessories?: string[];
  lastServiceDate?: Date;
  notes?: string;
}

const ResourceSchema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"] 
    },
    
    // ✅ FIXED: Make resourceType required but handle it properly
    resourceType: {
      type: Schema.Types.ObjectId,
      ref: "ResourceType",
      required: [true, "Resource Type is required"]
    },

    description: { type: String },

    // ✅ FIXED: Make images optional
    images: [{
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }],

    documents: [{
      url: { type: String },
      public_id: { type: String }
    }],

    totalResourceCount: { type: Number, default: 1 },
    availableResourceCount: { type: Number, default: 1 },

    purchaseDate: { 
      type: Date, 
      required: [true, "Purchase date is required"] 
    },
    warrantyExpiryDate: { 
      type: Date, 
      required: [true, "Warranty expiry date is required"] 
    },

    status: {
      type: String,
      enum: ["Available", "Allocated", "Under Repair", "Retired"],
      default: "Available",
    },

    isDeleted: { type: Boolean, default: false },

    // ✅ Make device fields optional (API will set them)
    brand: { type: String },
    modelName: { type: String },
    serialNumber: { 
      type: String, 
      unique: true 
    },
    assetTag: { 
      type: String, 
      unique: true 
    },
    purchaseCost: { type: Number },
    vendorName: { type: String },
    warrantyStatus: { 
      type: String, 
      enum: ["Valid", "Expired"] 
    },

    processor: { type: String },
    ram: { type: String },
    storage: { type: String },
    graphics: { type: String },
    os: { type: String },
    imei: { type: String },
    accessories: [{ type: String }],
    lastServiceDate: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

// Indexes
ResourceSchema.index({ serialNumber: 1 }, { unique: true });
ResourceSchema.index({ assetTag: 1 }, { unique: true });

export default mongoose.models.Resource || mongoose.model<IResource>("Resource", ResourceSchema);