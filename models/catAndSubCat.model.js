import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
  },
  { timestamps: true }
);

const subCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
const SubCategory = mongoose.model("SubCategory", subCategorySchema);

export { Category, SubCategory };
