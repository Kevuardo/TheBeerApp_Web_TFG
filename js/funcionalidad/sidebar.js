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
