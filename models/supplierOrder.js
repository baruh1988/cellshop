const { STRING } = require('sequelize');
const Sequelize = require('sequelize');
const connection = require('../middleware/connection');

const SupplierOrder = connection.define('supplierOrder', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    supplierId: Sequelize.INTEGER,
    userId: Sequelize.INTEGER,
    firstName: Sequelize.INTEGER,
    isOpen: Sequelize.BOOLEAN
});

module.exports = SupplierOrder;