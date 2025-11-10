import { Router } from "express";
import User from "../models/user.js";
import Album from "../models/album.js";
import { requireAdmin } from "../middleware/auth.js";

const adminRouter = Router();

// Get all users
adminRouter.get("/users", requireAdmin, async (_req, res) => {
  const users = await User.find().exec();
  res.json(users);
});

// Get all albums (across all users)
adminRouter.get("/albums", requireAdmin, async (_req, res) => {
  const albums = await Album.find().exec();
  res.json(albums);
});

export default adminRouter;
