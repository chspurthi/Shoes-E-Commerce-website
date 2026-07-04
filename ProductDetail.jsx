import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { useCart } from "../context/CartContext.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError("Product not found.");
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Pick a size first.");
      return;
    }
    addToCart(product, selectedSize, 1);
    setAdded(true);
    setError("");
  };

  if (error && !product) return <p className="max-w-7xl mx-auto px-6 py-16 text-rust">{error}</p>;
  if (!product) return <p className="max-w-7xl mx-auto px-6 py-16 text-slate">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
      <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-black/5">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-slate mb-2">{product.category}</p>
        <h1 className="font-display text-4xl mb-3">{product.name}</h1>
        <p className="font-display text-2xl text-rust mb-6">${product.price.toFixed(2)}</p>
        <p className="text-slate mb-8 leading-relaxed">{product.description}</p>

        {product.colors?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold mb-2">Colors</p>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((c) => (
                <span key={c} className="text-sm border border-black/10 rounded-full px-3 py-1">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <p className="text-sm font-semibold mb-2">Select size (US)</p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSelectedSize(s);
                  setError("");
                }}
                className={`w-12 h-12 rounded-full border text-sm font-medium transition-colors ${
                  selectedSize === s
                    ? "bg-ink text-bone border-ink"
                    : "border-black/15 hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {product.countInStock === 0 ? (
          <p className="text-rust font-semibold">Currently sold out</p>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto bg-volt text-ink font-display px-8 py-3 rounded-full hover:bg-ink hover:text-volt transition-colors"
          >
            ADD TO CART
          </button>
        )}

        {error && <p className="text-rust text-sm mt-3">{error}</p>}
        {added && (
          <p className="text-sm mt-3">
            Added to cart.{" "}
            <button onClick={() => navigate("/cart")} className="underline font-semibold">
              View cart
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
