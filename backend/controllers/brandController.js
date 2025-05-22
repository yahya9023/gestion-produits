const db = require('../database');

exports.getAll = (req, res) => {
  db.all('SELECT * FROM brands', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.add = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Brand name is required' });

  db.run('INSERT INTO brands (name) VALUES (?)', [name], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint')) {
        return res.status(409).json({ error: 'Brand already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Brand added', id: this.lastID });
  });
};

// تعديل brand
exports.update = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Brand name is required' });

  db.run('UPDATE brands SET name = ? WHERE id = ?', [name, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Brand not found' });
    res.json({ message: 'Brand updated', id, name });
  });
};

// حذف brand
exports.remove = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM brands WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Brand not found' });
    res.json({ message: 'Brand deleted' });
  });
};