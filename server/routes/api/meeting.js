const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");

const poolQuery = require("../../db/postgresql/queries");
const { check, validationResult } = require("express-validator");
const pool = require("../../db/postgresql/config").pool;

// @route GET /api/meetings/tutor
// @desc Query  all meetings of the tutor user
// @access private (tutor)

router.get("/tutor", auth, async (req, res) => {
  try {
    const requester = await poolQuery.getUserByID(req.user.id);

    if (requester.role == "Tutor" || requester.role == "SAdmin") {
      const meetings = await poolQuery.getMeetingByTutor(req.user.id);
      res.status(200).json(meetings);
    } else {
      res
        .status(403)
        .json([{ msg: "You are not authorize to perform this action" }]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// @route GET /api/meetings/student
// @desc Query all meetings of the student user
// @access private (student, tutor)

router.get("/student", auth, async (req, res) => {
  try {
    const requester = await poolQuery.getUserByID(req.user.id);

    if (requester) {
      const meetings = await poolQuery.getMeetingByStudent(req.user.id);
      res.status(200).json(meetings);
    } else {
      res
        .status(400)
        .json([{ msg: "Something went wrong! Contact super admin!" }]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// @route GET /api/meetings
// @desc Query all meetings;
// @access private (admin)
router.get("/", auth, async (req, res) => {
  try {
    const requester = await poolQuery.getUserByID(req.user.id);

    if (requester.role == "Admin") {
      const meetings = await poolQuery.getAllMeetings();

      res.status(200).json(meetings);
    } else {
      res
        .status(403)
        .json([{ msg: "You are not authorize to perform this action" }]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// @route GET /api/meetings/meetingID
// @desc Query  a  meeting by ID
// @access private
router.get("/:meetingID", auth, async (req, res) => {
  try {
    const meeting = await Meeting.findByID(req.params.meetingID);

    if (meeting) {
      res.status(200).json(meeting);
    }
    res.status.json(400).json([{ msg: "This meeting is not exist" }]);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// @route POST /api/meetings
// @desc create a meeting (daily)
// @access private
router.post(
  "/",
  check("studentID", "Please include a student id").notEmpty(),
  check("tutorID", "Please include a tutor id").notEmpty(),
  check("date", "Please pick a date").notEmpty(),
  check("type", "Please choose a type").notEmpty(),
  auth,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    if (req.body.tutorID == req.body.studentID) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Can not book yourself" }] });
    }

    let tutorID;
    let studentID;

    tutorID = req.body.tutorID;
    studentID = req.body.studentID;

    if (req.body.type == "Daily" && tutorID && studentID) {
      let date = new Date(req.body.date);
      date.setMinutes(
        date.getMinutes() - date.getTimezoneOffset() - date.getTimezoneOffset()
      );

      const formatedDate = date.toISOString().slice(0, 19).replace("T", " ");

      // checking if there is any meeting exists yet
      const meeting = await poolQuery.getMeetingByDateAndTutor(
        tutorID,
        formatedDate
      );

      if (meeting) {
        res.status(400).json({
          errors: [
            {
              msg: "This meeting is exist , please contact admin about this issue",
            },
          ],
        });
      } else {
        try {
          await poolQuery
            .createAMeeting(formatedDate, tutorID, studentID, "Booked")
            .then((result) => {
              res.status(200).json(result);
            });
        } catch (error) {
          console.error(error);
          res.status(500).json("Server Error");
        }
      }
    } else if (req.body.type == "Monthly") {
      const formatedDates = req.body.date.map((date) => {
        let monthlyDate = new Date(date);
        monthlyDate.setMinutes(
          monthlyDate.getMinutes() -
            monthlyDate.getTimezoneOffset() -
            monthlyDate.getTimezoneOffset()
        );

        return monthlyDate.toISOString().slice(0, 19).replace("T", " ");
      });

      const checkDate = await Promise.all(
        formatedDates.map(async (date) => {
          let result;
          await poolQuery
            .getMeetingByDateAndTutor(tutorID, date)
            .then((res) => {
              result = res;
            });

          return result;
        })
      );

      if (
        checkDate.some((res) => {
          return res != undefined;
        })
      ) {
        res.status(400).json({
          errors: [
            {
              msg: "Some meeting are exist , please contact admin about this issue",
            },
          ],
        });
      } else {
        const createdMeeting = await Promise.all(
          formatedDates.map(async (date) => {
            try {
              await poolQuery.createAMeeting(
                date,
                tutorID,
                studentID,
                "Booked"
              );
            } catch (error) {
              console.error(error);
              res.status(500).json([{ msg: "Server Error" }]);
            }
          })
        );
        res.status(200).json("Booking Successfully");
      }
    } else {
      res.status(400).json({
        errors: [{ msg: "Lacking of information to create meeting" }],
      });
    }
  }
);

router.get("/pendingMeeting/:tutorID", auth, async (req, res) => {
  try {
    const meetings = await poolQuery.getAllPendingMeetings(req.params.tutorID);
    res.status(200).json(meetings);
  } catch (e) {
    console.error(e);
    res.status(500).json("Server Error");
  }
});

// @route PUT /api/meetings/approve
// @desc approve meeting based on meetingID
// @access private (tutor only)
router.put("/approve", auth, async (req, res) => {
  try {
    const meetingID = req.body.meetingID;
    const meeting = await poolQuery.getAMeeting(meetingID);
    if (meeting) {
      await poolQuery.finishMeeting(meetingID).then(() => {
        res.status(200).json(meetingID);
      });
    } else {
      res.status(400).json("A meeting is not exist");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// @route PUT /api/meetings/delete
// @desc delete meeting based on meetingID
// @access private
router.put("/delete", auth, async (req, res) => {
  try {
    const meetingID = req.body.meetingID;
    const meeting = await poolQuery.getAMeeting(meetingID);
    if (meeting) {
      await poolQuery.deleteMeeting(meetingID);
      res.status(200).json(meetingID);
    } else {
      res.status(400).json("A meeting is not exist");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
