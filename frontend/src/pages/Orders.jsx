import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";

const statusStyles = {
  Processing: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="max-w-4xl mx-auto px-6 py-16 text-slate">Loading orders...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl mb-8">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate mb-6">You haven't placed any orders yet.</p>
          <Link to="/" className="bg-ink text-bone font-display px-8 py-3 rounded-full inline-block">
            SHOP NOW
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-black/5 p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-slate">
                  {new Date(order.createdAt).toLocaleDateString()} · {order.orderItems.length} item(s)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[order.status]}`}>
                  {order.status}
                </span>
                <span className="font-display text-lg">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
