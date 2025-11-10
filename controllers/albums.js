import { Router } from "express";
import Album from "../models/album.js";
import { albumSchema, albumIdSchema } from "../utils/validators.js";
import { HttpError, NOT_FOUND } from "../utils/HttpError.js";
import { validate } from "../middleware/validateRequest.js";
import { requireAuth } from "../middleware/auth.js";

const SUCCESS_NO_CONTENT = 204;

const albumRouter = Router();

// Get all albums for the logged-in user
albumRouter.get("/", requireAuth, async (req, res) => {
  const albums = await Album.find({ userId: req.session.userId }).exec();
  res.json(albums);
});

// Get single album by ID
albumRouter.get("/:id", requireAuth, validate(albumIdSchema), async (req, res) => {
  // Only return album if it belongs to the logged-in user
  const album = await Album.findOne({
    _id: req.params.id,
    userId: req.session.userId,
  }).exec();

  if (!album) {
    throw new HttpError(NOT_FOUND, "Could not find album");
  }

  res.json(album);
});

// Create new album
albumRouter.post("/", requireAuth, validate(albumSchema), async (req, res) => {
  const { title, artist, genre, year, listened, rating, review } = req.body;

  // Associate album with the logged-in user
  const album = await Album.create({
    title,
    artist,
    genre,
    year,
    listened: listened || false,
    rating,
    review,
    userId: req.session.userId,
  });

  res.status(201).json(album);
});

// Update album
albumRouter.put(
  "/:id",
  requireAuth,
  validate(albumIdSchema),
  validate(albumSchema),
  async (req, res) => {
    const { title, artist, genre, year, listened, rating, review } = req.body;

    const album = await Album.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.session.userId,
      },
      {
        title,
        artist,
        genre,
        year,
        listened,
        rating,
        review,
      },
      { new: true }
    ).exec();

    if (!album) {
      throw new HttpError(NOT_FOUND, "Could not find album");
    }

    res.json(album);
  }
);

// Delete album
albumRouter.delete("/:id", requireAuth, validate(albumIdSchema), async (req, res) => {
  // Only delete album if it belongs to the logged-in user
  const result = await Album.findOneAndDelete({
    _id: req.params.id,
    userId: req.session.userId,
  }).exec();

  if (!result) {
    throw new HttpError(NOT_FOUND, "Could not find album");
  }

  res.status(SUCCESS_NO_CONTENT).end();
});

export default albumRouter;
