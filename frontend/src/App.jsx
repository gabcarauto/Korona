import { useEffect, useState } from "react";

const API = "https://korona-redbridge.onrender.com";

export default function App() {
  const [matches, setMatches] = useState("Ładowanie...");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API + "/matches")
      .then((res) => res.json())
      .then((data) => {
        setMatches(JSON.stringify(data));
      })
      .catch(() => {
        setError("Błąd pobierania danych");
      });
  }, []);

  return (
    <div style={{ background: "black", color: "white", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ color: "red" }}>Korona Redbridge</h1>
      {error ? <p>{error}</p> : <p>{matches}</p>}
    </div>
  );
}
