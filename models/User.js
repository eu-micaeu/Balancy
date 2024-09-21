const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model { }

User.init({

    user_id: { 

      type: DataTypes.INTEGER,

      autoIncrement: true,

      primaryKey: true,

    },

    username: { 

      type: DataTypes.STRING,

      allowNull: false,

      unique: true,

    },

    password: { 

      type: DataTypes.STRING,

      allowNull: false,

    },

    height: { 

      type: DataTypes.FLOAT,

      allowNull: false,

    },

    weight: { 

      type: DataTypes.FLOAT,

      allowNull: false,

    },

    gender: { 

      type: DataTypes.STRING,

      allowNull: false,

    },

    age: { 

      type: DataTypes.INTEGER,

      allowNull: false,

    },

    activityLevel:{

      type: DataTypes.STRING,

      allowNull: false,

    },


}, {

    sequelize, 
  
    modelName: 'users', 
  
    timestamps: false 

});

module.exports = User;