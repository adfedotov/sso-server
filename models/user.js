const mongoose = require('mongoose');
const conn = require('../db/db').getDb();
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    last_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        maxlength: 128
    },
    admin: {
        type: Boolean,
        default: false
    },
    registration_date: {
        type: Date,
        default: Date.now
    }
});

UserSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
}

UserSchema.statics.checkPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}

module.exports = conn.model('User', UserSchema);
