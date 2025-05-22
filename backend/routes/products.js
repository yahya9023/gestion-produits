// backend/routes/products.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getAll, getById, add, update, remove } = require('../controllers/productController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});

const upload = multer({ storage });

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', upload.single('image'), add);
router.put('/:id', upload.single('image'), update);  // تعديل منتج مع صورة (اختياري)
router.delete('/:id', remove);               // حذف منتج

module.exports = router;
