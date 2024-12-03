const segments = 15;
const segmentLength = 40;
let snake = [];
let angle = 0;
let followMouse = false;

let radius = 200;
let thickness = 30;
let speed = 0.03;
let snakeSpeed = 5;

let starVertices = [];
let pyramids = [];
let trail = []; // Array für den Trail der letzten Pyramide
let maxTrailLength = 50; // Maximale Länge des Trails

let stars = []; // Array für die Sterne
let numStars = 200; // Anzahl der Sterne

function setup() {
  createCanvas(800, 800, WEBGL);

  // Initialize snake segments
  for (let i = 0; i < segments; i++) {
    snake.push(createVector(-i * segmentLength, 0, 0));
  }

  // Define the star shape base
  let radius1 = 30;
  let radius2 = 15;
  let angleStep = TWO_PI / 5;

  for (let i = 0; i < TWO_PI; i += angleStep) {
    let x1 = cos(i) * radius1;
    let y1 = sin(i) * radius1;
    starVertices.push(createVector(x1, y1, 0));

    let x2 = cos(i + angleStep / 2) * radius2;
    let y2 = sin(i + angleStep / 2) * radius2;
    starVertices.push(createVector(x2, y2, 0));
  }

  // Initialize stars
  for (let i = 0; i < numStars; i++) {
    stars.push({
      pos: createVector(
        random(-width, width),
        random(-height, height),
        random(-1000, -200)
      ),
      brightness: random(100, 255), // Initial brightness
      flickerSpeed: random(0.01, 0.05) // Speed of flickering
    });
  }
}

function drawStars() {
  noStroke();
  for (let star of stars) {
    let flicker = sin(millis() * star.flickerSpeed) * 50 + star.brightness;
    fill(flicker, flicker, flicker);
    push();
    translate(star.pos.x, star.pos.y, star.pos.z);
    sphere(2); // Small points representing stars
    pop();
  }
}

function drawPyramid(baseCenter, apex, t) {
  push();
  translate(baseCenter.x, baseCenter.y, baseCenter.z);

  // Interpolate between two colors based on the time and segment index
  let colorStart = color(25, 25, 0); // Green
  let colorEnd = color(255, 255, 0); // Dark Green
  let lerpedColor = lerpColor(colorStart, colorEnd, t);

  fill(lerpedColor);
  stroke(0);
  strokeWeight(1);
  beginShape();
  for (let v of starVertices) {
    vertex(v.x, v.y, v.z);
  }
  endShape(CLOSE);

  fill(lerpedColor);
  for (let i = 0; i < starVertices.length; i++) {
    let v1 = starVertices[i];
    let v2 = starVertices[(i + 1) % starVertices.length];
    beginShape();
    vertex(v1.x, v1.y, v1.z);
    vertex(v2.x, v2.y, v2.z);
    vertex(apex.x - baseCenter.x, apex.y - baseCenter.y, apex.z - baseCenter.z);
    endShape(CLOSE);
  }
  pop();
}

function drawTrail(trail) {
  noStroke();
  for (let i = 0; i < trail.length; i++) {
    let pos = trail[i].pos;
    let alpha = map(i, 0, trail.length - 1, 0, 255); // Transparenz nimmt ab
    fill(255, 255, 0, alpha); // Gleiche grüne Farbe wie die Pyramide
    push();
    translate(pos.x, pos.y, pos.z);
    sphere(5); // Kleiner Punkt für den Trail
    pop();
  }
}

function draw() {
  background(0);
  orbitControl();

  // Draw stars in the background
  drawStars();

  // Update the snake's movement
  if (followMouse) {
    let head = snake[0];
    let target = createVector(mouseX - width / 2, mouseY - height / 2, 0);
    let dir = p5.Vector.sub(target, head).normalize();
    head.add(dir.mult(snakeSpeed));
  } else {
    angle += speed;
    let head = snake[0];
    head.x = radius * sin(angle);
    head.y = radius * sin(angle / 2);
    head.z = radius * cos(angle);
  }

  // Move snake segments
  for (let i = 1; i < snake.length; i++) {
    let prev = snake[i - 1];
    let current = snake[i];
    let direction = p5.Vector.sub(prev, current).normalize();
    direction.mult(segmentLength);
    current.set(prev.x - direction.x, prev.y - direction.y, prev.z - direction.z);
  }

  noFill();
  stroke(255, 255, 0);
  strokeWeight(thickness);
  beginShape();
  for (let v of snake) {
    vertex(v.x, v.y, v.z);
  }
  endShape();

  let time = millis() * 0.001;
  for (let i = 0; i < snake.length; i++) {
    let segment = snake[i];
    let t = map(sin(time + i * 0.1), -1, 1, 0, 1);
    push();
    translate(segment.x, segment.y, segment.z);
    drawPyramid(createVector(0, 0, 0), createVector(0, 0, 75), t);
    pop();
  }

  // Update the trail for the last segment
  let lastSegment = snake[snake.length - 1];
  trail.push({ pos: lastSegment.copy(), time: millis() });
  if (trail.length > maxTrailLength) {
    trail.shift(); // Entferne ältere Punkte
  }

  // Draw the trail for the last segment
  drawTrail(trail);
}

function keyPressed() {
  if (key === ' ') {
    followMouse = !followMouse;
  }
}
