// Creates a canvas object and sets the context to 2d.

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// This variable is used later in the code to toggle the game's current state - Actively playing = false, game completed = true.

let gameVictory = false;

// Constants are defined. The player, the platforms, the flag, and the clouds are created first.

// Stores the player's piece settings.

const player = { 
  x: canvas.width / 2,
  y: canvas.height - 100,
  width: 30,
  height: 30,
  speed: 5,
  movingLeft: false,
  movingRight: false,
  velocityY: 0
};

 // Stores the platform sizes and locations.

const platforms = [
  { x: 0, y: 550, width: 800, height: 60 },
  { x: 100, y: 500, width: 75, height: 5 },
  { x: 375, y: 400, width: 75, height: 5 },
  { x: 550, y: 350, width: 75, height: 5 },
  { x: 250, y: 450, width: 50, height: 5 },
  { x: 375, y: 300, width: 100, height: 5 },
  { x: 150, y: 250, width: 100, height: 5 }
];

const flag = { x: 150, y: 200 } // Sets the X and Y position of the goal flag.
const clouds = { size: 25, angle: 0, end: Math.PI * 2 } // Settings to draw a white circle that is expanded upon in the drawCloud() function.

// Draws the player's piece using the object created above.

function drawPlayer() {
  ctx.beginPath();
  ctx.rect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
};

// Draws the platforms from the platform array in a loop.

function drawPlatforms() { 
  platforms.forEach(function (platform) {
    ctx.fillStyle = "black";
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    ctx.closePath();
  });
};

// Draws the goal flag, which is then placed by the constant "flag".

function drawFlag() { 
  ctx.beginPath();
  ctx.rect(flag.x, flag.y, 10, 50);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.moveTo(flag.x + 10, flag.y);
  ctx.lineTo(flag.x + 35, flag.y + 15);
  ctx.lineTo(flag.x + 10, flag.y + 30);
  ctx.fillStyle = "green";
  ctx.fill();
};

// Draws one cloud object which can then be repeated when called.

function drawCloud(locationX, locationY) { 
  ctx.beginPath();
  ctx.arc(locationX, locationY, clouds.size, clouds.angle, clouds.end, false);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.arc(locationX + 25, locationY - 15, clouds.size, clouds.angle, clouds.end, true);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.arc(locationX + 50, locationY, clouds.size, clouds.angle, clouds.end, true);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

// Uses drawCloud() to quickly render several clouds.

function drawAllClouds() { 
  drawCloud(50, 50);
  drawCloud(250, 100);
  drawCloud(350, 75);
  drawCloud(550, 95);
  drawCloud(650, 45);
}

// Overlays the game screen with victory text

function victoryScreen() { 
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "48px Arial";
  ctx.fillText("You made it!", canvas.width / 2 - 100, canvas.height / 2);
  ctx.font = "24px Arial";
  ctx.fillText("Press Space to play again", canvas.width / 2 - 100, canvas.height / 2 + 40);
}

// Reinitializes the game after the player wins and when they confirm they would like to play again.

function resetGame() { 
  player.x = canvas.width / 2;
  player.y = canvas.height - 100;
  player.velocityY = 0;
  gameVictory = false;
}

// Rather than increment the player while the key is pressed, the key press is used to toggle the boolean movingLeft / movingRight properties.
// Using this method ensures smoother player movement.

// Captures key presses used for player controls.

document.addEventListener("keydown", function (event) { 
  if (event.code === "Space" && gameVictory) {
    resetGame();
  } else if (event.code === "ArrowLeft") { 
    player.movingLeft = true;
  } else if (event.code === "ArrowRight") {
    player.movingRight = true;
  } else if (event.code === "Space" && player.velocityY === 0) {
    player.velocityY = -5;
  }
});

// Turns off the player's left / right movement when the key is lifted.

document.addEventListener("keyup", function (event) { 
  if (event.code === "ArrowLeft") {
    player.movingLeft = false;
  } else if (event.code === "ArrowRight") {
    player.movingRight = false;
  }
});

// This function first checks to see if the player is colliding with the goal flag. If so, flips the gameVictory variable to true.
// If not, uses the player's movingLeft / movingRight properties to move the player according to the player object's speed.
// It then checks to see if the player is on the ground. If they're not, increments their downward velocity (gravity).
// Next, it increments their Y position based on their velocity.
// It finally checks to see if they're on the ground. If so, they stop falling by setting velocityY to 0.

function movePlayer() {

  if (player.x + player.width >= flag.x && player.x <= flag.x + 50 && player.y + player.height >= flag.y && player.y <= flag.y + 50) {
    gameVictory = true;
  }

  if (player.movingLeft) {
    player.x -= player.speed;
  } else if (player.movingRight) {
    player.x += player.speed;
  }

  // If the player is not on the ground, apply gravity to the player.
  if (player.y < canvas.height - player.height) {
    player.velocityY += 0.25;
  }

  // Updates the player's velocity.
  player.y += player.velocityY;

  // If the player is on the ground, sets velocity to 0
  if (player.y > canvas.height - player.height) {
    player.y = canvas.height - player.height;
    player.velocityY = 0;
  }
}

// The collission detection function. the function iterates through all platforms and checks to see if the player is colliding with any of them.
// If they are, it then checks to see if their velocity is greater than 0. This check is done to prevent the player from "teleporting"
// to the top of a platform. If it is greater than 0, then it sets their velocity to 0.

function checkCollision() {
  platforms.forEach(function (platform) {
    if (player.y + player.height > platform.y &&
      player.y < platform.y + platform.height &&
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width) {

      // Check if the player is moving downwards
      if (player.velocityY > 0) {
        player.y = platform.y - player.height; // stop player from falling through platform
        player.velocityY = 0; // stop player's vertical movement
      }
    }
  });
}

// The actual game loop. The loop clears the canvas and then redraws the background.
// It then checks to see if the player has won the game. If they have not, moves the players piece and checks for collisions.
// If they have won, it skips any movement and draws the victory screen.
// It then draws the rest of the scene. This way the screen is not cleared and left blank - The player can still see the game.

function gameLoop() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!gameVictory) {
    movePlayer();
    checkCollision();
  } else {
    victoryScreen();
  };
  drawPlatforms();
  drawPlayer();
  drawFlag();
  drawAllClouds();
  requestAnimationFrame(gameLoop);
}

gameLoop();