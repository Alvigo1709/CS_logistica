// js/checkSession.js
document.addEventListener("DOMContentLoaded", () => {
    // Verifica si hay usuario logueado
    if (!localStorage.getItem('usuarioLogueado')) {
        window.location.replace('../login.html');
    }
});
