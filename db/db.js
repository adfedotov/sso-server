const mongoose = require('mongoose');
const dbUri = require('../config/config.json').DB_URI;

let _db;

module.exports = {
    connect: async () => {
        _db = mongoose.connection;

        _db.on('connecting', () => console.log('Connecting to MongoDB'));
        _db.on('connected', () => console.log('Connected to MongoDB'));
        _db.on('reconnected', () => console.log('Reconnected to MongoDB'));

        _db.on('error', err => {
            console.log('MongoDB connection error.\n' + err);
            mongoose.disconnect();
        });
        await mongoose.connect(dbUri, {useNewUrlParser: true, autoReconnect: true})
        .catch(err => {
            console.log('MongoDB connection error: ' + err);
        });
    },
    getDb: () => {
        return _db;
    }
}
