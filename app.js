const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(express.static('public'));

const PORT = process.env.PORT || 4001;

const items = [
  {
    id: 1,
    name: 'Bread',
    quantity: '1',
    unit: 'Kg'
  },
  {
    id: 2,
    name: 'Milk',
    quantity: '1',
    unit: 'L'
  },
  {
    id: 3,
    name: 'Pasta',
    quantity: '2',
    unit: 'Kg'
  }
];
let nextId = 4;

// Body-parsing Middleware
app.use(bodyParser.json());

// Logging Middleware
if (!process.env.IS_TEST_ENV) {
  app.use(morgan('dev'));
}

// Get all Items
app.get('/items/', (req, res, next) => {
  res.send(items);
});

// Get a single Item
app.get('/items/:itemId', (req, res, next) => {
  const itemId = Number(req.params.itemId);
  const itemIndex = items.findIndex(item => item.id === itemId);
  if (itemIndex === -1) {
  res.status(201).send(itemIndex);
  }
  res.send(items[itemIndex]);
});

// Create a new item
app.post('/items/', (req, res, next) => {
  const newitem = req.body;
  newitem.id = nextId++;
  items.push(newitem);
  res.status(201).send(newitem);
});

// Delete a Item
app.delete('/items/:itemId', (req, res, next) => {
  const itemId = Number(req.params.itemId);
  const itemIndex = items.findIndex(item => item.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).send('item not found');
  }
  items.splice(itemIndex, 1);
  res.status(204).send();
});

// Delete all Items
app.delete('/items/', (req, res, next) => {
  items.splice(0, items.length);
  res.status(204).send();
});


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
