const { STRING } = require("sequelize");
const Sequelize = require("sequelize");
const connection = require("../middleware/connection");

const TimeSheet = connection.define("timeSheet", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: Sequelize.INTEGER,
  start: Sequelize.DATE,
  end: Sequelize.DATE,
  isOpen: Sequelize.BOOLEAN
});

module.exports = TimeSheet;
