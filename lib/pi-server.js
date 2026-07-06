import axios from "axios";
import jwt from "jsonwebtoken";

const PI_APP_SECRET = process.env.PI_APP_SECRET;
const PI_API_BASE = process.env.PI_API_BASE || (process.env.PI_ENV === "mainnet" ? "https://api.minepi.com" : "https://api.testnet.minepi.com");

export async function verifyPiAccessToken(accessToken) {
  if (!accessToken) throw new Error("accessToken required");
  const url = `${PI_API_BASE}/v2/me`;
  const headers = { Authorization: `Bearer ${accessToken}` };
  const resp = await axios.get(url, { headers });
  return resp.data;
}

export async function getPayment(paymentId) {
  if (!PI_APP_SECRET) throw new Error("PI_APP_SECRET not configured");
  const url = `${PI_API_BASE}/v2/payments/${paymentId}`;
  const headers = { Authorization: `Bearer ${PI_APP_SECRET}` };
  const resp = await axios.get(url, { headers });
  return resp.data;
}

export async function approvePaymentOnPi(paymentId) {
  if (!PI_APP_SECRET) throw new Error("PI_APP_SECRET not configured");
  const url = `${PI_API_BASE}/v2/payments/${paymentId}/approve`;
  const headers = { Authorization: `Bearer ${PI_APP_SECRET}`, "Content-Type": "application/json" };
  const resp = await axios.post(url, {}, { headers });
  return resp.data;
}

export async function completePaymentOnPi(paymentId, txid = null) {
  if (!PI_APP_SECRET) throw new Error("PI_APP_SECRET not configured");
  const url = `${PI_API_BASE}/v2/payments/${paymentId}/complete`;
  const headers = { Authorization: `Bearer ${PI_APP_SECRET}`, "Content-Type": "application/json" };
  const body = txid ? { txid } : {};
  const resp = await axios.post(url, body, { headers });
  return resp.data;
}
