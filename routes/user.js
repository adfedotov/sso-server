const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

router.param('id', (req, res, next, id) => {
    let objId = null;
    try {
        objId = new mongoose.Types.ObjectId(id);
    } catch(err) {
        return res.send({error: 'User Not Found'});
    }

    User.findOne({_id: objId}, 'first_name last_name email registration_date', (err, user) => {
        if (err) return res.status(404).end();
        else if (user) {
            req.user = user;
            next();
        }
        else return res.send({error: 'User Not Found'});
    });
});

router.get('/:id', (req, res) => {
    res.end(JSON.stringify(req.user));
});

module.exports = router;
