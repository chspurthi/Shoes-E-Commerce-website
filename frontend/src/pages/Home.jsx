import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/api.js";
import ProductCard from "../components/ProductCard.jsx";

const CATEGORIES = ["running", "basketball", "lifestyle", "training", "skate"];

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {};
        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        if (sort) params.sort = sort;
        const { data } = await api.get("/products", { params });
        setProducts(data);
      } catch (err) {
        setError("Couldn't load products. Is the backend server running?");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, category, sort]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div>
      {!keyword && !category && (
        <section className="bg-ink text-bone">
          <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-volt font-semibold tracking-widest text-sm mb-3">NEW SEASON DROP</p>
              <h1 className="font-display text-5xl md:text-6xl leading-[0.95] mb-6">
                MOVE LIKE<br />YOU MEAN IT
              </h1>
              <p className="text-bone/70 max-w-md mb-8">
                Engineered soles, breathable uppers, zero compromise. Shop the full VoltStride
                lineup across running, court, and street.
              </p>
              <a
                href="#catalog"
                className="inline-block bg-volt text-ink font-display px-8 py-3 rounded-full hover:bg-white transition-colors"
              >
                SHOP NOW
              </a>
            </div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-slate/30 to-transparent">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000"
                alt="Featured VoltStride sneaker"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      <section id="catalog" className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl">
              {keyword ? `Results for "${keyword}"` : category ? category : "Full Catalog"}
            </h2>
            {(keyword || category) && (
              <Link to="/" className="text-sm text-slate hover:text-ink underline">
                Clear filters
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={category}
              onChange={(e) => setParam("category", e.target.value)}
              className="border border-black/10 rounded-full px-4 py-2 text-sm bg-white"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c[0].toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value)}
              className="border border-black/10 rounded-full px-4 py-2 text-sm bg-white"
            >
              <option value="">Newest</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
          </div>
        </div>

        {loading && <p className="text-slate">Loading products...</p>}
        {error && <p className="text-rust">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="text-slate">No shoes match that search. Try a different filter.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
