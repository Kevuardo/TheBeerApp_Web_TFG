function configurarModal(tipoModal, cerveza) {
    switch(tipoModal) {
        case 'ubicacion':
           
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
            $('#modal-eliminar-favorita-' + cerveza.id).css('display', 'block');

            /* Añade listeners a los botones inferiores del modal y al botón superior. */
            $('#modal-eliminar-favorita-' + cerveza.id + " > .modal-content > .modal-body > .botones > #eliminar-favorita-" + cerveza.id).on('click', function() {
                /* Esconde el modal y el contenedor de la cerveza favorita, y elimina la cerveza de las favoritas del usuario en la BDD. */
                $('#modal-eliminar-favorita-' + cerveza.id).css('display', 'none');

                var usuarioActual = firebase.auth().currentUser; /* El usuario que tiene sesión iniciada en el momento. */
                
                var database = firebase.database();
                database.ref('usuarios/' + usuarioActual.uid + '/favoritas/' + cerveza.id).remove();

            });

            $('#modal-eliminar-favorita-' + cerveza.id + " > .modal-content > .modal-body > .botones > #cancelar-eliminar-favorita-" + cerveza.id).on('click', function() {
                /* Esconde el modal. */
                $('#modal-eliminar-favorita-' + cerveza.id).css('display', 'none');
            });

            $('#modal-eliminar-favorita-' + cerveza.id + " > .modal-content > .modal-header > .cerrar-modal").on('click', function() {
                /* Esconde el modal. */
                $('#modal-eliminar-favorita-' + cerveza.id).css('display', 'none');
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
                        + '<b>Descripción: Descripción comercial de la cerveza.</b>'
                    + '</div>'
                    + '<div class="botones columna">'
                        + '<button class="boton-personalizado btnAmarillo" id="marcar-favorita-' + cerveza.id + '">Favorita <i class="fa fa-star-half-o" aria-hidden="true"></i></button>'
                        + '<button class="boton-personalizado btnVerde" id="ubicar-cerveza' + cerveza.id + '">Ubicar <i class="fa fa-map-marker" aria-hidden="true"></i></button>'
                    + '</div>'
                + '</div>'

            );

            /* Muestra el modal correspondiente. */
            $('#modal-detalle-favorita-' + cerveza.id).css('display', 'block');
            
            /* Añade listeners a los botones laterales del modal y al botón superior. */
            /* Como este es el modal de una cerveza favorita, la operación de alternar favorita la eliminará como tal al pulsar el modal. */
            $('#modal-detalle-favorita-' + cerveza.id + " > .modal-content > .modal-body > .contenedor-detalle > .botones > #marcar-favorita-" + cerveza.id).on('click', function() {
                
                /* Cambia la configuración del modal para que sea la de 'favorita'. */
                configurarModal('favorita', cerveza);

            });

            $('#modal-detalle-favorita-' + cerveza.id + " > .modal-content > .modal-body > .botones > #cancelar-eliminar-favorita-" + cerveza.id).on('click', function() {
            	/* Esconde el modal. */
            	$('#modal-detalle-favorita-' + cerveza.id).css('display', 'none');
            });

            $('#modal-detalle-favorita-' + cerveza.id + " > .modal-content > .modal-header > .cerrar-modal").on('click', function() {
            	/* Esconde el modal. */
            	$('#modal-detalle-favorita-' + cerveza.id).css('display', 'none');
            });            

        break;
    
    }

}