import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api.js";

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError("Couldn't load order.");
      }
    };
    fetchOrder();
  }, [id]);

  if (error) return <p className="max-w-3xl mx-auto px-6 py-20 text-rust">{error}</p>;
  if (!order) return <p className="max-w-3xl mx-auto px-6 py-20 text-slate">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-volt flex items-center justify-center mx-auto mb-6 font-display text-2xl">
        ✓
      </div>
      <h1 className="font-display text-3xl mb-2">Order placed</h1>
      <p className="text-slate mb-8">
        Order #{order._id.slice(-8).toUpperCase()} is now {order.status.toLowerCase()}.
      </p>

      <div className="bg-white rounded-2xl border border-black/5 p-6 text-left mb-8">
        <h2 className="font-display text-lg mb-4">Shipping to</h2>
        <p className="text-sm text-slate">
          {order.shippingAddress.fullName}<br />
          {order.shippingAddress.address}, {order.shippingAddress.city}<br />
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </p>
        <div className="border-t border-black/10 mt-4 pt-4 flex justify-between font-display text-lg">
          <span>Total</span>
          <span>${order.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <Link to="/" className="bg-ink text-bone font-display px-8 py-3 rounded-full inline-block">
        CONTINUE SHOPPING
      </Link>
    </div>
  );
};

export default OrderConfirmation;
