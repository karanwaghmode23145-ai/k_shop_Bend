import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  increaseQty,
  decreaseQty,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect,  addToCart);
router.put("/", protect, updateCartItem);
router.delete("/:productId", protect, removeCartItem);
router.delete("/", protect, clearCart);

router.put("/increase", protect, increaseQty);
router.put("/decrease", protect, decreaseQty);

export default router;
