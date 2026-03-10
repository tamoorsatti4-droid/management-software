const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./management.db');

db.serialize(() => {
  // Employees table
  db.run(`CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    salary REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Attendance table
  db.run(`CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    date DATE,
    status TEXT, -- 'Present', 'Absent', 'Leave'
    FOREIGN KEY(employee_id) REFERENCES employees(id)
  )`);

  // Salary Records
  db.run(`CREATE TABLE IF NOT EXISTS salary_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    month TEXT, -- e.g. '2026-03'
    amount REAL,
    paid_date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY(employee_id) REFERENCES employees(id)
  )`);

  // Products Table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    purchase_price REAL,
    selling_price REAL,
    stock INTEGER DEFAULT 0
  )`);

  // Purchases Table (Inventory Restock)
  db.run(`CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    quantity INTEGER,
    total_cost REAL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

  // Sales Table
  db.run(`CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total_amount REAL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  
  // Sale Items Table
  db.run(`CREATE TABLE IF NOT EXISTS sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY(sale_id) REFERENCES sales(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

  // Expenses Table
  db.run(`CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT,
    amount REAL,
    date DATE DEFAULT CURRENT_DATE
  )`);
});

module.exports = db;
