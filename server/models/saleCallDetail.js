const { STRING } = require("sequelize");
const Sequelize = require("sequelize");
const connection = require("../middleware/connection");

const SaleCallDetail = connection.define("saleCallDetail", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  callId: sequelize.INTEGER,
  inventoryId: Sequelize.INTEGER,
  newDeviceId: sequelize.INTEGER,
  quantity: Sequelize.INTEGER,
});

module.exports = SaleCallDetail;
