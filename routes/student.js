const express = require('express');
const router = express.Router();
const  courseConsult = require('./course');


var id=0; //contador id

var students = [
    {"id":++id,"name": "Marcos", "lastname":"Alves","age":"23", "course":"Sistemas de Informação"},
    {"id":++id,"name": "Pedro", "lastname":"Cavalcanti","age":"25","course":"Arquitetura"}
]

router.get('/', function (req, res) {
    res.send(students);
});

router.post('/', function (req, res) {
    var newstudent = req.body;
    newstudent.id = ++id;
    //for (var i=0;i<newstudent.course.length;i++){
        //var courseId = newstudent.course[i];
    var courseId = newstudent.course;
        newstudent.course = courseConsult.getCourse(courseId);
    //}
    students.push(newstudent);
    res.send('Usuario Cadastrado com sucesso');
});

router.put('/:id', function (req, res) {
    var id = req.params.id;
    var filterestStudents = students.filter((s) => {return (s.id == id); });
    if (filterestStudents.length >= 1){
        filterestStudents[0].name = req.body.name || filterestStudents[0].name  ;
        filterestStudents[0].lastname = req.body.lastname || filterestStudents[0].lastname ;
        filterestStudents[0].age = req.body.age || filterestStudents[0].age;
        filterestStudents[0].course = req.body.course || filterestStudents[0].course;

        filterestStudents[0].course = courseConsult.getCourse(req.body.course);
    }

    res.send('Editado com sucesso');

});

router.get('/:id', function (req, res) {
    var id = req.params.id; //o parametro name tem que ser exatamente o mesmo que na rota
    var filterestStudents = students.filter((s) => {return (s.id == id); });
    if (filterestStudents.length >= 1)
        res.send(filterestStudents[0]);
    else
        res.status(404);
        res.send('Usuário não encontrado ');
});

router.delete('/', function (req, res) {
    students = [];
    res.send('Estudantes removidos com sucesso ');
});

router.delete('/:id', function (req, res) {
    var id = req.params.id;
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
        res.send('Estudante não encontrado ');
});

module.exports = router;