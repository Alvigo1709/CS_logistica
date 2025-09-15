document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('logout-btn')) {
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logout-btn';
    logoutBtn.textContent = 'Cerrar Sesión';
    logoutBtn.classList.add('logout-button');
    document.body.appendChild(logoutBtn);

    logoutBtn.addEventListener('click', () => {
      localStorage.clear();
      sessionStorage.clear(); // 🧼 Seguridad extra
      window.location.href = '../login.html';
    });
  }

  // 👇 Esto ayuda con el botón atrás
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };
});
