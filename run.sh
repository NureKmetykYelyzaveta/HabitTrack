#!/bin/bash
BACKEND_PORT=5000
BACKEND_PROJECT="backend/HabitTrack/HabitTrack/HabitTrack.csproj"

echo "🚀 Запуск HabitTrack..."
echo "📱 Фронтенд: http://localhost:5000"
echo "🔌 API: http://localhost:5000/api"

dotnet run --project "$BACKEND_PROJECT" --urls "http://localhost:$BACKEND_PORT"