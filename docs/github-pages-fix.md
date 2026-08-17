# GitHub Pages — если 404 или configure-pages падает

Сайт: https://yehhialeksandra.github.io/portfolio/

## Причина ошибки

```
Get Pages site failed ... Not Found
```

GitHub **не видит включённый Pages** в репозитории. Так бывает после **private → public**: Pages отключается и его нужно включить заново. Workflow и `enablement: true` **не могут** включить Pages сами — для этого нужен клик владельца репозитория (или PAT с правами admin, что мы не используем).

Проверка без логина: `GET /repos/YehhiAleksandra/portfolio/pages` → **404** = Pages выключен.

## Одноразово в GitHub (обязательно)

1. Открыть: https://github.com/YehhiAleksandra/portfolio/settings/pages  
   (войти как **YehhiAleksandra**)
2. Если есть кнопка **Enable Pages** / **Re-enable** — нажать
3. **Build and deployment** → **Source** → **GitHub Actions** (не «Deploy from a branch»)
4. **Save**
5. **Actions** → **Deploy GitHub Pages** → **Run workflow**

После успеха на странице Settings → Pages появится URL сайта, а API перестанет отдавать 404.

## Альтернатива без Actions

Если Actions не нужны:

1. Settings → Pages → Source → **Deploy from a branch**
2. Branch: **main**, folder: **/ (root)**
3. Save

Тогда workflow можно не запускать — сайт собирается из ветки `main`. Файл `.nojekyll` в корне уже есть.

## Проверка

- Actions: зелёный deploy
- Settings → Pages: показывает URL
- https://yehhialeksandra.github.io/portfolio/ открывается (не 404)

## Прочее (не блокирует деплой)

- Предупреждение Node.js 20 в Actions — информационное, на деплой не влияет
- Hero/train картинки — заменить на фото Александры
- Форма заявки без backend — work DB fallback
