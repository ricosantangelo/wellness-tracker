const OpenAIApi = require('openai');
const openai = new OpenAIApi({ key: process.env.OPENAI_API_KEY });
const db = require('../models');  // Assuming this is the path to your Sequelize models

exports.talkWithAI = async (req, res) => {
    const { message } = req.body;
    const userId = req.userId; // Assuming you've set this up in middleware as before.
    const conversationId = req.params.conversationId;
   

    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { "role": "system", "content": "You are a helpful assistant." },
                { "role": "user", "content": message }
            ]
        });

        const aiMessage = response.choices[0].message.content.trim();

        // Store user's message in the database
        await db.Message.create({
            content: message,
            type: 'user',
            userId: userId,
            conversationId: conversationId
        });

        // Store AI's response in the database (linking to the user for clarity)
        await db.Message.create({
            content: aiMessage,
            type: 'ai',
            userId: userId,  // Linking AI message to the user for continuity
            conversationId: conversationId
        });

        return res.status(200).json({ aiMessage });

    } catch (error) {
        console.error('Error talking with AI:', error);
        return res.status(500).json({ error: 'Server error communicating with AI.' });
    }
};
