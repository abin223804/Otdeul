import { Category } from "../models/category";
import asyncHandler from "../middlewares/asyncHandler";
import upload from "../middlewares/multerMiddleware";

const createCategory = asyncHandler(async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      // File uploaded successfully
      const { name, description, banner, icon, coverImage } = req.body;
      const category = new Category({
        name,
        description,
        banner,
        icon,
        coverImage,
      });
      await category.save();
      res.status(201).json(category);
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;
    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      // File uploaded successfully
      const { name, description, banner, icon, coverImage } = req.body;
      const category = await Category.findByIdAndUpdate(
        categoryId,
        { name, description, banner, icon, coverImage },
        { new: true }
      );
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json(category);
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


const removeCategory = asyncHandler(async(req,res)=>{

    try {
        const { categoryId } = req.params;
        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) {
          return res.status(404).json({ error: 'Category not found' });
        }
        await Subcategory.deleteMany({ parentCategoryId: categoryId });
        res.status(200).json({ message: 'Category and its subcategories deleted successfully' });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }

})










export default { createCategory, updateCategory,removeCategory };
