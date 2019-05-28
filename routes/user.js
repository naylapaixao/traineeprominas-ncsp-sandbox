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

router.put('/:id', function (req, res) {
    var id = req.params.id;
    var filterestUsers = users.filter((s) => {return (s.id == id); });
    if (filterestUsers.length >= 1){
        filterestUsers[0].name = req.body.name;
        filterestUsers[0].lastname = req.body.lastname;
        filterestUsers[0].profile = req.body.profile;
    }
    res.send('Editado com sucesso');

});

router.post('/', function (req, res) {
    var  newuser = req.body;
    newuser.id = ++id;
    users.push(newuser);
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

router.delete('/:id', function (req, res) {
    var id = req.params.id;
    var deleteUser = users.filter((c) => {return (c.id == id); });
    if (deleteUser.length >= 1) {
        for(var i=0;i<users.length;i++){
            if (users[i].id == id){
                users.splice(i,1);
                res.send('Deletado com sucesso ');
            }
        }

    }
    else
        res.send('Estudante não encontrado ');
});

module.exports = router;