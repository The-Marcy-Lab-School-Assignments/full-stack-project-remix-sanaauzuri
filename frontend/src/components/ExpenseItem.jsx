import { updateExpense, deleteExpense } from '../adapters/expense-adapters';

function ExpenseItem({ expense, loadExpenses }) {
  const handleClick = async () => {
    const { error } = await updateExpense(expense.expense_id, { 
      is_reimbursed: !expense.is_reimbursed });
    if (error) return console.error(error);
    loadExpenses();
  };

  const handleDelete = async () => {
    const { error } = await deleteExpense(expense.expense_id);
    if (error) return console.error(error);
    loadExpenses();
  };

  const formatAmount = (amount) =>
    Number(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
 
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US');

  return (
    <li className="expense-item">
      <span className="item-desc">{expense.description}</span>
      <span className="item-amount">{formatAmount(expense.amount)}</span>
      <span className="item-date">{formatDate(expense.date)}</span>
      <button
        className={`toggle-btn ${expense.is_reimbursed ? 'reimbursed' : 'pending'}`}
        onClick={handleClick}
      >
        {expense.is_reimbursed ? 'Reimbursed' : 'Pending'}
      </button>
      <button className="delete-btn" onClick={handleDelete}>✕</button>
    </li>
  );
}

export default ExpenseItem;
