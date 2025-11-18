import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/* =========================================================
   🛒 GET USER CART
========================================================= */
export const getCart = async (req, res) => {
  console.log("\n===== 🛒 GET CART API CALLED =====");

  try {
    const userId = req.user.id;
    console.log("➡ Authenticated User ID:", userId);

    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      console.log("🟡 No cart found. Creating new one...");
      cart = await Cart.create({ userId, items: [] });
    }

    console.log("🟢 Cart Found:", cart.items.length, "items");
    res.json(cart);

  } catch (error) {
    console.log("❌ ERROR in GET CART:", error.message);
    res.status(500).json({ message: "Server error — could not fetch cart." });
  }

  console.log("===== 🛒 GET CART API END =====\n");
};


/* =========================================================
   ➕ ADD TO CART
========================================================= */
export const addToCart = async (req, res) => {
  console.log("\n===== 🛒 ADD TO CART API CALLED =====");

  try {
    const userId = req.user.id;
    const { productId, qty } = req.body;

    console.log("➡ User ID:", userId);
    console.log("➡ Incoming Product:", productId, "Qty:", qty);

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      console.log("❌ Product not found");
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId, items: [] });

    const exists = cart.items.find((i) => i.productId.toString() === productId);

    if (exists) {
      exists.quantity += qty;
      console.log("➕ Updated existing product qty");
    } else {
      cart.items.push({
        productId,
        quantity: qty,
        price: product.price,   // REQUIRED FIELD
      });
      console.log("🆕 Product added to cart");
    }

    await cart.save();
    const populated = await Cart.findOne({ userId }).populate("items.productId");
    res.json(populated);

  } catch (error) {
    console.log("🔥 ERROR in ADD TO CART:", error.message);
    res.status(500).json({ message: "Server error — could not add to cart." });
  }

  console.log("===== 🛒 ADD TO CART API END =====\n");
};


/* =========================================================
   🔄 UPDATE CART ITEM QTY
========================================================= */
export const updateCartItem = async (req, res) => {
  console.log("\n===== 🛒 UPDATE CART ITEM API CALLED =====");

  try {
    const userId = req.user.id;
    const { productId, qty } = req.body;

    console.log("➡ Product:", productId, "➡ New Qty:", qty);

    if (qty < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity = qty;
    await cart.save();

    const updated = await Cart.findOne({ userId }).populate("items.productId");
    res.json(updated);

  } catch (error) {
    console.log("🔥 ERROR in UPDATE:", error.message);
    res.status(500).json({ message: "Server error — cannot update cart item" });
  }
};


/* =========================================================
   🗑 REMOVE CART ITEM
========================================================= */
export const removeCartItem = async (req, res) => {
  console.log("\n===== 🗑 REMOVE CART ITEM API CALLED =====");

  try {
    const userId = req.user.id;
    const productId = req.params.productId;  // ✅ FIXED

    console.log("➡ Remove Product ID:", productId);

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const exists = cart.items.find((i) => i.productId.toString() === productId);
    if (!exists) return res.status(404).json({ message: "Product not in cart" });

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();

    const updated = await Cart.findOne({ userId }).populate("items.productId");
    res.json(updated);

  } catch (error) {
    console.log("🔥 ERROR Removing Item:", error.message);
    res.status(500).json({ message: "Server error — cannot remove item" });
  }

  console.log("===== 🗑 REMOVE CART ITEM END =====\n");
};


/* =========================================================
   ❌ CLEAR CART
========================================================= */
export const clearCart = async (req, res) => {
  const userId = req.user.id;
  await Cart.updateOne({ userId }, { items: [] });
  res.json({ message: "Cart cleared" });
};


/* =========================================================
//✅ ➕ INCREASE QTY ( +1 )
========================================================= */

export const increaseQty = async (req, res) => {
  console.log("\n===== 🔼 INCREASE QTY API CALLED =====");

  try {
    const userId = req.user.id;
    const { productId } = req.body;

    console.log("➡ User:", userId);
    console.log("➡ Product:", productId);

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity += 1;
    await cart.save();

    const updated = await Cart.findOne({ userId }).populate("items.productId");
    res.json(updated);

  } catch (err) {
    console.log("🔥 ERROR in increase:", err.message);
    res.status(500).json({ message: "Could not increase qty" });
  }
};

/* =========================================================
🔽 ➖ DECREASE QTY ( -1 )
========================================================= */

export const decreaseQty = async (req, res) => {
  console.log("\n===== 🔽 DECREASE QTY API CALLED =====");

  try {
    const userId = req.user.id;
    const { productId } = req.body;

    console.log("➡ User:", userId);
    console.log("➡ Product:", productId);

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    if (item.quantity === 1) {
      return res.status(400).json({ message: "Quantity cannot be less than 1" });
    }

    item.quantity -= 1;
    await cart.save();

    const updated = await Cart.findOne({ userId }).populate("items.productId");
    res.json(updated);

  } catch (err) {
    console.log("🔥 ERROR in decrease:", err.message);
    res.status(500).json({ message: "Could not decrease qty" });
  }
};
