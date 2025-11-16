import express from "express";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File not uploaded" });
    }

    res.json({
      message: "Upload successful",
      url: req.file.path, // Cloudinary URL
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
