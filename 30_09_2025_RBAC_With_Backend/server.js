require('dotenv').config();   // Load .env first

const User = require('./models/user');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

const app = express();

// MongoDB Connection
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB is connected.');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Session configuration
const sessionOption = {
    secret: "c1c13D#2E!3D#2E!c13c13D#2E!D#2E!",
    resave: false,
    saveUninitialized: false
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressSession(sessionOption));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routers
const recordsRoutes = require('./routes/records');
const authRoutes = require('./routes/auth');

app.use('/auth', authRoutes);
app.use('/records', recordsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
