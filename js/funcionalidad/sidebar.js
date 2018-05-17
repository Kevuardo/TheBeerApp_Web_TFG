/* Código original de W3Schools y mnodificado por mí para añadir comportamientos extra. */
$("#btn-sidenav").click(function(e) {
    e.stopPropagation();
    $(".hide-menu").toggleClass("show-menu");
    if ($(".hide-menu").hasClass("show-menu")) {
        openNav();
    } else {
        closeNav();
    }
});

$(".closebtn").click(function(e) {
    $(".hide-menu").removeClass("show-menu");
    closeNav();
});

$(".hide-menu").click(function(e) {
    e.stopPropagation();
});

$("body, html").click(function(e) {
    $(".hide-menu").removeClass("show-menu");
    closeNav();
});

function openNav() {
    $(".sidenav").css("width", "250px");
    $("#enlaces-nav").css("margin-left", "250px");
    // $("#superior").css("background-color", "rgba(0, 0, 0, 0.4)");
}

function closeNav() {
    $(".sidenav").css("width", "0px");
    $("#enlaces-nav").css("margin-left", "0px");
    // $("#superior").css("background-color", "rgba(0, 0, 0, 0)");
}

$("#acciones-usuario-sidebar").hover(
    function() {
        $(this)
            .children(" .acciones")
            .show(200);
    },
    function() {
        $(this)
            .children(" .acciones")
            .hide(200);
    }
);

$("#otras-acciones-sidebar").hover(
    function() {
        $(this)
            .children(" .acciones")
            .show(200);
    },
    function() {
        $(this)
            .children(" .acciones")
            .hide(200);
    }
);

/* Listener para las acciones del panel lateral. */
$('#acciones-cerrar-sesion').on('click', function() {

    firebase.auth().signOut().then(function() {
        alert('Sesión cerrada');
        window.location.href = '/login.html';
    }).catch(function(error) {
        /* Aquí muestra mensajes de error. */
        var codigoError = error.code;
        var mensajeError = error.message;
        
        console.log('Código error: ' + codigoError + '; error: ' + mensajeError);
    });

});

$('#otras-acciones-info').on('click', function() {

    alert('Creado por Kevin Castillo Escudero, 2017.\nContacto:\nkcastilloescudero@gmail.com');
    $(".hide-menu").removeClass("show-menu");
    closeNav();

});

$('#otras-acciones-incidencias').on('click', function() {
    
    var reporte = prompt('Escribe lo que quieras reportar en la caja de texto', 'Escribe el reporte aquí...');

    if (reporte.trim() != 0) {

        /* Genera una key aleatoria para la inserción en la BDD. */
        var claveAleatoria = firebase.database().ref('reportes').push().key;

        var usuarioActual = firebase.auth().currentUser; /* El usuario que tiene sesión iniciada en el momento. */

        var database = firebase.database();
        database.ref('reportes/' + claveAleatoria).set({
            reporte: reporte,
            usuario: usuarioActual.uid
        }).then(
            function() {
                alert('¡Gracias por tu reporte!');
                $(".hide-menu").removeClass("show-menu");
                closeNav();
            }
        );

    }


});

$('#otras-acciones-sugerencias').on('click', function() {
    
    var sugerencia = prompt('¡Todas las sugerencias son bienvenidas!', 'Escribe la sugerencia aquí...');

    if (sugerencia.trim() != 0) {

        /* Genera una key aleatoria para la inserción en la BDD. */
        var claveAleatoria = firebase.database().ref('sugerencias').push().key;

        var usuarioActual = firebase.auth().currentUser; /* El usuario que tiene sesión iniciada en el momento. */

        var database = firebase.database();
        database.ref('sugerencias/' + claveAleatoria).set({
            sugerencia: sugerencia,
            usuario: usuarioActual.uid
        }).then(
            function() {
                alert('¡Gracias por tu sugerencia!');
                $(".hide-menu").removeClass("show-menu");
                closeNav();
            }
        );

    }

});

$('#otras-acciones-agradecimientos').on('click', function() {

    alert('Creado por Kevin Castillo Escudero, 2017.\nContacto:\nkcastilloescudero@gmail.com');
    $(".hide-menu").removeClass("show-menu");
    closeNav();

});

$('#otras-acciones-extras').on('click', function() {

    alert('Creado por Kevin Castillo Escudero, 2017.\nContacto:\nkcastilloescudero@gmail.com');
    $(".hide-menu").removeClass("show-menu");
    closeNav();

});
