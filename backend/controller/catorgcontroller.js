const Product = require("../model/productmodel");
const Category = require("../model/categorymodel");
const logActivity = require("../libs/logger");
const StockTransaction = require("../model/stocktransactionmodel");

module.exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required." });
    }
    const newCategory = new Category({ name, description });
    const savedCategory = await newCategory.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Category created successfully.",
        category: savedCategory,
      });

    await logActivity({
      action: "Create Category",
      description: `Category ${name} created.`,
      entity: "category",
      entityId: savedCategory._id,
      userId: req.user ? req.user._id : null,
      ipAddress: req.ip,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating category.", error });
  }
};

module.exports.RemoveCategory = async (req, res) => {
  try {
    const { CategoryId } = req.params;
    const userId = req.user._id;
    const ipAddress = req.ip;
    const DeletedCategory = await Category.findByIdAndDelete(CategoryId);

    if (!DeletedCategory) {
      return res.status(404).json({ message: "Category is not found!" });
    }

    await logActivity({
      action: "Delete Category",
      description: `Category "${DeletedCategory.name}" was deleted.`,
      entity: "category",
      entityId: DeletedCategory._id,
      userId: userId,
      ipAddress: ipAddress,
    });
    res.status(200).json({ message: "Category delete successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Category", error: error.message });
  }
};

module.exports.getCategory = async (req, res) => {
  try {
    const allCategories = await Category.find({});
    if (!allCategories || allCategories.length === 0) {
      return res.status(404).json({ message: "No categories found." });
    }

    const categoriesWithCount = await Promise.all(
      allCategories.map(async (category) => {
        const count = await Product.countDocuments({ category: category._id });
        return {
          ...category.toObject(),
          productCount: count,
        };
      }),
    );
    res.status(200).json({ categories: categoriesWithCount });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

module.exports.updateCategory = async (req, res) => {
  try {
    const { updatedCategory } = req.body;
    const { CategoryId } = req.params;
    const userId = req.user._id;
    const ipAddress = req.ip;
    const updatingCategory = await Category.findByIdAndUpdate(
      CategoryId,
      updatedCategory,
      { new: true },
    );

    if (!updatingCategory) {
      return res.status(400).json({ message: "Category is not found" });
    }
    await logActivity({
      action: "Update Category",
      description: `Category "${updatingCategory.name}" was updated.`,
      entity: "category",
      entityId: updatingCategory._id,
      userId: userId,
      ipAddress: ipAddress,
    });

    res.status(200).json({ message: "Category successfully updated" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error in update status Category",
        error: error.message,
      });
  }
};
