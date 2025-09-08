class FitnessAuth {
    constructor() {
        this.isLogin = true;
        this.init();
    }

    init() {
        this.bindEvents();
        this.animateOnLoad();
    }

    bindEvents() {
        const toggleLink = document.getElementById('toggleLink');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const forgotPassword = document.getElementById('forgotPassword');

        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleForms();
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        forgotPassword.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });
        
        this.initPasswordToggles();
        this.initPasswordStrength();
    }

    toggleForms() {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const toggleText = document.getElementById('toggleText');
        const toggleLink = document.getElementById('toggleLink');

        const currentForm = this.isLogin ? loginForm : signupForm;
        const nextForm = this.isLogin ? signupForm : loginForm;

        currentForm.classList.remove('active');

        setTimeout(() => {
            nextForm.classList.add('active');

            if (this.isLogin) {
                toggleText.textContent = 'Already have an account?';
                toggleLink.textContent = 'Sign In';
            } else {
                toggleText.textContent = "Don't have an account?";
                toggleLink.textContent = 'Create Account';
            }
            this.isLogin = !this.isLogin;
        }, 50); // Small delay to allow CSS transitions
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }
        this.showLoading('loginForm');

        setTimeout(() => {
            this.hideLoading('loginForm');
            this.showMessage('Welcome back! Login successful.', 'success');
            setTimeout(() => {
                this.showMessage('Redirecting to dashboard...', 'info');
            }, 1000);
        }, 2000);
    }

    handleSignup() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!name || !email || !password || !confirmPassword) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }
        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }
        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters', 'error');
            return;
        }

        this.showLoading('signupForm');

        setTimeout(() => {
            this.hideLoading('signupForm');
            this.showMessage('Account created successfully!', 'success');
            setTimeout(() => {
                if (!this.isLogin) {
                    this.toggleForms();
                }
            }, 1500);
        }, 2500);
    }

    handleForgotPassword() {
        const email = document.getElementById('loginEmail').value;
        if (!email) {
            this.showMessage('Please enter your email address first', 'error');
            document.getElementById('loginEmail').focus();
            return;
        }
        this.showMessage('Password reset link sent to ' + email, 'success');
    }

    showLoading(formId) {
        const btn = document.getElementById(formId).querySelector('.btn');
        btn.querySelector('.btn-text').style.display = 'none';
        btn.querySelector('.loading').style.display = 'block';
        btn.disabled = true;
    }

    hideLoading(formId) {
        const btn = document.getElementById(formId).querySelector('.btn');
        btn.querySelector('.btn-text').style.display = 'block';
        btn.querySelector('.loading').style.display = 'none';
        btn.disabled = false;
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        const bgColor = {
            success: 'var(--success-color)',
            error: 'var(--error-color)',
            info: 'var(--info-color)'
        }[type];

        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-50px);
            padding: 1rem 2rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            opacity: 0;
            transition: all 0.4s ease;
            background: ${bgColor};
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);

        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(-50%) translateY(-50px)';
            setTimeout(() => messageEl.remove(), 400);
        }, 3000);
    }

    animateOnLoad() {
        const container = document.querySelector('.container');
        container.style.opacity = '0';
        container.style.transform = 'translateY(30px) scale(0.98)';
        setTimeout(() => {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0) scale(1)';
        }, 100);
    }

    initPasswordToggles() {
        document.querySelectorAll('.eye-toggle').forEach(button => {
            button.addEventListener('click', (e) => {
                const targetId = e.currentTarget.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    e.currentTarget.textContent = '🙈';
                } else {
                    passwordInput.type = 'password';
                    e.currentTarget.textContent = '👁️';
                }
            });
        });
    }

    initPasswordStrength() {
        const passwordInput = document.getElementById('signupPassword');
        const strengthContainer = document.getElementById('passwordStrength');
        const strengthFill = document.getElementById('strengthFill');
        const strengthLevel = document.getElementById('strengthLevel');

        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            if (password.length === 0) {
                strengthContainer.style.display = 'none';
                return;
            }
            strengthContainer.style.display = 'block';
            const strength = this.calculatePasswordStrength(password);
            strengthFill.className = 'strength-fill';
            
            // Note: In previous response, I was adding a class to strengthLevel,
            // which was incorrect. It should be style.color. Correcting it here.
            strengthLevel.style.color = `var(--${strength.class}-color)`;
            strengthLevel.textContent = strength.text;

            strengthFill.classList.add(strength.class);
        });
    }

    calculatePasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) return { class: 'weak', text: 'Weak' };
        if (score === 3) return { class: 'fair', text: 'Fair' };
        if (score === 4) return { class: 'good', text: 'Good' };
        return { class: 'strong', text: 'Strong' };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FitnessAuth();
});