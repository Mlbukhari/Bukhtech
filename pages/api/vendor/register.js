import { connectToDatabase } from "../../../lib/mongodb";
import { requireAuth } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const user = requireAuth(req, res);
  if (!user) return;

  try {
    const { db } = await connectToDatabase(process.env.MONGODB_URI);
    const users = db.collection("users");
    await users.updateOne({ piUid: user.piUid }, { $set: { role: "vendor", updatedAt: new Date() } }, { upsert: true });

    res.status(200).json({ ok: true, message: "Vendor role granted (self-service). In production use admin approval." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed" });
  }
}
