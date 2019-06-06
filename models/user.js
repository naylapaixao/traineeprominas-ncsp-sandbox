
// MONGODB CONNECTION
const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mdbURL = "mongodb+srv://nayla:scoat123@cluster0-lrlqp.mongodb.net/test?retryWrites=true";

let db;
let userCollection;
let counterCollection;

var id=0;
mongoClient.connect(mdbURL, { native_parser: true }, (err, database) => {

    if (err) {
        console.error('Ocorreu um erro ao conectar ao mongoDB', err);
        // send.status(500);
    }
    else {
        console.log('User CONECTOU!');

        db = database.db("trainee-prominas");
        userCollection = db.collection('user');
        counterCollection = db.collection('counter');
        userCollection.find({}).toArray((err, user) => {id = user.length});
    }
});
// MONGODB CONNECTION

exports.findAll = function (query, projection) {
    return userCollection
        .find(query,{projection})
        .toArray();
};


//FAZENDO NOVA REGRA DE NEGOCIO NO MODEL
 getAllUsers = function (req, res) {
    const query = { status: 1 };
    const projection = { _id: 0, id: 1, name: 1, lastname: 1, profile: 1 };

    userModel.findAll(query, projection)
        .then(users => {
            res.send(users);
        })

        .catch(err => {
            console.error("Erro ao conectar a collection user");
            res.status(500).send("Erro ao conectar a collection user");
        });
};




exports.findOne = function (query, projection) {
    return userCollection
        .findOne(query, {projection});
}

exports.insertOne = (user) =>{
    if (user.profile == 'admin' || user.profile == 'guess') {
        user.id = ++id;
        return userCollection.insertOne(user);
    }
    else {
        return new Promise((resolve, reject) => {
            resolve(false);
        });
    }

}

exports.update = (id, document) =>{
    return userCollection.updateOne({'id':id, 'status':1}, {$set:document});
}

exports.delete = (id) => {
    return userCollection.findOneAndUpdate({'id':id, 'status':1}, {$set: {status: 0}});
}







/*let users = [
  { "id": 1, "name": "Marcos", "lastName": "Paulo", "profile": "user" },
  { "id": 2, "name": "Pedro", "lastName": "Henrique", "profile": "user" },
  { "id": 3, "name": "Lucas", "lastName": "Rodrigues", "profile": "admin" }
];

var idCounter = users.length;

const getAll = function(callback) {
  callback(users);
}

const _getNextId = function() {
  return ++idCounter;
}

const add = function(user, callback) {
  user.id = _getNextId();
  user.profile = "user";

  users.push(user);

  callback();
}

const deleteAll = function(callback) {
  users = [];

  callback();
}

const deleteById = function(id, callback) {
  var user = users.find(u => u.id === id);
  var index = users.indexOf(user);

  if (index >= 0) {
    users.splice(index, 1);
    callback(null, null);
  } else {
    callback({ message: 'User not Found' }, null);
  }

}

const findById = function(id, callback) {
  var user = users.find(s => s.id === id);

  callback(user);
}

const updateUserById = function(id, user, callback) {
  var user = users.find(u => u.id === id);
  var index = users.indexOf(user);

  if (index >= 0) {
    users[index] = user;
    callback(null, null);
  } else {
    callback({ message: 'User not Found' }, null);
  }

}

module.exports = { getAll, add, deleteAll, deleteById, findById, updateUserById }; */
