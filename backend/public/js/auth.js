const API = '';

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showLoginBtn = document.getElementById('show-login');
const showSignupBtn = document.getElementById('show-signup');

showLoginBtn.addEventListener('click', () => {
    showLoginBtn.classList.add('active');
    showSignupBtn.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
});
showSignupBtn.addEventListener('click', () => {
    showSignupBtn.classList.add('active');
    showLoginBtn.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

// login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const msg = document.getElementById('login-msg');

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) {
            msg.textContent = data.msg || 'Login failed';
            return;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/dashboard.html';
    } catch (err) {
        msg.textContent = 'Server error';
    }
});

// signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const college = document.getElementById('signup-college').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const msg = document.getElementById('signup-msg');

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, college, email, password })
        });
        const data = await res.json();
        if (!res.ok) {
            msg.textContent = data.msg || 'Signup failed';
            return;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/dashboard.html';
    } catch (err) {
        msg.textContent = 'Server error';
    }
});
