const db = require('../database');

exports.getAll = (req, res) => {
  const sql = `
    SELECT products.*, brands.name AS brand_name 
    FROM products 
    LEFT JOIN brands ON products.brand_id = brands.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.add = (req, res) => {
  const {
    name,
    description = '',
    quantity = 0,
    frais_transport = 0,
    prix_achat = 0,
    prix_vente_propose = 0,
    mon_prix_vente = 0,
    brand_id
  } = req.body;
  

  if (!name || !brand_id) {
    return res.status(400).json({ error: 'Name and brand_id are required' });
  }

  const image = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO products 
    (name, description, image, quantity, frais_transport, prix_achat, prix_vente_propose, mon_prix_vente, brand_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      name,
      description,
      image,
      quantity,
      frais_transport,
      prix_achat,
      prix_vente_propose,
      mon_prix_vente,
      brand_id
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        message: 'Product added',
        product: {
          id: this.lastID,
          name,
          description,
          image,
          quantity,
          frais_transport,
          prix_achat,
          prix_vente_propose,
          mon_prix_vente,
          brand_id,
        },
      });
    }
  );
};

// controllers/productController.js
exports.getById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT products.*, brands.name AS brand_name 
    FROM products 
    LEFT JOIN brands ON products.brand_id = brands.id
    WHERE products.id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Product not found" });
    res.json(row);
  });
};




exports.update = (req, res) => {
  const { id } = req.params;
  const { name, description, quantity, frais_transport, prix_achat, prix_vente_propose, mon_prix_vente, brand_id } = req.body;

  db.get('SELECT image FROM products WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: 'Product not found' });

    const oldImage = row.image;
    let newImage = oldImage;

    if (req.file) {
      newImage = req.file.filename;

      // حذف الصورة القديمة من المجلد
      const fs = require('fs');
      const path = require('path');
      const oldPath = path.join(__dirname, '../uploads/', oldImage);
      fs.unlink(oldPath, (err) => { if (err) console.log('Error deleting old image:', err); });
    }

    const sql = `UPDATE products SET 
      name = ?, description = ?, quantity = ?, frais_transport = ?, prix_achat = ?, 
      prix_vente_propose = ?, mon_prix_vente = ?, brand_id = ?, image = ?
      WHERE id = ?`;

    db.run(sql, [name, description, quantity, frais_transport, prix_achat, prix_vente_propose, mon_prix_vente, brand_id, newImage, id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, name, description, quantity, frais_transport, prix_achat, prix_vente_propose, mon_prix_vente, brand_id, image: newImage });
    });
  });
};


exports.remove = (req, res) => {
  const { id } = req.params;
  const fs = require('fs');
  const path = require('path');

  db.get('SELECT image FROM products WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: 'Product not found' });

    const image = row.image;
    if (image) {
      const imagePath = path.join(__dirname, '../uploads/', image);
      fs.unlink(imagePath, (err) => { if (err) console.log('Error deleting image:', err); });
    }

    db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product deleted' });
    });
  });
};
