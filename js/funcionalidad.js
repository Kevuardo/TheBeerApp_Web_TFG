/* Inicialización de elementos de Firebase. */
var database = firebase.database();
var authentication = firebase.auth();

$(document).ready(function() {

	/* Llama la primera vez a la función y luego la invoca en el hilo del setInterval(). */
	cambiarFondo();
	setInterval(cambiarFondo, 6000);

	/* Fuerza el cierre de sesión para obligar al usuario a autenticarse. */
	cerrarSesionActual();

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

	$('#botonLogin').on('click', function() {
		console.log($(this));
		// iniciarSesionUsuario();
	});

	$('#botonRegistro').on('click', function() {
		console.log($(this));
		// registrarUsuario();
	});

	$('.logo-cabecera').on('mouseenter', function() {

		/* Hace que el logo sea ampliado en tamaño minimamente como efecto visual. */
		$(this).css('transform', 'rotate(-5deg) scale(1.05)');

	});

	$('.logo-cabecera').on('mouseleave', function() {
	
		/* Devuelve el logo a su tamaño inicial. */
		$(this).css('transform', 'rotate(0deg) scale(1.0)');

	});

});

/* Cambia el color del fondo periódicamente (cada 6 segundos), referenciando al elemento body. */
function cambiarFondo() {

	/* Selecciona un color aleatorio inicial. */
	var red = Math.floor(Math.random() * 256); 
	var green = Math.floor(Math.random() * 256); 
	var blue = Math.floor(Math.random() * 256);
	var nuevoColor = "rgba(" + red + ", " + green + ", " + blue + ", 0.5)";

	/* Asigna el valor del nuevo color al body. */
	$('html').css('background', nuevoColor);

}

/* Cierra la sesión actual del usuario, ya que si se intenta entrar con credenciales incorrectas tras un login correcto
y no se cierra sesión, se puede continuar con credenciales incorrectas.*/
function cerrarSesionActual() {

	firebase.auth().signOut().then(function() {
		console.log('Sesión cerrada');
	}).catch(function(error) {
		/* Aquí muestra mensajes de error. */
		var codigoError = error.code;
		var mensajeError = error.message;
		
		console.log('Código error: ' + codigoError + '; error: ' + mensajeError);
	});

}
/* TODO: editar este método con los nuevos campos del formulario. */
/* Resetea los campos tras cada operación de cara a una nueva inserción. */
function resetearCamposFormulariosIndex() {

	/* Formulario de Login. */
	$('#email-login').val("");
	$('#password-login').val("");
	$('#mensaje-error-login').text('');
	$('#mensaje-error-login').hide(200);

	/* Formulario de Registro. */
	$('#email-registro').val("");
	$('#password-registro').val("");
	$('#mensaje-error-registro').text('');
	$('#mensaje-error-registro').hide(200);

}

/* Registra un usuario en el sistema de autenticación de Firebase con las credenciales introducidas. */
function registrarUsuario() {

	var email = "";
	var password = "";
	var rol = "";

	if ($('#email-registro').val().trim() != 0) {

		email = $('#email-registro').val().trim();
		
		if ($('#password-registro').val().trim() != 0) {

			password = $('#password-registro').val().trim();

			if ($('#roles').val().trim() == "defecto" ) {

				$('#mensaje-error-registro').text('Seleccione un rol válido');
				$('#mensaje-error-registro').show(200);

			} else {

				rol = $('#roles').val().trim();

				firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {

					/* Resetea los campos. */
					resetearCamposFormulariosIndex();

					/* Almacena al usuario en la BDD para poder almacenar datos del mismo, como su correo y su rol, y fuerza
					su estado para que inicie sesión automáticamente. */
					var usuarioActual = firebase.auth().currentUser; /* El usuario que acaba de registrarse. */

					database.ref("usuarios/" + usuarioActual.uid).set({
						email: email,
						rol: rol
					});

					/* Para poder trabajar con un sistema de varios documentos HTML en este proyecto y lograr persistencia
					en la sesión de usuario en el sistema de Firebase Authentication, se usa la siguiente función, que
					define que la autenticación guardará las credenciales sólo durante la sesión actual (hasta que se 
					cierre la ventana o el navegador, o el usuario cierre sesión voluntariamente). */
					firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function() {
					    
						if (rol == "administrador") {
							window.location.href = "administrador.html";
						} else if (rol == "cliente") {
							window.location.href = "cliente.html";
						}

					}).catch(function(error) {
						
						var errorCode = error.code;
						var errorMessage = error.message;

						console.log(errorCode + ': ' + errorMessage);

					});

				}).catch(function(error) {
					
					/* Aquí muestra mensajes de error. */
					var codigoError = error.code;

					switch(codigoError) {

						case "auth/invalid-email":
							$('#mensaje-error-registro').text('Formato de correo erróneo');
							$('#mensaje-error-registro').show(200);
							break;
						case "auth/email-already-in-use":
							$('#mensaje-error-registro').text('Correo electrónico ya en uso');
							$('#mensaje-error-registro').show(200);
							break;
						case "auth/operation-not-allowed":
							$('#mensaje-error-registro').text('Los registros están inhabilitados');
							$('#mensaje-error-registro').show(200);
							break;
						case "auth/weak-password":
							$('#mensaje-error-registro').text('Contraseña débil');
							$('#mensaje-error-registro').show(200);
							break;
					
					}
					
				});

			}

		} else {

			$('#mensaje-error-registro').text('Introduzca una contraseña');
			$('#mensaje-error-registro').show(200);

		}

	} else {

		$('#mensaje-error-registro').text('Introduzca un e-mail');
		$('#mensaje-error-registro').show(200);

	}

}

/* Inicia sesión en el sistema de autenticación de Firebase con las credenciales introducidas. */
function iniciarSesionUsuario() {

	

	var email = "";
	var password = "";

	if ($('#email-login').val().trim() != 0) {

		email = $('#email-login').val().trim();
		
		if ($('#password-login').val().trim() != 0) {

			password = $('#password-login').val().trim();

			firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {

				/* Resetea los campos. */
				resetearCamposFormulariosIndex();

				/* Para poder trabajar con un sistema de varios documentos HTML en este proyecto y lograr persistencia
				en la sesión de usuario en el sistema de Firebase Authentication, se usa la siguiente función, que
				define que la autenticación guardará las credenciales sólo durante la sesión actual (hasta que se 
				cierre la ventana o el navegador, o el usuario cierre sesión voluntariamente). */
				firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function() {

					var usuarioActual = firebase.auth().currentUser; /* El usuario que acaba de iniciar sesión. */
					var idUsuario = usuarioActual.uid;

					/* Evalúa el rol del usuario para redigirle a distintas páginas según el mismo.
					Para ello, evalúa cada uno de los usuarios almacenados, para comparar el ID del usuario que acaba
					de iniciar sesión con el parámetro id de los usuarios de la BDD, y devuelve el valor de la clave
					'rol' del usuario que coincida. */
					var nodoUsuario = database.ref('usuarios/' + idUsuario);

					nodoUsuario.on('value', function(_usuarios){

						_usuarios.forEach(function (_parametro) {

							/* Evalúa si la clave evaluada actualmente es el rol, y luego evalúa su valor. */
							if (_parametro.key == "rol") {
								
								if (_parametro.val() == "cliente") {
									/* Redirige a Cliente. */
									window.location.href = "cliente.html";
								} else if (_parametro.val() == "administrador") {
									/* Redirige a Administrador. */
									window.location.href = "administrador.html";
								}

							}

						});

					});

				}).catch(function(error) {
					
					var errorCode = error.code;
					var errorMessage = error.message;

					console.log(errorCode + ': ' + errorMessage);

				}); 

			}).catch(function(error) {
				
				/* Aquí muestra mensajes de error. */
				var codigoError = error.code;

				switch(codigoError) {

					case "auth/invalid-email":
						$('#mensaje-error-login').text('Formato de correo erróneo');
						$('#mensaje-error-login').show(200);
						break;
					case "auth/user-disabled":
						$('#mensaje-error-login').text('El usuario está inhabilitado');
						$('#mensaje-error-login').show(200);
						break;
					case "auth/user-not-found":
						$('#mensaje-error-login').text('El usuario no se encuentra en el sistema');
						$('#mensaje-error-login').show(200);
						break;
					case "auth/wrong-password":
						$('#mensaje-error-login').text('Contraseña errónea para el usuario introducido');
						$('#mensaje-error-login').show(200);
						break;
				
				}

			});

		} else {

			$('#mensaje-error-login').text('Introduzca una contraseña');
			$('#mensaje-error-login').show(200);

		}

	} else {

		$('#mensaje-error-login').text('Introduzca un e-mail');
		$('#mensaje-error-login').show(200);

	}

}