const values = {
    SSO_NAME: process.env.SSO_NAME,
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    SECRET: process.env.SECRET,
    DOMAIN: process.env.DOMAIN,
    DEFAULT_REDIRECT: process.env.DEFAULT_REDIRECT,
    ALLOWED_HOSTS: process.env.ALLOWED_HOSTS.split(','),
    MIN_PASSWORD_LENGTH: process.env.MIN_PASSWORD_LENGTH,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASS: process.env.MONGO_PASS,
    MONGO_HOST: process.env.MONGO_HOST,
    MONGO_PORT: process.env.MONGO_PORT,
    MONGO_DB: process.env.MONGO_DB 
}

module.exports = values;