import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.images?.[0]}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://picsum.photos/700/500";
          }}
        />
        {product.category?.name && <span className="product-tag">{product.category.name}</span>}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <div className="product-meta">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <span className="product-stock">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
