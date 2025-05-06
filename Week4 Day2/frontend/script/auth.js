const BASE_URL = 'http://localhost:5000/api/auth';

async function login() {
    const email = document.getElementById('login_email').value.trim();
    const password = document.getElementById('login_password').value.trim();

    if (!email || !password) {
        showMessage('Please enter both email and password', 'error');
        return;
    }

    const button = document.querySelector('button');
    button.innerHTML = '<div class="spinner" style="width:20px;height:20px;"></div>';
    button.disabled = true;

    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();

        if (res.ok) {
            // Save token and redirect
            localStorage.setItem('token', data.token);
            showMessage('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showMessage(data.error || 'Login failed', 'error');
        }
    } catch (err) {
        showMessage('Network error. Try again.', 'error');
    } finally {
        button.innerHTML = 'Login';
        button.disabled = false;
    }
}

async function register() {
    const name = document.getElementById('reg_name').value.trim();
    const email = document.getElementById('reg_email').value.trim();
    const password = document.getElementById('reg_password').value.trim();
    const agreeTerms = document.getElementById('agree_terms')?.checked;

    if (!name || !email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    if (!agreeTerms) {
        showMessage('Please agree to the terms & conditions', 'error');
        return;
    }

    const button = document.querySelector('button');
    button.innerHTML = '<div class="spinner" style="width:20px;height:20px;"></div>';
    button.disabled = true;

    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            showMessage('Registration successful! Redirecting to login...', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        } else {
            showMessage(data.error || 'Registration failed', 'error');
        }
    } catch (err) {
        showMessage('Network error. Try again.', 'error');
    } finally {
        button.innerHTML = 'Register';
        button.disabled = false;
    }
}

function showMessage(message, type) {
    const messageId = window.location.pathname.includes('login') ? 'login_message' : 'register_message';
    const messageDiv = document.getElementById(messageId);
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

function checkAuth() {
    const token = localStorage.getItem('token');
    const isAuthPage = window.location.pathname.includes('login') || window.location.pathname.includes('register') ||  window.location.pathname.includes('index')

    if (token && isAuthPage) {
        window.location.href = 'dashboard.html';
    } else if (!token && !isAuthPage) {
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', checkAuth);
