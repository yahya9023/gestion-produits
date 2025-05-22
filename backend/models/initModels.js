const db = require('../database');

db.serialize(() => {
  // جدول المسؤول (admin)
  db.run(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  // جدول الماركات (brands)
  db.run(`
    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    )
  `);

  // جدول المنتجات (products) مربوط بالماركة عبر brand_id
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      image TEXT,
      quantity INTEGER DEFAULT 0,
      frais_transport REAL DEFAULT 0,
      prix_achat REAL DEFAULT 0,
      prix_vente_propose REAL DEFAULT 0,
      mon_prix_vente REAL DEFAULT 0,
      brand_id INTEGER,
      FOREIGN KEY (brand_id) REFERENCES brands(id)
    )
  `);
});
