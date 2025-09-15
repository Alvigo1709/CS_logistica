// js/logout.js
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('logout-btn')) return;

    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logout-btn';
    logoutBtn.textContent = 'Cerrar Sesión';
    logoutBtn.classList.add('logout-button');
    document.body.appendChild(logoutBtn);

    logoutBtn.addEventListener('click', () => {
        // Borrar sesión
        localStorage.clear();

        // Redirigir reemplazando historial
        window.location.replace('../login.html');
    });
});
