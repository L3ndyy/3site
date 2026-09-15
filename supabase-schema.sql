-- ===================================================================
-- SQL СХЕМА ДЛЯ SUPABASE: ДОСКА ОБЪЯВЛЕНИЙ "БАЗАРПРО" (ВАРИАНТ 10)
-- Выполните этот скрипт в Supabase -> SQL Editor -> New Query -> Run
-- ===================================================================

-- Включаем расширение для UUID если требуется
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ТАБЛИЦА ПРОФИЛЕЙ ПОЛЬЗОВАТЕЛЕЙ
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    rating NUMERIC(2,1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ТАБЛИЦА КАТЕГОРИЙ
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ТАБЛИЦА ОБЪЯВЛЕНИЙ
CREATE TABLE IF NOT EXISTS public.ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id INT REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    price_negotiable BOOLEAN DEFAULT FALSE,
    condition TEXT CHECK (condition IN ('new', 'excellent', 'good', 'parts')),
    city TEXT NOT NULL,
    address TEXT,
    photos TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'rejected', 'closed')),
    views_count INT DEFAULT 0,
    is_vip BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ТАБЛИЦА ИЗБРАННОГО
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, ad_id)
);

-- 5. ТАБЛИЦА СООБЩЕНИЙ (ЧАТ МЕЖДУ ПОКУПАТЕЛЕМ И ПРОДАВЦОМ)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ТАБЛИЦА ЛОГИРОВАНИЯ ДЕЙСТВИЙ (Критерий «5+» баллов)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT DEFAULT '127.0.0.1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- НАЧАЛЬНЫЕ ДАННЫЕ (SEED DATA)
-- ===================================================================

-- Категории
INSERT INTO public.categories (name, slug, icon, description) VALUES
('Электроника', 'electronics', 'smartphone', 'Телефоны, ноутбуки, аудио, телевизоры и гаджеты'),
('Транспорт', 'transport', 'car', 'Легковые автомобили, мотоциклы, запчасти и шины'),
('Недвижимость', 'real-estate', 'home', 'Квартиры, дома, аренда, участки и коммерческая недвижимость'),
('Услуги', 'services', 'briefcase', 'Ремонт, обучение, перевозки, клининг и IT-услуги'),
('Одежда и обувь', 'fashion', 'shirt', 'Мужская, женская, детская одежда, аксессуары'),
('Для дома и дачи', 'home-garden', 'armchair', 'Мебель, декор, растения, бытовая техника, посуда'),
('Хобби и спорт', 'sports-hobby', 'bike', 'Велосипеды, тренажеры, музыкальные инструменты, книги'),
('Работа', 'jobs', 'users', 'Вакансии, поиск сотрудников, подработка, резюме')
ON CONFLICT (slug) DO NOTHING;

-- Профили (Администратор и демо-продавцы)
INSERT INTO public.profiles (id, email, full_name, phone, role, rating, reviews_count, avatar_url) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@bazarpro.ru', 'Главный Администратор', '+7 (999) 000-01-01', 'admin', 5.0, 42, 'images/avatar_admin.jpg'),
('a0000000-0000-0000-0000-000000000002', 'seller.alex@gmail.com', 'Александр Смирнов', '+7 (916) 123-45-67', 'user', 4.9, 18, 'images/avatar_alex.jpg'),
('a0000000-0000-0000-0000-000000000003', 'elena.stylist@mail.ru', 'Елена Васильева', '+7 (925) 765-43-21', 'user', 5.0, 29, 'images/avatar_elena.jpg')
ON CONFLICT (email) DO NOTHING;

-- Демо-объявления
INSERT INTO public.ads (id, user_id, category_id, title, description, price, price_negotiable, condition, city, address, photos, status, views_count, is_vip) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 1, 'Apple iPhone 15 Pro Max 256GB Natural Titanium', 'В идеальном состоянии, без сколов и царапин. Использовался бережно в чехле и с защитным стеклом. Полный комплект: коробка, оригинальный провод. Батарея 98%. Любые проверки на месте при встрече.', 109990.00, true, 'excellent', 'Москва', 'ул. Тверская, 12', ARRAY['images/iphone.jpg', 'images/iphone_back.jpg'], 'active', 342, true),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 2, 'BMW 3-Series (G20) 320d xDrive 2021', 'Официальный автомобиль, пробег 42 000 км. Полный привод xDrive, М-пакет, лазерные фары, цифровая приборная панель Live Cockpit, спортивные сиденья с памятью. Один владелец, обслуживание только у официального дилера.', 3650000.00, false, 'excellent', 'Санкт-Петербург', 'Невский проспект, 140', ARRAY['images/bmw.jpg', 'images/bmw_interior.jpg'], 'active', 890, true),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 3, 'Светлая евро-двушка 54 м² с дизайнерским ремонтом', 'Продаётся просторная квартира с панорамными окнами и видом на парк. Встроенная техника Bosch, теплые полы, кондиционер, гардеробная комната. Закрытая охраняемая территория, подземный паркинг.', 14800000.00, false, 'new', 'Москва', 'Ленинградский проспект, 36', ARRAY['images/apartment.jpg', 'images/apartment_kitchen.jpg'], 'active', 1250, true),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 1, 'Sony PlayStation 5 Digital Edition + 2 геймпада', 'Игровая приставка в отличном состоянии, ревизия 1200 (тихая). В комплекте 2 оригинальных DualSense и док-станция для зарядки. Не шумит, не греется.', 46900.00, true, 'excellent', 'Казань', 'ул. Баумана, 25', ARRAY['images/ps5.jpg', 'images/ps5_gamepad.jpg'], 'active', 415, false),
('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', 6, 'Диван угловой модульный Scandinavian Grey', 'Большой удобный диван с водоотталкивающей тканью велюр. Механизм трансформации еврокнижка, вместительный бельевой ящик. Состояние идеальное, без пятен.', 38000.00, true, 'good', 'Екатеринбург', 'ул. Ленина, 50', ARRAY['images/sofa.jpg'], 'active', 188, false),
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 7, 'Горный велосипед Trek Marlin 7 (29 колёса)', 'Размер рамы L (рост 177-188 см). Гидравлические дисковые тормоза Shimano, трансмиссия 1x10 Deore, воздушная вилка RockShox с блокировкой. Полностью обслужен к сезону.', 58000.00, false, 'excellent', 'Новосибирск', 'Красный проспект, 82', ARRAY['images/bike.jpg'], 'active', 260, false)
ON CONFLICT (id) DO NOTHING;

-- Логирование начальных действий
INSERT INTO public.activity_logs (user_email, action, details) VALUES
('admin@bazarpro.ru', 'SYSTEM_INIT', 'Инициализация базы данных и запуск платформы БазарПро'),
('seller.alex@gmail.com', 'AD_CREATE', 'Создано VIP объявление Apple iPhone 15 Pro Max'),
('seller.alex@gmail.com', 'AD_CREATE', 'Создано VIP объявление BMW 3-Series (G20)');

-- ===================================================================
-- НАСТРОЙКА ПРАВ ДОСТУПА (Row Level Security)
-- ===================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public categories read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public ads read" ON public.ads FOR SELECT USING (true);
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public logs read for admin" ON public.activity_logs FOR SELECT USING (true);

CREATE POLICY "Anon ads insert" ON public.ads FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon ads update" ON public.ads FOR UPDATE USING (true);
CREATE POLICY "Anon ads delete" ON public.ads FOR DELETE USING (true);

CREATE POLICY "Anon profiles insert" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon profiles update" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Anon favorites all" ON public.favorites FOR ALL USING (true);
CREATE POLICY "Anon messages all" ON public.messages FOR ALL USING (true);
CREATE POLICY "Anon logs insert" ON public.activity_logs FOR INSERT WITH CHECK (true);
