import { Router } from "express";
import Review from "../models/review.js";
import { reviewSchema, reviewIdSchema } from "../utils/validators.js";
import { HttpError, NOT_FOUND, BAD_REQUEST } from "../utils/HttpError.js";
import { validate } from "../middleware/validateRequest.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

//const SUCCESS_NO_CONTENT = 204;

const reviewRouter = Router();

// Get all reviews for the logged-in user
reviewRouter.get("/", requireAuth, async (req, res) => {
  const reviews = await Review.find({ userId: req.session.userId}).exec();
  res.json(reviews);
});

// Get single review by ID
reviewRouter.get("/:id", requireAuth, validate(reviewIdSchema), async (req, res) => {
    //review can be viewed by any authenticated user
    const review = await Review.findOne({
      _id: req.params.id,
      userId: req.session.userId
    }).exec();

    if (!review) {
      throw new HttpError(NOT_FOUND, "Could not find review");
    }

    res.json(review);
  }
);

// Create new review
reviewRouter.post("/", requireAdmin, validate(reviewSchema), async (req, res) => {
    const { rating, comment, albumId } = req.body;

    //Check if the user has already reviewed the album
    const existingReview = await Review.findOne({
      albumId: albumId,
      userId: req.session.userId
    }).exec();

    if (existingReview) {
      throw new HttpError(BAD_REQUEST, "You have already reviewed this album");
    }

    // Associate review with the logged-in user
    const review = await Review.create({
      rating,
      comment,
      albumId,
      userId: req.session.userId,
    });

    res.status(201).json(review);
  }
);

// Update review
reviewRouter.put("/:id", requireAdmin, validate(reviewIdSchema), validate(reviewSchema), async (req, res) => {
    const { rating, comment } = req.body;

    const review = await Review.findOneAndUpdate(
      {
        _id: req.params.id,
         userId: req.session.userId
      },
      {
        rating,
        comment,
      },
      { new: true }
    ).exec();

    if (!review) {
      throw new HttpError(NOT_FOUND, "Could not find review");
    }

    res.json(review);
  }
);

// Delete review
reviewRouter.delete("/:id", requireAdmin, validate(reviewIdSchema), async (req, res) => {
    // Only delete review if it belongs to the logged-in user
    const result = await Review.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId
    }).exec();

    if (!result) {
      throw new HttpError(NOT_FOUND, "Could not find review");
    }

    res.status(200).json({ message: "Review deleted successfully" })
  }
);

export default reviewRouter;
