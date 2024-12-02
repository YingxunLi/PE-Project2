let angleX = 0;
let angleY = 0;
let segments = 6;  
let layers = 20;   
let pyramidSize = 30;
let layerHeight = 50; 
let spiralOffset = 50; 
let baseScale = 1; 

function setup() {
  createCanvas(600, 600, WEBGL);
  strokeWeight(2);
  resetParameters();  
}

function draw() {
  background(0);

  let scaleFactor = map(mouseX, 0, width, 0.5, 2); 
  baseScale = scaleFactor;

  layerHeight = map(mouseY, 0, height, 10, 100); 
  layers = int(map(mouseY, 0, height, 10, 30)); 

  rotateX(angleX);
  rotateY(angleY);

  scale(baseScale);

  angleX += 0.01;
  angleY += 0.01;

  for (let j = 0; j < layers; j++) {
    let yOffset = j * layerHeight;

    push();
    translate(0, -yOffset, 0);

    for (let i = 0; i < segments; i++) {
      let offsetAngle = (TWO_PI / segments) * i + (j * 0.1); 
      let xOffset = cos(offsetAngle) * spiralOffset * j;
      let zOffset = sin(offsetAngle) * spiralOffset * j;

      push();
      translate(xOffset, 0, zOffset);
      rotateY(offsetAngle + (PI / segments) * j); 
      drawPyramid(pyramidSize, j);
      pop();
    }

    pop();
  }
}

function drawPyramid(size, layerIndex) {
  push();
  rotateX(HALF_PI);

  let baseColor = color(255 * (layerIndex / layers), 100, 150, 150); 
  let sideColor = color(100, 150, 255 * (1 - layerIndex / layers), 150); 
  stroke(255, 50); 

  fill(baseColor);
  beginShape();
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 10, 0, TWO_PI);
    let radius = i % 2 === 0 ? size : size / 2; 
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    vertex(x, y, 0);
  }
  endShape(CLOSE);

  fill(sideColor);
  let apex = createVector(0, 0, -size);
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 10, 0, TWO_PI);
    let radius = i % 2 === 0 ? size : size / 2;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let base = createVector(x, y, 0);
    beginShape();
    vertex(base.x, base.y, base.z);
    vertex(apex.x, apex.y, apex.z);
    endShape(CLOSE);
  }

  pop();
}

function keyPressed() {
  if (key === ' ') {
    resetParameters();
  }
}

function resetParameters() {
  layers = int(random(15, 30)); 
  pyramidSize = random(20, 50); 
  spiralOffset = random(40, 80); 
}