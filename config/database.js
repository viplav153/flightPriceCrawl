const { Sequelize } = require('sequelize');

// Option 2: Passing parameters separately (other dialects)
module.exports = new Sequelize('flight_analysis', 'postgres', 'Viplav@153', {//database name,username,password
  host: 'localhost',
  dialect:'postgres',
});

