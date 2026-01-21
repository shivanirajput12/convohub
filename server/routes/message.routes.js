import express from "express";
import { getAllUsers, sendMessage, getMessages } from "../controllers/message.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/users", isAuthenticated, getAllUsers);
router.get("/conversation/:conversationId", isAuthenticated, getMessages);
router.post("/send/:conversationId", isAuthenticated, sendMessage);

export default router;
