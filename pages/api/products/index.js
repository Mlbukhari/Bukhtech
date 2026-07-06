import { connectToDatabase } from "../../../lib/mongodb";
import { requireVendor, getUserFromReq } from "../../../lib/auth";

export default async function handler(req, res) {
  const { method } = req;
  const { db } = await connectToDatabase(process.env.MONGODB_URI);
  const products = db.collection("products");

  if (method === "GET") {
    const all = await products.find({}).sort({ createdAt: -1 }).toArray();
    return res.status(200).json({ products: all });
  }

  if (method === "POST") {
    const user = requireVendor(req, res);
    if (!user) return;

    const { title, description, price, currency = "PI", metadata = {} } = req.body;
    if (!title || !price) return res.status(400).json({ error: "title and price required" });

    const doc = {
      title,
      description: description || "",
      price,
      currency,
      metadata,
      vendorId: user.piUid || user.piKey,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await products.insertOne(doc);
    return res.status(201).json({ productId: result.insertedId, product: doc });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${method} Not Allowed`);
}
