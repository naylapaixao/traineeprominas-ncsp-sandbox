var chai = require('chai');
const request = require('supertest');
var assert = chai.assert;
let app = require('../index');

    describe('POST for user', function () {

        it("should not register an user if it is guess or admin ", function () {
            return request(app)
                .post('/api/v1/user')
                .send({name: "Test User", lastname:"Test Lastname", profile:"unauthorized"})
                .then(function (res) {
                    assert.equal(res.status, 401);
                });
        });

        it('should register an user if it is guess', function () {
            return request(app)
                .post('/api/v1/user')
                .send({name:"Test2 User", lastname:"Test lasname", profile:"guess"})
                .then(function (res) {
                    assert.equal(res.status, 201);
                })
        });

        it('should register an user if it is admin', function () {
            return request(app)
                .post('/api/v1/user')
                .send({name:"Test3 User", lastname:"Test lasname", profile:"admin"})
                .then(function (res) {
                    assert.equal(res.status, 201);
                })
        });

    });


