import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtNK_veet2gEueKrdH8V0KjsikNFQLK8M",
  authDomain: "central-soldaduras.firebaseapp.com",
  projectId: "central-soldaduras",
  storageBucket: "central-soldaduras.firebasestorage.app",
  messagingSenderId: "1032883731918",
  appId: "1:1032883731918:web:08681b9f02271cefc57f9f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
