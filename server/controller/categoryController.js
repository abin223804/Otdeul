import { Category, Subcategory } from "../models/category.js";
// import asyncHandler from "../middlewares/asyncHandler.js";
// import upload from "../middlewares/multerMiddleware.js";
import multer from "multer";

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

export const uploadOptions = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, isValid);
  },
}).fields([
  { name: "icon", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);

const addCategory = async (req, res) => {
  try {
    const files = req.files;
    if (!files) return res.status(400).send("No image in the request");

    // const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;

    const icon = files.icon ? `${basePath}${files.icon[0].filename}` : null;
    const coverImage = files.coverImage
      ? `${basePath}${files.coverImage[0].filename}`
      : null;
    const banner = files.banner
      ? `${basePath}${files.banner[0].filename}`
      : null;

    let category = new Category({
      name: req.body.name,
      description: req.body.description,
      icon: icon,
      coverImage: coverImage,
      banner: banner,
    });

    category = await category.save();

    if (!category)
      return res.status(500).send("The category cannot be created");

    res.send(category);
  } catch (error) {
    console.error(error);
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

// Subcategory controller functions

const addSubcategory = async (req, res) => {
  try {
    const files = req.files;
    if (!files) return res.status(400).send("No image in the request");

    const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;

    const icon = files.icon ? `${basePath}${files.icon[0].filename}` : null;
    const coverImage = files.coverImage
      ? `${basePath}${files.coverImage[0].filename}`
      : null;
    const banner = files.banner
      ? `${basePath}${files.banner[0].filename}`
      : null;

    const { name, description, parentCategoryId } = req.body;

    // Validate parentCategoryId
    const parentCategory = await Category.findById(parentCategoryId);
    if (!parentCategory) {
      return res.status(400).send("Invalid parent category");
    }

    let subcategory = new Subcategory({
      name,
      description,
      icon,
      coverImage,
      banner,
      parentCategoryId,
    });

    subcategory = await subcategory.save();

    if (!subcategory)
      return res.status(500).send("The subcategory cannot be created");

    // Add subcategory reference to parent category
    parentCategory.subcategories.push(subcategory._id);
    await parentCategory.save();

    res.send(subcategory);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the subcategory");
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
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
  listSubcategory,
  readSubCategory,
};
