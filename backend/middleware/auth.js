import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verifies the JWT and attaches the logged-in user to req.user
export const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = User.toSafeObject(user);
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token provided" });
};

// Restricts a route to admin-role users only. Use after `protect`.
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
};
