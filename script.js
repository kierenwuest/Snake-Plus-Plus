// Started from https://youtu.be/7Azlj0f9vas?t=1227
// Features and changes from above added by Kieren Wuest as Snake ++

//------- Main Canvas
const canvas = document.getElementById('snakeGame');
const context = canvas.getContext('2d');
//------ Take arrow keys away from the browser scrolling.
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);
//----------- Audio initialise 
const contextAudio = new window.AudioContext();
//let looped = false;

//------ Snake tail part class
class snakePart {
  constructor (x,y) {
    this.x = x;
    this.y = y;
  }
  
}

//-------- Variables

const W = (canvas.width = 1000);
const H = (canvas.height = 500);

let tileCount = 100;
let tileSize = 10; 
let headX = W/2;
let headY = H/2; 
const snakeParts = [];
let tailLength = 0;
let maxScore = window.localStorage.getItem("maxScore") || undefined;
let speed = 1; // level 1 - 10 
let xVelocity = 0;
let yVelocity = 0;

let randXCoord = Math.round(Math.floor(Math.random()* W)/10)*10;
let randYCoord = Math.round(Math.floor(Math.random()* H)/10)*10;   
// Dont use randXCoord as initialising variables. Created a bug
let appleX = Math.round(Math.floor(Math.random()* W)/10)*10; 
let appleY = Math.round(Math.floor(Math.random()* H)/10)*10; 

let grapeX = Math.round(Math.floor(Math.random()* W)/10)*10;
let grapeY = Math.round(Math.floor(Math.random()* H)/10)*10; 

let lemonX = Math.round(Math.floor(Math.random()* W)/10)*10;
let lemonY = Math.round(Math.floor(Math.random()* H)/10)*10;

let orangeX = Math.round(Math.floor(Math.random()* W)/10)*10;
let orangeY = Math.round(Math.floor(Math.random()* H)/10)*10; 

let wildCardX = Math.round(Math.floor(Math.random()* W)/10)*10;
let wildCardY = Math.round(Math.floor(Math.random()* H)/10)*10; 

const wildColours = ["green", "blue", "orange", "red", "purple", "yellow", "white"];
let index = 0;
let alpha = 1;

//const alphaFadeOut = [1,0.9,0.8,0.7,0.6,0.5,0.4,0.3,0.2,0.1,0];

let scorePop = 0;

//----- Game Functions

function drawGame(){
  changeSnakePosition();
  let result = isGameOver();
  if(result) {
    return;
  }
  clearScreen();
  displayGrid();
  drawApple();
  drawGrape();
  drawLemon();
  drawOrange();
  drawWildCard(); 
  checkAppleCollision();
  checkGrapeCollision();
  checkLemonCollision();
  checkOrangeCollision();
  checkWildCollision();
  drawSnake();
  scorePopper();
  setTimeout(drawGame, 100/ speed); // segement of time for each move increment eg 100 = 1/10th of a sec
    
};

function playFile(filepath, looped) {
  // see https://jakearchibald.com/2016/sounds-fun/
  // Fetch the file
  fetch(filepath)
    // Read it into memory as an arrayBuffer
    .then(response => response.arrayBuffer())
    // Turn it from mp3/aac/whatever into raw audio data
    .then(arrayBuffer => contextAudio.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      // Now we're ready to play!
    const soundSource = contextAudio.createBufferSource();
      soundSource.buffer = audioBuffer;
      soundSource.connect(contextAudio.destination);
      // if (looped = false) {soundSource.loop = false; } else {soundSource.loop = true;}; Not sure how to do this yet
      soundSource.start();
      
  });
     
};

function isGameOver() {
  let gameOver = false;
  
  //check walls
  if(headX < 0) {
    gameOver = true;
  }
  
  else if(headX >= W) {
    gameOver = true;
  }
  
    else if(headY < 0) {
    gameOver = true;
  }
  
    else if(headY >= H) {
    gameOver = true;
  }
  
  //check tail
  for (let i=0 ; i < snakeParts.length ; i++ ) {
    let part = snakeParts[i];
    if(part.x === headX && part.y === headY){
      gameOver = true;
      break;
    }
  }
  
  //gameover display  
  if(gameOver) {
    context.fillStyle = 'white';
    context.textAlign = "center";
    context.font = 'bold 50px Quantico';
    context.fillText ('GAME OVER', W / 2 , H / 2);
    context.font = '15px Quantico';
    context.fillText('Press [Enter] to insert coin', W / 2 , H / 1.7);
    //playFile('https://cdn.freesound.org/previews/583/583100_9927444-lq.mp3', true);
    //playFile('https://cdn.freesound.org/previews/583/583100_9927444-lq.mp3');
  }
  
  return gameOver;
};

function clearScreen () {

  context.fillStyle = 'black';
  context.fillRect(0,0,canvas.width,canvas.height);
  //context.strokeStyle = 'white';
  //context.strokeRect(tileSize, tileSize, canvas.width - tileSize*2 ,canvas.height - tileSize*2 );
 
};

function displayGrid() { 
    context.lineWidth = 1.1;
    context.strokeStyle = "#232332";
    context.shadowBlur = 0;
    for (let i = 1; i < tileCount; i++) {
      let f = (tileSize) * i;
      context.beginPath();
      context.moveTo(f, 0);
      context.lineTo(f, H);
      context.stroke();
      context.beginPath(); //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/beginPath
      context.moveTo(0, f); //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/moveTo
      context.lineTo(W, f); //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo
      context.stroke(); //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/stroke
      context.closePath(); //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/closePath
    } 
};

function drawSnake(){  

  context.fillStyle = 'green';
  for( i=0 ; i < snakeParts.length ; i++ ) {
    let part = snakeParts[i];
    context.fillRect(part.x, part.y, tileSize, tileSize)
  }
  snakeParts.push(new snakePart(headX,headY));
  while (snakeParts.length > tailLength ){
    snakeParts.shift();
  }
  
  context.fillStyle = 'orange';
  context.fillRect(headX, headY, tileSize, tileSize );
};

function changeSnakePosition() {
  headX = (headX + xVelocity); 
  headY = (headY + yVelocity); 

  //document.getElementById("Xcord").innerHTML = headX;
  //document.getElementById("Ycord").innerHTML = headY;
};

function scorePopper() {
  if (tailLength > 0) { 
    alpha = alpha - 0.05;
  if(alpha < 0) {alpha = 0};
    //console.log(scorePop);
    context.fillStyle = "rgba(255,255,255,"+ alpha +")";
    //context.textAlign = "center";
    context.font = 'bold 10px Quantico';
    context.fillText (scorePop , headX , headY - 8);
  };
};

function drawApple() {
  context.globalCompositeOperation = "lighter";  
  context.shadowBlur = 20;
  context.shadowColor = 'red';
  context.fillStyle = 'red';
    if (appleX >= W-10) { appleX = appleX - 20 };
    if (appleX <= 10) { appleX = appleX + 20 }; 
    if (appleY >= H-10) { appleY = appleX - 20 }; 
    if (appleY <= 10) { appleY = appleX + 20 };
  context.fillRect(appleX, appleY, tileSize, tileSize);
  context.globalCompositeOperation = "source-over";
  context.shadowBlur = 0;
  //context.arc(appleX, appleY, tileSize/2, 0, 2 * Math.PI);
  //context.fill(); // I made it a circle :)
};

function checkAppleCollision() {
  if(appleX == headX && appleY == headY)  { //same coords
    // remove the apple and draw it in a new random spot
    playFile('https://cdn.freesound.org/previews/150/150220_2712074-lq.mp3') ; 
    //https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3 
    let otl = tailLength
    tailLength+= Math.floor(Math.random() * 5) + 1;
    let randDotScore = tailLength-otl
    appleX = Math.round(Math.floor(Math.random()* W)/10)*10;
    if (appleX >= W-10) { appleX = appleX - 20 };
    if (appleX <= 10) { appleX = appleX + 20 }; 
     appleY = Math.round(Math.floor(Math.random()* H)/10)*10;
    if (appleY >= H-10) { appleY = appleX - 20 }; 
    if (appleY <= 10) { appleY = appleX + 20 };
    alpha = 1;
    scorePop = randDotScore;
    console.log('Yummy '+ randDotScore + ' Apple -> newApple X:' + appleX + ' Y:' + appleY);
    speed += 0.1;
    tummyApples.push('1');
    }
  
};

function drawGrape() {
  if (tailLength > 8) {
  context.globalCompositeOperation = "lighter";  
  context.shadowBlur = 20;
  context.shadowColor = 'purple';  
  context.fillStyle = 'purple';
    if (grapeX >= W-10) { grapeX = grapeX - 20 };
    if (grapeX <= 10) { grapeX = grapeX + 20 };
    if (grapeY >= H-10) { grapeY = grapeY - 20 };
    if (grapeY <= 10) { grapeY = grapeY + 20 };
  context.fillRect(grapeX, grapeY, tileSize, tileSize);
  context.globalCompositeOperation = "source-over";
  context.shadowBlur = 0;
  }
  //context.arc(appleX, appleY, tileSize/2, 0, 2 * Math.PI);
  //context.fill(); // I made it a circle :)
};

function checkGrapeCollision() {
  if(grapeX == headX && grapeY == headY)  {
    playFile('https://cdn.freesound.org/previews/647/647977_10403690-lq.mp3'); 
    // https://cdn.freesound.org/previews/647/647977_10403690-lq.mp3
    let otl = tailLength
    tailLength+= Math.floor(Math.random() * 7) + 1;
    let randDotScore = tailLength-otl
    grapeX = Math.round(Math.floor(Math.random()* W)/10)*10;
      if (grapeX >= W-10) { grapeX = grapeX - 20 };
      if (grapeX <= 10) { grapeX = grapeX + 20 };
    grapeY = Math.round(Math.floor(Math.random()* H)/10)*10;
      if (grapeY >= H-10) { grapeY = grapeY - 20 };
      if (grapeY <= 10) { grapeY = grapeY + 20 };
    alpha = 1;
    scorePop = randDotScore;
    console.log('Yummy '+ randDotScore + ' Grape -> newGrape X:' + grapeX + ' Y:' + grapeY);
    speed += 0.1;
    tummyGrapes.push('1');
    }
  
};

function drawLemon() {
  if (tailLength > 30) {
  context.globalCompositeOperation = "lighter";  
  context.shadowBlur = 20;
  context.shadowColor = 'yellow';   
  context.fillStyle = 'yellow';
      if (lemonX >= W-10) { lemonX = lemonX - 20 };
      if (lemonX <= 10) { lemonX = lemonX + 20 };
      if (lemonY >= H-10) { lemonY = lemonY - 20 };
      if (lemonY <= 10) { lemonY = lemonY + 20 };
  context.fillRect(lemonX, lemonY, tileSize, tileSize);
  context.globalCompositeOperation = "source-over";
  context.shadowBlur = 0;
  }
  //context.arc(appleX, appleY, tileSize/2, 0, 2 * Math.PI);
  //context.fill(); // I made it a circle :)
};

function checkLemonCollision() {
  if(lemonX == headX && lemonY == headY)  {
    playFile('https://cdn.freesound.org/previews/591/591258_13321742-lq.mp3'); 
    //https://cdn.freesound.org/previews/591/591258_13321742-lq.mp3
    let otl = tailLength
    tailLength+= Math.floor(Math.random() * 10) + 1;
    let randDotScore = tailLength-otl
    lemonX = Math.round(Math.floor(Math.random()* W)/10)*10;
      if (lemonX >= W-10) { lemonX = lemonX - 20 };
      if (lemonX <= 10) { lemonX = lemonX + 20 };
    lemonY = Math.round(Math.floor(Math.random()* H)/10)*10;
      if (lemonY >= H-10) { lemonY = lemonY - 20 };
      if (lemonY <= 10) { lemonY = lemonY + 20 };
    alpha = 1;
    scorePop = randDotScore;
    console.log('Yummy '+ randDotScore + ' Lemon -> newLemon X:' + lemonX + ' Y:' + lemonY);
    tummyLemons.push('1');
    speed += 0.2;
    }
  
};

function drawOrange() {
  if (tailLength > 40) {
  context.globalCompositeOperation = "lighter";  
  context.shadowBlur = 20;
  context.shadowColor = '#db504a';
  context.fillStyle = '#db504a';
      if (orangeX >= W-10) { orangeX = orangeX - 20 };
      if (orangeX <= 10) { orangeX = orangeX + 20 };
      if (orangeY >= H-10) { orangeY = orangeY - 20 };
      if (orangeY <= 10) { orangeY = orangeY + 20 };
  context.fillRect(orangeX, orangeY, tileSize, tileSize);
  context.globalCompositeOperation = "source-over";
  context.shadowBlur = 0;
  };
  //context.arc(appleX, appleY, tileSize/2, 0, 2 * Math.PI);
  //context.fill(); // I made it a circle :)
};

function checkOrangeCollision() {
  if(orangeX == headX && orangeY == headY)  { 
    playFile('https://cdn.freesound.org/previews/150/150219_2712074-lq.mp3'); 
    // https://cdn.freesound.org/previews/150/150219_2712074-lq.mp3
    let otl = tailLength
    tailLength+= Math.floor(Math.random() * 5) + 1;
    let randDotScore = tailLength-otl
    orangeX = Math.round(Math.floor(Math.random()* W)/10)*10;
      if (orangeX >= W-10) { orangeX = orangeX - 20 };
      if (orangeX <= 10) { orangeX = orangeX + 20 };
    orangeY = Math.round(Math.floor(Math.random()* H)/10)*10;
      if (orangeY >= H-10) { orangeY = orangeY - 20 };
      if (orangeY <= 10) { orangeY = orangeY + 20 };
    alpha = 1;
    scorePop = randDotScore;
    console.log('Yummy '+ randDotScore + ' Orange -> newOrange X:' + orangeX + ' Y:' + orangeY);
    tummyOranges.push('1');
    };
};

function drawWildCard() {
if (tailLength >  50) {
      if (wildCardX >= W-10) { wildCardX = wildCardX - 20 };
      if (wildCardX <= 10) { wildCardX = wildCardX + 20 };
      if (wildCardY >= H-10) { wildCardY = wildCardY - 20 };
      if (wildCardY <= 10) { wildCardY = wildCardY + 20 };
  context.globalCompositeOperation = "lighter";  
  context.shadowBlur = 20;
  context.shadowColor = wildColours[index++ % wildColours.length];
    context.fillStyle = wildColours[index++ % wildColours.length];
    context.fillRect(wildCardX, wildCardY, tileSize, tileSize);
  context.globalCompositeOperation = "source-over";
  context.shadowBlur = 0;
 }
};

function checkWildCollision() {
  if(wildCardX == headX && wildCardY == headY)  { 
    playFile('https://cdn.freesound.org/previews/214/214050_1979597-lq.mp3'); 
    let otl = tailLength
    tailLength+= Math.floor(Math.random() * 10) + 1;
    let randDotScore = tailLength-otl 
    wildCardX = Math.round(Math.floor(Math.random()* W)/10)*10;
      if (wildCardX >= W-10) { wildCardX = wildCardX - 20 };
      if (wildCardX <= 10) { wildCardX = wildCardX + 20 };
     wildCardY = Math.round(Math.floor(Math.random()* H)/10)*10;
      if (wildCardY >= H-10) { wildCardY = wildCardY - 20 };
      if (wildCardY <= 10) { wildCardY = wildCardY + 20 };
    alpha = 1;
    scorePop = randDotScore;
    console.log('WILD CARD '+ randDotScore + ' -> newWildCard X:' + wildCardX + ' Y:' + wildCardY);
    speed -= 0.3;
    tummyWild.push('1');
    context.fillStyle = wildColours[index++ % wildColours.length];
    context.fillRect(0,0,canvas.width,canvas.height);
    };
};

document.body.addEventListener('keydown', keyDown);

function keyDown(event) {
  //up
  if(event.keyCode == 38) {
    if(yVelocity == 10)
        return;
    yVelocity = -10;
    xVelocity = 0;
  }
  
  //down
  if(event.keyCode == 40) {
        if(yVelocity == -10)
        return;
    yVelocity = 10;
    xVelocity = 0;
  }
  
  //left
  if(event.keyCode == 37) {
    if(xVelocity == 10)
        return;    
    yVelocity = 0;
    xVelocity = -10;
  }
  
  //right
  if(event.keyCode == 39) {
    if(xVelocity == -10) 
        return;    
    yVelocity = 0;
    xVelocity = 10;
  }
 
  //pause
  if(event.keyCode == 32) {
    yVelocity = 0;
    xVelocity = 0;
  }  
  
    //reset
  if(event.keyCode == 13) {
    yVelocity = 0;
    xVelocity = 0;
    headY = H/2;
    headX = W/2;
    tailLength = 0
    speed = 1.2
    //contextAudio.close();
    tummyApples.length = 0;
    tummyGrapes.length = 0;
    tummyLemons.length = 0;
    tummyOranges.length = 0;
    drawGame()
   
  }
  
}

drawGame();

//------- Info Canvas 

const canvasInfo = document.getElementById('info');
const ctxInfo = canvasInfo.getContext('2d');
const Wi = (canvasInfo.width = 150);
const Hi = (canvasInfo.height = 500);
const tummyApples = [];
const tummyGrapes = [];
const tummyLemons = [];
const tummyOranges = [];
const tummyWild = [];

function drawInfo() {

  scoreDisplay();
  clearInfoScreen();
  scoreDisplay();
  speedDisplay();
  maxScoreDisplay();
  tummyAppleColumn();
  tummyGrapeColumn();
  tummyLemonColumn();
  tummyOrangeColumn();
  tummyWildColumn();
  coOrds ();
  setTimeout(drawInfo, 100/ speed);
};

function clearInfoScreen() {

  ctxInfo.fillStyle = 'black';
  ctxInfo.fillRect(0,0,Wi,Hi);
  ctxInfo.strokeStyle = "white"; // Infoscreen border
  ctxInfo.strokeRect(10,10,Wi-10,Hi-20);
  
};

function maxScoreDisplay () {
  maxScore ? null : (maxScore = tailLength);
  tailLength > maxScore ? (maxScore = tailLength) : null;
  window.localStorage.setItem("maxScore", maxScore);
  ctxInfo.fillStyle = 'white';  
  ctxInfo.font = '12px Quantico';
  ctxInfo.fillText(`MaxScore:   ${maxScore}`, 20 , Hi - 40);
};

function scoreDisplay() {
  ctxInfo.fillStyle = 'white';  
  ctxInfo.font = '18px Quantico';
  ctxInfo.fillText('Score: ' + tailLength , 20 , 30);
};

function speedDisplay() {
  ctxInfo.fillStyle = 'white';  
  ctxInfo.font = '12px Quantico';
  ctxInfo.fillText('Speed: ' + Math.floor(speed * 100) + ' px/s' , 20 , 55);
};

function coOrds () {
  ctxInfo.fillStyle = 'white';  
  ctxInfo.font = '10px Quantico';
  ctxInfo.fillText('snake x: '+ headX + ' y: '+ headY , 20 , Hi - 20);
};

function tummyAppleColumn() {
  ctxInfo.fillStyle = 'red';
  let tummyPos = 70
  for (i=0 ; i < tummyApples.length ; i++ ) {
    ctxInfo.fillRect(20, tummyPos , tileSize, tileSize);
    tummyPos = tummyPos + 15
  }
};

function tummyGrapeColumn() {
  ctxInfo.fillStyle = 'purple';
  let tummyPos = 70
  for (i=0 ; i < tummyGrapes.length ; i++ ) {
    ctxInfo.fillRect(45, tummyPos , tileSize, tileSize);
    tummyPos = tummyPos + 15
  }  
};

function tummyLemonColumn() {
  ctxInfo.fillStyle = 'yellow';
  let tummyPos = 70;
  for (i=0 ; i < tummyLemons.length ; i++ ) {
    ctxInfo.fillRect(70, tummyPos , tileSize, tileSize);
    tummyPos = tummyPos + 15
  };
};

function tummyOrangeColumn() {
  ctxInfo.fillStyle = '#db504a';
  let tummyPos = 70;
  for (i=0 ; i < tummyOranges.length ; i++ ) {
    ctxInfo.fillRect(95, tummyPos , tileSize, tileSize);
    tummyPos = tummyPos + 15
  };
};

function tummyWildColumn() {
  ctxInfo.fillStyle = wildColours[index++ % wildColours.length];
  let tummyPos = 70;
  for (i=0 ; i < tummyWild.length ; i++ ) {
    ctxInfo.fillRect(120, tummyPos , tileSize, tileSize);
    tummyPos = tummyPos + 15
  };
};

drawInfo();

// check this for CSS styles https://codepen.io/fariati/pen/mdRpEYP