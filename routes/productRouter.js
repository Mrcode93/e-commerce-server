const express = require("express");
const router = express.Router();
const productController = require("../controllers/productControllers");
const middleWare = require("../middleware/middleWare");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const path = require("path");

const keyFilePath = path.join(
  __dirname,
  "../white-position-425923-g0-5bf066b2a3d9.json"
);

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: keyFilePath,
});

const bucket = storage.bucket(process.env.BUCKET_NAME);

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

const uploadToGCS = (file) => {
  return new Promise((resolve, reject) => {
    const blob = bucket.file(Date.now() + "-" + file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    blobStream.on("error", (err) => {
      reject(err);
    });

    blobStream.on("finish", () => {
      resolve(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
    });

    blobStream.end(file.buffer);
  });
};

router.post(
  "/products",
  middleWare,
  upload.single("image"),
  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const publicUrl = await uploadToGCS(req.file);
      req.body.imageUrl = publicUrl; // Add the public URL to the request body
      productController.addProduct(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/products", productController.getProducts);

router.get("/products/latest", productController.getLatestProducts);

router.get("/products/:id", productController.getProductById);

router.put("/products/:id", middleWare, productController.updateProduct);

router.delete("/products/:id", middleWare, productController.deleteProduct);

router.get("/products/category/:id", productController.getProductsByCategory);

router.get("/products/name/:name", productController.getProductsByName);

router.get("/products/price/:min/:max", productController.getProductsByPrice);

module.exports = router;
