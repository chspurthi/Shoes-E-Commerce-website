import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query ? `/?keyword=${encodeURIComponent(query)}` : "/");
  };

  return (
    <header className="sticky top-0 z-40 bg-ink text-bone">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 gap-6">
          <Link to="/" className="font-display text-xl tracking-tight shrink-0">
            VOLT<span className="text-volt">STRIDE</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shoes..."
              className="w-full bg-transparent border border-slate rounded-l-full px-4 py-1.5 text-sm placeholder:text-slate focus:border-volt outline-none"
            />
            <button
              type="submit"
              className="bg-volt text-ink font-semibold text-sm px-4 rounded-r-full hover:bg-white transition-colors"
            >
              Go
            </button>
          </form>

          <nav className="flex items-center gap-5 text-sm font-medium shrink-0">
            <Link to="/?category=running" className="hidden sm:inline hover:text-volt transition-colors">Running</Link>
            <Link to="/?category=basketball" className="hidden sm:inline hover:text-volt transition-colors">Basketball</Link>
            <Link to="/?category=lifestyle" className="hidden lg:inline hover:text-volt transition-colors">Lifestyle</Link>

            <Link to="/cart" className="relative hover:text-volt transition-colors">
              Cart
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-volt text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                {user.role === "admin" && (
                  <Link to="/admin" className="hover:text-volt transition-colors">Admin</Link>
                )}
                <Link to="/orders" className="hover:text-volt transition-colors">Orders</Link>
                <button onClick={logout} className="hover:text-rust transition-colors">Log out</button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-volt text-ink font-semibold px-4 py-1.5 rounded-full hover:bg-white transition-colors"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
