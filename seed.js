// Seeds the database with an admin account, a test user, and a starter product catalog.
// Run with: npm run seed
// This resets voltstride.db each time you run it.
import dotenv from "dotenv";
import { db } from "./config/db.js";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Product from "./models/Product.js";

dotenv.config();
connectDB();

const seed = async () => {
  try {
    db.exec("DELETE FROM orders");
    db.exec("DELETE FROM products");
    db.exec("DELETE FROM users");

    await User.create({ name: "Admin", email: "admin@voltstride.com", password: "admin123", role: "admin" });
    await User.create({ name: "Test User", email: "user@voltstride.com", password: "user123", role: "user" });

    const products = [
      {
        name: "Volt Runner X1",
        category: "running",
        description: "Lightweight daily trainer with responsive foam cushioning built for long miles.",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
        sizes: [7, 8, 9, 10, 11, 12],
        colors: ["Volt Yellow", "Black"],
        countInStock: 25,
        featured: true,
      },
      {
        name: "Apex Court Pro",
        category: "basketball",
        description: "High-top basketball shoe with reinforced ankle support and explosive cushioning.",
        price: 159.99,
        image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800",
        sizes: [8, 9, 10, 11, 12, 13],
        colors: ["Black", "White"],
        countInStock: 18,
        featured: true,
      },
      {
        name: "Street Glide Low",
        category: "lifestyle",
        description: "Everyday low-top sneaker with a clean silhouette and premium leather upper.",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800",
        sizes: [6, 7, 8, 9, 10, 11],
        colors: ["White", "Grey"],
        countInStock: 40,
        featured: false,
      },
      {
        name: "Forge Trainer II",
        category: "training",
        description: "Stable flat sole cross-trainer built for lifting, HIIT, and gym sessions.",
        price: 109.99,
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
        sizes: [7, 8, 9, 10, 11],
        colors: ["Black", "Volt Yellow"],
        countInStock: 30,
        featured: true,
      },
      {
        name: "Curb Deck Skate",
        category: "skate",
        description: "Durable suede skate shoe with reinforced ollie area and grip-focused outsole.",
        price: 74.99,
        image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800",
        sizes: [7, 8, 9, 10, 11, 12],
        colors: ["Black", "Red"],
        countInStock: 22,
        featured: false,
      },
      {
        name: "Volt Runner X1 Mono",
        category: "running",
        description: "All-black edition of the Volt Runner X1 with the same responsive midsole.",
        price: 134.99,
        image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800",
        sizes: [7, 8, 9, 10, 11],
        colors: ["Black"],
        countInStock: 15,
        featured: false,
      },
    ];

    products.forEach((p) => Product.create(p));

    console.log("Database seeded successfully");
    console.log("Admin login: admin@voltstride.com / admin123");
    console.log("User login:  user@voltstride.com / user123");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
