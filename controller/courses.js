const courseModel = require('../models/course');
const studentModel = require('../models/student');
const teacherModel = require('../models/teacher');

var id=0;

exports.getAll = (req, res) => {
    let where = {'status':1};
    let projection = {projection: {_id:0, id:1, name:1, period:1, city:1, 'teacher.id':1, 'teacher.name':1, 'teacher.lastname':1, 'teacher.phd':1}}
    courseModel.findAll(where,projection)
        .then(courses => {
            res.send(courses);
        }).catch(err => {
        console.log(err);
        console.error("Ocorreu um erro ao enviar os cursos");
        res.status(500).send('Ocorreu um erro');
    });
};

exports.getOneCourse = function (req, res) {

    let where = { id: parseInt(req.params.id), status: 1 };
    let projection = { _id: 0, id: 1, name: 1, period: 1, teacher: 1, city:1 };

    courseModel.findOne(where, projection)
        .then(course => {
            if (course) {
                return res.send(course);
            }else {
                return res.status(404).send("Curso não Encontrado.");
            }
        })
        .catch(err =>{
            console.error("Erro ao conectar a collection course");
            res.status(500).send("Erro ao conectar a collection course");
        });
};

exports.postCourse = (req, res) => {
    if (req.body.name && req.body.city){
        let newcourse = req.body;
        newcourse.period = parseInt(req.body.period) || 8;
        newcourse.status = 1;
        newcourse.id = 0;

        (async function() {

            let validos = [];
            let invalidos = [];

            //IF INFORM TEACHER, GET TEACHER ID
            if(req.body.teacher){
                for (let i = 0; i <req.body.teacher.length; i++) {
                    //let teacher = await teacherModel.getTeacher(newcourse.teacher);
                    let teacherId = parseInt(req.body.teacher[i]);
                    let teacher = await teacherModel.findOne({ id: teacherId });

                    if (teacher) {
                        validos.push(teacher);
                    }
                    else {
                        invalidos.push(req.body.teacher[i]); //retorna id de professor inválido
                    }
                }
                newcourse.teacher = validos; //retorna corpo de professores validos
            }

            if (newcourse.teacher.length < 2){
                return res.status(401).send('O curso deverá ter ao menos dois professores válidos.');

            }
            courseModel.insertOne(newcourse)
                .then(result => {

                    // If some invalid teacher id was informed
                    if (invalidos.length > 0)
                        return res.status(201).send(`Curso Cadastrado com Sucesso. Os seguintes ids de professores não foram encontrados: ${invalidos}`);

                    return res.status(201).send("Curso Cadastrado com Sucesso.");
                })
                .catch(err => {
                    console.error("Erro ao Criar Um Novo Curso", err);
                    res.status(500).send("Erro ao Criar Um Novo Curso");
                });

        })();
    }
};

exports.putCourse = (req, res) =>{
    if (req.body.name && req.body.city){
        let id = parseInt(req.params.id);
        let alterCourse = req.body;
        alterCourse.id = parseInt(req.params.id);
        alterCourse.name = req.body.name;
        alterCourse.period = req.body.period || 8;
        alterCourse.city = req.body.city;
        alterCourse.status = 1;

        (async function() {

            let validos = [];
            let invalidos = [];

            //IF INFORM TEACHER, GET TEACHER ID
            if(req.body.teacher){
                for (let i = 0; i <req.body.teacher.length; i++) {
                    //let teacherId = parseInt(req.body.teacher[i]);
                    //let teacher = await teacherModel.getTeacher({ "id": alterCourse.teacher });

                    let teacherId = parseInt(req.body.teacher[i]);
                    let teacher = await teacherModel.findOne({ id: teacherId });

                    // console.log(teacher);
                    if (teacher != null) {
                        validos.push(teacher);
                    }
                    else {
                        invalidos.push(req.body.teacher[i]); //retorna id de professor inválido
                    }
                }
                alterCourse.teacher = validos; //retorna corpo de professores validos
            }

            let query = { id: parseInt(req.params.id), status: 1 };
            // updates the course if it exists and it is active
            courseModel.update(query, alterCourse)
                .then(result => {
                // console.log(result.value, '<<<<<<<<<<<')
                    // if (result.value) {

                        // updates all students that have this course with the updated data about it
                        studentModel.updateCourse(parseInt(req.params.id), result.value);
                            // .then(result => {

                                // If some invalid teacher id was informed
                                if (invalidos.length > 0)
                                    return res.status(201).send(`Curso Atualizado com Sucesso. Os ids dos professores não foram encontrados: ${invalidos}`);

                                console.log(`INF: Curso Atualizado`);
                                res.status(200).send(`Curso Atualizado`);

                            // })
                            // .catch(err => {
                                // console.error(err);
                            // });
//
                    //} else {
                    //     console.log('Curso não Encontrado.');
                    //     res.status(404).send('Curso não Encontrado.');
                    // }

                })
                .catch(err => {
                    console.error("Erro ao conectar a collection course", err);
                    res.status(500).send("Erro ao conectar a collection course");
                });

        })();
    }
};

exports.deleteCourse = (req, res) => {
    let where = {'id': parseInt(req.params.id),'status':1};
    let set = {status:0};

    courseModel.delete(where, set)
        .then(result => {
            studentModel.deleteCourse(parseInt(req.params.id));
            if(result.value){
                console.log('O curso foi removido');
                res.status(200).send('O curso foi removido com sucesso');
            }else{
                console.log('Nenhum curso foi removido');
                res.status(204).send();
            }
        })
        .catch(err => {
            console.error('Erro ao conectar a collection course:', err);
            res.status(500);
        });
};


