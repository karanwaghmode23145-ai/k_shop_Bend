import Wishlist from "../models/Wishlist.js";

// GET WISHLIST
export const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate("items.productId");
  res.json(wishlist || { items: [] });
};

// ADD TO WISHLIST
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ userId: req.user.id });

  if (!wishlist)
    wishlist = await Wishlist.create({ userId: req.user.id, items: [] });

  const exists = wishlist.items.some(i => i.productId.toString() === productId);

  if (!exists) wishlist.items.push({ productId });

  await wishlist.save();
  res.json(wishlist);
};

// REMOVE
export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  let wishlist = await Wishlist.findOne({ userId: req.user.id });

  wishlist.items = wishlist.items.filter(
    (i) => i.productId.toString() !== productId
  );

  await wishlist.save();
  res.json(wishlist);
};
