// backend/controllers/authController.js
const db = require('../database');

exports.login = (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.json({ message: 'Login successful', user: row });
    res.status(401).json({ message: 'Invalid credentials' });
  });
};
