import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  createdAt: string;
}

interface ProfileProps {
  expenses: Expense[];
  user: {
    name?: string;
    email?: string;
    picture?: string;
  };
}

export function Profile({ expenses, user }: ProfileProps) {
  // Calculate spending by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Calculate monthly spending
  const monthlySpending = expenses.reduce((acc, expense) => {
    const date = new Date(expense.createdAt);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    acc[monthYear] = (acc[monthYear] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Prepare data for category chart
  const categoryChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
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

  // Prepare data for monthly spending chart
  const monthlyChartData = {
    labels: Object.keys(monthlySpending),
    datasets: [
      {
        label: 'Monthly Spending',
        data: Object.values(monthlySpending),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  // Calculate total spending
  const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate average transaction amount
  const averageTransaction = totalSpending / expenses.length || 0;

  // Find highest spending category
  const highestCategory = Object.entries(categoryTotals).reduce(
    (max, [category, amount]) => (amount > max.amount ? { category, amount } : max),
    { category: '', amount: 0 }
  );

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          {user.picture && <img src={user.picture} alt="Profile" className="profile-picture" />}
          <div className="profile-details">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>
      </div>

      <div className="spending-overview">
        <div className="stat-card">
          <h3>Total Spending</h3>
          <p className="stat-value">${totalSpending.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Average Transaction</h3>
          <p className="stat-value">${averageTransaction.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Number of Transactions</h3>
          <p className="stat-value">{expenses.length}</p>
        </div>
        <div className="stat-card">
          <h3>Highest Spending Category</h3>
          <p className="stat-value">{highestCategory.category}</p>
          <p className="stat-subvalue">${highestCategory.amount.toFixed(2)}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h3>Spending by Category</h3>
          <div className="chart-wrapper">
            <Doughnut 
              data={categoryChartData}
              options={{
                plugins: {
                  legend: {
                    position: 'right' as const,
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        <div className="chart-box">
          <h3>Monthly Spending Trend</h3>
          <div className="chart-wrapper">
            <Bar
              data={monthlyChartData}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 