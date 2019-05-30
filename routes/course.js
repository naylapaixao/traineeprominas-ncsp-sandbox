const express = require('express');
const router = express.Router();
const  teacherConsult = require('./teacher');
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
        collection = db.collection('course');
    }
    db = database.db('trainee-prominas');
});

var id=0; //contador id

var courses = [];

router.get('/', function (req, res) {
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
   let newcourse = req.body;
   newcourse.id = ++id;

   console.log('Oi');
    (async function() {

        for (let i = 0; i < newcourse.teacher.length; i++) {
            let teacherId = await getTeacher(newcourse.teacher[i]);
            newcourse.teacher[i] = teacherId;
        }

        db.collection('course').insertOne(newcourse, (err, result) => {

            if (err) {
                console.error("Erro ao Criar Um Novo Curso", err);
                res.status(500).send("Erro ao Criar Um Novo Curso");
            } else {
                res.status(201).send("Curso Cadastrado com Sucesso.");
            }
        });

    })();
});

const getTeacher = function(id) {

    return new Promise((resolve, reject) => {

        db.collection('teacher').findOne({ "id" : id }, (err, teacher) => {
            if (err){
                console.log('Oi 3');
                return reject(err);
            }
            else{
                return resolve(teacher);
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

            for (let i = 0; i < bodyuser.teacher.length; i++) {
                let teacherId = await getTeacher(bodyuser.teacher[i]);
                bodyuser.teacher[i] = teacherId;
            }

            db.collection('course').update({'id':id},bodyuser, (err, result) => {

                if (err) {
                    console.error("Erro ao editar Um Novo Curso", err);
                    res.status(500).send("Erro ao Criar Um Novo Curso");
                } else {
                    res.status(201).send("Curso Editado com Sucesso.");
                }
            });

        })();
    }

    /* var id = req.params.id;
    var filterestCourses = courses.filter((s) => {return (s.id == id); });
    if (filterestCourses.length >= 1){
        filterestCourses[0].name = req.body.name || filterestCourses[0].name;
        filterestCourses[0].period = req.body.period || filterestCourses[0].period;
        filterestCourses[0].city = req.body.city || filterestCourses.city;

        filterestCourses[0].teacher =req.body.teacher.map(item => {
            return teacherConsult.getTeacher(item);
        });
    }
    res.send('Editado com sucesso'); */

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
    var filterestCourses = courses.filter((s) => {return (s.id == id); });
    if (filterestCourses.length >= 1)
        res.send(filterestCourses[0]);
    else
        res.status(404);
        res.send('Curso não encontrado '); */
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
                console.log("INF: Todos os curso (" + numRemoved + ") foram removidos");
                res.status(204);
                res.send('Todos os cursos removidos com sucesso');
            }
            else {
                res.send('Nenhum curso foi removido');
                res.status(404);
            }
        }
    });
    res.send('Cursos removidos com sucesso ');

    //courses = [];
    //res.send('Cursos removidos com sucesso ');
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
                console.log("INF: Curso (" + numRemoved + ") foram removidos");
                res.status(200);
                res.send(' Curso removido com sucesso');
            }
            else {
                res.send('Nenhum curso foi removido');
                res.status(404);
            }
        }
    });

    /* var id = req.params.id;
    var deleteCourse = courses.filter((c) => {return (c.id == id); });
    if (deleteCourse.length >= 1) {
        for(var i=0;i<courses.length;i++){
            if (courses[i].id == id){
                courses.splice(i,1);
                res.send('Deletado com sucesso ');
            }
        }

    }
    else
        res.send('Curso não encontrado '); */
});

/* function getCourse(courseId){
    courseId = parseInt(courseId);

    for(var i=0;i<courses.length;i++){
        if(courseId == courses[i].id){
            return courses[i];
        }
    }
} */

module.exports = {router};