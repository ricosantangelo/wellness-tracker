module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        content: {
            type: DataTypes.TEXT,  // Using TEXT type since messages can be long.
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('user', 'ai'),  // Message type can be 'user' or 'ai'.
            allowNull: false
        },
       
    });

    Message.associate = (models) => {
        // Associating Message with Conversation
        Message.belongsTo(models.Conversation, {
            foreignKey: 'conversationId',
            onDelete: 'CASCADE'  // if a Conversation is deleted, also delete associated messages.
        });

        // Associating Message with User (optional, if you want to track which user said what)
        Message.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'SET NULL' // if a User is deleted, set the userId of their messages to NULL.
        });
    };

    return Message;
};
