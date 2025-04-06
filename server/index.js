import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:5173',
  'https://budget-recommender.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Basic middleware
app.use(express.json());

// Auth0 JWT check middleware
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE || 'https://budget-recommender.railway.app',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

// API Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API Server running on port ${PORT}`);
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
