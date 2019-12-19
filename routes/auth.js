const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Middleware to check if user already has a token
 */
router.use('/login', (req, res, next) => {
    if (req.cookies.access_token) {
        if (jwt.verify(req.cookies.access_token, config.SECRET)) {
            if (isValidService(req.query.service)) {
                return res.redirect(req.query.service);
            } else {
                return res.redirect(config.DEFAULT_REDIRECT);
            }
        } else {
            res.clearCookie('access_token');
        }
    }
    next();
});

// ----LOGIN----

router.get('/login', (req, res) => {
    res.render('login', {name: config.SSO_NAME, service: req.query.service, error: null});
});

router.post('/login', (req, res) => {
    const email = (req.body.email) ? req.body.email : '';
    const password = (req.body.password) ? req.body.password : '';

    let error = null;

    if (email.length < 5 || email.length > 255 || !verifyEmail(email)) error = 'Email/Password is not valid';
    else if (password.length < config.MIN_PASSWORD_LENGTH || password.length > 128) error = 'Email/Password is not valid';
    
    if (error) return res.render('login', {name: config.SSO_NAME, service: null, error: error});
    
    User.findOne({email: email}, (err, docs) => {
        if (err) return res.redirect('/auth/register'); // better error handling
        else if (docs === null) return res.render('login', {name: config.SSO_NAME, service: null, error: 'Email/Password is not valid'});
        else {
            if (User.checkPassword(password, docs.password)) {
                const secret = config.SECRET;
                const token = jwt.sign({
                    id: docs._id,
                    firstName: docs.first_name,
                    lastName: docs.last_name,
                    email: docs.email,
                    admin: docs.admin
                }, secret, {algorithm: 'HS256', expiresIn: '24h'});
                // TODO: Change secure to true
                res.cookie('access_token', token, {domain: `${config.DOMAIN}`, httpOnly: true, secure: false}); 
                if (isValidService(req.query.service)) {
                    res.redirect(req.query.service);
                } else {
                    res.redirect(config.DEFAULT_REDIRECT);
                }
            } else {
                res.render('login', {name: config.SSO_NAME, service: null, error: 'Email/Password is not valid'});
            }
        }
    });
});

// ----REGISTER----

router.get('/register', (req, res) => {
    res.render('register', {name: config.SSO_NAME, error: null, data: null});
});

router.post('/register', (req, res) => { // body might not contain, maybe easier to implement it as api
    const firstName = (req.body.firstName) ? req.body.firstName : '';
    const lastName = (req.body.lastName) ? req.body.lastName : '';
    const email = (req.body.email) ? req.body.email : '';
    const password = (req.body.password) ? req.body.password : '';
    const repeatPassword = (req.body.repeatPassword) ? req.body.repeatPassword : '';

    let error = null;

    if (firstName.length < 1 || firstName.length > 50 || lastName.length < 1 || lastName.ength > 50) error = 'Name length must be more than 1 and less than 50';
    else if (email.length < 5 || email.length > 255 || !verifyEmail(email)) error = 'Incorrect email';
    else if (password.length < config.MIN_PASSWORD_LENGTH || password.length > 128) error = `Password must be at least ${config.MIN_PASSWORD_LENGTH} characters`;
    else if (password !== repeatPassword) error = 'Passwords don\'t match';

    if (error) return res.render('register', {name: config.SSO_NAME, error: error, data: {f: firstName, l: lastName, email: email}});

    const newUser = new User({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: User.hashPassword(password)
    });

    newUser.save((err) => {
        if (err) {
            // TODO: Check for different errors
            console.log('MongoDB Error while registering a new user: ' + err);
            return res.render('register', {name: config.SSO_NAME, error: 'User with this email is already registered', data: null});
        } else {
            if (req.query.service) {
                return res.redirect('/auth/login?service=' + req.query.service);
            } else {
                return res.redirect('/auth/login');
            }
        }
        
    });
});

// ----REGISTER----

router.get('/logout', (req, res) => {
    if (req.cookies.access_token) {
        res.clearCookie('access_token');
    }

    if (isValidService(req.query.service)) {
        return res.redirect(req.query.service);
    }

    res.redirect('/auth/login');
});

/**
 * checks the service request query if it is a valid URL and if it is whitelisted
 */
const isValidService = (service) => {
    if (!service) return false;
    let serviceLink = null;
    try {
        serviceLink = new URL(service);
        if (!config.ALLOWED_HOSTS.includes(serviceLink.host)) serviceLink = null;
    } catch(err) {
        console.log('Error while parsing url: ' + service);
    }
    return (serviceLink) ? true : false;
}

const verifyEmail = (email) => {
    return /\S+[@]\S+[.]\S+/g.test(email);
}

module.exports = router;