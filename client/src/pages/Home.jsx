import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import SaleSlider from "../components/SaleSlider";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const fetchProducts = async (search) => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", {
        params: { keyword: search || undefined },
      });
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    api.get("/categories").then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(keyword);
  };

  return (
    <div className="page">
      <SaleSlider />

      <section className="hero">
        <p className="eyebrow">Every item, in one store</p>
        <h1>MHS Store</h1>
        <p className="hero-sub">
          Browse freely, no account needed. Sign in only when you're ready to check out
          or track an order.
        </p>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </section>

      {categories.length > 0 && (
        <section className="category-tiles">
          {categories.map((cat) => (
            <Link to={`/category/${cat._id}`} key={cat._id} className="category-tile">
              <img
                className="category-tile-img"
                src={`https://loremflickr.com/300/200/${encodeURIComponent(cat.name)}`}
                alt=""
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://picsum.photos/300/200";
                }}
              />
              <span className="category-tile-name">{cat.name}</span>
              <span className="category-tile-count">{cat.children.length} subcategories</span>
            </Link>
          ))}
        </section>
      )}

      <h2 className="section-title">All products</h2>

      {loading ? (
        <p className="status-text">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="status-text">No products found. Try a different search.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
