import ImageKit from "@imagekit/nodejs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db.js";

dotenv.config();

// Routes
import { postLogin, postSignup } from "./controllers/auth.js";
import { getHealth, getHome } from "./controllers/health.js";
import { getTours, postTours, putTours } from "./controllers/tours.js";

// Middleware
import { checkJWT } from "./middlewares/jwt.js";

const app = express();
app.use(express.json());
app.use(cors());

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const PORT = process.env.PORT || 8080;

// health routes
app.get("/", getHome);

app.get("/auth", function (req, res) {
  // Your application logic to authenticate the user
  const { token, expire, signature } =
    client.helper.getAuthenticationParameters();
  res.send({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  });
});

app.get("/health", getHealth);

// auth routes
app.post("/signup", postSignup);
app.post("/login", postLogin);

// tours routes
app.post("/tours", checkJWT, postTours);
app.get("/tours", checkJWT, getTours);
app.put("/tours/:id", checkJWT, putTours);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  connectDB();
});
