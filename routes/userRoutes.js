import express from "express";
import { registerUser, getAllUsers, loginUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// PROTECTED ROUTE
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected Route OK",
    user: req.user,
  });
});

// PUBLIC OR ADMIN ROUTE
router.get("/", getAllUsers);

export default router;
