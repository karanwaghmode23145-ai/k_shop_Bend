import Order from "../models/Order.js";
import Product from "../models/Product.js";

/* =========================================================
// ⭐ Create Order
========================================================= */
export const createOrder = async (req, res) => {

    try {

        console.log("🟦 CREATE ORDER API CALLED");
        console.log("➡️ User ID:", req.user.id);          // Logged-in user ka ID
        console.log("➡️ Request Body:", req.body);

        const userId = req.user.id;
        const data = req.body;

        // Create order
        const order = await Order.create({
            ...data,
            userId,
        });

        console.log("✅ Order Created Successfully");
        console.log("📦 Saved Order:", order);

        res.status(201).json({ message: "Order created successfully", order });

    } catch (error) {

        console.log("❌ ERROR in createOrder:", error.message);
        res.status(500).json({ message: "Server Error" });

    }


};


/* =========================================================
// ⭐ Get User Orders
========================================================= */
export const getUserOrders = async (req, res) => {

    try {

        console.log("🟦 GET USER ORDERS API CALLED");

        const userId = req.user.id;
        console.log("➡️ User ID:", userId);

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        console.log("📦 Found Orders:", orders.length);
        console.log("Orders Data:", orders);

        res.json(orders);


    } catch (error) {

        console.log("❌ ERROR in getUserOrders:", error.message);
        res.status(500).json({ message: "Server Error" });

    }

};


/* =========================================================
// ⭐ Get Single Order
========================================================= */
export const getOrderById = async (req, res) => {

    try {

        console.log("🟦 GET SINGLE ORDER API CALLED");

        const orderId = req.params.id;
        console.log("➡️ Order ID from URL:", orderId);

        // Find Order
        const order = await Order.findById(orderId);

        if (!order) {
            console.log("❌ Order Not Found");
            return res.status(404).json({ message: "Order not found" });
        }

        console.log("📦 Order Found:", order);
        res.json(order);


    } catch (error) {
        console.log("❌ ERROR in getOrderById:", error.message);
        res.status(500).json({ message: "Server Error" });
    }

};


/* =========================================================
// ⭐ Update Order Status (For Admin)
========================================================= */
export const updateOrderStatus = async (req, res) => {

};
