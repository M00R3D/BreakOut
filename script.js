    function setup() 
    {
        createCanvas(600, 600);
        background(220); //gris claro
    }

    // Función de dibujo, se ejecuta en bucle
    function draw() 
    {
        fill(255, 100, 100);//rojo claro
        // noStroke();
        ellipse(width / 2, height / 2, 100, 100);
        // noLoop(); // Dibuja solo una vez
    }
