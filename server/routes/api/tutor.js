const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const poolQuery = require("../../db/postgresql/queries");
const { check, validationResult } = require("express-validator");
const pool = require("../../db/postgresql/config").pool;
router.get("/", auth, async (req, res) => {
  try {
    const users = await poolQuery.getTutor();

    if (users.length != 0) {
      res.status(200).json(users);
    } else {
      res.status(400).json({ errors: [{ msg: "Do not have any tutors" }] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

router.get("/:tutorID", auth, async (req, res) => {
  try {
    const user = await poolQuery.getUserByID(req.params.tutorID);
    if (user.role == "Tutor") {
      res.status(200).json(user);
    } else {
      res.status(400).json("Invalid userID");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

router.post("/search", auth, async (req, res) => {
  try {
    const tutors = await poolQuery.getTutorsByDepartmentAndSubject(
      req.body.department,
      req.body.subject
    );

    if (tutors.length > 0) {
      res.status(200).json(tutors);
    } else {
      res.status(400).json({
        errors: [
          { msg: "We do not have any tutor in this subject and department" },
        ],
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

router.post(
  "/edit",
  check("department", "Please include a department").exists(),
  check("subject", "Please include a subject").exists(),
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const requester = await poolQuery.getUserByID(req.user.id);

      if (requester.role == "Tutor") {
        try {
          await poolQuery.clearTutor(req.user.id);

          await pool
            .query(
              "INSERT INTO tutorRequest (requesterID,subject,department, status) VALUES ($1,$2,$3,$4) RETURNING id",
              [
                req.user.id,
                req.body.subject.toLowerCase(),
                req.body.department.toLowerCase(),
                "Pending",
              ]
            )
            .then((result) => {
              res.status(200).json(result.id);
            })
            .catch((e) => {
              throw e;
            });
        } catch (error) {
          console.error(error);
          res.status(500).json("Server Error");
        }
      } else {
        res.status(400).json({
          errors: [{ msg: "You are not allow to perform this action" }],
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json("Server Error");
    }
  }
);

module.exports = router;
