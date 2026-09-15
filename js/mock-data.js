/* ===================================================================
   НАЧАЛЬНЫЕ ДАННЫЕ (MOCK DATA) ДЛЯ ДОСКИ ОБЪЯВЛЕНИЙ
   =================================================================== */

const INITIAL_CATEGORIES = [
    { id: 1, name: 'Электроника', slug: 'electronics', icon: 'smartphone', count: 48, description: 'Смартфоны, ноутбуки, ТВ, аудиотехника' },
    { id: 2, name: 'Транспорт', slug: 'transport', icon: 'car', count: 32, description: 'Автомобили, мотоциклы, запчасти' },
    { id: 3, name: 'Недвижимость', slug: 'real-estate', icon: 'home', count: 24, description: 'Квартиры, дома, аренда и продажа' },
    { id: 4, name: 'Услуги', slug: 'services', icon: 'briefcase', count: 56, description: 'Ремонт, обучение, перевозки, IT' },
    { id: 5, name: 'Одежда и обувь', slug: 'fashion', icon: 'shirt', count: 41, description: 'Мужская и женская одежда, обувь' },
    { id: 6, name: 'Для дома и дачи', slug: 'home-garden', icon: 'armchair', count: 29, description: 'Мебель, декор, бытовая техника' },
    { id: 7, name: 'Хобби и спорт', slug: 'sports-hobby', icon: 'bike', count: 19, description: 'Велосипеды, тренажеры, музыка' },
    { id: 8, name: 'Работа', slug: 'jobs', icon: 'users', count: 15, description: 'Вакансии и резюме' }
];

const INITIAL_USERS = [
    {
        id: 'u_admin_01',
        email: 'admin@bazarpro.ru',
        passwordHash: 'admin123',
        fullName: 'Главный Администратор',
        phone: '+7 (999) 000-01-01',
        role: 'admin',
        rating: 5.0,
        reviewsCount: 48,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        city: 'Москва',
        createdAt: '2024-01-10T10:00:00.000Z'
    },
    {
        id: 'u_alex_02',
        email: 'seller.alex@gmail.com',
        passwordHash: 'user123',
        fullName: 'Александр Смирнов',
        phone: '+7 (916) 123-45-67',
        role: 'user',
        rating: 4.9,
        reviewsCount: 22,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        city: 'Москва',
        createdAt: '2024-02-15T12:30:00.000Z'
    },
    {
        id: 'u_elena_03',
        email: 'elena.stylist@mail.ru',
        passwordHash: 'user123',
        fullName: 'Елена Васильева',
        phone: '+7 (925) 765-43-21',
        role: 'user',
        rating: 5.0,
        reviewsCount: 31,
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        city: 'Санкт-Петербург',
        createdAt: '2024-03-01T09:15:00.000Z'
    }
];

const INITIAL_ADS = [
    {
        id: 'ad_001',
        userId: 'u_alex_02',
        userName: 'Александр Смирнов',
        userPhone: '+7 (916) 123-45-67',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        userRating: 4.9,
        categoryId: 1,
        categoryName: 'Электроника',
        title: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
        description: 'Смартфон в идеальном состоянии, с первого дня в защитном стекле Remax и оригинальном чехле. Батарея 98%, емкость держит отлично. В комплекте: родная коробка, провод Type-C, чек. Без сколов, ремонтов и царапин. Любые проверки приветствуются!',
        price: 109990,
        priceNegotiable: true,
        condition: 'excellent',
        conditionName: 'Отличное',
        city: 'Москва',
        address: 'ул. Тверская, 12 (м. Охотный Ряд)',
        photos: [
            'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1695048065057-de12479e0066?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80'
        ],
        status: 'active',
        viewsCount: 428,
        isVip: true,
        createdAt: '2026-09-14T11:20:00.000Z'
    },
    {
        id: 'ad_002',
        userId: 'u_alex_02',
        userName: 'Александр Смирнов',
        userPhone: '+7 (916) 123-45-67',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        userRating: 4.9,
        categoryId: 2,
        categoryName: 'Транспорт',
        title: 'BMW 3-Series 320d xDrive M-Sport 2021',
        description: 'Дилерский автомобиль, пробег 42 500 км. Полный привод, заводской М-пакет, спортивная подвеска, лазерная оптика BMW Laser, цифровая панель Live Cockpit Professional, проекция на лобовое стекло, аудиосистема Harman/Kardon. 1 владелец по ПТС, без ДТП.',
        price: 3650000,
        priceNegotiable: false,
        condition: 'excellent',
        conditionName: 'Идеальное',
        city: 'Санкт-Петербург',
        address: 'Невский проспект, 140',
        photos: [
            'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80'
        ],
        status: 'active',
        viewsCount: 1120,
        isVip: true,
        createdAt: '2026-09-13T16:45:00.000Z'
    },
    {
        id: 'ad_003',
        userId: 'u_elena_03',
        userName: 'Елена Васильева',
        userPhone: '+7 (925) 765-43-21',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        userRating: 5.0,
        categoryId: 3,
        categoryName: 'Недвижимость',
        title: 'Дизайнерская евро-двушка 54 м² в ЖК бизнес-класса',
        description: 'Просторная светлая квартира с панорамным остеклением и высокими потолками 3.1м. Выполнен качественный ремонт по дизайн-проекту. Вся техника Bosch и Samsung, сантехника Villeroy&Boch. Закрытый двор без машин, круглосуточная охрана, подземный паркинг.',
        price: 14800000,
        priceNegotiable: false,
        condition: 'new',
        conditionName: 'Новое',
        city: 'Москва',
        address: 'Ленинградский проспект, 36 (м. Динамо)',
        photos: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80'
        ],
        status: 'active',
        viewsCount: 1540,
        isVip: true,
        createdAt: '2026-09-12T14:10:00.000Z'
    },
    {
        id: 'ad_004',
        userId: 'u_alex_02',
        userName: 'Александр Смирнов',
        userPhone: '+7 (916) 123-45-67',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        userRating: 4.9,
        categoryId: 1,
        categoryName: 'Электроника',
        title: 'Игровая консоль Sony PlayStation 5 + 2 геймпада',
        description: 'Консоль последней ревизии 1200 с улучшенным охлаждением. В комплекте два геймпада DualSense (белый и черный) и зарядная станция. Работает тихо, не греется, не вскрывалась, пломбы на месте. Игры в подарок на аккаунте.',
        price: 46900,
        priceNegotiable: true,
        condition: 'excellent',
        conditionName: 'Отличное',
        city: 'Казань',
        address: 'ул. Баумана, 25',
        photos: [
            'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80'
        ],
        status: 'active',
        viewsCount: 512,
        isVip: false,
        createdAt: '2026-09-14T09:30:00.000Z'
    },
    {
        id: 'ad_005',
        userId: 'u_elena_03',
        userName: 'Елена Васильева',
        userPhone: '+7 (925) 765-43-21',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        userRating: 5.0,
        categoryId: 6,
        categoryName: 'Для дома и дачи',
        title: 'Угловой велюровый диван Scandinavian Grey',
        description: 'Стильный модульный диван в скандинавском стиле. Ткань износостойкий антикоготь велюр, цвет серый графит. Раскладывается в полноценное двуспальное спальное место 160х200 см. Вместительный короб для белья.',
        price: 38000,
        priceNegotiable: true,
        condition: 'good',
        conditionName: 'Хорошее',
        city: 'Екатеринбург',
        address: 'ул. Ленина, 50',
        photos: [
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80'
        ],
        status: 'active',
        viewsCount: 230,
        isVip: false,
        createdAt: '2026-09-11T18:20:00.000Z'
    },
    {
        id: 'ad_006',
        userId: 'u_alex_02',
        userName: 'Александр Смирнов',
        userPhone: '+7 (916) 123-45-67',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        userRating: 4.9,
        categoryId: 7,
        categoryName: 'Хобби и спорт',
        title: 'Горный велосипед Trek Marlin 7 29" (Рама L)',
        description: 'Отличный найнер для города и трейлов. Навесное оборудование Shimano Deore 1x10, гидравлические тормоза Shimano MT200, вилка RockShox Judy Silver с блокировкой. Своевременное ТО в веломастерской.',
        price: 58000,
        priceNegotiable: false,
        condition: 'excellent',
        conditionName: 'Отличное',
        city: 'Новосибирск',
        address: 'Красный проспект, 82',
        photos: [
            'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1000&q=80'
        ],
        status: 'active',
        viewsCount: 310,
        isVip: false,
        createdAt: '2026-09-10T15:00:00.000Z'
    },
    {
        id: 'ad_007',
        userId: 'u_elena_03',
        userName: 'Елена Васильева',
        userPhone: '+7 (925) 765-43-21',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        userRating: 5.0,
        categoryId: 4,
        categoryName: 'Услуги',
        title: 'Создание современных сайтов и веб-сервисов под ключ',
        description: 'Разработка адаптивных сайтов, интернет-магазинов, лендингов и личных кабинетов. Чистый код, SEO-оптимизация, подключение баз данных (Supabase/PostgreSQL) и деплой на Vercel/хостинг. Опыт работы более 6 лет.',
        price: 25000,
        priceNegotiable: true,
        condition: 'new',
        conditionName: 'Услуга',
        city: 'Москва',
        address: 'Удаленно / Офис',
        photos: [
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1000&q=80'
        ],
        status: 'active',
        viewsCount: 780,
        isVip: true,
        createdAt: '2026-09-14T08:00:00.000Z'
    },
    {
        id: 'ad_008',
        userId: 'u_alex_02',
        userName: 'Александр Смирнов',
        userPhone: '+7 (916) 123-45-67',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        userRating: 4.9,
        categoryId: 5,
        categoryName: 'Одежда и обувь',
        title: 'Кожаная куртка-косуха AllSaints (Оригинал)',
        description: 'Культовая косуха из мягкой натуральной овечьей кожи. Размер M (48). Фурнитура металлическая матовая, подкладка целая. Одевалась несколько раз, состояние новой вещи.',
        price: 19500,
        priceNegotiable: true,
        condition: 'excellent',
        conditionName: 'Отличное',
        city: 'Москва',
        address: 'Кутузовский проспект, 18',
        photos: [
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=1000&q=80'
        ],
        status: 'active',
        viewsCount: 195,
        isVip: false,
        createdAt: '2026-09-09T13:40:00.000Z'
    }
];

const INITIAL_LOGS = [
    { id: 'log_1', userEmail: 'admin@bazarpro.ru', action: 'SYSTEM_BOOT', details: 'Запуск веб-платформы БазарПро и проверка соединений', timestamp: '2026-09-15T08:00:00.000Z' },
    { id: 'log_2', userEmail: 'admin@bazarpro.ru', action: 'DATABASE_MIGRATION', details: 'Синхронизация таблиц и проверка RLS политик', timestamp: '2026-09-15T08:05:00.000Z' },
    { id: 'log_3', userEmail: 'seller.alex@gmail.com', action: 'AUTH_LOGIN', details: 'Успешный вход пользователя', timestamp: '2026-09-15T09:12:00.000Z' },
    { id: 'log_4', userEmail: 'seller.alex@gmail.com', action: 'AD_PUBLISH', details: 'Опубликовано объявление iPhone 15 Pro Max', timestamp: '2026-09-15T11:20:00.000Z' }
];
