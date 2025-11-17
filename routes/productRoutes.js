import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  getProductsByCategory,
  getRelatedProducts,
  filterProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// CREATE
router.post("/", createProduct);

// READ ALL
router.get("/", getProducts);

// CATEGORY WISE (STATIC ROUTE)
router.get("/category/:name", getProductsByCategory);

// FILTER PRODUCTS (STATIC ROUTE)
router.get("/filter", filterProducts);

// READ SINGLE (DYNAMIC ROUTE - ALWAYS LAST)
router.get("/:id", getProductById);

// GET RELATED PRODUCTS (FIXED)
router.get("/related/:productId", getRelatedProducts);

// UPDATE
router.put("/:id", updateProduct);

// DELETE
router.delete("/:id", deleteProduct);

export default router;
