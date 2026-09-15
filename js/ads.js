/* ===================================================================
   ЛОГИКА ОБЪЯВЛЕНИЙ: ОТОБРАЖЕНИЕ, ФИЛЬТРЫ, СОЗДАНИЕ (BazarPro Ads)
   =================================================================== */

const Ads = {
    /**
     * Генерация HTML разметки карточки объявления
     * @param {Object} ad
     * @param {string} currentUserId
     * @param {boolean} isListView
     * @returns {string}
     */
    renderCard(ad, currentUserId = null, isListView = false) {
        const userFavs = currentUserId ? DB.getFavorites(currentUserId) : [];
        const isFav = userFavs.includes(ad.id);
        const photo = (ad.photos && ad.photos.length > 0) ? ad.photos[0] : 'images/placeholder.jpg';
        const formattedPrice = Masks.formatPrice(ad.price, ad.priceNegotiable);
        const formattedDate = Masks.formatRelativeDate(ad.createdAt);

        if (isListView) {
            return `
            <div class="card-premium flex flex-col md:flex-row overflow-hidden hover-lift group relative" data-ad-id="${ad.id}">
                <div class="relative w-full md:w-72 h-52 shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src="${photo}" alt="${ad.title}" onerror="this.src='images/placeholder.jpg'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                    ${ad.isVip ? `<span class="vip-badge absolute top-3 left-3 flex items-center gap-1"><i data-lucide="zap" class="w-3 h-3"></i> VIP</span>` : ''}
                    <button onclick="event.stopPropagation(); Ads.toggleFavorite('${ad.id}')" class="fav-btn absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-900/90 rounded-full shadow-md text-slate-400 hover:text-rose-500 transition-colors ${isFav ? 'text-rose-500' : ''}">
                        <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}"></i>
                    </button>
                </div>
                <div class="p-5 flex flex-col justify-between flex-1">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full">${ad.categoryName || 'Категория'}</span>
                            <span class="text-xs text-slate-400">${formattedDate}</span>
                        </div>
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
                            <a href="ad-details.html?id=${ad.id}">${ad.title}</a>
                        </h3>
                        <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">${ad.description}</p>
                    </div>
                    <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div class="text-xl font-extrabold text-slate-900 dark:text-white">${formattedPrice}</div>
                        <div class="flex items-center gap-3">
                            <span class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-indigo-500"></i> ${ad.city}
                            </span>
                            <a href="ad-details.html?id=${ad.id}" class="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 font-medium text-xs rounded-lg hover:bg-indigo-600 hover:text-white transition-all">Подробнее</a>
                        </div>
                    </div>
                </div>
            </div>`;
        }

        return `
        <div class="card-premium flex flex-col overflow-hidden hover-lift group relative cursor-pointer" onclick="window.location.href='ad-details.html?id=${ad.id}'" data-ad-id="${ad.id}">
            <div class="relative w-full h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src="${photo}" alt="${ad.title}" onerror="this.src='images/placeholder.jpg'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                ${ad.isVip ? `<span class="vip-badge absolute top-3 left-3 flex items-center gap-1"><i data-lucide="zap" class="w-3 h-3"></i> VIP</span>` : ''}
                <button onclick="event.stopPropagation(); Ads.toggleFavorite('${ad.id}')" class="fav-btn absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-900/90 rounded-full shadow-md text-slate-400 hover:text-rose-500 transition-colors ${isFav ? 'text-rose-500' : ''}">
                    <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}"></i>
                </button>
                <div class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                    <i data-lucide="camera" class="w-3 h-3"></i> ${(ad.photos && ad.photos.length) || 1}
                </div>
            </div>
            <div class="p-4 flex flex-col justify-between flex-1">
                <div>
                    <div class="flex items-center justify-between mb-1.5">
                        <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md">${ad.categoryName || 'Объявление'}</span>
                        <span class="text-xs text-slate-400">${formattedDate}</span>
                    </div>
                    <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2 leading-snug">
                        ${ad.title}
                    </h3>
                </div>
                <div class="pt-2 mt-auto border-t border-slate-100 dark:border-slate-800 flex items-end justify-between">
                    <div>
                        <div class="text-lg font-extrabold text-slate-900 dark:text-white">${formattedPrice}</div>
                        <div class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <i data-lucide="map-pin" class="w-3 h-3 text-indigo-500"></i> ${ad.city}
                        </div>
                    </div>
                    <button onclick="event.stopPropagation(); Ads.showQuickView('${ad.id}')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Быстрый просмотр">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>`;
    },

    /**
     * Переключение статуса "В избранное"
     * @param {string} adId
     */
    toggleFavorite(adId) {
        const user = Auth.getCurrentUser();
        if (!user) {
            App.showToast('Войдите в аккаунт, чтобы сохранять в избранное', 'warning');
            setTimeout(() => {
                window.location.href = 'auth.html';
            }, 1000);
            return;
        }

        const isAdded = DB.toggleFavorite(user.id, adId);
        App.showToast(isAdded ? 'Добавлено в избранное ❤️' : 'Удалено из избранного', isAdded ? 'success' : 'info');

        document.querySelectorAll(`[data-ad-id="${adId}"] .fav-btn i`).forEach(icon => {
            if (isAdded) {
                icon.classList.add('fill-rose-500', 'text-rose-500');
            } else {
                icon.classList.remove('fill-rose-500', 'text-rose-500');
            }
        });

        App.updateFavoritesCount();
    },

    /**
     * Быстрый модальный просмотр объявления
     * @param {string} adId
     */
    async showQuickView(adId) {
        const ad = await DB.getAdById(adId);
        if (!ad) return;

        const modalEl = document.getElementById('quick-view-modal');
        if (!modalEl) return;

        const photo = (ad.photos && ad.photos.length > 0) ? ad.photos[0] : 'images/placeholder.jpg';

        modalEl.innerHTML = `
        <div class="modal-content relative p-6">
            <button onclick="App.closeModal('quick-view-modal')" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div class="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 h-64">
                    <img src="${photo}" onerror="this.src='images/placeholder.jpg'" class="w-full h-full object-cover" alt="${ad.title}">
                </div>
                <div class="flex flex-col justify-between">
                    <div>
                        <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full">${ad.categoryName || 'Объявление'}</span>
                        <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-2">${ad.title}</h2>
                        <div class="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">${Masks.formatPrice(ad.price, ad.priceNegotiable)}</div>
                        <p class="text-sm text-slate-600 dark:text-slate-300 mt-3 line-clamp-4">${ad.description}</p>
                    </div>
                    <div class="mt-6 flex flex-col gap-2">
                        <a href="ad-details.html?id=${ad.id}" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-center text-sm shadow-md transition-all">Открыть страницу объявления</a>
                    </div>
                </div>
            </div>
        </div>`;

        App.openModal('quick-view-modal');
        if (window.lucide) lucide.createIcons();
    }
};
