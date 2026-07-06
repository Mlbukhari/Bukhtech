import React from "react";
import CreatePaymentButton from "../components/CreatePaymentButton";
import SignInButton from "../components/SignInButton";

const products = [
  { id: "prod-1", title: "BukhTech T-Shirt", price: 10 },
  { id: "prod-2", title: "BukhTech Sticker Pack", price: 2 },
];

export default function Home() {
  return (
    <div style={{ padding: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>bukhtech marketplace</h1>
        <div><SignInButton onSignedIn={(u)=>console.log("signed in",u)} /></div>
      </header>

      <main style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 24 }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ddd", padding: 16 }}>
            <h3>{p.title}</h3>
            <p>Price: {p.price} PI</p>
            <CreatePaymentButton product={p} onCreated={(m)=>console.log("order created",m)} />
          </div>
        ))}
      </main>
    </div>
  );
}
