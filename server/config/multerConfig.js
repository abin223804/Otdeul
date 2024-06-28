import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, 
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
});


const variationFields = Array.from({ length: 10 }, (_, i) => ({
  name: `variations[${i}].photo`,
  maxCount: 1
}));

variationFields.unshift({ name: 'thumbnail', maxCount: 1 });

const uploadFields = upload.fields(variationFields);

export default uploadFields;
