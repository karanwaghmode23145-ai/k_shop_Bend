import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User Controller
export const registerUser = async (req, res) => {
  console.log("📩 Incoming Request Body:", req.body);
  try {
    const { firstName, lastName, email, phone, address, password } = req.body;
    console.log("➡ Extracted Data:");
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Address:", address);
    console.log("Password:", password);

    // 1️⃣ Check if user exists
    const userExists = await User.findOne({ email });
    console.log("🔍 Checking User Exists:", userExists);

    if (userExists) {
      console.log("❌ Email already exists!");
      return res.status(400).json({ message: "Email already exists" });
    }

    // 2️⃣ Hash Password
    console.log("🔐 Hashing password...");
    const hashedPass = await bcrypt.hash(password, 10);
    console.log("🔐 Hashed Password:", hashedPass);

    // 3️⃣ Create New User
    console.log("📌 Creating new user...");
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      address,
      password: hashedPass,
    });

    console.log("✅ User Created Successfully:");
    console.log(user);

    // 4️⃣ Send Response
    res.status(201).json({
      message: "User Registered Successfully",
      user,
    });
    
  } catch (error) {
    console.log("🔥 ERROR OCCURED:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get All Users

export const getAllUsers = async (req, res) => {
  try {
    console.log("📥 Fetching all users...");

     const users = await User.find().select("-password"); 
    // password hide kar diya

     console.log("📤 Total Users Found:", users.length);

     res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
    
  } catch (error) {
    console.log("🔥 Error Fetching Users:", error.message);
    res.status(500).json({ message: error.message });
  }
}

// LOGIN USER

export const loginUser = async (req, res) =>{
  try {
    const { email, password } = req.body;

    console.log("📥 Login API Hit");
    console.log("👉 Received:", req.body);

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: "Invalid password" });

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login Success:", user.email);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
      }
    });

    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}