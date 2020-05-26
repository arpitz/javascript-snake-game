const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// create the unit
const box = 32;

// load images
const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

const starImg = new Image();
starImg.src = "img/star.jpg";

// load the audio files
const dead = new Audio();
const eat = new Audio();
const left = new Audio();
const right = new Audio();
const up = new Audio();
const down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
left.src = "audio/left.mp3";
right.src = "audio/right.mp3";
up.src = "audio/up.mp3";
down.src = "audio/down.mp3";

// create the snake
let snake = [];
snake[0] = {
  x: 9 * box,
  y: 10 * box
}

// create the food
let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box
}

// create the star
// let star = {
//   x: Math.floor(Math.random() * 17 + 1) * box,
//   y: Math.floor(Math.random() * 15 + 3) * box
// };
let star;

// create the score var
let score = 0;

// control the snake
document.addEventListener("keydown", direction);

let d;
function direction(event){
  if(event.keyCode == 37 && d != "RIGHT"){
    d="LEFT";
    left.play();
  } else if(event.keyCode == 38 && d != "DOWN"){
    d="UP";
    up.play();
  } else if(event.keyCode == 39 && d != "LEFT"){
    d="RIGHT";
    right.play();
  } else if(event.keyCode == 40 && d != "UP"){
    d="DOWN";
    down.play();
  }
}

// collision, if snake hits its body
function collision(head, snake) {
  for(let i = 0; i < snake.length; i++){
    if(head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
} 

// draw everything to the canvas
let eatCount = 0;
function draw() {
  ctx.drawImage(ground, 0, 0);
  for(let i = 0; i < snake.length; i++) {
    ctx.fillStyle = (i === 0) ? "green" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);

    ctx.strokeStyle = "red";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }
  ctx.drawImage(foodImg, food.x, food.y);
  if(star && star.x) {
    ctx.drawImage(starImg, star.x, star.y);
  }
  
  // old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // if snake eats the food
  if(snakeX === food.x && snakeY === food.y){
    score ++;
    eatCount ++;
    eat.play();
    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box
    }

    // if eat count is equal to 5, display the star
    if(eatCount === 5) {
      eatCount = 0;
      star = {
        x: Math.floor(Math.random() * 17 + 1) * box,
        y: Math.floor(Math.random() * 15 + 3) * box
      }
      ctx.drawImage(starImg, star.x, star.y);
    }
    // we don't remove the tail
    // snake should keep growing
  } else if(star && snakeX === star.x && snakeY === star.y) { // if snake eats the star
    score += 5;
    eat.play();
    star = null;
    // we don't remove the tail
    // snake should keep growing
  } else {
    // remove the tail
    snake.pop();
  }

  // which direction
  if(d === "LEFT") snakeX -= box;
  if(d === "RIGHT") snakeX += box;
  if(d === "UP") snakeY -= box;
  if(d === "DOWN") snakeY += box;

  // add new head
  let newHead = {
    x: snakeX,
    y: snakeY
  }

  // game over 
  if(snakeX < box || snakeX > 17*box || snakeY < 3*box || snakeY > 17*box || collision(newHead, snake)){
    clearInterval(game);
    dead.play();
  }

  snake.unshift(newHead);

  ctx.fillStyle = "white";
  ctx.font = "45px Changa one";
  ctx.fillText(score, 2*box, 1.6*box);
}

let game = setInterval(draw, 500);