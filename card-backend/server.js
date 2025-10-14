const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const cardsFilePath = './cards.json';

// Function to read cards from the JSON file
const readCardsFromFile = () => {
  try {
    const data = fs.readFileSync(cardsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Function to write cards to the JSON file
const writeCardsToFile = (cards) => {
  fs.writeFileSync(cardsFilePath, JSON.stringify(cards, null, 2), 'utf8');
};

let cards = readCardsFromFile();
let idCounter = cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1;

app.get('/cards', (req, res) => {
  res.status(200).json(cards);
});

app.get('/cards/:id', (req, res) => {
  const card = cards.find(c => c.id === parseInt(req.params.id));
  if (card) {
    res.status(200).json(card);
  } else {
    res.status(404).json({ message: 'Card not found' });
  }
});

const cors = require('cors');
app.use(cors()); 

app.post('/cards', (req, res) => {
  const { number, exp, name } = req.body;
  if (!number || !exp || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const newCard = {
    id: idCounter++,
    number,
    exp,
    name
  };
  cards.push(newCard);
  writeCardsToFile(cards);
  res.status(201).json(newCard);
});

app.put('/cards/:id', (req, res) => {
  const card = cards.find(c => c.id === parseInt(req.params.id));
  if (!card) {
    return res.status(404).json({ message: 'Card not found' });
  }
  const { number, exp, name } = req.body;
  if (number) card.number = number;
  if (exp) card.exp = exp;
  if (name) card.name = name;
  writeCardsToFile(cards);
  res.status(200).json(card);
});

app.delete('/cards/:id', (req, res) => {
  const index = cards.findIndex(c => c.id === parseInt(req.params.id));
  if (index !== -1) {
    cards.splice(index, 1);
    writeCardsToFile(cards);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Card not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});