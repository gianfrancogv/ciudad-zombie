/* El objeto Juego sera el encargado del control de todo el resto de los Objetos
existentes.
Le dara ordenes al Dibujante para que dibuje entidades en la pantalla. Cargara
el mapa, chequeara colisiones entre los objetos y actualizara sus movimientos
y ataques. Gran parte de su implementacion esta hecha, pero hay espacios con el
texto COMPLETAR que deben completarse segun lo indique la consigna.

El objeto Juego contiene mucho codigo. Tomate tu tiempo para leerlo tranquilo
y entender que es lo que hace en cada una de sus partes. */

var Juego = {
  // Aca se configura el tamaño del canvas del juego
  anchoCanvas: 961,
  altoCanvas: 577,
  jugador: Jugador,
  vidasInicial: Jugador.vidas,
  // Indica si el jugador ganó
  ganador: false,

  //Obstáculos visibles carretera
  obstaculosCarretera: [
    new Obstaculo('imagenes/auto_verde_abajo.png', 80, 360, 15, 30, 3),
    new Obstaculo('imagenes/auto_verde_abajo.png', 780, 200, 15, 30, 3),
    new Obstaculo('imagenes/auto_verde_abajo.png', 830, 100, 15, 30, 3),
    new Obstaculo('imagenes/auto_verde_derecha.png', 450, 90, 30, 15, 3),
    new Obstaculo('imagenes/bache.png', 150, 280, 30, 30, 1),
    new Obstaculo('imagenes/bache.png', 460, 450, 30, 30, 1),
    new Obstaculo('imagenes/bache.png', 850, 400, 30, 30, 1),
    new Obstaculo('imagenes/valla_horizontal.png', 70, 430, 30, 30, 2),
    new Obstaculo('imagenes/valla_horizontal.png', 420, 380, 30, 30, 2),
    new Obstaculo('imagenes/valla_vertical.png', 280, 200, 30, 30, 2),
    new Obstaculo('imagenes/valla_vertical.png', 300, 400, 30, 30, 2),
    new Obstaculo('imagenes/valla_vertical.png', 460, 300, 30, 30, 2),
    new Obstaculo('imagenes/valla_vertical.png', 520, 470, 30, 30, 2)
  ],

  /* Bordes con los que se puede chocar, por ejemplo, la vereda.
   Ya estan ubicados en sus lugares correspondientes. Ya aparecen en el mapa, ya
   que son invisibles. No tenes que preocuparte por ellos.*/
  bordes: [
    // Bordes
    new Obstaculo('', 0, 5, 961, 18, 0),
    new Obstaculo('', 0, 559, 961, 18, 0),
    new Obstaculo('', 0, 5, 18, 572, 0),
    new Obstaculo('', 943, 5, 18, 572, 0),
    // Veredas
    new Obstaculo('', 18, 23, 51, 536, 2),
    new Obstaculo('', 69, 507, 690, 52, 2),
    new Obstaculo('', 587, 147, 173, 360, 2),
    new Obstaculo('', 346, 147, 241, 52, 2),
    new Obstaculo('', 196, 267, 263, 112, 2),
    new Obstaculo('', 196, 23, 83, 244, 2),
    new Obstaculo('', 279, 23, 664, 56, 2),
    new Obstaculo('', 887, 79, 56, 480, 2)
  ],
  
  // Los enemigos
  enemigos: [
    new ZombieCaminante('imagenes/zombie1.png', 100, 280, 10, 10, 1, {desdeX: 80, hastaX: 140, desdeY: 200, hastaY: 350}),
    new ZombieCaminante('imagenes/zombie1.png', 500, 250, 10, 10, 1, {desdeX: 470, hastaX: 540, desdeY: 200, hastaY: 300}),
    new ZombieCaminante('imagenes/zombie2.png', 350, 480, 10, 10, 1, {desdeX: 330, hastaX: 370, desdeY: 450, hastaY: 490}),
    new ZombieCaminante('imagenes/zombie3.png', 800, 220, 10, 10, 1, {desdeX: 800, hastaX: 820, desdeY: 200, hastaY: 250}),
    new ZombieCaminante('imagenes/zombie3.png', 770, 480, 10, 10, 1, {desdeX: 765, hastaX: 810, desdeY: 450, hastaY: 500}),
    new ZombieCaminante('imagenes/zombie4.png', 600, 100, 10, 10, 1, {desdeX: 550, hastaX: 620, desdeY: 80, hastaY: 120}),
    new ZombieCaminante('imagenes/zombie4.png', 550, 400, 10, 10, 1, {desdeX: 500, hastaX: 580, desdeY: 350, hastaY: 420}),
    new ZombieConductor('imagenes/tren_horizontal.png', 20, 325, 90, 30, 6, {desdeX: 0, hastaX: 860, desdeY: 325, hastaY: 325}, 'h'),
    new ZombieConductor('imagenes/tren_vertical.png', 644, 40, 30, 90, 4, {desdeX: 644, hastaX: 644, desdeY: 30, hastaY: 470}, 'v'),
    new ZombieConductor('imagenes/tren_vertical.png', 674, 40, 30, 90, 6, {desdeX: 674, hastaX: 674, desdeY: 30, hastaY: 470}, 'v')
  ]

}

/* Se cargan los recursos de las imagenes, para tener un facil acceso
a ellos. No hace falta comprender esta parte. Pero si queres agregar tus propies
imagenes tendras que poner su ruta en la lista para que pueda ser precargada como
todas las demas. */
Juego.iniciarRecursos = function() {
  Resources.load([
    'imagenes/mapa.png',
    'imagenes/mensaje_gameover.png',
    'imagenes/Splash.png',
    'imagenes/bache.png',
    'imagenes/tren_horizontal.png',
    'imagenes/tren_vertical.png',
    'imagenes/valla_horizontal.png',
    'imagenes/valla_vertical.png',
    'imagenes/zombie1.png',
    'imagenes/zombie2.png',
    'imagenes/zombie3.png',
    'imagenes/zombie4.png',
    'imagenes/auto_rojo_abajo.png',
    'imagenes/auto_rojo_arriba.png',
    'imagenes/auto_rojo_derecha.png',
    'imagenes/auto_rojo_izquierda.png',
    'imagenes/auto_verde_abajo.png',
    'imagenes/auto_verde_derecha.png',
    'imagenes/llegada.png'
  ]);
  Resources.onReady(this.comenzar.bind(Juego));
};

// Agrega los bordes de las veredas a los obstaculos de la carretera:
Juego.obstaculos = function() {
  return this.obstaculosCarretera.concat(this.bordes);
};

Juego.comenzar = function() {
  // Inicializar el canvas del juego
  Dibujante.inicializarCanvas(this.anchoCanvas, this.altoCanvas);
  /* El bucle principal del juego se llamara continuamente para actualizar
  los movimientos y el pintado de la pantalla. Sera el encargado de calcular los
  ataques, colisiones, etc*/
  this.buclePrincipal();
};

Juego.buclePrincipal = function() {

  // Con update se actualiza la logica del juego, tanto ataques como movimientos
  this.update();
  // Funcion que dibuja por cada fotograma a los objetos en pantalla.
  this.dibujar();
  // Esto es una forma de llamar a la funcion Juego.buclePrincipal() repetidas veces
  window.requestAnimationFrame(this.buclePrincipal.bind(this));
};

Juego.update = function() {
  this.calcularAtaques();
  this.moverEnemigos();
}
// Captura las teclas y si coincide con alguna de las flechas tiene que
// hacer que el jugador principal se mueva
Juego.capturarMovimiento = function(tecla) {
  var movX = 0;
  var movY = 0;
  var velocidad = this.jugador.velocidad;

  // El movimiento esta determinado por la velocidad del jugador:

  switch (tecla) {
    case 'izq':
      movX = -velocidad;
      Jugador.sprite = 'imagenes/auto_rojo_izquierda.png'
      Jugador.alto = 15;
      Jugador.ancho = 30;
      break;

    case 'arriba':
      movY = -velocidad;
      Jugador.sprite = 'imagenes/auto_rojo_arriba.png'
      Jugador.ancho = 15;
      Jugador.alto = 30;
      break;
    
    case 'der':
      movX = velocidad;
      Jugador.sprite = 'imagenes/auto_rojo_derecha.png'
      Jugador.alto = 15;
      Jugador.ancho = 30;
      break;

    case 'abajo':
      movY = velocidad;
      Jugador.sprite = 'imagenes/auto_rojo_abajo.png'
      Jugador.ancho = 15;
      Jugador.alto = 30;
      break;
  };

  // Si se puede mover hacia esa posicion hay que hacer efectivo este movimiento
  if (this.chequearColisiones(movX + this.jugador.x, movY + this.jugador.y)) {
    Jugador.x += movX;
    Jugador.y += movY;
  };
};

Juego.dibujar = function() {
  // Borrar el fotograma actual
  Dibujante.borrarAreaDeJuego();
  //Se pinta la imagen de fondo segun el estado del juego
  this.dibujarFondo();

  // "Dibujante dibuja al jugador"
  Dibujante.dibujarEntidad(Jugador);

  // Se recorren los obstaculos de la carretera pintandolos
  this.obstaculosCarretera.forEach(function(obstaculo) {
    Dibujante.dibujarEntidad(obstaculo);
  });

  // Se recorren los enemigos pintandolos
  this.enemigos.forEach(function(enemigo) {
    Dibujante.dibujarEntidad(enemigo);
  });

  // El dibujante dibuja las vidas del jugador
  var tamanio = this.anchoCanvas / this.vidasInicial;
  Dibujante.dibujarRectangulo('white', 0, 0, this.anchoCanvas, 8);
  for (var i = 0; i < this.jugador.vidas; i++) {
    var x = tamanio * i
    Dibujante.dibujarRectangulo('red', x, 0, tamanio, 8);
  };

  // El dibujante dibuja la meta
    Dibujante.dibujarImagen('imagenes/llegada.png', 760, 529, 126, 20);
};

// El Jugador pierde vidas
Jugador.perderVidas = function(cantVidas) {
  this.vidas -= cantVidas;
}

/* Recorre los enemigos haciendo que se muevan. De la misma forma que hicimos
un recorrido por los enemigos para dibujarlos en pantalla ahora habra que hacer
una funcionalidad similar pero para que se muevan.*/
Juego.moverEnemigos = function() {
  this.enemigos.forEach(function(enemigo){
    enemigo.mover();
  }); 
};

/* Recorre los enemigos para ver cual esta colisionando con el jugador
Si colisiona empieza el ataque el zombie, si no, deja de atacar.
Para chequear las colisiones estudiar el metodo posicionValida. Alli
se ven las colisiones con los obstaculos. En este caso sera con los zombies. */
Juego.calcularAtaques = function() {
  this.enemigos.forEach(function(enemigo) {
    if (this.intersecan(enemigo, this.jugador, this.jugador.x, this.jugador.y)) {
      /* Si el enemigo colisiona debe empezar su ataque*/
      enemigo.comenzarAtaque(Jugador);
    } else {
      /* Sino, debe dejar de atacar*/
      enemigo.dejarDeAtacar();
    }
  }, this);
};

/* Aca se chequea si el jugador se peude mover a la posicion destino.
 Es decir, que no haya obstaculos que se interpongan. De ser asi, no podra moverse */
Juego.chequearColisiones = function(x, y) {
  var puedeMoverse = true;
  this.obstaculos().forEach(function(obstaculo) {
    if (this.intersecan(obstaculo, this.jugador, x, y)) {
      if (obstaculo.sprite === 'imagenes/auto_verde_abajo.png' || obstaculo.sprite === 'imagenes/auto_verde_derecha.png') {
      Jugador.perderVidas(obstaculo.potencia);
      obstaculo.potencia = 0;
      } else if (obstaculo.sprite === 'imagenes/bache.png') {
      Jugador.perderVidas(obstaculo.potencia);
      obstaculo.potencia = 0;
      } else if (obstaculo.sprite === 'imagenes/valla_horizontal.png' || obstaculo.sprite === 'imagenes/valla_vertical.png') {
      Jugador.perderVidas(obstaculo.potencia);
      obstaculo.potencia = 0;
      } else {
      Jugador.perderVidas(0);
      }
      puedeMoverse = false;
    }
  }, this);
  return puedeMoverse;
};

/* Este metodo chequea si los elementos 1 y 2 si cruzan en x e y
 x e y representan la coordenada a la cual se quiere mover el elemento2*/
Juego.intersecan = function(elemento1, elemento2, x, y) {
  var izquierda1 = elemento1.x;
  var derecha1 = izquierda1 + elemento1.ancho;
  var techo1 = elemento1.y;
  var piso1 = techo1 + elemento1.alto;
  var izquierda2 = x;
  var derecha2 = izquierda2 + elemento2.ancho;
  var techo2 = y;
  var piso2 = y + elemento2.alto;

  return ((piso1 >= techo2) && (techo1 <= piso2) &&
    (derecha1 >= izquierda2) && (izquierda1 <= derecha2))
};

Juego.dibujarFondo = function() {
  // Si se termino el juego hay que mostrar el mensaje de game over de fondo
  if (this.terminoJuego()) {
    Dibujante.dibujarImagen('imagenes/mensaje_gameover.png', 0, 5, this.anchoCanvas, this.altoCanvas);
    document.getElementById('reiniciar').style.visibility = 'visible';
  }

  // Si se gano el juego hay que mostrar el mensaje de ganoJuego de fondo
  else if (this.ganoJuego()) {
    Dibujante.dibujarImagen('imagenes/Splash.png', 190, 113, 500, 203);
    document.getElementById('reiniciar').style.visibility = 'visible';
  } else {
    Dibujante.dibujarImagen('imagenes/mapa.png', 0, 5, this.anchoCanvas, this.altoCanvas);
  }
};

Juego.terminoJuego = function() {
  return this.jugador.vidas <= 0;
};

/* Se gana el juego si se sobre pasa cierto altura y */
Juego.ganoJuego = function() {
  return (this.jugador.y + this.jugador.alto) > 530;
};

Juego.iniciarRecursos();

// Activa las lecturas del teclado al presionar teclas
// Documentacion: https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener
document.addEventListener('keydown', function(e) {
  var allowedKeys = {
    37: 'izq',
    38: 'arriba',
    39: 'der',
    40: 'abajo'
  };

  Juego.capturarMovimiento(allowedKeys[e.keyCode]);
});
