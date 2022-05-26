const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

const bcrypt = require("bcryptjs/dist/bcrypt");
const pool = require("../../db/postgresql/config").pool;
const poolQuery = require("../../db/postgresql/queries");

// @route: POST api/users
// @desc: Register an student user and log in immediately
// @access: public

router.post(
  "/",
  check("name", "Name is required").notEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    } else {
      const { name, email, password } = req.body;

      try {
        let payload = {};
        const user = await poolQuery.getUserByEmail(email);
        if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "User already exists" }] });
        } else {
          const salt = await bcrypt.genSalt(10);
          const encryptedPassword = await bcrypt.hash(password, salt);

          await pool
            .query(
              "INSERT INTO users (email,name,role,password) VALUES ($1,$2,$3,$4) RETURNING id",
              [
                email.toLowerCase(),
                name.toLowerCase(),
                "Student",
                encryptedPassword,
              ]
            )
            .then((res) => {
              payload = {
                user: {
                  id: res.rows[0].id,
                },
              };
            })
            .catch((e) => {
              throw e;
            });
          jwt.sign(
            payload,
            process.env.JWTSECRET,
            { expiresIn: "7 days" },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
      }
    }
  }
);

router.get("/:userID", auth, async (req, res) => {
  try {
    const user = await poolQuery.getUserByID(req.user.id);

    if (user) {
      res.status(200).json(user);
    }
    res.status(400).json("Invalid userID");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

router.get("/all", auth, async (req, res) => {
  try {
    const adminUser = await poolQuery.getUserByID(req.user.id);

    console.log(adminUser);
    if (adminUser.role == "SAdmin") {
      try {
        const results = await poolQuery.getAllUser();
        res.status(200).json(results);
      } catch (error) {
        console.error(error);
        res.status(500).json("Server Error");
      }
    } else {
      res.status(400).json({
        errors: [{ msg: "You are not allow to perform this request" }],
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
