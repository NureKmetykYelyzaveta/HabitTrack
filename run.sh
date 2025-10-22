#!/bin/bash
FRONT_PORT=5500
BACKEND_PORT=5000
BACKEND_PROJECT="HabitTrack/backend/HabitTrack/HabitTrack/HabitTrack.csproj"

cd frontend && python3 -m http.server $FRONT_PORT --bind 127.0.0.1 &
FRONT_PID=$!
cd ..

dotnet run --project "$BACKEND_PROJECT" --urls "http://localhost:$BACKEND_PORT"

kill $FRONT_PID 2>/dev/null