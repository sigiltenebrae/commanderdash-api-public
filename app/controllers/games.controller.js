const config = require("../config/tenebris.config.js");
const Pool = require('pg').Pool
const pool = new Pool({
    user: config.USER,
    host: config.HOST,
    database: config.DB,
    password: config.PASSWORD,
    port: 5432,
});

exports.addGame = (request, response) => {
    let players = request.body.players; //{deckid, win: booolean}
    pool.query('INSERT INTO games (id, date) VALUES (DEFAULT, DEFAULT) RETURNING *', (error, results) => {
        if (error) {
            console.log(error);
        }
        else {
            let id = results.rows[0].id;
            if (players && players.length > 0) {
                for (let player of players) {
                    pool.query('INSERT INTO deck_games ("deckId", "gameId", win) VALUES ($1, $2, $3)', [player.deckId, id, player.win], (err, res) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
            response.status(201).send({ id:  id });
        }
    })
}

exports.getGames = (request, response) => {
    pool.query('SELECT * FROM games ORDER BY date ASC', (error, results) => {
        if (error) {
            console.log("games:" + error);
        }
        response.status(200).json(results.rows)
    })
}

exports.getGameDecks = (request, response) => {
    pool.query('SELECT * FROM deck_games ORDER BY "gameId" ASC', (error, results) => {
        if (error) {
            console.log("games:" + error);
        }
        response.status(200).json(results.rows)
    })
}

exports.getDecksForGame = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM deck_games WHERE "gameId" = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
        }
        response.status(200).json(results.rows);
    })
}

exports.getGamesForDeck = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM deck_games WHERE "deckId" = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
        }
        response.status(200).json(results.rows);
    })
}