// set up server
require("dotenv").config()
const express = require("express")
const app = express()
const path = require("path")

const port = process.env.PORT || 8000
app.use(express.static(path.join(__dirname, "client/build")))
app.use(express.json())
app.use(express.static(__dirname))

app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/users", require("./routes/api/user"))
app.use("/api/admins", require("./routes/api/admin"))
app.use("/api/requests", require("./routes/api/request"))
app.use("/api/meetings", require("./routes/api/meeting"))
app.use("/api/tutors", require("./routes/api/tutor"))
app.use("/api/forgetpassword", require("./routes/api/resetPassword"))
app.use("/api/reviews", require("./routes/api/review"))
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"))
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"))
})
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")))

  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build/index.html"))
  })

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"))
  })
}

app.listen(port, () => console.log(`Server starts at ${port}`))
