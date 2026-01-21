import jwt from "jsonwebtoken";

export const generateJwtToken = async (user, message, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  return res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development" ? true : false,
      sameSite: "strict",
      maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message,
      token,
    });
};
