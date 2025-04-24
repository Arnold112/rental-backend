// Express.js backend for rental property listings

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB setup
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PropertySchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
});
const Property = mongoose.model("Property", PropertySchema);

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "rental-properties",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// Routes
app.get("/properties", async (req, res) => {
  const properties = await Property.find();
  res.json(properties);
});

app.post("/properties", upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  const imageUrl = req.file.path;

  const property = new Property({ title, description, imageUrl });
  await property.save();

  res.status(201).json(property);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});