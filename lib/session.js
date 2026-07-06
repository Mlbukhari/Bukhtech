import cookie from "cookie";

export function setLoginCookie(res, token, opts = {}) {
  const isProd = process.env.NODE_ENV === "production";
  const cookieStr = cookie.serialize("bukhtech_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: opts.maxAge || 60 * 60 * 24 * 7, // 7 days
  });
  res.setHeader("Set-Cookie", cookieStr);
}

export function clearLoginCookie(res) {
  const cookieStr = cookie.serialize("bukhtech_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  res.setHeader("Set-Cookie", cookieStr);
}
