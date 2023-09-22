const express = require('express');
const app = express();
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');  // Assuming the user routes are in the `routes` directory

// Load environment variables from .env file
dotenv.config();

const sessionStore = new SequelizeStore({
    db: db.sequelize
});

// Middlewares
app.use(express.json()); // To parse JSON requests

app.use(session({
    secret: process.env.SESSION_SECRET || 'local_secret', // Use an environment variable in production
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 1 week
        sameSite: 'lax',
    }
}));

// Middleware to fetch user
app.use(async (req, res, next) => {
    if (req.session.userId) {
        req.userId = req.session.userId;
        req.user = await db.User.findByPk(req.session.userId);
    }
    next();
});
app.get('/test', (req, res) => {
    res.send('Test endpoint');
});
// Use the user routes middleware
app.use(userRoutes);

// Initialize and listen on port
db.sequelize.sync().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
if ("resetCode" in db.User.rawAttributes) {
    console.log("resetCode exists in the User model.");
} else {
    console.log("resetCode does not exist in the User model.");
}
