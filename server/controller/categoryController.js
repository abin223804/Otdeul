import { Category } from "../models/category.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import upload from "../middlewares/multerMiddleware.js";

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
    let uploadError = new Error('invalid image type');
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, isValid);
  }
}).fields([
  { name: 'icon', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]);




const addCategory = async (req, res) => {
  const files = req.files;
  if (!files) return res.status(400).send("No image in the request");

  // const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;

  const icon = files.icon ? `${basePath}${files.icon[0].filename}` : null;
  const coverImage = files.coverImage
    ? `${basePath}${files.coverImage[0].filename}`
    : null;
  const banner = files.banner ? `${basePath}${files.banner[0].filename}` : null;

  let category = new Category({
    name: req.body.name,
    description: req.body.description,
    icon: icon,
    coverImage: coverImage,
    banner: banner,
  });

  category = await category.save();

  if (!category) return res.status(500).send("The category cannot be created");

  res.send(category);
};

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

const removeCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    await Subcategory.deleteMany({ parentCategoryId: categoryId });
    res
      .status(200)
      .json({ message: "Category and its subcategories deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default { addCategory, updateCategory, removeCategory };
