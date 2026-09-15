/* ===================================================================
   ПАНЕЛЬ УПРАВЛЕНИЯ АДМИНИСТРАТОРА (BazarPro Admin Dashboard)
   =================================================================== */

const Admin = {
    /**
     * Инициализация дашборда администратора
     */
    async init() {
        if (!Auth.isAdmin()) {
            App.showToast('Доступ запрещен. Требуются права администратора', 'error');
            setTimeout(() => window.location.href = 'auth.html', 1200);
            return;
        }

        this.renderStats();
        this.renderAdsTable();
        this.renderUsersTable();
        this.renderLogsTable();
        this.renderSupabaseSettings();
    },

    /**
     * Рендеринг ключевых метрик платформы
     */
    async renderStats() {
        const ads = await DB.getAds();
        const users = JSON.parse(localStorage.getItem('bazarpro_users') || '[]');
        const totalViews = ads.reduce((sum, a) => sum + (a.viewsCount || 0), 0);
        const vipCount = ads.filter(a => a.isVip).length;

        const statTotalAds = document.getElementById('stat-total-ads');
        const statTotalUsers = document.getElementById('stat-total-users');
        const statTotalViews = document.getElementById('stat-total-views');
        const statVipAds = document.getElementById('stat-vip-ads');

        if (statTotalAds) statTotalAds.innerText = ads.length;
        if (statTotalUsers) statTotalUsers.innerText = users.length;
        if (statTotalViews) statTotalViews.innerText = totalViews.toLocaleString('ru-RU');
        if (statVipAds) statVipAds.innerText = vipCount;
    },

    /**
     * Таблица модерации объявлений
     */
    async renderAdsTable() {
        const tableBody = document.getElementById('admin-ads-table');
        if (!tableBody) return;

        const ads = await DB.getAds();

        if (ads.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">Объявлений пока нет</td></tr>`;
            return;
        }

        tableBody.innerHTML = ads.map(ad => `
            <tr class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                        <img src="${(ad.photos && ad.photos[0]) || ''}" class="w-12 h-12 object-cover rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0" alt="">
                        <div>
                            <a href="ad-details.html?id=${ad.id}" class="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 line-clamp-1">${ad.title}</a>
                            <span class="text-xs text-slate-400">${ad.categoryName || 'Категория'} • ${ad.city}</span>
                        </div>
                    </div>
                </td>
                <td class="py-3 px-4 text-sm font-bold text-slate-900 dark:text-white">${Masks.formatPrice(ad.price, ad.priceNegotiable)}</td>
                <td class="py-3 px-4 text-xs text-slate-500">${ad.userName || 'Продавец'}</td>
                <td class="py-3 px-4">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${ad.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'}">
                        ${ad.status === 'active' ? 'Активно' : 'На модерации'}
                    </span>
                    ${ad.isVip ? '<span class="vip-badge text-[10px] ml-1">VIP</span>' : ''}
                </td>
                <td class="py-3 px-4 text-xs text-slate-400">${ad.viewsCount || 0}</td>
                <td class="py-3 px-4 text-right space-x-2">
                    <button onclick="Admin.toggleVip('${ad.id}', ${!ad.isVip})" class="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-950 text-amber-500 rounded-lg" title="${ad.isVip ? 'Снять VIP' : 'Сделать VIP'}">
                        <i data-lucide="zap" class="w-4 h-4"></i>
                    </button>
                    <button onclick="Admin.deleteAd('${ad.id}')" class="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-500 rounded-lg" title="Удалить">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        if (window.lucide) lucide.createIcons();
    },

    /**
     * Таблица пользователей
     */
    renderUsersTable() {
        const tableBody = document.getElementById('admin-users-table');
        if (!tableBody) return;

        const users = JSON.parse(localStorage.getItem('bazarpro_users') || '[]');

        tableBody.innerHTML = users.map(u => `
            <tr class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                        <img src="${u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}" class="w-9 h-9 rounded-full object-cover">
                        <div>
                            <div class="font-bold text-sm text-slate-900 dark:text-white">${u.fullName}</div>
                            <div class="text-xs text-slate-400">${u.email}</div>
                        </div>
                    </div>
                </td>
                <td class="py-3 px-4 text-xs font-mono text-slate-600 dark:text-slate-300">${u.phone || 'Не указан'}</td>
                <td class="py-3 px-4">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}">
                        ${u.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </span>
                </td>
                <td class="py-3 px-4 text-xs text-slate-400">${new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
        `).join('');
    },

    /**
     * Таблица системных логов (Audit Log)
     */
    renderLogsTable() {
        const tableBody = document.getElementById('admin-logs-table');
        if (!tableBody) return;

        const logs = DB.getLogs();

        tableBody.innerHTML = logs.map(l => `
            <tr class="border-b border-slate-100 dark:border-slate-800 text-xs font-mono">
                <td class="py-2.5 px-3 text-slate-400">${new Date(l.timestamp).toLocaleTimeString()}</td>
                <td class="py-2.5 px-3 text-indigo-600 dark:text-indigo-400 font-bold">${l.action}</td>
                <td class="py-2.5 px-3 text-slate-700 dark:text-slate-300">${l.details}</td>
                <td class="py-2.5 px-3 text-slate-400">${l.userEmail || 'Система'}</td>
            </tr>
        `).join('');
    },

    /**
     * Переключение VIP статуса объявления
     */
    async toggleVip(adId, isVip) {
        await DB.updateAd(adId, { isVip });
        App.showToast(isVip ? 'VIP-статус присвоен' : 'VIP-статус снят', 'success');
        this.renderStats();
        this.renderAdsTable();
    },

    /**
     * Удаление объявления
     */
    async deleteAd(adId) {
        if (!confirm('Вы уверены, что хотите удалить это объявление?')) return;
        await DB.deleteAd(adId);
        App.showToast('Объявление удалено', 'info');
        this.renderStats();
        this.renderAdsTable();
    },

    /**
     * Настройка ключей Supabase
     */
    renderSupabaseSettings() {
        const urlInput = document.getElementById('sb-url-input');
        const keyInput = document.getElementById('sb-key-input');
        const statusBadge = document.getElementById('sb-status-badge');

        if (urlInput) urlInput.value = DB.supabaseUrl || '';
        if (keyInput) keyInput.value = DB.supabaseKey || '';

        if (statusBadge) {
            if (DB.isSupabaseActive) {
                statusBadge.className = 'px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400';
                statusBadge.innerText = 'Подключено к Supabase Cloud';
            } else {
                statusBadge.className = 'px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400';
                statusBadge.innerText = 'Локальный режим (Mock/LocalStorage)';
            }
        }
    },

    saveSupabaseConfig(e) {
        e.preventDefault();
        const url = document.getElementById('sb-url-input').value.trim();
        const key = document.getElementById('sb-key-input').value.trim();

        DB.configureSupabase(url, key);
        App.showToast('Настройки Supabase сохранены!', 'success');
        this.renderSupabaseSettings();
    },

    resetAllData() {
        if (!confirm('Сбросить все объявления, пользователей и логи к первоначальному состоянию?')) return;
        DB.resetData();
        App.showToast('База данных успешно сброшена', 'success');
        setTimeout(() => window.location.reload(), 800);
    }
};
