import Review from "../models/reviewModel.js";
import Product from "../models/Product.js";

// ➤ GET REVIEWS BY PRODUCT
export const getProductReviews = async (req, res) => {

console.log("📥 GET Product Reviews API Called");

try {
    const productId = req.params.productId;
    console.log("🔍 Extracted productId from URL:", productId);

    // Validate ID Format (for safety)
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("❌ Invalid MongoDB ObjectId:", productId);
      return res.status(400).json({ message: "Invalid Product ID format" });
    }
    console.log("⏳ Fetching reviews from database...");

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    console.log(`📦 Total Reviews Found: ${reviews.length}`);
    console.log("📝 Reviews Data:", reviews);

     res.json(reviews);


} catch (error) {
    console.log("❌ Error in getProductReviews:", error);
    res.status(500).json({ message: error.message });
}
  
};


// ➤ ADD REVIEW
export const addReview = async (req, res) => {
 console.log("📥 ADD Review API Called");
 console.log("📝 Incoming Request Body:", req.body);

 try {

    const { productId, name, rating, comment } = req.body;

    console.log("🔍 Extracted Fields:", {
      productId,
      name,
      rating,
      comment
    });

    // Validation
    if (!name || !rating || !comment) {
      console.log("❌ Validation Failed — Missing Fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("✅ Validation Passed");

     // CREATE REVIEW
    console.log("⏳ Creating Review in DB...");

     const newReview = await Review.create({
      productId,
      name,
      rating,
      comment
    });

    console.log("🎉 Review Created Successfully:");
    console.log(newReview);

    // Fetch all reviews of this product
    console.log("⏳ Fetching updated reviews for this product...");

    const reviews = await Review.find({ productId });

    console.log(`📦 Total Reviews Found: ${reviews.length}`);
    console.log("📝 Review List:", reviews);

    // Calculate rating
    const numReviews = reviews.length;
    const avgRating =
    reviews.reduce((acc, item) => acc + item.rating, 0) / numReviews;

    console.log("📊 Rating Calculation:");
    console.log("Total Reviews:", numReviews);
    console.log("Average Rating:", avgRating);

     // UPDATE PRODUCT
    console.log("⏳ Updating Product Stats...");

     await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      numReviews,
    });

    console.log("✅ Product Updated Successfully");

     res.status(201).json({
      message: "Review added successfully",
      review: newReview,
    });

    
 } catch (error) {

    console.log("❌ Error in addReview API:", error);
    res.status(500).json({ message: error.message });
    
 }

};