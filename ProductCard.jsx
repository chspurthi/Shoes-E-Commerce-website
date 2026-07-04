import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product._id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-black/5 hover:border-ink transition-colors"
    >
      <div className="aspect-square overflow-hidden bg-bone">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-slate mb-1">{product.category}</p>
        <h3 className="font-semibold text-ink leading-tight mb-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="font-display text-lg">${product.price.toFixed(2)}</span>
          {product.countInStock === 0 && (
            <span className="text-xs font-semibold text-rust">Sold out</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
