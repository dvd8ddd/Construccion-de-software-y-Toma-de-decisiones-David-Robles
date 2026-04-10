//let log= console.log;
//log("Hola Mundo");

//fs es el modulo que contiene las funciones para manipular el sistema de archivos

//const fs= require("fs");

//crear un archivo con la clase writeFileSync
/*fs.writeFileSync("archivo.txt", "Hola Mundo");

//Async sort
const arreglo = [500,60,90,100,10,20,10000,0,1];
for (let item of arreglo){
    setTimeout(()=>{
        log(item);
    }, item);
}*/

//log("Hola");
//setTimeout(() => {
//    log("Mundo");
//}, 2000);

//log("Adios");


//NOTA: las etiquetas `javascript` y `style` de momento no funcionarán
let log = console.log;

const http = require('http');

const server = http.createServer((req, res) => {
    log(req.url);

    res.setHeader("Content-Type", "text/html");

    res.write(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>HTML</title>
</head>
<body>

    <p id="par1">David Alejandro Robles Camacho A01277315</p>

    <div id="par2">
        <p>Este texto es parte de un codigo de HTML</p>
    </div>

    <script>
        let log = console.log;

        /* Función getElementById */
        let variablePar = document.getElementById("par2");
        log(variablePar.innerHTML);
    </script>

</body>
</html>
    `);

    res.end();
});

server.listen(4141, () => {
    log("Mi servidor está vivo corriendo en el puerto 4141");
});