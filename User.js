import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const User = {
  findByEmail(email) {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  },

  findById(id) {
    return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  },

  // Returns the user without the password field, for safe API responses.
  // Renames the SQLite "id" column to "_id" so the frontend (originally
  // built against MongoDB's _id convention) doesn't need any changes.
  toSafeObject(user) {
    if (!user) return null;
    const { password, id, ...safe } = user;
    return { _id: id, ...safe };
  },

  async create({ name, email, password, role = "user" }) {
    const hashed = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    db.prepare(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)"
    ).run(id, name, email, hashed, role);
    return this.findById(id);
  },

  async matchPassword(enteredPassword, hashedPassword) {
    return bcrypt.compare(enteredPassword, hashedPassword);
  },
};

export default User;
