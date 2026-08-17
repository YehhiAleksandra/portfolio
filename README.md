# yehhi — portfolio

Статический сайт-портфолио [Александры yehhi](https://github.com/YehhiAleksandra).

Скопирован layout из eggy-portfolio, адаптирован под медиа-автоматизацию и B2B-контент (MultiFerma).

## Локально

```bash
cd /opt/stack/repos/yehhi-portfolio
python3 -m http.server 8080
# http://localhost:8080
```

## GitHub Pages

Settings → Pages → Source: **GitHub Actions** (workflow в `.github/workflows/pages.yml`).

После push в `main`: https://yehhialeksandra.github.io/portfolio/

## Конфиг

`site-config.json` — URL сайта, email заявок, опционально `metrikaId` / `ga4Id`.
См. `docs/seo-analytics.md`.

## Контакты

- Email: yehhialeksandra@gmail.com
- GitHub: https://github.com/YehhiAleksandra
- Live: https://yehhialeksandra.github.io/portfolio/