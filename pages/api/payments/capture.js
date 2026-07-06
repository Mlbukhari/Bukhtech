import { connectToDatabase } from "../../../lib/mongodb";
import { requireVendor } from "../../../lib/auth";
import { capturePayment } from "../../../lib/pi-server";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const vendor = requireVendor(req, res);
  if (!vendor) return;

  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: "orderId required" });

  try {
    const { db } = await connectToDatabase(process.env.MONGODB_URI);
    const orders = db.collection("orders");
    const products = db.collection("products");

    const order = await orders.findOne({ _id: new ObjectId(orderId) });
    if (!order) return res.status(404).json({ error: "order not found" });

    const product = await products.findOne({ _id: new ObjectId(order.productId) });
    if (!product) return res.status(404).json({ error: "product not found" });
    if (product.vendorId !== vendor.piKey) return res.status(403).json({ error: "forbidden" });

    if (!order.paymentId) return res.status(400).json({ error: "no paymentId on order" });

    const captureResp = await capturePayment(order.paymentId);

    await orders.updateOne({ _id: order._id }, { $set: { capture: captureResp, status: "captured", updatedAt: new Date() } });

    return res.status(200).json({ ok: true, capture: captureResp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "capture failed" });
  }
}
