// Imágenes de ambiente
let fondo, nube1, nube2, nube3, arbol;
let arbolFondo; 

// Imágenes del juego
let ramaIzq, ramaDer, jugadorImg, hachaIzq, hachaDer, hachaVerde, hachaAmarilla, hachaAzul, troncoImg, ripImg;

// Sonidos
let sndMuerte, sndFinTiempo, sndHachazo;

// Estado del juego
let pausa = true;
let puntos = 0;
let aceptarTecla = true;
let ladoJugador = 'DERECHA'; 

// Barra de tiempo
let anchoBarraIni = 200;
let anchoBarra = 200;
let altoBarra = 20; 
let posXBarra = 0;
let posYBarra = 0;
let tiempoRestante = 0; 

// Jugador y Hacha
let posJugador = { x: 600, y: 360 }; 
let posHacha = { x: 0, y: 0 };
let hachaVisible = false;
let jugadorVisible = false;
let mostrarRip = false;
let animacionCorte = { activo: false, tiempo: 0, x: 405, y: 362, dir: 1 };

// Tronco
let posTronco = { x: 405, y: 362 };
let velTroncoX = 0;
let velTroncoY = -12.5; 
let troncoActivo = false;

// Ramas
let ramas = [];
const NUM_RAMAS = 6;

// Textos
let textoPuntos = "Puntos = 0";
let textoMensaje = "Presiona Enter para comenzar!";


// GARGO

function preload() {
  fondo = loadImage('img/fondo.png');
  arbol = loadImage('img/arbol.png');
  arbolFondo = loadImage('img/arbol2.png'); 
  
  ramaIzq = loadImage('img/ramaIzquierda.png');
  ramaDer = loadImage('img/ramaDerecha.png');
  jugadorImg = loadImage('img/jugador.png');
  hachaIzq = loadImage('img/hachaIzquierda.png');
  hachaDer = loadImage('img/hachaDerecha.png');
  hachaVerde = loadImage('img/hachaDerechaVerd.png');
  hachaAmarilla = loadImage('img/hachaDerechaAma.png');
  hachaAzul = loadImage('img/hachaDerechaAzu.png');
  troncoImg = loadImage('img/tronco.png');
  ripImg = loadImage('img/rip.png');
  
  sndMuerte = loadSound('sonido/muerte.wav');
  sndFinTiempo = loadSound('sonido/fin_tiempo.mp3');
  sndHachazo = loadSound('sonido/hachazo.wav');
}

function setup() {
  createCanvas(960, 540); 
  textAlign(CENTER, CENTER);
  
  posXBarra = width - 10 - anchoBarraIni; 
  posYBarra = 90; 

  for (let i = 0; i < NUM_RAMAS; i++) {
    ramas.push({ lado: 'NINGUNA', x: 0, y: 0 });
  }

  // Llamamos a la función del OTRO archivo js
  mostrarFormularioInicio();
}

function dibujarAmbiente() {
  // Suelo del bosque para dar contexto visual al juego.
  noStroke();
  fill(120, 80, 50, 180);
  rect(0, 430, width, 110);

  fill(200, 220, 180, 180);
  rect(0, 430, width, 18);
}

// POS DE IMG

function draw() {
  background(220);
  if (fondo) image(fondo, 0, 0, width, height);

  if (!pausa) {
    actualizarJuego();
  }

  dibujarAmbiente();

  if (arbolFondo) {
    image(arbolFondo, 190, -200);
    image(arbolFondo, 25, 0);
    image(arbolFondo, 750, -250);
  }

  for (let i = 0; i < NUM_RAMAS; i++) {
    let r = ramas[i];
    if (r.lado !== 'NINGUNA') {
      let imgRama = (r.lado === 'IZQUIERDA') ? ramaIzq : ramaDer;
      if (imgRama) {
        image(imgRama, r.x - imgRama.width/2, r.y - imgRama.height/2);
      }
    }
  }

  if (arbol) image(arbol, 405, 0);
  if (troncoActivo && troncoImg) image(troncoImg, posTronco.x, posTronco.y);

  if (animacionCorte.activo) {
    animacionCorte.tiempo += 1;
    if (animacionCorte.tiempo > 10) animacionCorte.activo = false;
  }

  if (hachaVisible) {
    const mapaHacha = {
      rojo: hachaDer,
      verde: hachaVerde,
      amarillo: hachaAmarilla,
      azul: hachaAzul,
    };
    let imgHacha = mapaHacha[jugadorColor || 'rojo'] || hachaDer;

    if (imgHacha) {
      const baseX = width - 90;
      const baseY = 300;
      const swing = animacionCorte.activo ? constrain(animacionCorte.tiempo / 10, 0, 1) : 0;
      const ease = animacionCorte.activo ? sin(swing * HALF_PI) : 0;

      const targetX = (ladoJugador === 'DERECHA') ? posTronco.x + 18 : posTronco.x - 18;
      const targetY = posTronco.y + 10;
      const axeX = lerp(baseX, targetX, ease);
      const axeY = lerp(baseY, targetY, ease);

      const orientacion = (ladoJugador === 'DERECHA') ? 1 : -1;
      const anguloBase = PI / 2;
      const angulo = animacionCorte.activo ? anguloBase + orientacion * 0.30 * ease : anguloBase;

      push();
      translate(axeX, axeY);
      scale(-1, 1);
      rotate(angulo);
      image(imgHacha, 0, 0, imgHacha.width * 2.5, imgHacha.height * 2.5);
      pop();
    }
  }

  if (mostrarRip && ripImg) {
    image(ripImg, posJugador.x, posJugador.y + 25);
  }

  // USUARIO
  fill(255);
  textSize(40);
  textAlign(LEFT, TOP);
  text(textoPuntos, 10, 60);

  textAlign(RIGHT, TOP);
  text("Tiempo: " + tiempoRestante + "s", width - 10, 60);

  fill(255, 0, 0);
  noStroke();
  rect(posXBarra, posYBarra, anchoBarra, altoBarra);

  if (pausa && !formVisible) {
    textAlign(CENTER, CENTER);
    textSize(50);
    fill(255);
    text(textoMensaje, width / 2, height / 2);
    troncoActivo = false;
    posTronco = { x: 405, y: 362 };
  }
}

// JUEGO

function actualizarJuego() {
  anchoBarra -= 1.0;
  tiempoRestante = floor(anchoBarra / 10);

  if (anchoBarra <= 0) {
    anchoBarra = 0;
    pausa = true;
    textoMensaje = "¡Tiempo terminado!";
    if (audioHabilitado && sndFinTiempo) sndFinTiempo.play();
    mostrarPantallaDerrota(puntos, tiempoRestante, anchoBarraIni, textoMensaje);
  }
  
  if (troncoActivo) {
    posTronco.x += velTroncoX;
    posTronco.y += velTroncoY;
    if (posTronco.x < -50 || posTronco.x > 1000) {
      troncoActivo = false;
      posTronco = { x: 405, y: 362 };
    }
  }

  if (ramas[5].lado === ladoJugador && ramas[5].lado !== 'NINGUNA') {
    morir();
  }

  textoPuntos = "Puntos = " + puntos;
}

function moverRamas() {
  for (let i = NUM_RAMAS - 1; i > 0; i--) {
    ramas[i].lado = ramas[i-1].lado;
  }
  
  let r = floor(random(4));
  if (r === 0) ramas[0].lado = 'IZQUIERDA';
  else if (r === 1) ramas[0].lado = 'DERECHA';
  else ramas[0].lado = 'NINGUNA';

  for (let i = 0; i < NUM_RAMAS; i++) {
    let alturaBase = i * 75; 
    if (ramas[i].lado === 'IZQUIERDA') {
      ramas[i].x = 305; 
      ramas[i].y = alturaBase;
    } else if (ramas[i].lado === 'DERECHA') {
      ramas[i].x = 665; 
      ramas[i].y = alturaBase;
    }
  }
}

function morir() {
  pausa = true;
  jugadorVisible = false;
  hachaVisible = false;
  mostrarRip = true;
  animacionCorte.activo = false;
  textoMensaje = "¡APLASTADO!";
  if (audioHabilitado && sndMuerte) sndMuerte.play();
  mostrarPantallaDerrota(puntos, tiempoRestante, anchoBarraIni, textoMensaje);
}

// Esta función es llamada desde formulario.js
function iniciarJuego() {
  anchoBarra = anchoBarraIni;
  pausa = false;
  puntos = 0;
  jugadorVisible = false;
  mostrarRip = false;
  aceptarTecla = true;
  hachaVisible = true;
  ladoJugador = 'DERECHA';
  animacionCorte = { activo: false, tiempo: 0, x: 405, y: 362, dir: 1 };
  posJugador = { x: 600, y: 360 };
  
  for(let r of ramas) r.lado = 'NINGUNA';
  moverRamas(); 
  
  if(sndFinTiempo) sndFinTiempo.stop();
  if(sndMuerte) sndMuerte.stop();
}

// CONTROLES

function keyPressed() {
  if (key === 'f' || key === 'F') toggleFullscreen();

  if ((keyCode === RETURN || keyCode === ENTER) && !formVisible) {
    mostrarFormularioInicio();
  }

  if (!pausa && aceptarTecla) {
    let sumarBarra = 100.0 - puntos * 0.1;
    if (anchoBarra < anchoBarraIni) anchoBarra += sumarBarra;
    
    puntos++;
    aceptarTecla = false;
    hachaVisible = true;
    troncoActivo = true;
    animacionCorte = {
      activo: true,
      tiempo: 0,
      x: posTronco.x,
      y: posTronco.y,
      dir: (keyCode === LEFT_ARROW) ? 1 : -1
    };
    posTronco = { x: 405, y: 362 };

    if (keyCode === RIGHT_ARROW) {
      ladoJugador = 'DERECHA';
      posJugador = { x: 600, y: 360 };
      posHacha = { x: 537, y: 415 }; 
      velTroncoX = -17.5; 
      if (audioHabilitado && sndHachazo) sndHachazo.play();
    } 
    else if (keyCode === LEFT_ARROW) {
      ladoJugador = 'IZQUIERDA';
      posJugador = { x: 290, y: 360 }; 
      posHacha = { x: 350, y: 415 };   
      velTroncoX = 17.5;  
      if (audioHabilitado && sndHachazo) sndHachazo.play();
    }
    
    moverRamas();
  }
}

function keyReleased() {
  if (!pausa && (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW)) {
    aceptarTecla = true;
    hachaVisible = true;
  }
}

function mousePressed() {
  userStartAudio();
}