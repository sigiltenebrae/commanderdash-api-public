const express = require('express')
const bodyParser = require('body-parser')
const mtgdb = require('./app/dash/queries')
const db = require('./app/models');
const Role = db.role;
db.sequelize.sync();

function initial() {
    Role.create({
            id: 1,
            name: "user"
        });
    Role.create({
            id: 2,
            name: "admin"
        });
}

const app = express()
const port = 3000



const cors = require('cors');
app.use(cors({
    origin: '*'
}));

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ info: 'API endpoint for CommanderDash' })
});

app.get('/users', mtgdb.getUsers);
app.get('/users/:user_id', mtgdb.getDecksByUser);

app.get('/decks', mtgdb.getDecks);
app.get('/decks/:id', mtgdb.getDeckById);
app.post('/decks', mtgdb.createDeck);
app.put('/decks/:id', mtgdb.updateDeck);
app.delete('/decks/:id', mtgdb.deleteDeck);

app.get('/themes', mtgdb.getThemes);
app.get('/themes/:id', mtgdb.getThemeById);
app.post('/themes', mtgdb.createTheme);
app.put('/themes/:id', mtgdb.updateTheme);
app.delete('/themes/:id', mtgdb.deleteTheme);

app.get('/deckthemes', mtgdb.getDeckThemes);
app.get('/deckthemes/:id', mtgdb.getThemesByDeckId);
app.get('/deckthemesname/:id', mtgdb.getThemeNamesByDeckId);
app.post('/deckthemes', mtgdb.addDeckTheme);
app.delete('/deckthemes/:id', mtgdb.removeDeckTheme);

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});