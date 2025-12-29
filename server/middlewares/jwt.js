import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const checkJWT = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    console.log("Decoded JWT:", decoded);
    next();
  } catch (err) {
    return res.json({
      success: false,
      message: `JWT Error: ${err.message}`,
      data: null,
    });
  }
};

export { checkJWT };
