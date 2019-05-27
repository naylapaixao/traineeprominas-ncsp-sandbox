const express = require('express');
const router = express.Router();

var id=0; //contador id

var students = [
    {"id":++id,"name": "Marcos", "lastname":"Alves","age":"23", "course":"Sistemas de Informação"},
    {"id":++id,"name": "Pedro", "lastname":"Cavalcanti","age":"25","course":"Arquitetura"}
]

router.get('/', function (req, res) {
    res.send(students);
});

router.post('/', function (req, res) {
    var  student = req.body;
    students.push(student);
    res.send('Usuario Cadastrado com sucesso');
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

module.exports = router;