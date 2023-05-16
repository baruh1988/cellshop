const { STRING } = require("sequelize");
const Sequelize = require("sequelize");
const connection = require("../middleware/connection");

const Supplier = connection.define("supplier", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  idNumber: Sequelize.STRING,
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  phoneNumber: Sequelize.STRING,
});

module.exports = Supplier;
