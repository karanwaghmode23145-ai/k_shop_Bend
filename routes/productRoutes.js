import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// CREATE
router.post("/", createProduct);

// READ ALL
router.get("/", getProducts);

// READ SINGLE
router.get("/:id", getProductById);

// UPDATE
router.put("/:id", updateProduct);

// DELETE
router.delete("/:id", deleteProduct);

export default router;
