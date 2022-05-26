const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const pool = require("../../db/postgresql/config").pool;
const poolQuery = require("../../db/postgresql/queries");
// @route POST api/requests
// @desc make a request to become an admin with their own subject (return requestID)
// @access private (user)

router.get("/", auth, async (req, res) => {
  const user = await poolQuery.getUserByID(req.user.id);
  if (user.role == "Admin" || user.role == "SAdmin") {
    try {
      const requests = await poolQuery.getPendingReqs();
      res.status(200).json(requests);
    } catch (error) {
      console.error(error);
      res.status(500).json("Server error");
    }
  } else {
    res.status(400).json([{ msg: "You are not allow to perform this action" }]);
  }
});

router.post(
  "/",
  auth,
  check("subject", "please choose a subject").notEmpty(),
  check("department", "please select a department").notEmpty(),
  async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    const user = await poolQuery.getUserByID(req.user.id);
    if (user.role == "Student") {
      try {
        await pool
          .query(
            "INSERT INTO tutorRequest (requesterID,subject,department, status) VALUES ($1,$2,$3,$4) RETURNING id",
            [
              user.id,
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
        res.status(500).send("Server error");
      }
    } else {
      res
        .status(400)
        .json([{ msg: "You are not allow to perform this action" }]);
    }
  }
);

// @route POST api/requests/approve
// @desc approve a request to become a tutor from student
// @access private (admin only)

router.post("/approve/:requestID", auth, async (req, res) => {
  const user = await poolQuery.getUserByID(req.user.id);

  if (user.role == "Admin" || user.role == "SAdmin") {
    try {
      const requestID = req.params.requestID;

      const request = await poolQuery.getRequestByID(requestID);
      const requester = await poolQuery.getUserByID(request.requesterid);

      if (request) {
        if (requester.role == "Student") {
          await poolQuery.promoteToTutor(
            requester.id,
            request.subject,
            request.department
          );

          await poolQuery.changeStatusRequest(requestID);

          res.status(200).json("Successfully Updated");
        } else {
          res
            .status(400)
            .json([{ msg: "You need to be a student to become a tutor" }]);
        }
      } else {
        res.status(400).json([{ msg: "This request is not exist" }]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json("Server error");
    }
  } else {
    res.status(403).json([{ msg: "You are not allow to perform this action" }]);
  }
});

// @route POST api/requests/delete
// @desc delete a request to become a tutor from student
// @access private (admin only)

router.delete("/:requestID", auth, async (req, res) => {
  const user = await poolQuery.getUserByID(req.user.id);

  if (user.role == "Admin" || user.role == "SAdmin") {
    try {
      const requestID = req.params.requestID;
      const request = await poolQuery.getRequestByID(requestID);
      if (request) {
        await poolQuery.deleteRequestByID(requestID);

        // just send back the request id be deleted
        res.status(200).json(requestID);
      } else {
        res.status(400).json([{ msg: "This request is not exist" }]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json("Server error");
    }
  } else {
    res.status(403).json([{ msg: "You are not allow to perform this action" }]);
  }
});

module.exports = router;
