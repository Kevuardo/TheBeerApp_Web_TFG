$(document).ready(function() {
  /* Llama la primera vez a la función y luego la invoca en el hilo del setInterval(). */
  cambiarFondo();
  setInterval(cambiarFondo, 6000);
});

/* Cambia el color del fondo periódicamente (cada 6 segundos), referenciando al elemento body. */
function cambiarFondo() {
  /* Selecciona un color aleatorio inicial. */
  var red = Math.floor(Math.random() * 256);
  var green = Math.floor(Math.random() * 256);
  var blue = Math.floor(Math.random() * 256);
  var nuevoColor = "rgba(" + red + ", " + green + ", " + blue + ", 0.5)";

  /* Asigna el valor del nuevo color al body. */
  $("html").css("background", nuevoColor);
}
