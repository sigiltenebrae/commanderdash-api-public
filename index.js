const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries')
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
    response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.get('/decks', db.getDecks);
app.get('/decks/:id', db.getDeckById);
app.post('/decks', db.createDeck);
app.put('/decks/:id', db.updateDeck);
app.delete('/decks/:id', db.deleteDeck);

app.get('/themes', db.getThemes);
app.get('/themes/:id', db.getThemeById);
app.post('/themes', db.createTheme);
app.put('/themes/:id', db.updateTheme);
app.delete('/themes/:id', db.deleteTheme);

app.get('/deckthemes', db.getDeckThemes);
app.get('/deckthemes/:id', db.getThemesByDeckId);
app.post('/deckthemes', db.addDeckTheme);
app.delete('/deckthemes/:id', db.removeDeckTheme);


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});