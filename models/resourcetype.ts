import mongoose, { Schema, Document } from "mongoose";

export interface IResourceType extends Document {
  name: string;
  description: string;
}

const ResourceTypeSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.ResourceType ||
  mongoose.model<IResourceType>("ResourceType", ResourceTypeSchema);
