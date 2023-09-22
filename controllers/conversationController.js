const db = require('../models');

exports.createConversation = async (req, res) => {
    try {
        // Assuming the user's ID is stored in req.userId from a middleware
        const userId = req.userId;

        const conversation = await db.Conversation.create({ userId });

        return res.status(201).json({ message: 'Conversation started', conversation });
    } catch (error) {
        console.error('Error creating conversation:', error);
        return res.status(500).json({ error: 'Server error creating conversation.' });
    }
};
exports.listConversations = async (req, res) => {
    try {
        const userId = req.userId;

        const conversations = await db.Conversation.findAll({ where: { userId } });

        return res.status(200).json(conversations);
    } catch (error) {
        console.error('Error listing conversations:', error);
        return res.status(500).json({ error: 'Server error listing conversations.' });
    }
};
exports.addMessage = async (req, res) => {
    try {
        const { content, type } = req.body;
        const { conversationId } = req.params;

        if (type !== 'user' && type !== 'ai') {
            return res.status(400).json({ error: 'Invalid message type.' });
        }

        const message = await db.Message.create({
            content,
            type,
            conversationId,
            userId: req.userId  // store the userId only if the type is 'user'
        });

        return res.status(201).json({ message: 'Message added', message });
    } catch (error) {
        console.error('Error adding message:', error);
        return res.status(500).json({ error: 'Server error adding message.' });
    }
};
exports.viewConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const messages = await db.Message.findAll({
            where: { conversationId },
            order: [['createdAt', 'ASC']]
        });

        return res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching conversation:', error);
        return res.status(500).json({ error: 'Server error fetching conversation.' });
    }
};
exports.deleteConversation = async (req, res) => {
    try {
        let { conversationId } = req.params;
        const userId = req.userId;

        // Parse the conversationId as an integer
        conversationId = parseInt(conversationId, 10);

        // Check if parsed value is a valid number
        if (isNaN(conversationId)) {
            return res.status(400).json({ error: 'Invalid conversation ID format.' });
        }

        // First, find the conversation
        const conversation = await db.Conversation.findOne({
            where: {
                id: conversationId,
                userId: userId
            }
        });

        // Check if conversation exists and belongs to the user
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found or you do not have permission to delete it.' });
        }

        // Sequelize's cascading delete will handle removing the associated messages
        await conversation.destroy();

        return res.status(200).json({ message: 'Conversation deleted successfully.' });

    } catch (error) {
        console.error('Error deleting conversation:', error);
        return res.status(500).json({ error: 'Server error deleting conversation.' });
    }
};
