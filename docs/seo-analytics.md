# Analytics & SEO (site-config)

Файл `site-config.json` в корне репозитория (без секретов).

## Метрика / GA4

1. Создай счётчик [Яндекс.Метрика](https://metrika.yandex.ru/) и/или GA4.
2. Пропиши ID в `site-config.json`:

```json
{
  "metrikaId": "12345678",
  "ga4Id": "G-XXXXXXXX"
}
```

3. Закоммить и запушь — `site.js` подхватит сам.

## Цели (уже шлёт форма)

- `lead_submit_attempt` — клик «Отправить»
- `lead_submit` — успешная отправка через FormSubmit
- `lead_submit_mailto_fallback` — запасной mailto

В Метрике создай цели типа JavaScript-событие с этими именами.

## Форма заявок

На GitHub Pages бэкенда нет. Форма идёт через [FormSubmit](https://formsubmit.co/) на `leadsEmail`.

**Важно:** при первой заявке FormSubmit пришлёт письмо-подтверждение на `yehhialeksandra@gmail.com` — подтверди ссылку. Дальше заявки будут приходить сразу. Если FormSubmit недоступен — откроется mailto.

## SEO foundation

- `robots.txt` + `sitemap.xml`
- canonical / OG / Twitter / favicon multi-size + webmanifest
- Title + Description RU/EN через `i18n.js`
