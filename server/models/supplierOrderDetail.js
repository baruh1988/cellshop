const { STRING } = require("sequelize");
const Sequelize = require("sequelize");
const connection = require("../middleware/connection");

const SupplierOrderDetail = connection.define("supplierOrderDetail", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  supplierOrderId: Sequelize.INTEGER,
  inventoryItemId: Sequelize.INTEGER,
  quantity: Sequelize.INTEGER,
  received: Sequelize.BOOLEAN,
});

module.exports = SupplierOrderDetail;
