/* ===================================================================
   ГЛАВНЫЙ МОДУЛЬ ПРИЛОЖЕНИЯ И ГЛОБАЛЬНЫЙ UI (BazarPro App)
   =================================================================== */

const App = {
    init() {
        this.initTheme();
        this.renderHeaderAuth();
        this.updateFavoritesCount();
        this.bindGlobalEvents();

        if (window.lucide) {
            lucide.createIcons();
        }
    },

    // Тёмная / Светлая тема
    initTheme() {
        const isDark = localStorage.getItem('bazarpro_theme') === 'dark' || 
            (!('bazarpro_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    },

    toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('bazarpro_theme', isDark ? 'dark' : 'light');
        if (window.lucide) lucide.createIcons();
    },

    // Отрисовка профиля в шапке
    renderHeaderAuth() {
        const user = Auth.getCurrentUser();
        const container = document.getElementById('header-auth-container');
        const mobileContainer = document.getElementById('mobile-auth-container');

        const authHtml = user ? `
            <div class="relative group">
                <button class="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <img src="${user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}" class="w-8 h-8 rounded-full object-cover border border-indigo-500">
                    <span class="text-sm font-semibold hidden md:inline text-slate-800 dark:text-slate-100">${user.fullName.split(' ')[0]}</span>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400"></i>
                </button>
                <div class="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <div class="font-bold text-sm text-slate-900 dark:text-white">${user.fullName}</div>
                        <div class="text-xs text-slate-400 truncate">${user.email}</div>
                    </div>
                    <a href="profile.html" class="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors">
                        <i data-lucide="user" class="w-4 h-4"></i> Мой профиль
                    </a>
                    <a href="profile.html#ads" class="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors">
                        <i data-lucide="layers" class="w-4 h-4"></i> Мои объявления
                    </a>
                    <a href="profile.html#favorites" class="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors">
                        <i data-lucide="heart" class="w-4 h-4"></i> Избранное
                    </a>
                    ${user.role === 'admin' ? `
                    <a href="admin.html" class="flex items-center gap-2.5 px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-semibold transition-colors">
                        <i data-lucide="shield-check" class="w-4 h-4"></i> Админ-панель
                    </a>` : ''}
                    <button onclick="Auth.logout()" class="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors border-t border-slate-100 dark:border-slate-800 mt-1">
                        <i data-lucide="log-out" class="w-4 h-4"></i> Выйти
                    </button>
                </div>
            </div>
        ` : `
            <a href="auth.html" class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <i data-lucide="log-in" class="w-4 h-4"></i> Вход / Регистрация
            </a>
        `;

        if (container) container.innerHTML = authHtml;
        if (mobileContainer) mobileContainer.innerHTML = authHtml;
    },

    // Счетчик избранного
    updateFavoritesCount() {
        const user = Auth.getCurrentUser();
        const count = user ? DB.getFavorites(user.id).length : 0;
        const badges = document.querySelectorAll('.favorites-badge');
        badges.forEach(b => {
            b.innerText = count;
            b.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    // Всплывающие уведомления (Toasts)
    showToast(message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const icons = {
            success: 'check-circle',
            error: 'alert-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i data-lucide="${icons[type] || 'info'}" class="w-5 h-5 shrink-0"></i>
            <span class="text-sm font-medium leading-snug">${message}</span>
        `;

        container.appendChild(toast);
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    },

    // Модальные окна
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    // Глобальные события
    bindGlobalEvents() {
        // Поиск по Enter
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const q = searchInput.value.trim();
                    window.location.href = `catalog.html?q=${encodeURIComponent(q)}`;
                }
            });
        }

        // Закрытие модалок по клику на фон
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
