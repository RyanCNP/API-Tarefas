use('test')
db.usuarios.insertMany([
    {
        "nome" : "Usuário 1",
        "email" : "usuario1@gmail.com",
        "senha" : "123Mudar",
        "ativo" : true,
        "tipo" : "Admin",
        "sexo" : "Masculino"
    },
    {
        "nome" : "Usuário 2",
        "email" : "usuario2@gmail.com",
        "senha" : "123Mudar",
        "ativo" : true,
        "tipo" : "Admin",
        "sexo" : "Feminino"
    },
    {
        "nome" : "Usuário 3",
        "email" : "usuario3@gmail.com",
        "senha" : "123Mudar",
        "ativo" : true,
        "tipo" : "Admin",
        "sexo" : "Feminino"
    },
    {
        "nome" : "Usuário 4",
        "email" : "usuario4@gmail.com",
        "senha" : "123Mudar",
        "ativo" : false,
        "tipo" : "Commun",
        "sexo" : "Feminino"
    }
])
//Listando todos os usuários sem filtros
db.usuarios.find()

use('test')
db.usuarios.insertOne({
    'nome': 'Usuário Teste',
    'email': 'usuarioteste@gmail.com',
    'senha': '123Mudar',
    'ativo': true,
    'tipo': 'Commun', //ou Admin
    'sexo': 'Masculino'
})
//Criando um índice único para o email
db.usuarios.createIndex({ 'email': 1 }, { unique: true })
//Listando os usuários
db.usuarios.find({}, { senha: 0 })