let angleX = 0;
let angleY = 0;
let segments = 6;  // 对称性数量
let pyramidSize = 100;

function setup() {
  createCanvas(400, 400, WEBGL);
  noFill();
  strokeWeight(2);
}

function draw() {
  background(0);

  // 设置摄像机位置，并允许旋转
  rotateX(angleX);
  rotateY(angleY);

  // 增加旋转和缩放的交互
  let scaleFactor = map(mouseX, 0, width, 0.5, 2);
  scale(scaleFactor);

  // 通过时间变化增加旋转效果
  angleX += 0.01;
  angleY += 0.01;

  // 绘制多个五角星金字塔
  for (let i = 0; i < segments; i++) {
    push();
    rotateY(TWO_PI / segments * i); // 按照对称性旋转
    drawPyramid(pyramidSize);
    pop();
  }
}

// 绘制立体五角星金字塔
function drawPyramid(size) {
  push();
  rotateX(HALF_PI); // 让金字塔立起来
  stroke(255);
  
  beginShape();
  for (let i = 0; i < 5; i++) {
    let angle = map(i, 0, 5, 0, TWO_PI);
    let x = cos(angle) * size;
    let y = sin(angle) * size;
    vertex(x, y, 0);
  }
  endShape(CLOSE);

  // 顶部的点
  beginShape();
  let apex = createVector(0, 0, -size);
  for (let i = 0; i < 5; i++) {
    let angle = map(i, 0, 5, 0, TWO_PI);
    let x = cos(angle) * size;
    let y = sin(angle) * size;
    let base = createVector(x, y, 0);
    line(apex.x, apex.y, apex.z, base.x, base.y, base.z);
  }
  endShape(CLOSE);
  pop();
}
