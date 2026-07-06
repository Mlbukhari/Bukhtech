import { connectToDatabase } from "../../../lib/mongodb";
import { requireAuth } from "../../../lib/auth";
import { approvePaymentOnPi } from "../../../lib/pi-server";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const user = requireAuth(req, res);
  if (!user) return;

  const { orderId, paymentId } = req.body;
  if (!orderId || !paymentId) return res.status(400).json({ error: "orderId and paymentId required" });

  try {
    const { db } = await connectToDatabase(process.env.MONGODB_URI);
    const orders = db.collection("orders");
    const order = await orders.findOne({ _id: new ObjectId(orderId) });
    if (!order) return res.status(404).json({ error: "order not found" });

    let piResp = null;
    try {
      piResp = await approvePaymentOnPi(paymentId);
    } catch (err) {
      console.warn("approvePaymentOnPi failed (may not be required)", err?.message || err);
    }

    await orders.updateOne({ _id: order._id }, { $set: { paymentId, paymentApprovedAt: new Date(), piApproval: piResp, status: "approved" } });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "approve failed" });
  }
}
