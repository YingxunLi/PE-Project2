let angleX = 0;
let angleY = 0;
let segments = 6;  // Number of symmetrical segments
let layers = 20;   // Number of layers in the spiral
let pyramidSize = 30;
let layerHeight = 50; // Height between each layer
let spiralOffset = 50; // Distance between each pyramid in the spiral
let baseScale = 1; // 用于设置基础的缩放比例

function setup() {
  createCanvas(600, 600, WEBGL);
  strokeWeight(2);
  resetParameters();  // 初始化参数
}

function draw() {
  background(0);

  // 动态根据鼠标X位置控制图形缩放
  let scaleFactor = map(mouseX, 0, width, 0.5, 2); // 基于鼠标X位置调整缩放比例
  baseScale = scaleFactor;

  // 动态控制金字塔的层间高度和层数，根据鼠标Y位置调整
  layerHeight = map(mouseY, 0, height, 10, 100); // 垂直方向的间距根据鼠标Y位置调整
  layers = int(map(mouseY, 0, height, 10, 30)); // 根据鼠标Y位置调整金字塔层数

  // 设置摄像机位置并允许旋转
  rotateX(angleX);
  rotateY(angleY);

  // 使用缩放因子调整整个图形的大小
  scale(baseScale);

  // 添加旋转效果
  angleX += 0.01;
  angleY += 0.01;

  // 绘制多个金字塔层，在螺旋中有偏移
  for (let j = 0; j < layers; j++) {
    let yOffset = j * layerHeight;

    push();
    translate(0, -yOffset, 0);

    for (let i = 0; i < segments; i++) {
      let offsetAngle = (TWO_PI / segments) * i + (j * 0.1); // 额外偏移，产生螺旋效果
      let xOffset = cos(offsetAngle) * spiralOffset * j;
      let zOffset = sin(offsetAngle) * spiralOffset * j;

      push();
      translate(xOffset, 0, zOffset);
      rotateY(offsetAngle + (PI / segments) * j); // 旋转，产生螺旋效果
      drawPyramid(pyramidSize, j);
      pop();
    }

    pop();
  }
}

// 绘制一个3D星形金字塔
function drawPyramid(size, layerIndex) {
  push();
  rotateX(HALF_PI);

  // 根据层的位置设置颜色，产生渐变效果
  let baseColor = color(255 * (layerIndex / layers), 100, 150, 150); // 渐变颜色
  let sideColor = color(100, 150, 255 * (1 - layerIndex / layers), 150); // 渐变颜色
  stroke(255, 50); // 略微可见的轮廓线

  // 绘制星形底座
  fill(baseColor);
  beginShape();
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 10, 0, TWO_PI);
    let radius = i % 2 === 0 ? size : size / 2; // 在外圆和内圆之间交替
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    vertex(x, y, 0);
  }
  endShape(CLOSE);

  // 绘制从底座到顶点的线
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

// 监听空格键按下事件，重置参数
function keyPressed() {
  if (key === ' ') {
    resetParameters();
  }
}

// 重置参数，加入随机性
function resetParameters() {
  // 随机化层数、金字塔大小、螺旋偏移量
  layers = int(random(15, 30)); // 随机层数
  pyramidSize = random(20, 50); // 随机金字塔大小
  spiralOffset = random(40, 80); // 随机螺旋偏移
}