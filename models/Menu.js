const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Menu extends Model { }

Menu.init({

    menu_id: { 
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    menu_name: { 
        type: DataTypes.STRING,
        allowNull: false
    },

    menu_foods: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: false,
        defaultValue: []
    },

    menu_calories: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        }
    }

}, {

    sequelize, 
    modelName: 'menus', 
    timestamps: false 

});

module.exports = Menu;
