const express = require("express");
const { check, validationResult } = require("express-validator");

const router = express.Router();
const poolQuery = require("../../db/postgresql/queries");
const auth = require("../../middleware/auth");

// desc: get all the review of the tutorID
router.get("/", auth, async (req, res) => {
  try {
    const tutorID = req.query.tutorID;

    const reviews = await poolQuery.getReviewByTutorID(tutorID);
    if (reviews.length > 0) {
      res.status(200).json(reviews);
    } else {
      res.status(400).json("This tutor does not have any reviews");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

router.post(
  "/",
  check("tutorID", "Please include a tutorID").exists(),
  check("reviewerID", "Please include a reviewerID").exists(),
  check("rating", "Please include a rating").exists(),
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const rating = parseInt(req.body.rating);
      let content = "";
      if (req.body.content) {
        content = req.body.content.trim().toLowerCase();
      }

      if (rating > -1 && rating < 6) {
        try {
          const createdReview = await poolQuery.createReview(
            req.body.tutorID,
            req.body.reviewerID,
            content,
            rating
          );

          if (createdReview) {
            return res.status(200).json(createdReview);
          } else {
            return res
              .status(500)
              .json("Cannot create a review. Please contact admin");
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json("Server Error");
        }
      } else {
        return res
          .status(400)
          .json({ errors: [{ msg: "Rating only from 0-5" }] });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json("Server Error");
    }
  }
);

module.exports = router;
