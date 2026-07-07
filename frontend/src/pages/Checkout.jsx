import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import api from "../api/api.js";

const Checkout = () => {
  const { cartItems, itemsPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shipping = itemsPrice > 100 ? 0 : 9.99;
  const total = itemsPrice + shipping;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const orderItems = cartItems.map((i) => ({
        product: i.product,
        name: i.name,
        image: i.image,
        price: i.price,
        size: i.size,
        qty: i.qty,
      }));

      const { data } = await api.post("/orders", {
        orderItems,
        shippingAddress: form,
        paymentMethod,
      });

      clearCart();
      navigate(`/order-confirmation/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't place your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <p className="max-w-3xl mx-auto px-6 py-20 text-center text-slate">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl mb-8">Checkout</h1>
      <div className="grid md:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
          <h2 className="font-display text-lg">Shipping Address</h2>
          <input
            name="fullName" required placeholder="Full name" value={form.fullName} onChange={handleChange}
            className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white"
          />
          <input
            name="address" required placeholder="Street address" value={form.address} onChange={handleChange}
            className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              name="city" required placeholder="City" value={form.city} onChange={handleChange}
              className="border border-black/10 rounded-xl px-4 py-3 bg-white"
            />
            <input
              name="postalCode" required placeholder="Postal code" value={form.postalCode} onChange={handleChange}
              className="border border-black/10 rounded-xl px-4 py-3 bg-white"
            />
          </div>
          <input
            name="country" required placeholder="Country" value={form.country} onChange={handleChange}
            className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white"
          />

          <h2 className="font-display text-lg pt-4">Payment Method</h2>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white"
          >
            <option>Cash on Delivery</option>
            <option>Credit Card</option>
            <option>PayPal</option>
          </select>

          {error && <p className="text-rust text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-volt text-ink font-display py-3 rounded-full hover:bg-ink hover:text-volt transition-colors disabled:opacity-50"
          >
            {loading ? "PLACING ORDER..." : "PLACE ORDER"}
          </button>
        </form>

        <div className="bg-white rounded-2xl p-6 border border-black/5 h-fit">
          <h2 className="font-display text-lg mb-4">Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            {cartItems.map((i) => (
              <div key={`${i.product}-${i.size}`} className="flex justify-between">
                <span className="text-slate">{i.name} (x{i.qty}, sz {i.size})</span>
                <span>${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate">Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-display text-lg border-t border-black/10 pt-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
