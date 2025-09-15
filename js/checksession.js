// js/checksession.js
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem('usuarioLogueado'));

    // Si no hay usuario logueado
    if (!user) {
        window.location.replace('../login.html');
        return;
    }

    // Validar acceso por rol
    const path = window.location.pathname;

    // Si la ruta incluye /admin y no es admin
    if (path.includes('/admin/') && user.rol !== 'admin') {
        window.location.replace('../login.html');
    }

    // Si la ruta incluye /usuario y no es usuario NI admin
    if (path.includes('/usuario/') && user.rol !== 'usuario' && user.rol !== 'admin') {
        window.location.replace('../login.html');
    }
});
