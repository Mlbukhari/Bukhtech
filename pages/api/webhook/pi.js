import { connectToDatabase } from "../../../lib/mongodb";
import crypto from "crypto";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const secret = process.env.PI_WEBHOOK_SECRET;
  const signatureHeader = req.headers["x-pi-signature"] || req.headers["x-signature"] || req.headers["signature"];

  try {
    const raw = await getRawBody(req);
    const rawText = raw.toString("utf8");

    if (secret) {
      const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
      const got = signatureHeader || "";
      const normalizedGot = got.startsWith("sha256=") ? got.split("=")[1] : got;
      if (!normalizedGot || normalizedGot !== expected) {
        console.warn("webhook signature mismatch", { got: signatureHeader, expected });
        return res.status(401).json({ error: "invalid signature" });
      }
    }

    let event;
    try {
      event = JSON.parse(rawText);
    } catch (err) {
      console.error("invalid json", err);
      return res.status(400).json({ error: "invalid json" });
    }

    const paymentId = event?.data?.id || event?.paymentId || event?.id;
    if (!paymentId) {
      console.warn("webhook missing payment id", event);
      return res.status(400).json({ error: "missing payment id" });
    }

    const { db } = await connectToDatabase(process.env.MONGODB_URI);
    const orders = db.collection("orders");
    await orders.updateOne({ paymentId }, { $set: { piPayment: event.data || event, paymentStatus: event.data?.status || event.status, updatedAt: new Date() } });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("webhook processing failed", err);
    res.status(500).json({ error: "webhook processing failed" });
  }
}
