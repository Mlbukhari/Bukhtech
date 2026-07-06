import { connectToDatabase } from "../../../lib/mongodb";
import { requireVendor } from "../../../lib/auth";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;
  if (!id) return res.status(400).json({ error: "id required" });

  const { db } = await connectToDatabase(process.env.MONGODB_URI);
  const products = db.collection("products");
  const prodId = new ObjectId(id);

  if (method === "GET") {
    const product = await products.findOne({ _id: prodId });
    if (!product) return res.status(404).json({ error: "not found" });
    return res.status(200).json({ product });
  }

  const user = requireVendor(req, res);
  if (!user) return;

  const product = await products.findOne({ _id: prodId });
  if (!product) return res.status(404).json({ error: "not found" });
  if (product.vendorId !== (user.piUid || user.piKey)) return res.status(403).json({ error: "forbidden" });

  if (method === "PUT") {
    const { title, description, price, currency, metadata } = req.body;
    const update = { updatedAt: new Date() };
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (price !== undefined) update.price = price;
    if (currency !== undefined) update.currency = currency;
    if (metadata !== undefined) update.metadata = metadata;

    await products.updateOne({ _id: prodId }, { $set: update });
    return res.status(200).json({ ok: true });
  }

  if (method === "DELETE") {
    await products.deleteOne({ _id: prodId });
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${method} Not Allowed`);
}
