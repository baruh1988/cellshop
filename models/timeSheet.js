const { STRING } = require("sequelize");
const Sequelize = require("sequelize");
const connection = require("../middleware/connection");

const TimeSheet = connection.define("timeSheet", {
  userId: Sequelize.INTEGER,
  date: Sequelize.DATE,
  start: Sequelize.DATE,
  end: Sequelize.DATE,
});

module.exports = TimeSheet;
