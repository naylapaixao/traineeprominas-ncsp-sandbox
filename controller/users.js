const userModel = require('../models/user');

var id=0;

// exports.getAllUsers = function (req, res) {
//     const query = { status: 1 };
//     const projection = { _id: 0, id: 1, name: 1, lastname: 1, profile: 1 };
//
//     userModel.findAll(query, projection)
//         .then(users => {
//             res.send(users);
//         })
//
//         .catch(err => {
//             console.error("Erro ao conectar a collection user");
//             res.status(500).send("Erro ao conectar a collection user");
//         });
// };



exports.getOneUser = function (req, res) {
    const query = { id: parseInt(req.params.id), status: 1 };
    const projection = { _id: 0, id: 1, name: 1, lastname: 1, profile: 1 };

    userModel.findOne(query, projection)
        .then(user => {
            if (user) {
                return res.send(user);
            }else {
                return res.status(404).send("Usuário não Encontrado.");
            }
        })
        .catch(err =>{
            console.error("Erro ao conectar a collection user");
            res.status(500).send("Erro ao conectar a collection user");
        });
};

exports.postUser =  (req,res) => {
    if (req.body.name && req.body.lastname && (req.body.profile == 'admin' || req.body.profile == 'guess')){  //(req.body.profile == true)
        let  newuser = req.body;
        newuser.id = 0;
        newuser.name =req.body.name;
        newuser.lastname = req.body.lastname;
        newuser.profile = req.body.profile;
        newuser.status = 1;

        userModel.insertOne(newuser)
            .then(user => {
                res.status(201).send("Usuário Cadastrado com Sucesso.");
            })
            .catch(err => {
                console.error("Erro ao Criar Um Novo Usuário", err);
                res.status(500).send("Erro ao Criar Um Novo Usuário");
            });
    }else {
        res.status(401).send("Não foi possível cadastrar usuário profile invalido");
    }
};

exports.putUser = (req, res) => {
    if (req.body.name && req.body.lastname && (req.body.profile == 'admin' || req.body.profile == 'guess') ){
        let userAlter = req.body;
        let id = parseInt(req.params.id);
        userAlter.id = id;
        userAlter.name = req.body.name;
        userAlter.lastname = req.body.lastname;
        userAlter.profile = req.body.profile;
        userAlter.status =1;

        userModel.update(id, userAlter)
            .then(user => {
                res.status(201).send("Usuário Cadastrado com Sucesso.");
            })
            .catch(err => {
                console.error("Erro ao Criar Um Novo Usuário", err);
                res.status(500).send("Erro ao Criar Um Novo Usuário");
            });
    }else {
        res.status(401).send("Campo Inválido");
    }
}

exports.deleteUser = (req, res) =>{
    let id = parseInt(req.params.id)

    userModel.delete(id)
        .then(results => {
            if (results.value == null){
                res.status(204).send("Não foi possivel encontrar usuário");
            }
            else {
                res.status(200).send("Usuario excluido com sucesso");
            }
        })
        .catch(err =>{
            console.error("Ocorreu um erro ao deletar os usuarios");
            res.status(500);
        })
}