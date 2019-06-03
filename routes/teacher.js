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
        db.collection('teacher').find({}).toArray((err, teacher) =>{id = teacher.length});
    }
    db = database.db('trainee-prominas');
});

var id=0; //contador id

var teachers = [];

router.get('/', function (req, res) {
    collection.find({}, {projection: {_id:0, status:0}}).toArray((err, users) =>{
        if(err) {
            console.error('Ocorreu um erro ao conectar ao Teacher');
            res.status(500);
        }
        else {
            res.send(users);
        }
    });
});

// UPDATE ONE PROFESSOR
router.put('/:id', function (req, res) {
    if (req.body.name && req.body.lastname) {

        let alterTeacher = req.body;
        let id = parseInt(req.params.id);
        alterTeacher.name = req.body.name;
        alterTeacher.lastname = req.body.lastname;
        alterTeacher.id = id;
        alterTeacher.status = 1;

        if(req.body.phd && typeof (req.body.phd == 'boolean')){
            alterTeacher.phd = req.body.phd;
        }


        collection.findOneAndUpdate({"id":id,"status":1},{$set:{...alterTeacher}}, {returnOriginal: false}, function(err, info){
            (async () => {
                let updateTeacher = info.value;

                try {
                    await db.collection('course').updateMany(
                        {"status":1, "teacher.id":parseInt(req.params.id)},
                        {$set: {"teacher.$": updateTeacher}});

                    let courses = await de.collection('course').find({"status":1, "teacher.id":parseInt(req.params.id)}).toArray();

                    for (let i = 0; i<courses.length; i++){
                        await db.collection('student').findOneAndReplace(
                            {"status":1, "course.id":courses[i].id},
                            {$set: {"course":courses[i]}});
                    }

                } catch(err){
                    console.log(err);
                }

            })();
            if(err){
                console.log(err);
                res.status(401).send('Não é possível editar professor inexistente');
            }else{
                res.status(200).send('Professor editado com sucesso!');
            }});
    }else{
        res.status(401).send('Não foi possível editar o professor');
    }
})

        /*db.collection('teacher').findOneAndUpdate({"id":id, "status":1}, {$set:{...alterTeacher}}, function (err, result) {
            console.log(alterTeacher);
            if (result.value == null){
                res.status(404);
                res.send("Nenhum Campo atualizado");
            }
            else {
                res.send("Editado com sucesso");
            }
        }) */
   /* }
    else {
        es.status(403);
        res.send("Solicitação não autorizada");
    } */

    /*var id = parseInt(req.params.id);
    var bodyuser = req.body;
    bodyuser.id = parseInt(req.body);

    if(bodyuser == {}){
        res.status('400');
        res.send('Solicitação não autorizada')
    }
    else {
        collection.update({'id':id}, bodyuser);
        res.send('Professor editado com sucesso');
    } */
// });

// CREATE NEW TEACHER
router.post('/', function (req, res) {
    if (req.body.name && req.body.lastname){

        let newteacher = req.body;
        console.log(newteacher);
        newteacher.id = ++id;
        newteacher.status = 1;

        if(req.body.phd && typeof (req.body.phd == 'boolean')){
            newteacher.phd = req.body.phd;
        }

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

// GET ONE TEACHER
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

//DELETE ALL
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

//DELETE ONE TEACHER
router.delete('/:id', function (req, res) {
    let id = parseInt(req.params.id);

    //collection.remove({'id':id},true, function (err, info) { //true: remove apenas 1 false: remove todos
    db.collection('teacher').findOneAndUpdate({'id':id, 'status':1}, {$set:{status:0}}, function (err, info){
        if (err){
            console.error('Ocorreu erro');
            res.status(500);
        }
        else {
            //let numRemoved = info.result.n; //n: é um numero

            if (info.value != null){
                console.log("INF: Usuário  foi removidos");
                res.status(200);
                res.send('Professor removido com sucesso');
            }
            else {
                res.send('Nenhum usuário foi removido');
                res.status(404);
            }
        }
    });
});

module.exports = {router};