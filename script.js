var paddle = {
    x: 500,
    y: 490,
    width: 280,
    height: 30
  };
  
  function setup() {
    createCanvas(1000, 600);
    // background(220); //gris claro
  }
  
  function draw() {
    background(55, 20, 10);//rojo claro
    fill(255, 255, 255);//blanco
    ellipse(width / 2, height / 2, 100, 100);
  
    // Seguir mouse
    paddle.x = mouseX;
  
    let steps = 30; // más pasos = más suave el degradado
    for (let i = 0; i < steps; i++) {
      let inter = i / steps;
  
      let r = 127 + 127 * sin(TWO_PI * inter + frameCount * 0.05);
      let g = 127 + 127 * sin(TWO_PI * inter + frameCount * 0.08 + PI / 3);
      let b = 127 + 127 * sin(TWO_PI * inter + frameCount * 0.1 + PI / 2);
  
      fill(r, g, b);
      noStroke();
  
      let h = paddle.height / steps;
      let yOffset = -paddle.height / 2 + i * h;
  
      beginShape();
      vertex(paddle.x - paddle.width / 2 - 10, paddle.y + yOffset);
      vertex(paddle.x - paddle.width / 2 + 10, paddle.y + yOffset - h / 2);
      vertex(paddle.x + paddle.width / 2 - 10, paddle.y + yOffset - h / 2);
      vertex(paddle.x + paddle.width / 2 + 10, paddle.y + yOffset);
      vertex(paddle.x + paddle.width / 2 - 10, paddle.y + yOffset + h / 2);
      vertex(paddle.x - paddle.width / 2 + 10, paddle.y + yOffset + h / 2);
      endShape(CLOSE);
    }
  }
  