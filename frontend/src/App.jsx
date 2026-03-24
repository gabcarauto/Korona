import { useEffect, useState } from "react";

const API = "https://korona-redbridge.onrender.com";

export default function App() {
  const [players, setPlayers] = useState([]);
  const [m35, setM35] = useState("Ładowanie...");
  const [m45, setM45] = useState("Ładowanie...");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API + "/players")
      .then(async (res) => {
        const data = await res.json();
        setPlayers(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setPlayers([]);
      });

    fetch(API + "/matches")
      .then(async (res) => {
        const data = await res.json();
        setM35(data?.veterans35 || "Brak danych");
        setM45(data?.veterans45 || "Brak danych");
      })
      .catch(() => {
        setM35("Brak danych");
        setM45("Brak danych");
        setError("Nie udało się pobrać danych z API");
      });
  }, []);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Korona Redbridge</h1>

      {error ? <p style={styles.error}>{error}</p> : null}

      <div style={styles.matchesWrapper}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Veterans +35</h2>
          <p>{m35}</p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Veterans +45</h2>
          <p>{m45}</p>
        </div>
      </div>

      <h2 style={styles.section}>Skład drużyny</h2>

      <div style={styles.playersGrid}>
        {players.length === 0 ? (
          <p>Brak zawodników</p>
        ) : (
          players.map((p, i) => (
            <div key={i} style={styles.playerCard}>
              {p?.image ? (
                <img
                  src={API + "/" + p.image}
                  alt={p?.name || "Zawodnik"}
                  style={styles.playerImg}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : null}

              <div>
                <strong>{p?.name || "Brak nazwy"}</strong>
                <p>{p?.position || "Brak pozycji"}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

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
  error: {
    color: "#ff8080",
    textAlign: "center",
    marginBottom: "20px"
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
