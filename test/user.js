var chai = require('chai');
const request = require('supertest');
var assert = chai.assert;
let app = require('../routes/users');

describe('Unit testing user', function () {

    // describe('GET user', function () {
    //
    //     it('should return OK status', function () {
    //         return request(app)
    //         .get('api/v1/user')
    //         .then(function (res) {
    //             assert.equal(res.status(200));
    //         })
    //     });
    //
    //     it('should return an array', function () {
    //         return request(app)
    //             .get('api/v1/user')
    //             .then(function (res) {
    //                 assert.isArray(res.body);
    //             })
    //     });
    //
    // });

    describe('POST for user', function () {

        it("should not register an user if it is guess or admin ", function () {
            return request(app)
                .post('api/v1/user')
                .send({name: "Test User", lastname:"Test Lastname", profile:"unauthorized"})
                .then(function (res) {
                    assert.equal(res.status, 401);
                });
        });

        it('should register an user if it is guess', function () {
            return request(app)
                .post('api/v1/user')
                .send({name:"Test User", lastname:"Test lasname", profile:"guess"})
                .then(function (res) {
                    assert.equal(res.status(201));
                })
        });

        it('should register an user if it is admin', function () {
            return request(app)
                .post('api/v1/user')
                .send({name:"Test User", lastname:"Test lasname", profile:"admin"})
                .then(function (res) {
                    assert.equal(res.status(201));
                })
        });

    })


});

