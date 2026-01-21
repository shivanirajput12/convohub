import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { catchAsyncError } from "./catchAsyncError.middleware.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      message: "user not authenticated, Please sign in",
      success: false,
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decoded) {
    return res
      .status(401)
      .json({ message: "Invalid token, please login again", success: false });
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    return res
      .status(401)
      .json({ message: "User not found, please sign in", success: false });
  }

  req.user = user;
  next();
});

export const handleInvalidToken = catchAsyncError(
  async (err, req, res, next) => {
    if (err.name !== "JsonWebTokenError") {
      return next(err);
    }

    return res
      .status(401)
      .json({ message: "Invalid token, please login again", success: false });
  },
);
