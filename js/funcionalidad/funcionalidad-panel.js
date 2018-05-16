/* Inicialización de elementos de Firebase. */
var database = firebase.database();
var authentication = firebase.auth();

var nuevoUsuario;
var nuevaCerveza;
var coleccionCervezasFavoritas = [];
var nuevaCervezaBusqueda;
var coleccionCervezas = [];
var nuevaUbicacion;
var coleccionUbicaciones = [];
var coleccionMarcadores = [];

$(document).ready(function() {
    /* Evalúa el estado del usuario al acceder a la página, para saber si hay usuario logueado o no. */
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            /* Esconde los divs de interacción con la base de datos, para que no se puedan realizar operaciones,
		    ya que resultarán infructuosas al no haber un usuario logueado. */
            $('#usuario-logueado').hide(0, function() {
                $('#superior').hide(0);                
                $('#superior').html(''); 
                // $('.sidenav').hide(0);                
                // $('.sidenav').html('');                
                // $('.navbar').hide(0);
                // $('.navbar').html('');                                
                $('#usuario-no-logueado').show(0);
            });
        } else {
            /* Al cargar inicialmente la página, carga los datos del usuario actual en los distintos campos de la app web. */
            cargarDatosSidebar();

            /* Carga las cervezas favoritas del usuario. De no haber ninguna, se ha definido una muestra por defecto. */
            cargarCervezasFavoritas();

            /* Recoge todas las cervezas de la BDD, las guarda en un array y lo usa para la búsqueda de las cervezas. */
            recogerCervezasBDD();

            $('#agregar-cerveza').on('click', function(){
                agregarCerveza();
            });
            
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

        nuevoUsuario = new Usuario(nick, email);

        $('#nickUsuario').html(nuevoUsuario.nick);
        $('#emailUsuario').html(nuevoUsuario.email);
    });
}

/* Función encargada de cargar las cervezas favoritas del usuario, mostrarlas y 
añadir la configuración de operaciones con las que contarán dichas cervezas. */
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
        $('#contenedor-cervezas-favoritas').html('');

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

                        + '<div class="modal nonselectable">'
                            + '<div class="modal-content">'
                                + '<div class="modal-header">'
                                    + '<span class="cerrar-modal">&times;</span>'
                                + '</div>'
                                + '<div class="modal-body">'
                                + '</div>'
                            + '</div>'
                        + "</div>"

                    + '</div>');                
            }

            /* A continuación se añaden listener para los modales de las distintas operaciones de las cervezas. */
            $('.cerveza-favorita > .operaciones-cerveza > .ubicar-cerveza').on('click', function() {

				/* Recoge el atributo ID del elemento padre, que es el contenedor general de la cerveza, el cual coincide con el ID del modal. */
                var idElementoPadre = $(this).parent().parent().attr('id');

                /* Configura el modal en función de la cerveza que lo abre. */
                for (var i = 0; i < coleccionCervezasFavoritas.length; i++) {
                    if (coleccionCervezasFavoritas[i].id == idElementoPadre) {
                        configurarModal('listaFavorita', coleccionCervezasFavoritas[i], 'ubicacion');
                    }
                }

			});

            $('.cerveza-favorita > .operaciones-cerveza > .eliminar-cerveza').on('click', function() {

				/* Recoge el atributo ID del elemento padre, que es el contenedor general de la cerveza, el cual coincide con el ID del modal. */
                var idElementoPadre = $(this).parent().parent().attr('id');

                /* Configura el modal en función de la cerveza que lo abre. */
                for (var i = 0; i < coleccionCervezasFavoritas.length; i++) {
                    if (coleccionCervezasFavoritas[i].id == idElementoPadre) {
                        configurarModal('listaFavorita', coleccionCervezasFavoritas[i], 'favorita');
                    }
                }

			});

            $('.cerveza-favorita > .operaciones-cerveza > .detalle-cerveza').on('click', function() {

				/* Recoge el atributo ID del elemento padre, que es el contenedor general de la cerveza, el cual coincide con el ID del modal. */
                var idElementoPadre = $(this).parent().parent().attr('id');

                /* Configura el modal en función de la cerveza que lo abre. */
                for (var i = 0; i < coleccionCervezasFavoritas.length; i++) {
                    if (coleccionCervezasFavoritas[i].id == idElementoPadre) {
                        configurarModal('listaFavorita', coleccionCervezasFavoritas[i], 'detalle');
                    }
                }

			});

        }

    });
}

/* Recoge todas las cervezas que hay en la BDD en el nodo '/cervezas'. */
function recogerCervezasBDD() {

    var nodoCervezas = database.ref(
        'cervezas'
    );

    nodoCervezas.on('value', function(_cervezas) {
        /* Vacía el array para introducir cada una de las cervezas favoritas del usuario con sus datos actualizados. */
        coleccionCervezas = [];

        _cervezas.forEach(function(_cerveza) {
            var nombre = '';
            var grados = 0;
            var tipo = '';
            var paisOrigen = '';
            var descripcion = '';
            var id = _cerveza.key;

            _cerveza.forEach(function(_parametro) {
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
                coleccionCervezas.push(nuevaCerveza);
            }
        });

        /* Una vez cargadas las cervezas en el array, lo ordena alfabéticamente y lo convierte a JSON para
        utilizarlo como fuente de datos para EasyAutocomplete. */
        coleccionCervezas.sort(compararCervezas);
        
        var coleccionCervezasJSON = JSON.parse(JSON.stringify(coleccionCervezas));

        /* Configuración de EasyAutocomplete. */
        var configEasyAutocomplete = {

            /* Fuente de carga de datos. */
            data: coleccionCervezasJSON,

            /* Valor por el que filtrar. */
            getValue: "nombre",

            /* Eventos y otras directrices. */
            list: {

                /* Muestra sólo elementos con coincidencias con respecto a lo insertado en el input. */
                match: {
                    enabled: true
                },

                /* Evento activado al seleccionarse un elemento, ya sea clicando en él, haciendo hover,
                seleccionándolo con teclas de dirección o incluso en el caso de clicar fuera de la lista
                selecciona la última cerveza seleccionada por cualquiera de los métodos anteriormente
                listados. */
                onChooseEvent: function() {
                    var cervezaSeleccionada = $("#busqueda-cerveza").getSelectedItemData();
                    nuevaCervezaBusqueda = new Cerveza(
                        cervezaSeleccionada.nombre,
                        cervezaSeleccionada.grados,
                        cervezaSeleccionada.tipo,
                        cervezaSeleccionada.paisOrigen,
                        cervezaSeleccionada.id
                    );
                    mostrarCervezaBuscada(nuevaCervezaBusqueda);
                },

                /* Animaciones de la lista de resultados al mostrarse y esconderse. */
                showAnimation: {
                    type: "fade",
                    time: 100,
                    callback: function() {}
                },
        
                hideAnimation: {
                    type: "fade",
                    time: 100,
                    callback: function() {}
                }

            }

        }        

        /* Asigna la configuración al input de búsqueda. */
        $('#busqueda-cerveza').easyAutocomplete(configEasyAutocomplete);

    });

}

/* Función encargada de mostrar en un modal los datos de la cerveza seleccionada en la búsqueda. */
function mostrarCervezaBuscada(cervezaSeleccionada){
    
    // console.log(cervezaSeleccionada);

    configurarModal('busqueda', cervezaSeleccionada, 'detalle');

}

/* Función encargada de mostrar el modal de agregado de cervezas. */
function agregarCerveza() {

    /* El parámetro cerveza en este caso será null, ya que va a añadirse y es imposible 
    hacer referencia sin que exista. */
    configurarModal('agregar', null, 'agregado');

}