var chai = require('chai');
const request = require('supertest');
var assert = chai.assert;
let app = require('../index');


describe('POST for Student', function () {

    it("should register an student with age >=17 and has a valid course ", function () {
        return request(app)
            .post('/api/v1/student')
            .send({name: "Test1 student", lastname:"surname", age:17, course:[4]})
            .then(function (res) {
                assert.equal(res.status, 201);
            });
    });

    it("should not register an student with age >=17 and has no valid course ", function () {
        return request(app)
            .post('/api/v1/student')
            .send({name: "Test2 student", lastname:"surname", age:18, course:'invalid'})
            .then(function (res) {
                assert.equal(res.status, 401);
            });
    });

    it("should not register an student with age < 17 and has valid course ", function () {
        return request(app)
            .post('/api/v1/student')
            .send({name: "Test3 student", lastname:"surname", age:16, course:[4]})
            .then(function (res) {
                assert.equal(res.status, 401);
            });
    });

    it("should not register an student with age < 17 and has no valid course ", function () {
        return request(app)
            .post('/api/v1/student')
            .send({name: "Test4 student", lastname:"surname", age:16, course:'invalid'})
            .then(function (res) {
                assert.equal(res.status, 401);
            });
    });



});