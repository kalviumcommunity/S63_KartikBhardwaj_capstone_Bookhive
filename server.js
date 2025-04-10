const express = require('express');
const app = express();
const bookRoutes = require("./routes/bookRoutes");

const mongoose = require('mongoose');
require('dotenv').config();

// Middleware
app.use(express.json());

// ROUTER USE KARNA
app.use('/api/books', bookRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});