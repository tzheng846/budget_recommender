import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Basic middleware
app.use(express.json());

// Auth0 JWT check middleware
const jwtCheck = auth({
  audience: 'http://localhost:3001',  // Must match exactly with frontend
  issuerBaseURL: 'https://dev-m2w3ulj0iwxdhbtx.us.auth0.com',
  tokenSigningAlg: 'RS256'
});

// API Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB
mongoose.connect('mongodb+srv://tzheng846:p8a4q9UA6aIGQcBm@budget-calculator.lrbzwby.mongodb.net/?retryWrites=true&w=majority&appName=budget-calculator', mongooseOptions)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`API Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Define Expense schema
const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  userId: { type: String, required: true },
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);

// Protected API routes
app.get('/api/expenses', jwtCheck, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.auth.payload.sub }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('GET /api/expenses - Error:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.post('/api/expenses', jwtCheck, async (req, res) => {
  try {
    const { description, amount, category } = req.body;
    
    if (!description || !amount || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const expense = new Expense({
      description,
      amount: Number(amount),
      category,
      userId: req.auth.payload.sub
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('POST /api/expenses - Error:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Delete expense
app.delete('/api/expenses/:id', jwtCheck, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.auth.payload.sub
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/expenses/:id - Error:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});
