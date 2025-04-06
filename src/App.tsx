import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// Type for each expense item
type Expense = {
  _id: string;  // MongoDB's _id field
  description: string;
  amount: number;
  category: string;
  createdAt: string;
};

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  
  // State variables
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load expenses from the backend when the app starts
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();
        const res = await fetch('http://localhost:3001/expenses', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch expenses');
        }
        
        const data = await res.json();
        setExpenses(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch expenses');
        setExpenses([]);
      }
    };

    fetchExpenses();
  }, [isAuthenticated, getAccessTokenSilently]);

  // Handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = await getAccessTokenSilently();
      const newExpense = {
        description,
        amount: parseFloat(amount),
        category,
      };

      // Send POST request to the backend
      const res = await fetch('http://localhost:3001/expenses', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newExpense),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add expense');
      }

      const data = await res.json();
      setExpenses(prevExpenses => [...prevExpenses, data]);
      setDescription('');
      setAmount('');
      setCategory('');
      setError(null);
    } catch (error) {
      console.error('Error adding expense:', error);
      setError(error instanceof Error ? error.message : 'Failed to add expense');
    }
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      {error && <div style={{ color: 'red', margin: '1rem 0' }}>{error}</div>}

      {/* Login/Logout UI */}
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log Out
          </button>
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      )}

      <h1>Budget Tracker</h1>

      {isAuthenticated && (
        <>
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
              <li key={exp._id}>
                {exp.description} - ${exp.amount} ({exp.category})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
