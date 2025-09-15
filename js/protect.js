// js/protect.js
document.addEventListener("DOMContentLoaded", () => {
  const usuario = localStorage.getItem("usuario");
  const rol = localStorage.getItem("rol");

  if (!usuario || !rol) {
    // Si no hay sesión activa, redirige al login
    window.location.replace("../login.html");
  }
});
