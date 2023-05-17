const Sequelize = require("sequelize");
const connection = require("../middleware/connection");

const NewDevice = connection.define("newDevice", {
    imei: Sequelize.INTEGER,
    inventoryId: Sequelize.INTEGER,
    inStock: Sequelize.BOOLEAN
});

module.exports = NewDevice;