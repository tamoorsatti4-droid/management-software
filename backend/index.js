const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// --- EMPLOYEES API ---
app.get('/api/employees', (req, res) => {
  db.all("SELECT * FROM employees", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/employees', (req, res) => {
  const { name, role, salary } = req.body;
  db.run("INSERT INTO employees (name, role, salary) VALUES (?, ?, ?)", [name, role, salary], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, role, salary });
  });
});

app.delete('/api/employees/:id', (req, res) => {
  db.run("DELETE FROM employees WHERE id = ?", req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// --- ATTENDANCE API ---
app.get('/api/attendance', (req, res) => {
  const date = req.query.date; // Optional filter by date
  let sql = "SELECT * FROM attendance";
  let params = [];
  if (date) {
    sql += " WHERE date = ?";
    params.push(date);
  }
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/attendance', (req, res) => {
  const { employee_id, date, status } = req.body;
  // Use replace to easily update existing attendance for same day if we add unique constraint. For now insert.
  db.run(`INSERT INTO attendance (employee_id, date, status) VALUES (?, ?, ?)`, 
    [employee_id, date, status], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, employee_id, date, status });
  });
});

// --- SALARIES API ---
app.get('/api/salaries', (req, res) => {
  db.all("SELECT * FROM salary_payments", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/salaries', (req, res) => {
  const { employee_id, month, amount, paid_date } = req.body;
  db.run("INSERT INTO salary_payments (employee_id, month, amount, paid_date) VALUES (?, ?, ?, ?)", 
    [employee_id, month, amount, paid_date || new Date().toISOString().split('T')[0]], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, employee_id, month, amount, paid_date });
  });
});

// --- PRODUCTS API ---
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/products', (req, res) => {
  const { name, purchase_price, selling_price, stock } = req.body;
  db.run("INSERT INTO products (name, purchase_price, selling_price, stock) VALUES (?, ?, ?, ?)", 
    [name, purchase_price, selling_price, stock || 0], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, purchase_price, selling_price, stock });
  });
});

// --- PURCHASES (RESTOCK) API ---
app.post('/api/purchases', (req, res) => {
  const { product_id, quantity, total_cost } = req.body;
  db.run("INSERT INTO purchases (product_id, quantity, total_cost) VALUES (?, ?, ?)", 
    [product_id, quantity, total_cost], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.run("UPDATE products SET stock = stock + ? WHERE id = ?", [quantity, product_id]);
    res.json({ id: this.lastID, product_id, quantity, total_cost });
  });
});

// --- SALES API ---
app.post('/api/sales', (req, res) => {
  const { items, total_amount } = req.body; 
  db.run("INSERT INTO sales (total_amount) VALUES (?)", [total_amount], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    const sale_id = this.lastID;
    
    items.forEach(item => {
      db.run("INSERT INTO sale_items (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [sale_id, item.product_id, item.quantity, item.price]);
      db.run("UPDATE products SET stock = stock - ? WHERE id = ?", [item.quantity, item.product_id]);
    });
    
    res.json({ id: sale_id, total_amount });
  });
});

app.get('/api/sales', (req, res) => {
  db.all("SELECT * FROM sales ORDER BY date DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- EXPENSES API ---
app.get('/api/expenses', (req, res) => {
  db.all("SELECT * FROM expenses ORDER BY date DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/expenses', (req, res) => {
  const { description, amount, date } = req.body;
  db.run("INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)", 
    [description, amount, date || new Date().toISOString().split('T')[0]], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, description, amount, date });
  });
});

// --- DASHBOARD API ---
app.get('/api/dashboard', (req, res) => {
  let dashboardData = { total_sales: 0, total_purchases: 0, total_expenses: 0, salaries_paid: 0, profit: 0 };
  
  db.get("SELECT SUM(total_amount) as sales FROM sales", [], (err, row) => {
    dashboardData.total_sales = row ? row.sales || 0 : 0;
    db.get("SELECT SUM(total_cost) as purchases FROM purchases", [], (err, row) => {
      dashboardData.total_purchases = row ? row.purchases || 0 : 0;
      db.get("SELECT SUM(amount) as expenses FROM expenses", [], (err, row) => {
         dashboardData.total_expenses = row ? row.expenses || 0 : 0;
         db.get("SELECT SUM(amount) as salaries FROM salary_payments", [], (err, row) => {
            dashboardData.salaries_paid = row ? row.salaries || 0 : 0;
            dashboardData.profit = dashboardData.total_sales - dashboardData.total_purchases - dashboardData.total_expenses - dashboardData.salaries_paid;
            res.json(dashboardData);
         });
      });
    });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
