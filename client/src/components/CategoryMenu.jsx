import { useState } from "react";
import { Link } from "react-router-dom";

const CategoryNode = ({ node, depth = 0 }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div
      className="cat-node"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link to={`/category/${node._id}`} className="cat-node-label">
        {node.name}
        {hasChildren && <span className="cat-arrow">›</span>}
      </Link>
      {hasChildren && open && (
        <div className={depth === 0 ? "cat-flyout" : "cat-flyout cat-flyout-nested"}>
          {node.children.map((child) => (
            <CategoryNode key={child._id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryMenu = ({ categories }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!categories || categories.length === 0) return null;

  return (
    <div
      className="category-menu"
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => setMenuOpen(false)}
    >
      <button className="category-menu-trigger">
        Shop by category <span className="cat-arrow">›</span>
      </button>
      {menuOpen && (
        <div className="cat-top-row">
          {categories.map((cat) => (
            <CategoryNode key={cat._id} node={cat} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
