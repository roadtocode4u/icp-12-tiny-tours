import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Tiny Tours" });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.post("/signup", async (req, res) => {
  const { name, email, mobile, city, country, password } = req.body;

  if (!name) {
    return res.json({
      success: false,
      message: "Name is required",
      data: null,
    });
  }

  if (!email) {
    return res.json({
      success: false,
      message: "Email is required",
      data: null,
    });
  }

  if (!password) {
    return res.json({
      success: false,
      message: "Password is required",
      data: null,
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.json({
      success: false,
      message: "User with this email already exists",
      data: null,
    });
  }

  const newUser = new User({
    name,
    email,
    mobile,
    city,
    country,
    password,
  });

  try {
    const savedUser = await newUser.save();

    return res.json({
      success: true,
      message: "User registered successfully",
      data: savedUser,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: `User registration failed: ${error.message}`,
      data: null,
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.json({
      success: false,
      message: "Email is required",
      data: null,
    });
  }

  if (!password) {
    return res.json({
      success: false,
      message: "Password is required",
      data: null,
    });
  }

  const existingUser = await User.findOne({ email, password }).select("-password");

  if (existingUser) {
    return res.json({
      success: true,
      message: "Login successful",
      data: existingUser,
    });
  } else {
    return res.json({
      success: false,
      message: "Invalid email or password",
      data: null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  connectDB();
});
