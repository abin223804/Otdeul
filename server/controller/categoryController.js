import { Category } from "../models/category.js";
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

const readCategory = async(req,res)=>{
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
}







export default { addCategory, updateCategory, deleteCategory, listCategory,readCategory };
