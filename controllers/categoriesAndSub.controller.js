import { Title, Category, SubCategory } from "../models/catAndSubCat.model.js";

const addTitle = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { name } = req.body;
    const existingTitle = await Title.findOne({ name });
    if (existingTitle) {
      return res.status(400).json({ message: "Title already exists" });
    }
    const title = new Title({ name });
    await title.save();
    return res.status(201).json({ message: "Title added successfully", title });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const editTitle = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { id } = req.params;
    const { name } = req.body;
    const title = await Title.findById(id);
    if (!title) {
      return res.status(404).json({ message: "Title not found" });
    }
    title.name = name;
    await title.save();
    return res.status(200).json({ message: "Title updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteTitle = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { id } = req.params;
    const title = await Title.findByIdAndDelete(id);
    if (!title) return res.status(404).json({ message: "Title not found" });
    await Category.updateMany({ title: id }, { $unset: { title: "" } });
    res.status(200).json({ message: "Title deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTitles = async (req, res) => {
  try {
    const titles = await Title.find()
      .populate({
        path: "categories",
        select: "name",
        populate: { path: "subCategories", select: "name" },
      })
      .exec();
    if (!titles) {
      return res.status(404).json({ message: "Titles not found" });
    }
    return res.status(200).json(titles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addCategory = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { name, titleId } = req.body;
    const title = await Title.findById(titleId);
    if (!title) {
      return res.status(404).json({ message: "Title not found" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const category = new Category({ name, title: titleId });
    await category.save();
    title.categories.push(category._id);
    await title.save();
    return res.status(201).json({ message: "Category added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const editCategory = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    category.name = name;
    await category.save();
    return res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    await SubCategory.deleteMany({ category: id });
    res
      .status(200)
      .json({ message: "Category and its subcategories deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("title", "name")
      .populate("subCategories", "name")
      .exec();
    if (!categories) {
      return res.status(404).json({ message: "Categories not found" });
    }
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addSubCategory = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { name, categoryId } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const subCategory = new SubCategory({ name, category: categoryId });
    await subCategory.save();
    category.subCategories.push(subCategory._id);
    await category.save();
    return res.status(201).json({ message: "Sub-category added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const editSubCategory = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { id } = req.params;
    const { name } = req.body;
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({ message: "Sub-category not found" });
    }
    subCategory.name = name;
    await subCategory.save();
    return res
      .status(200)
      .json({ message: "Sub-category updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteSubCategory = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findByIdAndDelete(id);
    if (!subCategory) {
      return res.status(404).json({ message: "Sub-category not found" });
    }
    await subCategory.deleteOne();
    return res
      .status(200)
      .json({ message: "Sub-category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate({ path: "category", select: "name" })
      .exec();
    if (!subCategories) {
      return res.status(404).json({ message: "Sub-categories not found" });
    }
    if (subCategories.length === 0) {
      return res.status(200).json({ message: "No sub-categories found" });
    }
    return res.status(200).json(subCategories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getServiceByPath = async (req, res) => {
  try {
    const { titleName, categoryName, subCategoryName } = req.params;
    const title = await Title.findOne({ name: titleName }).populate(
      "categories"
    );
    if (!title) {
      return res.status(404).json({ message: "Title not found" });
    }

    const category = await Category.findOne({
      name: categoryName,
      title: title._id,
    }).populate("subCategories");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subCategory = await SubCategory.findOne({
      name: subCategoryName,
      category: category._id,
    });
    if (!subCategory) {
      return res.status(404).json({ message: "Sub-category not found" });
    }

    return res.status(200).json({
      message: "Service found",
      data: {
        title: title.name,
        category: category.name,
        subCategory: subCategory.name,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  addTitle,
  editTitle,
  deleteTitle,
  getTitles,
  addCategory,
  editCategory,
  deleteCategory,
  getCategories,
  addSubCategory,
  editSubCategory,
  deleteSubCategory,
  getSubCategories,
  getServiceByPath,
};
