const mongoose = require('mongoose');
const config = require('../config/config');
const dbUri = `mongodb://${config.MONGO_USER}:${config.MONGO_PASS}@${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_DB}`;

let _db;

const options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}

module.exports = {
    connect: async () => {
        _db = mongoose.connection;

        _db.on('connecting', () => console.log('Connecting to MongoDB'));
        _db.on('connected', () => console.log('Connected to MongoDB'));
        _db.on('reconnected', () => console.log('Reconnected to MongoDB'));

        _db.on('error', err => {
            console.log('MongoDB connection error.\n' + err);
            setTimeout(async () => {
                console.log('Retrying to connect...');
                await mongoose.connect(dbUri, options).catch(err => {});
            }, 10000);
        });

        await mongoose.connect(dbUri, options).catch(err => {});
    },
    getDb: () => {
        return _db;
    }
}
