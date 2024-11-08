let data;
let currentIndex = 0;
let backgroundImage;
let alphaValue = 0; 
let alphaChangeRate = 60 / 500;
let increasing = true; 

function preload() {
  data = loadTable("yidata.csv", "csv", "header");
  backgroundImage = loadImage("city.jpg"); 
}

function setup() {
  createCanvas(600, 400);
  data = data.columns.slice(1).map((date, idx) => ({
    date: date,
    likesReceived: data.getNum(0, idx + 1),
    likesSent: data.getNum(1, idx + 1),
    matches: data.getNum(2, idx + 1),
    usageTime: sumColumn(4, idx + 1)
  }));
}

function sumColumn(rowNum, colNum) {
  let sum = 0;
  for (let i = 0; i < data.getRowCount(); i++) {
    sum += data.getNum(i, colNum);
  }
  return sum;
}

function draw() {
  
  if (increasing) {
    alphaValue += alphaChangeRate; 
    if (alphaValue >= 60) {
      alphaValue = 60; 
      increasing = false; 
    }
  } else {
    alphaValue -= alphaChangeRate;
    if (alphaValue <= 0) {
      alphaValue = 0; 
      increasing = true; 
    }
  }

  tint(255, alphaValue); 

  image(backgroundImage, 0, 0, width, height);
  
  noTint();
  
  
  const currentData = data[currentIndex];
  displayData(currentData);
}

function mousePressed() {
  currentIndex = (currentIndex + 1) % data.length;
}

function displayData(row) {
  fill(255, 0 , 0);
  for (let i = 0; i < row.likesReceived; i++) {
    drawHeart(20 + i * 18, 100, 5);
  }

  // Display Likes Sent with Blue Hearts
  fill(0, 0, 255);
  for (let i = 0; i < row.likesSent; i++) {
    drawHeart(20 + i * 18, 150, 5);
  }

  // Display Matches with Pink Circles
  noStroke();
  fill(255, 105, 180);
  for (let i = 0; i < row.matches; i++) {
    ellipse(20 + i * 18, 200, 15);
  }

  // Display Usage Time with Angle Arc
  fill(252, 227,0);
  let angle = map(row.usageTime, 0, 1440, 0, TWO_PI);
  arc(width / 2, height / 2, 200, 200, 0, angle, PIE);

  // Display Date Label
  fill(110, 0, 173);
  textSize(15);
  textAlign(CENTER);
  text(row.date + "-- date? date", width / 2, height - 20);
}

function drawHeart(x, y, size) {
  beginShape();
  let scale = size / 10; 
  for (let t = 0; t < TWO_PI; t += 0.1) {
    let heartX = 16 * pow(sin(t), 3) * scale;
    let heartY = (13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t)) * scale;
    vertex(x + heartX, y - heartY); 
  }
  endShape(CLOSE);
}
