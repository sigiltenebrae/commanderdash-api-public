const Pool = require('pg').Pool
const pool = new Pool({
    user: 'tenebris',
    host: '192.168.1.15',
    database: 'mtg-data',
    password: 'Howaboutthis1!',
    port: 5432,
})

const getDecks = (request, response) => {
    pool.query('SELECT * FROM decks ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getDeckById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM decks WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createDeck = (request, response) => {

    const friendly_name = request.body.friendly_name;
    const commander = request.body.commander;
    const url = request.body.url;
    const build_rating = request.body.build_rating;
    const play_rating = request.body.play_rating;
    const win_rating = request.body.win_rating;
    const active = request.body.active;

    pool.query('INSERT INTO decks (friendly_name, commander, url, build_rating, play_rating, win_rating, active) ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [friendly_name, commander, url, build_rating, play_rating, win_rating, active], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Deck added with ID: ${results.rows[0].id}`)
    })
}

const updateDeck = (request, response) => {
    const id = parseInt(request.params.id)
    console.log(request.body);
    if (request.body && request.body !== {}) {

        const friendly_name = request.body.friendly_name;
        const commander = request.body.commander;
        const url = request.body.url;
        const build_rating = request.body.build_rating;
        const play_rating = request.body.play_rating;
        const win_rating = request.body.win_rating;
        const active = request.body.active;

        pool.query(
            'UPDATE decks SET friendly_name = $1, commander = $2, url = $3, build_rating = $4, play_rating = $5, win_rating = $6, active=$7 WHERE id = $8',
            [friendly_name, commander, url, build_rating, play_rating, win_rating, active, id],
            (error, results) => {
                if (error) {
                    console.log(error);
                    throw error
                }
                console.log("good");
                response.status(200).send(`Deck modified with ID: ${id}`)
            }
        )
    }

}

const deleteDeck = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM decks WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Deck deleted with ID: ${id}`)
    })
}

const getThemes = (request, response) => {
    pool.query('SELECT * FROM themes ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getThemeById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM themes WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createTheme = (request, response) => {
    const name = request.body.name;

    pool.query('INSERT INTO themes (name) ' +
        'VALUES ($1) RETURNING *', [name], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Theme added with ID: ${results.rows[0].id}`)
    })
}

const updateTheme = (request, response) => {
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
                    throw error
                }
                console.log("good");
                response.status(200).send(`Theme modified with ID: ${id}`)
            }
        )
    }
}

const deleteTheme = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM themes WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Theme deleted with ID: ${id}`)
    })
}

const getDeckThemes = (request, response) => {
    pool.query('SELECT * FROM DECK_THEMES ORDER BY DECKID, THEMEID ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getThemesByDeckId = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM deck_themes WHERE DECKID = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getThemeNamesByDeckId = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT THEMES.id, NAME FROM THEMES LEFT JOIN DECK_THEMES ON THEMES.id = deck_themes.themeid WHERE deckid = $1 ORDER BY THEMES.id ASC;', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const addDeckTheme = (request, response) => {
    const deckid = request.body.deckid;
    const themeid = request.body.themeid;

    pool.query('INSERT INTO deck_themes (DECKID, THEMEID) ' +
        'VALUES ($1, $2) RETURNING *', [deckid, themeid], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Theme added to deck`);
    });
}

const removeDeckTheme = (request, response) => {
    const deckid = request.body.deckid;
    const themeid = request.body.themeid;

    pool.query('DELETE FROM deck_themes WHERE DECKID = $1 AND THEMEID = $2', [deckid, themeid], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Theme deleted from deck`);
    });
}

module.exports = {
    getDecks,
    getDeckById,
    createDeck,
    updateDeck,
    deleteDeck,
    getThemes,
    getThemeById,
    createTheme,
    updateTheme,
    deleteTheme,
    getDeckThemes,
    getThemesByDeckId,
    getThemeNamesByDeckId,
    addDeckTheme,
    removeDeckTheme
}