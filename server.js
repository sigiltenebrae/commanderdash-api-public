const express = require('express');
const bodyParser = require('body-parser');
const mtgdb = require('./app/controllers/decks.controller');
const authdb = require('./app/controllers/auth.controller');
const userdb = require('./app/controllers/user.controller');
const banlistdb = require('./app/controllers/banlist.controller');
const gamedb = require('./app/controllers/games.controller');

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
app.post('/api/auth/signup', authdb.signup);
app.post('/api/auth/signin', authdb.signin);
app.post('/api/auth/change_password', authdb.changepassword);

app.get('/api/users', userdb.getUsers);
app.get('/api/users/theme/:id', userdb.getTheme);
app.put('/api/users/theme/:id', userdb.setTheme);

app.get('/api/bans/types', banlistdb.getBanTypes);
app.get('/api/bans', banlistdb.getBans);
app.post('/api/bans/add', banlistdb.addBan);
app.post('/api/bans/remove', banlistdb.removeBan);

app.get('/api/decks', mtgdb.getDecks);
app.get('/api/decks/byuser/:user_id', mtgdb.getDecksByUser);
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

app.post('/api/games', gamedb.addGame);
app.get('/api/games', gamedb.getGames);
app.get('/api/games/all', gamedb.getGameDecks);
app.get('/api/games/:id', gamedb.getDecksForGame);

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});