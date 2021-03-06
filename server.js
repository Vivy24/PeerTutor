// set up server
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");

const port = process.env.PORT || 8000;
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.json());
app.use(express.static(__dirname));

app.use("/api/auth", require("./server/routes/api/auth"));
app.use("/api/users", require("./server/routes/api/user"));
app.use("/api/admins", require("./server/routes/api/admin"));
app.use("/api/requests", require("./server/routes/api/request"));
app.use("/api/meetings", require("./server/routes/api/meeting"));
app.use("/api/tutors", require("./server/routes/api/tutor"));
app.use("/api/forgetpassword", require("./server/routes/api/resetPassword"));
app.use("/api/reviews", require("./server/routes/api/review"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
  });

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
  });
}

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(port, () => console.log(`Server starts at ${port}`));
