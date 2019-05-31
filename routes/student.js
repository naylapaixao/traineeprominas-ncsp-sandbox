const express = require('express');
const router = express.Router();
const  courseConsult = require('./course');
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
        collection = db.collection('student');
    }
    db = database.db('trainee-prominas');
});


var id=0; //contador id

var students = [];

router.get('/', function (req, res) {
    //res.send(students);
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

router.post('/', function (req, res) {
    var newstudent = req.body;

    (async function() {

        for (let i = 0; i < newstudent.course.length; i++) {
            let courseId = await getCourse(newstudent.course[i]);
            newstudent.course[i] = courseId;
        }

        //TAREFA 4
        /*if (newstudent.name && newstudent.lastname && newstudent.age && newstudent.course){
            console.log(newstudent);
            newstudent.id = ++id;

            res.status(201);
            db.collection('student').insertOne(newstudent);
            res.send('Estudante Cadastrado com sucesso');
        }
        else {
            res.status(403);
            res.send('Insira todos os campos obrigatorios')
        } */

        db.collection('student').insertOne(newstudent, (err, result) => {

            if (err) {
                console.error("Erro ao Criar Um Novo Estudante", err);
                res.status(500).send("Erro ao Criar Um Novo Estudante");
            } else {
                res.status(201).send("Estudante Cadastrado com Sucesso.");
            }
        });

    })();

    //for (var i=0;i<newstudent.course.length;i++){
        //var courseId = newstudent.course[i];
    /*var courseId = newstudent.course;
    newstudent.course = courseConsult.getCourse(courseId);
    //}
    db.collection('student').insert(newstudent);
    res.send('Usuario Cadastrado com sucesso'); */
});

const getCourse = function(id) {

    return new Promise((resolve, reject) => {

        db.collection('course').findOne({ "id" : id }, (err, course) => {
            if (err){
                return reject(err);
            }
            else{
                return resolve(course);
            }
        });

    });
};

router.put('/:id', function (req, res) {
    let id = parseInt(req.params.id);
    let bodyuser = req.body;
    bodyuser.id = parseInt(req.params.id);

    if(bodyuser == {}){
        res.status('400');
        res.send('Solicitação não autorizada')
    }
    else {

        (async function() {

            for (let i = 0; i < bodyuser.course.length; i++) {
                let courseId = await getCourse(bodyuser.course[i]);
                bodyuser.course[i] = courseId;
            }

            db.collection('student').update({'id':id},bodyuser, (err, result) => {

                if (err) {
                    console.error("Erro ao Criar Um Novo Estudante", err);
                    res.status(500).send("Erro ao Criar Um Novo Estudante");
                } else {
                    res.status(201).send("Estudante Editado com Sucesso.");
                }
            });

        })();
    }

});

router.get('/:id', function (req, res) {
    let id = parseInt(req.params.id); //o parametro name tem que ser exatamente o mesmo que na rota

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
    var filterestStudents = students.filter((s) => {return (s.id == id); });
    if (filterestStudents.length >= 1)
        res.send(filterestStudents[0]);
    else
        res.status(404);
        res.send('Usuário não encontrado '); */
});

router.delete('/', function (req, res) {
    collection.remove({}, function (err, info) { //true: remove apenas 1 false: remove todos
        if (err){
            console.error('Ocorreu erro');
            res.status(500);
        }
        else {
            var numRemoved = info.result.n; //n: é um numero

            if (numRemoved > 0){
                console.log("INF: Todos os estudantes (" + numRemoved + ") foram removidos");
                res.status(204);
                res.send('Todos os estudantes removidos com sucesso');
            }
            else {
                res.send('Nenhum estudante foi removido');
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
                console.log("INF: Estudante (" + numRemoved + ") foram removidos");
                res.status(200);
                res.send(' Estudante removido com sucesso');
            }
            else {
                res.send('Nenhum estudante foi removido');
                res.status(404);
            }
        }
    });

    /* var id = req.params.id;
    var deleteStudent = students.filter((c) => {return (c.id == id); });
    if (deleteStudent.length >= 1) {
        for(var i=0;i<students.length;i++){
            if (students[i].id == id){
                students.splice(i,1);
                res.send('Deletado com sucesso ');
            }
        }

    }
    else
        res.send('Estudante não encontrado '); */
});

module.exports = router;