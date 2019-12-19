const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/config');

router.post('/', (req, res) => {
    // TODO: Check credentials of the requesting server public/private keys?

    // Validate or deny the token
    if (!req.is('application/json') || !req.body.token || typeof req.body.token !== 'string') return res.status(400).end();
    const token = req.body.token;

    try {
        jwt.verify(token, config.SECRET);
    } catch(err) {
        return res.json({verified: false});
    }
    return res.json({verified: true});
});

module.exports = router;