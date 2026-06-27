import { createExpense } from '../adapters/expense-adapters';

function AddExpenseForm({ loadExpenses, setShowForm }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const description = form.elements.description.value;
    const amount = form.elements.amount.value;
    const date = form.elements.date.value;
    if (!description || !amount || !date) return;

    const { error } = await createExpense(description, amount, date);
    if (error) return console.error(error);

    await loadExpenses();
    form.reset();
    setShowForm(false)
  };

  return (
    <form id="add-expense-form" onSubmit={handleSubmit}>
      <label htmlFor="description-input">Log an expense</label>
      <input type="text" name="description" id="description-input" placeholder="What is this expense for?" />
      <input type="number" step="0.01" name="amount" id="amount-input" placeholder="0.00" />
      <input type="date" name="date" id="date-input" placeholder=""/>
      <button type="submit">Log</button>
      <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
    </form>
  );
}

export default AddExpenseForm;
