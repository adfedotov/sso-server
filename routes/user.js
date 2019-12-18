const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/user');

router.param('id', (req, res, next, id) => {
    User.findOne({_id: new mongoose.Types.ObjectId(id)}, 'first_name last_name email registration_date', (err, user) => {
        if (err) return res.status(404).end();
        else if (user) {
            req.user = user;
            next();
        }
        else return res.status(404).end();
    });
});

router.get('/:id', (req, res) => {
    res.end(JSON.stringify(req.user));
});

module.exports = router;
