import { useState, useEffect } from 'react';
import { fetchAllExpenses } from '../adapters/expense-adapters';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';

function ExpensePage({ currentUser, handleLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  // This helper fetches expenses on page load with useEffect
  // It is also used within the AddExpenseForm and ExpenseList
  // to re-fetch the expenses when a mutation action is performed
  // such as creating, deleting, or updating a expense.
  const loadExpenses = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchAllExpenses();
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setExpenses(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const filteredExpenses = expenses.filter((expense) => {
  if (filter === 'all') return true;
  if (filter === 'pending') return !expense.is_reimbursed;
  if (filter === 'reimbursed') return expense.is_reimbursed;
  }); 

  return (
    <section>
      <div id="dashboard">
        <button onClick={() => setFilter('reimbursed')}>
          Reimbursed: ${expenses.filter(e => e.is_reimbursed).reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2)}
        </button>
        <button onClick={() => setFilter('pending')}>
          Pending: ${expenses.filter(e => !e.is_reimbursed).reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2)}
        </button>
      </div>
      <div id="user-controls">
        <span>Hello, <strong>{currentUser.username}</strong>!</span>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      <button onClick={() => setShowForm(true)}>Log expense</button>
      {showForm && <AddExpenseForm loadExpenses={loadExpenses} setShowForm={setShowForm} />}
      {isLoading && <p>Loading expenses...</p>}
      {error && <p className="error">Something went wrong: {error}</p>}
      <ExpenseList expenses={filteredExpenses} loadExpenses={loadExpenses} />
    </section>
  );
}

export default ExpensePage;
