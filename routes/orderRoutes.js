import express from "express";
import { createOrder, getUserOrders, getOrderById, updateOrderStatus } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js"; // JWT middleware

const router = express.Router();

router.post("/", protect, createOrder);  // create order
router.get("/", protect, getUserOrders); // user orders
router.get("/:id", protect, getOrderById); // single order
router.put("/:id/status", protect, updateOrderStatus); // admin update status

export default router;
