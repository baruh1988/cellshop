const Sequelize = require("sequelize");
const connection = require("../middleware/connection");

const NewDevice = connection.define("newDevice", {
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

module.exports = NewDevice;