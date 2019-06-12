
// MONGODB CONNECTION
const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mdbURL = "mongodb+srv://nayla:scoat123@cluster0-lrlqp.mongodb.net/test?retryWrites=true";

const mongoose = require("mongoose");
const studentSchema = require('../schema').studentSchema;
const Student = mongoose.model('Student', studentSchema, 'student');

let db;
let studentCollection;
//let counterCollection;
let courseCollection;

var id=0;

mongoClient.connect(mdbURL, { native_parser: true }, (err, database) => {

  if (err) {
    console.error('Ocorreu um erro ao conectar ao mongoDB', err);
    // send.status(500);
  }
  else {
    console.log('Student CONECTOU!');

    db = database.db("trainee-prominas");
    studentCollection = db.collection('student');
    //counterCollection = db.collection('counter');
    courseCollection = db.collection('course');
    studentCollection.find({}).toArray((err, student) => {id = student.length});
  }
});
// MONGODB CONNECTION

exports.findAll = function (where, projection) {
  return Student.find(where,projection);
};

exports.insertOne = (student) =>{
  student.id = ++id;
  return Student.create(student);
};

exports.findOne = function (where, projection) {
  return Student.findOne(where, projection);
};

exports.update = (where, student) =>{
  return Student.findOneAndUpdate(where, { $set: { ...student } }, { returnOriginal: false });
};

exports.delete = (id) => {
  return Student.findOneAndUpdate(id, {$set: {status: 0}});
};

exports.updateCourse = (id, set) => {
  return Student.findOneAndUpdate({'course.id':id, 'status':1}, {$set: {"course.$": set}});
};

exports.deleteCourse = (id, set) => {
  return Student.findOneAndUpdate({'course.id':id, 'status':1}, {$set: {status:0}});
};

exports.updateMany = function(where, setDoc) {

  return Student.updateMany(where, { $set: setDoc });
};

exports.updateTeacher = (course) => {
  return Student.findOneAndUpdate({'status':1, 'course.id':course.id}, {$set: {'course.$':course}});
};










/*let students = [
  { 
    "id": 1,
    "name": "Marcos",
    "lastName": "Paulo",
    "age": 20,
    "course": { 
      "id": 1,
      "name": "Sistemas de Informação",
      "period": "Matutino",
      "city": "Ipatinga",
      "teachers": [
        { "id": 1, "name": "Teacher", "lastName": "01", "phd": false }
      ]
    }
  },
  { 
    "id": 2,
    "name": "Pedro",
    "lastName": "Henrique",
    "age": 21,
    "course": { 
      "id": 1,
      "name": "Sistemas de Informação",
      "period": "Matutino",
      "city": "Ipatinga",
      "teachers": [
        { "id": 1, "name": "Teacher", "lastName": "01", "phd": false }
      ]
    }
  },
  { 
    "id": 3,
    "name": "Lucas",
    "lastName": "Rodrigues",
    "age": 22,
    "course": { 
      "id": 1,
      "name": "Sistemas de Informação",
      "period": "Matutino",
      "city": "Ipatinga",
      "teachers": [
        { "id": 1, "name": "Teacher", "lastName": "01", "phd": false }
      ]
    } 
  }
];

var idCounter = students.length;

const getAll = function(callback) {
  callback(students);
}

const _getNextId = function() {
  return ++idCounter;
}

const add = function(student, callback) {
  student.id = _getNextId();

  students.push(student);

  callback();
}

const deleteAll = function(callback) {
  students = [];

  callback();
}

const deleteById = function(id, callback) {
  var student = students.find(s => s.id === id);
  var index = students.indexOf(student);

  if (index >= 0) {
    students.splice(index, 1);
    callback(null, null);
  } else {
    callback({ message: 'Student not Found' }, null);
  }

}

const findById = function(id, callback) {
  var student = students.find(s => s.id === id);

  callback(student);
}

const updateById = function(id, student, callback) {
  var student = students.find(s => s.id === id);
  var index = students.indexOf(student);

  if (index >= 0) {
    students[index] = student;
    callback(null, null);
  } else {
    callback({ message: 'Student not Found' }, null);
  }

}

module.exports = { getAll, add, deleteAll, deleteById, findById, updateById }; */
