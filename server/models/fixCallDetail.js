const { STRING } = require("sequelize");
const Sequelize = require("sequelize");
const connection = require("../middleware/connection");

const FixCallDetail = connection.define("fixCallDetail", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  callId: Sequelize.STRING,
  fixDeviceId: Sequelize.STRING,
  faultTypeId: Sequelize.INTEGER,
  fixed: Sequelize.BOOLEAN,
  fixTypeId: Sequelize.INTEGER,
  note: Sequelize.STRING
});

module.exports = FixCallDetail;
