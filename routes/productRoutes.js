// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, admin } = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');

// multer setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}-${Math.round(Math.random()*1E9)}.${ext}`);
  }
});
const upload = multer({ storage });

// public
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// protected admin routes for create/update/delete
router.post('/', protect, admin, upload.single('image'), productController.createProduct);
router.put('/:id', protect, admin, upload.single('image'), productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;
