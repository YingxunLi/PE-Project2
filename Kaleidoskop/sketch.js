let angleX = 0; // Rotationswinkel um die X-Achse
let angleY = 0; // Rotationswinkel um die Y-Achse
let segments = 6; // Anzahl der Segmente pro Ebene
let layers = 20; // Anzahl der Ebenen
let pyramidSize = 30; // Größe der Pyramidenbasis
let layerHeight = 50; // Höhe zwischen den Ebenen
let spiralOffset = 50; // Abstand der Spirale
let baseScale = 1; // Grundskalierungsfaktor

function setup() {
  createCanvas(640, 640, WEBGL); // Erstelle eine 640x640 Zeichenfläche mit 3D-WebGL
  strokeWeight(2); // Linienbreite für Zeichnungen
  resetParameters(); // Parameter zufällig initialisieren
}

function draw() {
  console.log(width, height); 
  background(0); // Hintergrund schwarz

  // Dynamische Skalierung basierend auf der Mausposition (X-Achse)
  let scaleFactor = map(mouseX, 0, width, 0.5, 2);
  baseScale = scaleFactor;

  // Höhe und Anzahl der Ebenen dynamisch anpassen (Y-Achse)
  layerHeight = map(mouseY, 0, height, 10, 100);
  layers = int(map(mouseY, 0, height, 10, 30));

  rotateX(angleX); // Szene um X-Achse rotieren
  rotateY(angleY); // Szene um Y-Achse rotieren

  scale(baseScale); // Skalierung anwenden

  angleX += 0.01; // Winkel für kontinuierliche Drehung erhöhen
  angleY += 0.01;

  // Zeichne alle Ebenen
  for (let j = 0; j < layers; j++) {
    let yOffset = j * layerHeight; // Abstand jeder Ebene

    push();
    translate(0, -yOffset, 0); // Ebene in die Höhe verschieben

    // Zeichne Segmente innerhalb der Ebene
    for (let i = 0; i < segments; i++) {
      let offsetAngle = (TWO_PI / segments) * i + (j * 0.1); // Rotationswinkel für Spirale
      let xOffset = cos(offsetAngle) * spiralOffset * j; // Spiralverschiebung in X
      let zOffset = sin(offsetAngle) * spiralOffset * j; // Spiralverschiebung in Z

      push();
      translate(xOffset, 0, zOffset); // Segmentposition verschieben
      rotateY(offsetAngle + (PI / segments) * j); // Segment um Y rotieren
      drawPyramid(pyramidSize, j); // Pyramide zeichnen
      pop();
    }

    pop();
  }
}

// Funktion zum Zeichnen einer Pyramide
function drawPyramid(size, layerIndex) {
  push();
  rotateX(HALF_PI); // Basis horizontal ausrichten

  // Farben basierend auf der Ebene berechnen
  let baseColor = color(255 * (layerIndex / layers), 100, 150, 150); // Basisfarbe
  let sideColor = color(100, 150, 255 * (1 - layerIndex / layers), 150); // Seitenfarbe
  stroke(255, 50); // Linienfarbe

  // Zeichne Basis (Sternform)
  fill(baseColor);
  beginShape();
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 10, 0, TWO_PI); // 10 Punkte für den Stern
    let radius = i % 2 === 0 ? size : size / 2; // Alternierende Radien
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    vertex(x, y, 0);
  }
  endShape(CLOSE);

  // Zeichne Seiten der Pyramide
  fill(sideColor);
  let apex = createVector(0, 0, -size); // Spitze der Pyramide
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 10, 0, TWO_PI);
    let radius = i % 2 === 0 ? size : size / 2;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let base = createVector(x, y, 0); // Basispunkt
    beginShape();
    vertex(base.x, base.y, base.z);
    vertex(apex.x, apex.y, apex.z); // Spitze
    endShape(CLOSE);
  }

  pop();
}

// Funktion zum Zurücksetzen der Parameter
function resetParameters() {
  layers = int(random(15, 30)); // Zufällige Anzahl von Ebenen
  pyramidSize = random(20, 50); // Zufällige Pyramidengröße
  spiralOffset = random(40, 80); // Zufälliger Spiralenabstand
}

// Umschalten der Parameter bei Leertaste
function keyPressed() {
  if (key === ' ') {
    resetParameters(); // Parameter zurücksetzen
  }
}
