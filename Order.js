import { db } from "../config/db.js";
import crypto from "crypto";
import User from "./User.js";

const parseRow = (row) => {
  if (!row) return null;
  const { id, ...rest } = row;
  return {
    ...rest,
    _id: id,
    orderItems: JSON.parse(row.orderItems),
    shippingAddress: JSON.parse(row.shippingAddress),
    isDelivered: !!row.isDelivered,
  };
};

const Order = {
  create({ userId, orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice }) {
    const id = crypto.randomUUID();
    db.prepare(
      `INSERT INTO orders
        (id, userId, orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      userId,
      JSON.stringify(orderItems),
      JSON.stringify(shippingAddress),
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice
    );
    return this.findById(id);
  },

  findById(id) {
    const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
    const order = parseRow(row);
    if (order) {
      order.user = User.toSafeObject(User.findById(order.userId));
    }
    return order;
  },

  findByUser(userId) {
    const rows = db
      .prepare("SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC")
      .all(userId);
    return rows.map(parseRow);
  },

  findAll() {
    const rows = db.prepare("SELECT * FROM orders ORDER BY createdAt DESC").all();
    return rows.map((row) => {
      const order = parseRow(row);
      order.user = User.toSafeObject(User.findById(order.userId));
      return order;
    });
  },

  updateStatus(id, status) {
    const isDelivered = status === "Delivered" ? 1 : 0;
    const deliveredAt = status === "Delivered" ? new Date().toISOString() : null;
    db.prepare(
      "UPDATE orders SET status = ?, isDelivered = ?, deliveredAt = ? WHERE id = ?"
    ).run(status, isDelivered, deliveredAt, id);
    return this.findById(id);
  },
};

export default Order;
