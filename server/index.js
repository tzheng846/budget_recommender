import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { auth } from 'express-oauth2-jwt-bearer';

const app = express();
const PORT = 3001;

// Auth0 configuration
const jwtCheck = auth({
  audience: 'http://localhost:3001',
  issuerBaseURL: 'https://dev-m2w3ulj0iwxdhbtx.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

// Basic middleware
app.use(cors());
app.use(express.json());

// MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

// Connect to MongoDB
mongoose.connect('mongodb+srv://tzheng846:p8a4q9UA6aIGQcBm@budget-calculator.lrbzwby.mongodb.net/?retryWrites=true&w=majority&appName=budget-calculator', mongooseOptions)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    // Start the server only after MongoDB is connected
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    console.log('\nTo fix this error:');
    console.log('1. Go to MongoDB Atlas (https://cloud.mongodb.com)');
    console.log('2. Click on "Network Access" in the left sidebar');
    console.log('3. Click "Add IP Address"');
    console.log('4. Click "Allow Access from Anywhere" (or add your specific IP)');
    console.log('5. Click "Confirm"');
    process.exit(1);
  });

// Define Expense schema
const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  userId: { type: String, required: true }, // Add userId field
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);

// Protected routes
app.get('/expenses', jwtCheck, async (req, res) => {
  try {
    console.log('GET /expenses - Fetching expenses...');
    const expenses = await Expense.find({ userId: req.auth.payload.sub }).sort({ createdAt: -1 });
    console.log('GET /expenses - Found expenses:', expenses);
    res.json(expenses);
  } catch (error) {
    console.error('GET /expenses - Error:', error);
    res.status(500).json({ error: 'Failed to fetch expenses', details: error.message });
  }
});

app.post('/expenses', jwtCheck, async (req, res) => {
  try {
    console.log('POST /expenses - Received data:', req.body);
    
    const { description, amount, category } = req.body;
    
    if (!description || !amount || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const expense = new Expense({
      description,
      amount: Number(amount),
      category,
      userId: req.auth.payload.sub // Add userId from the JWT
    });

    const savedExpense = await expense.save();
    console.log('POST /expenses - Saved expense:', savedExpense);
    
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('POST /expenses - Error:', error);
    res.status(500).json({ error: 'Failed to create expense', details: error.message });
  }
});
