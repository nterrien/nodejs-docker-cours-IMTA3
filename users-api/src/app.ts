import express from 'express';
import * as bodyParser from 'body-parser';
//import users from './users.json'

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("mabdd", "icodb", "123456", {
    dialect: "mysql",
    host: "localhost"
});

const sequelize2 = new Sequelize("Catalog-Api", "icodb", "123456", {
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

    // sequelize.query("CREATE DATABASE IF NOT EXISTS `mabdd`;").then(([]) => {
    //     console.log('Base de données `mabdd` créée !');
    // })

    var users: any;
    var playlist: any;
    var suggestions: any;

    sequelize.query("SELECT * FROM user", { raw: true, type: sequelize.QueryTypes.SELECT }).then(((results: any) => {
        users = results
    }))

    sequelize.query("SELECT * FROM suggestions", { raw: true, type: sequelize.QueryTypes.SELECT }).then(((results: any) => {
        suggestions = results
    }))

    sequelize.query("SELECT * FROM playlist", { raw: true, type: sequelize.QueryTypes.SELECT }).then(((results: any) => {
        playlist = results
    }))

    // Users
    app.get('/users', (req, res) => {
        res.send(users)
    });

    // Le type que l'on envoie dans ce post est 
    // {name: string, email: string, age: int}
    app.post('/users', (req, res) => {
        //// Ancien Code , quand il y avait pas de DB.
        // users.push(req.body)
        // res.status(200).json(users)
        if (req.body.name == undefined || req.body.email == undefined || req.body.age == undefined) {
            res.status(400).end("La requete doit contenir des champs {name: string, email: string, age: int}")
        }
        else {
            sequelize.query("INSERT INTO `user` (name,email,age) VALUES(\"" + req.body.name + "\",\"" + req.body.email + "\"," + req.body.age + ")", { raw: true, type: sequelize.QueryTypes.INSERT }).then(((results: any) => {
                users.push({ id: results[0], name: req.body.name, email: req.body.email, age: req.body.age })
                res.status(200).json(users)
            })).catch((error: any) => res.status(400).end("Erreur avec la base de donnée : " + error))
        }
    })

    app.get('/users/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const user = users.find((u: any) => u.id === id)
        if (user != undefined) {
            res.status(200).json(user)
        }
        else {
            res.status(404).end("L'utilisateur " + id + " n'existe pas")
        }
    })


    // Playlist

    app.get('/users/:id/playlist', (req, res) => {
        //// Ancien Code , quand il y avait pas de DB.
        // const id = parseInt(req.params.id)
        // const user = users.find((u: any) => u.id === id)
        // res.status(200).json(user.playlist)
        const id = parseInt(req.params.id)
        const user = users.find((u: any) => u.id === id)
        if (user != undefined) {
            const items = playlist.filter((p: any) => p.user === id)
            res.status(200).json(items)
        }
        else {
            res.status(404).end("L'utilisateur " + id + " n'existe pas")
        }
    })


    // Le type que l'on envoie dans ce post est 
    // {id: int, name : string}
    app.put('/users/:id/playlist', (req, res) => {
        //// Ancien Code , quand il y avait pas de DB.
        // const id = parseInt(req.params.id)
        // const user = users.find((u: any) => u.id === id)
        // const title = user.playlist.find((p: any) => p.id === req.body.id)
        // if (title != undefined) {
        //     title.name = req.body.name
        //     res.status(200).json(title)
        // }
        // else {
        //     user.playlist.push({ id: req.body.id, name: req.body.name })
        //     res.status(200).json({ id: req.body.id, name: req.body.name })
        // }
        const id = parseInt(req.params.id)
        const user = users.find((u: any) => u.id === id)
        if (user != undefined) {
            const item = playlist.find((p: any) => p.id == req.body.id)
            if (item != undefined) {
                if (item.user != id) {
                    res.status(404).end("L'element de playlist d'id " + req.body.id + " n'est pas lié à l'utilisateur " + id)
                }
                else {
                    if (req.body.name != undefined) {
                        sequelize.query("UPDATE `playlist` SET `name` =\"" + req.body.name + "\" WHERE `id` = " + req.body.id).then(((results: any) => {
                            item.name = req.body.name
                            res.status(200).json(item)
                        })).catch((error: any) => res.status(400).end("Erreur avec la base de donnée : " + error))
                    }
                    else {
                        res.status(400).end("Il dois y avoir un champ name, qui ne soit pas undefined")
                    }
                }
            }
            else {
                if (req.body.name != undefined) {
                    if (req.body.id != undefined) {
                        sequelize.query("INSERT INTO `playlist` VALUES(\"" + req.body.id + "\",\"" + req.body.name + "\"," + id + ")", { raw: true, type: sequelize.QueryTypes.INSERT }).then(((results: any) => {
                            playlist.push({ id: req.body.id, name: req.body.name, user: id })
                            res.status(200).json({ id: req.body.id, name: req.body.name, user: id })
                        })).catch((error: any) => res.status(400).end("Erreur avec la base de donnée : " + error))
                    }
                    else {
                        sequelize.query("INSERT INTO `playlist` (name,user) VALUES(\"" + req.body.name + "\"," + id + ")", { raw: true, type: sequelize.QueryTypes.INSERT }).then(((results: any) => {
                            playlist.push({ id: results[0], name: req.body.name, user: id })
                            res.status(200).json({ id: results[0], name: req.body.name, user: id })
                        })).catch((error: any) => res.status(400).end("Erreur avec la base de donnée : " + error))
                    }
                }
                else {
                    res.status(400).end("Il dois y avoir un champ name, qui ne soit pas undefined")
                }
            }
        }
        else {
            res.status(404).end("L'utilisateur " + id + " n'existe pas")
        }
    })


    // Suggestions

    app.get('/users/:id/suggestion', (req, res) => {
        //// Ancien Code , quand il y avait pas de DB.
        // const id = parseInt(req.params.id)
        // const user = users.find((u: any) => u.id === id)
        // res.status(200).json(user.suggestions)
        const id = parseInt(req.params.id)
        const user = users.find((u: any) => u.id === id)
        if (user != undefined) {
            const items = suggestions.filter((p: any) => p.user === id)
            res.status(200).json(items)
        }
        else {
            res.status(404).end("L'utilisateur " + id + " n'existe pas")
        }
    })

    // Le type que l'on envoie dans ce post est 
    // {id: int, name : string}
    app.put('/users/:id/suggestions', (req, res) => {
        //// Ancien Code , quand il y avait pas de DB.
        // const id = parseInt(req.params.id)
        // const user = users.find((u: any) => u.id === id)
        // const title = user.suggestions.find((p: any) => p.id === req.body.id)
        // if (title != undefined) {
        //     title.name = req.body.name
        //     res.status(200).json(title)
        // }
        // else {
        //     user.suggestions.push({ id: req.body.id, name: req.body.name })
        //     res.status(200).json({ id: req.body.id, name: req.body.name })
        // }
        const id = parseInt(req.params.id)
        const user = users.find((u: any) => u.id === id)
        if (user != undefined) {
            const item = suggestions.find((p: any) => p.id == req.body.id)
            if (item != undefined) {
                if (item.user != id) {
                    res.status(404).end("L'element de suggestions d'id " + req.body.id + " n'est pas lié à l'utilisateur " + id)
                }
                else {
                    if (req.body.name != undefined) {
                        sequelize.query("UPDATE `suggestions` SET `name` =\"" + req.body.name + "\" WHERE `id` = " + req.body.id).then(((results: any) => {
                            item.name = req.body.name
                            res.status(200).json(item)
                        })).catch((error: any) => res.status(400).end("Erreur avec la base de donnée : " + error))
                    }
                    else {
                        res.status(400).end("Il dois y avoir un champ name, qui ne soit pas undefined")
                    }
                }
            }
            else {
                if (req.body.name != undefined) {
                    if (req.body.id != undefined) {
                        sequelize.query("INSERT INTO `suggestions` VALUES(\"" + req.body.id + "\",\"" + req.body.name + "\"," + id + ")", { raw: true, type: sequelize.QueryTypes.INSERT }).then(((results: any) => {
                            suggestions.push({ id: req.body.id, name: req.body.name, user: id })
                            res.status(200).json({ id: req.body.id, name: req.body.name, user: id })
                        })).catch((error: any) => res.status(400).end("Erreur avec la base de donnée : " + error))
                    }
                    else {
                        sequelize.query("INSERT INTO `suggestions` (name,user) VALUES(\"" + req.body.name + "\"," + id + ")", { raw: true, type: sequelize.QueryTypes.INSERT }).then(((results: any) => {
                            suggestions.push({ id: results[0], name: req.body.name, user: id })
                            res.status(200).json({ id: results[0], name: req.body.name, user: id })
                        })).catch((error: any) => res.status(400).end("Erreur avec la base de donnée : " + error))
                    }
                }
                else {
                    res.status(400).end("Il dois y avoir un champ name, qui ne soit pas undefined")
                }
            }
        }
        else {
            res.status(404).end("L'utilisateur " + id + " n'existe pas")
        }
    })


    //// Catalog-Api ////

    // sequelize.query("CREATE DATABASE IF NOT EXISTS `Catalog-Api`;").then(([]) => {
    //     console.log('Base de données `mabdd` créée !');
    // })


    var movies: any;
    var genres: any;
    var people: any;

    sequelize2.query("SELECT * FROM movies", { raw: true, type: sequelize.QueryTypes.SELECT }).then(((results: any) => {
        movies = results
    }))

    sequelize2.query("SELECT * FROM genres", { raw: true, type: sequelize.QueryTypes.SELECT }).then(((results: any) => {
        genres = results
    }))

    sequelize2.query("SELECT * FROM people", { raw: true, type: sequelize.QueryTypes.SELECT }).then(((results: any) => {
        people = results
    }))

    // Movies
    app.get('/movies', (req, res) => {
        res.send(people)
    });

    // Le type que l'on envoie dans ce post est 
    // {title: string, director: string, age_rating: int, duration: int, popularity: int}
    app.post('/movies', (req, res) => {
        if (req.body.title == undefined || req.body.director == undefined || req.body.age_rating == undefined || req.body.duration == undefined || req.body.popularity == undefined) {
            res.status(400).end("La requete doit contenir des champs {title: string, director: string, age_rating: int, duration: int, popularity: int}")
        }
        else {
            sequelize2.query("INSERT INTO `movies` (title,director,`age-rating`,duration,popularity) VALUES(\"" + req.body.title + "\",\"" + req.body.director + "\"," + req.body.age_rating + "," + req.body.duration + "," + req.body.popularity + ")", { raw: true, type: sequelize.QueryTypes.INSERT }).then(((results: any) => {
                movies.push({ id: results[0], title: req.body.title, director: req.body.director, age_rating: req.body.age_rating, duration: req.body.duration, popularity: req.body.popularity })
                res.status(200).json(movies)
            })).catch((error: any) => res.status(400).end("Erreur avec la base de donnée : " + error))
        }
    });

    // Genres
    app.get('/genres', (req, res) => {
        res.send(people)
    });

    // Le type que l'on envoie dans ce post est 
    // {title: string, description: string}
    app.post('/genres', (req, res) => {
        if (req.body.title == undefined || req.body.description == undefined) {
            res.status(400).end("La requete doit contenir des champs {title: string, description: string}")
        }
        else {
            sequelize2.query("INSERT INTO `genres` (title,description) VALUES(\"" + req.body.title + "\",\"" + req.body.description + "\")", { raw: true, type: sequelize.QueryTypes.INSERT }).then(((results: any) => {
                genres.push({ id: results[0], title: req.body.title, description: req.body.description })
                res.status(200).json(genres)
            })).catch((error: any) => res.status(400).end("Erreur avec la base de donnée : " + error))
        }
    });

    // People
    app.get('/people', (req, res) => {
        res.send(people)
    });

    // Le type que l'on envoie dans ce post est 
    // {name: string, roles: string}
    app.post('/people', (req, res) => {
        if (req.body.name == undefined || req.body.roles == undefined) {
            res.status(400).end("La requete doit contenir des champs {name: string, roles: string}")
        }
        else {
            sequelize2.query("INSERT INTO `people` (name,roles) VALUES(\"" + req.body.name + "\",\"" + req.body.roles + "\")", { raw: true, type: sequelize.QueryTypes.INSERT }).then(((results: any) => {
                people.push({ id: results[0], name: req.body.name, roles: req.body.roles })
                res.status(200).json(people)
            })).catch((error: any) => res.status(400).end("Erreur avec la base de donnée : " + error))
        }
    });

} catch (error) {
    console.error('Impossible de se connecter, erreur suivante :', error);
}

app.get('/', (req, res) => res.send("Listes des routes :<br>/users (méthodes GET et POST) <br>/users/:id (GET) <br>/users/:id/playlist (GET et PUT) <br>/users/:id/suggestions (GET et PUT)"))

export { app };
