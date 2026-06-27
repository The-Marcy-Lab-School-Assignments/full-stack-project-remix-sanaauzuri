# Boomerang 
> *Every expense returns.*

Boomerang is an app for employees whose employer covers certain expenses. Instead of rummaging through notes, spreadsheets, or old receipts, users can log expenses, mark an expense as reimbursed or pending, and see a clear summary of what is pending vs. reimbursed. All in one app.

*Boomerang is a full-stack app built with React, Express, and Postgres. Simulates session-based authentication, session rehydration, auth-dependent data fetching, and conditional rendering.*

## User Stories

**Auth**
- A user can register for an account with a username and password
- A user can log in to an existing account
- A user can log out
- A returning user is automatically logged in when they return to the app

**Expenses**
- A logged-in user can see all of their expenses
- A logged-in user can log a new expense by entering a description, amount, date, and phase( reimbursed, or pending)
- A logged-in user can mark an expense as reimbursed or pending
- A logged-in user can delete an expense
- A logged-in user can see their accumulated pending and reimbursed amounts

## Schema

```
users
─────────────────────────────
user_id       SERIAL PRIMARY KEY
username      TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL

expenses
─────────────────────────────
expense_id     SERIAL PRIMARY KEY
description    TEXT NOT NULL
amount         NUMERIC NOT NULL
date           DATE NOT NULL
is_reimbursed  BOOLEAN DEFAULT FALSE
user_id     INTEGER REFERENCES users(user_id) ON DELETE CASCADE
```

A user has many expenses. Deleting a user cascades to delete all of their expenses.

## API Contract

### Auth endpoints

| Method | Endpoint             | Request Body             | Response                          |
| ------ | -------------------- | ------------------------ | --------------------------------- |
| POST   | `/api/auth/register` | `{ username, password }` | `{ user_id, username }`           |
| POST   | `/api/auth/login`    | `{ username, password }` | `{ user_id, username }`           |
| DELETE | `/api/auth/logout`   | —                        | `{ message }`                     |
| GET    | `/api/auth/me`       | —                        | `{ user_id, username }` or `null` |

### Expense endpoints (all use authentication)

| Method | Endpoint              | Request Body      | Response                                     |
| ------ | --------------------- | ----------------- | -------------------------------------------- |
| GET    | `/api/expenses`          | —                 | `[{ expense_id, user_id, description, amount, date, is_reimbursed }]` |
| POST   | `/api/expenses`          | `{ description, amount, date }`       | `{ expense_id, user_id, description, amount, date, is_reimbursed }`   |
| PATCH  | `/api/expenses/:expense_id` | `{ is_reimbursed }` | `{ expense_id, user_id, description, amount, date, is_reimbursed }`   |
| DELETE | `/api/expenses/:expense_id` | —                 | `{ expense_id, user_id, description, amount, date, is_reimbursed }`   |

## Setup

### 1. Database

Create a local Postgres database:

```sh
createdb expenses_db
```

### 2. Server

```sh
cd server
npm install
cp .env.template .env
```

Open `.env` and fill in your Postgres credentials and a session secret. Then seed the database:

```sh
npm run db:seed
```

Start the server:

```sh
npm run dev
```

The server runs on `http://localhost:8080`.

### 3. Frontend

In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`. The Vite dev proxy forwards all `/api` requests to the Express server so session cookies work correctly.

## Seed Users

After running `npm run db:seed`, these accounts are available:

| Username | Password    |
| -------- | ----------- |
| jane    | password111 |
| max      | password222 |
```
