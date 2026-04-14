const USERS_KEY = 'gdu_fashionstore_users';
const CURRENT_USER_KEY = 'gdu_fashionstore_current_user';

document.addEventListener('DOMContentLoaded', () => {
    // Signup Logic
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSignup();
        });
    }

    // Login Logic
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
});

function handleSignup() {
    const fullNameElement = document.getElementById('fullname');
    const emailElement = document.getElementById('email');
    const passwordElement = document.getElementById('password');
    const confirmPassElement = document.getElementById('confirm-password');

    if (!fullNameElement || !emailElement || !passwordElement || !confirmPassElement) return;

    const fullName = fullNameElement.value.trim();
    const email = emailElement.value.trim();
    const password = passwordElement.value;
    const confirmPassword = confirmPassElement.value;

    // Validation
    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    
    // Check if user exists
    if (users.some(user => user.email === email)) {
        alert('Email này đã được đăng ký!');
        return;
    }

    // Save User
    const newUser = { fullName, email, password };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    alert('Đăng ký thành công! Hãy đăng nhập.');
    window.location.href = 'login.html';
}

function handleLogin() {
    const emailElement = document.getElementById('email');
    const passwordElement = document.getElementById('password');

    if (!emailElement || !passwordElement) return;

    const email = emailElement.value.trim();
    const password = passwordElement.value;

    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
            fullName: user.fullName,
            email: user.email
        }));
        alert(`Chào mừng ${user.fullName} đã quay trở lại!`);
        window.location.href = 'index.html';
    } else {
        alert('Email hoặc mật khẩu không chính xác.');
    }
}
