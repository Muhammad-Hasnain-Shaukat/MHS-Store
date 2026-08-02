import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setActiveImage(0);
    api.get(`/products/${id}`).then(({ data }) => setProduct(data));
  }, [id]);

  if (!product) return <p className="status-text">Loading…</p>;

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="page product-detail">
      <button className="back-link" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="detail-grid">
        <div className="gallery">
          <div className="gallery-main">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://picsum.photos/700/500";
              }}
            />
          </div>
          {product.images.length > 1 && (
            <div className="gallery-thumbs">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={idx === activeImage ? "gallery-thumb active" : "gallery-thumb"}
                  onClick={() => setActiveImage(idx)}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="detail-info">
          {product.category?.name && (
            <Link to={`/category/${product.category._id}`} className="product-tag">
              {product.category.name}
            </Link>
          )}
          <h1>{product.name}</h1>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <p className="detail-desc">{product.description}</p>
          <p className="detail-stock">
            {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
          </p>

          <div className="qty-row">
            <label>Quantity</label>
            <input
              type="number"
              min="1"
              max={product.stock || 1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            />
          </div>

          <button
            className="primary-btn"
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            {added ? "Added to cart ✓" : "Add to cart"}
          </button>
          <p className="hint-text">You can browse and add to cart without an account — you'll only need to log in at checkout.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
