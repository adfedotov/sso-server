const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const should = chai.should();
const mockData = require('./create_db_data');

chai.use(chaiHttp);

before((done) => {
    app.on('started', async () => {
        await mockData();
        done();
    });
});

describe('Auth', () => {
    it('should show login page', (done) => {
        chai.request(app).get('/auth/login').end((err, res) => {
            res.should.have.status(200);
            res.should.be.html;
            res.should.not.redirect;
            done();
        });
    });
    it('should show register page', (done) => {
        chai.request(app).get('/auth/register').end((err, res) => {
            res.should.have.status(200);
            res.should.be.html;
            done();
        });
    });
    it('should redirect to default', (done) => {
        chai.request(app)
            .post('/auth/login')
            .type('form')
            .send({'email': 'test@test.com', 'password': 'password1'})
            .end((err, res) => {
                res.should.redirectTo(process.env.DEFAULT_REDIRECT);
                done();
            });
    });
    it('should redirect to service', (done) => {
        const host = `http://${process.env.HOST}:${process.env.PORT}/user/1`;
        chai.request(app)
            .post('/auth/login')
            .query({service: host})
            .type('form')
            .send({'email': 'test@test.com', 'password': 'password1'})
            .end((err, res) => {
                res.should.redirectTo(host);
                done();
            });
    });
    it('should have token assigned');
    it('should clear token');
});

describe('Verify', () => {
    it('should reject token');
    it('should accept token');
});