const express = require('express');
const router = express.Router();

var id=0; //contador id

var teachers = [];

router.get('/', function (req, res) {
    res.send(teachers);
});

router.put('/:id', function (req, res) {
    var id = req.params.id;
    var filterestProfessors = teachers.filter((s) => {return (s.id == id); });
    if (filterestProfessors.length >= 1){
        filterestProfessors[0].name = req.body.name || filterestProfessors[0].name  ;
        filterestProfessors[0].lastname = req.body.lastname || filterestProfessors[0].lastname ;
        filterestProfessors[0].phd = req.body.phd || filterestProfessors[0].phd ;
    }
    res.send('Editado com sucesso');

});

router.post('/', function (req, res) {
    var  professor = req.body;
    professor.id = ++id;
    teachers.push(professor);
    res.send('Professor Cadastrado com sucesso');
});

router.get('/:id', function (req, res) {
    var id = req.params.id; //o parametro name tem que ser exatamente o mesmo que na rota
    var filterestProfessors = teachers.filter((s) => {return (s.id == id); });
    if (filterestProfessors.length >= 1)
        res.send(filterestProfessors[0]);
    else
        res.status(404);
        res.send('Professor não encontrado ');
});

router.delete('/', function (req, res) {
    teachers = [];
    res.send('Cursos removidos com sucesso ');
});

router.delete('/:id', function (req, res) {
    var id = req.params.id;
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
        res.send('Estudante não encontrado ');
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