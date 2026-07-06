import { verifyPiAccessToken } from '../../../lib/pi-server';
import { connectToDatabase } from '../../../lib/mongodb';
import { signToken } from '../../../lib/jwt';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { accessToken } = req.body;
  if (!accessToken) return res.status(400).json({ error: 'accessToken required' });

  try {
    const piUser = await verifyPiAccessToken(accessToken);
    const piUid = piUser?.sub || piUser?.uid || piUser?.user?.uid || piUser?.user?.username || null;

    const { db } = await connectToDatabase(process.env.MONGODB_URI);
    const users = db.collection('users');
    const userDoc = {
      piUid: piUid || `pi:${Date.now()}`,
      piClaims: piUser,
      lastSeen: new Date(),
    };
    await users.updateOne({ piUid: userDoc.piUid }, { $set: userDoc }, { upsert: true });

    const token = signToken({ piUid: userDoc.piUid, role: 'user' });

    res.status(200).json({ token, user: { piUid: userDoc.piUid, piClaims: piUser } });
  } catch (err) {
    console.error('auth verify failed', err?.response?.data || err?.message || err);
    res.status(401).json({ error: 'Failed to verify Pi accessToken' });
  }
}
