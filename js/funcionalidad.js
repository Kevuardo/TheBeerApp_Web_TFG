/* Inicialización de elementos de Firebase. */
var database = firebase.database();
var authentication = firebase.auth();

/* Variables bandera de validación. */
var nickValido = false;
var emailValido = false;
var passwordValida = false;
var passwordRepeValida = false;
var passwordsCoinciden = false;

$(document).ready(function() {
    /* Fuerza el cierre de sesión para obligar al usuario a autenticarse. */
    cerrarSesionActual();

    /* Botones de cambio de formulario. */
    $('#botonCambioLogin').on('click', function() {
        $('#login-usuario').fadeToggle(200, function() {
            resetearCamposFormulariosIndex();
            $('#registro-usuario').fadeToggle(200);
        });
    });

    $('#botonCambioRegistro').on('click', function() {
        $('#registro-usuario').fadeToggle(200, function() {
            resetearCamposFormulariosIndex();
            $('#login-usuario').fadeToggle(200);
        });
    });

    /* Botones de login y registro. */
    $('#botonLogin').on('click', function() {
        iniciarSesionUsuario();
    });

    $('#botonRegistro').on('click', function() {
        registrarUsuario();
    });

    /* Listeners del logo para animaciones. */
    $('.logo-cabecera').on('mouseenter', function() {
        /* Hace que el logo sea ampliado en tamaño minimamente como efecto visual. */
        $(this).css('transform', 'rotate(-5deg) scale(1.05)');
    });

    $('.logo-cabecera').on('mouseleave', function() {
        /* Devuelve el logo a su tamaño inicial. */
        $(this).css('transform', 'rotate(0deg) scale(1.0)');
    });

    /* Bloquea la entrada manual de valores en el campo de la edad de registro. */
    $("[type='number']").keypress(function(evt) {
        evt.preventDefault();
    });

    /* Listeners de los botones de visibilidad. */
    $('#btnVisibilidadPasswordLogin').on('click', function() {
        alternarVisibilidadContraseñas('#password-login', this);
    });
    
    $('#btnVisibilidadPasswordRegistro').on('click', function() {
        alternarVisibilidadContraseñas('#password-registro', this);
    });
    
    $('#btnVisibilidadPasswordRepeRegistro').on('click', function() {
        alternarVisibilidadContraseñas('#password-registro-repe', this);
    });

});

/* Cierra la sesión actual del usuario, ya que si se intenta entrar con credenciales incorrectas tras un login correcto
y no se cierra sesión, se puede continuar con credenciales incorrectas.*/
function cerrarSesionActual() {
    firebase
        .auth()
        .signOut()
        .then(function() {
            console.log('Sesión cerrada');
        })
        .catch(function(error) {
            /* Aquí muestra mensajes de error. */
            var codigoError = error.code;
            var mensajeError = error.message;

            console.log(
                'Código error: ' + codigoError + '; error: ' + mensajeError
            );
        });
}

/* Resetea los campos tras cada operación de cara a una nueva inserción. */
function resetearCamposFormulariosIndex() {
    /* Formulario de Login. */
    $('#email-login').val('');
    $('#password-login').val('');
    $('#password-login')[0].type = "password";
    $('#btnVisibilidadPasswordLogin').html('<i class="fa fa-eye" aria-hidden="true"></i>');
    $('#mensaje-error-login').text('');
    $('#mensaje-error-login').hide(200);

    /* Formulario de Registro. */
    $('#nick-registro').val('');
    $('#email-registro').val('');
    $('#edad-registro').val(18);
    $('#password-registro').val('');
    $('#password-registro')[0].type = "password";
    $('#btnVisibilidadPasswordRegistro').html('<i class="fa fa-eye" aria-hidden="true"></i>');
    $('#password-registro-repe').val('');
    $('#password-registro-repe')[0].type = "password";
    $('#btnVisibilidadPasswordRepeRegistro').html('<i class="fa fa-eye" aria-hidden="true"></i>');
    $('#mensaje-error-registro').text('');
    $('#mensaje-error-registro').hide(200);
}

/* TODO: editar este método con los nuevos campos del formulario. */
/* Registra un usuario en el sistema de autenticación de Firebase con las credenciales introducidas. */
function registrarUsuario() {
    $('#mensaje-error-registro').text('');
    $('#mensaje-error-registro').hide();

    nickValido = false;
    emailValido = false;
    passwordValida = false;
    passwordRepeValida = false;
    passwordsCoinciden = false;

    var nick = $('#nick-registro')
        .val()
        .trim();
    var edad = $('#edad-registro').val();
    var email = $('#email-registro')
        .val()
        .trim();
    var password = $('#password-registro')
        .val()
        .trim();
    var passwordRepe = $('#password-registro-repe')
        .val()
        .trim();

    if (nick != '' && nick.length > 0) {
        nickValido = validarCampos(nick, PATRON_NICK);
        if (nickValido) {
            if (email != '' && email.length > 0) {
                emailValido = validarCampos(email, PATRON_EMAIL);
                if (emailValido) {
                    if (password != '' && password.length > 0) {
                        passwordValida = validarCampos(password, PATRON_PWD);
                        if (passwordValida) {
                            if (passwordRepe != '' && passwordRepe.length > 0) {
                                passwordRepeValida = validarCampos(
                                    passwordRepe,
                                    PATRON_PWD
                                );
                                if (passwordRepeValida) {
                                    if (password === passwordRepe) {
                                        passwordsCoinciden = true;
                                    }
                                } else {
                                    $('#mensaje-error-registro').text(
                                        'Las contraseñas no coinciden'
                                    );
                                    $('#mensaje-error-registro').show(200);
                                }
                            } else {
                                $('#mensaje-error-registro').text(
                                    'Las contraseñas no coinciden'
                                );
                                $('#mensaje-error-registro').show(200);
                            }
                        } else {
                            $('#mensaje-error-registro').text(
                                'Introduzca una contraseña válida'
                            );
                            $('#mensaje-error-registro').show(200);
                        }
                    } else {
                        $('#mensaje-error-registro').text(
                            'Introduzca una contraseña'
                        );
                        $('#mensaje-error-registro').show(200);
                    }
                } else {
                    $('#mensaje-error-registro').text(
                        'Introduzca un correo electrónico válido'
                    );
                    $('#mensaje-error-registro').show(200);
                }
            } else {
                $('#mensaje-error-registro').text(
                    'Introduzca un correo electrónico'
                );
                $('#mensaje-error-registro').show(200);
            }
        } else {
            $('#mensaje-error-registro').text('Introduzca un nick válido');
            $('#mensaje-error-registro').show(200);
        }
    } else {
        $('#mensaje-error-registro').text('Introduzca un nick');
        $('#mensaje-error-registro').show(200);
    }

    /* Comprueba que todas las banderas sean válidas y, de ser así, procede al registro del nuevo usuario. */
    if (
        nickValido &&
        emailValido &&
        passwordValida &&
        passwordRepeValida &&
        passwordsCoinciden
    ) {
        $('#mensaje-error-registro').text('');
        $('#mensaje-error-registro').hide();

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(function(user) {
                /* Resetea los campos. */
                resetearCamposFormulariosIndex();

                /* Almacena al usuario en la BDD para poder almacenar datos del mismo, como su correo, y fuerza
				su estado para que inicie sesión automáticamente. */
                var usuarioActual = firebase.auth()
                    .currentUser; /* El usuario que acaba de registrarse. */

                database.ref('usuarios/' + usuarioActual.uid).set({
                    nick: nick,
                    email: email,
                    edad: edad
                });

                /* Para poder trabajar con un sistema de varios documentos HTML en este proyecto y lograr persistencia
				en la sesión de usuario en el sistema de Firebase Authentication, se usa la siguiente función, que
				define que la autenticación guardará las credenciales sólo durante la sesión actual (hasta que se 
				cierre la ventana o el navegador, o el usuario cierre sesión voluntariamente). */
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function() {

                	redireccionar();

                }).catch(function(error) {

                	var errorCode = error.code;
                	var errorMessage = error.message;

                	console.log(errorCode + ': ' + errorMessage);

                });
            })
            .catch(function(error) {
                /* Aquí muestra mensajes de error. */
                var codigoError = error.code;

                switch (codigoError) {
                    case 'auth/invalid-email':
                        $('#mensaje-error-registro').text(
                            'Formato de correo erróneo'
                        );
                        $('#mensaje-error-registro').show(200);
                        break;
                    case 'auth/email-already-in-use':
                        $('#mensaje-error-registro').text(
                            'Correo electrónico ya en uso'
                        );
                        $('#mensaje-error-registro').show(200);
                        break;
                    case 'auth/operation-not-allowed':
                        $('#mensaje-error-registro').text(
                            'Los registros están inhabilitados'
                        );
                        $('#mensaje-error-registro').show(200);
                        break;
                    case 'auth/weak-password':
                        $('#mensaje-error-registro').text('Contraseña débil');
                        $('#mensaje-error-registro').show(200);
                        break;
                }
            });
    }
}

/* Inicia sesión en el sistema de autenticación de Firebase con las credenciales introducidas. */
function iniciarSesionUsuario() {
    $('#mensaje-error-login').text('');
    $('#mensaje-error-login').hide();

    emailValido = false;
    passwordValida = false;

    var email = $('#email-login')
        .val()
        .trim();
    var password = $('#password-login')
        .val()
        .trim();

    if (email != '' && email.length > 0) {
        emailValido = validarCampos(email, PATRON_EMAIL);
        if (emailValido) {
            if (password != '' && password.length > 0) {
                passwordValida = validarCampos(password, PATRON_PWD);
                if (!passwordValida) {
                    $('#mensaje-error-login').text(
                        'Introduzca una contraseña válida'
                    );
                    $('#mensaje-error-login').show(200);
                }
            } else {
                $('#mensaje-error-login').text('Introduzca una contraseña');
                $('#mensaje-error-login').show(200);
            }
        } else {
            $('#mensaje-error-login').text(
                'Introduzca un correo electrónico válido'
            );
            $('#mensaje-error-login').show(200);
        }
    } else {
        $('#mensaje-error-login').text('Introduzca un correo electrónico');
        $('#mensaje-error-login').show(200);
    }

    if (emailValido && passwordValida) {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(function(user) {
                /* Resetea los campos. */
                resetearCamposFormulariosIndex();

                /* Para poder trabajar con un sistema de varios documentos HTML en este proyecto y lograr persistencia
				en la sesión de usuario en el sistema de Firebase Authentication, se usa la siguiente función, que
				define que la autenticación guardará las credenciales sólo durante la sesión actual (hasta que se 
				cierre la ventana o el navegador, o el usuario cierre sesión voluntariamente). */
                firebase
                    .auth()
                    .setPersistence(firebase.auth.Auth.Persistence.SESSION)
                    .then(function() {
                        var usuarioActual = firebase.auth()
                            .currentUser; /* El usuario que acaba de iniciar sesión. */
                        var idUsuario = usuarioActual.uid;

                        redireccionar();
                    })
                    .catch(function(error) {
                        var errorCode = error.code;
                        var errorMessage = error.message;

                        console.log(errorCode + ': ' + errorMessage);
                    });
            })
            .catch(function(error) {
                /* Aquí muestra mensajes de error. */
                var codigoError = error.code;

                switch (codigoError) {
                    case 'auth/invalid-email':
                        $('#mensaje-error-login').text(
                            'Formato de correo erróneo'
                        );
                        $('#mensaje-error-login').show(200);
                        break;
                    case 'auth/user-disabled':
                        $('#mensaje-error-login').text(
                            'El usuario está inhabilitado'
                        );
                        $('#mensaje-error-login').show(200);
                        break;
                    case 'auth/user-not-found':
                        $('#mensaje-error-login').text(
                            'El usuario no se encuentra en el sistema'
                        );
                        $('#mensaje-error-login').show(200);
                        break;
                    case 'auth/wrong-password':
                        $('#mensaje-error-login').text(
                            'Contraseña errónea para el usuario introducido'
                        );
                        $('#mensaje-error-login').show(200);
                        break;
                }
            });
    }
}

/* Función encargada de cotejar que los datos introducidos en los campos de los formularios tengan un formato válido 
con respecto a los patrones definidos. */
function validarCampos(campoValidacion, patronValidacion) {
    if (patronValidacion.test(campoValidacion)) {
        return true;
    } else {
        return false;
    }
}

function redireccionar() {
    window.location.href = '/inicio.html';
}

function alternarVisibilidadContraseñas(campoAlternar, botonActivador) {
    campoAlternar = $(campoAlternar);
    if (campoAlternar[0].type === "password") {
        campoAlternar[0].type = "text";
        $(botonActivador).html('<i class="fa fa-eye-slash" aria-hidden="true"></i>');
    } else {
        campoAlternar[0].type = "password";
        $(botonActivador).html('<i class="fa fa-eye" aria-hidden="true"></i>');
    }
}