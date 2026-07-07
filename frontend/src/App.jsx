import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Orders from "./pages/Orders.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  return (
    <div className="min-h-screen bg-bone text-ink font-body flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation/:id"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <footer className="bg-ink text-bone/60 text-sm py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between gap-2">
          <p className="font-display text-bone text-base">VOLT<span className="text-volt">STRIDE</span></p>
          <p>&copy; {new Date().getFullYear()} VoltStride. Built for motion.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
