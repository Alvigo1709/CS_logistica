import { db } from './firebase.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  if (!loginForm || !errorMessage) {
    console.error("Formulario de login no encontrado en el DOM");
    return;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = loginForm["email"].value.trim();
    const password = loginForm["password"].value;

    try {
      const q = query(collection(db, "usuarios"), where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        errorMessage.textContent = "Usuario no registrado.";
        return;
      }

      let userData;
      querySnapshot.forEach((doc) => {
        userData = doc.data();
      });

      if (userData.contraseña !== password) {
        errorMessage.textContent = "Contraseña incorrecta.";
        return;
      }

      localStorage.setItem("usuario", userData.username);
      localStorage.setItem("rol", userData.rol);

      if (userData.rol === "admin") {
        window.location.href = "admin/dashboard.html";
      } else {
        window.location.href = "usuario/index.html";
      }
    } catch (err) {
      console.error("Error en login:", err);
      errorMessage.textContent = "Error inesperado. Intenta nuevamente.";
    }
  });
});
