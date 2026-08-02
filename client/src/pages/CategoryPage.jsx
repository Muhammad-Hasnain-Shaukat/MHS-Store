import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

// Recursively search the category tree for a node and the path of ancestors leading to it.
const findPath = (nodes, targetId, trail = []) => {
  for (const node of nodes) {
    const newTrail = [...trail, node];
    if (String(node._id) === String(targetId)) return newTrail;
    if (node.children?.length) {
      const found = findPath(node.children, targetId, newTrail);
      if (found) return found;
    }
  }
  return null;
};

const CategoryPage = () => {
  const { id } = useParams();
  const [tree, setTree] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setTree(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: { category: id } })
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  const path = findPath(tree, id) || [];
  const current = path[path.length - 1];

  return (
    <div className="page">
      <nav className="breadcrumb">
        <Link to="/">All products</Link>
        {path.map((node) => (
          <span key={node._id}>
            <span className="breadcrumb-sep">/</span>
            <Link to={`/category/${node._id}`}>{node.name}</Link>
          </span>
        ))}
      </nav>

      <h1 className="category-title">{current?.name || "Category"}</h1>

      {current?.children?.length > 0 && (
        <div className="subcategory-row">
          {current.children.map((child) => (
            <Link to={`/category/${child._id}`} key={child._id} className="subcategory-chip">
              {child.name}
            </Link>
          ))}
        </div>
      )}

      {loading ? (
        <p className="status-text">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="status-text">No products in this category yet.</p>
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

export default CategoryPage;
