import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    orderItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        title: { type: String, required: true },
        thumbnail: { type: String },
        qty: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],

    shippingInfo: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },

    paymentMethod: { type: String, default: "COD" }, // Cash on Delivery
    paymentStatus: { type: String, default: "Pending" },

    orderStatus: { type: String, default: "Processing" },

    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
