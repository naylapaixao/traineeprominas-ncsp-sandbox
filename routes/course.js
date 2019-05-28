const express = require('express');
const router = express.Router();
const  teacherConsult = require('./teacher');

var id=0; //contador id

var courses = [
    {"id":++id,"name": "Sistemas de Informação", "period":"2","teacher":"yyy", "city":"Ipatinga"},
    {"id":++id,"name": "Arquitetura", "period":"2","teacher":"xxx","city":"Ipatinga"}
]

router.get('/', function (req, res) {
    res.send(courses);
});

router.post('/', function (req, res) {
    var newcourse = req.body;
    newcourse.id = id++;
    //var filteredTeacher = newcourse.teacher.filter();
    for (var i=0;i<newcourse.teacher.length;i++){
        var teacherId = newcourse.teacher[i];
        newcourse.teacher[i] = teacherConsult.getTeacher(teacherId);
    }
    /*console.log(filteredTeacher);
    if (filteredTeacher.length >= 1){
        newcourse.push(filteredTeacher[0]);
        res.send('Novo Curso Cadastrado ');
    } */


    courses.push(newcourse);
    res.send('Curso Cadastrado com sucesso');
});

router.put('/:id', function (req, res) {
    var id = req.params.id;
    var filterestCourses = courses.filter((s) => {return (s.id == id); });
    if (filterestCourses.length >= 1){
        filterestCourses[0].name = req.body.name;
        filterestCourses[0].period = req.body.period;
        filterestCourses[0].city = req.body.city;

        filterestCourses[0].teacher =req.body.teacher.map(item => {
            return teacherConsult.getTeacher(item)
        });
    }
    res.send('Editado com sucesso');

});


router.get('/:id', function (req, res) {
    var id = req.params.id; //o parametro name tem que ser exatamente o mesmo que na rota
    var filterestCourses = courses.filter((s) => {return (s.id == id); });
    if (filterestCourses.length >= 1)
        res.send(filterestCourses[0]);
    else
        res.status(404);
        res.send('Curso não encontrado ');
});

router.delete('/', function (req, res) {
    courses = [];
    res.send('Cursos removidos com sucesso ');
});

router.delete('/:id', function (req, res) {
    var id = req.params.id;
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
        res.send('Curso não encontrado ');
});

function getCourse(courseId){
    courseId = parseInt(courseId);

    for(var i=0;i<courses.length;i++){
        if(courseId == courses[i].id){
            return courses[i];
        }
    }
}

module.exports = {router, getCourse};