const db = require('../models');

const conversationController = {};

conversationController.renderChatPage = (req, res) => {
    res.render('chatPage');
};

conversationController.createConversation = async (req, res) => {
    try {
        const userId = req.userId;
        const conversation = await db.Conversation.create({ userId });
        return res.status(201).json({ message: 'Conversation started', conversation });
    } catch (error) {
        console.error('Error creating conversation:', error);
        return res.status(500).json({ error: 'Server error creating conversation.' });
    }
};

conversationController.listConversations = async (req, res) => {
    try {
        const userId = req.userId;
        const conversations = await db.Conversation.findAll({ where: { userId } });
        return res.status(200).json(conversations);
    } catch (error) {
        console.error('Error listing conversations:', error);
        return res.status(500).json({ error: 'Server error listing conversations.' });
    }
};

conversationController.addMessage = async (req, res) => {
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
            userId: req.userId
        });

        return res.status(201).json({ message: 'Message added', message });
    } catch (error) {
        console.error('Error adding message:', error);
        return res.status(500).json({ error: 'Server error adding message.' });
    }
};

conversationController.viewConversation = async (req, res) => {
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

conversationController.deleteConversation = async (req, res) => {
    try {
        let { conversationId } = req.params;
        const userId = req.userId;
        conversationId = parseInt(conversationId, 10);

        if (isNaN(conversationId)) {
            return res.status(400).json({ error: 'Invalid conversation ID format.' });
        }

        const conversation = await db.Conversation.findOne({
            where: {
                id: conversationId,
                userId: userId
            }
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found or you do not have permission to delete it.' });
        }

        await conversation.destroy();
        return res.status(200).json({ message: 'Conversation deleted successfully.' });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        return res.status(500).json({ error: 'Server error deleting conversation.' });
    }
};

module.exports = conversationController;
