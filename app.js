require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
const path = require("path")
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name';
// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
// Start the server after successfully connecting to the database

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.get("/",(req,res)=>{
  res.send("hello");
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});