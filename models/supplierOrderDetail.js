const { STRING } = require('sequelize');
const Sequelize = require('sequelize');
const connection = require('../middleware/connection');

const SupplierOrderDetail = connection.define('supplierOrderDetail', {
    supplierOrderId: Sequelize.INTEGER,
    inventoryId: Sequelize.INTEGER,
    quantity: Sequelize.INTEGER,
    isProvided: Sequelize.BOOLEAN
});

module.exports = SupplierOrderDetail;