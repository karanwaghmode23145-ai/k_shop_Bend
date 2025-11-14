import express from "express";
import { registerUser, getAllUsers } from "../controllers/userController.js";

const router = express.Router();

// POST → Register
router.post("/register", registerUser);

// GET → All users
router.get("/", getAllUsers);


export default router;
