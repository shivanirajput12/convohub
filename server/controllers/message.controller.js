import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const filteredUsers = await User.find({ _id: { $ne: user } }).select(
    "-password",
  );
  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    users: filteredUsers,
  });
});

export const getMessages = catchAsyncError(async (req, res, next) => {
  const receiverId = req.params.id;

  const myId = req.user._id;
  const reciever = await User.findById(receiverId);
  if (!reciever) {
    return res.status(404).json({
      success: false,
      message: "Receiver not found",
    });
  }

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: receiverId },
      { senderId: receiverId, receiverId: myId },
    ],
  });
  res.status(200).json({
    success: true,
    message: "Messages fetched successfully",
    messages,
  }).sort({ createdAt: 1 });
});

export const sendMessage = catchAsyncError(async (req, res, next) => {});
