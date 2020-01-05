const db = require('../db/db');
const User = require('../models/user');

module.exports = () => {
    console.log('\nInserting mock data...');
    return new Promise(async (resolve, reject) => {
        const conn = db.getDb();
        conn.dropCollection(process.env.MONGO_USER_COLLECTION);

        const newUser1 = new User({
            first_name: 'Test1',
            last_name: 'Test2',
            email: 'test@test.com',
            password: User.hashPassword('password1')
        });
        await newUser1.save((err) => {
            if (err) {
                console.log('Error adding mock user data into MongoDB');
                reject();
            } else {
                console.log('Successfully inserted mock data\n');
                resolve();
            }
        });
    });
}
