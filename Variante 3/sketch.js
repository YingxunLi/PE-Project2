let angleX = 0;
let angleY = 0;
let segments = 6;  // Number of symmetrical segments
let layers = 20;   // Number of layers in the spiral
let pyramidSize = 30;
let layerHeight = 50; // Height between each layer
let spiralOffset = 50; // Distance between each pyramid in the spiral

let heightSlider, quantitySlider, angleSlider;

function setup() {
  createCanvas(640, 640, WEBGL);
  strokeWeight(2);

  heightSlider = createSlider(10, 200, 50, 1); 
  heightSlider.position(10, 10);

  quantitySlider = createSlider(5, 50, 20, 1);  
  quantitySlider.position(10, 40);

  angleSlider = createSlider(0, TWO_PI, PI / 6, 0.01);  
  angleSlider.position(10, 70);
}

function draw() {
  background(0);

  rotateX(angleX);
  rotateY(angleY);

  layerHeight = heightSlider.value();  
  layers = quantitySlider.value();  
  let spiralAngle = angleSlider.value();  

  angleX += 0.01;
  angleY += 0.01;

  let prevX = 0;
  let prevZ = 0;

  for (let j = 0; j < layers; j++) {
    let yOffset = j * layerHeight;

    push();
    translate(prevX, -yOffset, prevZ);  

    for (let i = 0; i < segments; i++) {
      let offsetAngle = (TWO_PI / segments) * i + (j * spiralAngle); 
      let xOffset = cos(offsetAngle) * spiralOffset * j;
      let zOffset = sin(offsetAngle) * spiralOffset * j;

      push();
      translate(xOffset, 0, zOffset);
      rotateY(offsetAngle + (PI / segments) * j); 
      drawPyramid(pyramidSize, j);
      pop();

      prevX = xOffset;
      prevZ = zOffset;
    }

    pop();
  }
}

function drawPyramid(size, layerIndex) {
  push();
  rotateX(HALF_PI);

  let baseColor = color(255 * (layerIndex / layers), 100, 150, 150);
  let sideColor = color(100, 150, 255 * (1 - layerIndex / layers), 150);
  stroke(255, 50);

  fill(baseColor);
  beginShape();
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 10, 0, TWO_PI);
    let radius = i % 2 === 0 ? size : size / 2; 
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    vertex(x, y, 0);
  }
  endShape(CLOSE);

  fill(sideColor);
  let apex = createVector(0, 0, -size);
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 10, 0, TWO_PI);
    let radius = i % 2 === 0 ? size : size / 2;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let base = createVector(x, y, 0);
    beginShape();
    vertex(base.x, base.y, base.z);
    vertex(apex.x, apex.y, apex.z);
    endShape(CLOSE);
  }

  pop();
}
