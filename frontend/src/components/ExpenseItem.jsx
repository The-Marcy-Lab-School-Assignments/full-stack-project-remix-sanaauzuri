import { updateExpense, deleteExpense } from '../adapters/expense-adapters';

function ExpenseItem({ expense, loadExpenses }) {
  const handleChange = async (e) => {
    const { error } = await updateExpense(expense.expense_id, { is_reimbursed: e.target.value === 'true' });
    if (error) return console.error(error);
    loadExpenses();
  };

  const handleDelete = async () => {
    const { error } = await deleteExpense(expense.expense_id);
    if (error) return console.error(error);
    loadExpenses();
  };

  return (
    <li className="expense-item">
      <span>{expense.description}</span>
      <span>{expense.amount}</span>
      <span>{expense.date}</span>
      <select value={expense.is_reimbursed} onChange={handleChange}>
        <option value="false">Pending</option>
        <option value="true">Reimbursed</option>
      </select>
      <button className="delete-btn" onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default ExpenseItem;
