import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, doc, runTransaction, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.querySelector("#authForm");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const submitBtn = document.querySelector("#submitBtn");
const loginTab = document.querySelector("#loginTab");
const registerTab = document.querySelector("#registerTab");
const message = document.querySelector("#message");
const authPanel = document.querySelector("#auth");
const profile = document.querySelector("#profile");
const userEmail = document.querySelector("#userEmail");
const userRole = document.querySelector("#userRole");
let mode = "login";

function say(text) { message.textContent = text; }
function setMode(next) {
  mode = next;
  loginTab.classList.toggle("active", mode === "login");
  registerTab.classList.toggle("active", mode === "register");
  submitBtn.textContent = mode === "login" ? "Войти" : "Создать аккаунт";
  passwordInput.autocomplete = mode === "login" ? "current-password" : "new-password";
  say("");
}
loginTab.addEventListener("click", () => setMode("login"));
registerTab.addEventListener("click", () => setMode("register"));

async function createUserProfile(user) {
  const ownerRef = doc(db, "system", "owner");
  const userRef = doc(db, "users", user.uid);

  await runTransaction(db, async (tx) => {
    const ownerSnap = await tx.get(ownerRef);
    const role = ownerSnap.exists() ? "player" : "creator";

    if (!ownerSnap.exists()) {
      tx.set(ownerRef, {
        uid: user.uid,
        email: user.email || "",
        createdAt: serverTimestamp()
      });
    }

    tx.set(userRef, {
      uid: user.uid,
      email: user.email || "",
      role,
      username: (user.email || "player").split("@")[0],
      createdAt: serverTimestamp()
    });
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  submitBtn.disabled = true;
  say("Подождите…");
  try {
    if (mode === "register") {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(credential.user);
      say("Аккаунт создан!");
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      say("Вход выполнен!");
    }
  } catch (error) {
    const messages = {
      "auth/email-already-in-use": "Этот email уже зарегистрирован.",
      "auth/invalid-email": "Проверьте адрес электронной почты.",
      "auth/weak-password": "Пароль должен содержать минимум 6 символов.",
      "auth/invalid-credential": "Неверная почта или пароль.",
      "permission-denied": "Firebase отклонил запись. Проверьте правила Firestore."
    };
    say(messages[error.code] || error.message || "Не удалось выполнить действие.");
  } finally {
    submitBtn.disabled = false;
  }
});

document.querySelector("#logoutBtn").addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    authPanel.style.display = "block";
    profile.style.display = "none";
    return;
  }
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    authPanel.style.display = "none";
    profile.style.display = "block";
    userEmail.textContent = user.email || "Пользователь";
    userRole.textContent = snap.exists()
      ? (snap.data().role === "creator" ? "Роль: Creator" : "Роль: Player")
      : "Профиль не найден. Выйдите и войдите снова.";
  } catch (error) {
    say("Не удалось загрузить профиль: " + error.message);
  }
});
