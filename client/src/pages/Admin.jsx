import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = { name: "", description: "", price: "", category: "", images: "", stock: "" };

// Flatten the category tree into indented options for a <select>
const flattenCategories = (nodes, depth = 0) =>
  nodes.flatMap((node) => [
    { _id: node._id, label: `${"— ".repeat(depth)}${node.name}` },
    ...flattenCategories(node.children || [], depth + 1),
  ]);

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);
  const [tab, setTab] = useState("products");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [newCatName, setNewCatName] = useState("");
  const [newCatParent, setNewCatParent] = useState("");
  const [catError, setCatError] = useState("");

  const loadProducts = () => api.get("/products").then(({ data }) => setProducts(data));
  const loadOrders = () => api.get("/orders").then(({ data }) => setOrders(data));
  const loadCategories = () => api.get("/categories").then(({ data }) => setCategoryTree(data));

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadCategories();
  }, []);

  const flatCategories = flattenCategories(categoryTree);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?._id || product.category,
      images: (product.images || []).join("\n"),
      stock: product.stock,
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this product from the store?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const handleStatusChange = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    loadOrders();
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setCatError("");
    if (!newCatName.trim()) return;
    try {
      await api.post("/categories", { name: newCatName.trim(), parent: newCatParent || null });
      setNewCatName("");
      setNewCatParent("");
      loadCategories();
    } catch (err) {
      setCatError(err.response?.data?.message || "Could not add category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Delete this category and all its subcategories?")) return;
    try {
      await api.delete(`/categories/${id}`);
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete category");
    }
  };

  return (
    <div className="page">
      <h1>Admin dashboard</h1>
      <div className="tab-bar">
        <button className={tab === "products" ? "tab active" : "tab"} onClick={() => setTab("products")}>
          Products
        </button>
        <button className={tab === "categories" ? "tab active" : "tab"} onClick={() => setTab("categories")}>
          Categories
        </button>
        <button className={tab === "orders" ? "tab active" : "tab"} onClick={() => setTab("orders")}>
          Orders
        </button>
      </div>

      {tab === "products" && (
        <div className="admin-grid">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>{editingId ? "Edit product" : "Add a new product"}</h2>
            {error && <p className="error-text">{error}</p>}
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={3} />
            <div className="form-row">
              <div>
                <label>Price ($)</label>
                <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
              </div>
              <div>
                <label>Stock</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} required />
              </div>
            </div>
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select a category…</option>
              {flatCategories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.label}
                </option>
              ))}
            </select>
            <label>Image URLs (one per line — first one is the main thumbnail)</label>
            <textarea
              name="images"
              value={form.images}
              onChange={handleChange}
              required
              rows={4}
              placeholder={"https://example.com/front.jpg\nhttps://example.com/side.jpg\nhttps://example.com/back.jpg"}
            />
            <div className="form-row">
              <button className="primary-btn" type="submit">
                {editingId ? "Save changes" : "Add product"}
              </button>
              {editingId && (
                <button type="button" className="secondary-btn" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="admin-list">
            {products.map((p) => (
              <div className="admin-row" key={p._id}>
                <img src={p.images?.[0]} alt={p.name} />
                <div className="admin-row-info">
                  <h3>{p.name}</h3>
                  <p>${p.price.toFixed(2)} · {p.stock} in stock · {p.category?.name}</p>
                </div>
                <button className="link-btn" onClick={() => handleEdit(p)}>Edit</button>
                <button className="link-btn danger" onClick={() => handleDelete(p._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "categories" && (
        <div className="admin-grid">
          <form className="checkout-form" onSubmit={handleAddCategory}>
            <h2>Add a category</h2>
            {catError && <p className="error-text">{catError}</p>}
            <label>Name</label>
            <input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} required />
            <label>Parent category (optional — leave blank for a top-level category)</label>
            <select value={newCatParent} onChange={(e) => setNewCatParent(e.target.value)}>
              <option value="">— Top level —</option>
              {flatCategories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.label}
                </option>
              ))}
            </select>
            <button className="primary-btn" type="submit" style={{ marginTop: "1.25rem" }}>
              Add category
            </button>
          </form>

          <div className="admin-list">
            {flatCategories.map((c) => (
              <div className="admin-row" key={c._id} style={{ gridTemplateColumns: "1fr auto" }}>
                <div className="admin-row-info">
                  <h3>{c.label}</h3>
                </div>
                <button className="link-btn danger" onClick={() => handleDeleteCategory(c._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="orders-list">
          {orders.length === 0 && <p className="status-text">No orders yet.</p>}
          {orders.map((order) => (
            <div className="receipt-card" key={order._id}>
              <div className="receipt-header">
                <div>
                  <p className="receipt-label">{order.user?.name} · {order.user?.email}</p>
                  <p className="receipt-id">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="receipt-items">
                {order.items.map((item, idx) => (
                  <div className="receipt-line" key={idx}>
                    <span>{item.quantity} × {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="receipt-line receipt-total">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
