import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <div style={{ background: "black", color: "white", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ color: "red" }}>Korona Redbridge TEST REACT</h1>
      <p>Jeśli to widzisz, React działa poprawnie.</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
