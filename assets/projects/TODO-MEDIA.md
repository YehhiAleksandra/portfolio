# Медиа для проектов — сделать позже

> **Не забыть:** GIF или короткое видео (10–30 сек) для кейсов на главной.

## Что нужно

| Файл | Назначение |
|------|------------|
| `stop-extremism.gif` или `.mp4` | StopExtremismBelarus — парсинг, worker, бот |
| `expense-bot.gif` | Expense Tracker — inline-меню, /setup |
| `alert-manager.gif` | telegram-alert-manager — дашборд/алерты |
| `work-db-demo.gif` | опционально — админка / витрина Work DB |

Промпты и стиль: см. `IMAGE_PROMPTS.md` в корне проекта.

## После появления файлов

1. Положить сюда: `assets/projects/`
2. Подключить в `index.html` в блоках `.case-study` (этап 2 в `ROADMAP.md`)
3. WebP/GIF + `loading="lazy"`

Сейчас этап **пропущен** — GIF/видео позже. В кейсах уже есть схема **Задача → Решение → Результат** (без медиа).

Когда появятся файлы, добавить в каждый `.case-study` блок:

```html
<picture class="case-media">
  <source srcset="./assets/projects/stop-extremism.webp" type="image/webp" />
  <img src="./assets/projects/stop-extremism.png" alt="" loading="lazy" decoding="async" />
</picture>
```

Имена: `stop-extremism`, `expense-bot`, `alert-manager` (см. `IMAGE_PROMPTS.md`).
