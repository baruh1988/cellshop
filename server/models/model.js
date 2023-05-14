const { STRING } = require("sequelize");
const Sequelize = require("sequelize");
const connection = require("../middleware/connection");

const Model = connection.define("model", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  manufacturerId: Sequelize.INTEGER,
  name: Sequelize.STRING
});

module.exports = Model;
