import User from "../models/User.js";
import bcrypt from "bcryptjs";

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
