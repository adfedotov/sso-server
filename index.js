const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/config.json');
const db = require('./db/db');

db.connect();
const app = express();


const port = config.PORT || 3001;
const host = config.HOST || '127.0.0.1';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
const authRoute = require('./routes/auth');
app.use('/auth', authRoute);

const userRoute = require('./routes/user');
app.use('/user', userRoute);

const verifyRoute = require('./routes/verify');
app.use('/verify', verifyRoute);

app.listen(config.PORT, config.HOST, () => {
    console.log(`Server started on ${host}:${port}`);
});
