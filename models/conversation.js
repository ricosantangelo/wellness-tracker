'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Conversation, {
        foreignKey: 'userId',
        as: 'conversations',
      });
    }
    
  }
  Conversation.init({
   
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // 'Users' refers to the table name of User model, Sequelize automatically pluralizes it.
        key: 'id',
      }
    }
  }, {
    sequelize,
    modelName: 'Conversation',
  });
  return Conversation;
};
