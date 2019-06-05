// MONGODB CONNECTION
const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mdbURL = "mongodb+srv://nayla:scoat123@cluster0-lrlqp.mongodb.net/test?retryWrites=true";

let db;
let courseCollection;
let teacherCollection;
let studentCollection;

//let counterCollection;

var id =0;

mongoClient.connect(mdbURL, { native_parser: true }, (err, database) => {

  if (err) {
    console.error('Ocorreu um erro ao conectar ao mongoDB', err);
    // send.status(500);
  }
  else {
    console.log('Course CONECTOU!');

    db = database.db("trainee-prominas");
    courseCollection = db.collection('course');
    teacherCollection = db.collection('teacher');
    studentCollection = db.collection('student');
    //counterCollection = db.collection('counter');
    courseCollection.find({}).toArray((err, course) => {id = course.length});
  }
});
// MONGODB CONNECTION

exports.findAll = function (where, projection) {
  return courseCollection.find(where, projection).toArray();
};

exports.insertOne = (course) =>{
  course.id = ++id;
  return courseCollection.insertOne(course);
};

exports.findOne = function(where, projection) {
  return courseCollection.findOne(where, {projection });
};

/*exports.update = (course, where) => {
  return courseCollection.findOneAndUpdate(where, { $set: { ...course } }, { returnOriginal: false });
} */

// exports.update = (course, set) => {
//   return courseCollection.findOneAndUpdate(course, {$set: set});
// };

exports.update = (query, set) => {
  return courseCollection.findOneAndUpdate(query, {$set: {...set}}, { returnOriginal: false });
};

exports.delete = (id) => {
  return courseCollection.findOneAndUpdate(id, {$set: {status: 0}});
};

exports.getCourse = (id) => {
  return courseCollection.find({'id':id, 'status':1}).toArray();
};

exports.updateMany = function(where, setDoc) {

  return courseCollection.updateMany(where, { $set: setDoc });
};

exports.deleteProf = (id) => {
  return courseCollection.findOneAndUpdate({'status':1, 'teacher.id':id}, {$pull: {"teacher": {'id': id}}});
};

exports.getAllTeachers =  () => {
  return courseCollection.find({"status": 1}).toArray();
}




/*let courses = [
  { 
    "id": 1,
    "name": "Sistemas de Informação",
    "period": "Matutino",
    "city": "Ipatinga",
    "teachers": [
      { "id": 1, "name": "Teacher", "lastName": "01", "phd": false }
    ]
  },
  { 
    "id": 2,
    "name": "Ciências da Computação",
    "period": "Vespertino",
    "city": "Coronel Fabriciano",
    "teachers": [
      { "id": 2, "name": "Teacher", "lastName": "02", "phd": true }
    ]
  },
  { 
    "id": 3,
    "name": "Engenharia da Computação",
    "period": "Noturno",
    "city": "Timotéo",
    "teachers": [
      { "id": 3, "name": "Teacher", "lastName": "03", "phd": true }
    ]
  }
];

var idCounter = courses.length;

const getAll = function(callback) {
  callback(courses);
}

const _getNextId = function() {
  return ++idCounter;
}

const add = function(course, callback) {
  course.id = _getNextId();

  courses.push(course);

  callback();
}

const deleteAll = function(callback) {
  courses = [];

  callback();
}

const deleteById = function(id, callback) {
  var course = courses.find(c => c.id === id);
  var index = courses.indexOf(course);

  if (index >= 0) {
    courses.splice(index, 1);
    callback(null, null);
  } else {
    callback({ message: 'Course not Found' }, null);
  }

}

const findById = function(id, callback) {
  var course = courses.find(c => c.id === id);

  callback(course);
}

const findByIdSync = function(id) {
  var course = courses.find(c => c.id === id);

  return course;
}

const updateById = function(id, course, callback) {
  var course = courses.find(c => c.id === id);
  var index = courses.indexOf(course);

  if (index >= 0) {
    courses[index] = course;
    callback(null, null);
  } else {
    callback({ message: 'Course not Found' }, null);
  }

}

module.exports = { getAll, add, deleteAll, deleteById, findById, findByIdSync, updateById }; */