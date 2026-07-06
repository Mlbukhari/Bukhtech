import { verifyToken } from "./jwt";

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

export function requireVendor(req, res) {
  const user = requireAuth(req, res);
  if (!user) return null;
  if (user.role !== "vendor") {
    res.status(403).json({ error: "Forbidden: vendor role required" });
    return null;
  }
  return user;
}
