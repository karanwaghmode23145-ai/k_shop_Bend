import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

/* =========================================================
 ⭐ CREATE ORDER
========================================================= */
export const createOrder = async (req, res) => {
  try {
    console.log("\n=========== 📦 CREATE ORDER ===========");

    const userId = req.user.id;
    const data = req.body;

    console.log("📩 RECEIVED ORDER BODY:", JSON.stringify(data, null, 2));

    if (!data.orderItems || data.orderItems.length === 0) {
      return res.status(400).json({ message: "Order must contain items" });
    }

    let itemsPrice = 0;
    const preparedItems = [];

    // 🔥 LOOP THROUGH ITEMS
    for (const item of data.orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const qty = Number(item.qty || 1);      // ✅ SAFE QTY
      const price = Number(product.price);    // ✅ Always from DB

      itemsPrice += price * qty;

      // 🔥 Update stock
      product.countInStock = product.countInStock - qty;
      product.sold = (product.sold || 0) + qty;
      await product.save();

      preparedItems.push({
        productId: product._id,
        title: item.title || product.title,
        thumbnail: item.thumbnail || product.thumbnail,
        qty,
        price,
      });
    }

    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice = itemsPrice * 0.18;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // 📌 Create Order
    const order = await Order.create({
      orderItems: preparedItems,
      shippingInfo: data.shippingInfo,
      paymentMethod: data.paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      userId,
      orderStatus: "Processing",
    });

    console.log("✔ ORDER SAVED:", order._id);

    // 🧹 Clear cart after order
    await Cart.updateOne({ userId }, { items: [] });

    return res.status(201).json(order);

  } catch (error) {
    console.log("❌ ERROR CREATE ORDER FULL LOG:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================================================
 ⭐ GET USER ORDERS
========================================================= */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.log("❌ ERROR GET ORDERS:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================================================
 ⭐ GET SINGLE ORDER (POPULATED)
========================================================= */
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate(
      "orderItems.productId"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json(order);
  } catch (error) {
    console.log("❌ ERROR GET SINGLE ORDER:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
