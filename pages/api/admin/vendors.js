import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const { db } = await connectToDatabase(process.env.MONGODB_URI);
  const vendorRequests = db.collection("vendor_requests");

  try {
    const list = await vendorRequests.find({}).sort({ createdAt: -1 }).toArray();
    return res.status(200).json({ requests: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed" });
  }
}
