import mongoose from "mongoose";
import Product from "../models/Product.js";


// 🔥 Slug Generator Function
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

// ➤ CREATE PRODUCT (Advanced)
export const createProduct = async (req, res) => {
  try {
    console.log("📥 Create Product Request Received");
    console.log("📦 raw req.body:", req.body);

    const {
      title,
      description,
      shortDescription,
      price,
      oldPrice,
      category,
      subcategory,
      brand,
      countInStock,
      size,
      color,
      isFeatured,
    } = req.body;

    console.log("🔎 Extracted fields from body:", {
      title,
      price,
      oldPrice,
      category,
      brand,
      countInStock,
      size,
      color,
      isFeatured,
    });

    if (!title || !price) {
      console.log("❌ Validation failed - missing title or price");
      return res.status(400).json({ message: "Title and Price are required" });
    }
    console.log("✅ Validation passed (title & price present)");

    // Slug creation
    let slug = generateSlug(title);
    console.log("🔖 Generated slug from title:", slug);

    const existingSlug = await Product.findOne({ slug });
    console.log("🔎 existingSlug result:", existingSlug ? "FOUND" : "NOT FOUND");

    if (existingSlug) {
      const oldSlug = slug;
      slug = slug + "-" + Date.now();
      console.log(`⚠ Duplicate slug fixed: ${oldSlug} -> ${slug}`);
    }

    // Convert to numbers
    const priceNum = Number(price);
    const oldPriceNum = Number(oldPrice);

    // Discount calculation
    let discountPercent = 0;
    if (oldPriceNum && priceNum < oldPriceNum) {
      discountPercent = Math.round(
        ((oldPriceNum - priceNum) / oldPriceNum) * 100
      );
    }

    console.log("🏷️ Calculated discountPercent:", discountPercent);

    // Handle images
    let images = [];
    if (req.files && req.files.length > 0) {
      console.log(`🖼️ ${req.files.length} image(s) uploaded`);
      images = req.files.map((file) => {
        console.log("→ File:", file.path);
        return file.path;
      });
    }

    // Prepare payload
    const payload = {
      title,
      slug,
      description,
      shortDescription,
      price: priceNum,
      oldPrice: oldPriceNum,
      discountPercent,
      category,
      subcategory,
      brand,
      countInStock: Number(countInStock) || 0,
      size: size ? size.split(",") : [],
      color: color ? color.split(",") : [],
      images,
      thumbnail: images[0] || "",
      isFeatured: isFeatured === "true",
      isActive: true,
    };

    console.log("🧭 Final Product Payload:", payload);

    // Create product
    console.log("⏳ Saving product to DB...");
    const newProduct = await Product.create(payload);

    console.log("✅ Product created successfully. ID:", newProduct._id);

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });

  } catch (error) {
    console.log("❌ Error Creating Product:", error);
    res.status(500).json({ message: error.message });
  }
};

// ➤ GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {

    console.log("📥 Request: GET All Products");

    const products = await Product.find().sort({ createdAt: -1 }); // newest first

    console.log(`📦 Total Products Found: ${products.length}`);

    res.status(200).json(products);

  } catch (error) {

    console.log("❌ Error Fetching Products:", error);

    res.status(500).json({ message: error.message });
  }
};

// ➤ GET PRODUCT BY ID
export const getProductById = async (req, res) => {


  try {
    const productId = req.params.id;
    console.log("🔎 Extracted Product ID:", productId);

    // Validate ID format
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("❌ Invalid MongoDB ObjectId Format");
      return res.status(400).json({ message: "Invalid product ID" });
    }
    console.log("⏳ Searching product in database...");
    const product = await Product.findById(productId);

    if (!product) {
      console.log("❌ No product found with this ID:", productId);
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("✅ Product Found:", product.title);
    res.status(200).json(product);

  } catch (error) {
    console.log("✅ Product Found:", product.title);
    res.status(200).json(product);
  }
};


// Get products by category
export const getProductsByCategory = async (req, res) => {
 try {

  const categoryName = req.params.name;
  console.log("🟦 Requested Category:", categoryName);

  const products = await Product.find({
      category: { $regex: new RegExp("^" + categoryName + "$", "i") }
    });

    console.log("🟩 MongoDB Response Count:", products.length);
    console.log("🟩 Products Found:", products);

     if (!products.length) {
      console.log("🔴 No Products Found for category:", categoryName);
      return res.json([]);
    }

     res.json(products);

 } catch (error) {
  console.log("❌ Error in getProductsByCategory:", err);
    res.status(500).json({ message: "Server Error", error: err });
 }
};

// Advanced filter 
export const filterProducts = async (req, res) =>{
  try {

    const { category, size, color, sort } = req.query;
    console.log("📥 Incoming Filters:");
    console.log("Category:", category);
    console.log("Size:", size);
    console.log("Color:", color);
    console.log("Sort:", sort);

    const filter = {};

    if (category) filter.category = category;
    if (size) filter.size = size;
    if (color) filter.color = color;

    console.log("🔥 MongoDB Filter:", filter);

    let products = await Product.find(filter);

    console.log("📦 Products Found:", products.length);

    // Sorting
    if (sort === "low-high") products.sort((a, b) => a.price - b.price);
    if (sort === "high-low") products.sort((a, b) => b.price - a.price);
    if (sort === "rating") products.sort((a, b) => b.rating - a.rating);

    return res.json(products);

  } catch (error) {
    console.log("❌ Filter Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}

// GET RELATED PRODUCTS
export const getRelatedProducts = async (req, res) => {

  console.log("📥 GET /api/products/related/:productId called");

  try {
    const productId = req.params.productId;
    console.log("🔍 Received productId:", productId);

     // 1) Validate ID
    const isValid = mongoose.Types.ObjectId.isValid(productId);
    console.log("🔎 Mongoose ID Valid?:", isValid);

     if (!isValid) {
      console.log("❌ Invalid MongoDB ObjectId format");
      return res.status(400).json({ message: "Invalid productId format" });
    }

    // 2) Find product
    console.log("⏳ Searching product in DB...");
    const currentProduct = await Product.findById(productId);

    console.log("🔎 DB result:", currentProduct ? "FOUND" : "NOT FOUND");

    if (!currentProduct) {
      console.log("❌ Product not found in database!");
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("✅ Product Found:", {
      id: currentProduct._id.toString(),
      title: currentProduct.title,
      category: currentProduct.category
    });

    // 3) Find related by category
    console.log(`⏳ Fetching related products for category: "${currentProduct.category}"`);

    const relatedProducts = await Product.find({
      category: currentProduct.category,
      _id: { $ne: productId }
    }).limit(10);

    console.log(`📦 Related Products Found: ${relatedProducts.length}`);

    if (relatedProducts.length > 0) {
      console.log("🟢 Sample Related Product:", relatedProducts[0].title);
    }

    res.json(relatedProducts);
    
  } catch (error) {
    console.log("❌ Error in related products:", error);
    res.status(500).json({ message: error.message });
  }
  
};


// ➤ UPDATE PRODUCT
export const updateProduct = async (req, res) => {

};

// ➤ DELETE PRODUCT
export const deleteProduct = async (req, res) => {

};
