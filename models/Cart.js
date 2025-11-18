import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        qty: { type: Number, default: 1 },
        price: { type: Number, required: true },
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
