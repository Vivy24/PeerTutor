const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const poolQuery = require("../../db/postgresql/queries");

// @route: POST api/admins
// @desc: Promote an admin by user email
// @access: private (admin only)
router.post(
  "/",
  check("email", "Please include a valid email").isEmail(),
  auth,
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
      }
      const requester = await poolQuery.getUserByID(req.user.id);
      if (requester.role == "SAdmin") {
        try {
          let adminUser = await poolQuery.getUserByEmail(req.body.email);
          if (adminUser && adminUser.role != "Admin") {
            await poolQuery.promoteToAdmin(adminUser.id);
            res.status(200).json("Promoted successfully");
          } else if (!adminUser) {
            res
              .status(400)
              .json({ errors: [{ msg: "This email is not exist" }] });
          } else if (!adminUser) {
            res
              .status(400)
              .json({ errors: [{ msg: "This user is an admin already" }] });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json("Server error");
        }
      } else {
        res
          .status(403)
          .json([{ msg: "You are not authorize to perform this action" }]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json("Server error");
    }
  }
);

// @route: DELETE api/admins
// @desc: Demote an admin by user email
// @access: private (admin only)
router.delete("/", auth, async (req, res) => {
  try {
    const adminUser = await poolQuery.getUserByID(req.user.id);

    if (adminUser.role == "SAdmin") {
      const emailOfAdmin = req.body.email;
      console.log("This is something", req.body.email);
      const neededActionUser = await poolQuery.getUserByEmail(emailOfAdmin);
      console.log(neededActionUser);
      if (neededActionUser) {
        try {
          await poolQuery.demoteAdmin(neededActionUser.id);
          res.status(200).json(neededActionUser.id);
        } catch (e) {
          console.error(error);
          res.status(500).json("Server error");
        }
      } else {
        res
          .status(400)
          .json({ errors: [{ msg: "Cannot find your requested account" }] });
      }
    } else {
      res
        .status(403)
        .json([{ msg: "You are not authorize to perform this action" }]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
});

module.exports = router;
