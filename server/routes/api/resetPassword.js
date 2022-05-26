const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const poolQuery = require("../../db/postgresql/queries");
const { check, validationResult } = require("express-validator");

const transporter = require("../../passwordReset/emailSender");

router.post(
  "/",
  check("email", "please include an email").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await poolQuery.getUserForResetPassword(req.body.email);
    if (user) {
      const payload = {
        id: user.id,
        email: user.email,
      };
      const secret = user.password;
      const token = jwt.sign(payload, secret);

      const url = `${process.env.CLIENT_URL}/resetpassword/${user.id}/${token}`;
      // set up the mail data
      const mailData = {
        from: process.env.NODEMAIL_EMAIL,
        to: req.body.email,
        subject: "Reseting password  - Peer Tutor",
        html: `
        <h3>Hello ${user.name} </h3>
        <p>There is a request to reset your password. If you are not aware about it, please gladly contact an admin about your problem.</p>
        <h4>To reset your password</h4>
        <p>Click <a href=${url}>here</a> to reset your password</p>
        
        </hr>
        <p>Please do not reply to this email. Contact admin instead ! Thank you</p>
        `,
      };

      transporter.sendMail(mailData, function (err) {
        if (!err) {
          res.status(200).json("Send reset password successfully!");
        } else {
          console.error(err);
          res.status(500).json("Server Error");
        }
      });
    } else {
      res
        .status(400)
        .json([{ msg: "This email is not associated with any user" }]);
    }
  }
);

router.post(
  "/reset",
  check("userId", "Please include a user id").exists(),
  check("token", "Please include a token").exists(),
  check("password", "Please include a new password").exists(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // get user by id
    const user = await poolQuery.getUserForResetPasswordById(req.body.userId);

    if (user) {
      const secret = user.password;

      // check token valid
      try {
        const decoded = await jwt.verify(req.body.token, secret);
        if (decoded) {
          const salt = await bcrypt.genSalt(10);
          const encryptedPassword = await bcrypt.hash(req.body.password, salt);

          await poolQuery.changePassword(encryptedPassword, req.body.userId);

          return res.status(200).json("Reset password successfully");
        }

        // token is valid
      } catch (error) {
        console.error(error);
        return res.status(500).json("Server Error");
      }
    } else {
      return res.status(400).json({ msg: "Request is not valid" });
    }
  }
);
module.exports = router;
