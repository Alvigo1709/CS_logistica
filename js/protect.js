// js/protect.js
document.addEventListener("DOMContentLoaded", () => {
  const usuario = localStorage.getItem("usuario");
  const rol = localStorage.getItem("rol");

  // ✅ Bloquea acceso incluso si vuelve con botón atrás
  if (!usuario || !rol) {
    // Esto evita mostrar una página cacheada
    window.location.replace("../login.html");
  }

  // 🔒 Refuerza: cada que se vuelva atrás, vuelve al login
  window.onpageshow = function(event) {
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
      // La página fue cargada desde el cache (back/forward)
      window.location.reload(true);
    }
  };
});
