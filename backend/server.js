// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const brandRoutes = require('./routes/brands');

require('./models/initModels');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/brands', brandRoutes);

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
