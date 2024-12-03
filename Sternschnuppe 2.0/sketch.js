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
let trail = [];
let maxTrailLength = 50;

let stars = [];
let numStars = 200;

let segmentSlider; // Slider für die Länge der Schlange
let colorSlider;   // Slider für die Farbe
let glowSlider;    // Slider für den Leuchteffekt

function setup() {
  createCanvas(800, 800, WEBGL);

  // Initialize sliders
  segmentSlider = createSlider(5, 20, 10, 1); // Min: 5, Max: 50, Start: 15, Step: 1
  segmentSlider.position(10, 40);

  colorSlider = createSlider(0, 360, 60, 1); // Min: 0°, Max: 360°, Start: 60° (Gelb), Step: 1°
  colorSlider.position(10, 60);

  glowSlider = createSlider(0, 100, 0, 1); // Min: 0, Max: 100, Start: 0 (ausgeschaltet), Step: 1
  glowSlider.position(10, 80);

  colorMode(HSB); // Verwende den HSB-Farbraum

  // Initialize snake segments
  initializeSnake(15);

  // Define the star shape base
  let radius1 = 30;
  let radius2 = 15;
  let angleStep = TWO_PI / 5;

  for (let i = 0; i < TWO_PI; i += angleStep) {
    let x1 = cos(i) * radius1;
    let y1 = sin(i) * radius1;
    starVertices.push(createVector(x1, y1, 0));

    let x2 = cos(i + angleStep / 2) * radius2;
    let y2 = sin(i + angleStep / 2);
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
      brightness: random(100, 255),
      flickerSpeed: random(0.01, 0.05),
    });
  }
}

function initializeSnake(numSegments) {
  snake = [];
  for (let i = 0; i < numSegments; i++) {
    snake.push(createVector(-i * segmentLength, 0, 0));
  }
}

function drawStars() {
  noStroke();
  for (let star of stars) {
    let flicker = sin(millis() * star.flickerSpeed) * 50 + star.brightness;
    fill(flicker, flicker, flicker);
    push();
    translate(star.pos.x, star.pos.y, star.pos.z);
    sphere(2);
    pop();
  }
}

function drawPyramid(baseCenter, apex, t, colorHue) {
  push();
  translate(baseCenter.x, baseCenter.y, baseCenter.z);

  let colorStart = color(colorHue, 100, 100); // Startfarbe basierend auf dem Farb-Slider
  let colorEnd = color(colorHue, 50, 50);     // Dunklere Version der Startfarbe
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

function drawGlow(snake, glowIntensity, colorHue) {
  if (glowIntensity <= 0) return; // Keine Effekte, wenn der Slider-Wert 0 ist
  noStroke();

  for (let i = 0; i < snake.length; i++) {
    let segment = snake[i];
    let alpha = map(glowIntensity, 0, 100, 0, 200);
    let size = map(sin(frameCount * 0.05 + i * 0.2), -1, 1, thickness * 2, thickness * 4);

    fill(color(colorHue, 100, 100, alpha / 255));
    push();
    translate(segment.x, segment.y, segment.z);
    ellipse(0, 0, size, size);
    pop();
  }
}

function drawTrail(trail, colorHue) {
  noStroke();
  for (let i = 0; i < trail.length; i++) {
    let pos = trail[i].pos;
    let alpha = map(i, 0, trail.length - 1, 0, 255);
    fill(color(colorHue, 100, 100, alpha / 255));
    push();
    translate(pos.x, pos.y, pos.z);
    sphere(5);
    pop();
  }
}

function draw() {
  background(0);
  orbitControl();

  // Update snake length based on slider
  let numSegments = segmentSlider.value();
  if (numSegments !== snake.length) {
    initializeSnake(numSegments);
  }

  // Update color based on slider
  let colorHue = colorSlider.value();

  // Update glow intensity based on slider
  let glowIntensity = glowSlider.value();

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
  stroke(color(colorHue, 100, 100));
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
    drawPyramid(createVector(0, 0, 0), createVector(0, 0, 75), t, colorHue);
    pop();
  }

  // Draw glow effect
  drawGlow(snake, glowIntensity, colorHue);

  // Update the trail for the last segment
  let lastSegment = snake[snake.length - 1];
  trail.push({ pos: lastSegment.copy(), time: millis() });
  if (trail.length > maxTrailLength) {
    trail.shift();
  }

  // Draw the trail for the last segment
  drawTrail(trail, colorHue);
}

function keyPressed() {
  if (key === ' ') {
    followMouse = !followMouse;
  }
}
