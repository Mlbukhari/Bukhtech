import React from "react";
import axios from "axios";

export default function CreatePaymentButton({ product, onCreated }) {
  async function handlePurchase() {
    try {
      const token = localStorage.getItem("bukhtech_token");
      if (!token) return alert("Please sign in first.");

      const resp = await axios.post("/api/payments/create", { productId: product.id, amount: product.price }, { headers: { Authorization: `Bearer ${token}` } });
      const { orderId } = resp.data;
      if (!orderId) throw new Error("Order creation failed");

      if (window.Pi && typeof window.Pi.createPayment === "function") {
        const paymentOptions = {
          amount: product.price,
          memo: `Purchase ${product.id} on bukhtech`,
          metadata: { orderId: orderId.toString(), productId: product.id },
        };

        await window.Pi.createPayment(paymentOptions, {
          onReadyForServerApproval: async (paymentId) => {
            try {
              await axios.post("/api/payments/approve", { orderId, paymentId }, { headers: { Authorization: `Bearer ${token}` } });
            } catch (err) {
              console.error("server approve failed", err);
            }
          },
          onReadyForServerCompletion: async (paymentId, txid) => {
            try {
              await axios.post("/api/payments/complete", { orderId, paymentId, txid }, { headers: { Authorization: `Bearer ${token}` } });
            } catch (err) {
              console.error("server completion failed", err);
            }
          },
          onCancel: (paymentId) => {
            console.log("payment canceled", paymentId);
          },
          onError: (err, payment) => {
            console.error("payment error", err, payment);
          }
        });

        onCreated && onCreated({ orderId });
        return;
      }

      alert("Open this site in Pi Browser to complete the payment. Order created: " + orderId);
      onCreated && onCreated({ orderId });
    } catch (err) {
      console.error("payment create error", err);
      alert("Payment creation failed.");
    }
  }

  return <button onClick={handlePurchase} className="btn btn-primary">Buy</button>;
}
