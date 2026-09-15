/* ===================================================================
   СИСТЕМА АУТЕНТИФИКАЦИИ И ПОЛЬЗОВАТЕЛЕЙ (BazarPro Auth)
   =================================================================== */

const Auth = {
    /**
     * Получить текущего авторизованного пользователя
     * @returns {Object|null}
     */
    getCurrentUser() {
        const userJson = localStorage.getItem('bazarpro_current_user');
        if (!userJson) return null;
        try {
            return JSON.parse(userJson);
        } catch (e) {
            return null;
        }
    },

    /**
     * Проверка, авторизован ли пользователь
     * @returns {boolean}
     */
    isLoggedIn() {
        return !!this.getCurrentUser();
    },

    /**
     * Проверка, является ли пользователь администратором
     * @returns {boolean}
     */
    isAdmin() {
        const u = this.getCurrentUser();
        return u && u.role === 'admin';
    },

    /**
     * Авторизация пользователя
     * @param {string} email
     * @param {string} password
     * @returns {{ success: boolean, message: string, user?: Object }}
     */
    login(email, password) {
        if (!email || !password) {
            return { success: false, message: 'Заполните все поля для входа' };
        }

        const users = JSON.parse(localStorage.getItem('bazarpro_users') || '[]');
        const cleanEmail = email.trim().toLowerCase();

        const user = users.find(u => u.email.toLowerCase() === cleanEmail);

        if (!user) {
            return { success: false, message: 'Пользователь с таким email не найден' };
        }

        if (user.passwordHash !== password) {
            return { success: false, message: 'Неверный пароль' };
        }

        // Успешный вход
        localStorage.setItem('bazarpro_current_user', JSON.stringify(user));
        DB.addLog(user.email, 'AUTH_LOGIN', `Успешный вход в систему (${user.role})`);

        return { success: true, message: `Добро пожаловать, ${user.fullName}!`, user };
    },

    /**
     * Регистрация нового пользователя с масками и валидацией
     * @param {Object} data { fullName, email, phone, password }
     * @returns {{ success: boolean, message: string, user?: Object }}
     */
    register(data) {
        const { fullName, email, phone, password } = data;

        if (!fullName || !email || !password) {
            return { success: false, message: 'Пожалуйста, заполните обязательные поля' };
        }

        if (fullName.trim().length < 2) {
            return { success: false, message: 'Имя должно содержать минимум 2 символа' };
        }

        if (!Masks.isValidEmail(email)) {
            return { success: false, message: 'Введите корректный адрес электронной почты' };
        }

        if (phone && !Masks.isValidPhone(phone)) {
            return { success: false, message: 'Введите полный номер телефона в формате +7 (XXX) XXX-XX-XX' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Пароль должен быть не менее 6 символов' };
        }

        const users = JSON.parse(localStorage.getItem('bazarpro_users') || '[]');
        const cleanEmail = email.trim().toLowerCase();

        if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
            return { success: false, message: 'Пользователь с таким Email уже зарегистрирован' };
        }

        const newUser = {
            id: 'u_' + Date.now(),
            email: cleanEmail,
            passwordHash: password,
            fullName: fullName.trim(),
            phone: phone ? phone.trim() : '+7 (999) 000-00-00',
            role: 'user',
            rating: 5.0,
            reviewsCount: 0,
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            city: 'Москва',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('bazarpro_users', JSON.stringify(users));
        localStorage.setItem('bazarpro_current_user', JSON.stringify(newUser));

        DB.addLog(newUser.email, 'AUTH_REGISTER', `Зарегистрирован новый пользователь "${newUser.fullName}"`);

        return { success: true, message: 'Регистрация прошла успешно!', user: newUser };
    },

    /**
     * Выход из аккаунта
     */
    logout() {
        const user = this.getCurrentUser();
        if (user) {
            DB.addLog(user.email, 'AUTH_LOGOUT', 'Выход из системы');
        }
        localStorage.removeItem('bazarpro_current_user');
        window.location.reload();
    },

    /**
     * Обновление профиля
     * @param {Object} updateData
     */
    updateProfile(updateData) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false, message: 'Необходима авторизация' };

        const users = JSON.parse(localStorage.getItem('bazarpro_users') || '[]');
        const index = users.findIndex(u => u.id === currentUser.id);

        if (index === -1) return { success: false, message: 'Пользователь не найден' };

        const updatedUser = { ...users[index], ...updateData };
        users[index] = updatedUser;

        localStorage.setItem('bazarpro_users', JSON.stringify(users));
        localStorage.setItem('bazarpro_current_user', JSON.stringify(updatedUser));

        DB.addLog(updatedUser.email, 'PROFILE_UPDATE', 'Обновление данных профиля');

        return { success: true, message: 'Профиль успешно обновлен', user: updatedUser };
    }
};
