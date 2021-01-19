import express from 'express';
import * as bodyParser from 'body-parser';
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("User-Api", "icodb", "123456", {
    dialect: "mysql",
    host: "localhost"
});


const app = express();

app.use(bodyParser.json({
    limit: '50mb',
    verify(req: any, buf) {
        req.rawBody = buf;
    }
}));

try {

    sequelize.authenticate();

    console.log('Connecté à la base de données MySQL!');


    // Users
    app.get('/compte', (req, res) => {
        sequelize.query("SELECT * FROM user", { raw: true, type: sequelize.QueryTypes.SELECT }).then(((results: any) => {
            res.send(results)
        }))
    });

    // Le type que l'on envoie dans ce post est 
    // { "passwordAdmin": string , "newUser" :{"name": string, "email": string, "age": int, "username":string, "password":string }}
    app.post('/compte', (req, res) => {
        if (req.body.passwordAdmin == undefined || req.body.newUser.name == undefined || req.body.newUser.email == undefined || req.body.newUser.age == undefined || req.body.newUser.password == undefined || req.body.newUser.username == undefined) {
            res.status(400).end("La requete doit contenir des champs { passwordAdmin: string , newUser :{name: string, email: string, age: int, username:string, password:string }}")
        }
        if (req.body.passwordAdmin != "123456") {
            res.status(400).end("Le mot de passe n'est pas celui de l'administrateur")
        } else {
            sequelize.query("INSERT INTO `user` (name,email,age,password,username) VALUES(\"" + req.body.newUser.name + "\",\"" + req.body.newUser.email + "\"," + req.body.newUser.age + ",\"" + req.body.newUser.password + "\",\"" + req.body.newUser.username + "\")", { raw: true, type: sequelize.QueryTypes.INSERT }).then(((results: any) => {
                res.status(200).json(results)
            })).catch((error: any) => res.status(400).end("Erreur avec la base de donnée : " + error))
        }
    })

    // Le type que l'on envoie dans ce put est 
    // { username:string, password:string }
    app.put('/compte/login', (req, res) => {
        console.log(req.body)
        console.log(req.body.username,req.body.password)
        if (req.body.username == undefined || req.body.password == undefined) {
            res.status(400).end("La requete doit contenir des champs { username:string, password:string }")
        }
        else {
            sequelize.query("SELECT * FROM user WHERE password = \"" + req.body.password + "\" AND username = \"" + req.body.username + "\"").then(((results: any) => {
                if (results[0].length == 0) {
                    res.status(401).end("Utilisateur non existant")
                }
                else {
                    res.status(200).end("")
                }
            })).catch((error: any) => res.status(400).end("Erreur avec la base de donnée : " + error))
        }

    });


} catch (error) {
    console.error('Impossible de se connecter, erreur suivante :', error);
}

app.get('/', (req, res) => res.send("Listes des routes :<br>/compte (méthodes GET et POST) <br>/compte/login (PUT)"))

export { app };
