const express = require('express');
const router = express.Router();
const mongoClient = require('mongodb').MongoClient;
const mdbURL = "mongodb+srv://nayla:scoat123@cluster0-lrlqp.mongodb.net/test?retryWrites=true";
var db; //variavel global que pode ser vista por outras rotas
var collection;

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

var id=0; //contador id

var users = [];

router.get('/', function (req, res) {
    //res.send(users);
    collection.find({}).toArray((err, users) =>{
        if(err) {
            console.error('Ocorreu um erro ao conectar ao User');
            res.status(500);
        }
        else {
            res.send(users);
        }
    });
});

router.put('/:id', function (req, res) {
    var id = parseInt(req.params.id);
    //var filterestUsers = users.filter((s) => {return (s.id == id); });
    var bodyuser = req.body;

    if(bodyuser == {}){
        res.status('400');
        res.send('Solicitação não autorizada')
    }
    else {
        collection.update({'id':id}, bodyuser);
        res.send('Editado com sucesso');
    }

    /* if (filterestUsers.length >= 1){
        filterestUsers[0].name = req.body.name;
        filterestUsers[0].lastname = req.body.lastname;
        filterestUsers[0].profile = req.body.profile;
    } */
});

router.post('/', function (req, res) {
    var  newuser = req.body;
    newuser.id = ++id;
    //users.push(newuser);
    db.collection('user').insert(newuser);
    res.send('Usuario Cadastrado com sucesso');
});

router.get('/:id', function (req, res) {
    var id = parseInt(req.params.id); //o parametro name tem que ser exatamente o mesmo que na rota

    collection.find({'id':id}).toArray((err, user) =>{
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

    /*var filterestUser = users.filter((u) => {return (u.id == id); });
    if (filterestUser.length >= 1)
        res.send(filterestUser[0]);
    else
        res.status(404);
        res.send('Usuário não encontrado '); */
});

router.delete('/', function (req, res) {
    //users = [];
    collection.remove({}, function (err, info) { //true: remove apenas 1 false: remove todos
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
});

router.delete('/:id', function (req, res) {
    var id = parseInt(req.params.id);

    collection.remove({'id':id},true, function (err, info) { //true: remove apenas 1 false: remove todos
        if (err){
            console.error('Ocorreu erro');
            res.status(500);
        }
        else {
            var numRemoved = info.result.n; //n: é um numero

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
    });

    /* var deleteUser = users.filter((c) => {return (c.id == id); });
    if (deleteUser.length >= 1) {
        for(var i=0;i<users.length;i++){
            if (users[i].id == id){
                users.splice(i,1);
                res.send('Deletado com sucesso ');
            }
        }
    }
    else
        res.send('Estudante não encontrado '); */
});

module.exports = router;