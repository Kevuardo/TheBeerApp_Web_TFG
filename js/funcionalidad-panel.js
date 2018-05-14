/* Inicialización de elementos de Firebase. */
var database = firebase.database();
var authentication = firebase.auth();

var nuevoUsuario;
var nuevaCerveza;
var coleccionCervezasFavoritas = [];

$(document).ready(function() {
    /* Evalúa el estado del usuario al acceder a la página, para saber si hay usuario logueado o no. */
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            /* Esconde los divs de interacción con la base de datos, para que no se puedan realizar operaciones,
		    ya que resultarán infructuosas al no haber un usuario logueado. */
            $('#usuario-logueado').hide(0, function() {
                $('#usuario-no-logueado').show(0);
            });
        } else {
            /* Al cargar inicialmente la página, carga los datos del usuario actual en los distintos campos de la app web. */
            cargarDatosSidebar();

            /* Carga las cervezas favoritas del usuario. De no haber ninguna, se ha definido una muestra por defecto. */
            cargarCervezasFavoritas();
        }
    });
});

/* Se encarga de cargar los datos del usuairo que irán en el menú lateral. */
function cargarDatosSidebar() {
    var email = '';
    var nick = '';
    var usuarioActual = firebase.auth()
        .currentUser; /* El usuario que tiene sesión iniciada en el momento. */

    var nodoUsuarioActual = database.ref('usuarios/' + usuarioActual.uid);
    nodoUsuarioActual.on('value', function(_datos) {
        nick = _datos.child('nick').val();
        email = _datos.child('email').val();

        console.log(nick + ': ' + email);
        nuevoUsuario = new Usuario(nick, email);
        console.log(nuevoUsuario);

        $('#nickUsuario').html(nuevoUsuario.nick);
        $('#emailUsuario').html(nuevoUsuario.email);
    });
}

function cargarCervezasFavoritas() {
    var usuarioActual = firebase.auth()
        .currentUser; /* El usuario que tiene sesión iniciada en el momento. */

    var nodoCervezasFavoritas = database.ref(
        'usuarios/' + usuarioActual.uid + '/favoritas'
    );
    nodoCervezasFavoritas.on('value', function(_favoritas) {
        /* Vacía el array para introducir cada una de las cervezas favoritas del usuario con sus datos actualizados. */
        coleccionCervezasFavoritas = [];

        _favoritas.forEach(function(_favorita) {
            var nombre = '';
            var grados = 0;
            var tipo = '';
            var paisOrigen = '';
            var descripcion = '';
            var id = _favorita.key;

            _favorita.forEach(function(_parametro) {
                /* Recoge los parámetros almacenados en la BDD. */
                if (_parametro.key == 'grados') {
                    grados = _parametro.val();
                } else if (_parametro.key == 'nombre') {
                    nombre = _parametro.val();
                } else if (_parametro.key == 'paisOrigen') {
                    paisOrigen = _parametro.val();
                } else if (_parametro.key == 'tipo') {
                    tipo = _parametro.val();
                }
            });

            /* Crea un nuevo objeto por cada favorita y lo guarda en la colección. */
            if (
                nombre.trim() != '' &&
                !isNaN(grados) &&
                tipo.trim() != '' &&
                paisOrigen.trim() != '' &&
                id.trim() != ''
            ) {
                nuevaCerveza = new Cerveza(
                    nombre,
                    grados,
                    tipo,
                    paisOrigen,
                    id
                );
                coleccionCervezasFavoritas.push(nuevaCerveza);
            }
        });

        /* Primero vacía el contenedor de cara a una nueva inserción. */
        $('#contendor-cervezas-favoritas').html('');

        if (coleccionCervezasFavoritas.length == 0) {
            $('#contenedor-cervezas-favoritas').html(
                '<div id="lista-vacia" style="display: flex; flex-direction: column; align-items: center; opacity: 0.5;">' +
                    '<img src="assets/img/beer_512.png" alt="Lista vacía" title="Lista vacía">' +
                    '<b>No se ha encontrado ningún favorito, ¡eso hay que arreglarlo!</b>' +
                    '</div>'
            );
        } else {

            /* De no estar vacío, ordena las cervezas favoritas alfabéticamente por nombre para una muestra más intuitiva 
            al usuario. Para ello, utiliza un método personalizado ya que por efecto compararía los objetos completos 
            en lugar de solo el nombre, que es lo que interesa en este caso. */
            coleccionCervezasFavoritas.sort(compararCervezas);

            $('#contenedor-cervezas-favoritas').html(
                '<div id="lista-favoritas"></div>'
            );

            for (var i = 0; i < coleccionCervezasFavoritas.length; i++) {
                $('#lista-favoritas').append(
                    '<div id="' + coleccionCervezasFavoritas[i].id + '" class="cerveza-favorita">'
                        + '<div id="operaciones-favorita-' + coleccionCervezasFavoritas[i].id + '" class="operaciones-cerveza">'
                            + '<a id="ubicar-favorita-' + coleccionCervezasFavoritas[i].id + '" class="ubicar-cerveza"><i class="fa fa-map-marker" aria-hidden="true"></i></a>'
                            + '<a id="eliminar-favorita' + coleccionCervezasFavoritas[i].id + '" class="eliminar-cerveza"><i class="fa fa-star-half-o" aria-hidden="true"></i></a>'
                            + '<a id="detalle-favorita-' + coleccionCervezasFavoritas[i].id + '" class="detalle-cerveza"><i class="fa fa-info-circle" aria-hidden="true"></i></a>'
                        + '</div>'
                        + '<img src="assets/img/ca_icono_color.png" alt="' + coleccionCervezasFavoritas[i].nombre + '" title="' + coleccionCervezasFavoritas[i].nombre + '">'
                        + '<b>' + coleccionCervezasFavoritas[i].nombre + '</b>'

                        + '<div class="modal" id="modal-eliminar-favorita-' + coleccionCervezasFavoritas[i].id + '">'
							+ '<div class="modal-content">'
								+ '<div class="modal-header">'
									+ '<span class="cerrar-modal">&times;</span>'
									+ '<h2>Eliminar como favorita</h2>'
								+ '</div>'
								+ '<div class="modal-body">'
                                    + '<b>¿Está seguro de querer eliminar la cerveza "' + coleccionCervezasFavoritas[i].nombre + '" como favorita?</b>'
                                    + '<div class="botones fila" style="padding: 10px;">'
                                        + '<button class="boton-personalizado btnVerde" id="eliminar-favorita-' + coleccionCervezasFavoritas[i].id + '">Eliminar favorita</button>'
                                        + '<button class="boton-personalizado btnRojo" id="cancelar-eliminar-favorita-' + coleccionCervezasFavoritas[i].id + '">Cancelar</button>'
                                    + '</div>'
								+ '</div>'
							+ '</div>'
                        + "</div>"
                        
                        + '<div class="modal" id="modal-detalle-favorita-' + coleccionCervezasFavoritas[i].id + '">'
							+ '<div class="modal-content">'
								+ '<div class="modal-header">'
									+ '<span class="cerrar-modal">&times;</span>'
									+ '<h2>Detalle de' + coleccionCervezasFavoritas[i].nonbre + '</h2>'
								+ '</div>'
								+ '<div class="modal-body">'
                                    + '<div class="contenedor-detalle" style="display:flex; flex-direction:row">'
                                        + '<div class="imagen-detalle">'
                                            + '<img src="assets/img/ca_icono_color.png" alt="' + coleccionCervezasFavoritas[i].nombre + '" title="' + coleccionCervezasFavoritas[i].nombre + '">'
                                        + '</div>'
                                        + '<div class="campos-detalle" style="display: flex; flex-direction: column; font-size: 90%">'
                                            + '<b>Nombre: ' + coleccionCervezasFavoritas[i].nombre + '</b>'
                                            + '<b>Grados: ' + coleccionCervezasFavoritas[i].grados + '%</b>'
                                            + '<b>Tipo: ' + coleccionCervezasFavoritas[i].tipo + '</b>'
                                            + '<b>País de origen: ' + coleccionCervezasFavoritas[i].paisOrigen + '</b>'
                                            + '<b>Descripción: Descripción comercial de la cerveza.</b>'
                                        + '</div>'
                                        + '<div class="botones columna" style="padding: 10px; display:flex; flex-direction:column">'
                                            + '<button class="boton-personalizado btnAmarillo" id="marcar-favorita-' + coleccionCervezasFavoritas[i].id + '">Favorita <i class="fa fa-star-half-o" aria-hidden="true"></i></button>'
                                            + '<button class="boton-personalizado btnVerde" id="ubicar-cerveza' + coleccionCervezasFavoritas[i].id + '">Ubicar <i class="fa fa-map-marker" aria-hidden="true"></i></button>'
                                        + '</div>'
                                    + '</div>'
								+ '</div>'
							+ '</div>'
                        + "</div>"

                    + '</div>');                
            }

            /* A continuación se añaden listener para los modales de las distintas operaciones de las cervezas. */
            $('.cerveza-favorita > .operaciones-cerveza > .eliminar-cerveza').on('click', function() {

				/* Recoge el atributo ID del elemento padre, que es el contenedor general de la cerveza, el cual coincide con el ID del modal. */
                var idElementoPadre = $(this).parent().parent().attr('id');
                
                console.log(idElementoPadre);
                
				/* Muestra el modal correspondiente. */
				$('#modal-eliminar-favorita-' + idElementoPadre).css('display', 'block');

				/* Añade listeners a los botones inferiores del modal y al botón superior. */
				$('#modal-eliminar-favorita-' + idElementoPadre + " > .modal-content > .modal-body > .botones > #eliminar-favorita-" + idElementoPadre).on('click', function() {
					/* Esconde el modal y el contenedor de la cerveza favorita, y elimina la cerveza de las favoritas del usuario en la BDD. */
					$('#modal-eliminar-favorita-' + idElementoPadre).css('display', 'none');

                    var usuarioActual = firebase.auth().currentUser; /* El usuario que tiene sesión iniciada en el momento. */
                    
                    var database = firebase.database();
					database.ref('usuarios/' + usuarioActual.uid + '/favoritas/' + idElementoPadre).remove();

				});

				$('#modal-eliminar-favorita-' + idElementoPadre + " > .modal-content > .modal-body > .botones > #cancelar-eliminar-favorita-" + idElementoPadre).on('click', function() {
					/* Esconde el modal. */
					$('#modal-eliminar-favorita-' + idElementoPadre).css('display', 'none');
				});

				$('#modal-eliminar-favorita-' + idElementoPadre + " > .modal-content > .modal-header > .cerrar-modal").on('click', function() {
					/* Esconde el modal. */
					$('#modal-eliminar-favorita-' + idElementoPadre).css('display', 'none');
				});

			});

            /* A continuación se añaden listener para los modales de las distintas operaciones de las cervezas. */
            $('.cerveza-favorita > .operaciones-cerveza > .detalle-cerveza').on('click', function() {

				/* Recoge el atributo ID del elemento padre, que es el contenedor general de la cerveza, el cual coincide con el ID del modal. */
                var idElementoPadre = $(this).parent().parent().attr('id');
                
                console.log(idElementoPadre);
                //TODO: Evalúa si la cerveza ya figura como favorita del usuario.
                
				/* Muestra el modal correspondiente. */
				$('#modal-detalle-favorita-' + idElementoPadre).css('display', 'block');

				/* Añade listeners a los botones laterales del modal y al botón superior. */
				$('#modal-detalle-favorita-' + idElementoPadre + " > .modal-content > .modal-body > .botones > #marcar-favorita-" + idElementoPadre).on('click', function() {
                    

                    /* Esconde el modal y el contenedor de la cerveza favorita, y elimina la cerveza de las favoritas del usuario en la BDD. */
					$('#modal-detalle-favorita-' + idElementoPadre).css('display', 'none');

                    var usuarioActual = firebase.auth().currentUser; /* El usuario que tiene sesión iniciada en el momento. */
                    
                    // var database = firebase.database();
					// database.ref('usuarios/' + usuarioActual.uid + '/favoritas/' + idElementoPadre).remove();

				});

				$('#modal-detalle-favorita-' + idElementoPadre + " > .modal-content > .modal-body > .botones > #cancelar-eliminar-favorita-" + idElementoPadre).on('click', function() {
					/* Esconde el modal. */
					$('#modal-detalle-favorita-' + idElementoPadre).css('display', 'none');
				});

				$('#modal-detalle-favorita-' + idElementoPadre + " > .modal-content > .modal-header > .cerrar-modal").on('click', function() {
					/* Esconde el modal. */
					$('#modal-detalle-favorita-' + idElementoPadre).css('display', 'none');
				});

			});

        }

    });
}
