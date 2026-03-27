import { useEffect, useState } from "react";

const API = "https://korona-redbridge.onrender.com";

export default function App() {
  const [data, setData] = useState("Ładowanie...");

  useEffect(() => {
    fetch(API + "/matches")
      .then(res => res.json())
      .then(d => {
        setData(JSON.stringify(d));
      })
      .catch(() => {
        setData("Błąd pobierania");
      });
  }, []);

  return (
    <div style={{ background: "black", color: "white", minHeight: "100vh", padding: 20 }}>
      <h1>Korona Redbridge TEST</h1>
      <p>{data}</p>
    </div>
  );
}
