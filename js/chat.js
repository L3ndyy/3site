/* ===================================================================
   СИСТЕМА ЧАТА И СООБЩЕНИЙ (BazarPro Messenger)
   =================================================================== */

const Chat = {
    /**
     * Открыть модальное окно чата по конкретному объявлению
     * @param {string} adId
     * @param {string} sellerId
     * @param {string} sellerName
     * @param {string} adTitle
     */
    openChat(adId, sellerId, sellerName, adTitle) {
        const user = Auth.getCurrentUser();
        if (!user) {
            App.showToast('Войдите в аккаунт, чтобы написать продавцу', 'warning');
            setTimeout(() => window.location.href = 'auth.html', 1000);
            return;
        }

        if (user.id === sellerId) {
            App.showToast('Это ваше собственное объявление', 'info');
            return;
        }

        let modalEl = document.getElementById('chat-modal');
        if (!modalEl) {
            modalEl = document.createElement('div');
            modalEl.id = 'chat-modal';
            modalEl.className = 'modal-overlay';
            document.body.appendChild(modalEl);
        }

        const messages = DB.getMessages(adId);

        modalEl.innerHTML = `
        <div class="modal-content p-0 max-w-lg overflow-hidden flex flex-col h-[520px]">
            <!-- Header -->
            <div class="p-4 bg-indigo-600 text-white flex items-center justify-between shadow-md">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                        ${sellerName ? sellerName[0].toUpperCase() : 'П'}
                    </div>
                    <div>
                        <div class="font-bold text-base leading-tight">${sellerName}</div>
                        <div class="text-xs text-indigo-100 line-clamp-1 opacity-90">${adTitle}</div>
                    </div>
                </div>
                <button onclick="App.closeModal('chat-modal')" class="p-1.5 hover:bg-white/10 rounded-lg text-white">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <!-- Message list -->
            <div id="chat-messages-container" class="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-900/50">
                ${messages.length === 0 ? `
                    <div class="text-center py-10 text-slate-400 text-sm">
                        <i data-lucide="message-square" class="w-10 h-10 mx-auto mb-2 opacity-50"></i>
                        Начните диалог с продавцом. Спросите о наличии товара или торге!
                    </div>
                ` : messages.map(m => `
                    <div class="flex ${m.senderId === user.id ? 'justify-end' : 'justify-start'}">
                        <div class="max-w-[75%] p-3 rounded-2xl text-sm ${m.senderId === user.id ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'} shadow-sm">
                            <p>${m.text}</p>
                            <span class="text-[10px] block text-right mt-1 opacity-70">${new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Input area -->
            <form id="chat-form" class="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2" onsubmit="Chat.handleSend(event, '${adId}', '${sellerId}', '${sellerName}')">
                <input type="text" id="chat-input" placeholder="Напишите сообщение..." class="input-field text-sm" autocomplete="off" required>
                <button type="submit" class="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shrink-0">
                    <i data-lucide="send" class="w-4 h-4"></i>
                </button>
            </form>
        </div>`;

        App.openModal('chat-modal');
        if (window.lucide) lucide.createIcons();

        // Scroll to bottom
        const container = document.getElementById('chat-messages-container');
        if (container) container.scrollTop = container.scrollHeight;
    },

    /**
     * Отправка сообщения
     */
    handleSend(e, adId, sellerId, sellerName) {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        if (!input || !input.value.trim()) return;

        const user = Auth.getCurrentUser();
        const text = input.value.trim();
        input.value = '';

        const newMsg = DB.sendMessage({
            adId,
            senderId: user.id,
            receiverId: sellerId,
            text
        });

        // Обновляем список сообщений
        const container = document.getElementById('chat-messages-container');
        if (container) {
            const emptyNotice = container.querySelector('.text-center');
            if (emptyNotice) emptyNotice.remove();

            const msgHtml = `
            <div class="flex justify-end animate-fade-in">
                <div class="max-w-[75%] p-3 rounded-2xl text-sm bg-indigo-600 text-white rounded-tr-none shadow-sm">
                    <p>${text}</p>
                    <span class="text-[10px] block text-right mt-1 opacity-70">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>`;
            container.insertAdjacentHTML('beforeend', msgHtml);
            container.scrollTop = container.scrollHeight;
        }

        // Автоответ продавца для демонстрации через 1.5 секунды
        setTimeout(() => {
            const replies = [
                'Здравствуйте! Да, объявление актуально. Можем встретиться сегодня.',
                'Добрый день! Товар в наличии, состояние как на фото. Готов сделать небольшую скидку.',
                'Приветствую! Могу отправить Авито Доставкой или СДЭКом при необходимости.'
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];

            DB.sendMessage({
                adId,
                senderId: sellerId,
                receiverId: user.id,
                text: randomReply
            });

            if (container && document.getElementById('chat-modal').classList.contains('active')) {
                const replyHtml = `
                <div class="flex justify-start animate-fade-in">
                    <div class="max-w-[75%] p-3 rounded-2xl text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm">
                        <p>${randomReply}</p>
                        <span class="text-[10px] block text-right mt-1 opacity-70">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>`;
                container.insertAdjacentHTML('beforeend', replyHtml);
                container.scrollTop = container.scrollHeight;
            } else {
                App.showToast(`Новое сообщение от ${sellerName}`, 'info');
            }
        }, 1200);
    }
};
