
import asyncHandler from "../middlewares/asyncHandler.js";
import Color from "../models/color.js";




const addColor = asyncHandler(async (req, res) => {
    const { colorName, colorCode } = req.body;
  
    if (!colorName || !colorCode) {
      return res
        .status(400)
        .json({ error: "Color name and color code are required." });
    }
  
    const newColor = new Color({
      colorName,
      colorCode,
    });
  
    await newColor.save();
  
    res.status(201).json({
      success: true,
      message: "Color added successfully.",
      color: newColor,
    });
  });


const getColors = asyncHandler(async(req,res)=>{

try {
    const allColors = await Color.find();

    if(!allColors){
        return res.status(404).json({message:"No colors found"})
    }

    res.status(200).json(allColors)
} catch (error) {
    res.status(400).json({ error: error.message });
    
}
})


const deleteColor = asyncHandler(async(req,res)=>{

    try {
        const color = await Color.findOneAndDelete(req.params.id)

        if(!color){
      return res.status(404).json({ error: "color not found" });
        }


    res.status(200).json({success: `${color.colorName} deleted Successfully`,color});

        
    } catch (error) {
    res.status(400).json({ error: error.message });
        
    }


})








  export default {addColor,getColors,deleteColor} ;