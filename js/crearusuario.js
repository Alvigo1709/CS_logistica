import { db } from './firebase.js';
import { collection, addDoc, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const form = document.getElementById('crear-usuario-form');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const rol = document.getElementById('rol').value;

  if (!username || !password || !rol) {
    mensaje.textContent = 'Todos los campos son obligatorios.';
    mensaje.style.color = 'red';
    return;
  }

  try {
    const usuariosRef = collection(db, 'usuarios');
    const q = query(usuariosRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      mensaje.textContent = 'El nombre de usuario ya existe.';
      mensaje.style.color = 'red';
      return;
    }

    await addDoc(usuariosRef, {
      username,
      contraseña: password,
      rol
    });

    mensaje.textContent = 'Usuario registrado exitosamente.';
    mensaje.style.color = 'green';
    form.reset();
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    mensaje.textContent = 'Hubo un error al registrar el usuario.';
    mensaje.style.color = 'red';
  }
});
