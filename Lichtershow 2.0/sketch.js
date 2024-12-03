let starVertices = [];
let pyramids = [];
const segments = 15; // Mehr Pyramiden für komplexere Darstellung
const segmentLength = 60;
let angle = 0;
// Generieren von Geschwindigkeits- und Farbänderungen
let speedFactors = [];
let colorOffsets = [];

function setup() {
  createCanvas(800, 800, WEBGL);
  noFill();

  let radius1 = 20;
  let radius2 = 10;
  let angleStep = TWO_PI / 5;

  // Definiere Sternform
  for (let i = 0; i < TWO_PI; i += angleStep) {
    let x1 = cos(i) * radius1;
    let y1 = sin(i) * radius1;
    starVertices.push(createVector(x1, y1, 0));

    let x2 = cos(i + angleStep / 2) * radius2;
    let y2 = sin(i + angleStep / 2) * radius2;
    starVertices.push(createVector(x2, y2, 0));
  }

  // Initialisiere Schlange als Pyramiden
  for (let i = 0; i < segments; i++) {
    pyramids.push({ baseCenter: createVector(-i * segmentLength, 0, 0), apex: createVector(0, 0, 80) });
  }

  // Generiere zufällige Geschwindigkeiten und Farbverschiebungen
  for (let i = 0; i < segments; i++) {
    speedFactors.push(random(0.02, 0.1));
    colorOffsets.push(random(0, 255));
  }
}

function drawPyramid(baseCenter, apex, colorFactor) {
  push();
  translate(baseCenter.x, baseCenter.y, baseCenter.z);
  let direction = p5.Vector.sub(apex, baseCenter).normalize();
  let angleX = atan2(direction.y, direction.z);
  let angleY = atan2(direction.x, direction.z);
  rotateX(angleX);
  rotateY(-angleY);

  strokeWeight(map(colorFactor, 0, 1, 1, 5));
  // Zeichne die Basis
  beginShape();
  stroke(255 - colorFactor * 255, colorFactor * 255, colorFactor * 255);
  for (let v of starVertices) {
    vertex(v.x, v.y, v.z);
  }
  endShape(CLOSE);

  // Zeichne die Dreiecksseiten
  stroke(255 * colorFactor, 255 - colorFactor * 255, 200);
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
  background(30); // Dunkleres Schwarz für höheren Kontrast

  // Dynamische Kameraperspektive
  let camX = cos(angle / 3) * 1000;
  let camY = sin(angle / 3) * 500;
  let camZ = cos(angle / 4) * 1000;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Update der Position des Kopfes
  angle += random(0.03, 0.1);
  pyramids[0].baseCenter.x = 200 * sin(angle);
  pyramids[0].baseCenter.y = 200 * cos(angle / 2);
  pyramids[0].baseCenter.z = 200 * cos(angle);

  // Update der restlichen Pyramiden
  for (let i = 1; i < pyramids.length; i++) {
    let prev = pyramids[i - 1];
    let current = pyramids[i];
    let direction = p5.Vector.sub(prev.baseCenter, current.baseCenter).normalize();
    direction.mult(segmentLength);
    current.baseCenter.set(prev.baseCenter.x - direction.x, prev.baseCenter.y - direction.y, prev.baseCenter.z - direction.z);
    current.apex = current.baseCenter.copy().add(direction.mult(segmentLength));
  }

  // Zeichne die Schlange als Pyramiden
  for (let i = 0; i < pyramids.length; i++) {
    let colorFactor = (sin((angle * speedFactors[i] + colorOffsets[i])) + 1) / 2;
    drawPyramid(pyramids[i].baseCenter, pyramids[i].apex, colorFactor);
  }
}
