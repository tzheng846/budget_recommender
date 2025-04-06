import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from '../../styles/dashboard.module.css';

interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
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
  }, [getAccessTokenSilently]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = await getAccessTokenSilently();
      const newExpense = {
        description,
        amount: parseFloat(amount),
        category,
      };

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
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Welcome, {user?.name}</h1>
        <nav className={styles.nav}>
          <ul>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/settings">Settings</a></li>
            <li><a href="/logout">Logout</a></li>
          </ul>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.expenseForm}>
          <h2>Add New Expense</h2>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.submitButton}>Add Expense</button>
          </form>
        </section>

        <section className={styles.expenseSummary}>
          <h2>Expense Summary</h2>
          <div className={styles.total}>
            <h3>Total Spent</h3>
            <p>${total.toFixed(2)}</p>
          </div>
        </section>

        <section className={styles.expenseList}>
          <h2>Recent Expenses</h2>
          <ul>
            {expenses.map((expense) => (
              <li key={expense._id} className={styles.expenseItem}>
                <div className={styles.expenseInfo}>
                  <h3>{expense.description}</h3>
                  <p className={styles.category}>{expense.category}</p>
                </div>
                <div className={styles.expenseAmount}>
                  ${expense.amount.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Dashboard; 