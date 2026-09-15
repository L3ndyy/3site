/* ===================================================================
   СЕРВИС ДАННЫХ: ИНТЕГРАЦИЯ С SUPABASE И ЛОКАЛЬНАЯ БД (BazarPro DB)
   =================================================================== */

class DataService {
    constructor() {
        this.supabaseUrl = localStorage.getItem('bazarpro_sb_url') || '';
        this.supabaseKey = localStorage.getItem('bazarpro_sb_key') || '';
        this.supabase = null;
        this.isSupabaseActive = false;

        this.initSupabase();
        this.initLocalStorage();
    }

    initSupabase() {
        if (this.supabaseUrl && this.supabaseKey && window.supabase) {
            try {
                this.supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
                this.isSupabaseActive = true;
                console.log('✅ Supabase подключен успешно к:', this.supabaseUrl);
            } catch (err) {
                console.warn('⚠️ Ошибка инициализации Supabase, переключение на локальный режим:', err);
                this.isSupabaseActive = false;
            }
        } else {
            this.isSupabaseActive = false;
        }
    }

    initLocalStorage() {
        if (!localStorage.getItem('bazarpro_ads')) {
            localStorage.setItem('bazarpro_ads', JSON.stringify(INITIAL_ADS));
        }
        if (!localStorage.getItem('bazarpro_categories')) {
            localStorage.setItem('bazarpro_categories', JSON.stringify(INITIAL_CATEGORIES));
        }
        if (!localStorage.getItem('bazarpro_users')) {
            localStorage.setItem('bazarpro_users', JSON.stringify(INITIAL_USERS));
        }
        if (!localStorage.getItem('bazarpro_favorites')) {
            localStorage.setItem('bazarpro_favorites', JSON.stringify([]));
        }
        if (!localStorage.getItem('bazarpro_messages')) {
            localStorage.setItem('bazarpro_messages', JSON.stringify([]));
        }
        if (!localStorage.getItem('bazarpro_logs')) {
            localStorage.setItem('bazarpro_logs', JSON.stringify(INITIAL_LOGS));
        }
    }

    // Сохранить ключи Supabase из настроек
    configureSupabase(url, key) {
        if (url && key) {
            localStorage.setItem('bazarpro_sb_url', url);
            localStorage.setItem('bazarpro_sb_key', key);
            this.supabaseUrl = url;
            this.supabaseKey = key;
            this.initSupabase();
            return true;
        } else {
            localStorage.removeItem('bazarpro_sb_url');
            localStorage.removeItem('bazarpro_sb_key');
            this.supabase = null;
            this.isSupabaseActive = false;
            return false;
        }
    }

    // ===================================================================
    // ОБЪЯВЛЕНИЯ (ADS)
    // ===================================================================

    async getAds(filterOptions = {}) {
        if (this.isSupabaseActive) {
            try {
                let query = this.supabase.from('ads').select('*').order('created_at', { ascending: false });
                if (filterOptions.categoryId) query = query.eq('category_id', filterOptions.categoryId);
                if (filterOptions.city) query = query.eq('city', filterOptions.city);
                if (filterOptions.status) query = query.eq('status', filterOptions.status);
                const { data, error } = await query;
                if (!error && data && data.length > 0) return data;
            } catch (e) {
                console.warn('Fallback to LocalStorage:', e);
            }
        }

        let ads = JSON.parse(localStorage.getItem('bazarpro_ads') || '[]');

        // Фильтрация
        if (filterOptions.query) {
            const q = filterOptions.query.toLowerCase().trim();
            ads = ads.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
        }
        if (filterOptions.categoryId) {
            ads = ads.filter(a => Number(a.categoryId) === Number(filterOptions.categoryId));
        }
        if (filterOptions.city) {
            ads = ads.filter(a => a.city.toLowerCase() === filterOptions.city.toLowerCase());
        }
        if (filterOptions.minPrice) {
            ads = ads.filter(a => a.price >= filterOptions.minPrice);
        }
        if (filterOptions.maxPrice) {
            ads = ads.filter(a => a.price <= filterOptions.maxPrice);
        }
        if (filterOptions.condition) {
            ads = ads.filter(a => a.condition === filterOptions.condition);
        }
        if (filterOptions.status) {
            ads = ads.filter(a => a.status === filterOptions.status);
        }
        if (filterOptions.userId) {
            ads = ads.filter(a => a.userId === filterOptions.userId);
        }
        if (filterOptions.vipOnly) {
            ads = ads.filter(a => a.isVip);
        }

        // Сортировка
        if (filterOptions.sortBy === 'price_asc') {
            ads.sort((a, b) => a.price - b.price);
        } else if (filterOptions.sortBy === 'price_desc') {
            ads.sort((a, b) => b.price - a.price);
        } else if (filterOptions.sortBy === 'views') {
            ads.sort((a, b) => b.viewsCount - a.viewsCount);
        } else {
            // По умолчанию - новые
            ads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return ads;
    }

    async getAdById(id) {
        if (this.isSupabaseActive) {
            try {
                const { data, error } = await this.supabase.from('ads').select('*').eq('id', id).single();
                if (!error && data) return data;
            } catch (e) {}
        }
        const ads = JSON.parse(localStorage.getItem('bazarpro_ads') || '[]');
        return ads.find(a => String(a.id) === String(id)) || null;
    }

    async incrementViews(id) {
        const ads = JSON.parse(localStorage.getItem('bazarpro_ads') || '[]');
        const ad = ads.find(a => String(a.id) === String(id));
        if (ad) {
            ad.viewsCount = (ad.viewsCount || 0) + 1;
            localStorage.setItem('bazarpro_ads', JSON.stringify(ads));
        }
    }

    async createAd(adData) {
        const ads = JSON.parse(localStorage.getItem('bazarpro_ads') || '[]');
        const newAd = {
            id: 'ad_' + Date.now(),
            createdAt: new Date().toISOString(),
            viewsCount: 1,
            status: 'active',
            ...adData
        };
        ads.unshift(newAd);
        localStorage.setItem('bazarpro_ads', JSON.stringify(ads));

        // Добавляем действие в аудит-лог
        this.addLog(newAd.userEmail || 'Пользователь', 'AD_CREATE', `Создано объявление "${newAd.title}" (${newAd.price} ₽)`);

        if (this.isSupabaseActive) {
            try {
                await this.supabase.from('ads').insert([newAd]);
            } catch (e) {
                console.warn('Supabase sync error:', e);
            }
        }
        return newAd;
    }

    async updateAd(id, updateFields) {
        const ads = JSON.parse(localStorage.getItem('bazarpro_ads') || '[]');
        const index = ads.findIndex(a => String(a.id) === String(id));
        if (index !== -1) {
            ads[index] = { ...ads[index], ...updateFields, updatedAt: new Date().toISOString() };
            localStorage.setItem('bazarpro_ads', JSON.stringify(ads));

            this.addLog('Система', 'AD_UPDATE', `Обновлено объявление ID ${id}`);
            return ads[index];
        }
        return null;
    }

    async deleteAd(id) {
        let ads = JSON.parse(localStorage.getItem('bazarpro_ads') || '[]');
        const ad = ads.find(a => String(a.id) === String(id));
        ads = ads.filter(a => String(a.id) !== String(id));
        localStorage.setItem('bazarpro_ads', JSON.stringify(ads));

        if (ad) {
            this.addLog('Система', 'AD_DELETE', `Удалено объявление "${ad.title}"`);
        }
        return true;
    }

    // ===================================================================
    // КАТЕГОРИИ
    // ===================================================================

    async getCategories() {
        return JSON.parse(localStorage.getItem('bazarpro_categories') || '[]');
    }

    // ===================================================================
    // ИЗБРАННОЕ (FAVORITES)
    // ===================================================================

    getFavorites(userId) {
        const favs = JSON.parse(localStorage.getItem('bazarpro_favorites') || '[]');
        return favs.filter(f => f.userId === userId).map(f => f.adId);
    }

    toggleFavorite(userId, adId) {
        let favs = JSON.parse(localStorage.getItem('bazarpro_favorites') || '[]');
        const existsIndex = favs.findIndex(f => f.userId === userId && f.adId === adId);
        let added = false;

        if (existsIndex !== -1) {
            favs.splice(existsIndex, 1);
            added = false;
        } else {
            favs.push({ id: 'fav_' + Date.now(), userId, adId, createdAt: new Date().toISOString() });
            added = true;
        }
        localStorage.setItem('bazarpro_favorites', JSON.stringify(favs));
        return added;
    }

    // ===================================================================
    // ЧАТ И СООБЩЕНИЯ
    // ===================================================================

    getMessages(adId, userId = null) {
        const msgs = JSON.parse(localStorage.getItem('bazarpro_messages') || '[]');
        if (adId) {
            return msgs.filter(m => String(m.adId) === String(adId));
        }
        if (userId) {
            return msgs.filter(m => m.senderId === userId || m.receiverId === userId);
        }
        return msgs;
    }

    sendMessage(msgData) {
        const msgs = JSON.parse(localStorage.getItem('bazarpro_messages') || '[]');
        const newMsg = {
            id: 'msg_' + Date.now(),
            createdAt: new Date().toISOString(),
            isRead: false,
            ...msgData
        };
        msgs.push(newMsg);
        localStorage.setItem('bazarpro_messages', JSON.stringify(msgs));
        return newMsg;
    }

    // ===================================================================
    // АКТИВНОСТЬ И ЛОГИРОВАНИЕ (AUDIT LOGS)
    // ===================================================================

    getLogs() {
        return JSON.parse(localStorage.getItem('bazarpro_logs') || '[]');
    }

    addLog(userEmail, action, details) {
        const logs = JSON.parse(localStorage.getItem('bazarpro_logs') || '[]');
        const newLog = {
            id: 'log_' + Date.now(),
            userEmail,
            action,
            details,
            timestamp: new Date().toISOString()
        };
        logs.unshift(newLog);
        // Ограничиваем историю 100 записями
        if (logs.length > 100) logs.pop();
        localStorage.setItem('bazarpro_logs', JSON.stringify(logs));
    }

    // Сброс к первоначальным демо-данным
    resetData() {
        localStorage.setItem('bazarpro_ads', JSON.stringify(INITIAL_ADS));
        localStorage.setItem('bazarpro_categories', JSON.stringify(INITIAL_CATEGORIES));
        localStorage.setItem('bazarpro_users', JSON.stringify(INITIAL_USERS));
        localStorage.setItem('bazarpro_favorites', JSON.stringify([]));
        localStorage.setItem('bazarpro_messages', JSON.stringify([]));
        localStorage.setItem('bazarpro_logs', JSON.stringify(INITIAL_LOGS));
        console.log('🔄 База данных успешно сброшена к демо-состоянию');
    }
}

// Экспортируем глобальный экземпляр
const DB = new DataService();
