const Sequelize = require("sequelize");
const connection = require("../middleware/connection");

const FixDevice = connection.define("fixDevice", {
    imei: Sequelize.INTEGER,
    inventoryId: Sequelize.INTEGER,
    inStock: Sequelize.BOOLEAN
});

module.exports = FixDevice;