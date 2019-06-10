const teacherModel = require('../models/teacher');
const studentModel = require('../models/student');
const courseModel = require('../models/course');

const mongoose = require("mongoose");
const teacherSchema = require('../schema').teacherSchema;
const Teacher = mongoose.model('Teacher', teacherSchema);

var id=0;


exports.getAll = (req, res) => {
    let where = {'status':1};
    let projection = { _id: 0, id: 1, name: 1, lastName: 1, phd: 1 };
    teacherModel.findAll(where,projection)
        .then(teachers => {
            res.send(teachers);
        }).catch(err => {
        console.log(err);
        console.error("Ocorreu um erro ao enviar os usuários");
        res.status(500).send('Ocorreu um erro');
    });
};

/* exports.getAllTeachers = function (req, res) {
    const query = { id: parseInt(req.params.id), status: 1 };
    const projection = { _id: 0, id: 1, name: 1, lastName: 1, phd: 1 };

    teacherModel.findAll(query, projection)
        .then(users => {
            console.log(users)
            res.send(users);
        })

        .catch(err => {
            console.error("Erro ao conectar a collection user");
            res.status(500).send("Erro ao conectar a collection user");
        });
}; */

exports.getOneTeacher = function (req, res) {
    let query = { id: parseInt(req.params.id), status: 1 };
    let projection = { _id: 0, id: 1, name: 1, lastName: 1, phd: 1 };

    teacherModel.findOne(query, projection)
        .then(teacher => {
            if (teacher) {
                return res.send(teacher);
            }else {
                return res.status(404).send("Professor não Encontrado.");
            }
        })
        .catch(err =>{
            console.error("Erro ao conectar a collection teacher");
            res.status(500).send("Erro ao conectar a collection teacher");
        });
};

exports.postTeacher =  (req,res) => {
    let teacher = new Teacher ({id: ++id, name: req.body.name, lastName: req.body.lastName, status: 1, phd:req.body.phd});

    teacher.validate(error => {
        if(!error){
            return teacherModel.insertOne(teacher)
                .then(result => {
                    res.status(201).send('Professor cadastrado com sucesso!');
                })
                .catch(err => {
                    console.error("Erro ao conectar a collection teacher: ", err);
                    res.status(500);
                });
        }else{
            res.status(401).send('Não foi possível cadastrar o Professor phd inválido');
        }
    });


    /*if (req.body.name && req.body.lastName && (req.body.phd == true)){
        let  newteacher = req.body;
        newteacher.id = ++id;
        newteacher.name =req.body.name;
        newteacher.lastName = req.body.lastName;
        newteacher.status = 1;

        if(req.body.phd && typeof (req.body.phd == 'boolean')){
            newteacher.phd = req.body.phd;
        }


        teacherModel.insertOne(newteacher)
            .then(user => {
                res.status(201).send("Professor Cadastrado com Sucesso.");
            })
            .catch(err => {
                console.error("Erro ao Criar Um Novo Professor", err);
                res.status(500).send("Erro ao Criar Um Novo Professor");
            });
    }else {
        res.status(401).send("Campo Inválido");
    } */
};

exports.putTeacher = (req, res) => {
    let teacher = ({id: parseInt(req.params.id), name: req.body.name, lastName: req.body.lastName, status: 1, phd:req.body.phd});
    let where = { id: parseInt(req.params.id), status: 1 };
    let alterTeacher = new Teacher(teacher);

    alterTeacher.validate(error => {
        if(!error){
            return teacherModel.update(where, {$set: teacher})
                .then(result => {

                    let updatedTeacher = result.value;

                    (async () => {

                        try {
                            // // Updates the teacher from all courses that he is associated
                            await courseModel.updateMany(
                                { "status": 1, "teachers._id": updatedTeacher._id },
                                { "teachers.$":  updatedTeacher });

                            // Updates the teacher from all student.course that he is associated
                            await studentModel.updateMany(
                                { "status": 1, "course.teachers._id": updatedTeacher._id },
                                { "course.teachers.$":  updatedTeacher } );

                        } catch(err) {
                            console.error(err);
                        }

                        //console.log(`INF: Professor Atualizado`);
                        res.status(201).send(`Professor Atualizado`);

                    })();

                })

        }else{
            res.status(401).send('Não foi possível cadastrar o Professor phd inválido');
        }
    });


    //  if (req.body.name && req.body.lastName && (req.body.phd == true)){
    //     let teacherAlter = req.body;
    //     let id = parseInt(req.params.id);
    //     teacherAlter.id = id;
    //     teacherAlter.name = req.body.name;
    //     teacherAlter.lastName = req.body.lastName;
    //     teacherAlter.profile = req.body.profile;
    //     teacherAlter.status =1;
    //
    //     if(req.body.phd && typeof (req.body.phd == 'boolean')){
    //         teacherAlter.phd = req.body.phd;
    //     }
    //
    //     // updates the teacher if it exists and it is active
    //     teacherModel.update(teacherAlter, { id: id, status: 1 })
    //         .then(result => {
    //
    //             let updatedTeacher = result.value;
    //
    //             (async () => {
    //
    //                 try {
    //
    //                     // // Updates the teacher from all courses that he is associated
    //                      await courseModel.updateMany(
    //                          { "status": 1, "teachers._id": updatedTeacher._id },
    //                          { "teachers.$":  updatedTeacher });
    //
    //                      // Updates the teacher from all student.course that he is associated
    //                      await studentModel.updateMany(
    //                          { "status": 1, "course.teachers._id": updatedTeacher._id },
    //                         { "course.teachers.$":  updatedTeacher } );
    //
    //                 } catch(err) {
    //                     console.error(err);
    //                 }
    //
    //                 //console.log(`INF: Professor Atualizado`);
    //                 res.status(201).send(`Professor Atualizado`);
    //
    //             })();
    //
    //         })
    //         .catch(err => {
    //             console.error("Erro ao conectar a collection 'teacher'", err);
    //             res.status(500).send("Erro ao conectar a collection 'teacher'");
    //         });
    //
    //
    //     /*teacherModel.update(id, teacherAlter)
    //         .then(user => {
    //             res.status(201).send("Usuário Cadastrado com Sucesso.");
    //         })
    //         .catch(err => {
    //             console.error("Erro ao Criar Um Novo Usuário", err);
    //             res.status(500).send("Erro ao Criar Um Novo Usuário");
    //         }); */
    // }else {
    //     res.status(401).send("Campo Inválido");
    // }
}

exports.deleteTeacher = (req, res) =>{
    let where = {'id': parseInt(req.params.id), 'status':1};
    let set = {$set: {status:0}};


    teacherModel.delete(where, set)
        .then(async (results) => {
            courseModel.deleteProf(parseInt(req.params.id)).then(() => {

            courseModel.getAllTeachers().then(courses =>{
                for(var i = 0; i<courses.length; i++){
                    studentModel.updateTeacher(courses[i]);
                }

            });

            if (results.value == null){
                res.status(204).send("Não foi possivel encontrar professor");
            }
            else {
                res.send("Professor excluido com sucesso");
            }
        })
        })
        .catch(err =>{
            console.error("Ocorreu um erro ao deletar os professor");
            res.status(500);
        })
};