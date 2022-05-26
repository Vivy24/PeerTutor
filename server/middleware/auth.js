require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  } else {
    try {
      jwt.verify(token, process.env.JWTSECRET, (error, decoded) => {
        if (error) {
          return res.status(400).json({ msg: "Token is not valid" });
        } else {
          req.user = decoded.user;
          next();
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Server error" });
    }
  }
};
