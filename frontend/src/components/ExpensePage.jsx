import { useState, useEffect } from 'react';
import { fetchAllExpenses } from '../adapters/expense-adapters';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';

function ExpensePage({ currentUser, handleLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <section>
      <div id="user-controls">
        <span>Hello, <strong>{currentUser.username}</strong>!</span>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      <AddExpenseForm loadExpenses={loadExpenses} />
      {isLoading && <p>Loading expenses...</p>}
      {error && <p className="error">Something went wrong: {error}</p>}
      <ExpenseList expenses={expenses} loadExpenses={loadExpenses} />
    </section>
  );
}

export default ExpensePage;
