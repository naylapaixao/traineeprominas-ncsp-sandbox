const express = require('express');
const router = express.Router();

var id=0; //contador id

var users = [
    {"id":++id,"name": "Marcos", "lastname":"Alves","profile":"adm"},
    {"id":++id,"name": "Pedro", "lastname":"Cavalcanti","profile":"adm"}
]

router.get('/', function (req, res) {
    res.send(users);
});

router.post('/', function (req, res) {
    var  user = req.body;
    users.push(user);
    res.send('Usuario Cadastrado com sucesso');
});

router.get('/:id', function (req, res) {
    var id = req.params.id; //o parametro name tem que ser exatamente o mesmo que na rota
    var filterestUser = users.filter((u) => {return (u.id == id); });
    if (filterestUser.length >= 1)
        res.send(filterestUser[0]);
    else
        res.status(404);
        res.send('Usuário não encontrado ');
});

router.delete('/', function (req, res) {
    users = [];
    res.send('Usuário removido com sucesso ');
});

module.exports = router;