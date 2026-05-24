const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;
const log = console.log;
const controller = require("./index.controller.js");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Crear carpeta private automáticamente
fs.mkdirSync('./private', { recursive: true });

// Rutas
app.post('/upload_file', controller.upload_file);
app.post('/upload_file_private', controller.upload_file_private);
app.get('/get_private_file/:file', controller.get_private_file);
app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});