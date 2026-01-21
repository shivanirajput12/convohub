import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateJwtToken } from "../utils/jwtToken.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js";
import { v2 as cloudinary } from "cloudinary";

export const signup = catchAsyncError(async (req, res, next) => {
  // Signup logic
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Invalid email format", success: false });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
      success: false,
    });
  }

  const isEmailAlreadyRegistered = await User.findOne({ email });

  if (isEmailAlreadyRegistered) {
    return res
      .status(400)
      .json({ message: "Email is already registered", success: false });
  }

  // Hash password before saving

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
    avatar: {
      public_id: "",
      url: "",
    },
  });

  generateJwtToken(newUser, "User registered successfully", 201, res);
});

export const signin = catchAsyncError(async (req, res, next) => {
  // Signin logic
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required", success: false });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Invalid email format", success: false });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(401)
      .json({ message: "Invalid email or password", success: false });
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return res
      .status(401)
      .json({ message: "Invalid email or password", success: false });
  }

  generateJwtToken(user, "User signed in successfully", 200, res);
});

export const signout = catchAsyncError(async (req, res, next) => {
  // Signout logic
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development" ? true : false,
      sameSite: "strict",
      maxAge: 0,
    })
    .json({
      success: true,
      message: "User signed out successfully",
      token: null,
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
  // Get user logic
  // const user = await User.findById(req.user._id).select("-password");
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user,
  });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  // Update profile logic
  const { fullName, email } = req.body;
  const user = req.user;

  if (fullName?.trim() === 0 || email?.trim().length === 0) {
    return res.status(400).json({
      message: "Full name and email cannot be empty",
      success: false,
    });
  }
  const avatar = req?.files?.avatar;
  let cloudinaryResponse = {};
  if (avatar) {
    try {
      const oldAvatarPublicId = req.user?.avatar?.public_id;
      if (oldAvatarPublicId && oldAvatarPublicId.trim().length > 0) {
        // Delete old avatar from Cloudinary
        await cloudinary.uploader.destroy(oldAvatarPublicId);
      }
      cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
          folder: "convohub_avatars",
          transformation: [
            { width: 300, height: 300, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        },
      );
    } catch (error) {
      console.log(error, "cloudinary upload error");

      return res.status(500).json({
        message: "Avatar upload failed",
        success: false,
      });
    }
  }
  let data = {
    fullName,
    email,
  };

  if (
    avatar &&
    cloudinaryResponse?.public_id &&
    cloudinaryResponse?.secure_url
  ) {
    data.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  let userUpdated = await User.findByIdAndUpdate(req.user._id, data, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: userUpdated,
  });
});
