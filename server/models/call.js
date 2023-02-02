const { STRING } = require("sequelize");
const Sequelize = require("sequelize");
const connection = require("../middleware/connection");

const Call = connection.define("call", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  callTypeId: Sequelize.INTEGER,
  customerId: Sequelize.INTEGER,
  userId: Sequelize.INTEGER,
  imei: Sequelize.STRING,
  active: Sequelize.BOOLEAN,
  openedAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  note: Sequelize.TEXT,
});

module.exports = Call;
