const path = require("path");
const Category = require("../models/cantegoryModel");
const Product = require("../models/productModel");

// Function to upload a file to SFTP server
async function uploadFile(localFilePath) {
  try {
    // Connect to SFTP server
    await sftp.connect(sftpConfig);

    console.log(`File ${path.basename(localFilePath)} uploaded successfully.`);
  } catch (err) {
    console.error(`Error uploading file: ${err.message}`);
    throw err; // Re-throw error to handle it at higher level
  } finally {
    // Disconnect from SFTP server
    sftp.end();
  }
}

const fs = require("fs");

exports.addProduct = async (req, res) => {
  const { name, price, description, categories } = req.body;

  console.log(req.body);

  try {
    const newCategories = JSON.parse(categories);

    // Ensure categories is defined and is an array
    if (!Array.isArray(newCategories)) {
      return res
        .status(400)
        .json({ message: "Categories must be provided as an array" });
    }

    // Ensure categories exist
    const existingCategories = await Category.find({
      name: { $in: newCategories },
    });

    const nonExistingCategories = newCategories.filter(
      (category) => !existingCategories.some((cat) => cat.name === category)
    );

    if (nonExistingCategories.length > 0) {
      return res.status(400).json({
        message: `Categories do not exist: ${nonExistingCategories.join(", ")}`,
      });
    }

    // Check if req.file is defined and contains 'filename'
    if (!req.file || !req.file.filename) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imagePath = path.join(__dirname, "../uploads", req.file.filename);
    const remoteImagePath = `/uploads/${req.file.filename}`;

    // Log paths for debugging
    console.log("Local image path:", imagePath);
    console.log("Remote image path:", remoteImagePath);

    if (fs.existsSync(imagePath)) {
      console.log("File exists: ", imagePath);
    } else {
      console.log("File does not exist: ", imagePath);
      return res.status(500).json({ message: "File not found after upload" });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      image: remoteImagePath,
      categories: newCategories,
    });

    await newProduct.save();
    res
      .status(200)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//! get all products =================================================================
exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.status(200).json({ products });
};

//! update product =================================================================
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, categories } = req.body;

  // Check if req.files is defined and contains the 'image' property
  if (!req.files || !req.files.image) {
    // Handle case where no image file was uploaded
    try {
      await Product.findByIdAndUpdate(id, {
        name,
        price,
        description,
        categories,
      });
      res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    return;
  }

  // If req.files.image exists, proceed with uploading and updating
  const { image } = req.files;

  if (!name || !price || !description || !categories) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure categories exist
    const existingCategories = await Category.find({
      name: { $in: categories },
    }).lean();
    const existingCategoryNames = existingCategories.map((cat) => cat.name);

    // Check if all categories provided exist
    const nonExistingCategories = categories.filter(
      (cat) => !existingCategoryNames.includes(cat)
    );
    if (nonExistingCategories.length > 0) {
      return res.status(400).json({
        message: `Categories do not exist: ${nonExistingCategories.join(", ")}`,
      });
    }

    // Upload new image if provided
    const imagePath = path.join(__dirname, "..", "uploads", image.name); // Adjust as per your image upload path
    await image.mv(imagePath); // Move the uploaded file to a local directory
    const remoteImagePath = `/export/home/434379-e-commerce/htdocs/${image.name}`; // Adjust remote path as per your setup
    await uploadFile(imagePath, remoteImagePath);

    // Update product with new image path
    await Product.findByIdAndUpdate(id, {
      name,
      price,
      description,
      image: remoteImagePath, // Save the remote image path in the database
      categories,
    });

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//! get product by id =================================================================
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.status(200).json({ product });
};

//! delete product =================================================================const fs = require('fs');

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Image path:", imagePath);

    // Check if the file exists before attempting to delete it
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("Image file does not exist:", imagePath);
        return res.status(404).json({ message: "Image file does not exist" });
      }

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
          return res.status(500).json({ message: "Error deleting image file" });
        }

        res.status(200).json({
          message: "Product and associated image deleted successfully",
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//! get products by category =================================================================
exports.getProductsByCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.find({ categories: id });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//! get products by name =================================================================
exports.getProductsByName = async (req, res) => {
  const { name } = req.params;
  try {
    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//! get products by price =================================================================
exports.getProductsByPrice = async (req, res) => {
  const { min, max } = req.params;
  try {
    const products = await Product.find({ price: { $gte: min, $lte: max } });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//! get products by category =================================================================
