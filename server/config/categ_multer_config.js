import multer from 'multer';
import path from 'path';

// Define file type map for validation
const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

// Multer upload options
export const uploadOptions = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const isValid = !!FILE_TYPE_MAP[file.mimetype];
    const uploadError = isValid ? null : new Error('Invalid file type');
    cb(uploadError, isValid);
  },
}).fields([
  { name: 'icon', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
]);
