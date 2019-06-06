var chai = require('chai');
const request = require('supertest');
var assert = chai.assert;
let app = require('../index');


describe('POST for Course', function () {

    it("should not register aa course if has less than 2 teachers valid ", function () {
        return request(app)
            .post('/api/v1/course')
            .send({name: "Test1 course", period:"1", teacher:[1, 'invalid'], city:"new york"})
            .then(function (res) {
                assert.equal(res.status, 401);
            });
    });

    it("should not register aa course if has less than 2 teachers valid ", function () {
        return request(app)
            .post('/api/v1/course')
            .send({name: "Test2 course", period:"1", teacher:[1, 2], city:"new york"})
            .then(function (res) {
                assert.equal(res.status, 401);
            });
    });

});