import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './App.css';
import './styles/recommendations.css';
import './styles/profile.css';
import { Recommendations } from './components/dashboard/Recommendations';
import TestGemini from './components/TestGemini';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// Type for each expense item
type Expense = {
  _id: string;  // MongoDB's _id field
  description: string;
  amount: number;
  category: string;
  createdAt: string;
};

// Type for new expense form
type NewExpense = {
  description: string;
  amount: number;
  category: string;
};

// Predefined categories
const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Personal Care',
  'Travel',
  'Gifts & Donations',
  'Other'
];

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  
  // State variables
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<NewExpense>({
    description: '',
    amount: 0,
    category: ''
  });
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

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
      setNewExpense({
        description: '',
        amount: 0,
        category: ''
      });
      setError(null);
    } catch (error) {
      console.error('Error adding expense:', error);
      setError(error instanceof Error ? error.message : 'Failed to add expense');
    }
  };

  const handleRemoveExpense = async (index: number) => {
    try {
      const expenseToRemove = expenses[index];
      const token = await getAccessTokenSilently();
      
      const res = await fetch(`http://localhost:3001/api/expenses/${expenseToRemove._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete expense');
      }

      // Only remove from state if the backend deletion was successful
      setExpenses(prevExpenses => prevExpenses.filter((_, i) => i !== index));
      setError(null);
    } catch (error) {
      console.error('Error removing expense:', error);
      setError(error instanceof Error ? error.message : 'Failed to remove expense');
    }
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const ProfilePage = () => {
    // Calculate spending by category
    const categorySpending = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Calculate monthly spending
    const monthlySpending = expenses.reduce((acc, expense) => {
      const month = new Date(expense.createdAt).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Prepare data for category pie chart
    const categoryData = {
      labels: Object.keys(categorySpending),
      datasets: [
        {
          data: Object.values(categorySpending),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ],
        },
      ],
    };

    // Prepare data for monthly bar chart
    const monthlyData = {
      labels: Object.keys(monthlySpending),
      datasets: [
        {
          label: 'Monthly Spending',
          data: Object.values(monthlySpending),
          backgroundColor: '#36A2EB',
        },
      ],
    };

    return (
      <div className="profile-container">
        <h2>Profile Information</h2>
        {user && (
          <div className="profile-info">
            <div className="profile-field">
              <label>Name:</label>
              <span>{user.name}</span>
            </div>
            <div className="profile-field">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="profile-field">
              <label>Email Verified:</label>
              <span>{user.email_verified ? 'Yes' : 'No'}</span>
            </div>
            <div className="profile-field">
              <label>Last Updated:</label>
              <span>{user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        )}

        <div className="charts-container">
          <div className="chart-section">
            <h3>Spending by Category</h3>
            <div className="chart-wrapper">
              <Pie data={categoryData} />
            </div>
          </div>

          <div className="chart-section">
            <h3>Monthly Spending Trends</h3>
            <div className="chart-wrapper">
              <Bar 
                data={monthlyData}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: 'Monthly Spending Overview'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <button className="btn" onClick={() => setShowProfile(false)}>Back to Dashboard</button>
      </div>
    );
  };

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
                <li><a href="#" className="link" onClick={() => setShowProfile(true)}>Profile</a></li>
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
        showProfile ? (
          <ProfilePage />
        ) : (
          <div className="dashboard-container">
            <h1>Welcome, {user?.name}!</h1>
            
            <div className="expense-form">
              <h2>Add New Expense</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-box">
                  <input
                    className="input-field"
                    placeholder="Description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  />
                </div>
                <div className="input-box">
                  <input
                    className="input-field"
                    placeholder="Amount"
                    type="number"
                    value={newExpense.amount || ''}
                    onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="input-box">
                  <select
                    className="input-field"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  >
                    <option value="">Select a category</option>
                    {EXPENSE_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="submit">Add Expense</button>
              </form>
            </div>

            <div className="expenses-list">
              <div className="expenses-header">
                <h2>Total Spent: ${total.toFixed(2)}</h2>
                <button 
                  className="generate-recommendations-btn"
                  onClick={() => setShowRecommendations(!showRecommendations)}
                >
                  {showRecommendations ? 'Hide Recommendations' : 'Generate Recommendations'}
                </button>
              </div>
              <ul>
                {expenses.map((exp, index) => (
                  <li key={exp._id} className="expense-item">
                    <span className="expense-description">{exp.description}</span>
                    <span className="expense-amount">${exp.amount.toFixed(2)}</span>
                    <span className="expense-category">{exp.category}</span>
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveExpense(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {showRecommendations && <Recommendations expenses={expenses} />}
          </div>
        )
      ) : (
        <div className="welcome-container">
          <h1>Welcome to ShopSense</h1>
          <p>Please sign in to manage your expenses and get personalized recommendations.</p>
        </div>
      )}
      <TestGemini />
    </div>
  );
}

export default App;
