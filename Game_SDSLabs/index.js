const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const backgroundMusic = document.getElementById("backgroundMusic");
const catchSound = document.getElementById("catchSound");

let basket = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 60,
  width: 100,
  height: 20,
  color: "#ffcc00",
  moveLeft: false,
  moveRight: false,
};

let stars = [];
let score = 0;
let gameRunning = false;

function createStar() {
  const x = Math.random() * (canvas.width - 20);
  stars.push({ x, y: 0, radius: 10, speed: Math.random() * 2 + 2 });
}

function drawBasket() {
  ctx.fillStyle = basket.color;
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawStars() {
  stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  });
}

function updateStars() {
  stars.forEach((star, index) => {
    star.y += star.speed;

    if (
      star.x > basket.x &&
      star.x < basket.x + basket.width &&
      star.y + star.radius > basket.y
    ) {
      catchSound.play();
      score++;
      stars.splice(index, 1);
    }

    if (star.y > canvas.height) {
      stars.splice(index, 1);
    }
  });
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function updateBasket() {
  if (basket.moveLeft && basket.x > 0) {
    basket.x -= 5;
  }
  if (basket.moveRight && basket.x + basket.width < canvas.width) {
    basket.x += 5;
  }
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBasket();
  drawStars();
  drawScore();

  updateBasket();
  updateStars();

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") basket.moveLeft = true;
  if (e.key === "ArrowRight") basket.moveRight = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") basket.moveLeft = false;
  if (e.key === "ArrowRight") basket.moveRight = false;
});

function startGame() {
  gameRunning = true;
  score = 0;
  stars = [];
  backgroundMusic.play();
  document.getElementById("menu").style.display = "none";
  setInterval(createStar, 1000);
  gameLoop();
}

document.getElementById("startButton").addEventListener("click", startGame);
