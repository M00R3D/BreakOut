// Examen de Graficación y multimedia IDS TV 8vo Semestre Dasc Uabcs
// Moore Garay Job         Salgado Castillo Isaias

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
  let estadoGanaste = false;

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
  let estadoJuego = "inicio";
  let controlMode = null;
  let leftPressed = false;
  let rightPressed = false;
  let spd=0;
  function setup() {
    const cnv = createCanvas(1000, 600);
    cnv.elt.tabIndex = 1000;
    cnv.elt.focus();
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
    else if (nivel === 3) {
        filas = 5;
        columnas = 12;
        bloqueAncho = 60;
        bloqueAlto = 30;
        for (let f = 0; f < filas; f++) {
          for (let c = 0; c < columnas; c++) {
            let x = 40 + c * (bloqueAncho + 8);
            let y = 50 + f * (bloqueAlto + 8);
            let tipoAleatorio = int(random(10));
            if (tipoAleatorio < 2) {
              bloques.push(new BloqueIndestructible(x, y, bloqueAncho, bloqueAlto));
            //   continue;
            } else if (tipoAleatorio < 4) {
              bloques.push(new BloqueFuerte(x, y, bloqueAncho, bloqueAlto));
            } else {
              bloques.push(new BloqueParpadeante(x, y, bloqueAncho, bloqueAlto));
            }
          }
        }
        bloques.push(new BloqueIndestructible(-20, 0 , 20, height));
        bloques.push(new BloqueIndestructible(width, 0 , 20, height));
      }
      
  
    
  }
  
  function draw() {
    if(nivel==1){spd=0;}else if(nivel==2){spd=1;}else if (nivel==3){spd=2;}
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
  
    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(color(200, 230, 255), color(150, 200, 200), inter);
        stroke(c);
        line(0, y, width, y);
      }

      if (juegoPerdido) {
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(48);
      text("¡Perdiste!", width / 2, height / 2 - 40);
      textSize(24);
      text("Presiona ENTER para reiniciar", width / 2, height / 2 + 10);
      return;
    }

    if (estadoJuego === "inicio") {
      mostrarPantallaInicio();
      return;
    }
  
    if (estadoJuego === "instrucciones") {
      mostrarPantallaInstrucciones();
      return;
    }
  
    if (estadoJuego === "perdido") {
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(48);
      text("¡Perdiste!", width / 2, height / 2 - 40);
      textSize(24);
      text("Presiona ENTER para reiniciar", width / 2, height / 2 + 10);
      return;
    }
    if (estadoGanaste) {
        background(0, 150, 0);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(48);
        text("¡Ganaste el juego!", width / 2, height / 2 - 40);
        textSize(24);
        text("Presiona ENTER para jugar de nuevo", width / 2, height / 2 + 10);
        return;
      }
      
    for (let bloque of bloques) {
      bloque.mostrar();
    }
  
    let prevX = paddle.x;
    if (controlMode === "mouse") {
      paddle.x = mouseX;
    } else if (controlMode === "keyboard") {
      if (keyIsDown(LEFT_ARROW))  paddle.x -= 8;
      if (keyIsDown(RIGHT_ARROW)) paddle.x += 8;
    }
    paddle.x = constrain(paddle.x, paddle.width/2, width - paddle.width/2);
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
    fill(0);
    textAlign(LEFT, TOP);
    textSize(24);
    text("Nivel: " + nivel, 10, 10);
    if (bloques.length === 0) {
        nivel++;
        if (nivel > 3) {
          estadoGanaste = true;
          return;
        }
        transicion = 60;
    }
    
      
  }
  
  function mousePressed() {
    if (estadoJuego === "inicio") {
      let btnW = 300, btnH = 50,
          btnX = width/2 - btnW/2,
          btnY1 = height/2 - 20,
          btnY2 = btnY1 + 70;
      if (mouseX > btnX && mouseX < btnX+btnW) {
        if (mouseY > btnY1 && mouseY < btnY1+btnH) {
          controlMode = "mouse";
          estadoJuego = "juego";
          iniciarJuego();
        }
        if (mouseY > btnY2 && mouseY < btnY2+btnH) {
          controlMode = "keyboard";
          estadoJuego = "juego";
          iniciarJuego();
        }
      }
    }
  }
  function keyPressed() {
    if (estadoJuego === "juego" && controlMode === "keyboard") {
      if (keyCode === LEFT_ARROW)  leftPressed = true;
      if (keyCode === RIGHT_ARROW) rightPressed = true;
    }
    if (juegoPerdido && (key === 'Enter' || keyCode === ENTER)) {
      iniciarJuego();
    }
    if (key === 'w' || key === 'W') {
      bloques = [];
    }
    if (estadoJuego === "inicio") {
      if (key === 'Enter' || keyCode === ENTER) {
        iniciarJuego();
        estadoJuego = "juego";
      } else if (key === 'i' || key === 'I') {
        estadoJuego = "instrucciones";
      }
    } else if (estadoJuego === "instrucciones") {
      if (key === ESCAPE) {
        estadoJuego = "inicio";
      }
    } else if (estadoJuego === "perdido") {
      if (key === 'Enter' || keyCode === ENTER) {
        iniciarJuego();
        estadoJuego = "juego";
      }
    }else if (estadoGanaste && key === 'Enter' || keyCode === ENTER) {
            // iniciarJuego();
            estadoJuego="inicio";
          estadoGanaste = false;
        }
      
  }
  function keyReleased() {
    if (estadoJuego === "juego" && controlMode === "keyboard") {
      if (keyCode === LEFT_ARROW)  leftPressed = false;
      if (keyCode === RIGHT_ARROW) rightPressed = false;
    }
  }
  function mostrarPantallaInicio() {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text("Bienvenido al Juego de Bloques", width/2, height/2 - 100);
  
    // Botón Mouse
    let btnW=300, btnH=50, btnX=width/2 - btnW/2, btnY1=height/2 - 20;
    fill(80);
    rect(btnX, btnY1, btnW, btnH, 10);
    fill(255);
    textSize(24);
    text("Control: MOUSE", width/2, btnY1 + btnH/2);
  
    // Botón Teclado
    let btnY2 = btnY1 + 70;
    fill(80);
    rect(btnX, btnY2, btnW, btnH, 10);
    fill(255);
    text("Control: TECLADO", width/2, btnY2 + btnH/2);
  
    textSize(16);
    text("Haz clic para elegir tu modo de control", width/2, btnY2 + btnH + 30);
  }
  
  function mostrarPantallaInstrucciones() {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("¿Cómo jugar?", width/2, 100);
  
    textSize(22);
    text("Destruye todos los bloques con la pelota", width/2, 160);
    text("Tienes 3 vidas representadas por corazones", width/2, 200);
    text("Si la pelota cae 3 veces, pierdes", width/2, 240);
    text("Puntos por bloque: 100 / 300 (fuerte)", width/2, 280);
  
    textSize(20);
    text("Controles:", width/2, 330);
    text("- Mouse: mueve la paleta libremente", width/2, 360);
    text("- Teclado: flechas ← →", width/2, 390);
  
    textSize(16);
    text("Presiona ESC para volver al inicio", width/2, 440);
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
        if(pelota.x>width){pelota.x-=2;}
        if(pelota.x<0){pelota.x+=2;}
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
  class BloqueParpadeante {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.visible = true;
      this.vida = 1;
    }
  
    mostrar() {
      if (frameCount % 30 < 15) {
        fill(255, 255, 0);
      } else {
        fill(255, 0, 255);
      }
      rect(this.x, this.y, this.w, this.h, 8);
    }
  
    contiene(px, py) {
      return px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h;
    }
  }
  class BloqueIndestructible {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
  
    mostrar() {
      fill(0);
      rect(this.x, this.y, this.w, this.h, 5);
    }
  
    contiene(px, py) {
      return px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h;
    }
  
    destruir() {
      return false;
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
      this.x += this.vx +spd;
      this.y += this.vy; +spd
      this.vx = constrain(this.vx, -8, 8);
this.vy = constrain(this.vy, -8, 8);

    }
  
    rebotar() {
      if (this.x - this.r <= 0 || this.x + this.r >= width) {
        this.vx *= -1;
        this.x  -=3;
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
            estadoJuego = "perdido";
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
              puntos += 1;
              textosPuntos.push(new TextoPunto(this.x, this.y, "+1"));
            }
          } else {
            bloques.splice(i, 1);
            puntos += 1;
            textosPuntos.push(new TextoPunto(this.x, this.y, "+1"));
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
  