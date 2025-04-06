const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3001;

const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-m2w3ulj0iwxdhbtx.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://dev-m2w3ulj0iwxdhbtx.us.auth0.com/api/v2/', // set this in Auth0 API settings
  issuer: 'https://dev-m2w3ulj0iwxdhbtx.us.auth0.com/',
  algorithms: ['RS256']
});

// ✅ Connect to MongoDB (paste your real URI here)
mongoose.connect('mongodb+srv://tzheng846:p8a4q9UA6aIGQcBm@buget-calculator.lrbzwby.mongodb.net/?retryWrites=true&w=majority&appName=buget-calculator')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Define Expense schema & model
const expenseSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    category: String,
    userId: String, // <-- add this
  });

const Expense = mongoose.model('Expense', expenseSchema);

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes

// Get all expenses
app.get('/expenses', checkJwt, async (req, res) => {
    const userId = req.auth.sub;
    const expenses = await Expense.find({ userId });
    res.json(expenses);
  });
  
  
  app.post('/expenses', checkJwt, async (req, res) => {
    const { description, amount, category } = req.body;
    const userId = req.auth.sub; // 🔐 Auth0 user ID from the token
  
    const expense = new Expense({
      description,
      amount,
      category,
      userId,
    });
  
    await expense.save();
    res.status(201).json(expense);
  });
  

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
