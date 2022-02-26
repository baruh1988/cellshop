const { STRING } = require('sequelize');
const Sequelize = require('sequelize');
const connection = require('../middleware/connection');

const WorkSchedule = connection.define('workSchedule', {
    userId: Sequelize.INTEGER,
    day: Sequelize.DATE,
    shiftId: Sequelize.INTEGER
});

module.exports = WorkSchedule;