const express = require('express');
const router = express.Router();
const mongoClient = require('mongodb').MongoClient;
const mdbURL = "mongodb+srv://nayla:scoat123@cluster0-lrlqp.mongodb.net/test?retryWrites=true";
var db; //variavel global que pode ser vista por outras rotas
var collection;

// CONNECT TO MONGODB
mongoClient.connect(mdbURL, {native_parser:true},(err,database) => {
    if(err){
        console.error("Ocorreu um erro ao conectar mongoDB")
        send.status(500); //internal server error
    }
    else {
        db = database.db('trainee-prominas');
        collection = db.collection('user');
    }
    db = database.db('trainee-prominas');
});

//var collection = db.collection('user');

var id=1; //contador id

var users = [];

// GET ALL USERS
router.get('/', function (req, res) {
    collection.find({}, {projection: {_id:0, id:1, name:1, lastname:1, profile:1}}).toArray((err, users) =>{
        if(err) {
            console.error('Ocorreu um erro ao conectar ao User');
            res.status(500);
        }
        else {
            res.send(users);
        }
    });
});

// UPDATE USER
router.put('/:id', function (req, res) {

    if (req.body.name && req.body.lastname && req.body.profile){
        let userAlter = req.body;
        let id = parseInt(req.params.id);
        userAlter.id = id;
        userAlter.name = req.body.name;
        userAlter.lastname = req.body.lastname;
        userAlter.profile = req.body.profile;
        userAlter.status =1;

        console.log(userAlter);

        db.collection('user').findOneAndUpdate({"id":id, "status":1}, {$set:{name:userAlter.name, lastname: userAlter.lastname, profile: userAlter.profile}}, function (err, result) {
            console.log(result.value);
            if (result.value == null){
                res.status(404);
                res.send("Nenhum Campo atualizado");
            }
            else {
                res.send("Editado com sucesso");
            }
        })
    }
    else{
        res.status(403);
        res.send("Solicitação não autorizada");
    }
    /*let bodyuser = req.body;

    if(bodyuser == {}){
        res.status('400');
        res.send('Solicitação não autorizada');
    }
    else {
        collection.update({'id':id}, bodyuser);
        res.send('Editado com sucesso');
    } */

});

// CREATE USER
router.post('/', function (req, res) {
    let  newuser = req.body;

    if (newuser.name && newuser.lastname && newuser.profile){
        console.log(newuser);
        newuser.id = id++;
        newuser.status = 1;

        res.status(201);
        db.collection('user').insert(newuser);
        res.send('Usuario Cadastrado com sucesso');
    }
    else {
        res.status(401);
        res.send('Insira todos os campos obrigatorios')
    }
});

// GET ONE USER
router.get('/:id', function (req, res) {
    var id = parseInt(req.params.id); //o parametro name tem que ser exatamente o mesmo que na rota

    collection.find({'id':id}, {projection: {_id:0, id:1, name:1, lastname:1, profile:1}}).toArray((err, user) =>{
        if(err) {
            console.error('Ocorreu um erro ao conectar ao User');
            res.status(500);
        }
        else {
            if (user == []){
                res.status(404);
                res.send('Usuário não encontrado');
            }
            else {
                res.send(user);
            }
        }
    });
});

// DELETE ALL
/*router.delete('/', function (req, res) {
    collection.remove({}, function (err, info) { //true: remove apenas 1 false ou deixar vazio: remove todos
        if (err){
            console.error('Ocorreu erro');
            res.status(500);
        }
        else {
            var numRemoved = info.result.n; //n: é um numero

            if (numRemoved > 0){
                console.log("INF: Todos od usários (" + numRemoved + ") foram removidos");
                res.status(204);
                res.send('Todos os usuarios removidos com sucesso');
            }
            else {
                res.send('Nenhum usuário foi removido');
                res.status(404);
            }
        }
    });
}); */

// DELETE ONE USER
router.delete('/:id', function (req, res) {
    let id = parseInt(req.params.id);
    db.collection('user').findOneAndUpdate({'id':id, 'status':1}, {$set:{status:0}}, function (err, info) {
        if (err){
            console.error('Ocorreu um erro ao deletar usuário');
            res.status(500);
        }
        else {
            //let numRemoved = info.result.n; //n: é um numero

            if (info.value != null){
                console.log(info);
                res.status(200);
                res.send(' Usuario removido com sucesso');
            }
            else {
                res.send('Nenhum usuário foi removido');
                res.status(204);
            }
        }
    });

    /* collection.remove({'id':id},true, function (err, info) { //true: remove apenas 1 false: remove todos
        if (err){
            console.error('Ocorreu erro');
            res.status(500);
        }
        else {
            let numRemoved = info.result.n; //n: é um numero

            if (numRemoved > 0){
                console.log("INF: Usuário (" + numRemoved + ") foram removidos");
                res.status(200);
                res.send(' Usuario removido com sucesso');
            }
            else {
                res.send('Nenhum usuário foi removido');
                res.status(404);
            }
        }
    }); */
});

module.exports = router;