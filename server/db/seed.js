const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  // Drop tables in reverse dependency order (todos references users via FK)
  await pool.query('DROP TABLE IF EXISTS expenses');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE expenses (
      expense_id       SERIAL PRIMARY KEY,
      description   TEXT NOT NULL,
      amount        NUMERIC NOT NULL,
      date          DATE NOT NULL,
      is_reimbursed BOOLEAN NOT NULL DEFAULT FALSE,
      user_id     INT REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  // Hash passwords in parallel — bcrypt is slow by design (CPU-bound hashing)
  const [janeHash, maxHash] = await Promise.all([
    bcrypt.hash('password111', SALT_ROUNDS),
    bcrypt.hash('password222', SALT_ROUNDS),
  ]);

  // RETURNING captures inserted user_ids so we don't hardcode them
  const { rows: users } = await pool.query(`
    INSERT INTO users (username, password_hash) VALUES
      ('jane', $1),
      ('max',   $2)
    RETURNING user_id, username
  `, [janeHash, maxHash]);

  const [jane, max] = users;

  await pool.query(`
    INSERT INTO expenses (description, amount, date, is_reimbursed, user_id) VALUES
      ('Client lunch',               47.75,  '2026-06-01', TRUE,  $1),
      ('Class supplies',             18.99,  '2026-06-03', FALSE, $1),
      ('Uber to conference',         23.50,  '2026-06-07', FALSE, $1),
      ('Hotel stay',                 189.00,  '2026-06-13', TRUE,  $2),
      ('Parking at job site',        35.00,  '2026-06-14', FALSE, $2),
      ('Printed contracts at FedEx', 14.99,  '2026-06-19', TRUE,  $2)
  `, [jane.user_id, max.user_id]);

  return users;
};

seed()
  .then((users) => {
    console.log('Database seeded successfully.');
    console.log(`  Users: ${users.map((u) => u.username).join(', ')}`);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
