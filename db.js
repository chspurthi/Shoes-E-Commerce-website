import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// This creates a single file, voltstride.db, in the backend folder.
// No separate database server needs to be installed or running.
const dbPath = path.join(__dirname, "..", "voltstride.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const setupTables = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT NOT NULL DEFAULT 'VoltStride',
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      sizes TEXT NOT NULL,       -- JSON array, e.g. "[7,8,9]"
      colors TEXT NOT NULL,      -- JSON array, e.g. "[\"Black\"]"
      countInStock INTEGER NOT NULL DEFAULT 0,
      featured INTEGER NOT NULL DEFAULT 0,
      rating REAL NOT NULL DEFAULT 0,
      numReviews INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      orderItems TEXT NOT NULL,        -- JSON array of items
      shippingAddress TEXT NOT NULL,   -- JSON object
      paymentMethod TEXT NOT NULL DEFAULT 'Cash on Delivery',
      itemsPrice REAL NOT NULL DEFAULT 0,
      shippingPrice REAL NOT NULL DEFAULT 0,
      totalPrice REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'Processing',
      isDelivered INTEGER NOT NULL DEFAULT 0,
      deliveredAt TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id)
    );
  `);
};

const connectDB = () => {
  setupTables();
  console.log(`SQLite connected: ${dbPath}`);
};

export { db };
export default connectDB;
