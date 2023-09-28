const express = require('express');
const app = express();
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const exphbs = require('express-handlebars');
const Conversation = db.Conversation; // Import the Conversation model

const publicRoutes = [
    '/register',
    '/login',
    // add any other routes that should be accessible without authentication
];


const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Load environment variables from .env file
dotenv.config();

const sessionStore = new SequelizeStore({
    db: db.sequelize
});

// Middlewares
app.use(express.json()); // To parse JSON requests
// Serve static files from the public directory
app.use('/public', express.static('public'));


app.use(session({
    secret: process.env.SESSION_SECRET || 'local_secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
       secure: process.env.NODE_ENV === 'production',
    },
}));

// Middleware to fetch user
app.use(async (req, res, next) => {
    if (req.session.userId) {
        req.userId = req.session.userId;
        req.user = await db.User.findByPk(req.session.userId);
    }
    next();
});


// Test endpoint
app.get('/test', (req, res) => {
    res.send('Test endpoint');
});

// Use the user and conversation routes middleware
app.use(userRoutes);
app.use(conversationRoutes);  // Adding conversation routes after user routes

// handlebars routes
app.get('/response', (req, res) =>{
    res.render('response')
})
app.get('/', (req, res) => {
    res.render('landingPage')
})
app.get('/chatPage', (req, res) => {
    res.render('chatPage')
})
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Define a route to get the latest conversation for the user
app.get('/conversations/latest', async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Try to find the latest conversation for the user
        const conversation = await Conversation.findOne({
            where: { userId: userId },
            order: [['createdAt', 'DESC']]
        });

        if (!conversation) {
            // If no conversation is found, return a null conversationId
            return res.status(200).json({ conversationId: null });
        } else {
            // If a conversation is found, return its ID
            return res.status(200).json({ conversationId: conversation.id });
        }
    } catch (error) {
        console.error('Error fetching the latest conversation:', error);
        return res.status(500).json({ error: 'Server error fetching latest conversation ID.' });
    }
});


// Define a POST route to create a new conversation
app.post('/conversations', async (req, res) => {
    try {
      // Assuming you have userId in req object from session middleware
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
  
      // Create a new conversation for the user
      const conversation = await Conversation.create({ userId });
      return res.status(201).json({ conversationId: conversation.id });
    } catch (error) {
      console.error('Error creating a new conversation:', error);
      return res.status(500).json({ error: 'Server error creating a new conversation.' });
    }
  });
  



// Initialize and listen on port
db.sequelize.sync().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
});

// Model attribute check
if ("resetCode" in db.User.rawAttributes) {
    console.log("resetCode exists in the User model.");
} else {
    console.log("resetCode does not exist in the User model.");
}
