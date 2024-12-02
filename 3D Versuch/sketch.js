let numIterationsSlider;let numIterations = 5;
let baseRadius = 20;
let starPositions = [];
let angleOffset = 0;

function setup() {
  createCanvas(640, 640);
  
  // Slider für die Anzahl der Sterne
  numIterationsSlider = createSlider(3, 10, 5, 1);
  numIterationsSlider.position(10, 10);
  numIterationsSlider.style('width', '100px');
  
  // Slider für die Größe der Sterne
  sizeSlider = createSlider(10, 100, 20, 5);
  sizeSlider.position(10, 40);
  sizeSlider.style('width', '100px');
  
  // Initialisiere zufällige Startpositionen für die Sterne
  for (let i = 0; i < 10; i++) {
    starPositions.push(createVector(random(width), random(height)));
  }
}

function draw() {
  background(220, 50); // transparenter Hintergrund für Trail-Effekt
  noFill();
  strokeWeight(2);
  numIterations = numIterationsSlider.value();
  baseRadius = sizeSlider.value();
  let radius1 = baseRadius;
  let radius2 = baseRadius * 2;

  for (let i = 0; i < numIterations; i++) {
    let starPos = starPositions[i];
    let rotatedX = width / 2 + cos(angleOffset) * (starPos.x - width / 2) - sin(angleOffset) * (starPos.y - height / 2);
    let rotatedY = height / 2 + sin(angleOffset) * (starPos.x - width / 2) + cos(angleOffset) * (starPos.y - height / 2);

    let starEndPoints = drawStar(rotatedX, rotatedY, radius1, radius2, i);

    stroke(map(i, 0, numIterations, 0, 255), 150, 255);

    // Verbinden alle Punkte aller Stern-Zwischenpunkte
    for (let j = i + 1; j < numIterations; j++) {
      let nextStarPos = starPositions[j];
      let nextRotatedX = width / 2 + cos(angleOffset) * (nextStarPos.x - width / 2) - sin(angleOffset) * (nextStarPos.y - height / 2);
      let nextRotatedY = height / 2 + sin(angleOffset) * (nextStarPos.x - width / 2) + cos(angleOffset) * (nextStarPos.y - height / 2);
      
      for (const point of starEndPoints) {
        line(point.x, point.y, nextRotatedX, nextRotatedY);
      }
    }
  }
  
  angleOffset += 0.01;
}

function drawStar(x, y, radius1, radius2, i) {
  let points = 5;
  let angle = TWO_PI / points;
  let halfAngle = angle / 2.0;
  let starEndPoints = [];

  stroke(0); // Dunkle Konturlinie für Cartoon-Effekt
  strokeWeight(3);
  
  fill(255 - i * 255 / numIterations, 100, 150); // Farbfüllung für den Cartoon-Look

  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    starEndPoints.push(createVector(sx, sy));
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);

  return starEndPoints;
}
