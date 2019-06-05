// MONGODB CONNECTION
const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mdbURL = "mongodb+srv://nayla:scoat123@cluster0-lrlqp.mongodb.net/test?retryWrites=true";

let db;

mongoClient.connect(mdbURL, { native_parser: true }, (err, database) => {

    if (err) {
        console.error('Ocorreu um erro ao conectar ao mongoDB', err);
        // send.status(500);
    }
    else {
        console.log('User CONECTOU!');

        db = database.db("trainee-prominas");
    }
});
// MONGODB CONNECTION

const request = require('supertest');
const express = require('express');
const bodyparser = require('body-parse');

const app = express();

let user = require('../models/user');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);




