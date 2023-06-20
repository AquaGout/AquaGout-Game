import Swal from "sweetalert2";

// BOTON RETURN HOME.
const returnButton = document.getElementById("returnButton");

// BOTON RESTART GAME
const restartButton = document.getElementById("restartButton");

let previousGameState = null; // Crear variable para el juego antes de darle al botón reiniciar.

function restartGame() {
  gameOver = false;
  isPaused = true;
  player.angle = 0;
  player.frameX = 0;
  pauseAnimations() 


  // Almacenar el estado actual del juego
  previousGameState = {
    bubbles: [...bubblesArray],
    images: [...imagesArray],
    playerX: player.x,
    playerY: player.y,
    playerAngle: player.angle,
    playerFrameX: player.frameX,
    currentScore: score
    
  };

  Swal.fire({
    title: "Do you want to restart the game?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Restart game",
    cancelButtonText: "Continue game"
  }).then((result) => {
    if (result.isConfirmed) {
      // El usuario desea volver a jugar
      location.reload();

    } else {
      // Continuar el juego
      isPaused = false;
      resumeAnimations();
      animate();
      // Iniciar el bucle del juego
    }
    if (previousGameState) {
      bubblesArray = [...previousGameState.bubbles];
      imagesArray = [...previousGameState.images];
      player.angle = previousGameState.playerAngle;
      player.frameX = previousGameState.playerFrameX;
      score = previousGameState.currentScore;
      scoreElement.textContent = "Bubble Pop Points: " + score;
    }
  });
};

function gameLoop() {
  if (!isPaused) {
    clearCanvas();
    handleBubbles();
    handleImages();
    handlePlayer();
    handleScore();
    gameFrame++;
  }

  requestAnimationFrame(gameLoop);
}

restartButton.addEventListener("click", restartGame);

window.addEventListener("DOMContentLoaded", () => {
  if (previousGameState) {
    isPaused = false;
    player.x = previousGameState.playerX;
    player.y = previousGameState.playerY;
    player.angle = previousGameState.playerAngle;
    player.frameX = previousGameState.playerFrameX;
    score = previousGameState.currentScore;
    scoreElement.textContent = "Score: " + score;
    gameLoop();
  }
});
//BOTON AUDIO

  // BOTON AUDIO.
  const audio = new Audio("/AquaGout-Game/assets/audio/soundtrack.mp3");
  const soundButton = document.getElementById("soundButton");
  soundButton.addEventListener("click", function () {
    if (soundButton.classList.contains("soundButton")) {
      soundButton.classList.remove("soundButton");
      soundButton.classList.add("soundButtonTwo");
      audio.play(); // Reproducir el audio
    } else {
      soundButton.classList.remove("soundButtonTwo");
      soundButton.classList.add("soundButton");
      audio.pause();
    }
  });


// Enlazamos Score
returnButton.addEventListener("click", function () {
  location.href = "https://aquagout.github.io/AquaGoat/";
});

const scoreElement = document.querySelector(".score");
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 1350;
canvas.height = 1670;
let score = 0;
let gameFrame = 0;
let gameOver = false;
let isPaused = false;

const background = new Image();
background.src = "assets/images/background-fishes.svg";

// Mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false
};

// Imágenes
const leftImg = new Image();
leftImg.src = "assets/images/left-rocks.png";
const rightImg = new Image();
rightImg.src = "assets/images/right-rocks.png";

// Player
const playerImg = new Image();
playerImg.src = "assets/icons/swimming-cabriella.png";

class Player {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 10;
    this.radius = 60;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.maxY = canvas.height * 0.95;
    this.spriteWidth = 6500;
    this.spriteHeight = 500;
    
  }

  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    if (mouse.x != this.x) {
      this.x -= dx / 20;
      this.moving = true;
    }
    if (mouse.y != this.y) {
      this.y -= dy / 20;
      this.moving = true;
    }
    if (this.x < 0) this.x = 0;
    if (this.x > canvas.width) this.x = canvas.width;
    if (this.y < 50) this.y = 50;
    if (this.y > canvas.height) this.y = canvas.height;
    if (this.y > this.maxY) this.y = this.maxY;
    const theta = Math.atan2(dy, dx);
    this.angle = theta;
    if (this.checkCollision()) {
      gameOver = true;
      
    }
  }

  draw() {
    ctx.fillStyle = "black";
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(
      playerImg,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      0 - 60,
      0 - 45,
      this.spriteWidth * 0.7,
      this.spriteHeight * 0.7
    );
    ctx.restore();
  };

  checkCollision() {
    for (let i = 0; i < imagesArray.length; i++) {
      const image = imagesArray[i];
      const dx = this.x - image.x;
      const dy = this.y - image.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.radius + image.width / 2) {
        gameOver = true;
         // Establecer gameOver a true si se produce una colisión
      }
    }

    return false; // No se ha producido ninguna colisión
  }
}

const player = new Player();

// Bubbles
const bubblesArray = [];
const bubble = new Image();
bubble.src = "https://i.ibb.co/ZX3thkw/pop2.png";
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.radius = 80;
    this.speed = 3; // Cambia el valor inicial de "this.speed" a un valor positivo
    this.distance;
    this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";
    this.counted = false;
    this.frameX = 0;
    this.spriteWidth = 91;
    this.spriteHeight = 91;
    this.pop = false;
    this.counted = false;
  }

  update() {
    this.y -= this.speed;

    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);

    if (this.distance < this.radius + player.radius) {
      popAndRemove(this);
    }
  }

  draw() {
    ctx.drawImage(
      bubble,
      this.frameX * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x - this.spriteWidth * 0.375,
      this.y - this.spriteHeight * 0.375,
      this.spriteWidth * 0.75,
      this.spriteHeight * 0.75
    );
  }
}

const imagesArray = [];
const imageObjects = [
  { src: "assets/icons/shark2.png", width: 190, height: 140 },
  { src: "assets/icons/octopus2.png", width: 130, height: 135 },
  { src: "assets/icons/jellyfish2.png", width: 110, height: 140 }
];

function togglePause() {
  isPaused = !isPaused;
  if (!gameOver) {
    if (isPaused) {
      pauseButton.classList.remove("pauseButton");
      pauseButton.classList.add("pauseButtonTwo");  
      pauseAnimations()  } else {
        pauseButton.classList.remove("pauseButtonTwo");
        pauseButton.classList.add("pauseButton");      resumeAnimations()
        animate();
    }
  }
}

const pauseButton = document.getElementById("pauseButton");
pauseButton.addEventListener("click", togglePause);

let gameOverModal = false;
class ImageObject {
  constructor() {
    const imageIndex = Math.floor(Math.random() * imageObjects.length);
    const imageObject = imageObjects[imageIndex];
    this.image = new Image();
    this.image.onload = () => {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height;
      this.width = imageObject.width;
      this.height = imageObject.height;
      this.speed = 4;
      this.distance;
      this.angle = Math.atan2(this.y - player.y, this.x - player.x); // Calcula el ángulo entre la imagen y el jugador
      1; // Dirección vertical hacia arriba
      
    };
    this.image.src = imageObject.src;
  }

  update() {
    if (isPaused) {

      return;// Si el juego está en pausa, no realizar actualizaciones
    }

    this.y -= this.speed;

    const dx = Math.cos(this.angle) * this.speed; // Componente horizontal del movimiento diagonal
    const dy = Math.sin(this.angle) * this.speed; // Componente vertical del movimiento diagonal

    this.x -= dx;
    this.y -= dy;

    const distanceX = this.x - player.x;
    const distanceY = this.y - player.y;
    this.distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (this.distance < this.width / 2 + player.radius) {
      gameOver = true;
      showGameOverModal();
pauseAnimations();

    }
  }

  
  draw() {
    // Dibuja la imagen en el lienzo con el tamaño especificado
    ctx.drawImage(
      this.image,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
      );
    }
  }
  
  function pauseAnimations() {
  const animatedElements = document.querySelectorAll("*");

  animatedElements.forEach((element) => {
    const computedStyle = window.getComputedStyle(element);
    const animationName = computedStyle.animationName;

    if (animationName !== "none") {
      element.style.animationPlayState = "paused";
    }
  });
}
  
function resumeAnimations() {
  const animatedElements = document.querySelectorAll("*");

  animatedElements.forEach((element) => {
    const computedStyle = window.getComputedStyle(element);
    const animationName = computedStyle.animationName;

    if (animationName !== "none") {
      element.style.animationPlayState = "running";
    }
  });
}

function handleBubbles() {
  for (let i = 0; i < bubblesArray.length; i++) {
    if (bubblesArray[i].y > canvas.height * 2) {
      bubblesArray.splice(i, 1);
    }

    if (
      bubblesArray[i].distance < bubblesArray[i].radius + player.radius
    ) {
      popAndRemove(i);
    }

  }
  for (let i = 0; i < bubblesArray.length; i++) {
    bubblesArray[i].update();
    bubblesArray[i].draw();
  }
  if (gameFrame % 50 == 0) {
    bubblesArray.push(new Bubble());
  }
  for (let i = 0; i < imagesArray.length; i++) {
    if (imagesArray[i].y > canvas.height * 2) {
      imagesArray.splice(i, 1);
    }

    if (imagesArray[i].distance < imagesArray[i].radius + player.radius) {
    }
  }

  for (let i = 0; i < imagesArray.length; i++) {
    imagesArray[i].update();
    imagesArray[i].draw();
  }

  if (gameFrame % 100 === 0) {
    imagesArray.push(new ImageObject());
  }
}
function popAndRemove(i) {
  if (!bubblesArray[i]) return;
  if (bubblesArray[i]) {
    if (!bubblesArray[i].counted) {
      score++;
      bubblesArray[i].counted = true;
      const roundedScore = Math.floor(score);
      scoreElement.textContent = `Bubble Pop Points: ${roundedScore}`;
    }
    bubblesArray[i].frameX++;
    if (bubblesArray[i].frameX > 7) bubblesArray[i].pop = true;
    if (bubblesArray[i].pop) bubblesArray.splice(i, 1);
  }
}

const bubbleTextArray = [];
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 7;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 15) + 1;
    this.distance;
  }

  update() {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.distance = distance;
    const forceDirectionX = dx / distance;
    const forceDirectionY = dy / distance;
    const maxDistance = 100;
    const force = (maxDistance - distance) / maxDistance;
    const directionX = forceDirectionX * force * this.density;
    const directionY = forceDirectionY * force * this.density;

    if (distance < 100) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX;
        this.x -= dx / 20;
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY;
        this.y -= dy / 20;
      }
    }
  }
}


// animation loop
function animate() {
  if (gameOver || isPaused) {

    return ;
    
  }


  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el lienzo
  for (let i = 0; i < bubbleTextArray.length; i++) {
    bubbleTextArray[i].draw();
    bubbleTextArray[i].update();
  }

  handleBubbles();
  player.update();
  player.draw();
  gameFrame += 1;
  requestAnimationFrame(animate);
}
function showGameOverModal() {
  Swal.fire({
    title: "Game Over!",
    text: "Would you like to play again or come back to home page?",
    icon: "error",
    showCancelButton: true,
    confirmButtonText: "Play again",
    cancelButtonText: "Home page"
  }).then((result) => {
    if (result.isConfirmed) {
      // El usuario desea volver a jugar
      location.reload();
    } else {
      // El usuario desea regresar al inicio
      location.href = "https://aquagout.github.io/AquaGoat/";
    }
  });
}

animate();

window.addEventListener("resize", function () {
  canvasPosition = canvas.getBoundingClientRect();
  mouse.x = canvas.width / 2;
  mouse.y = canvas.height / 2;
});

// Keyboard interactivity
const keys = [];
window.addEventListener("keydown", function (e) {
  keys[e.key] = true;
});

window.addEventListener("keyup", function (e) {
  delete keys[e.key];
});

// Player movement
const playerSpeed = 7;



function handlePlayerMovement() {
  if (keys.ArrowUp || keys.Up) {
    player.y -= playerSpeed;
  }
  if (keys.ArrowDown || keys.Down) {
    player.y += playerSpeed;
  }
  if (keys.ArrowLeft || keys.Left) {
    player.x -= playerSpeed;
  }
  if (keys.ArrowRight || keys.Right) {
    player.x += playerSpeed;
  }

  // Limit player movement within the canvas
  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width) player.x = canvas.width;
  if (player.y < 50) player.y = 50;
  if (player.y > canvas.height) player.y = canvas.height;
}

// Capturar el evento de teclado
document.addEventListener("keydown", function (event) {
  // Obtener el código de la tecla presionada
  const keyCode = event.keyCode || event.which;

  // Deshabilitar el desplazamiento de la página
  if (keyCode >= 37 && keyCode <= 40) {
    event.preventDefault();
  }
});

// Update player function
Player.prototype.update = function () {
  handlePlayerMovement();

  const dx = this.x - player.x;
  const dy = this.y - player.y;
  if (player.x != this.x) {
    this.x -= dx / 20;
    this.moving = true;
  }
  if (player.y != this.y) {
    this.y -= dy / 20;
    this.moving = true;
  }
  if (this.x < this.radius) this.x = this.radius;
  if (this.x > canvas.width - this.radius) this.x = canvas.width - this.radius;
  if (this.y < this.radius) this.y = this.radius;
  if (this.y > canvas.height - this.radius) this.y = canvas.height - this.radius;

  const theta = Math.atan2(dy, dx);
  this.angle = theta;
  
};

// Replace the existing mouse event listeners
canvas.removeEventListener("mousemove");
window.removeEventListener("mouseup");

// Update the player's update function
canvas.addEventListener("mousemove", function (e) {
  mouse.click = true;
  mouse.x = e.x - canvasPosition.left;
  mouse.y = e.y - canvasPosition.top;
  player.update();
});

// Remove the existing mouse click condition from the player's draw function
if (mouse.click) {
  // ...
}


// Start the animation loop
animate();



const leftSideImages = document.querySelectorAll(".left-side");
const initialTop = parseInt(window.getComputedStyle(leftSideImages[0]).top);

leftSideImages.forEach(function (image, index) {
  image.addEventListener("animationiteration", function () {
    const imageTop = initialTop - (index + 10) * 10;
    image.style.top = imageTop + "px";
  });
});

//   /* ----------FIN BOTONES -------------- */


//   /* ------FIN GAME OVER FUNCION ------------ */

//   /* --------- FUNCION VIBRAR----------- */
//   /*   function vibrarElemento() {
//     if ("vibrate" in navigator) {
//       objeto.style.animation = "vibration 1s infinite";
//     } else {
//       console.log("El dispositivo no soporta la vibración.");
//     }
//   }
//  */
//   function vibrarRapido() {
//     // Verificar si el navegador es compatible con la API de Vibración
//     if ("vibrate" in navigator) {
//       // Hacer que el elemento vibre con un patrón de vibración más rápido
//       objeto.style.animation = "vibration 0.2s infinite";
//     } else {
//       console.log("El dispositivo no soporta la vibración.");
//     }
//   }

//   /* PARAR EL JUEGO */
//   function PararJuego() {
//     paused = true;
//   }
