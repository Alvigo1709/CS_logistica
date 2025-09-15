// js/logout.js
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('logout-btn')) {
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logout-btn';
    logoutBtn.textContent = 'Cerrar Sesión';
    logoutBtn.classList.add('logout-button');
    document.body.appendChild(logoutBtn);

    logoutBtn.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = '../login.html';
    });
  }

  // Evita volver con el botón "atrás"
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };
});
