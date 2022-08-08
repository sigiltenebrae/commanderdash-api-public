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

app.get('/api/users', mtgdb.getUsers);
app.get('/api/users/:user_id', mtgdb.getDecksByUser);

app.get('/api/decks', mtgdb.getDecks);
app.get('/api/decks/:id', mtgdb.getDeckById);
app.post('/api/decks', mtgdb.createDeck);
app.put('/api/decks/:id', mtgdb.updateDeck);
app.delete('/api/decks/:id', mtgdb.deleteDeck);

app.get('/api/themes', mtgdb.getThemes);
app.get('/api/themes/:id', mtgdb.getThemeById);
app.post('/api/themes', mtgdb.createTheme);
app.put('/api/themes/:id', mtgdb.updateTheme);
app.delete('/api/themes/:id', mtgdb.deleteTheme);

app.get('/api/deckthemes', mtgdb.getDeckThemes);
app.get('/api/deckthemes/:id', mtgdb.getThemesByDeckId);
app.get('/api/deckthemesname/:id', mtgdb.getThemeNamesByDeckId);
app.post('/api/deckthemes', mtgdb.addDeckTheme);
app.delete('/api/deckthemes/:id', mtgdb.removeDeckTheme);

require('./app/routes/auth.routes')(app);

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});