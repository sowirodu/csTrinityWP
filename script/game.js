const canvas = document.getElementById("myCanvas");
const currCanvas = canvas.getContext("2d");
// Initial setting of the canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let score = 0;
let gameStarted = false;
let gameEnded = false;
// Update canvas dimensions whenever the window is resized




class player {
  constructor(x, y, height, width) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.moveListener = null;
  }
  draw() {
    currCanvas.beginPath();
    currCanvas.rect(this.x, this.y, this.height, this.width);
    currCanvas.fillStyle = "black";
    currCanvas.fill();
  }
  movement() {
    this.moveListener = e => {
      if (e.key === "ArrowDown" && this.y + this.height + 20 <= canvas.height) {
        this.y += 20;
        drawAll();
      }
      if (e.key === "ArrowUp" && this.y - 20 >= 0) {
        this.y -= 20;
        drawAll();
      }
      if (e.key === "ArrowLeft" && this.x - 20 >= 0) {
        this.x -= 20;
        drawAll();
      }
      if (e.key === "ArrowRight" && this.x + this.width + 20 <= canvas.width) {
        this.x += 20;
        drawAll();
      }
    };
    window.addEventListener("keydown", this.moveListener);
  }

  // To remove the movement listener
  removeMovement() {
    window.removeEventListener("keydown", this.moveListener);
  }
  lifeTimer() {
    setInterval(() => {
      if (this.height > 10 && this.width > 10) {
        this.height -= 1;
        this.width -= 1;
        drawAll();
      } else {
        gameEnded = true;
        displayEndText();
      }
    }, 100);
  }
  isCollided(collision) {
    if (collision) {
      this.height += 20;
      this.width += 20;
      drawAll();
    }
  }
}




class point {
  constructor(x, y, height, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  drawPoint() {
    currCanvas.beginPath();
    currCanvas.rect(this.x, this.y, this.height, this.width);
    currCanvas.fillStyle = "red";
    currCanvas.fill();
  }
  collisionHandling(collided) {
    if (collided) {
      this.x = Math.floor(Math.random() * (canvas.width - this.width));
      this.y = Math.floor(Math.random() * (canvas.height - this.height));
    }
  }
}

const pl1 = new player(0, 0, 80, 80);
const point1 = new point(100, 100, 50, 50);
displayStartText();

function isCollide(a, b) {
  let isAbove = a.y + a.height < b.y;
  let isBelow = a.y > b.y + b.height;
  let isLeftOf = a.x + a.width < b.x;
  let isRightOf = a.x > b.x + b.width;

  return !(isAbove || isBelow || isLeftOf || isRightOf);
}



function drawAll() {
  // Clear the canvas first
  currCanvas.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the objects on the canvas
  pl1.draw();
  point1.drawPoint();
  displayScore();
  // Now check for collisions and handle them
  if (isCollide(pl1, point1)) {
    point1.collisionHandling(true);
    pl1.isCollided(true);
    score += 10;
  }
}

function displayStartText() {
  currCanvas.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas first

  currCanvas.font = "30px Arial";
  currCanvas.fillStyle = "black";
  currCanvas.textAlign = "center";
  currCanvas.fillText(
    `Your goal is to collect the red squares to gain size and points. Press Space to Start:`,
    canvas.width / 2,
    canvas.height / 2
  );
}

function displayEndText() {
  pl1.removeMovement();
  gameStarted = false;
  currCanvas.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas first

  currCanvas.font = "30px Arial";
  currCanvas.fillStyle = "black";
  currCanvas.textAlign = "center";
  currCanvas.fillText(
    "You Lost. Score: " + score,
    canvas.width / 2,
    canvas.height / 2
  );
}

function displayScore() {
  currCanvas.font = "20px Arial";
  currCanvas.fillStyle = "black";
  currCanvas.textAlign = "right";
  currCanvas.fillText("Score: " + score, canvas.width - 10, 30);
}

// Add a gameStarted flag

function startGame() {
  if (!gameStarted) {
    currCanvas.clearRect(0, 0, canvas.width, canvas.height);

    gameStarted = true; // Set the flag to true, so the game won't start again when space is pressed repeatedly

    // The following lines of code are what currently starts your game.
    pl1.movement();
    pl1.lifeTimer();
    drawAll();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawAll();
    });
  }
}


// Listen for the space key
window.addEventListener("keydown", e => {
  if (e.code === "Space") {
    startGame();
  }
});
