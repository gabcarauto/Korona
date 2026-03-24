let cache = {
  "35": null,
  "45": null,
  lastUpdate: 0
};
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ===== DATABASE =====
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("Mongo error:", err);
  });
  .then(() => console.log("MongoDB connected"));

// ===== MODELS =====
const Player = mongoose.model("Player", {
  name: String,
  position: String,
  image: String
});

// ===== UPLOAD =====
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// ===== PLAYERS =====
app.get("/players", async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.json([]);
  }
});

app.get("/matches", (req, res) => {
  res.json({
    veterans35: cache["35"] || "Ładowanie...",
    veterans45: cache["45"] || "Ładowanie...",
    updated: cache.lastUpdate
  });
});

// ===== FA SCRAPER =====
async function getLastMatch(url) {
  try {
    const { data } = await axios.get(url, {
      timeout: 5000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(data);
    let match = null;

    $("tr").each((i, el) => {
      const text = $(el).text();

      if (text.includes("Korona Redbridge") && text.match(/\d+\s*-\s*\d+/)) {
        match = text.trim();
        return false;
      }
    });

    return match || "Brak danych";
  } catch (err) {
    console.error("FA SCRAPER ERROR:", err.message);
    return "Brak danych (FA offline)";
  }
}

app.get("/last-match/35", async (req, res) => {
  const match = await getLastMatch("https://fulltime.thefa.com/fixtures.html?divisionseason=430198049");
  res.json({ match });
});

app.get("/last-match/45", async (req, res) => {
  const match = await getLastMatch("https://fulltime.thefa.com/fixtures.html?divisionseason=524351727");
  res.json({ match });
});

async function updateCache() {
  console.log("Odświeżam dane FA...");

  cache["35"] = await getLastMatch("https://fulltime.thefa.com/fixtures.html?divisionseason=430198049");
  cache["45"] = await getLastMatch("https://fulltime.thefa.com/fixtures.html?divisionseason=524351727");
  cache.lastUpdate = Date.now();
}

setInterval(updateCache, 1000 * 60 * 30);
updateCache();

app.listen(5000, () => console.log("Server działa"));

app.get("/", (req, res) => {
  res.send("API działa");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server działa"));
