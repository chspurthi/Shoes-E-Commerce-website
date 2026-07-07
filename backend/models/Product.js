import { db } from "../config/db.js";
import crypto from "crypto";

// Converts a raw SQLite row (with JSON-string columns) into a normal JS object.
// Renames "id" to "_id" so the frontend (built against MongoDB's _id
// convention) doesn't need any changes.
const parseRow = (row) => {
  if (!row) return null;
  const { id, ...rest } = row;
  return {
    ...rest,
    _id: id,
    sizes: JSON.parse(row.sizes),
    colors: JSON.parse(row.colors),
    featured: !!row.featured,
  };
};

const Product = {
  findAll({ keyword, category, featured, sort } = {}) {
    let sql = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (keyword) {
      sql += " AND name LIKE ?";
      params.push(`%${keyword}%`);
    }
    if (category) {
      sql += " AND category = ?";
      params.push(category);
    }
    if (featured === true) {
      sql += " AND featured = 1";
    }

    if (sort === "price_asc") sql += " ORDER BY price ASC";
    else if (sort === "price_desc") sql += " ORDER BY price DESC";
    else sql += " ORDER BY createdAt DESC";

    const rows = db.prepare(sql).all(...params);
    return rows.map(parseRow);
  },

  findById(id) {
    const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
    return parseRow(row);
  },

  create(data) {
    const id = crypto.randomUUID();
    db.prepare(
      `INSERT INTO products
        (id, name, brand, category, description, price, image, sizes, colors, countInStock, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      data.name,
      data.brand || "VoltStride",
      data.category,
      data.description,
      data.price,
      data.image,
      JSON.stringify(data.sizes || []),
      JSON.stringify(data.colors || []),
      data.countInStock ?? 0,
      data.featured ? 1 : 0
    );
    return this.findById(id);
  },

  update(id, data) {
    const existing = this.findById(id);
    if (!existing) return null;

    const merged = { ...existing, ...data };
    db.prepare(
      `UPDATE products SET
        name = ?, brand = ?, category = ?, description = ?, price = ?, image = ?,
        sizes = ?, colors = ?, countInStock = ?, featured = ?
       WHERE id = ?`
    ).run(
      merged.name,
      merged.brand,
      merged.category,
      merged.description,
      merged.price,
      merged.image,
      JSON.stringify(merged.sizes || []),
      JSON.stringify(merged.colors || []),
      merged.countInStock,
      merged.featured ? 1 : 0,
      id
    );
    return this.findById(id);
  },

  delete(id) {
    const result = db.prepare("DELETE FROM products WHERE id = ?").run(id);
    return result.changes > 0;
  },

  decrementStock(id, qty) {
    db.prepare("UPDATE products SET countInStock = countInStock - ? WHERE id = ?").run(qty, id);
  },
};

export default Product;
