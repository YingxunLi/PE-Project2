let angle = 0;
let segments = 6;  
let colors;

function setup() {
  createCanvas(400, 400);
  colors = [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255), color(255, 255, 0)];
  noFill();
  strokeWeight(2);
}

function draw() {
  background(0);
  translate(width / 2, height / 2); 
  
  let mouseXNorm = map(mouseX, 0, width, 0.5, 2);
  let mouseYNorm = map(mouseY, 0, height, 0.5, 2);
  
  let rotationSpeed = map(mouseX, 0, width, -0.05, 0.05);
  angle += rotationSpeed;
  
  for (let i = 0; i < segments; i++) {
    push();
    rotate(TWO_PI / segments * i + angle);
    drawPattern(mouseXNorm, mouseYNorm);
    pop();
  }
}

function drawPattern(scaleX, scaleY) {
  let c = colors[int(frameCount / 10) % colors.length];
  stroke(c);
  
  beginShape();
  for (let i = 0; i < 6; i++) {
    let x = cos(TWO_PI / 6 * i) * 100 * scaleX;
    let y = sin(TWO_PI / 6 * i) * 100 * scaleY;
    vertex(x, y);
  }
  endShape(CLOSE);
}
