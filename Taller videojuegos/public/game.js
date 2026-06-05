const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const H = canvas.height;
const W = canvas.width;

// nuevo 
const personaje = new Image();
personaje.src = "/images/esponja.png";

const musica = new Audio("/audio/crazydave.mp3");
musica.loop = true;
musica.volume = 0.5;

// Configuración
const LANES = 4;
const LANE_WIDTH = W / LANES;
const CAR_WIDTH = 55;
const CAR_HEIGHT = 75;
const DASH_HEIGHT = 28;
const DASH_GAP = 24;

let roadSpeed = 450;

function laneToX(lane){
    return lane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2;
}

const player = {
    lane: 1,
    y: H - 80
};

window.addEventListener("keydown", (e) => {
    if(musica.paused){
        musica.play();
    }

    if(e.key === "ArrowLeft" || e.key === "a"){
        player.lane = Math.max(0, player.lane - 1);
    }

    if(e.key === "ArrowRight" || e.key === "d"){
        player.lane = Math.min(LANES - 1, player.lane + 1);
    }

    if(e.key === " " && gameOver){
        enemies.length = 0;
        spawnTimer = 0;
        gameOver = false;
        score = 0;
        scoreSubmitted = false;
        roadSpeed = 450;
        player.lane = 1;

        musica.currentTime = 0;
        musica.play();
    }
});

let roadOffset = 0;
const enemies = [];
let spawnTimer = 0;
const SPAWN_INTERVAL = 0.6;
let gameOver = false;
let score = 0;
let scoreSubmitted = false;

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh){
    return ax < bx + bw &&
           ax + aw > bx &&
           ay < by + bh &&
           ay + ah > by;
}

function mostrarScores(scores){
    const lista = document.querySelector("#leaderboard ol");

    lista.innerHTML = "";

    if(scores.length === 0){
        lista.innerHTML = `<li class="empty">Sin puntajes aún</li>`;
        return;
    }

    for(const s of scores){
        lista.innerHTML += `
            <li>
                <span class="name">${s.name}</span>
                <span class="score">${s.score}</span>
            </li>
        `;
    }
}

async function guardarScore(){
    if(scoreSubmitted){
        return;
    }

    scoreSubmitted = true;

    let nombre = prompt("Pon tu nombre:", "ANON");

    if(nombre == null || nombre == ""){
        nombre = "ANON";
    }

    try{
        const respuesta = await fetch("/api/scores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: nombre,
                score: Math.floor(score)
            })
        });

        const scores = await respuesta.json();
        mostrarScores(scores);

    } catch(error){
        console.log("Error al guardar score");
    }
}

function update(dt){
    if(gameOver) return;

    score += dt * 100;

    roadSpeed += dt * 2;

    roadOffset = (roadOffset + roadSpeed * dt) % (DASH_HEIGHT + DASH_GAP);

    spawnTimer -= dt;

    if(spawnTimer <= 0){
        spawnTimer = SPAWN_INTERVAL;

        enemies.push({
            lane: Math.floor(Math.random() * LANES),
            y: -CAR_HEIGHT
        });
    }

    for(const e of enemies){
        e.y += roadSpeed * dt;
    }

    for(let i = enemies.length - 1; i >= 0; i--){
        if(enemies[i].y > H){
            enemies.splice(i, 1);
        }
    }

    const px = laneToX(player.lane);

    for(const e of enemies){
        const ex = laneToX(e.lane);

        if(rectsOverlap(px, player.y, CAR_WIDTH, CAR_HEIGHT, ex, e.y, CAR_WIDTH, CAR_HEIGHT)){
            gameOver = true;
            musica.pause();
            guardarScore();
            break;
        }
    }
}

function render(){
    ctx.fillStyle = "#111122";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#3a3a5a";

    for(let lane = 1; lane < LANES; lane++){
        const x = lane * LANE_WIDTH - 2;

        for(let y = -DASH_HEIGHT + roadOffset; y < H; y += DASH_HEIGHT + DASH_GAP){
            ctx.fillRect(x, y, 4, DASH_HEIGHT);
        }
    }

    ctx.fillStyle = "#ff66cc";

    for(const e of enemies){
        ctx.fillRect(laneToX(e.lane), e.y, CAR_WIDTH, CAR_HEIGHT);
    }

    if(personaje.complete){
        ctx.drawImage(personaje, laneToX(player.lane), player.y, CAR_WIDTH, CAR_HEIGHT);
    }else{
        ctx.fillStyle = "#00ffaa";
        ctx.fillRect(laneToX(player.lane), player.y, CAR_WIDTH, CAR_HEIGHT);
    }

    ctx.fillStyle = "#00ffaa";
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.textAlign = "left";
    ctx.fillText("SCORE: " + Math.floor(score), 10, 24);

    ctx.fillStyle = "#888";
    ctx.font = '12px "Courier New", monospace';
    ctx.textAlign = "right";
    ctx.fillText("SPEED: " + Math.floor(roadSpeed), W - 10, 24);

    if(gameOver){
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = "#ff66cc";
        ctx.font = 'bold 28px "Courier New", monospace';
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", W / 2, H / 2 - 10);

        ctx.fillStyle = "#e0e0ff";
        ctx.font = '14px "Courier New", monospace';
        ctx.fillText("Presiona ESPACIO para reiniciar", W / 2, H / 2 + 20);
    }
}

let lastTime = performance.now();

function loop(now){
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    update(dt);
    render();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);