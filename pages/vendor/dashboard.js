import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("bukhtech_token");
      if (!token) return;
      const resp = await axios.get("/api/vendor/orders", { headers: { Authorization: `Bearer ${token}` } });
      setOrders(resp.data.orders || []);
    }
    load();
  }, []);

  async function approve(orderId) {
    const token = localStorage.getItem("bukhtech_token");
    await axios.post("/api/payments/approve", { orderId }, { headers: { Authorization: `Bearer ${token}` } });
    setOrders((o) => o.map(ord => ord._id === orderId ? { ...ord, status: "vendor_approved" } : ord));
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Vendor Dashboard</h2>
      <div>
        {orders.length === 0 && <p>No orders yet</p>}
        {orders.map(o => (
          <div key={o._id} style={{ borderBottom: "1px solid #eee", padding: 8 }}>
            <div>Order: {o._id}</div>
            <div>Product: {o.productId}</div>
            <div>Amount: {o.amount} {o.currency}</div>
            <div>Status: {o.status}</div>
            {o.status !== "vendor_approved" && <button onClick={() => approve(o._id)}>Approve / Mark Shipped</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
