const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
const LANES = 4;
const LANE_WIDTH = W / LANES;
const CAR_WIDTH = 50;
const CAR_HEIGHT = 70;
const ROAD_SPEED = 320;
const DASH_HEIGHT = 28;
const DASH_GAP = 22;
const playerImage = new Image();
playerImage.src = '/images/esponja.png';

const enemyImage = new Image();
enemyImage.src = '/images/epstein.png';

const SPAWN_INTERVAL = 0.8;

let roadOffset = 0;
let spawnTimer = 0;
let gameOver = false;
let score = 0;

const enemies = [];

const player = {
  lane: 1,
  y: H - 80
};

function laneToX(lane) {
  return lane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2;
}

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw &&
         ax + aw > bx &&
         ay < by + bh &&
         ay + ah > by;
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    player.lane = Math.max(0, player.lane - 1);
  }

  if (e.key === 'ArrowRight' || e.key === 'd') {
    player.lane = Math.min(LANES - 1, player.lane + 1);
  }

  if (e.key === ' ' && gameOver) {
    restartGame();
  }
});

function restartGame() {
  enemies.length = 0;
  spawnTimer = 0;
  gameOver = false;
  score = 0;
  player.lane = 1;
}

//para mas rapido
function update(dt) {
  if (gameOver) return;

  // AQUI VA LA DIFICULTAD PROGRESIVA
  roadSpeed = 320 + Math.floor(score / 500) * 500;

  roadOffset = (roadOffset + roadSpeed * dt) % (DASH_HEIGHT + DASH_GAP);

  score += dt * 100;

  spawnTimer -= dt;

  if (spawnTimer <= 0) {
    spawnTimer = SPAWN_INTERVAL;

    enemies.push({
      lane: Math.floor(Math.random() * LANES),
      y: -CAR_HEIGHT
    });
  }

  for (const enemy of enemies) {
    enemy.y += roadSpeed * dt;
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].y > H) {
      enemies.splice(i, 1);
    }
  }

  const px = laneToX(player.lane);

  for (const enemy of enemies) {
    const ex = laneToX(enemy.lane);

    if (
      rectsOverlap(
        px,
        player.y,
        CAR_WIDTH,
        CAR_HEIGHT,
        ex,
        enemy.y,
        CAR_WIDTH,
        CAR_HEIGHT
      )
    ) {
      gameOver = true;
      break;
    }
  }
}

function render() {
  ctx.fillStyle = '#111122';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#3a3a5a';

  for (let lane = 1; lane < LANES; lane++) {
    const x = lane * LANE_WIDTH - 2;

    for (
      let y = -DASH_HEIGHT + roadOffset;
      y < H;
      y += DASH_HEIGHT + DASH_GAP
    ) {
      ctx.fillRect(x, y, 4, DASH_HEIGHT);
    }
  }

  ctx.fillStyle = '#ff66cc';

  for (const enemy of enemies) {
    ctx.fillRect(laneToX(enemy.lane), enemy.y, CAR_WIDTH, CAR_HEIGHT);
  }

  //ctx.fillStyle = '#00ffaa';
  //ctx.fillRect(laneToX(player.lane), player.y, CAR_WIDTH, CAR_HEIGHT);
  ctx.drawImage(
  playerImage,
  laneToX(player.lane),
  player.y,
  CAR_WIDTH,
  CAR_HEIGHT
);

  ctx.fillStyle = '#00ffaa';
  ctx.font = 'bold 16px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('SCORE: ' + Math.floor(score), 10, 24);

  if (gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#ff66cc';
    ctx.font = 'bold 28px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', W / 2, H / 2);

    ctx.fillStyle = '#e0e0ff';
    ctx.font = '14px "Courier New", monospace';
    ctx.fillText('Presiona ESPACIO para reiniciar', W / 2, H / 2 + 20);
  }
}

let lastTime = performance.now();

function loop(now) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  update(dt);
  render();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);