const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

var students = [
    {"name": "Marcos", "idade":"23"},
    {"name": "Pedro", "idade":"23"},
    {"name": "Lucas", "idade":"22"}

    ]

app.get('/', function (req, res) {
    res.send('Hello World - GET - Teste');
})

app.post('/students', function (req, res) {
    var  student = req.body;
    students.push(student);
    res.send('Estudante Cadastrado com sucesso');
})

app.get('/students', function (req, res) {
    res.send(students);
})

app.get('/students/:name', function (req, res) {
    var name = req.params.name; //o parametro name tem que ser exatamente o mesmo que na rota
    var filterestStudents = students.filter((s) => {return (s.name == name); });
    if (filterestStudents.length >= 1)
        res.send(filterestStudents[0]);
    else
        res.status(404)
        res.send('Estudante não encontrado ')
})

app.delete('/students', function (req, res) {
    students = [];
    res.send('Estudantes removidos com sucesso ');
})

app.post('/', function (req, res) {
    res.send('Hello World - POST');
})

app.listen(process.env.PORT);