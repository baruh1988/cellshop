const Sequelize = require("sequelize");
const connection = require("../middleware/connection");

const InventoryItemType = connection.define("inventoryItemType", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: Sequelize.STRING
});

module.exports = InventoryItemType;