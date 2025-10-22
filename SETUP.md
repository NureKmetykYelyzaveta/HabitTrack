# HabitTrack - Інструкція з встановлення та запуску

## Необхідні залежності

### 1. .NET 8.0 SDK
- Завантажте з [офіційного сайту Microsoft](https://dotnet.microsoft.com/download/dotnet/8.0)
- Встановіть .NET 8.0 SDK
- Перевірте встановлення: `dotnet --version`

### 2. PostgreSQL
- Завантажте з [офіційного сайту PostgreSQL](https://www.postgresql.org/download/windows/)
- Встановіть PostgreSQL
- Під час встановлення встановіть пароль `7761` для користувача `postgres`
- Створіть базу даних `HabitTrackDb`:
  ```sql
  CREATE DATABASE "HabitTrackDb";
  ```

### 3. Python 3
- Завантажте з [python.org](https://www.python.org/downloads/)
- Встановіть Python 3.x
- Перевірте встановлення: `python --version`

## Запуск проекту

### Варіант 1: Використання batch файлу (рекомендовано)
```cmd
run.bat
```

### Варіант 2: Використання PowerShell
```powershell
.\run.ps1
```

### Варіант 3: Ручний запуск

1. **Запуск backend:**
   ```cmd
   cd backend\HabitTrack\HabitTrack
   dotnet run --urls "http://localhost:5000"
   ```

2. **Запуск frontend (в новому терміналі):**
   ```cmd
   cd frontend
   python -m http.server 5500 --bind 127.0.0.1
   ```

## Доступ до додатку

- **Frontend:** http://localhost:5500
- **Backend API:** http://localhost:5000
- **Swagger UI:** http://localhost:5000/swagger

## Структура проекту

```
HabitTrack/
├── backend/                 # .NET Web API
│   └── HabitTrack/
│       ├── Controllers/     # API контролери
│       ├── Models/          # Моделі даних
│       ├── Data/            # Контекст бази даних
│       └── Services/        # Бізнес-логіка
├── frontend/                # HTML/CSS/JS фронтенд
│   ├── js/                  # JavaScript модулі
│   ├── style/               # CSS стилі
│   └── *.html               # HTML сторінки
└── assets/                  # Статичні ресурси
```

## Можливі проблеми

### Помилка підключення до бази даних
- Перевірте, чи запущений PostgreSQL
- Перевірте налаштування в `appsettings.json`
- Переконайтеся, що база даних `HabitTrackDb` існує

### Помилка CORS
- Backend налаштований для прийому запитів з будь-якого джерела
- Перевірте, чи frontend та backend запущені на правильних портах

### Порт зайнятий
- Змініть порти в скриптах запуску або зупиніть процеси, що використовують порти 5000/5500
