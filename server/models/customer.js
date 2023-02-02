const { STRING } = require("sequelize");
const Sequelize = require("sequelize");
const connection = require("../middleware/connection");

const Customer = connection.define("customer", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  idNumber: Sequelize.STRING,
  userType: Sequelize.INTEGER,
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  //password: Sequelize.STRING,
  //address: Sequelize.STRING,
  email: Sequelize.STRING,
  //phoneNumber: Sequelize.STRING
});

module.exports = Customer;
