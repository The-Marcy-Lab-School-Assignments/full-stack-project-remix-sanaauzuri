const pool = require('../db/pool');

// Returns all todos for a specific user, ordered by creation time
module.exports.listByUser = async (user_id) => {
  const query = 'SELECT * FROM expenses WHERE user_id = $1 ORDER BY expense_id ASC';
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single todo row (used for ownership checks before update/delete)
module.exports.find = async (expense_id) => {
  const query = 'SELECT * FROM expenses WHERE expense_id = $1';
  const { rows } = await pool.query(query, [expense_id]);
  return rows[0] || null;
};

// Creates a new todo. Returns the full todo row.
module.exports.create = async (description, amount, date, user_id) => {
  const query = 'INSERT INTO expenses (description, amount, date, user_id) VALUES ($1, $2, $3, $4) RETURNING *';
  const { rows } = await pool.query(query, [description, amount, date, user_id]);
  return rows[0];
};

// Updates is_complete for a todo. Returns the updated row.
module.exports.update = async (expense_id, { is_reimbursed }) => {
  const query = 'UPDATE expenses SET is_reimbursed = $1 WHERE expense_id = $2 RETURNING *';
  const { rows } = await pool.query(query, [is_reimbursed, expense_id]);
  return rows[0];
};

// Deletes a todo by id
module.exports.destroy = async (expense_id) => {
  const query = 'DELETE FROM expenses WHERE expense_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [expense_id]);
  return rows[0] || null;
};
