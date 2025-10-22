// auth.js - Модуль для роботи з аутентифікацією та API
class AuthService {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5000/api';
        this.sessionKey = 'habittrack_session';
        this.activityTimeout = 30 * 60 * 1000; // 30 хвилин
        this.checkInterval = 60 * 1000; // перевірка кожну хвилину
        
        this.initActivityTracking();
        this.startSessionCheck();
    }

    // Реєстрація користувача
    async register(userData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Помилка реєстрації');
            }

            return result;
        } catch (error) {
            console.error('Помилка реєстрації:', error);
            throw error;
        }
    }

    // Вхід в систему
    async login(email, password) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Помилка входу');
            }

            // Зберігаємо сесію
            this.saveSession({
                ...result,
                loginTime: Date.now()
            });

            return result;
        } catch (error) {
            console.error('Помилка входу:', error);
            throw error;
        }
    }

    // Вихід з системи
    logout() {
        localStorage.removeItem(this.sessionKey);
        this.redirectToLogin();
    }

    // Отримати поточного користувача
    getCurrentUser() {
        const session = localStorage.getItem(this.sessionKey);
        if (!session) return null;
        
        try {
            return JSON.parse(session);
        } catch {
            return null;
        }
    }

    // Перевірити чи користувач авторизований
    isAuthenticated() {
        const user = this.getCurrentUser();
        if (!user) return false;
        
        // Перевіряємо чи не минув час сесії
        const now = Date.now();
        const loginTime = user.loginTime || 0;
        
        if (now - loginTime > this.activityTimeout) {
            this.logout();
            return false;
        }
        
        return true;
    }

    // Оновити профіль користувача
    async updateProfile(userId, profileData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData)
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Помилка оновлення профілю');
            }

            // Оновлюємо дані в сесії
            const currentUser = this.getCurrentUser();
            if (currentUser) {
                const updatedUser = { ...currentUser, ...result };
                this.saveSession(updatedUser);
            }

            return result;
        } catch (error) {
            console.error('Помилка оновлення профілю:', error);
            throw error;
        }
    }

    // Змінити пароль
    async changePassword(userId, currentPassword, newPassword) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/user/${userId}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Помилка зміни пароля');
            }

            return result;
        } catch (error) {
            console.error('Помилка зміни пароля:', error);
            throw error;
        }
    }

    // Отримати дані користувача
    async getUserData(userId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/user/${userId}`);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Помилка завантаження даних');
            }

            return result;
        } catch (error) {
            console.error('Помилка завантаження даних:', error);
            throw error;
        }
    }

    // Зберегти сесію
    saveSession(userData) {
        localStorage.setItem(this.sessionKey, JSON.stringify(userData));
    }

    // Завантажити аватар (multipart/form-data)
    async uploadAvatar(userId, file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${this.apiBaseUrl}/user/${userId}/avatar`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Помилка завантаження аватара');
            }

            return result;
        } catch (error) {
            console.error('Помилка uploadAvatar:', error);
            throw error;
        }
    }

    // Перенаправити на сторінку входу
    redirectToLogin() {
        if (window.location.pathname !== '/login.html' && !window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }

    // Перевірити авторизацію на сторінці
    checkPageAuth() {
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return false;
        }
        return true;
    }

    // Відстеження активності користувача
    initActivityTracking() {
        const updateActivity = () => {
            const user = this.getCurrentUser();
            if (user) {
                user.loginTime = Date.now();
                this.saveSession(user);
            }
        };

        // Оновлюємо час активності при взаємодії
        ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
            document.addEventListener(event, updateActivity, { passive: true });
        });
    }

    // Перевірка сесії кожну хвилину
    startSessionCheck() {
        setInterval(() => {
            if (!this.isAuthenticated()) {
                this.redirectToLogin();
            }
        }, this.checkInterval);
    }

    // Показати повідомлення про помилку
    showError(message) {
        // Створюємо або знаходимо елемент для повідомлень
        let errorDiv = document.getElementById('errorMsg');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'errorMsg';
            errorDiv.className = 'error';
            errorDiv.style.display = 'none';
            document.body.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Приховуємо через 5 секунд
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    // Показати повідомлення про успіх
    showSuccess(message) {
        let successDiv = document.getElementById('successMsg');
        if (!successDiv) {
            successDiv = document.createElement('div');
            successDiv.id = 'successMsg';
            successDiv.className = 'success';
            successDiv.style.display = 'none';
            document.body.appendChild(successDiv);
        }
        
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }
}

// Створюємо глобальний екземпляр
window.authService = new AuthService();
