import { connectToDatabase } from "../../../lib/mongodb";
import { requireVendor } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const vendor = await requireVendor(req, res);
  if (!vendor) return;

  const { limit = 50, skip = 0 } = req.query;

  try {
    const { db } = await connectToDatabase(process.env.MONGODB_URI);
    const products = db.collection("products");
    const orders = db.collection("orders");

    const vendorProducts = await products.find({ vendorId: vendor.piUid }).toArray();
    const productIds = vendorProducts.map((p) => p._id.toString());

    const found = await orders
      .find({ productId: { $in: productIds } })
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .toArray();

    return res.status(200).json({ orders: found });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed" });
  }
}
