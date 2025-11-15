import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },

    description: { type: String },
    shortDescription: { type: String },

    price: { type: Number, required: true },
    oldPrice: { type: Number },
    discountPercent: { type: Number },

    countInStock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },

    images: [{ type: String }],
    thumbnail: { type: String },

    category: { type: String },
    subcategory: { type: String },
    brand: { type: String },

    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    size: [{ type: String }],
    color: [{ type: String }],

    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
