let sliderSides, sliderCount, sliderDistance, sliderLength;
let numSides = 5;
let polygonCount = 5;
let centerDistance = 160;
let sideLength = 40;
let baseColor; // Store the theme color

function setup() {
  createCanvas(640, 640);

  let canvas = document.querySelector("canvas");
  canvas.style.position = "absolute";
  canvas.style.left = `${(window.innerWidth - width) / 2}px`;
  canvas.style.top = `${(window.innerHeight - height) / 2}px`;

  document.body.style.backgroundColor = 'black';

  noLoop();
  background(51);

  fill(0);
  noStroke();
  rect(0, 0, width, height);

  sliderSides = document.getElementById("sliderSides");
  sliderSides.addEventListener("input", () => {
    numSides = int(sliderSides.value);
    document.getElementById("sliderSidesValue").innerText = numSides;
    redraw();
  });

  sliderCount = document.getElementById("sliderCount");
  sliderCount.addEventListener("input", () => {
    polygonCount = int(sliderCount.value);
    document.getElementById("sliderCountValue").innerText = polygonCount;
    redraw();
  });

  sliderDistance = document.getElementById("sliderDistance");
  sliderDistance.addEventListener("input", () => {
    centerDistance = int(sliderDistance.value);
    document.getElementById("sliderDistanceValue").innerText = centerDistance;
    redraw();
  });

  sliderLength = document.getElementById("sliderLength");
  sliderLength.addEventListener("input", () => {
    sideLength = int(sliderLength.value);
    document.getElementById("sliderLengthValue").innerText = sideLength;
    redraw();
  });

  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      baseColor = color(random(255), random(255), random(255)); // Random theme color
      redraw();
    }
  });

  baseColor = color(random(255), random(255), random(255)); // Initialize with random color
}

function draw() {
  background(51);

  let origin = createVector(random(100, width - 100), random(100, height - 100));

  for (let i = 0; i < polygonCount; i++) {
    let vertices = calculatePolygonVertices(origin, sideLength, numSides);

    let angleToSecondOrigin = random(TWO_PI);
    let secondOrigin = createVector(
      origin.x + cos(angleToSecondOrigin) * centerDistance,
      origin.y + sin(angleToSecondOrigin) * centerDistance
    );

    let attempts = 0;
    while (
      (secondOrigin.x - sideLength < 0 ||
        secondOrigin.x + sideLength > width ||
        secondOrigin.y - sideLength < 0 ||
        secondOrigin.y + sideLength > height) &&
      attempts < 10
    ) {
      angleToSecondOrigin = random(TWO_PI);
      secondOrigin = createVector(
        origin.x + cos(angleToSecondOrigin) * centerDistance,
        origin.y + sin(angleToSecondOrigin) * centerDistance
      );
      attempts++;
    }

    if (attempts >= 10) continue;

    // Lighten the color progressively
    let lightenFactor = map(i, 0, polygonCount - 1, 0, 100); // Adjust lightness
    let fillColor = color(red(baseColor) + lightenFactor, green(baseColor) + lightenFactor, blue(baseColor) + lightenFactor);
    let strokeColor = color(red(baseColor), green(baseColor), blue(baseColor));

    connectWithSecondOrigin(vertices, secondOrigin, strokeColor);
    drawPolygon(origin, sideLength, numSides, fillColor, strokeColor);

    origin = secondOrigin;
  }
}


function calculatePolygonVertices(center, sideLength, sides) {
  let angleOffset = -PI / 2;
  let vertices = [];
  let innerRadius = sideLength / 2;

  for (let i = 0; i < sides * 2; i++) {
    let angle = map(i, 0, sides * 2, 0, TWO_PI) + angleOffset;
    let radius = i % 2 === 0 ? sideLength : innerRadius;
    let x = center.x + cos(angle) * radius;
    let y = center.y + sin(angle) * radius;
    vertices.push(createVector(x, y));
  }
  return vertices;
}

function drawPolygon(center, sideLength, sides, fillColor, strokeColor) {
  fill(fillColor);
  stroke(strokeColor);
  strokeWeight(2);
  beginShape();
  let vertices = calculatePolygonVertices(center, sideLength, sides);
  for (let v of vertices) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);
}

function connectWithSecondOrigin(vertices, secondOrigin, strokeColor) {
  stroke(strokeColor);
  strokeWeight(2);
  for (let i = 0; i < vertices.length; i++) {
    line(vertices[i].x, vertices[i].y, secondOrigin.x, secondOrigin.y);
  }
}
