// index.js
const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
const paymentRoutes = require('./Functions/Routes/paymentRoutes');
app.use('/api', paymentRoutes);

app.get('/', (req, res) => {
  res.send('Hello, Node.js Project!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
