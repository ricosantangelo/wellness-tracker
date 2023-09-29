'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if userId column already exists in Conversations table
    const tableDescription = await queryInterface.describeTable('Conversations');
    
    if (!tableDescription.userId) {
        // If userId column does not exist, add it
        await queryInterface.addColumn('Conversations', 'userId', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });
    }
},

  async down(queryInterface, Sequelize) {
    // Remove userId column from Conversations table
    await queryInterface.removeColumn('Conversations', 'userId');
  }
};
