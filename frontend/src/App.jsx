import { useEffect, useState } from "react";

const API = "https://korona-redbridge.onrender.com";

export default function App() {
  const [players, setPlayers] = useState([]);
  const [m35, setM35] = useState("Ładowanie...");
  const [m45, setM45] = useState("Ładowanie...");

  useEffect(() => {
    fetch(API + "/players")
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(() => setPlayers([]));

    fetch(API + "/last-match/35")
      .then(res => res.json())
      .then(d => setM35(d.match))
      .catch(() => setM35("Brak danych"));

    fetch(API + "/last-match/45")
      .then(res => res.json())
      .then(d => setM45(d.match))
      .catch(() => setM45("Brak danych"));
  }, []);

  return (
    <div style={{ padding: 20, color: "white", background: "black", minHeight: "100vh" }}>
      
      <h1 style={{ color: "red" }}>Korona Redbridge</h1>

      <h2>Ostatni mecz +35</h2>
      <p>{m35}</p>

      <h2>Ostatni mecz +45</h2>
      <p>{m45}</p>

      <h2>Skład</h2>

      {players.length === 0 && <p>Brak zawodników</p>}

      {players.map((p, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <img
            src={API + "/" + p.image}
            width="50"
            style={{ marginRight: 10 }}
          />
          {p.name} - {p.position}
        </div>
      ))}

    </div>
  );
}
