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
        setError("Nie udało się pobrać danych");
      });
  }, []);

  return (
  <div style={{ background: "black", color: "white", minHeight: "100vh", padding: 20 }}>
    <h1>TEST KORONA</h1>

    <p>m35: {String(m35)}</p>
    <p>m45: {String(m45)}</p>

    <p>players: {Array.isArray(players) ? players.length : "not array"}</p>
    <p>error: {error || "brak"}</p>
  </div>
);

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
    width: "300px"
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
