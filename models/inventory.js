const { STRING } = require("sequelize");
const Sequelize = require("sequelize");
const connection = require("../middleware/connection");

const Inventory = connection.define("inventory", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  modelId: Sequelize.INTEGER,
  description: Sequelize.TEXT,
  serialNumber: Sequelize.STRING,
  quantity: Sequelize.INTEGER,
  price: Sequelize.DOUBLE,
  quantityThreshold: Sequelize.INTEGER,
  image: Sequelize.STRING,
});

module.exports = Inventory;
