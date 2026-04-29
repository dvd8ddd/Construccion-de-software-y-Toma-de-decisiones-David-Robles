require('dotenv').config();

const express  = require('express');
const path     = require('path');
const { Pool } = require('pg');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5
});

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Hola Mundo — Lab17BDSupabase');
});

app.get('/test_db', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM games LIMIT 20');
        res.json(rows);
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al conectar con la base de datos');
    }
});

app.get('/buscar-inseguro', async (req, res) => {
    const titulo = req.query.titulo || '';
    const sql = `SELECT * FROM games WHERE title ILIKE '%${titulo}%'`;
    const { rows } = await pool.query(sql);
    res.json(rows);
});

app.get('/buscar', async (req, res) => {
    const titulo = req.query.titulo || '';
    const sql = `SELECT * FROM games WHERE title ILIKE $1`;
    const { rows } = await pool.query(sql, [`%${titulo}%`]);
    res.json(rows);
});
app.get("/preguntas", (req, res) => {
    res.render("index");
});

const gameRoutes = require('./routes/game.routes.js');
app.use('/games', gameRoutes);

app.listen(3000, () => {
    console.log('Servidor en http://localhost:3000');
});