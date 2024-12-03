let starVertices = [];
let pyramids = [];
let segmentLength = 60;
let angle = 0;
let speedFactors = [];
let colorOffsets = [];
let speedSlider, segmentSlider, glowSlider;

function setup() {
  createCanvas(800, 800, WEBGL);
  noFill();

  // Slider zur Steuerung der Geschwindigkeit
  speedSlider = createSlider(0.01, 0.2, 0.05, 0.01);
  speedSlider.position(10, 10);
  speedSlider.style('width', '150px');

  // Slider zur Steuerung der Segmentanzahl
  segmentSlider = createSlider(5, 30, 15, 1);
  segmentSlider.position(10, 40);
  segmentSlider.style('width', '150px');

  // Slider zur Steuerung des Glow-Effekts
  glowSlider = createSlider(0, 20, 5, 1); // 0 - kein Glow, 20 - maximaler Glow
  glowSlider.position(10, 70);
  glowSlider.style('width', '150px');

  initializeStar();
  initializePyramids(segmentSlider.value());
}

function initializeStar() {
  starVertices = [];
  let radius1 = 20;
  let radius2 = 10;
  let angleStep = TWO_PI / 5;

  for (let i = 0; i < TWO_PI; i += angleStep) {
    let x1 = cos(i) * radius1;
    let y1 = sin(i) * radius1;
    starVertices.push(createVector(x1, y1, 0));

    let x2 = cos(i + angleStep / 2) * radius2;
    let y2 = sin(i + angleStep / 2) * radius2;
    starVertices.push(createVector(x2, y2, 0));
  }
}

function initializePyramids(numSegments) {
  pyramids = [];
  speedFactors = [];
  colorOffsets = [];

  for (let i = 0; i < numSegments; i++) {
    pyramids.push({ baseCenter: createVector(-i * segmentLength, 0, 0), apex: createVector(0, 0, 80) });

    // Generiere zufällige Geschwindigkeiten und Farbverschiebungen
    speedFactors.push(random(0.02, 0.1));
    colorOffsets.push(random(0, 255));
  }
}

function drawPyramid(baseCenter, apex, colorFactor, glowEffect) {
  push();
  translate(baseCenter.x, baseCenter.y, baseCenter.z);
  let direction = p5.Vector.sub(apex, baseCenter).normalize();
  let angleX = atan2(direction.y, direction.z);
  let angleY = atan2(direction.x, direction.z);
  rotateX(angleX);
  rotateY(-angleY);

  // Simulieren des Glow-Effekts durch Anpassung der StrokeWeight
  let simulatedGlow = map(glowEffect, 0, 20, 1, 15);
  strokeWeight(simulatedGlow);

  // Zeichne die Basis
  stroke(255 - colorFactor * 255, colorFactor * 255, colorFactor * 255);
  beginShape();
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
  background(30);

  // Überprüfen, ob die Anzahl der Segmente aktualisiert werden muss
  if (segmentSlider.value() !== pyramids.length) {
    initializePyramids(segmentSlider.value());
  }

  // Dynamische Kameraperspektive
  let camX = cos(angle / 3) * 1000;
  let camY = sin(angle / 3) * 500;
  let camZ = cos(angle / 4) * 1000;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Aktualisierung der Winkelgeschwindigkeit mit dem Slider-Wert
  let speed = speedSlider.value();
  angle += speed;
  pyramids[0].baseCenter.x = 200 * sin(angle);
  pyramids[0].baseCenter.y = 200 * cos(angle / 2);
  pyramids[0].baseCenter.z = 200 * cos(angle);

  // Aktualisieren der restlichen Pyramiden
  for (let i = 1; i < pyramids.length; i++) {
    let prev = pyramids[i - 1];
    let current = pyramids[i];
    let direction = p5.Vector.sub(prev.baseCenter, current.baseCenter).normalize();
    direction.mult(segmentLength);
    current.baseCenter.set(prev.baseCenter.x - direction.x, prev.baseCenter.y - direction.y, prev.baseCenter.z - direction.z);
    current.apex = current.baseCenter.copy().add(direction.mult(segmentLength));
  }

  // Zeichne die Schlange als Pyramiden mit erzeugtem Glow-Effekt
  let glowEffect = glowSlider.value();
  for (let i = 0; i < pyramids.length; i++) {
    let colorFactor = (sin((angle * speedFactors[i] + colorOffsets[i])) + 1) / 2;
    drawPyramid(pyramids[i].baseCenter, pyramids[i].apex, colorFactor, glowEffect);
  }
}