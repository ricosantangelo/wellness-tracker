const express = require('express');
const router = express.Router();

const conversationController = require('../controllers/conversationController');
const aiController = require('../controllers/aiController');

// Route to render chat page
router.get('/chat', conversationController.renderChatPage);


// Create a new conversation
router.post('/conversations', conversationController.createConversation);

// Get all conversations of a user
router.get('/conversations', conversationController.listConversations);

// Get a single conversation by its ID
router.get('/conversations/latest', conversationController.getLatestConversationId);


router.get('/conversations/:conversationId', conversationController.viewConversation);

// Endpoint to interact with the AI within a conversation context
router.post('/conversations/:conversationId/ai', aiController.talkWithAI);

// Delete a conversation by its ID
router.delete('/conversations/:conversationId', conversationController.deleteConversation);






module.exports = router;
