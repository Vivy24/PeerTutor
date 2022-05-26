const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const poolQuery = require("../../db/postgresql/queries");
// @route GET api/auth
// @desc Get user by token id
// @access Private

router.get("/", auth, async (req, res) => {
  try {
    const user = await poolQuery.getUserByID(req.user.id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route POST api/auth
// @desc log user in and set up token via jwt
// @access Public

router.post(
  "/",
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await poolQuery.loggin(email);

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid username or password" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid username or password" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWTSECRET,
        { expiresIn: "24h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json("Server Error");
    }
  }
);

module.exports = router;
