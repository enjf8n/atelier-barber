# ATELIER BARBER — премиум-лендинг барбершопа

Одностраничный сайт барбершопа в тёмной премиум-эстетике (уголь / латунь / кровавый
акцент). Ванильный HTML + CSS + JS, анимации на GSAP, смузи-скролл Lenis, форма записи
с подключением к Telegram-боту в 2 строки конфига.

🌐 **Live demo:** _добавь сюда ссылку на GitHub Pages_

---

## Что внутри

- **Hero** с двумя CTA: «Записаться» и прямой tel:
- **Прайс услуг** с фиксированными ценами (классические dotted leaders)
- **Карточки мастеров** с grayscale→color hover
- **Галерея** в масонри-сетке с hover-зумом
- **Слайдер отзывов** с автопрокруткой и переключением по dots
- **Форма записи** → отправка в Telegram-бот
- **Карта** (Яндекс) + контакты
- **Sticky call-button** на мобилке

## Стек

- HTML5, CSS3 (Grid, Flexbox, `clamp()`-типографика, `prefers-reduced-motion`)
- Vanilla ES6+ (без сборщика)
- [GSAP](https://gsap.com/) + ScrollTrigger — scroll reveals
- [Lenis](https://lenis.darkroom.engineering/) — инерционный скролл
- Google Fonts: Playfair Display, Inter, JetBrains Mono
- SEO: Schema.org `HairSalon` JSON-LD + Open Graph

Всё по CDN — репо чисто статический, GitHub Pages / Netlify / любой хостинг без бэкенда.

## Быстрый старт

```bash
git clone <repo-url>
cd atelier-barber
python3 -m http.server 8765
# открыть http://localhost:8765/
```

или с Node:
```bash
npx serve .
```

## Подключение Telegram-бота для заявок

Форма записи умеет отправлять лиды **напрямую в Telegram** — владелец получает
сообщение мгновенно, без бэкенда. Настраивается за минуту:

### 1. Создать бота

В Telegram написать **[@BotFather](https://t.me/BotFather)** → `/newbot` →
придумать имя → получить токен вида `123456:AAEabc...`

### 2. Узнать свой chat_id

Написать боту **[@userinfobot](https://t.me/userinfobot)** команду `/start` — он
ответит твоим ID (например `123456789`).

### 3. Вписать в `assets/js/main.js`

```js
const CONFIG = {
  TELEGRAM_BOT_TOKEN: "123456:AAEabc...",   // ← твой токен
  TELEGRAM_CHAT_ID:   "123456789",          // ← твой chat_id
  FALLBACK_ENDPOINT:  "",
};
```

Готово. Отправь тестовую заявку с сайта — в Telegram придёт:

```
🪒 Новая запись в ATELIER BARBER

👤 Имя: Иван Иванов
📞 Телефон: +7 (999) 123‑45‑67
✂️ Услуга: Мужская стрижка
💈 Мастер: Артём
📅 Дата: 2026-05-01 14:00
```

### Альтернатива без Telegram

Если нужна отправка на свой эндпоинт (Formspree, n8n, Google Apps Script, собственный
бекенд) — впиши `FALLBACK_ENDPOINT` вместо токена бота. Форма отправит JSON POST.

### Если оставить пустым

В демо-режиме форма имитирует успех (без сети) — удобно для портфолио без риска
засветить чужие токены.

> ⚠️ **Про безопасность:** токен в публичном репо виден всем. Для реального продакшена
> лучше поставить свою промежуточную функцию (Cloudflare Worker / Vercel Function),
> которая принимает заявку и пересылает в Telegram уже с серверным токеном. Для MVP и
> лендинга «запись в барбершоп» прямой вызов из фронта — приемлемо, лимит —
> 30 сообщений/секунду на бота.

## Что кастомизировать под конкретного клиента

| Где                                  | Что менять                                    |
| ------------------------------------ | --------------------------------------------- |
| `index.html` — `<title>`, `<meta>`  | Название, описание, OG                        |
| `index.html` — JSON-LD `HairSalon`  | Адрес, телефон, часы работы                   |
| `index.html` — hero / услуги         | Тексты и цены                                  |
| `index.html` — мастера                | Имена, опыт, сигнатурные услуги               |
| `index.html` — фото мастеров/галереи | Заменить Unsplash URL на свои                  |
| `index.html` — карта                 | Поменять `ll=37.6173,55.7558` на свои координаты |
| `index.html` — контакты              | Адрес, tel:, мессенджеры, соцсети             |
| `assets/css/main.css` — `:root`      | Палитра (`--brass`, `--bg`) и шрифты         |

## Доступность и производительность

- `prefers-reduced-motion`: отключает Lenis, GSAP-ревилы, автопрокрутку отзывов, grain
- `aria-expanded` / `aria-controls` на бургере; активная ссылка подсвечивается по скроллу
- Формы с нативной валидацией, `aria-live` статус-строкой
- Все картинки с `loading="lazy"` и фиксированным aspect-ratio (нет layout shift)
- Fonts via `preconnect` + `display=swap`
- Целевой Lighthouse: Performance 90+ / A11y 95+

## Структура

```
atelier-barber/
├── README.md
├── index.html
└── assets/
    ├── css/main.css
    └── js/main.js
```

## Лицензия

MIT. Используй как шаблон для реальных проектов.
