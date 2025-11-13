// controllers/productController.js
const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  const { name, description, price, countInStock, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';
  const product = new Product({ name, description, price, countInStock, category, image });
  const created = await product.save();
  res.status(201).json(created);
};

exports.getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const { name, description, price, countInStock, category } = req.body;
  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.countInStock = countInStock ?? product.countInStock;
  product.category = category ?? product.category;
  if (req.file) product.image = `/uploads/${req.file.filename}`;

  const updated = await product.save();
  res.json(updated);
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.remove();
  res.json({ message: 'Product removed' });
};
