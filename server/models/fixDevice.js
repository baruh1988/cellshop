const Sequelize = require("sequelize");
const connection = require("../middleware/connection");

const FixDevice = connection.define("fixDevice", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
    imei: Sequelize.INTEGER,
    inventoryId: Sequelize.INTEGER,
    inStock: Sequelize.BOOLEAN
});

module.exports = FixDevice;