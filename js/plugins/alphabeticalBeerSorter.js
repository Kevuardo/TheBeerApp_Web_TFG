/* Método que será llamado por el método de JavaScript predefinido sort(), y que servirá para ordenar
las cervezas alfabéticamente en función de su nombre, y según el valor retornado. */
function compararCervezas(cervezaA, cervezaB) {
    if (cervezaA.nombre < cervezaB.nombre) {
        return -1;
    } else if (cervezaA.nombre > cervezaB.nombre) {
        return 1;
    } else {
        return 0;
    }
}