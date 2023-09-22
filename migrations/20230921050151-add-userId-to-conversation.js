'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add userId column to Conversations table
    await queryInterface.addColumn('Conversations', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true,  // assuming a conversation might exist without an associated user, adjust as per your requirements
      references: {
        model: 'Users',  // table name, not object name
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove userId column from Conversations table
    await queryInterface.removeColumn('Conversations', 'userId');
  }
};
