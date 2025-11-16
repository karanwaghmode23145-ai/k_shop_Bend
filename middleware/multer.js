import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "myUploads",
    allowed_formats: ["jpg", "jpeg", "png"],

    transformation: [
      {
        width: 600,
        height: 600,
        crop: "fill",
        quality: "auto"
      }
    ]
  },
});

const upload = multer({ storage });

export default upload;
