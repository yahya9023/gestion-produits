const multer = require('multer');
const path = require('path');

// تحديد فولدر التخزين واسم الملف
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // فولدر uploads فالمشروع (خاصك تصايبه)
  },
  filename: function(req, file, cb) {
    // نحافظو على الاسم الأصلي مع إضافة وقت للتفادي التضارب
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// فلترة الملفات باش نقبلو غير الصور
function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
}

const upload = multer({ storage, fileFilter });

module.exports = upload;
