const config = require("../config/db.config.js");
const secret_config = require("../config/auth.config")
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const {Pool} = require("pg");

const pool = new Pool({
    user: config.USER,
    host: config.HOST,
    database: config.DB,
    password: config.PASSWORD,
    port: 5432,
})

exports.signup = (request, response) => {
    const username = request.body.username;
    const password = bcrypt.hashSync(request.body.password, 8);
    pool.query('INSERT INTO users (username, password) ' +
        'VALUES ($1, $2) RETURNING *', [username, password],
        (error, results) => {
            if (error) {
                console.log(error);
            }
            id = results.rows[0].id;
            if (id > -1) {
                pool.query('INSERT INTO user_roles ("userId", "roleId") ' +
                'VALUES ($1, $2) RETURNING *', [id, 1],
                    (err, res) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                console.log('success')
                return response.json({message: `User added with ID: ${results.rows[0].id}`})
            }
        });
}

exports.signin = (request, response) => {
    const username = request.body.username;
    pool.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
        if (error) {
            return response.status(500).send({ message: error.message });
        }
        if (results.rows.length < 1) {
            return response.status(404).send({ message: "User Not found." });
        }
        const user = results.rows[0];
        const passwordValid = bcrypt.compareSync(
            request.body.password,
            user.password
        );
        if (!passwordValid) {
            return response.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        let token = jwt.sign({ id: user.id }, secret_config.secret, {
            expiresIn: 86400 // 24 hours
        });
        return response.status(200).send({
            id: user.id,
            username: user.username,
            roles: [],
            theme: user.theme,
            accessToken: token
            });
        });
}
