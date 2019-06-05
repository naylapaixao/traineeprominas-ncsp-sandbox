// MONGODB CONNECTION
const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mdbURL = "mongodb+srv://nayla:scoat123@cluster0-lrlqp.mongodb.net/test?retryWrites=true";

let db;
let teacherCollection;
let counterCollection;

var id=0;

mongoClient.connect(mdbURL, { native_parser: true }, (err, database) => {

  if (err) {
    console.error('Ocorreu um erro ao conectar ao mongoDB', err);
    // send.status(500);
  }
  else {
    console.log('Teacher CONECTOU!');

    db = database.db("trainee-prominas");
    teacherCollection = db.collection('teacher');
    counterCollection = db.collection('counter');
    teacherCollection.find({}).toArray((err, teacher) => {id = teacher.length});

  }
});
// MONGODB CONNECTION

exports.findAll = function (where, projection) {
  return teacherCollection.find(where,{projection}).toArray();
};

exports.findOne = async function (query, projection) {
  return teacherCollection.findOne(query, {projection});
};

exports.insertOne = (teacher) =>{
  teacher.id = ++id;
  return teacherCollection.insertOne(teacher);
}

exports.update = (teacher, where) =>{
  return teacherCollection.findOneAndUpdate(where, { $set: { ...teacher } }, { returnOriginal: false });
}

exports.delete = (id) => {
  return teacherCollection.findOneAndUpdate(id, {$set: {status: 0}});
};

exports.getTeacher = (id) => {
  return teacherCollection.find({'id':id, 'status':1}).toArray();
};

/*let teachers = [
  { "id": 1, "name": "Teacher", "lastName": "01", "phd": false },
  { "id": 2, "name": "Teacher", "lastName": "02", "phd": true },
  { "id": 3, "name": "Teacher", "lastName": "03", "phd": true }
];

var idCounter = teachers.length;

const getAll = function(callback) {
  callback(teachers);
}

const _getNextId = function() {
  return ++idCounter;
}

const add = function(teacher, callback) {
  teacher.id = _getNextId();

  teachers.push(teacher);

  callback();
}

const deleteAll = function(callback) {
  teachers = [];

  callback();
}

const deleteById = function(id, callback) {
  var teacher = teachers.find(t => t.id === id);
  var index = teachers.indexOf(teacher);

  if (index >= 0) {
    teachers.splice(index, 1);
    callback(null, null);
  } else {
    callback({ message: 'Teacher not Found' }, null);
  }

}

const findById = function(id, callback) {
  var teacher = teachers.find(t => t.id === id);

  callback(teacher);
}

const findByIdSync = function(id) {
  var teacher = teachers.find(t => t.id === id);

  return teacher;
}

const updateById = function(id, teacher, callback) {
  var teacher = teachers.find(t => t.id === id);
  var index = teachers.indexOf(teacher);

  if (index >= 0) {
    teachers[index] = teacher;
    callback(null, null);
  } else {
    callback({ message: 'Teacher not Found' }, null);
  }

}

module.exports = { getAll, add, deleteAll, deleteById, findById, findByIdSync, updateById }; */
