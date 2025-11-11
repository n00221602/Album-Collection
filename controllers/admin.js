import { Router } from "express";
import User from "../models/user.js";
import { requireAdmin } from "../middleware/auth.js";

const adminRouter = Router();

// Get all users
adminRouter.get("/users", requireAdmin, async (_req, res) => {
  const users = await User.find().exec();
  res.json(users);
});

export default adminRouter;
