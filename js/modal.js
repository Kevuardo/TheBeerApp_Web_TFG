/* Se encarga de rellenar el esqueleto de un modal predefinido en función del tipo de invocación, 
la cerveza con la que interactúa el usuario y el tipo de operación a realizar. */
function configurarModal(tipoModal, cerveza, operacionModal) {

    /* En función del tipo de invocación al modal, lo configura de una manera u otra
    ya que tendrán distintas operaciones. */
    switch(tipoModal) {

        /* Se invoca desde una cerveza favorita (desde el listado del panel). */
        case 'listaFavorita':

            switch(operacionModal) {

                case 'ubicacion':

                    $('.cerveza-favorita#' + cerveza.id + '> .modal').attr('id', 'modal-ubicar-favorita-' + cerveza.id);

                    /* Busca las ubicaciones almacenadas en la BDD para cargarlas en un mapa. */
                    var nodoUbicaciones = database.ref('ubicaciones');
                    nodoUbicaciones.on('value', function(_ubicaciones) {

                        /* Vacía el array para introducir cada una de las ubicaciones con sus datos actualizados. */            
                        coleccionUbicaciones = [];

                        _ubicaciones.forEach(function(_ubicacion) {
                            var titulo = '';
                            var latitud = 0;
                            var longitud = 0;
                            var id = _ubicacion.key;
                
                            _ubicacion.forEach(function(_parametro) {
                                /* Recoge los parámetros almacenados en la BDD. */
                                if (_parametro.key == 'titulo') {
                                    titulo = _parametro.val();
                                } else if (_parametro.key == 'latitud') {
                                    latitud = _parametro.val();
                                } else if (_parametro.key == 'longitud') {
                                    longitud = _parametro.val();
                                }
                            });
                
                            /* Crea un nuevo objeto por cada favorita y lo guarda en la colección. */
                            if (
                                titulo.trim() != '' &&
                                !isNaN(latitud) &&
                                !isNaN(longitud) &&
                                id.trim() != ''
                            ) {
                                nuevaUbicacion = new Ubicacion(
                                titulo, latitud, longitud, id
                                );
                                coleccionUbicaciones.push(nuevaUbicacion);
                            }
                        });

                        if (coleccionUbicaciones.length == 0) {
                            
                            $('.cerveza-favorita#' + cerveza.id + '> .modal > .modal-content > .modal-body').html(
                                '<b>No se han encontrado ubicaciones para esta cerveza</b>'
                            );

                        } else {

                            $('.cerveza-favorita#' + cerveza.id + '> .modal').attr('id', 'modal-ubicar-favorita-' + cerveza.id);
                            $('.cerveza-favorita#' + cerveza.id + '> .modal > .modal-content > .modal-header').html(
                                '<span class="cerrar-modal">&times;</span>'
                                + '<h2>Ubicaciones de ' + cerveza.nombre + '</h2>'
                            );
                            $('.cerveza-favorita#' + cerveza.id + '> .modal > .modal-content > .modal-body').html(
                                '<b><span class="anotacion">Nota:</span> por defecto, todas las cervezas comparten las mismas 2 ubicaciones</b>'
                                + '<div class="mapa-cerveza" id="mapa-' + cerveza.id + '"></div>'
                            );

                            initMap(cerveza.id, coleccionUbicaciones);

                        }

                    });

                    /* Muestra el modal correspondiente. */
                    mostrarModal('.modal#modal-ubicar-favorita-' + cerveza.id);

                    $('#modal-ubicar-favorita-' + cerveza.id + " > .modal-content > .modal-header > .cerrar-modal").on('click', function() {
                        
                        /* Esconde el modal. */
                        esconderModal('.modal#modal-ubicar-favorita-' + cerveza.id);

                    });

                    /* Captura cuándo se clica fuera del contenido del modal para cerrarlo también. */
                    $('.modal#modal-ubicar-favorita-' + cerveza.id).on('click', function(event) {
                
                        /* Esconde el modal si se ha clicado fuera del contenido del mismo. */
                        if (event.target == $('.modal#modal-ubicar-favorita-' + cerveza.id)[0]) {
                            esconderModal('.modal#modal-ubicar-favorita-' + cerveza.id);
                        }

                    });

                    break;

                case 'favorita':
    
                    /* Rellena el esqueleto previamente definido para esa cerveza favorita. */
                    $('.cerveza-favorita#' + cerveza.id + '> .modal').attr('id', 'modal-eliminar-favorita-' + cerveza.id);
                    $('.cerveza-favorita#' + cerveza.id + '> .modal > .modal-content > .modal-header').html(
                        '<span class="cerrar-modal">&times;</span>'
                        + '<h2>Eliminar como favorita</h2>'
                    );
                    $('.cerveza-favorita#' + cerveza.id + '> .modal > .modal-content > .modal-body').html(
                        '<b>¿Está seguro de querer eliminar la cerveza "' + cerveza.nombre + '" como favorita?</b>'
                        + '<div class="botones fila">'
                            + '<button class="boton-personalizado btnVerde" id="eliminar-favorita-' + cerveza.id + '">Eliminar favorita</button>'
                            + '<button class="boton-personalizado btnRojo" id="cancelar-eliminar-favorita-' + cerveza.id + '">Cancelar</button>'
                        + '</div>'
                    );
    
                    /* Muestra el modal correspondiente. */
                    mostrarModal('.modal#modal-eliminar-favorita-' + cerveza.id);
    
                    /* Añade listeners a los botones inferiores del modal y al botón superior. */
                    $('.modal#modal-eliminar-favorita-' + cerveza.id + " > .modal-content > .modal-body > .botones > #eliminar-favorita-" + cerveza.id).on('click', function() {
                        
                        /* Esconde el modal y el contenedor de la cerveza favorita, y elimina la cerveza de las favoritas del usuario en la BDD. */
                        esconderModal('.modal#modal-eliminar-favorita-' + cerveza.id);
    
                        var usuarioActual = firebase.auth().currentUser; /* El usuario que tiene sesión iniciada en el momento. */
                        
                        var database = firebase.database();
                        database.ref('usuarios/' + usuarioActual.uid + '/favoritas/' + cerveza.id).remove();
    
                    });
    
                    $('.modal#modal-eliminar-favorita-' + cerveza.id + " > .modal-content > .modal-body > .botones > #cancelar-eliminar-favorita-" + cerveza.id).on('click', function() {
                        
                        /* Esconde el modal. */
                        esconderModal('.modal#modal-eliminar-favorita-' + cerveza.id);
    
                    });
    
                    $('.modal#modal-eliminar-favorita-' + cerveza.id + " > .modal-content > .modal-header > .cerrar-modal").on('click', function() {
                        
                        /* Esconde el modal. */
                        esconderModal('.modal#modal-eliminar-favorita-' + cerveza.id);
    
                    });
    
                    /* Captura cuándo se clica fuera del contenido del modal para cerrarlo también. */            
                    $('.modal#modal-eliminar-favorita-' + cerveza.id).on('click', function(event) {
    
                        /* Esconde el modal si se ha clicado fuera del contenido del mismo. */
                        if (event.target == $('.modal#modal-eliminar-favorita-' + cerveza.id)[0]) {
                            esconderModal('.modal#modal-eliminar-favorita-' + cerveza.id);
                        }
    
                    });
    
                    break;
    
                case 'detalle':
    
                    /* Rellena el esqueleto previamente definido para esa cerveza favorita. */
                    $('.cerveza-favorita#' + cerveza.id + '> .modal').attr('id', 'modal-detalle-favorita-' + cerveza.id);
                    $('.cerveza-favorita#' + cerveza.id + '> .modal > .modal-content > .modal-header').html(
                        '<span class="cerrar-modal">&times;</span>'
                        + '<h2>Detalle de ' + cerveza.nombre + '</h2>'
                    );
                    $('.cerveza-favorita#' + cerveza.id + '> .modal > .modal-content > .modal-body').html(
    
                        '<div class="contenedor-detalle columna">'
                            + '<div class="imagen-detalle">'
                                + '<img src="assets/img/ca_icono_color.png" alt="' + cerveza.nombre + '" title="' + cerveza.nombre + '">'
                            + '</div>'
                            + '<div class="campos-detalle columna">'
                                + '<b>Nombre: ' + cerveza.nombre + '</b>'
                                + '<b>Grados: ' + cerveza.grados + '%</b>'
                                + '<b>Tipo: ' + cerveza.tipo + '</b>'
                                + '<b>País de origen: ' + cerveza.paisOrigen + '</b>'
                                + '<b>Descripción: Descripción comercial de la cerveza por defecto.</b>'
                            + '</div>'
                            + '<div class="botones columna">'
                                + '<button class="boton-personalizado btnAmarillo" id="marcar-favorita-' + cerveza.id + '">Favorita <i class="fa fa-star-half-o" aria-hidden="true"></i></button>'
                                + '<button class="boton-personalizado btnVerde" id="ubicar-favorita-' + cerveza.id + '">Ubicar <i class="fa fa-map-marker" aria-hidden="true"></i></button>'
                            + '</div>'
                        + '</div>'
    
                    );
    
                    /* Muestra el modal correspondiente. */
                    mostrarModal('.modal#modal-detalle-favorita-' + cerveza.id);
                    
                    /* Añade listeners a los botones laterales del modal y al botón superior. */
                    /* Como este es el modal de una cerveza favorita, la operación de alternar favorita se considera por defecto eliminación de favorita. */
                    $('.modal#modal-detalle-favorita-' + cerveza.id + " > .modal-content > .modal-body > .contenedor-detalle > .botones > #marcar-favorita-" + cerveza.id).on('click', function() {
                        
                        /* Cambia la configuración del modal para que sea la de 'favorita'. */
                        configurarModal('listaFavorita', cerveza, 'favorita');
    
                    });
    
                    $('.modal#modal-detalle-favorita-' + cerveza.id + " > .modal-content > .modal-body > .contenedor-detalle > .botones > #ubicar-favorita-" + cerveza.id).on('click', function() {
                        
                        /* Cambia la configuración del modal para que sea la de 'favorita'. */
                        configurarModal('listaFavorita', cerveza, 'ubicacion');
    
                    });
    
                    $('.modal#modal-detalle-favorita-' + cerveza.id + " > .modal-content > .modal-header > .cerrar-modal").on('click', function() {
                        
                        /* Esconde el modal. */
                        esconderModal('.modal#modal-detalle-favorita-' + cerveza.id);
    
                    });
                    
                    /* Captura cuándo se clica fuera del contenido del modal para cerrarlo también. */
                    $('.modal#modal-detalle-favorita-' + cerveza.id).on('click', function(event) {
                        
                        /* Esconde el modal. */
                        if (event.target == $('.modal#modal-detalle-favorita-' + cerveza.id)[0]) {
                            esconderModal('.modal#modal-detalle-favorita-' + cerveza.id);
                        }
    
                    });
    
                    break;
                
                default:

                    /* Rellena el esqueleto previamente definido para esa cerveza favorita. */
                    $('.cerveza-favorita#' + cerveza.id + '> .modal').attr('id', 'modal-defecto-favorita-' + cerveza.id);
                    $('.cerveza-favorita#' + cerveza.id + '> .modal > .modal-content > .modal-header').html(
                        '<span class="cerrar-modal">&times;</span>'
                        + '<h2>Detalle de ' + cerveza.nombre + '</h2>'
                    );
                    $('.cerveza-favorita#' + cerveza.id + '> .modal > .modal-content > .modal-body').html(
    
                        '<div class="columna">'
                            + '<b><span class="anotacion">Nota:</span> se ha producido un error al tratar de llevar a cabo la operación deseada.</b>'
                            + '<button class="boton-personalizado btnVerde" id="cerrar-defecto-' + cerveza.id + '">Aceptar</button>'
                        + '</div>'
    
                    );
    
                    /* Muestra el modal correspondiente. */
                    mostrarModal('.modal#modal-defecto-favorita-' + cerveza.id);
                    
                    /* Añade listeners a los botones laterales del modal y al botón superior. */
    
                    $('.modal#modal-defecto-favorita-' + cerveza.id + " > .modal-content > .modal-body > .contenedor-detalle > .botones > #cerrar-defecto-" + cerveza.id).on('click', function() {
                        
                        /* Cambia la configuración del modal para que sea la de 'favorita'. */
                        esconderModal('.modal#modal-defecto-favorita-' + cerveza.id);
    
                    });
    
                    $('.modal#modal-defecto-favorita-' + cerveza.id + " > .modal-content > .modal-header > .cerrar-modal").on('click', function() {
                        
                        /* Esconde el modal. */
                        esconderModal('.modal#modal-defecto-favorita-' + cerveza.id);
    
                    });
                    
                    /* Captura cuándo se clica fuera del contenido del modal para cerrarlo también. */
                    $('.modal#modal-defecto-favorita-' + cerveza.id).on('click', function(event) {
                        
                        /* Esconde el modal. */
                        if (event.target == $('.modal#modal-defecto-favorita-' + cerveza.id)[0]) {
                            esconderModal('.modal#modal-defecto-favorita-' + cerveza.id);
                        }
    
                    });
            
            }

        case 'busqueda':
            break;

        case 'agregar':
            break;
        
        default:

            /* Rellena el esqueleto previamente definido para esa cerveza favorita. */
            $('.cerveza-defecto#' + cerveza.id + '> .modal').attr('id', 'modal-defecto-favorita-' + cerveza.id);
            $('.cerveza-defecto#' + cerveza.id + '> .modal > .modal-content > .modal-header').html(
                '<span class="cerrar-modal">&times;</span>'
                + '<h2>Detalle de ' + cerveza.nombre + '</h2>'
            );
            $('.cerveza-defecto#' + cerveza.id + '> .modal > .modal-content > .modal-body').html(

                '<div class="columna">'
                    + '<b><span class="anotacion">Nota:</span> se ha producido un error al tratar de llevar a cabo la operación deseada.</b>'
                    + '<button class="boton-personalizado btnVerde" id="cerrar-defecto-' + cerveza.id + '">Aceptar</button>'
                + '</div>'

            );

            /* Muestra el modal correspondiente. */
            mostrarModal('.modal#modal-defecto-favorita-' + cerveza.id);
            
            /* Añade listeners a los botones laterales del modal y al botón superior. */

            $('.modal#modal-defecto-favorita-' + cerveza.id + " > .modal-content > .modal-body > .contenedor-detalle > .botones > #cerrar-defecto-" + cerveza.id).on('click', function() {
                
                /* Cambia la configuración del modal para que sea la de 'favorita'. */
                esconderModal('.modal#modal-defecto-favorita-' + cerveza.id);

            });

            $('.modal#modal-defecto-favorita-' + cerveza.id + " > .modal-content > .modal-header > .cerrar-modal").on('click', function() {
                
                /* Esconde el modal. */
                esconderModal('.modal#modal-defecto-favorita-' + cerveza.id);

            });
            
            /* Captura cuándo se clica fuera del contenido del modal para cerrarlo también. */
            $('.modal#modal-defecto-favorita-' + cerveza.id).on('click', function(event) {
                
                /* Esconde el modal. */
                if (event.target == $('.modal#modal-defecto-favorita-' + cerveza.id)[0]) {
                    esconderModal('.modal#modal-defecto-favorita-' + cerveza.id);
                }

            });

    }

}

/* Función encargada de mostrar el modal seleccionado. */
function mostrarModal(idModal) {

    $(idModal).css('display', 'block');
    $(idModal).removeClass('invisible');
    $(idModal).addClass('visible');
    $(idModal + ' > .modal-content').removeClass('escondido');
    $(idModal + ' > .modal-content').addClass('mostrado');

}

/* Función encargada de esconder el modal seleccionado. */
function esconderModal(idModal) {

    $(idModal + ' > .modal-content').removeClass('mostrado');
    $(idModal + ' > .modal-content').addClass('escondido');
    $(idModal).removeClass('visible');
    $(idModal).addClass('invisible');
    /* Espera un tiempo para esconder el modal definitivamente. Dicho tiempo es minimamente inferior al que toman las animaciones. */
    setTimeout(function(){
        $(idModal).css('display', 'none');
    }, 300);

}