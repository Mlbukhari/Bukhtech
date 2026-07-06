import { createAuthChallenge } from "../../../lib/pi-server";

export default async function handler(req, res) {
  const payload = { challenge: `bukhtech-challenge:${Date.now()}`, appId: process.env.PI_APP_ID || "" };
  res.status(200).json(payload);
}
