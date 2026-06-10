# GitHub profile как у tytopop

Цель: https://github.com/YehhiAleksandra выглядит как https://github.com/tytopop

## Шаг 1 — создать репозиторий (1 минута)

Открой (имя уже подставлено):

**https://github.com/new?name=YehhiAleksandra&description=Profile+README**

- Owner: **YehhiAleksandra**
- Repository name: **YehhiAleksandra** (точно как username!)
- Public
- **НЕ** ставь галочки Add README / .gitignore / license
- **Create repository**

## Шаг 2 — запушить README с сервера

```bash
cd /opt/yehhi-github-profile
git add README.md
git commit -m "Profile README like tytopop" 2>/dev/null || true
git push -u origin main
```

Или напиши агенту «пушни профиль» — он сам запушит.

## Шаг 3 — оформить профиль

**https://github.com/settings/profile** (под аккаунтом YehhiAleksandra):

| Поле | Значение |
|------|----------|
| Name | yehhi Aleksandra |
| Bio | Media automation · B2B content · MultiFerma |
| URL | https://yehhialeksandra.github.io/portfolio/ |
| Location | Minsk, Belarus |

## Шаг 4 — закрепить portfolio

На https://github.com/YehhiAleksandra → **Customize your pins** → выбрать **portfolio**

## Итого

| tytopop | YehhiAleksandra |
|---------|-----------------|
| github.com/tytopop/tytopop | github.com/YehhiAleksandra/YehhiAleksandra |
| Profile README | готов в /opt/yehhi-github-profile |
| Сайт | yehhialeksandra.github.io/portfolio ✅ |
