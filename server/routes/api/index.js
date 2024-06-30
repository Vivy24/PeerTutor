// set up server
require("dotenv").config()
const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")
const port = process.env.PORT || 8000
app.use(express.static(path.join(__dirname, "client/build")))
app.use(express.json())
app.use(express.static(__dirname))
app.use(
  cors({
    origin: "*",
  })
)
app.use("/api/auth", require("./auth"))
app.use("/api/users", require("./user"))
app.use("/api/admins", require("./admin"))
app.use("/api/requests", require("./request"))
app.use("/api/meetings", require("./meeting"))
app.use("/api/tutors", require("./tutor"))
app.use("/api/forgetpassword", require("./resetPassword"))
app.use("/api/reviews", require("./review"))
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
