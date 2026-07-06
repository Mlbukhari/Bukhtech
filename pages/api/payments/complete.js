import { getPayment, completePaymentOnPi } from "../../../lib/pi-server";
import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") return res.status(405).end();
  const paymentId = req.body?.paymentId || req.query.paymentId;
  const orderId = req.body?.orderId || req.query.orderId;
  const txid = req.body?.txid || null;
  if (!paymentId && !orderId) return res.status(400).json({ error: "missing identifiers" });

  try {
    const { db } = await connectToDatabase(process.env.MONGODB_URI);
    const orders = db.collection("orders");
    let order = null;
    if (orderId) {
      order = await orders.findOne({ _id: new ObjectId(orderId) });
    } else {
      order = await orders.findOne({ paymentId });
    }
    if (!order) return res.status(404).json({ error: "order not found" });

    let completeResp = null;
    try {
      completeResp = await completePaymentOnPi(paymentId, txid);
    } catch (err) {
      console.warn("completePaymentOnPi failed (may not be required)", err?.message || err);
    }

    const piPayment = await getPayment(paymentId).catch(() => null);

    const status = (piPayment?.status === "completed" || piPayment?.status === "confirmed") ? "paid" : (piPayment?.status || (completeResp?.status || "unknown"));

    await orders.updateOne({ _id: order._id }, { $set: { paymentStatus: status, piPayment: piPayment || completeResp || null, status, updatedAt: new Date() } });

    res.status(200).json({ ok: true, order: { id: order._id.toString(), status }, piPayment: piPayment || completeResp });
  } catch (err) {
    console.error("complete failed", err);
    res.status(500).json({ error: "complete failed" });
  }
}
