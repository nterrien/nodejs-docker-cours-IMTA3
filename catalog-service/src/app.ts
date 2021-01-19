import express from 'express';
import * as bodyParser from 'body-parser';

const got = require('got');
const { Sequelize } = require('sequelize');

const sequelize2 = new Sequelize("Catalog-Api", "icodb", "123456", {
    dialect: "mysql",
    host: "localhost"
});

const adresseServiceConnexion = "http://0.0.0.0:5000/compte/login"

const app = express();

app.use(bodyParser.json({
    limit: '50mb',
    verify(req: any, buf) {
        req.rawBody = buf;
    }
}));

try {

    sequelize2.authenticate();

    console.log('Connecté à la base de données MySQL!');

    // Movies
    // Le type que l'on envoie dans ce put est 
    // {"username" : string, "password" : string} 
    app.put('/catalogue', (req, res) => {
        if (req.body.username == undefined || req.body.password == undefined) {
            res.status(400).end("La requete doit contenir des champs {username : string, password : string} ")
        }
        got.put(adresseServiceConnexion, {
            json: {
                username: req.body.username,
                password: req.body.password
            },
            responseType: 'json'
        }).then((resp: any) => {
            if (resp.statusCode == 200) {
                sequelize2.query("SELECT * FROM movies").then(((results: any) => {
                    res.send(results[0]);
                }))
            }
        }).catch((error: any) => res.status(401).end("Le mot de passe est faux ou l'utilisateur n'existe pas"));
    });

    // Le type que l'on envoie dans ce post est 
    // { "user" : {"username" : string, "password" : string} , "newFilm" : {"title": string, "director": string, "age_rating": int, "duration": int, "popularity": int}}
    app.post('/catalogue', (req, res) => {
        if (req.body.user.username == undefined || req.body.user.password == undefined || req.body.newFilm.title == undefined || req.body.newFilm.director == undefined || req.body.newFilm.age_rating == undefined || req.body.newFilm.duration == undefined || req.body.newFilm.popularity == undefined) {
            res.status(400).end("La requete doit contenir des champs { \"user\" : {\"username\" : string, \"password\" : string} , \"newFilm\" : {\"title\": string, \"director\": string, \"age_rating\": int, \"duration\": int, \"popularity\": int}}")
        }
        else {
            got.put(adresseServiceConnexion, {
                json: {
                    username: req.body.user.username,
                    password: req.body.user.password,
                },
                responseType: 'json'
            }).then((resp: any) => {
                if (resp.statusCode == 200) {
                    sequelize2.query("INSERT INTO `movies` (title,director,`age-rating`,duration,popularity) VALUES(\"" + req.body.newFilm.title + "\",\"" + req.body.newFilm.director + "\"," + req.body.newFilm.age_rating + "," + req.body.newFilm.duration + "," + req.body.newFilm.popularity + ")", { raw: true, type: sequelize2.QueryTypes.INSERT }).then(((results: any) => {
                        res.status(200).json(results[0])
                    })).catch((error: any) => res.status(400).end("Erreur avec la base de donnée : " + error))
                }
            }).catch((error: any) => res.status(401).end("Le mot de passe est faux ou l'utilisateur n'existe pas"));
        }
    });

    // Le type que l'on envoie dans ce put est 
    // {"username" : string, "password" : string} 
    app.put('/catalogue/film/:id', (req, res) => {
        if (req.body.username == undefined || req.body.password == undefined) {
            res.status(400).end("La requete doit contenir des champs {username : string, password : string} ")
        }
        got.put(adresseServiceConnexion, {
            json: {
                username: req.body.username,
                password: req.body.password,
            },
            responseType: 'json'
        }).then((resp: any) => {
            if (resp.statusCode == 200) {
                sequelize2.query("SELECT * FROM movies WHERE id = " + req.params.id).then(((results: any) => {
                    res.send(results[0])
                }))
            }
        }).catch((error: any) => res.status(401).end("Le mot de passe est faux ou l'utilisateur n'existe pas"));
    });

} catch (error) {
    console.error('Impossible de se connecter, erreur suivante :', error);
}

app.get('/', (req, res) => res.send("Listes des routes :<br>/catalogue PUT et POST<br>/catalogue/film/:id PUT"))

export { app };
