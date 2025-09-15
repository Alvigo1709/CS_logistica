document.addEventListener("DOMContentLoaded", () => {
  const userData = localStorage.getItem('usuarioLogueado');
  let user = null;

  try {
    user = JSON.parse(userData);
  } catch (e) {
    user = null;
  }

  if (!user || !user.rol) {
    console.log("Redirigiendo: no hay sesión");
    window.location.replace('../login.html');
    return;
  }

  const path = window.location.pathname;

  // Validar ruta de admin
  if (path.includes('/admin/') && user.rol !== 'admin') {
    console.log("No autorizado (admin)");
    window.location.replace('../login.html');
    return;
  }

  // Validar ruta de usuario
  if (path.includes('/usuario/') && !(user.rol === 'usuario' || user.rol === 'admin')) {
    console.log("No autorizado (usuario)");
    window.location.replace('../login.html');
    return;
  }

  // Validar desde caché del historial (bloquear atrás)
  window.addEventListener('pageshow', function(event) {
    if (!localStorage.getItem('usuarioLogueado') && event.persisted) {
      window.location.replace('../login.html');
    }
  });
});

