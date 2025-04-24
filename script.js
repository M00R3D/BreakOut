var paddle = {
    x: 500,
    y: 490,
    width: 280,
    height: 30,
    vx: 0
  };
  
  class Corazon3D {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.angulo = random(TWO_PI);
    }
  
    dibujar() {
      push();
      translate(this.x, this.y + 12);
      let escala = 1 + 0.05 * sin(frameCount * 0.1);
      scale(escala);
      let ciclo = frameCount % 90;
      if (ciclo < 30) {
        fill(255, 0, 0);
      } else if (ciclo < 60) {
        fill(0);
      } else {
        fill(255);
      }
      beginShape();
      vertex(0, 0);
      bezierVertex(-15, -25, -30, -50, 0, -40);
      bezierVertex(30, -50, 15, -25, 0, 0);
      endShape(CLOSE);
      pop();
    }
  }
  
  class TextoPunto {
    constructor(x, y, texto) {
      this.x = x;
      this.y = y;
      this.texto = texto;
      this.opacidad = 255;
      this.color = color(random(255), random(255), random(255));
    }
  
    actualizar() {
      this.y -= 1;
      this.opacidad -= 4;
    }
  
    dibujar() {
      fill(red(this.color), green(this.color), blue(this.color), this.opacidad);
      textSize(20);
      textAlign(CENTER);
      text(this.texto, this.x, this.y);
    }
  
    estaMuerto() {
      return this.opacidad <= 0;
    }
  }
  
  let pelota;
  let bloques = [];
  let filas = 3;
  let columnas = 10;
  let bloqueAncho = 80;
  let bloqueAlto = 40;
  let vidas = 3;
  let puntos = 0;
  let corazones = [];
  let juegoPerdido = false;
  let textosPuntos = [];
  let nivel = 1;
  let transicion = 0;
  
  function setup() {
    createCanvas(1000, 600);
    iniciarJuego();
  }
  
  function iniciarJuego() {
    vidas = 3;
    puntos = 0;
    juegoPerdido = false;
    nivel = 1;
    crearNivel();
  }
  
  function crearNivel() {
    pelota = new Pelota();
    bloques = [];
    corazones = [];
    textosPuntos = [];
    for (let i = 0; i < vidas; i++) {
      corazones.push(new Corazon3D(60 + i * 40, 540));
    }
  
    if (nivel === 1) {
      filas = 3;
      bloqueAncho = 80;
      bloqueAlto = 40;
      for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
          let x = 60 + c * (bloqueAncho + 10);
          let y = 40 + f * (bloqueAlto + 10);
          bloques.push(new Bloque(x, y, bloqueAncho, bloqueAlto));
        }
      }
    } else if (nivel === 2) {
      filas = 6;
      bloqueAncho = 60;
      bloqueAlto = 30;
      for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
          let x = 60 + c * (bloqueAncho + 10);
          let y = 40 + f * (bloqueAlto + 10);
          if ((f + c) % 5 === 0) {
            bloques.push(new BloqueFuerte(x, y, bloqueAncho + 20, bloqueAlto + 10));
          } else {
            bloques.push(new Bloque(x, y, bloqueAncho, bloqueAlto));
          }
        }
      }
    }
  }
  
  function draw() {
    if (transicion > 0) {
      for (let i = 0; i < 10; i++) {
        fill(random(255), random(255), random(255), 100);
        rect(0, 0, width, height);
      }
      transicion--;
      if (transicion === 0) {
        crearNivel();
      }
      return;
    }
  
    background(55, 20, 10);
    if (juegoPerdido) {
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(48);
      text("¡Perdiste!", width / 2, height / 2 - 40);
      textSize(24);
      text("Presiona ENTER para reiniciar", width / 2, height / 2 + 10);
      return;
    }
  
    for (let bloque of bloques) {
      bloque.mostrar();
    }
  
    let prevX = paddle.x;
    paddle.x = mouseX;
    paddle.vx = paddle.x - prevX;
  
    pelota.mover();
    pelota.rebotar();
    pelota.verificarColisionBloques();
    pelota.verificarColisionPaddle();
    pelota.mostrar();
  
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
  
    for (let i = 0; i < vidas; i++) {
      corazones[i].dibujar();
    }
  
    for (let i = textosPuntos.length - 1; i >= 0; i--) {
      textosPuntos[i].actualizar();
      textosPuntos[i].dibujar();
      if (textosPuntos[i].estaMuerto()) {
        textosPuntos.splice(i, 1);
      }
    }
  
    fill(255);
    textAlign(RIGHT, BOTTOM);
    textSize(24);
    text("Puntos: " + puntos, width - 20, height - 10);
  
    if (bloques.length === 0) {
      nivel++;
      if (nivel > 2) {
        nivel = 1;
      }
      transicion = 60;
    }
  }
  
  function keyPressed() {
    if (juegoPerdido && (key === 'Enter' || keyCode === ENTER)) {
      iniciarJuego();
    }
    if (key === 'w' || key === 'W') {
      bloques = [];
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
  
  class BloqueFuerte extends Bloque {
    constructor(x, y, w, h) {
      super(x, y, w, h);
      this.golpes = 0;
    }
  
    mostrar() {
      let intensidad = map(this.golpes, 0, 2, 0, 255);
      fill(255, 50 - intensidad / 5, 50);
      rect(this.x, this.y, this.w, this.h);
    }
  }
  
  class Pelota {
    constructor() {
      this.x = width / 2;
      this.y = height / 2;
      this.r = 16;
      this.vx = 4;
      this.vy = 4;
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
        if (vidas > 0) {
          vidas -= 1;
          corazones.pop();
          if (vidas === 0) {
            juegoPerdido = true;
          }
        }
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
        this.vx += paddle.vx * 0.2;
        this.vx = constrain(this.vx, -8, 8);
      }
    }
  
    verificarColisionBloques() {
      let r = random(-1, 1);
      for (let i = bloques.length - 1; i >= 0; i--) {
        let b = bloques[i];
        if (
          this.x + this.r > b.x &&
          this.x - this.r < b.x + b.w &&
          this.y + this.r > b.y &&
          this.y - this.r < b.y + b.h
        ) {
          if (b instanceof BloqueFuerte) {
            b.golpes++;
            if (b.golpes >= 3) {
              bloques.splice(i, 1);
              puntos += 300;
              textosPuntos.push(new TextoPunto(this.x, this.y, "+300"));
            }
          } else {
            bloques.splice(i, 1);
            puntos += 100;
            textosPuntos.push(new TextoPunto(this.x, this.y, "+100"));
          }
          if (r > 0) {
            this.vy *= -1;
          }
          this.vx *= -1;
          break;
        }
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
  