// ===== IMPORTS =====
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

// ===== CONFIG =====
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

const FA_URLS = {
  veterans35: "https://fulltime.thefa.com/fixtures.html?divisionseason=430198049",
  veterans45: "https://fulltime.thefa.com/fixtures.html?divisionseason=524351727"
};

// ===== APP =====
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ===== DATABASE =====
mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));

// ===== MODELS =====
const Player = mongoose.model("Player", {
  name: String,
  position: String,
  image: String
});

// ===== UPLOAD CONFIG =====
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// ===== CACHE SERVICE =====
const cache = {
  data: {
    veterans35: "Ładowanie...",
    veterans45: "Ładowanie..."
  },
  lastUpdate: null
};

// ===== SCRAPER SERVICE =====
async function fetchLastMatch(url) {
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
    console.error("SCRAPER ERROR:", err.message);
    return "Brak danych (FA offline)";
  }
}

// ===== CACHE UPDATE SERVICE =====
async function refreshCache() {
  try {
    console.log("🔄 Updating FA cache...");

    const [m35, m45] = await Promise.all([
      fetchLastMatch(FA_URLS.veterans35),
      fetchLastMatch(FA_URLS.veterans45)
    ]);

    cache.data.veterans35 = m35;
    cache.data.veterans45 = m45;
    cache.lastUpdate = new Date().toISOString();

    console.log("✅ Cache updated");
  } catch (err) {
    console.error("CACHE ERROR:", err.message);
  }
}

// start cache
refreshCache();
setInterval(refreshCache, 1000 * 60 * 30);

// ===== ROUTES =====

// root
app.get("/", (req, res) => {
  res.send("API działa");
});

// matches (cache)
app.get("/matches", (req, res) => {
  res.json({
    ...cache.data,
    updated: cache.lastUpdate
  });
});

// players
app.get("/players", async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch {
    res.json([]);
  }
});

// add player
app.post("/players", upload.single("image"), async (req, res) => {
  try {
    const player = new Player({
      name: req.body.name,
      position: req.body.position,
      image: req.file?.path
    });

    await player.save();
    res.json(player);
  } catch {
    res.status(500).json({ error: "Błąd zapisu" });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server działa na porcie ${PORT}`);
});
