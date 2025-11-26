// ====== Firebase config ======
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC2c3S_NtouIjHPrk5LM5c0DQoTWyBrzH4",
  authDomain: "timbre-c9547.firebaseapp.com",
  databaseURL: "https://timbre-c9547-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "timbre-c9547",
  storageBucket: "timbre-c9547.firebasestorage.app",
  messagingSenderId: "127064655657",
  appId: "1:127064655657:web:a4e99dcbc6ab33f32c1938"
};

if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);

const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();

let firebaseAuthModulePromise = null;

function loadFirebaseAuthModule() {
  if (!firebaseAuthModulePromise) {
    firebaseAuthModulePromise = import('https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js');
  }
  return firebaseAuthModulePromise;
}

function showToast(message) {
  if (typeof toast === 'function') {
    toast(message);
  } else if (typeof alert === 'function') {
    alert(message);
  } else {
    console.log('Toast:', message);
  }
}

async function handleEmailLinkSignIn() {
  try {
    const { isSignInWithEmailLink, signInWithEmailLink } = await loadFirebaseAuthModule();
    if (typeof isSignInWithEmailLink !== 'function' || typeof signInWithEmailLink !== 'function') return;
    if (!isSignInWithEmailLink(auth, window.location.href)) return;

    let email = localStorage.getItem('emailForSignIn');
    if (!email) {
      email = window.prompt('Ingresa tu correo para continuar:');
    }

    if (!email) return;

    try {
      await signInWithEmailLink(auth, email, window.location.href);
      localStorage.removeItem('emailForSignIn');
      showToast('✅ Bienvenido, acceso completado');
      window.history.replaceState({}, document.title, '/index.html');
    } catch (error) {
      console.error('Error al completar login:', error);
      showToast('❌ Error al validar enlace');
    }
  } catch (error) {
    console.error('Error manejando el enlace de acceso:', error);
  }
}

handleEmailLinkSignIn();

async function sendEditorInvitationEmail(email) {
  const trimmedEmail = (email || '').trim();
  if (!trimmedEmail) return;

  const { sendSignInLinkToEmail } = await loadFirebaseAuthModule();
  const actionCodeSettings = {
    url: 'https://tomos.bot/index.html?mode=signIn',
    handleCodeInApp: true
  };

  try {
    await sendSignInLinkToEmail(auth, trimmedEmail, actionCodeSettings);
    localStorage.setItem('emailForSignIn', trimmedEmail);
    showToast(`✅ Invitación enviada a ${trimmedEmail}`);
  } catch (error) {
    console.error('Error enviando invitación:', error);
    showToast('❌ Error al enviar invitación');
  }
}

let secondaryAuthInstance = null;

function getSecondaryAuthInstance() {
  if (secondaryAuthInstance) return secondaryAuthInstance;
  const existingSecondaryApp = firebase.apps.find(app => app.name === 'secondary-auth');
  const secondaryApp = existingSecondaryApp || firebase.initializeApp(FIREBASE_CONFIG, 'secondary-auth');
  secondaryAuthInstance = firebase.auth(secondaryApp);
  return secondaryAuthInstance;
}

async function createAuthUser(email, password) {
  const { createUserWithEmailAndPassword } = await loadFirebaseAuthModule();
  if (typeof createUserWithEmailAndPassword !== 'function') {
    throw new Error('Firebase Auth module not available');
  }
  const authInstance = getSecondaryAuthInstance();
  return createUserWithEmailAndPassword(authInstance, email, password);
}

async function deleteUserFromAuth(uid) {
  if (!uid) return;
  try {
    const response = await fetch(`/admin/deleteUser?uid=${encodeURIComponent(uid)}`, { method: 'DELETE' });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(text || `Failed to delete user ${uid}`);
    }
  } catch (err) {
    console.warn('No se pudo eliminar el usuario en Auth', err);
    throw err;
  }
}
