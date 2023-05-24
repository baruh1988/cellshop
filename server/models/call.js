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
  active: Sequelize.BOOLEAN,
  note: Sequelize.TEXT,
});

module.exports = Call;
