const config = require("../config/tenebris.config.js");
const Pool = require('pg').Pool
const pool = new Pool({
    user: config.USER,
    host: config.HOST,
    database: config.DB,
    password: config.PASSWORD,
    port: 5432,
});

exports.getBanTypes = (request, response) => {
    pool.query('SELECT * FROM ban_types', (error, results) => {
       if (error) {
           console.log(error);
       }
       response.status(200).json(results.rows);
    });
}

exports.getBans = (request, response) => {
    pool.query('SELECT * FROM banlist ORDER BY ban_type, card_name ASC', (error, results) => {
        if (error) {
            console.log(error);
        }
        response.status(200).json(results.rows);
    });
}

exports.addBan = (request, response) => {
    const card_name = request.body.card_name;
    const ban_type = request.body.ban_type;
    pool.query('INSERT INTO banlist (card_name, ban_type) VALUES ($1, $2) RETURNING *', [card_name, ban_type], (error, results) => {
       if (error) {
           if (error.code !== '23505') {
               console.log(error);
           }
       }
        response.status(201).send({ message: 'card added to banlist' });
    });
}

exports.removeBan = (request, response) => {
    const card_name = request.body.card_name;

    pool.query('DELETE FROM banlist WHERE card_name = $1', [card_name], (error, results) => {
        if (error) {
            console.log(error);
        }
        response.json({message: `Banned card removed with name: ${card_name}`});
    })

}