# Інструкція з ініціалізації магазину

## Крок 1: Додати поле selected_avatar в базу даних

Виконайте SQL команду в базі даних:

```sql
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS selected_avatar text;
```

Або через psql:
```bash
/opt/homebrew/opt/postgresql@16/bin/psql -U postgres -d HabitTrackDb -c "ALTER TABLE \"User\" ADD COLUMN IF NOT EXISTS selected_avatar text;"
```

## Крок 2: Ініціалізувати костюми

Після запуску сервера виконайте HTTP запит:

```bash
curl -X POST http://localhost:5000/api/init/clothes
```

Або відкрийте в браузері:
```
http://localhost:5000/api/init/clothes
```

Це створить 14 костюмів (character-1.png до character-14.png) в базі даних.

## Крок 3: Перевірка

Перевірте, що костюми створені:
```bash
curl http://localhost:5000/api/shop/items?userId=1
```

## Примітки

- Костюми мають бути в папці `assets/videos/character/`
- Дефолтний аватар: `character-default.png`
- Костюми мають назви: `character-1.png`, `character-2.png`, ... `character-14.png`
- Ціни костюмів: від 150 до 800 монет (збільшуються на 50 за кожен номер)

