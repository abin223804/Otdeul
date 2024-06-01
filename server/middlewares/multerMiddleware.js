import multer from 'multer';
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
  destination: 'public/uploads/product',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
// Adjust number of files if necessary
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 15 }, // 5 MB limit
}).fields([
  { name: 'colors[0][images]', maxCount: 10 },
  { name: 'colors[1][images]', maxCount: 10 },
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
    cb('Error: Images Only!');
  }
}

export default upload;
