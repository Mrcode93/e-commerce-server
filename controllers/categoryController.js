const categoryModel = require("../models/cantegoryModel");
//! add category =================================================================
exports.addCategory = async (req, res) => {
  const { name } = req.body;
  const categoryName = await categoryModel.findOne({ name });
  if (categoryName) {
    return res.status(400).json({ message: "Category already exists" });
  }

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  const category = new categoryModel({
    name,
  });
  await category.save();
  res.status(200).json({ message: "Category added successfully", category });
};

//! get all categories =================================================================
exports.getCategories = async (req, res) => {
  const categories = await categoryModel.find();
  res.status(200).json({ categories });
};

//! get category by id =================================================================
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  res.status(200).json({ category });
};

//! delete category =================================================================
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  await categoryModel.findByIdAndDelete(id);
  res.status(200).json({ message: "Category deleted successfully" });
};

//! update category =================================================================
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  await categoryModel.findByIdAndUpdate(id, { name });
  res.status(200).json({ message: "Category updated successfully", name });
};
