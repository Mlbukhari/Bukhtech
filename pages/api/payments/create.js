import { connectToDatabase } from "../../../lib/mongodb";
import { requireAuth } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const user = requireAuth(req, res);
  if (!user) return;

  const { productId, amount, currency = "PI" } = req.body;
  if (!productId || !amount) return res.status(400).json({ error: "productId and amount required" });

  try {
    const { db } = await connectToDatabase(process.env.MONGODB_URI);
    const orders = db.collection("orders");
    const orderDoc = {
      productId,
      amount,
      currency,
      buyer: user.piUid || user.piKey || null,
      status: "pending",
      createdAt: new Date(),
      metadata: {},
    };
    const { insertedId } = await orders.insertOne(orderDoc);

    res.status(200).json({ orderId: insertedId.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "payment creation failed" });
  }
}
