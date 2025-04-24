var paddle = {
    x: 500,
    y: 490,
    width: 280,
    height: 30
  };
  
  let pelota;
  let bloques = [];
  let filas = 5;
  let columnas = 10;
  let bloqueAncho = 80;
  let bloqueAlto = 40;
  
  function setup() {
    createCanvas(1000, 600);
    pelota = new Pelota();
  
    // Crear bloques
    for (let f = 0; f < filas; f++) {
      for (let c = 0; c < columnas; c++) {
        let x = 60 + c * (bloqueAncho + 10);
        let y = 40 + f * (bloqueAlto + 10);
        bloques.push(new Bloque(x, y, bloqueAncho, bloqueAlto));
      }
    }
  }
  
  function draw() {
    background(55, 20, 10); // fondo oscuro
  
    // Dibujar bloques
    for (let bloque of bloques) {
      bloque.mostrar();
    }
  
    // Pelota
    pelota.mover();
    pelota.rebotar();
    pelota.verificarColisionPaddle();
    pelota.mostrar();
  
    paddle.x = mouseX;
    let steps = 30;
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
  
  class Bloque {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.baseR = random(180, 255);
      this.baseG = random(180, 255);
      this.baseB = random(180, 255);
    }
  
    mostrar() {
      let steps = 10;
      for (let i = 0; i < steps; i++) {
        let inter = i / steps;
        let r = this.baseR + 30 * sin(inter * PI + frameCount * 0.01);
        let g = this.baseG + 30 * sin(inter * PI + frameCount * 0.015 + 1);
        let b = this.baseB + 30 * sin(inter * PI + frameCount * 0.02 + 2);
  
        fill(constrain(r, 0, 255), constrain(g, 0, 255), constrain(b, 0, 255));
        noStroke();
        rect(this.x, this.y + i * (this.h / steps), this.w, this.h / steps);
      }
    }
  }
  
  class Pelota {
    constructor() {
      this.x = width / 2;
      this.y = height / 2;
      this.r = 16;
      this.vx = random(-3, 3);
      this.vy = random(3, 5);
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
        this.vy *= -1;
      }
    }
  
    verificarColisionPaddle() {
      if (
        this.y + this.r >= paddle.y - paddle.height / 2 &&
        this.x >= paddle.x - paddle.width / 2 &&
        this.x <= paddle.x + paddle.width / 2 &&
        this.vy > 0
      ) {
        this.vy *= -1;
        this.y = paddle.y - paddle.height / 2 - this.r;
      }
    }
  
    mostrar() {
      noFill();
      stroke(100, 200, 255, 80);
      strokeWeight(3);
      ellipse(this.x, this.y, this.r * 2.8);
      noStroke();
      fill(255, 255, 100);
      ellipse(this.x, this.y, this.r * 2);
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
  