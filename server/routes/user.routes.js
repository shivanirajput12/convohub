import express from "express";
import {
  getUser,
  signin,
  signout,
  signup,
  updateProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", isAuthenticated, signout);
router.get("/me", isAuthenticated, getUser);
router.put("/updateprofile", isAuthenticated, updateProfile);

export default router;
