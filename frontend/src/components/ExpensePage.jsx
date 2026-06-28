import { useState, useEffect } from 'react';
import { fetchAllExpenses } from '../adapters/expense-adapters';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';

function ExpensePage({ currentUser, handleLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [seeForm, setSeeForm] = useState(false)

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

  const handleSeeForm = () => setSeeForm(true);
  const handleCloseForm = () => setSeeForm(false);

  const handlePendingFilter = () => setFilter(f => f === 'pending' ? 'all' : 'pending');
  const handleReimbursedFilter = () => setFilter(f => f === 'reimbursed' ? 'all' : 'reimbursed');

  const filteredExpenses = expenses.filter(e => {
    if (filter === 'pending') return !e.is_reimbursed;
    if (filter === 'reimbursed') return e.is_reimbursed;
    return true;
  });

  const pendingTotal = expenses
    .filter((e) => !e.is_reimbursed)
    .reduce((sum, e) => sum + Number(e.amount), 0);
 
  const reimbursedTotal = expenses
    .filter((e) => e.is_reimbursed)
    .reduce((sum, e) => sum + Number(e.amount), 0);
 
  const formatCurrency = (amount) =>
    amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
 
  const filterLabel =
    filter === 'pending'
      ? 'Pending'
      : filter === 'reimbursed'
      ? 'Reimbursed'
      : 'All';

  return (
    <section id="expense-page">
      <header id="page-header">
        <div id="greeting">
          <h1 style={{ '--steps': `Hello ${currentUser.username}!`.length }}>
            Hello {currentUser.username}!
          </h1>
        </div>
        <div id="header-controls">
          <button id="log-btn" onClick={handleSeeForm}>
            + Log an expense
          </button>
          <button id="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      {seeForm && (
        <AddExpenseForm
          loadExpenses={loadExpenses}
          onClose={handleCloseForm}
        />
      )}

      <div id="panel">
        <button
          className={`panel-card ${filter === 'pending' ? 'active' : ''}`}
          onClick={handlePendingFilter}
        >
          <span className="card-label">Pending</span>
          <span className="card-amount">{formatCurrency(pendingTotal)}</span>
        </button>

        <button
          className={`panel-card ${filter === 'reimbursed' ? 'active' : ''}`}
          onClick={handleReimbursedFilter}
        >
          <span className="card-label">Reimbursed</span>
          <span className="card-amount">{formatCurrency(reimbursedTotal)}</span>
        </button>
      </div>

      <div id="list-section">
        <div id="list-header">
          <h2 id="list-label">{filterLabel}</h2>
        </div>

          {isLoading && <p>Loading expenses...</p>}
          {error && <p className="error">Something went wrong: {error}</p>}

        <ExpenseList expenses={filteredExpenses} loadExpenses={loadExpenses} />
      </div> 
    </section>
  );
}

export default ExpensePage;
