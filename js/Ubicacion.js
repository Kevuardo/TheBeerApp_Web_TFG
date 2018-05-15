/* Clase modelo de Ubicación (ubicaciones de Maps). */
/* Constructor sin ID para la inserción en la BDD. (El id se modificará después de insertarse). */
function Ubicacion (titulo, latitud, longitud) {
    this.titulo = titulo;
    this.latitud = latitud;
    this.longitud = longitud;
}

/* Constructor con ID para la recogida de datos de la BDD. */
function Ubicacion (titulo, latitud, longitud, id) {
    this.titulo = titulo;
    this.latitud = latitud;
    this.longitud = longitud;
    this.id = id;
}