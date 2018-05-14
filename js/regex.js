/* Patrones del login.html */
const PATRON_NICK = new RegExp(/^[a-zA-Z0-9_]{5,15}$/); /* Patrón del nick de usuario. */
const PATRON_EMAIL = new RegExp
  (/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/); /* Patrón del e-mail de usuario. */
const PATRON_PWD = new RegExp
  (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/); /* Patrón del password de usuario. */

/* Otras constantes. */
const EDAD_MINIMA = 18; /* Edad mínima de uso. */
const EDAD_MAXIMA = 130; /* Edad máxima de uso (temporal). */
