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
const userRoute = require("./controllers/user");
app.use("/user", userRoute);

const inventoryRoute = require("./controllers/inventory");
app.use("/inventory", inventoryRoute);

const callTypeRoute = require("./controllers/callType");
app.use("/callType", callTypeRoute);

const faultTypeRoute = require("./controllers/faultType");
app.use("/faultType", faultTypeRoute);

const fixTypeRoute = require("./controllers/fixType");
app.use("/fixType", fixTypeRoute);

const userTypeRoute = require("./controllers/userType");
app.use("/userType", userTypeRoute);

const manufacturerRoute = require("./controllers/manufacturer");
app.use("/manufacturer", manufacturerRoute);

const modelRoute = require("./controllers/model");
app.use("/model", modelRoute);

const customerRoute = require("./controllers/customer");
app.use("/customer", customerRoute);

const supplierRoute = require("./controllers/supplier");
app.use("/supplier", supplierRoute);

const supplierOrderRoute = require("./controllers/supplierOrder");
app.use("/supplierOrder", supplierOrderRoute);

const supplierOrderDetailRoute = require("./controllers/supplierOrderDetail");
app.use("/supplierOrderDetail", supplierOrderDetailRoute)

const inventoryItemTypeRoute = require("./controllers/inventoryItemType");
app.use("/inventoryItemType", inventoryItemTypeRoute);

const newDeviceRoute = require("./controllers/newDevice");
app.use("/newDevice", newDeviceRoute);

const fixDeviceRoute = require("./controllers/fixDevice");
app.use("/fixDevice", fixDeviceRoute);

const shiftRoute = require("./controllers/shift");
app.use("/shift", shiftRoute);

const workScheduleRoute = require("./controllers/workSchedule");
app.use("/workSchedule", workScheduleRoute);

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
