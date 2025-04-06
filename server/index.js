const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let expenses = [];

app.get('/expenses', (req, res) => {
  res.json(expenses);
});

app.post('/expenses', (req, res) => {
  const { description, amount, category } = req.body;
  const expense = {
    id: Date.now(),
    description,
    amount: parseFloat(amount),
    category,
  };
  expenses.push(expense);
  res.status(201).json(expense);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
