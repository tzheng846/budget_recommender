import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';

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
        const res = await fetch('http://localhost:3001/api/expenses', {
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
      const res = await fetch('http://localhost:3001/api/expenses', {
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
    <div className="wrapper">
      <nav className="nav">
        <div className="nav-logo">
          <p>ShopSense.</p>
        </div>
        <div className="nav-menu" id="navMenu">
          <ul>
            {isAuthenticated ? (
              <>
                <li><a href="#" className="link">Dashboard</a></li>
                <li><a href="#" className="link">Profile</a></li>
                <li><a href="#" className="link">Settings</a></li>
              </>
            ) : (
              <>
                <li><a href="#" className="link active">Home</a></li>
                <li><a href="#" className="link">About</a></li>
              </>
            )}
          </ul>
        </div>
        <div className="nav-button">
          {isAuthenticated ? (
            <button className="btn white-btn" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
              Log Out
            </button>
          ) : (
            <button className="btn white-btn" onClick={() => loginWithRedirect()}>
              Sign In
            </button>
          )}
        </div>
      </nav>

      {error && <div className="error-message">{error}</div>}

      {isAuthenticated ? (
        <div className="dashboard-container">
          <h1>Welcome, {user?.name}!</h1>
          
          <div className="expense-form">
            <h2>Add New Expense</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <input
                  className="input-field"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="input-box">
                <input
                  className="input-field"
                  placeholder="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="input-box">
                <input
                  className="input-field"
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <button type="submit" className="submit">Add Expense</button>
            </form>
          </div>

          <div className="expenses-list">
            <h2>Total Spent: ${total.toFixed(2)}</h2>
            <ul>
              {expenses.map((exp) => (
                <li key={exp._id} className="expense-item">
                  <span className="expense-description">{exp.description}</span>
                  <span className="expense-amount">${exp.amount}</span>
                  <span className="expense-category">{exp.category}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="welcome-container">
          <h1>Welcome to ShopSense</h1>
          <p>Track your expenses and manage your budget effectively.</p>
          <button className="btn white-btn" onClick={() => loginWithRedirect()}>
            Get Started
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
