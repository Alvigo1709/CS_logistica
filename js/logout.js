// js/logout.js
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('logout-btn')) return;

  const logoutBtn = document.createElement('button');
  logoutBtn.id = 'logout-btn';
  logoutBtn.textContent = 'Cerrar Sesión';
  logoutBtn.classList.add('logout-button');
  document.body.appendChild(logoutBtn);

    logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.replace('../login.html'); // cambia a './login.html' si estás en raíz
     // Evitar volver con el botón atrás
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
    window.history.go(1);};
  });
});

