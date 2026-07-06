import { verifyToken } from "./jwt";
import { connectToDatabase } from "./mongodb";

export function getUserFromReq(req) {
  const authHeader = req.headers?.authorization;
  let token = authHeader?.split(" ")[1];

  if (!token && req.headers?.cookie) {
    const cookies = Object.fromEntries(
      req.headers.cookie.split(";").map((c) => {
        const [k, ...v] = c.split("=");
        return [k.trim(), decodeURIComponent(v.join("="))];
      })
    );
    token = cookies["bukhtech_token"];
  }

  if (!token) return null;
  const user = verifyToken(token);
  return user;
}

export function requireAuth(req, res) {
  const user = getUserFromReq(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return user;
}

export async function requireVendor(req, res) {
  const user = getUserFromReq(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  try {
    const { db } = await connectToDatabase(process.env.MONGODB_URI);
    const users = db.collection("users");
    const dbUser = await users.findOne({ piUid: user.piUid });
    if (!dbUser || dbUser.role !== "vendor") {
      res.status(403).json({ error: "Forbidden: vendor role required" });
      return null;
    }
    // merge DB user data into token user
    return { ...user, ...dbUser };
  } catch (err) {
    console.error("requireVendor error", err);
    res.status(500).json({ error: "server error" });
    return null;
  }
}
