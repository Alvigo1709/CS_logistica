// js/checksession.js
document.addEventListener("DOMContentLoaded", () => {
  window.history.forward();
  // Obtener datos del usuario desde localStorage
  const userData = localStorage.getItem('usuarioLogueado');
  let user = null;

  try {
    user = JSON.parse(userData);
  } catch (e) {
    user = null;
  }

  // Si no hay sesión válida, redirigir al login
  if (!user || !user.rol) {
    window.location.replace('../login.html');
    return;
  }

  // Obtener la ruta actual
  const path = window.location.pathname;

  // Caso 1: ruta /admin/ y usuario no es admin
  if (path.includes('/admin/') && user.rol !== 'admin') {
    window.location.replace('../login.html');
    return;
  }

  // Caso 2: ruta /usuario/ y usuario no es admin ni usuario normal
  if (path.includes('/usuario/') && !(user.rol === 'usuario' || user.rol === 'admin')) {
    window.location.replace('../login.html');
    return;
  }

  // Si todo está bien, no pasa nada y continúa
// Si el usuario intenta volver con el botón atrás
window.addEventListener('pageshow', function(event) {
  const userData = localStorage.getItem('usuarioLogueado');
  if (!userData && event.persisted) {
    // Página fue restaurada desde caché => forzar redirección
    window.location.replace('../login.html');
  }

});

});
