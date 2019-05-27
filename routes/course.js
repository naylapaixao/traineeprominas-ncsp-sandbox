const express = require('express');
const router = express.Router();

var id=0; //contador id

var courses = [
    {"id":++id,"name": "Sistemas de Informação", "period":"2","idprof":"", "city":"Ipatinga"},
    {"id":++id,"name": "Arquitetura", "period":"2","idprof":"","city":"Ipatinga"}
]

router.get('/', function (req, res) {
    res.send(courses);
});

router.post('/', function (req, res) {
    var  course = req.body;
    courses.push(course);
    res.send('Curso Cadastrado com sucesso');
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

module.exports = router;