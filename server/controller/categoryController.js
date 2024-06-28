import { Category, Subcategory } from "../models/category.js";
import multer from "multer";
import { uploadOptions } from "../config/categ_multer_config.js";




const addCategory = async (req, res) => {
  try {
    uploadOptions(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ msg: err.message });
      } else if (err) {
        return res.status(500).json({ msg: 'Unknown error occurred', error: err.message });
      }

      // Proceed with handling form data
      const files = req.files;
      if (!files) return res.status(400).send('No image in the request');

      const icon = files.icon ? `public/uploads/category/${files.icon[0].filename}` : null;
      const coverImage = files.coverImage ? `public/uploads/category/${files.coverImage[0].filename}` : null;
      const banner = files.banner ? `public/uploads/category/${files.banner[0].filename}` : null;

      let categoryData = {
        name: req.body.name,
        parentCategory: req.body.parentCategory,
        description: req.body.description,
        icon: icon,
        coverImage: coverImage,
        banner: banner,
      };

      // Handle category or subcategory creation based on parentCategory
      if (!req.body.parentCategory || req.body.parentCategory === 'No parent') {
        let category = new Category(categoryData);
        category = await category.save();

        if (!category) return res.status(500).send('The category cannot be created');

        res.send(category);
      } else {
        const parentCategory = await Category.findById(req.body.parentCategory);
        if (!parentCategory) return res.status(400).send('Invalid parent category');

        categoryData.parent = req.body.parentCategory;
        let subcategory = new Subcategory(categoryData);
        subcategory = await subcategory.save();

        if (!subcategory) return res.status(500).send('The subcategory cannot be created');

        parentCategory.subcategories.push(subcategory);
        await parentCategory.save();

        res.send(subcategory);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};










const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const files = req.files;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;

    let updateData = {
      name: req.body.name,
      description: req.body.description,
    };

    if (files) {
      if (files.icon) {
        updateData.icon = `${basePath}${files.icon[0].filename}`;
      }
      if (files.coverImage) {
        updateData.coverImage = `${basePath}${files.coverImage[0].filename}`;
      }
      if (files.banner) {
        updateData.banner = `${basePath}${files.banner[0].filename}`;
      }
    }

    const category = await Category.findByIdAndUpdate(categoryId, updateData, {
      new: true,
    });

    if (!category)
      return res.status(500).send("The category cannot be updated");

    res.send(category);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the category");
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) return res.status(404).send("The category was not found");

    res.send({ message: "Category successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the category");
  }
};

const listCategory = async (req, res) => {
  try {
    const all = await Category.find({});
    res.json(all);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
};

const readCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
};

//categoryCount

const categoryCount = async (req, res) => {
  try {
    const count = await Category.countDocuments();
    res.json(count);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
};





const updateSubcategory = async (req, res) => {
  try {
    const subcategoryId = req.params.id; // Get the subcategory ID from request parameters
    const files = req.files;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;

    let updateData = {}; // Initialize an empty object to store update data

    // Check if there are uploaded files and update image URLs accordingly
    if (files) {
      if (files.icon) {
        updateData.icon = `${basePath}${files.icon[0].filename}`;
      }
      if (files.coverImage) {
        updateData.coverImage = `${basePath}${files.coverImage[0].filename}`;
      }
      if (files.banner) {
        updateData.banner = `${basePath}${files.banner[0].filename}`;
      }
    }

    // Update other fields if provided in the request body
    if (req.body.name) {
      updateData.name = req.body.name;
    }
    if (req.body.description) {
      updateData.description = req.body.description;
    }
    if (req.body.parentCategoryId) {
      updateData.parentCategoryId = req.body.parentCategoryId;
    }

    // Find the subcategory by ID and update it with the new data
    const subcategory = await Subcategory.findByIdAndUpdate(
      subcategoryId,
      updateData,
      { new: true }
    );

    console.log(updateData.name);

    if (!subcategory) {
      return res.status(404).send("Subcategory not found");
    }

    // console.log(subcategory.updateData.name);

    res.send(subcategory); // Send the updated subcategory as the response
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the subcategory");
  }
};

const deleteSubcategory = async (req, res) => {
  try {
    const subCategoryId = req.params.id;

    const subCategory = await Subcategory.findByIdAndDelete(subCategoryId);

    if (!subCategory)
      return res.status(404).send("The Subcategory was not found");

    res.send({ message: "SubCategory successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the subcategory");
  }
};

const listSubcategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId).populate(
      "subcategories"
    );

    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.json(category.subcategories);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error.message);
  }
};

const readSubCategory = async (req, res) => {
  try {
    const subCategory = await Subcategory.findOne({ _id: req.params.id });
    return res.status(200).json(subCategory);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
};

export default {
  addCategory,
  updateCategory,
  deleteCategory,
  listCategory,
  readCategory,
  // addSubcategory,
  updateSubcategory,
  deleteSubcategory,
  listSubcategory,
  readSubCategory,
  categoryCount,
};
