import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

import { JWT_EXPIRATION } from "../config.js";

dotenv.config();

const postSignup = async (req, res) => {
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

  const salt = bcrypt.genSaltSync(10);
  const encryptedPassword = bcrypt.hashSync(password, salt);

  const newUser = new User({
    name,
    email,
    mobile,
    city,
    country,
    password: encryptedPassword,
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
};

const postLogin = async (req, res) => {
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

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.json({
      success: false,
      message: "User doesn't exist with this email, please sign up",
      data: null,
    });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  existingUser.password = undefined; // Hide password in response

  if (isPasswordCorrect) {
    const jwtToken = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: JWT_EXPIRATION,
      }
    );

    return res.json({
      success: true,
      message: "Login successful",
      data: existingUser,
      jwtToken: jwtToken,
    });
  } else {
    return res.json({
      success: false,
      message: "Invalid email or password",
      data: null,
    });
  }
};

export { postLogin, postSignup };
