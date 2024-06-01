import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
  destination: "public/uploads/product",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize upload
// Adjust number of files if necessary
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 15 }, // 5 MB limit
}).fields([
  { name: "colors[0][images]", maxCount: 10 },
  { name: "colors[1][images]", maxCount: 10 },
  { name: "colors[2][images]", maxCount: 10 },
  { name: "colors[3][images]", maxCount: 10 },
  { name: "colors[4][images]", maxCount: 10 },
  { name: "colors[5][images]", maxCount: 10 },
  { name: "colors[6][images]", maxCount: 10 },
  { name: "colors[7][images]", maxCount: 10 },
  { name: "colors[8][images]", maxCount: 10 },
  { name: "colors[9][images]", maxCount: 10 },
  { name: "colors[10][images]", maxCount: 10 },
  { name: "colors[11][images]", maxCount: 10 },
  { name: "colors[12][images]", maxCount: 10 },
  { name: "colors[13][images]", maxCount: 10 },
  { name: "colors[14][images]", maxCount: 10 },
  { name: "colors[15][images]", maxCount: 10 },
  { name: "colors[16][images]", maxCount: 10 },
  { name: "colors[17][images]", maxCount: 10 },
  { name: "colors[18][images]", maxCount: 10 },
  { name: "colors[19][images]", maxCount: 10 },
  { name: "colors[20][images]", maxCount: 10 },
  { name: "colors[21][images]", maxCount: 10 },
  { name: "colors[22][images]", maxCount: 10 },
  { name: "colors[23][images]", maxCount: 10 },
  { name: "colors[24][images]", maxCount: 10 },
  { name: "colors[25][images]", maxCount: 10 },
  { name: "colors[26][images]", maxCount: 10 },
  { name: "colors[27][images]", maxCount: 10 },
  { name: "colors[28][images]", maxCount: 10 },
  { name: "colors[29][images]", maxCount: 10 },
  { name: "colors[30][images]", maxCount: 10 },

  // Add more fields as necessary
]);

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

export default upload;
