import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

/* =========================================================
   🛒 // GET WISHLIST
========================================================= */

export const getWishlist = async (req, res) => {
  console.log("\n======== 💛 GET WISHLIST API CALLED ========");

  try {

     // 1️⃣ User ID from token
    const userId = req.user.id;
    console.log("➡ Logged-in User ID:", userId);

    // 2️⃣ Searching wishlist in DB
    console.log("🔍 Searching wishlist in database...");
    let list = await Wishlist.findOne({ userId }).populate("items.productId");

    // 3️⃣ If wishlist doesn't exist → create empty wishlist
    if (!list) {
      console.log("🟡 No wishlist found. Creating new empty wishlist...");
      list = await Wishlist.create({ userId, items: [] });
      console.log("🆕 New Wishlist Created:", list);
    } else {
      console.log("🟢 Wishlist Found. Total Items:", list.items.length);
    }

    // 4️⃣ Response
    console.log("📤 Sending Wishlist Response...");
    res.json({ items: list.items });
    
  } catch (error) {

    console.log("❌ ERROR in GET WISHLIST:", err.message);
    res.status(500).json({ message: "Cannot fetch wishlist" });
    
  }
  
};

/* =========================================================
   🛒 // ADD TO WISHLIST
========================================================= */

export const addToWishlist = async (req, res) => {
  console.log("\n======== 💛 ADD TO WISHLIST API CALLED ========");

  try {
    // 1️⃣ User ID from JWT
    const userId = req.user.id;
    const { productId } = req.body;

    console.log("➡ Logged-in User ID:", userId);
    console.log("➡ Product ID Received:", productId);

    // 2️⃣ Validate product
    console.log("🔍 Checking if product exists...");
    const product = await Product.findById(productId);

    if (!product) {
      console.log("❌ Product not found!");
      return res.status(404).json({ message: "Product not found" });
    }
    console.log("🟢 Product exists:", product.title);

    // 3️⃣ Fetch or Create wishlist
    console.log("🔍 Searching wishlist for user...");
    let list = await Wishlist.findOne({ userId });

    if (!list) {
      console.log("🟡 Wishlist not found — creating new empty wishlist...");
      list = await Wishlist.create({ userId, items: [] });
    } else {
      console.log("🟢 Wishlist found. Current items:", list.items.length);
    }

    // 4️⃣ Check if product already exists in wishlist
    console.log("🔍 Checking if product already in wishlist...");
    const exists = list.items.find(
      (i) => i.productId.toString() === productId
    );

    if (exists) {
      console.log("⚠ Already in wishlist!");
      return res.json({ message: "Already in wishlist", items: list.items });
    }

    // 5️⃣ Add to wishlist
    console.log("➕ Adding product to wishlist...");
    list.items.push({ productId });

    await list.save();

    // 6️⃣ Populate updated items
    const updated = await Wishlist.findOne({ userId }).populate("items.productId");

    console.log("📤 Sending updated wishlist...");
    res.json({ items: updated.items });

  } catch (err) {
    console.log("❌ ERROR in ADD TO WISHLIST:", err.message);
    res.status(500).json({ message: "Cannot add to wishlist" });
  }

  console.log("======== 💛 ADD TO WISHLIST API END ========\n");
};


/* =========================================================
   🛒 // Remove 
========================================================= */

export const removeFromWishlist = async (req, res) => {

 console.log("\n======== ❌ REMOVE FROM WISHLIST API CALLED ========");

 try {
  // 1️⃣ User ID from JWT
    const userId = req.user.id;
    const productId = req.params.productId;

    console.log("➡ Logged-in User ID:", userId);
    console.log("➡ Product ID to Remove:", productId);

       // 2️⃣ Find user wishlist
    console.log("🔍 Searching wishlist...");
    let list = await Wishlist.findOne({ userId });

    if (!list) {
      console.log("⚠ Wishlist not found for this user");
      return res.status(404).json({ message: "Wishlist empty" });
    }

    console.log("🟢 Wishlist found. Current items:", list.items.length);

    // 3️⃣ Filter OUT product to remove
    const beforeCount = list.items.length;

    list.items = list.items.filter(
      (i) => i.productId.toString() !== productId
    );

    const afterCount = list.items.length;

    console.log(`➖ Before Remove: ${beforeCount} items`);
    console.log(`➕ After Remove: ${afterCount} items`);

    // 4️⃣ Save new wishlist
    await list.save();

    // 5️⃣ Populate updated items
    const updated = await Wishlist.findOne({ userId }).populate("items.productId");

    console.log("📤 Sending updated wishlist to client...");
    res.json({ items: updated.items });


  
 } catch (error) {

  console.log("❌ ERROR in REMOVE FROM WISHLIST:", err.message);
    res.status(500).json({ message: "Cannot remove" });
    
 }

};
