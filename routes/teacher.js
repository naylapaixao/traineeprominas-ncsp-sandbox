const express = require('express');
const router = express.Router();

var id=0; //contador id

var professors = [
    {"id":++id,"name": "XXX", "lastname":"YYY","phd":"não"},
    {"id":++id,"name": "YYY", "lastname":"XXX","phd":"sim"}
]

router.get('/', function (req, res) {
    res.send(professors);
});

router.post('/', function (req, res) {
    var  professor = req.body;
    professors.push(professor);
    res.send('Curso Cadastrado com sucesso');
});

router.get('/:id', function (req, res) {
    var id = req.params.id; //o parametro name tem que ser exatamente o mesmo que na rota
    var filterestProfessors = professors.filter((s) => {return (s.id == id); });
    if (filterestProfessors.length >= 1)
        res.send(filterestProfessors[0]);
    else
        res.status(404);
        res.send('Professor não encontrado ');
});

router.delete('/', function (req, res) {
    professors = [];
    res.send('Cursos removidos com sucesso ');
});


module.exports = router;