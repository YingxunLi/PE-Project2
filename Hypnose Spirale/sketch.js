let pyramids = [];
let maxPyramids = 200;
let trailEffectSlider, maxPyramidsSlider, speedFactorSlider;
let speedFactor = 1; // Faktor für Geschwindigkeit

function setup() {
  createCanvas(800, 800, WEBGL);
  angleMode(RADIANS);

  // Slider erstellen
  maxPyramidsSlider = createSlider(50, 400, maxPyramids, 10);
  maxPyramidsSlider.position(10, 10);
  trailEffectSlider = createSlider(0, 50, 10, 1);
  trailEffectSlider.position(10, 40);
  speedFactorSlider = createSlider(1, 5, 1, 0.1);
  speedFactorSlider.position(10, 70);

  // Initialisiere die Pyramiden
  initializePyramids();
}

function initializePyramids() {
  pyramids = [];
  for (let i = 0; i < maxPyramids; i++) {
    pyramids.push({
      angle: random(TWO_PI), // Startwinkel für die Spiralbewegung
      radius: 0, // Start-Radius (alle beginnen in der Mitte)
      size: random(10, 30), // Größe der Pyramiden
      speed: random(0.5, 2), // Geschwindigkeit der Bewegung nach außen
      spiralSpeed: random(0.01, 0.05), // Geschwindigkeit der Rotation
      zOffset: random(-500, 500), // Z-Startposition für Tiefeneffekt
      alpha: 255, // Anfangstransparenz (vollständig sichtbar)
    });
  }
}

function draw() {
  // Slider-Werte abrufen
  maxPyramids = maxPyramidsSlider.value();
  let trailEffect = trailEffectSlider.value();
  speedFactor = speedFactorSlider.value();

  // Hintergrund mit variabler Transparenz (Trail-Effekt)
  background(0, trailEffect);

  noFill();
  orbitControl();
  translate(0, 0, -500); // Verschiebe die Kamera leicht zurück

  // Aktualisiere die Pyramidenanzahl, falls sie sich geändert hat
  if (pyramids.length !== maxPyramids) {
    initializePyramids();
  }

  for (let pyramid of pyramids) {
    push();
    // Berechne die Spiralposition
    pyramid.angle += pyramid.spiralSpeed * speedFactor; // Drehung um die Mitte
    let x = cos(pyramid.angle) * pyramid.radius;
    let y = sin(pyramid.angle) * pyramid.radius;

    translate(x, y, pyramid.zOffset); // Position der Pyramide

    // Berechne den Farbverlauf basierend auf dem Radius
    let color1 = color('#ff00ff');
    let color2 = color('#00ffff');
    let lerpedColor = lerpColor(color1, color2, pyramid.radius / width);

    // Trail-Effekt: Verringert die Transparenz mit zunehmendem Abstand
    strokeWeight(4); // Erhöhte Strichstärke (dicker)
    stroke(lerpedColor.levels[0], lerpedColor.levels[1], lerpedColor.levels[2], pyramid.alpha);

    // Zeichne die 3D-Pyramide
    drawPyramid(0, 0, pyramid.size);

    pop();

    // Bewege die Pyramide nach außen (Spirale)
    pyramid.radius += pyramid.speed * speedFactor;

    // Verringere die Transparenz des Dreiecks, um den Trail-Effekt zu erzeugen
    pyramid.alpha = map(pyramid.radius, 0, width * 1.5, 255, 0);

    // Wenn die Pyramide zu weit entfernt ist, setze sie zurück
    if (pyramid.radius > width * 1.5 || pyramid.zOffset > 800) {
      pyramid.radius = 0;
      pyramid.angle = random(TWO_PI);
      pyramid.zOffset = random(-500, 500);
      pyramid.alpha = 255; // Rücksetzen der Transparenz
    }
  }

  // Anzeige der Sliderwerte
  displaySliderValues();
}

function drawPyramid(x, y, size) {
  let h = size * 1.5; // Höhe der Pyramide

  // Basis-Dreieck
  beginShape();
  vertex(x - size / 2, y + size / 2, 0); // Unten links
  vertex(x + size / 2, y + size / 2, 0); // Unten rechts
  vertex(x, y - size / 2, 0); // Oben
  endShape(CLOSE);

  // Seitenflächen
  beginShape();
  vertex(x - size / 2, y + size / 2, 0); // Unten links
  vertex(x, y - size / 2, 0); // Oben der Basis
  vertex(x, y, -h); // Spitze
  endShape(CLOSE);

  beginShape();
  vertex(x + size / 2, y + size / 2, 0); // Unten rechts
  vertex(x, y - size / 2, 0); // Oben der Basis
  vertex(x, y, -h); // Spitze
  endShape(CLOSE);

  beginShape();
  vertex(x - size / 2, y + size / 2, 0); // Unten links
  vertex(x + size / 2, y + size / 2, 0); // Unten rechts
  vertex(x, y, -h); // Spitze
  endShape(CLOSE);
}

function displaySliderValues() {
  push();
  noLights();
  resetMatrix();
  textSize(16);
  fill(255);
  noStroke();
  text(`Max Pyramids: ${maxPyramids}`, 10, 100);
  text(`Trail Effect: ${trailEffectSlider.value()}`, 10, 130);
  text(`Speed Factor: ${speedFactor.toFixed(1)}`, 10, 160);
  pop();
}
