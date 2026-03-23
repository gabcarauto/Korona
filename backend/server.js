
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
  res.json(await Player.find());
});

app.post("/players", upload.single("image"), async (req, res) => {
  const player = new Player({
    name: req.body.name,
    position: req.body.position,
    image: req.file.path
  });
  await player.save();
  res.json(player);
});

// ===== FA SCRAPER =====
async function getLastMatch(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  let match = null;

  $("tr").each((i, el) => {
    const text = $(el).text();
    if (text.includes("Korona Redbridge") && text.match(/\d+-\d+/)) {
      match = text.trim();
      return false;
    }
  });

  return match;
}

app.get("/last-match/35", async (req, res) => {
  const match = await getLastMatch("https://fulltime.thefa.com/fixtures.html?divisionseason=430198049");
  res.json({ match });
});

app.get("/last-match/45", async (req, res) => {
  const match = await getLastMatch("https://fulltime.thefa.com/fixtures.html?divisionseason=524351727");
  res.json({ match });
});

app.listen(5000, () => console.log("Server działa"));
