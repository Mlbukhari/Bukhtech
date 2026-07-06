import { connectToDatabase } from "../../../lib/mongodb";
import { requireAuth } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const user = requireAuth(req, res);
  if (!user) return;

  try {
    const { db } = await connectToDatabase(process.env.MONGODB_URI);
    const users = db.collection("users");
    const vendorRequests = db.collection("vendor_requests");

    const existingRequest = await vendorRequests.findOne({ piUid: user.piUid });
    if (existingRequest) return res.status(400).json({ error: "request already pending" });

    await vendorRequests.insertOne({ piUid: user.piUid, status: "pending", createdAt: new Date() });
    return res.status(200).json({ ok: true, message: "Vendor request submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed" });
  }
}
