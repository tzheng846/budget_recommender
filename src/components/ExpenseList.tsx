import React from 'react';

interface Expense {
  description: string;
  amount: number;
  category: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onRemoveExpense: (index: number) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onRemoveExpense }) => {
  return (
    <div className="expense-list">
      {expenses.map((expense, index) => (
        <div key={index} className="expense-item">
          <div className="expense-details">
            <span className="expense-description">{expense.description}</span>
            <span className="expense-amount">${expense.amount.toFixed(2)}</span>
            <span className="expense-category">{expense.category}</span>
          </div>
          <button
            className="remove-btn"
            onClick={() => onRemoveExpense(index)}
            aria-label="Remove expense"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}; 