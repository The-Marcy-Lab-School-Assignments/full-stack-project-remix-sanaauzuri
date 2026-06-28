import { createExpense } from '../adapters/expense-adapters';

function AddExpenseForm({ loadExpenses, onClose }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const description = form.elements.description.value;
    const amount = Number(form.elements.amount.value);
    const date = form.elements.date.value;
    if (!description || !amount || !date) return;

    const { error } = await createExpense(description, amount, date);
    if (error) return console.error(error);

    await loadExpenses();
    form.reset();
    onClose();
  };

  return (
    <div id="modal">
      <form id="log-expense-form" onSubmit={handleSubmit}>

        <div id="form-header">
          <span>Log an expense</span>
          <button type="button" onClick={onClose}>✕</button>
        </div>

        <label htmlFor="description-input">description</label>
        <input 
        type="text" 
        name="description" 
        id="description-input" 
        placeholder="e.g., Uber to site"
        />

        <label htmlFor="amount-input">amount</label>
        <input 
        type="number" 
        step="0.01" 
        name="amount" 
        id="amount-input" 
        placeholder="0.00" 
        />

        <label htmlFor="date-input">date</label>
        <input 
        type="date" 
        name="date" 
        id="date-input" 
        placeholder=""
        />

        <button type="submit">Log</button>

      </form>
    </div>
  );
}

export default AddExpenseForm;
