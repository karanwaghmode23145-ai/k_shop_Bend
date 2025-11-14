import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";


const app = express();

// fix __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static folder (uploads)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// routes
app.use("/api/users", userRoutes);

// health check
app.get("/", (req, res) => res.send("API is running"));



const PORT = process.env.PORT || 5003;

// connect DB + start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.log("MongoDB Error:", err.message);
    process.exit(1);
  });
