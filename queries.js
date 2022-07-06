const Pool = require('pg').Pool
const pool = new Pool({
    user: 'tenebris',
    host: '192.168.1.15',
    database: 'mtg-data',
    password: 'Howaboutthis1!',
    port: 5432,
})

const getDecks = (request, response) => {
    pool.query('SELECT id, friendly_name, commander, url, build_rating, play_rating, win_rating, active FROM decks ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getDeckById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT id, friendly_name, commander, url, build_rating, play_rating, win_rating, active FROM decks WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createDeck = (request, response) => {
    const { friendly_name, commander, url, build_rating, play_rating, win_rating, active } = request.body

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
        const { bad_id, friendly_name, commander, url, build_rating, play_rating, win_rating, active } = request.body

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

module.exports = {
    getDecks,
    getDeckById,
    createDeck,
    updateDeck,
    deleteDeck,
}