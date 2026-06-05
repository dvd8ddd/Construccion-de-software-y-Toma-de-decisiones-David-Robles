const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let scores = [];

function topScores() {
    return [...scores].sort((a, b) => b.score - a.score).slice(0, 10);
}

app.get("/", (req, res) => {
    res.render("index", { scores: topScores() });
});

app.get("/api/scores", (req, res) => {
    res.json(topScores());
});

app.post("/api/scores", (req, res) => {
    const { name, score } = req.body;

    if (typeof name !== "string" || typeof score !== "number") {
        return res.status(400).json({ error: "Datos invalidos" });
    }

    scores.push({
        name: name.substring(0, 12),
        score: Math.floor(score)
    });

    res.json(topScores());
});

app.listen(PORT, () => {
    console.log(`Highway Dodger en http://localhost:${PORT}`);
});