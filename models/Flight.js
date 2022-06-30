const Sequelize=require('sequelize');

const db=require('../config/database');//database

const Flight=db.define('flight',{
     
    id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey:true,
    },
    airline_name:
    {
        type : Sequelize.STRING,
        allowNull:false,
    },
    source:
    {
        type : Sequelize.STRING,
        allowNull:false,
    },
    destination:
    {
        type : Sequelize.STRING,
        allowNull:false,

    },
    job_run_date:
    {
        type: Sequelize.STRING,
       

    },
    one_day_ahead_10am:
    {
        type: Sequelize.INTEGER,
        

    },
    one_day_ahead_5pm:
    {
        type: Sequelize.INTEGER,
        
    },
    one_week_ahead_10am:
    {
        type: Sequelize.INTEGER,
        

    },
    one_week_ahead_5pm:
    {
        type: Sequelize.INTEGER,
        

    },
    one_month_ahead_10am:
    {
        type: Sequelize.INTEGER,
        

    },
    one_month_ahead_5pm:
    {
        type: Sequelize.INTEGER,
        

    },

})

module.exports=Flight;