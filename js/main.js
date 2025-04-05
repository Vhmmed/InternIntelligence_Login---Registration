document.addEventListener('DOMContentLoaded', function() {
  // Firebase configuration
  const firebaseConfig = {
      apiKey: "AIzaSyBHUfaXOyPaAobZU4LfrKE19NLZD1WGy5A",
      authDomain: "example-a5fbe.firebaseapp.com",
      projectId: "example-a5fbe",
      storageBucket: "example-a5fbe.appspot.com",
      messagingSenderId: "885350848092",
      appId: "1:885350848092:web:5d9ca89752e6f83a26f899"
  };

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  // DOM Elements
  const elements = {
      nameInput: document.getElementById("name"),
      emailInput: document.getElementById("email"),
      passwordInput: document.getElementById("password"),
      confirmPasswordInput: document.getElementById("confirmPassword"),
      togglePassword: document.getElementById("togglePassword"),
      toggleConfirmPassword: document.getElementById("toggleConfirmPassword"),
      termsCheckbox: document.getElementById("terms"),
      loginLink: document.getElementById("loginLink"),
      signupButton: document.getElementById("signupButton"),
      buttonText: document.getElementById("buttonText"),
      passwordStrengthBar: document.getElementById("passwordStrength"),
      nameError: document.getElementById("name-error"),
      emailError: document.getElementById("email-error"),
      passwordError: document.getElementById("password-error"),
      confirmPasswordError: document.getElementById("confirmPassword-error"),
      termsError: document.getElementById("terms-error"),
      signupForm: document.getElementById("signupForm")
  };

  // Verify all elements exist
  for (const [key, element] of Object.entries(elements)) {
      if (!element) {
          console.error(`Element ${key} not found`);
      }
  }

  // Toggle password visibility - UPDATED FIXED VERSION
  elements.togglePassword?.addEventListener("click", function() {
      const passwordInput = elements.passwordInput;
      const icon = this.querySelector("i");
      
      if (passwordInput.type === "password") {
          passwordInput.type = "text";
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
      } else {
          passwordInput.type = "password";
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
      }
  });

  elements.toggleConfirmPassword?.addEventListener("click", function() {
      const confirmInput = elements.confirmPasswordInput;
      const icon = this.querySelector("i");
      
      if (confirmInput.type === "password") {
          confirmInput.type = "text";
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
      } else {
          confirmInput.type = "password";
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
      }
  });

  // Validation functions
  function validateName(name) {
      return name.trim().length > 0;
  }

  function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
  }

  function validatePassword(password) {
      return password.length >= 8 && /\d/.test(password);
  }

  function checkPasswordStrength(password) {
      if (password.length === 0) return 0;
      if (password.length < 4) return 25;
      if (password.length < 8) return 50;
      if (!/\d/.test(password)) return 75;
      return 100;
  }

  function updatePasswordStrength() {
      const password = elements.passwordInput.value;
      const strength = checkPasswordStrength(password);

      elements.passwordStrengthBar.style.width = strength + "%";

      if (strength < 50) {
          elements.passwordStrengthBar.style.backgroundColor = "var(--error)";
      } else if (strength < 75) {
          elements.passwordStrengthBar.style.backgroundColor = "orange";
      } else {
          elements.passwordStrengthBar.style.backgroundColor = "var(--success)";
      }
  }

  // Event listeners for real-time validation
  elements.nameInput?.addEventListener("input", function() {
      if (!validateName(this.value)) {
          elements.nameError.classList.add("show");
          this.classList.add("error");
      } else {
          elements.nameError.classList.remove("show");
          this.classList.remove("error");
      }
  });

  elements.emailInput?.addEventListener("input", function() {
      if (!validateEmail(this.value)) {
          elements.emailError.classList.add("show");
          this.classList.add("error");
      } else {
          elements.emailError.classList.remove("show");
          this.classList.remove("error");
      }
  });

  elements.passwordInput?.addEventListener("input", function() {
      updatePasswordStrength();

      if (!validatePassword(this.value)) {
          elements.passwordError.classList.add("show");
          this.classList.add("error");
      } else {
          elements.passwordError.classList.remove("show");
          this.classList.remove("error");
      }

      // Check if confirm password matches
      if (elements.confirmPasswordInput.value && this.value !== elements.confirmPasswordInput.value) {
          elements.confirmPasswordError.classList.add("show");
          elements.confirmPasswordInput.classList.add("error");
      } else {
          elements.confirmPasswordError.classList.remove("show");
          elements.confirmPasswordInput.classList.remove("error");
      }
  });

  elements.confirmPasswordInput?.addEventListener("input", function() {
      if (this.value !== elements.passwordInput.value) {
          elements.confirmPasswordError.classList.add("show");
          this.classList.add("error");
      } else {
          elements.confirmPasswordError.classList.remove("show");
          this.classList.remove("error");
      }
  });

  elements.termsCheckbox?.addEventListener("change", function() {
      if (!this.checked) {
          elements.termsError.classList.add("show");
      } else {
          elements.termsError.classList.remove("show");
      }
  });

  // Form submission
  elements.signupForm?.addEventListener("submit", async function(e) {
      e.preventDefault();
      
      const name = elements.nameInput.value.trim();
      const email = elements.emailInput.value.trim();
      const password = elements.passwordInput.value;
      const confirmPassword = elements.confirmPasswordInput.value;
      const terms = elements.termsCheckbox.checked;

      // Validate form
      if (!validateForm(name, email, password, confirmPassword, terms)) {
          return;
      }

      // Show loading state
      setLoadingState(true);

      try {
          // Create user
          const userCredential = await auth.createUserWithEmailAndPassword(email, password);
          const user = userCredential.user;
          
          // Update profile with name
          await user.updateProfile({
              displayName: name
          });

          // Send verification email
          await user.sendEmailVerification();

          // Simple success notification
          alert("Account created successfully! ✅\nA verification link has been sent to your email.");

          // Redirect after notification
          // window.location.href = "/Dashboard.html";

      } catch (error) {
          handleSignupError(error);
      } finally {
          setLoadingState(false);
      }
  });

  // Helper functions
  function validateForm(name, email, password, confirmPassword, terms) {
      let isValid = true;
      
      if (!validateName(name)) {
          elements.nameError.classList.add("show");
          elements.nameInput.classList.add("error");
          isValid = false;
      }
      
      if (!validateEmail(email)) {
          elements.emailError.classList.add("show");
          elements.emailInput.classList.add("error");
          isValid = false;
      }
      
      if (!validatePassword(password)) {
          elements.passwordError.classList.add("show");
          elements.passwordInput.classList.add("error");
          isValid = false;
      }
      
      if (password !== confirmPassword) {
          elements.confirmPasswordError.classList.add("show");
          elements.confirmPasswordInput.classList.add("error");
          isValid = false;
      }
      
      if (!terms) {
          elements.termsError.classList.add("show");
          isValid = false;
      }
      
      return isValid;
  }

  function setLoadingState(isLoading) {
      elements.signupButton.disabled = isLoading;
      elements.buttonText.innerHTML = isLoading 
          ? '<span class="loading"></span> Creating account...' 
          : "Create Account";
  }

  function handleSignupError(error) {
      console.error("Signup error:", error);
      
      // Reset all error states first
      resetErrorStates();

      // Default error message and target
      let errorMessage = "An error occurred during signup. Please try again.";
      let targetElement = elements.passwordError;
      let highlightField = elements.passwordInput;

      // Map Firebase error codes to user-friendly messages
      const errorMap = {
          'auth/email-already-in-use': {
              message: "This email is already registered. Please login instead.",
              target: elements.emailError,
              field: elements.emailInput
          },
          'auth/invalid-email': {
              message: "Please enter a valid email address (e.g., example@domain.com).",
              target: elements.emailError,
              field: elements.emailInput
          },
          'auth/weak-password': {
              message: "Password must be at least 8 characters with at least one number.",
              target: elements.passwordError,
              field: elements.passwordInput
          },
          'auth/operation-not-allowed': {
              message: "Email/password signup is currently disabled.",
              target: elements.passwordError,
              field: elements.passwordInput
          },
          'auth/too-many-requests': {
              message: "Too many attempts. Please try again later.",
              target: elements.passwordError,
              field: elements.passwordInput
          }
      };

      // Handle known errors
      if (error.code && errorMap[error.code]) {
          const errorInfo = errorMap[error.code];
          errorMessage = errorInfo.message;
          targetElement = errorInfo.target || elements.passwordError;
          highlightField = errorInfo.field || elements.passwordInput;

          if (targetElement) {
              targetElement.textContent = errorMessage;
          }
      }

      // Apply error styling and focus
      if (targetElement) targetElement.classList.add("show");
      if (highlightField) {
          highlightField.classList.add("error");
          highlightField.focus();
      }

      // Show error alert
      alert(`Error: ${errorMessage}`);
  }

  function resetErrorStates() {
      const errorElements = [
          elements.nameError,
          elements.emailError,
          elements.passwordError,
          elements.confirmPasswordError,
          elements.termsError
      ];
      
      errorElements.forEach(el => {
          if (el) {
              el.classList.remove("show");
              el.textContent = "";
          }
      });
      
      const inputFields = [
          elements.nameInput,
          elements.emailInput,
          elements.passwordInput,
          elements.confirmPasswordInput
      ];
      
      inputFields.forEach(input => {
          if (input) {
              input.classList.remove("error");
          }
      });
  }

  // Login link
  elements.loginLink?.addEventListener("click", function(e) {
      e.preventDefault();
      window.location.href = "index.html";
  });
});