let starVertices = [];
let pyramids = [];
const segments = 10; // Anzahl der Pyramiden
const segmentLength = 50;
let angle = 0;

function setup() {
  createCanvas(800, 800, WEBGL);
  let radius1 = 20; // Outer radius for star base
  let radius2 = 10; // Inner radius for star base
  let angleStep = TWO_PI / 5;

  // Define star shape
  for (let i = 0; i < TWO_PI; i += angleStep) {
    let x1 = cos(i) * radius1;
    let y1 = sin(i) * radius1;
    starVertices.push(createVector(x1, y1, 0));

    let x2 = cos(i + angleStep / 2) * radius2;
    let y2 = sin(i + angleStep / 2) * radius2;
    starVertices.push(createVector(x2, y2, 0));
  }

  // Initialize snake as pyramids
  for (let i = 0; i < segments; i++) {
    pyramids.push({ baseCenter: createVector(-i * segmentLength, 0, 0), apex: createVector(0, 0, 80) });
  }
}

function drawPyramid(baseCenter, apex) {
  push();
  translate(baseCenter.x, baseCenter.y, baseCenter.z);

  // Calculate rotational angles
  let direction = p5.Vector.sub(apex, baseCenter).normalize();
  let angleX = atan2(direction.y, direction.z);
  let angleY = atan2(direction.x, direction.z);

  rotateX(angleX);
  rotateY(-angleY);

  // Draw the base
  fill(0, 0, 139); // Dunkelblau
  stroke(50);
  strokeWeight(2);
  beginShape();
  for (let v of starVertices) {
    vertex(v.x, v.y, v.z);
  }
  endShape(CLOSE);

  // Draw the triangular sides
  fill(173, 216, 230); // Hellblau
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

function draw() {
  background(0);
  orbitControl();

  // Update the position of the head of the snake
  angle += 0.05;
  pyramids[0].baseCenter.x = 200 * sin(angle);
  pyramids[0].baseCenter.y = 200 * sin(angle / 2);
  pyramids[0].baseCenter.z = 200 * cos(angle);

  // Update the rest of the pyramids
  for (let i = 1; i < pyramids.length; i++) {
    let prev = pyramids[i - 1];
    let current = pyramids[i];
    let direction = p5.Vector.sub(prev.baseCenter, current.baseCenter).normalize();
    direction.mult(segmentLength);
    current.baseCenter.set(prev.baseCenter.x - direction.x, prev.baseCenter.y - direction.y, prev.baseCenter.z - direction.z);

    current.apex = current.baseCenter.copy().add(direction.mult(segmentLength));
  }

  // Draw the snake as pyramids
  for (let pyramid of pyramids) {
    drawPyramid(pyramid.baseCenter, pyramid.apex);
  }
}
