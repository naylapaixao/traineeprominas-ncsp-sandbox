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
    //res.send(teachers);
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
    var bodyuser = req.body;

    if(bodyuser == {}){
        res.status('400');
        res.send('Solicitação não autorizada')
    }
    else {
        collection.update({'id':id}, bodyuser);
        res.send('Professor editado com sucesso');
    }

    /* var id = req.params.id;
    var filterestProfessors = teachers.filter((s) => {return (s.id == id); });
    if (filterestProfessors.length >= 1){
        filterestProfessors[0].name = req.body.name || filterestProfessors[0].name  ;
        filterestProfessors[0].lastname = req.body.lastname || filterestProfessors[0].lastname ;
        filterestProfessors[0].phd = req.body.phd || filterestProfessors[0].phd ;
    }
    res.send('Editado com sucesso'); */
});

router.post('/', function (req, res) {
    var  professor = req.body;
    professor.id = ++id;
    //teachers.push(professor);
    db.collection('teacher').insert(professor);
    res.send('Professor Cadastrado com sucesso');
});

router.get('/:id', function (req, res) {
    var id = parseInt(req.params.id); //o parametro name tem que ser exatamente o mesmo que na rota

    collection.find({'id':id}).toArray((err, user) =>{
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

    /* var id = req.params.id; //o parametro name tem que ser exatamente o mesmo que na rota
    var filterestProfessors = teachers.filter((s) => {return (s.id == id); });
    if (filterestProfessors.length >= 1)
        res.send(filterestProfessors[0]);
    else
        res.status(404);
        res.send('Professor não encontrado '); */
});

router.delete('/', function (req, res) {
    //teachers = [];
   collection.remove({}, function (err, info) { //true: remove apenas 1 false: remove todos
        if (err){
            console.error('Ocorreu erro');
            res.status(500);
        }
        else {
            var numRemoved = info.result.n; //n: é um numero

            if (numRemoved > 0){
                console.log("INF: Todos os professores (" + numRemoved + ") foram removidos");
                res.status(204);
                res.send('Todos os professores removidos com sucesso');
            }
            else {
                res.send('Nenhum professor foi removido');
                res.status(404);
            }
        }
    });
    res.send('Usuário removido com sucesso ');
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

    /*var id = req.params.id;
    var deleteTeacher = teachers.filter((c) => {return (c.id == id); });
    if (deleteTeacher.length >= 1) {
        for(var i=0;i<teachers.length;i++){
            if (teachers[i].id == id){
                teachers.splice(i,1);
                res.send('Deletado com sucesso ');
            }
        }
    }
    else
        res.send('Estudante não encontrado '); */
});

function getTeacher(teacherId){
    teacherId = parseInt(teacherId);

    for(var i=0;i<teachers.length;i++){
        if(teacherId == teachers[i].id){
            return teachers[i];
        }
    }
}

module.exports = {router, getTeacher};