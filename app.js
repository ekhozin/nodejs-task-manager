require('dotenv').config();
const express = require('express');
const tasks = require('./app/routes/tasks');
const auth = require('./app/routes/auth');
const connectDB = require('./app/db/connect');
const notFoundController = require('./app/controllers/notFoundController');
const errorMiddleware = require('./app/middleware/errorMiddleware');
const authenticationMiddleware = require('./app/middleware/authenticationMiddleware');

const app = express();

/**
 * Middleware
 */
app.use(express.json());

/**
 * Routes
 */
app.use('/api/v1', auth);
app.use('/api/v1/tasks', authenticationMiddleware, tasks);

// handle unknown route
app.use('*', notFoundController);

/**
 * Error middleware
 */
app.use(errorMiddleware);

/**
 * Run server
 */
const startServer = async () => {
    try {
        await connectDB();
        app.listen(
            process.env.PORT,
            console.log(`Server is listening on ${process.env.HOST}:${process.env.PORT}`),
        );
    } catch(err) {
        console.log(err);
    }
};

startServer();
