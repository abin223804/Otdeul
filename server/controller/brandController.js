import Brand from "../models/brand.js";

import asyncHandler from "../middlewares/asyncHandler.js";

const addBrand = asyncHandler(async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    if (!description || !name) {
      return res
        .status(400)
        .json({ error: "Brand name and description are required." });
    }

    const brand = new Brand({
      name,
      description,
      isActive,
    });

    const brandDoc = await brand.save();

    res.status(200).json({
      success: true,
      message: "Brand added successfully",
      brand: brandDoc,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be completed,please try again",
    });
  }
});

const listBrand = asyncHandler(async (req, res) => {
  try {
    const allBrand = await Brand.find();
    res.status(200).json(allBrand);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const updateBrand = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const deleteBrand = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.findOneAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.status(200).json({success: `${brand.name} deleted Successfully`,brand});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const toggleBrandActiveStatus = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    brand.isActive = !brand.isActive;
    brand.updated = new Date();

    await brand.save();

    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default {
  addBrand,
  listBrand,
  updateBrand,
  deleteBrand,
  toggleBrandActiveStatus,
};
