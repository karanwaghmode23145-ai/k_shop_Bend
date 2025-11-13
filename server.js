// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static for uploads (images)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// health check
app.get('/', (req, res) => res.send('API is running'));

// error handlers
app.use(notFound);
app.use(errorHandler);

// connect to mongodb and start server
const PORT = process.env.PORT || 5003;

mongoose
  .connect(process.env.MONGO_URI)   // 🔥 updated – no deprecated options
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
