const { STRING } = require("sequelize");
const Sequelize = require("sequelize");
const connection = require("../middleware/connection");

const WorkSchedule = connection.define("workSchedule", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: Sequelize.INTEGER,
  day: Sequelize.DATEONLY,
  shiftId: Sequelize.INTEGER
});

module.exports = WorkSchedule;
