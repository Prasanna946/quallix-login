// Import the Firebase Web SDK v10 components
import { initializeApp } from"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { 
    getAuth, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup, 
    sendPasswordResetEmail,
    setPersistence,
    browserSessionPersistence,
    browserLocalPersistence
} from  "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 1. Paste Your Production Config Object Here Below
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1naK2P9bf2Vj0TPqjDngpLciGdjMoe-I",
  authDomain: "quallix-8899.firebaseapp.com",
  projectId: "quallix-8899",
  storageBucket: "quallix-8899.firebasestorage.app",
  messagingSenderId: "632550467259",
  appId: "1:632550467259:web:8cc4fa06ba1c0df1256b9e",
  measurementId: "G-FB1K26GY21"
};

// Initialize Firebase
// Initialize app processes securely
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Selection Parameters 
const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberMeCheck = document.getElementById('rememberMe');
const togglePasswordBtn = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eyeIcon');
const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
const googleSignInBtn = document.getElementById('googleSignInBtn');

const submitBtn = document.getElementById('submitBtn');
const btnSpinner = document.getElementById('spinner');
const btnText = document.getElementById('btnText');

/* --- Native Core Toast Engine --- */
function showNotification(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/* --- Inline Input Sanitization --- */
function sanitizeString(input) {
    const temp = document.createElement('div');
    temp.textContent = input;
    return temp.innerHTML.trim();
}

/* --- Password Hide / Show Toggle --- */
togglePasswordBtn.addEventListener('click', () => {
    const isPass = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPass ? 'text' : 'password');
    
    if (isPass) {
        eyeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>`;
    } else {
        eyeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>`;
    }
});

/* --- Clean Client Validation Logic --- */
function validateInputs(email, password) {
    let isValid = true;
    const emailErr = document.getElementById('emailError');
    const passErr = document.getElementById('passwordError');
    
    emailErr.textContent = '';
    passErr.textContent = '';
    emailInput.classList.remove('invalid-state');
    passwordInput.classList.remove('invalid-state');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        emailErr.textContent = 'Email identifier required.';
        emailInput.classList.add('invalid-state');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        emailErr.textContent = 'Please evaluate format execution syntax.';
        emailInput.classList.add('invalid-state');
        isValid = false;
    }

    if (!password) {
        passErr.textContent = 'Password security phrase mandatory.';
        passwordInput.classList.add('invalid-state');
        isValid = false;
    } else if (password.length < 6) {
        passErr.textContent = 'Length parameter must be ≥ 6 chars.';
        passwordInput.classList.add('invalid-state');
        isValid = false;
    }

    return isValid;
}

/* --- UI State Processing Control Elements --- */
function toggleLoading(isLoading, buttonText = 'Sign In') {
    if (isLoading) {
        submitBtn.disabled = true;
        googleSignInBtn.disabled = true;
        btnSpinner.classList.remove('hidden');
        btnText.textContent = 'Processing...';
    } else {
        submitBtn.disabled = false;
        googleSignInBtn.disabled = false;
        btnSpinner.classList.add('hidden');
        btnText.textContent = buttonText;
    }
}

/* --- Flow: Email and Password Authentication --- */
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const cleanEmail = sanitizeString(emailInput.value);
    const cleanPassword = sanitizeString(passwordInput.value);

    if (!validateInputs(cleanEmail, cleanPassword)) return;

    toggleLoading(true);

    try {
        // Enforce state persistence preference
        const persistenceStrategy = rememberMeCheck.checked ? browserLocalPersistence : browserSessionPersistence;
        await setPersistence(auth, persistenceStrategy);
        
        // Try identity resolution mapping profile match query via Firebase SDK
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        showNotification(`Welcome back, ${userCredential.user.email}!`, 'success');
        
        // Execute operational dashboard navigation code hook below:
        // window.location.href = "/dashboard.html";
        
    } catch (error) {
        console.error("Auth Failure Exception Trace: ", error.code);
        switch (error.code) {
            case 'auth/invalid-credential':
                showNotification('Invalid access payload arguments provided.', 'error');
                break;
            case 'auth/user-disabled':
                showNotification('This institutional instance handle has been deactivated.', 'error');
                break;
            case 'auth/too-many-requests':
                showNotification('Traffic throttling rules activated. Try again later.', 'error');
                break;
            default:
                showNotification('Authentication pipeline validation error encountered.', 'error');
        }
    } finally {
        toggleLoading(false);
    }
});

/* --- Flow: Google OAuth Popup Mechanism --- */
googleSignInBtn.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    toggleLoading(true);

    try {
        const result = await signInWithPopup(auth, provider);
        showNotification(`Logged in successfully via ${result.user.displayName}`, 'success');
        // window.location.href = "/dashboard.html";
    } catch (error) {
        console.error("Google OAuth Exception Payload: ", error);
        if (error.code !== 'auth/popup-closed-by-user') {
            showNotification('Could not resolve authentication handshakes.', 'error');
        }
    } finally {
        toggleLoading(false);
    }
});

/* --- Flow: Forgot Password Reset Sequence --- */
forgotPasswordBtn.addEventListener('click', async () => {
    const targetEmail = sanitizeString(emailInput.value);

    if (!targetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
        showNotification('Provide a valid email handle to receive reset link.', 'error');
        emailInput.classList.add('invalid-state');
        return;
    }

    try {
        await sendPasswordResetEmail(auth, targetEmail);
        showNotification('Dispatched out reset instructions vector securely.', 'success');
    } catch (error) {
         console.error("Reset Request Exception Trace: ", error);
         showNotification('Unable to configure reset verification sequences.', 'error');
    }
});
