var paddle = {
    x: 500,
    y: 490,
    width: 280,
    height: 30
  };

let pelota;
  
  function setup() {
    createCanvas(1000, 600);
    pelota = new Pelota();
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
    pelota.mover();
    pelota.rebotar();
    pelota.verificarColisionPaddle();
    pelota.mostrar();
  }
  
  class Pelota {
    constructor() {
      this.x = width / 2;
      this.y = height / 2;
      this.r = 16;
      this.vx = random(-3, 3);
      this.vy = random(3, 5); // que vaya hacia abajo inicialmente
    }
  
    mover() {
      this.x += this.vx;
      this.y += this.vy;
    }
  
    rebotar() {
      if (this.x - this.r <= 0 || this.x + this.r >= width) {
        this.vx *= -1;
      }
      if (this.y - this.r <= 0) {
        this.vy *= -1;
      }
      if (this.y + this.r >= height) {
        this.vy *= -1; // rebota del fondo (opcional: puedes reiniciar juego aquí)
      }
    }
  
    verificarColisionPaddle() {
      // Lógica simple de colisión
      if (
        this.y + this.r >= paddle.y - paddle.height / 2 &&
        this.x >= paddle.x - paddle.width / 2 &&
        this.x <= paddle.x + paddle.width / 2 &&
        this.vy > 0
      ) {
        this.vy *= -1;
        this.y = paddle.y - paddle.height / 2 - this.r; // evitar que se "meta"
      }
    }
  
    mostrar() {
      // Halo eléctrico exterior
      noFill();
      stroke(100, 200, 255, 80);
      strokeWeight(3);
      ellipse(this.x, this.y, this.r * 2.8);
  
      // Pelota central
      noStroke();
      fill(255, 255, 100);
      ellipse(this.x, this.y, this.r * 2);
  
      // Rayos eléctricos constantes
      for (let i = 0; i < 10; i++) {
        let angle = random(TWO_PI);
        let len = random(10, 30);
        let x1 = this.x + cos(angle) * this.r;
        let y1 = this.y + sin(angle) * this.r;
        let x2 = x1 + random(-len, len);
        let y2 = y1 + random(-len, len);
  
        stroke(100, 200, 255, 200);
        strokeWeight(1.5);
        line(x1, y1, x2, y2);
      }
    }
  }