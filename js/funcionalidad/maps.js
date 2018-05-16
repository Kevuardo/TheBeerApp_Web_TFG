var mapa;

function iniciarMapa() {
   console.log('API de Maps cargado correctamente');
}

function initMap(idCerveza, ubicacionesCerveza) {

    /* El selector $ de por sí retorna un objeto jQuery, no compatible con el API de Maps.
    Es por ello que, para convertir el objeto jQuery en un objeto DOM compatible, se usa [0]. */
    var elementoMapa = $('.mapa-cerveza#mapa-' + idCerveza)[0];

    /* Inicia el mapa por defecto centrado en la última ubicación recogida de la BDD. */
    mapa = new google.maps.Map(elementoMapa, {
        zoom: 12,
        center: {lat: ubicacionesCerveza[ubicacionesCerveza.length - 1].latitud, lng: ubicacionesCerveza[ubicacionesCerveza.length - 1].longitud }
    });

    /* Vacía el array de marcadores cada vez que se instancia un nuevo mapa. */
    coleccionMarcadores = [];
    var nuevoLatLng;
    var nuevoMarcador;

    /* Por cada ubicación, crea un marcador. */
    for(var i = 0; i < ubicacionesCerveza.length; i++) {
        nuevoLatLng = {lat: ubicacionesCerveza[i].latitud, lng: ubicacionesCerveza[i].longitud};
        nuevoMarcador = new google.maps.Marker({
            position: nuevoLatLng,
            map: mapa,
            title: ubicacionesCerveza.titulo
        });
    }
}