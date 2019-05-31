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
        collection = db.collection('teacher');
    }
    db = database.db('trainee-prominas');
});

var id=0; //contador id

var teachers = [];

router.get('/', function (req, res) {
    collection.find({}, {projection: {_id:0, id:1, name:1, lastname:1, phd:1}}).toArray((err, users) =>{
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
    var bodyuser = req.body;
    bodyuser.id = parseInt(req.body);

    if(bodyuser == {}){
        res.status('400');
        res.send('Solicitação não autorizada')
    }
    else {
        collection.update({'id':id}, bodyuser);
        res.send('Professor editado com sucesso');
    }
});

router.post('/', function (req, res) {
    let newteacher = req.body;

    if (newteacher.name && newteacher.lastname){

        if(typeof (req.body.phd == boolean)){
            return req.body.phd;
        }

        console.log(newteacher);
        newteacher.id = ++id;
        newteacher.status = 1;

        res.status(201);
        db.collection('teacher').insert(newteacher);
        res.send('Professor Cadastrado com sucesso');
    }
    else {
        res.status(401);
        res.send('Insira todos os campos obrigatorios')
    }
    /* newteacher.id = ++id;
    db.collection('teacher').insert(newteacher);
    res.send('Professor Cadastrado com sucesso'); */
});

router.get('/:id', function (req, res) {
    var id = parseInt(req.params.id); //o parametro name tem que ser exatamente o mesmo que na rota

    collection.find({'id':id}, {projection: {_id:0, id:1, name:1,lastname:1, phd:1}}).toArray((err, user) =>{
        if(err) {
            console.error('Ocorreu um erro ao conectar ao Teacher');
            res.status(500);
        }
        else {
            if (user == []){
                res.status(404);
                res.send('Professor não encontrado');
            }
            else {
                res.send(user);
            }
        }
    });
});

router.delete('/', function (req, res) {
   collection.remove({}, function (err, info) { //true: remove apenas 1 false: remove todos
        if (err){
            console.error('Ocorreu erro');
            res.status(500);
        }
        else {
            let numRemoved = info.result.n; //n: é um numero

            if (numRemoved > 0){
                console.log("INF: Todos os professores (" + numRemoved + ") foram removidos");
                res.status(204);
                res.send('Todos os professores foram removidos com sucesso');
            }
            else {
                res.send('Nenhum professor foi removido');
                res.status(404);
            }
        }
    });
});

router.delete('/:id', function (req, res) {
    let id = parseInt(req.params.id);

    collection.remove({'id':id},true, function (err, info) { //true: remove apenas 1 false: remove todos
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
    });
});

module.exports = {router};