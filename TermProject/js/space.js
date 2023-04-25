// Draws the initial canvas and declares variables used throughout the game.

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let playerScore = 0;
let enemyProgress = 0;
let gameOver = false;
let playerVictory = false;
let playerStart = false;

// These constants define the player, enemy, and projectile objects, while also filling an array with enemies.

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    speed: 5,
    movingLeft: false,
    movingRight: false
};

const enemy = {
    x: canvas.width / 2,
    y: 30,
    width: 30,
    height: 30,
    speed: 0.6
};

const enemyArray = [];

for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 12; col++) {
        enemyArray.push({
            x: col * (enemy.width + 10) + 30,
            y: row * (enemy.height + 10) + 30,
            width: enemy.width,
            height: enemy.height,
            speed: enemy.speed
        })
    }
}

const projectile = {
    x: player.x + player.width / 2,
    y: player.y,
    radius: 5,
    speed: 10,
    active: false
};

// These next three functions draw the pieces that are to be used in the game.
// Measurements are defined in the objects created prior to these statements.

function drawPlayer() {
    ctx.beginPath();
    ctx.rect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = "lightblue";
    ctx.fill();
    ctx.closePath();
}

function drawEnemy() {
    for (let i = 0; i < enemyArray.length; i++) {
    ctx.beginPath();
    ctx.rect(enemyArray[i].x, enemyArray[i].y, enemyArray[i].width, enemyArray[i].height);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    }
}

function drawProjectile() {
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

// This function moves the player piece. Rather than rely entirely on the computer reading the key,
// I found that smoother movement can be made by using booleans. While a key is held down, the boolean
// is true and moves the piece smoothly. When the key is released, the boolean is now false and the piece 
// is stopped.

function movePlayer() {
    if (player.movingLeft) {
        player.x -= player.speed;
    } else if (player.movingRight) {
        player.x += player.speed;
    }

    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

// Event listeners for the left and right arrow keys. When pressed, the moving boolean is true.

document.addEventListener("keydown", event => {
    // Starts the game
    if (event.code === "Space" && !playerStart) {
        playerStart = true;
        gameLoop();
    } else if (event.code === "ArrowLeft") { // Handles left / right movement
        player.movingLeft = true;
    } else if (event.code === "ArrowRight") {
        player.movingRight = true;
    } else if (event.code === "Space" && !projectile.active && !gameOver) { // Fires a projectile and, while the projectile is on the screen, prevents the firing of a second one.
        projectile.x = player.x + player.width / 2;
        projectile.y = player.y;
        projectile.active = true;
    } else if (event.code === "Space" && gameOver) { // Otherwise, if the game is over, space is used to restart the game.
        playAgain();
    }
});

document.addEventListener("keyup", event => { // Stops player movement when the key is released.
    if (event.code === "ArrowLeft") {
        player.movingLeft = false;
    } else if (event.code === "ArrowRight") {
        player.movingRight = false;
    }
});

// This function moves the enemy side to side and keeps them within the canvas.

function moveEnemy() {
    for (let i = 0; i < enemyArray.length; i++) {
    enemyArray[i].x += enemy.speed;

    // This part of the function inverts their speed if they exceed either boundary of the canvas.
    // It also drops the enemies down a little bit. Once an enemy touches a player, they lose.

    if (enemyArray[i].x + enemyArray[i].width > canvas.width || enemyArray[i].x < 0) {
        enemy.speed = -enemy.speed;
        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i].y += 5;
    }
}
}
}

// Checks first to see if there is a projectile active. If it is, moves the projectile along its trajectory.

function moveProjectile() {
    if (projectile.active) {
        projectile.y -= projectile.speed;

        // If the projectile leaves the screen, deactivates it. This allows the player to fire again in case of a missed shot. 

        if (projectile.y < 0) {
            projectile.active = false;
        }
    }
}

// This function checks first if there is a projectile active.
// If there is, it iterates through the enemy array and checks for collision against any enemy in that array.
// If there is a collision, the enemy is removed from the array at position i, deactivates the projectile, and gives the player 50 points.
// It then checks to see if there are any enemies left in the array. If they're gone, the player wins.

function checkCollisions() {
    for (let i = 0; i < enemyArray.length; i++) {
        let enemy = enemyArray[i];
    if (
        projectile.active &&
        enemy.x < projectile.x + projectile.radius &&
        enemy.x + enemy.width > projectile.x - projectile.radius &&
        enemy.y < projectile.y + projectile.radius &&
        enemy.y + enemy.height > projectile.y - projectile.radius
    ) {
        enemyArray.splice(i, 1);
        projectile.active = false;
        playerScore += 50;
        if (enemyArray.length === 0) {
            playerVictory = true;
            gameOver = true;
            finalScreen();
        }
        break;
    }

    // If the enemy is touching the player, the player loses.

    if (
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
    ) {
        gameOver = true;
        playerVictory = false;
}
}
}

// Displays the end game screen, with an appropriate message based on whether the player has won or lost.

function finalScreen() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        if (playerVictory) {
        ctx.fillText("You've won!", canvas.width / 2 - 100, canvas.height / 2);
        } else {
        ctx.fillText("You lost!", canvas.width / 2 - 100, canvas.height / 2);
        }
        ctx.font = "24px Arial";
        ctx.fillText("Press Space to play again", canvas.width / 2 - 100, canvas.height / 2 + 40);
}

// Re-initializes the game in the event that the player would like to play again.
// If the reset comes as a result of a loss, the player's score is first reset. Otherwise, they can continue to reach a higher score.

function playAgain(){
    if (!playerVictory) {
        playerScore = 0;
    }

    gameOver = false;
    playerVictory = false;

    player.x = canvas.width / 2;
    player.y = canvas.height - 50;
    player.movingLeft = false;
    player.movingRight = false;
    player.speed = 5;
    enemy.x = canvas.width / 2;
    enemy.y = 30;
    enemy.speed = 0.5

    // Refills the enemy array with more enemies to blast.

    enemyArray.splice(0, enemyArray.length);
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 12; col++) {
            enemyArray.push({
                x: col * (enemy.width + 10) + 30,
                y: row * (enemy.height + 10) + 30,
                width: enemy.width,
                height: enemy.height,
                speed: enemy.speed
            })
        }
    }
}

// The main game loop.

function gameLoop() {

    // Clears the canvas, erasing the visuals of pieces that are no longer in those positions.

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draws the player, the enemies, and if there is a projectile active, the projectile too.

    drawPlayer();
    drawEnemy();
    if (projectile.active) {
        drawProjectile();
    }

    // If the game is not over, allows the player to continue to move.

    if (!gameOver) {
    movePlayer();
    moveEnemy();
    moveProjectile();
    checkCollisions();
} else {
    finalScreen();
}

// Keeps track of the player's score, then calls the AnimationFrame function to run the loop again.

ctx.fillStyle = "white";
ctx.font = "bold 16px Arial";
ctx.fillText("Score: " + playerScore, 10, 20);
requestAnimationFrame(gameLoop);

}

// Draws the initial start screen.

ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "white";
ctx.font = "48px Arial";
ctx.fillText("Space Blaster", canvas.width / 2 - 100, canvas.height / 2);
ctx.font = "24px Arial";
ctx.fillText("Press Space to play", canvas.width / 2 - 100, canvas.height / 2 + 40);