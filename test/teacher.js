var chai = require('chai');
const request = require('supertest');
var assert = chai.assert;
let app = require('../index');


    describe('POST for teacher', function () {

        it("should not register an user if phd = false ", function () {
            return request(app)
                .post('/api/v1/teacher')
                .send({name: "Test1 Teacher", lastname:"Test Lastname", phd:false})
                .then(function (res) {
                    assert.equal(res.status, 401);
                });
        });

        it("should register a teacher if phd = true ", function () {
            return request(app)
                .post('/api/v1/teacher')
                .send({name: "Test2 Teacher", lastname:"Test Lastname", phd:true})
                .then(function (res) {
                    assert.equal(res.status, 201);
                });
        });

        it("should register a teacher if phd = true ", function () {
            return request(app)
                .post('/api/v1/teacher')
                .send({name: "Test3 Teacher", lastname:"Test Lastname", phd:true})
                .then(function (res) {
                    assert.equal(res.status, 201);
                });
        });

    });



