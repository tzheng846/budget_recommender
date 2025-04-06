import { useEffect, useState } from 'react';

// Type for each expense item
type Expense = {
  id: number;
  description: string;
  amount: number;
  category: string;
};

function App() {
  // State variables
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  // Load expenses from the backend when the app starts
  useEffect(() => {
    fetch('http://localhost:3001/expenses')
      .then(res => res.json())
      .then(data => setExpenses(data));
  }, []);

  // Handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newExpense = {
      description,
      amount: parseFloat(amount),
      category,
    };

    // Send POST request to the backend
    const res = await fetch('http://localhost:3001/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExpense),
    });

    const data = await res.json();

    // Update UI with new expense
    setExpenses([...expenses, data]);
    setDescription('');
    setAmount('');
    setCategory('');
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h1>Budget Tracker</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button type="submit">Add Expense</button>
      </form>

      <h2>Total Spent: ${total.toFixed(2)}</h2>

      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            {exp.description} - ${exp.amount} ({exp.category})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
