// backend/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'gestion.db'), (err) => {
  if (err) return console.error(err.message);
  console.log('✅ Connected to SQLite database.');
});

module.exports = db;
