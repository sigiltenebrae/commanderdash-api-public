const config = require("../config/tenebris.config.js");
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

exports.setTheme = (request, response) => {
    const id = parseInt(request.params.id);
    const theme = request.body.theme;
    if (id) {
        pool.query('UPDATE users set theme = $1 WHERE id = $2', [theme, id], (error, results) => {
           if (error) {
               console.log(error);
           }
           return response.json({message: `User with ID: ${id} theme modified` });
        });
    }
}

exports.getTheme = (request, response) => {
    const user_id = parseInt(request.params.id);
    if (user_id) {
        pool.query('SELECT theme FROM USERS WHERE id = $1', [user_id], (error, results) => {
            if (error) {
                console.log(error);
            }
            return response.status(200).json(results.rows[0])
        });
    }
}