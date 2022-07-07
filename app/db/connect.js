const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('Connected to database');
    } catch(err) {
        throw err;
    }
};

module.exports = connectDB;
