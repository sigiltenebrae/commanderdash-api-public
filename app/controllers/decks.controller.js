const config = require("../config/tenebris.config.js");
const Pool = require('pg').Pool
const pool = new Pool({
    user: config.USER,
    host: config.HOST,
    database: config.DB,
    password: config.PASSWORD,
    port: 5432,
});

exports.getDecks = (request, response) => {
    pool.query('SELECT * FROM decks ORDER BY creator ASC', (error, results) => {
        if (error) {
            console.log("decks:" + error);
        }
        response.status(200).json(results.rows)
    })
}

exports.getDecksByUser = (request, response) => {
    const user_id = parseInt(request.params.user_id);
    if (user_id) {
        pool.query('SELECT * FROM decks WHERE creator = $1', [user_id], (error, results) => {
            if (error) {
                console.log("user_decks: " + error);
            }
            response.status(200).json(results.rows)
        })
    }
    else {
        response.json([]);
    }

}

exports.getDeckById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM decks WHERE id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
        }
        else {
            if (results.rows.length > 0) {
                response.status(200).json(results.rows[0])
            }
            else {
                response.status(200).json({});
            }
        }
    })
}

exports.createDeck = (request, response) => {
    const friendly_name = request.body.friendly_name;
    const commander = request.body.commander;
    const url = request.body.url;
    const build_rating = request.body.build_rating;
    const play_rating = request.body.play_rating;
    const win_rating = request.body.win_rating;
    const active = request.body.active;
    const themes = request.body.themes;
    const image_url = request.body.image_url;
    const creator = request.body.creator;
    const partner_commander = request.body.partner_commander;
    const partner_image_url = partner_commander ? request.body.partner_image_url : null;

    let err = false;
    let id = -1;
    pool.query('INSERT INTO decks (creator, friendly_name, commander, url, build_rating, play_rating, win_rating, active, image_url, partner_commander, partner_image_url) ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        [creator, friendly_name, commander, url, build_rating, play_rating, win_rating, active, image_url, partner_commander, partner_image_url],
        (error, results) => {
        if (error) {
            err = true;
            console.log(error);
        }
        id = results.rows[0].id;
        if (id > -1) {
            if (themes && themes.length > 0) {
                for (let theme of themes) {
                    pool.query('INSERT INTO deck_themes (DECKID, THEMEID) ' +
                        'VALUES ($1, $2) RETURNING *', [id, theme.id], (error, results) => {
                        if (error) {
                            if (error.code !== '23505') {
                                console.log(error);
                            }
                        }
                    });
                }
            }
            response.status(201).send({ id:  id });
        }
    });
}

exports.updateDeck = (request, response) => {
    const id = parseInt(request.params.id);
    if (request.body && request.body !== {}) {

        const friendly_name = request.body.friendly_name;
        const commander = request.body.commander;
        const url = request.body.url;
        const build_rating = request.body.build_rating;
        const play_rating = request.body.play_rating;
        const win_rating = request.body.win_rating;
        const active = request.body.active;
        const deleteThemes = request.body.deleteThemes;
        const themes = request.body.themes;
        const image_url = request.body.image_url;
        const partner_commander = request.body.partner_commander ? request.body.partner_commander: null;
        const partner_image_url = partner_commander ? request.body.partner_image_url : null;
        const creator = request.body.creator;
        pool.query(
            'UPDATE decks SET friendly_name = $1, commander = $2, url = $3, build_rating = $4, play_rating = $5, win_rating = $6, active=$7, image_url=$8, partner_commander=$9, partner_image_url=$10, creator=$11 WHERE id = $12',
            [friendly_name, commander, url, build_rating, play_rating, win_rating, active, image_url, partner_commander, partner_image_url, creator, id],
            (error, results) => {
                if (error) {
                    console.log(error);
                }
            });
        for (let theme of deleteThemes) {
            console.log('Deleting theme ' + theme.id + ' from deck ' + id);
            pool.query(
                'DELETE FROM DECK_THEMES WHERE DECKID = $1 AND THEMEID = $2', [id, theme.id],
                (error, results) => {
                    if (error) {
                        console.log(error);
                    }
                }
            );
        }
        for (let theme of themes) {
            pool.query('INSERT INTO deck_themes (DECKID, THEMEID) ' +
                'VALUES ($1, $2) RETURNING *', [id, theme.id], (error, results) => {
                if (error) {
                    if (error.code !== '23505') {
                        console.log(error);
                    }
                }
            });
        }
        response.json({message: `Deck modified with ID: ${id}` });
    }

}

exports.deleteDeck = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM decks WHERE id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
        }
        response.json({message: `Deck deleted with ID: ${id}`});
    })
}

exports.getThemes = (request, response) => {
    pool.query('SELECT * FROM themes ORDER BY id ASC', (error, results) => {
        if (error) {
            console.log(error);
        }
        response.status(200).json(results.rows)
    })
}

exports.getThemeById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM themes WHERE id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
        }
        response.status(200).json(results.rows)
    })
}

exports.createTheme = (request, response) => {
    const name = request.body.name;

    pool.query('INSERT INTO themes (name) ' +
        'VALUES ($1) RETURNING *', [name], (error, results) => {
        if (error) {
            if (error.code !== '23505') {
                console.log(error);
            }
        }
        response.status(201).send(`Theme added with ID: ${results.rows[0].id}`)
    })
}

exports.updateTheme = (request, response) => {
    const id = parseInt(request.params.id)
    console.log(request.body);
    if (request.body && request.body !== {}) {
        const name = request.body.name;

        pool.query(
            'UPDATE themes SET name = $1 WHERE id = $2',
            [name, id],
            (error, results) => {
                if (error) {
                    console.log(error);
                }
                response.status(200).send(`Theme modified with ID: ${id}`)
            }
        )
    }
}

exports.deleteTheme = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM themes WHERE id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
        }
        response.status(200).send(`Theme deleted with ID: ${id}`)
    })
}

exports.getDeckThemes = (request, response) => {
    pool.query('SELECT * FROM DECK_THEMES ORDER BY DECKID, THEMEID ASC', (error, results) => {
        if (error) {
            console.log(error);
        }
        response.status(200).json(results.rows)
    })
}

exports.getThemesByDeckId = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM deck_themes WHERE DECKID = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
        }
        response.status(200).json(results.rows)
    })
}

exports.getThemeNamesByDeckId = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT THEMES.id as ID, NAME FROM THEMES LEFT JOIN DECK_THEMES ON THEMES.id = deck_themes.themeid WHERE deckid = $1 ORDER BY THEMES.id ASC;', [id], (error, results) => {
        if (error) {
            console.log(error);
        }
        response.status(200).json(results.rows)
    })
}

exports.addDeckTheme = (request, response) => {
    const deckid = request.body.deckid;
    const themeid = request.body.themeid;

    pool.query('INSERT INTO deck_themes (DECKID, THEMEID) ' +
        'VALUES ($1, $2) RETURNING *', [deckid, themeid], (error, results) => {
        if (error) {
            console.log(error);
        }
        response.status(201).send(`Theme added to deck`);
    });
}

exports.removeDeckTheme = (request, response) => {
    const deckid = request.body.deckid;
    const themeid = request.body.themeid;

    pool.query('DELETE FROM deck_themes WHERE DECKID = $1 AND THEMEID = $2', [deckid, themeid], (error, results) => {
        if (error) {
            console.log(error);
        }
        response.status(200).send(`Theme deleted from deck`);
    });
}