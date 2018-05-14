/* Clase modelo de Cerveza. */
/* Constructor sin ID para la inserción en la BDD. (El id se modificará después de insertarse). */
function Cerveza (nombre, grados, tipo, paisOrigen) {
    this.nombre = nombre;
    this.grados = grados;
    this.tipo = tipo;
    this.paisOrigen = paisOrigen;
}

/* Constructor con ID para la recogida de datos de la BDD. */
function Cerveza (nombre, grados, tipo, paisOrigen, id) {
    this.nombre = nombre;
    this.grados = grados;
    this.tipo = tipo;
    this.paisOrigen = paisOrigen;
    this.id = id;
}