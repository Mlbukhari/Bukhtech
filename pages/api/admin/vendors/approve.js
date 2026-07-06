import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const adminSecret = req.headers["x-admin-secret"] || req.body?.adminSecret;
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) return res.status(403).json({ error: "forbidden" });

  const { piUid } = req.body;
  if (!piUid) return res.status(400).json({ error: "piUid required" });

  try {
    const { db } = await connectToDatabase(process.env.MONGODB_URI);
    const users = db.collection("users");
    const vendorRequests = db.collection("vendor_requests");

    await users.updateOne({ piUid }, { $set: { role: "vendor", updatedAt: new Date() } }, { upsert: false });
    await vendorRequests.deleteMany({ piUid });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed" });
  }
}
