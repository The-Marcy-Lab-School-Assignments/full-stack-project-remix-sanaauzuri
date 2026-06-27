import { createExpense } from '../adapters/expense-adapters';

function AddExpenseForm({ loadExpenses }) {
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
  };

  return (
    <form id="add-expense-form" onSubmit={handleSubmit}>
      <label htmlFor="description-input">Log an expense</label>
      <input type="text" name="description" id="description-input" placeholder="What is this expense for?" />
      <input type="number" name="amount" id="amount-input" placeholder="0.00" />
      <input type="date" name="date" id="date-input" placeholder=""/>
      <button type="submit">Add</button>
    </form>
  );
}

export default AddExpenseForm;
