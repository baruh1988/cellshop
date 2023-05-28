const { STRING } = require("sequelize");
const Sequelize = require("sequelize");
const connection = require("../middleware/connection");

const FixCallDetailInventory = connection.define("fixCallDetailInventory", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fixCallDetailId: Sequelize.INTEGER,
  inventoryId: Sequelize.INTEGER,
  quantity: Sequelize.INTEGER
});

module.exports = FixCallDetailInventory;
