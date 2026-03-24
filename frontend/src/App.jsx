import { useEffect, useState } from "react";

const API = "https://korona-redbridge.onrender.com";

export default function App() {
  const [players, setPlayers] = useState([]);
  const [m35, setM35] = useState("Ładowanie...");
  const [m45, setM45] = useState("Ładowanie...");

  useEffect(() => {
    // players
    fetch(API + "/players")
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(() => setPlayers([]));

    // matches (cache)
    fetch(API + "/matches")
      .then(res => res.json())
      .then(data => {
        setM35(data.veterans35);
        setM45(data.veterans45);
      })
      .catch(() => {
        setM35("Brak danych");
        setM45("Brak danych");
      });
  }, []);

  return (
    <div style={styles.page}>
      
      {/* HEADER */}
      <h1 style={styles.title}>Korona Redbridge</h1>

      {/* MATCHES */}
      <div style={styles.matchesWrapper}>
        
        {/* +35 */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Veterans +35</h2>
          <p>{m35}</p>
        </div>

        {/* +45 */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Veterans +45</h2>
          <p>{m45}</p>
        </div>

      </div>

      {/* PLAYERS */}
      <h2 style={styles.section}>Skład drużyny</h2>

      <div style={styles.playersGrid}>
        {players.length === 0 && <p>Brak zawodników</p>}

        {players.map((p, i) => (
          <div key={i} style={styles.playerCard}>
            <img
              src={API + "/" + p.image}
              alt={p.name}
              style={styles.playerImg}
            />
            <div>
              <strong>{p.name}</strong>
              <p>{p.position}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// ===== STYLES =====
const styles = {
  page: {
    background: "#0b0b0b",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial"
  },
  title: {
    color: "#e10600",
    textAlign: "center",
    marginBottom: "30px"
  },
  matchesWrapper: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  card: {
    background: "#1a1a1a",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    boxShadow: "0 0 10px rgba(255,0,0,0.3)"
  },
  cardTitle: {
    color: "#ff2a2a"
  },
  section: {
    marginTop: "40px",
    marginBottom: "20px",
    color: "#ff2a2a"
  },
  playersGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px"
  },
  playerCard: {
    background: "#1a1a1a",
    padding: "10px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "250px"
  },
  playerImg: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "50%"
  }
};
