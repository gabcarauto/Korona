import { useEffect, useState } from "react";

const API = "https://TWOJ-BACKEND.onrender.com";

export default function App() {
  const [players, setPlayers] = useState([]);
  const [m35, setM35] = useState("");
  const [m45, setM45] = useState("");

  useEffect(() => {
    fetch(API + "/players").then(r => r.json()).then(setPlayers);
    fetch(API + "/last-match/35").then(r => r.json()).then(d => setM35(d.match));
    fetch(API + "/last-match/45").then(r => r.json()).then(d => setM45(d.match));
  }, []);

  return (
    <div style={{ background: "black", color: "red", padding: 20 }}>
      <h1>Korona Redbridge</h1>

      <h2>Ostatni mecz +35</h2>
      <p>{m35}</p>

      <h2>Ostatni mecz +45</h2>
      <p>{m45}</p>

      <h2>Skład</h2>
      {players.map((p, i) => (
        <div key={i}>
          <img src={API + "/" + p.image} width="50" />
          {p.name} - {p.position}
        </div>
      ))}
    </div>
  );
          }
