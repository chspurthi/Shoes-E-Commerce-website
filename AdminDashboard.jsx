import { useEffect, useState } from "react";
import api from "../api/api.js";

const emptyForm = {
  name: "",
  category: "running",
  description: "",
  price: "",
  image: "",
  sizes: "",
  colors: "",
  countInStock: "",
  featured: false,
};

const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

const AdminDashboard = () => {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        api.get("/products"),
        api.get("/orders"),
      ]);
      setProducts(prodRes.data);
      setOrders(orderRes.data);
    } catch (err) {
      setError("Couldn't load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        countInStock: Number(form.countInStock),
        sizes: form.sizes.split(",").map((s) => Number(s.trim())).filter(Boolean),
        colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      resetForm();
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save the product.");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      image: product.image,
      sizes: product.sizes.join(", "),
      colors: (product.colors || []).join(", "),
      countInStock: product.countInStock,
      featured: product.featured,
    });
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product? This can't be undone.")) return;
    await api.delete(`/products/${id}`);
    loadData();
  };

  const handleStatusChange = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    loadData();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl mb-2">Admin Dashboard</h1>
      <p className="text-slate mb-8">Manage the catalog and track incoming orders.</p>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab("products")}
          className={`px-5 py-2 rounded-full text-sm font-semibold ${tab === "products" ? "bg-ink text-bone" : "bg-white border border-black/10"}`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`px-5 py-2 rounded-full text-sm font-semibold ${tab === "orders" ? "bg-ink text-bone" : "bg-white border border-black/10"}`}
        >
          Orders ({orders.length})
        </button>
      </div>

      {loading ? (
        <p className="text-slate">Loading...</p>
      ) : tab === "products" ? (
        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-1 bg-white rounded-2xl border border-black/5 p-6 space-y-3 h-fit">
            <h2 className="font-display text-lg mb-2">{editingId ? "Edit product" : "Add product"}</h2>
            <input name="name" required placeholder="Name" value={form.name} onChange={handleChange} className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm" />
            <select name="category" value={form.category} onChange={handleChange} className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm">
              {["running", "basketball", "lifestyle", "training", "skate"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <textarea name="description" required placeholder="Description" value={form.description} onChange={handleChange} className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm" rows={3} />
            <input name="image" required placeholder="Image URL" value={form.image} onChange={handleChange} className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <input name="price" type="number" step="0.01" required placeholder="Price" value={form.price} onChange={handleChange} className="border border-black/10 rounded-lg px-3 py-2 text-sm" />
              <input name="countInStock" type="number" required placeholder="Stock" value={form.countInStock} onChange={handleChange} className="border border-black/10 rounded-lg px-3 py-2 text-sm" />
            </div>
            <input name="sizes" required placeholder="Sizes, comma separated (7,8,9)" value={form.sizes} onChange={handleChange} className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm" />
            <input name="colors" placeholder="Colors, comma separated" value={form.colors} onChange={handleChange} className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              Featured on homepage
            </label>
            {error && <p className="text-rust text-sm">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-volt text-ink font-display py-2 rounded-full">
                {editingId ? "SAVE" : "ADD"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="px-4 py-2 border border-black/10 rounded-full text-sm">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="lg:col-span-2 space-y-3">
            {products.map((p) => (
              <div key={p._id} className="bg-white rounded-2xl border border-black/5 p-4 flex items-center gap-4">
                <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-slate">{p.category} · ${p.price.toFixed(2)} · {p.countInStock} in stock</p>
                </div>
                <button onClick={() => handleEdit(p)} className="text-sm font-semibold underline">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="text-sm font-semibold text-rust underline">Delete</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-black/5 p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">#{order._id.slice(-8).toUpperCase()} — {order.user?.name}</p>
                <p className="text-sm text-slate">{order.user?.email} · {order.orderItems.length} item(s) · ${order.totalPrice.toFixed(2)}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="border border-black/10 rounded-full px-4 py-2 text-sm"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
          {orders.length === 0 && <p className="text-slate">No orders yet.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
