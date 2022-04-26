const { STRING } = require('sequelize');
const Sequelize = require('sequelize');
const connection = require('../middleware/connection');

const ServiceCallDetail = connection.define('serviceCallDetail', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    faultTypeId: Sequelize.INTEGER,
    fixed: Sequelize.BOOLEAN,
    fixTypeId: Sequelize.INTEGER,
    inventoryId: Sequelize.INTEGER
});

module.exports = ServiceCallDetail;