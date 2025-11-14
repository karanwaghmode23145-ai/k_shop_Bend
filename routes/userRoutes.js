import express from "express";
import { registerUser, getAllUsers,loginUser } from "../controllers/userController.js";

const router = express.Router();

// POST → Register
router.post("/register", registerUser);

// GET → All users
router.get("/", getAllUsers);

// POST → login
router.post("/login", loginUser);


export default router;
