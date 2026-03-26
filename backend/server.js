import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer"; 
import authRoutes from "./routes/auth.js";
import ocrRoutes from "./routes/ocr.js"; 

dotenv.config(); // Load .env variables

const app = express();

//  Middleware
app.use(express.json());


app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,                        
}));


app.options("*", cors());

// File Upload Configuration
const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({ storage });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ocr", ocrRoutes); // OCR uses multer

// Root Route (For Testing)
app.get("/", (req, res) => {
  res.send("🚀 Nutriconnect API is running!");  
});

//MongoDB Connection 
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); 
  }
};

connectDB();

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));