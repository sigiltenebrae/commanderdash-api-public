const config = require("../config/db.config.js");
const Pool = require('pg').Pool
const pool = new Pool({
    user: config.USER,
    host: config.HOST,
    database: config.DB,
    password: config.PASSWORD,
    port: 5432,
});

exports.getUsers = (request, response) => {
    pool.query('SELECT id, username FROM USERS ORDER BY id ASC', (error, results) => {
        if (error) {
            console.log(error);
        }
        response.status(200).json(results.rows);
    });
}