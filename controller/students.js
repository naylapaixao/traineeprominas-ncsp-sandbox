const studentModel = require('../models/student');
const courseModel = require('../models/course');

var id=0;

exports.getAll = (req, res) => {
    let where = {'status':1};
    let projection = { _id: 0, id: 1, name: 1, lastname: 1, age: 1, course:1 };
    studentModel.findAll(where,projection)
        .then(students => {
            res.send(students);
        }).catch(err => {
        console.log(err);
        console.error("Ocorreu um erro ao enviar os usuários");
        res.status(500).send('Ocorreu um erro');
    });
};

exports.getOneStudent = function (req, res) {
    let where = { id: parseInt(req.params.id), status: 1 };
    let projection = { _id: 0, id: 1, name: 1, lastname: 1, age: 1, course:1 };

    studentModel.findOne(where, projection)
        .then(student => {
            if (student) {
                return res.send(student);
            }else {
                return res.status(404).send("Estudante não Encontrado.");
            }
        })
        .catch(err =>{
            console.error("Erro ao conectar a collection student");
            res.status(500).send("Erro ao conectar a collection student");
        });
};

exports.postStudent =  (req,res) => {
    if (req.body.name && req.body.lastname && req.body.course && (req.body.age >= 17)){
        let newstudent = req.body;
        newstudent.id = 0;
        newstudent.status = 1;

        // if (req.body.age < 17)
        //     return res.status(401).send("A idade mínima para cadastro de aluno é 17");

        (async function () {
            //let courseId = await getCourse(parseInt(req.body.course));

            for (let i = 0; i < newstudent.course.length; i++) {
                //let course = await getCourse(newstudent.course[i]);
                let course = await courseModel.getCourse(newstudent.course[i]);
                //newstudent.course[i] = course;

                if(course == false){
                    return res.status(401).send("Curso Inválido!");
                }else{
                    newstudent.course[i] = course[0];
                }
            }

            if (newstudent.course.length > 0){
                studentModel.insertOne(newstudent)
                    .then(user => {
                        res.status(201).send("Estudante Cadastrado com Sucesso.");
                    })
                    .catch(err => {
                        console.error("Erro ao Criar Um Novo Estudante", err);
                        res.status(500).send("Erro ao Criar Um Novo Estudante");
                    });
            }

        })();

    }else {
        res.status(401).send("Insira todos os campos obrigatorios e maioridade a partir de 17 anos");
    }
};

exports.putStudent = (req, res) => {
    if (req.body.name && req.body.lastname && req.body.age && req.body.course) {
        let id = parseInt(req.params.id);
        let alterStudent = req.body;
        alterStudent.id = parseInt(req.params.id);
        alterStudent.name = req.body.name;
        alterStudent.lastname = req.body.lastname;
        alterStudent.age = req.body.age;
        alterStudent.course = req.body.course;
        alterStudent.status = 1;

        (async function () {
            //let courseId = await getCourse(parseInt(req.body.course));

            for (let i = 0; i < alterStudent.course.length; i++) {
                //let course = await getCourse(newstudent.course[i]);
                let course = await courseModel.getCourse(alterStudent.course[i]);
                //newstudent.course[i] = course;

                if(!course){
                    return res.status(401).send("Curso Inválido!");
                }else{
                    alterStudent.course[i] = course[0];
                }
            }

            if (alterStudent.course.length > 0) {
                studentModel.update(alterStudent, { id: id, status: 1 })
                    .then(result => {

                        if (result.value) {
                            console.log(`INF: Estudante Atualizado`);
                            res.status(200).send(`Estudante Atualizado`);
                        } else {
                            console.log('Estudante não Encontrado.');
                            res.status(404).send('Estudante não Encontrado.');
                        }
                    })
                    .catch(err => {
                        console.error("Erro ao conectar a collection 'student'", err);
                        res.status(500).send("Erro ao conectar a collection 'student'");
                    });
            }

        })();
    }
};

exports.deleteStudent = (req, res) => {

    let where = {'id': parseInt(req.params.id), 'status':1};
    let set = {$set: {status:0}};



    // Don't actually remove just change user status
    studentModel.delete(where, set)
        .then(result => {

            if (result.value) {
                console.log(`INF: Estudante Removido`);
                res.status(200).send(`Estudante Removido`);
            } else {
                console.log('Nenhum Estudante Removido');
                res.status(204).send('Nenhum Estudante Removido');
            }
        })
        .catch(err => {
            console.error("Erro ao remover o Estudante", err);
            res.status(500).send("Erro ao remover o Estudante");
        });

};