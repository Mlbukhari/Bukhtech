import React from "react";
import axios from "axios";

export default function SignInButton({ onSignedIn }) {
  async function handleSignIn() {
    try {
      if (window.Pi && typeof window.Pi.init === "function") {
        try { window.Pi.init({ version: "2.0" }); } catch (e) { }
      }

      if (window.Pi && typeof window.Pi.authenticate === "function") {
        const scopes = ["username", "payments"];
        const sdkResp = await window.Pi.authenticate(scopes);
        const accessToken = sdkResp?.accessToken || sdkResp?.token;
        if (!accessToken) throw new Error("Pi SDK returned no accessToken");

        const verifyResp = await axios.post("/api/auth/verify", { accessToken });
        if (verifyResp.data?.user) {
          onSignedIn && onSignedIn(verifyResp.data.user);
          return;
        } else {
          throw new Error("Server verification failed");
        }
      }

      const challengeResp = await axios.get("/api/auth/challenge");
      const challenge = challengeResp.data;
      const username = prompt("Pi SDK not detected. Enter a demo username:");
      const demoPayload = { payload: { piAddress: username, challenge: challenge.challenge }, signedMessage: "demo", publicKey: "demo" };
      const r = await axios.post("/api/auth/verify", { signedPayload: demoPayload });
      if (r.data?.user) {
        onSignedIn && onSignedIn(r.data.user);
      }
    } catch (err) {
      console.error("sign in failed", err);
      alert("Sign-in failed. See console.");
    }
  }

  return <button onClick={handleSignIn} className="btn">Sign in with Pi</button>;
}
