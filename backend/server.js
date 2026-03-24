const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ===== DATABASE =====
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));

// ===== MODEL =====
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

// ===== API: PLAYERS =====
app.get("/players", async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.json([]);
  }
});

app.post("/players", upload.single("image"), async (req, res) => {
  try {
    const player = new Player({
      name: req.body.name,
      position: req.body.position,
      image: req.file?.path
    });
    await player.save();
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: "Błąd zapisu zawodnika" });
  }
});

// ===== CACHE =====
let cache = {
  veterans35: "Ładowanie...",
  veterans45: "Ładowanie...",
  lastUpdate: null
};

// ===== SCRAPER =====
async function getLastMatch(url) {
  try {
    const { data } = await axios.get(url, {
      timeout: 5000,
      headers: { "User-Agent": "Mozilla/5.0" }
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

// ===== CACHE UPDATE =====
async function updateCache() {
  try {
    console.log("Odświeżam dane FA...");

    cache.veterans35 = await getLastMatch(
      "https://fulltime.thefa.com/fixtures.html?divisionseason=430198049"
    );

    cache.veterans45 = await getLastMatch(
      "https://fulltime.thefa.com/fixtures.html?divisionseason=524351727"
    );

    cache.lastUpdate = new Date().toISOString();

    console.log("Cache OK");
  } catch (err) {
    console.error("CACHE ERROR:", err.message);
  }
}

// start cache
updateCache();
setInterval(updateCache, 1000 * 60 * 30); // co 30 min

// ===== API: MATCHES =====
app.get("/matches", (req, res) => {
  res.json({
    veterans35: cache.veterans35,
    veterans45: cache.veterans45,
    updated: cache.lastUpdate
  });
});

// ===== TEST ROOT =====
app.get("/", (req, res) => {
  res.send("API działa");
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server działa na porcie " + PORT);
});
