/* ===================================================================
   МАСКИ ВВОДА, ВАЛИДАЦИЯ И ФОРМАТИРОВАНИЕ (BazarPro Masks)
   =================================================================== */

const Masks = {
    /**
     * Инициализация маски ввода для телефонных номеров: +7 (999) 000-00-00
     * @param {HTMLInputElement} input
     */
    applyPhoneMask(input) {
        if (!input) return;

        function onPhoneInput(e) {
            let val = input.value.replace(/\D/g, '');
            let formatted = '';

            if (!val) {
                input.value = '';
                return;
            }

            // Если первая цифра 7 или 8 или 9
            if (val[0] === '9') val = '7' + val;
            if (val[0] === '8') val = '7' + val.substring(1);
            if (val[0] !== '7') val = '7' + val;

            // Ограничиваем длину 11 цифрами
            val = val.substring(0, 11);

            // Формируем маску: +7 (XXX) XXX-XX-XX
            formatted = '+7';
            if (val.length > 1) {
                formatted += ' (' + val.substring(1, 4);
            }
            if (val.length >= 5) {
                formatted += ') ' + val.substring(4, 7);
            }
            if (val.length >= 8) {
                formatted += '-' + val.substring(7, 9);
            }
            if (val.length >= 10) {
                formatted += '-' + val.substring(9, 11);
            }

            input.value = formatted;
        }

        function onPhoneKeyDown(e) {
            // Обработка удаления первого символа
            if (e.key === 'Backspace' && input.value.replace(/\D/g, '').length === 1) {
                input.value = '';
            }
        }

        function onPhonePaste(e) {
            let pasted = (e.clipboardData || window.clipboardData).getData('text');
            if (pasted) {
                let numbers = pasted.replace(/\D/g, '');
                if (numbers.length >= 10) {
                    setTimeout(() => onPhoneInput(), 0);
                }
            }
        }

        input.addEventListener('input', onPhoneInput);
        input.addEventListener('keydown', onPhoneKeyDown);
        input.addEventListener('paste', onPhonePaste);
        input.addEventListener('focus', () => {
            if (!input.value) input.value = '+7 (';
        });
        input.addEventListener('blur', () => {
            if (input.value === '+7 (' || input.value === '+7') input.value = '';
        });
    },

    /**
     * Форматирование цены в реальном времени с разделением тысяч (например, 1 500 000 ₽)
     * @param {HTMLInputElement} input
     */
    applyPriceMask(input) {
        if (!input) return;

        input.addEventListener('input', () => {
            let rawValue = input.value.replace(/\D/g, '');
            if (!rawValue) {
                input.value = '';
                return;
            }
            let num = parseInt(rawValue, 10);
            if (isNaN(num)) {
                input.value = '';
                return;
            }
            input.value = num.toLocaleString('ru-RU');
        });
    },

    /**
     * Получить чистое числовое значение из поля с маской цены
     * @param {string} val
     * @returns {number}
     */
    cleanPrice(val) {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        let cleaned = String(val).replace(/\D/g, '');
        return parseInt(cleaned, 10) || 0;
    },

    /**
     * Оценка надежности пароля
     * @param {string} password
     * @returns {{ score: number, grade: 'weak'|'medium'|'strong', label: string, color: string }}
     */
    checkPasswordStrength(password) {
        if (!password) return { score: 0, grade: 'weak', label: 'Введите пароль', color: 'text-slate-400' };

        let score = 0;
        if (password.length >= 6) score += 20;
        if (password.length >= 8) score += 20;
        if (password.length >= 12) score += 10;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 20;
        if (/\d/.test(password)) score += 15;
        if (/[^a-zA-Z0-9]/.test(password)) score += 15;

        if (score < 40) {
            return { score, grade: 'weak', label: 'Слабый пароль (добавьте цифры/символы)', color: 'text-rose-500' };
        } else if (score < 75) {
            return { score, grade: 'medium', label: 'Хороший пароль', color: 'text-amber-500' };
        } else {
            return { score, grade: 'strong', label: 'Надежный пароль ✓', color: 'text-emerald-500' };
        }
    },

    /**
     * Валидация Email
     * @param {string} email
     * @returns {boolean}
     */
    isValidEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    },

    /**
     * Валидация номера телефона (должно быть 11 цифр)
     * @param {string} phone
     * @returns {boolean}
     */
    isValidPhone(phone) {
        if (!phone) return false;
        let digits = phone.replace(/\D/g, '');
        return digits.length === 11;
    },

    /**
     * Форматирование цены в рублях для отображения
     * @param {number} price
     * @param {boolean} negotiable
     * @returns {string}
     */
    formatPrice(price, negotiable = false) {
        if (price === 0 && negotiable) return 'Договорная';
        if (price === 0) return 'Бесплатно';
        return price.toLocaleString('ru-RU') + ' ₽';
    },

    /**
     * Форматирование даты в понятный вид ("Сегодня, 14:20", "Вчера", "12 мая 2024")
     * @param {string} dateString
     * @returns {string}
     */
    formatRelativeDate(dateString) {
        if (!dateString) return '';
        const d = new Date(dateString);
        const now = new Date();
        const diffMs = now - d;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        const timeStr = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

        if (diffHours < 24 && d.getDate() === now.getDate()) {
            return `Сегодня в ${timeStr}`;
        }
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth()) {
            return `Вчера в ${timeStr}`;
        }

        return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + ` в ${timeStr}`;
    }
};

// Автоматическая привязка масок при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type="tel"], input[data-mask="phone"]').forEach(input => {
        Masks.applyPhoneMask(input);
    });

    document.querySelectorAll('input[data-mask="price"]').forEach(input => {
        Masks.applyPriceMask(input);
    });
});
