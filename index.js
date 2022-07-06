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

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});