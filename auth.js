// В начало auth.js добавим проверку администратора
const ADMIN_USERNAME = "admin"; // Логин администратора
const ADMIN_PASSWORD = "admin123"; // Пароль администратора

document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("currentUser");
    
    // Автоматическое перенаправление если уже вошел
    if (user && window.location.pathname.includes("login")) {
        window.location.href = "index.html";
    }

    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");

    if (registerForm) {
        registerForm.addEventListener("submit", e => {
            e.preventDefault();
            const username = document.getElementById("register-username").value;
            const password = document.getElementById("register-password").value;

            // Запрещаем регистрацию с именем admin
            if (username === ADMIN_USERNAME) {
                alert("Это имя пользователя зарезервировано");
                return;
            }

            const users = JSON.parse(localStorage.getItem("users") || "{}");
            if (users[username]) {
                alert("Пользователь уже существует");
                return;
            }

            users[username] = { password };
            localStorage.setItem("users", JSON.stringify(users));
            alert("Регистрация прошла успешно!");
            window.location.href = "login.html";
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", e => {
            e.preventDefault();
            const username = document.getElementById("login-username").value;
            const password = document.getElementById("login-password").value;

            // Проверка на администратора
            if (username === ADMIN_USERNAME) {
                if (password === ADMIN_PASSWORD) {
                    localStorage.setItem("currentUser", username);
                    localStorage.setItem("isAdmin", "true"); // Добавляем флаг администратора
                    alert("Вход выполнен как администратор");
                    window.location.href = "index.html";
                    return;
                } else {
                    alert("Неверный пароль администратора");
                    return;
                }
            }

            const users = JSON.parse(localStorage.getItem("users") || "{}");
            if (!users[username] || users[username].password !== password) {
                alert("Неверный логин или пароль");
                return;
            }

            localStorage.setItem("currentUser", username);
            localStorage.removeItem("isAdmin"); // Убираем флаг для обычных пользователей
            alert("Вход выполнен");
            window.location.href = "index.html";
        });
    }
});