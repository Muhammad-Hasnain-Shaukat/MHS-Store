import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1, parent: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);
