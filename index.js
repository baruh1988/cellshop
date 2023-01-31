// Import libraries
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const session = require("express-session");
const connection = require("./middleware/connection");
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.locals.moment = require("moment");

const fileStorage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, "public/images");
  },
  filename: (request, file, cb) => {
    cb(null, getNewDateString(Date()) + "-" + file.originalname);
  },
});

app.use(
  multer({ storage: fileStorage, limits: { fileSize: 25033697 } }).array(
    "image"
  )
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static("images"));

// Session
app.use(
  session({
    secret: "8EP8ojnX3yrcSb1ry185mNZYGSKe3oL8",
    resave: false,
    saveUninitialized: false,
  })
);

// Routes
const usersRoute = require("./controllers/users");
app.use("/users", usersRoute);

// Connection
const port = 3789;
connection
  .sync()
  .then((result) => {
    app.listen(port, function () {
      console.log(result);
      console.log(`Server is working well via port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

function getNewDateString(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear(),
    hour = d.getHours(),
    min = d.getMinutes(),
    second = d.getSeconds();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [day, month, year, hour, min, second].join("");
}
