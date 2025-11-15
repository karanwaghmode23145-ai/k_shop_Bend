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

};

// ➤ UPDATE PRODUCT
export const updateProduct = async (req, res) => {

};

// ➤ DELETE PRODUCT
export const deleteProduct = async (req, res) => {

};
