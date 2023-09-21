'use strict';
const bcrypt = require('bcrypt');
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A user can have multiple conversations
      User.hasMany(models.Conversation, {
        foreignKey: 'userId',
        as: 'conversations',
      });
    }
  }
  
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        const hashedPassword = bcrypt.hashSync(value, 10);  // Hash the password
        this.setDataValue('password', hashedPassword);
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
