import { useEffect, useState } from "react";
import api from "../api/axios";

const statusSteps = ["pending", "processing", "shipped", "delivered"];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my").then(({ data }) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="status-text">Loading your orders…</p>;

  if (orders.length === 0) {
    return (
      <div className="page">
        <h1>My orders</h1>
        <p className="status-text">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>My orders</h1>
      <div className="orders-list">
        {orders.map((order) => {
          const stepIndex = statusSteps.indexOf(order.status);
          return (
            <div className="receipt-card" key={order._id}>
              <div className="receipt-header">
                <div>
                  <p className="receipt-label">Order</p>
                  <p className="receipt-id">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="receipt-date">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
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

              {order.status !== "cancelled" ? (
                <div className="tracker">
                  {statusSteps.map((step, idx) => (
                    <div
                      key={step}
                      className={`tracker-step ${idx <= stepIndex ? "done" : ""}`}
                    >
                      <span className="tracker-dot" />
                      <span className="tracker-label">{step}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="cancelled-tag">Cancelled</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
