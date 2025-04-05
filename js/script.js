// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserSessionPersistence, 
  browserLocalPersistence,
  sendPasswordResetEmail,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHUfaXOyPaAobZU4LfrKE19NLZD1WGy5A",
  authDomain: "example-a5fbe.firebaseapp.com",
  projectId: "example-a5fbe",
  storageBucket: "example-a5fbe.firebasestorage.app",
  messagingSenderId: "885350848092",
  appId: "1:885350848092:web:5d9ca89752e6f83a26f899"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const rememberCheckbox = document.getElementById('remember');
const forgotPasswordLink = document.getElementById('forgotPassword');
const signUpLink = document.getElementById('signUpLink');
const loginButton = document.getElementById('loginButton');
const buttonText = document.getElementById('buttonText');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');

// Toggle password visibility
togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-eye-slash');
    icon.classList.toggle('fa-eye');
});

// Validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    return password.length >= 6;
}

// Real-time validation
emailInput.addEventListener('input', function() {
    if (!validateEmail(this.value)) {
        emailError.textContent = 'Please enter a valid email';
        emailError.classList.add('show');
        this.classList.add('error');
    } else {
        emailError.classList.remove('show');
        this.classList.remove('error');
    }
});

passwordInput.addEventListener('input', function() {
    if (!validatePassword(this.value)) {
        passwordError.textContent = 'Password must be at least 6 characters';
        passwordError.classList.add('show');
        this.classList.add('error');
    } else {
        passwordError.classList.remove('show');
        this.classList.remove('error');
    }
});

// Form submission
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberCheckbox.checked;
    
    // Validate inputs
    let isValid = true;
    
    if (!validateEmail(email)) {
        emailError.textContent = 'Please enter a valid email';
        emailError.classList.add('show');
        emailInput.classList.add('error');
        isValid = false;
    }
    
    if (!validatePassword(password)) {
        passwordError.textContent = 'Password must be at least 6 characters';
        passwordError.classList.add('show');
        passwordInput.classList.add('error');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Set loading state
    loginButton.disabled = true;
    buttonText.innerHTML = '<span class="loading"></span> Logging in...';
    
    try {
        // Set persistence before sign-in
        await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
        
        // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Check if email is verified (optional)
        if (!user.emailVerified) {
            // Send verification email if not verified
            await sendEmailVerification(user);
            await auth.signOut();
            throw { 
                code: 'auth/email-not-verified', 
                message: 'Please verify your email first. A new verification link has been sent to your email.' 
            };
        }
        
        // Successful login - redirect
        window.location.href = '/Dashboard.html';
        
    } catch (error) {
        console.error('Login error:', error);
        loginButton.disabled = false;
        buttonText.textContent = 'Log in';
        
        let errorMessage = 'Login failed. Please try again.';
        let targetElement = passwordError;
        
        // Enhanced error handling
        switch (error.code) {
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
                errorMessage = 'Incorrect email or password. Please try again.';
                targetElement = passwordError;
                passwordInput.value = '';
                break;
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email. Please sign up first.';
                targetElement = emailError;
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Account temporarily locked due to many failed attempts. Try again later.';
                break;
            case 'auth/email-not-verified':
                errorMessage = error.message;
                targetElement = emailError;
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled. Contact support.';
                targetElement = emailError;
                break;
            default:
                errorMessage = `Login error: ${error.message || 'Please try again later.'}`;
        }
        
        // Show error
        targetElement.textContent = errorMessage;
        targetElement.classList.add('show');
        if (targetElement === emailError) {
            emailInput.classList.add('error');
            emailInput.focus();
        } else {
            passwordInput.classList.add('error');
            passwordInput.focus();
        }
    }
});

// Forgot password
forgotPasswordLink.addEventListener('click', async function(e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    
    if (!email || !validateEmail(email)) {
        emailError.textContent = 'Please enter a valid email to reset password';
        emailError.classList.add('show');
        emailInput.classList.add('error');
        emailInput.focus();
        return;
    }
    
    try {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset email sent! Please check your inbox.');
    } catch (error) {
        emailError.textContent = 'Failed to send reset email. Please try again.';
        emailError.classList.add('show');
        emailInput.classList.add('error');
        console.error('Password reset error:', error);
    }
});

// Sign up link
signUpLink.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'singup.html';
});