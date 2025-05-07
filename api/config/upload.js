import { v2 as cloudinary } from "cloudinary";
import multer, { memoryStorage } from "multer";
import path from "path";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: "fraz",
  api_key: "918927699917446",
  api_secret: "HsTLfU0FE5xPekWy39avQaDd5h4",
});

const storage = memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

// ==== Cloudinary Upload Helper ====
export const uploadToCloudinary = async (buffer, folder = "profile_pictures") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png"],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};

export default upload;
