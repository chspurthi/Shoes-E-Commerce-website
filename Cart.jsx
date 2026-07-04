import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, itemsPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = itemsPrice > 100 || itemsPrice === 0 ? 0 : 9.99;
  const total = itemsPrice + shipping;

  const handleCheckout = () => {
    navigate(user ? "/checkout" : "/login?redirect=/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-3xl mb-4">Your cart is empty</h1>
        <p className="text-slate mb-6">Add a pair of shoes to get started.</p>
        <Link to="/" className="bg-ink text-bone font-display px-8 py-3 rounded-full inline-block">
          BROWSE SHOES
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.product}-${item.size}`}
              className="flex gap-4 bg-white rounded-2xl p-4 border border-black/5"
            >
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-slate">Size {item.size}</p>
                <p className="font-display text-lg mt-1">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item.product, item.size)}
                  className="text-sm text-rust hover:underline"
                >
                  Remove
                </button>
                <select
                  value={item.qty}
                  onChange={(e) => updateQty(item.product, item.size, Number(e.target.value))}
                  className="border border-black/10 rounded-lg px-2 py-1 text-sm"
                >
                  {Array.from({ length: Math.min(item.maxStock || 10, 10) }, (_, i) => i + 1).map(
                    (n) => (
                      <option key={n} value={n}>
                        Qty {n}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-black/5 h-fit">
          <h2 className="font-display text-xl mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-slate">Subtotal</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate">Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
          </div>
          <div className="flex justify-between font-display text-lg border-t border-black/10 pt-4 mb-6">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-volt text-ink font-display py-3 rounded-full hover:bg-ink hover:text-volt transition-colors"
          >
            CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
