@echo off
set FRONT_PORT=5500
set BACKEND_PORT=5000
set BACKEND_PROJECT=backend\HabitTrack\HabitTrack\HabitTrack.csproj

echo Starting HabitTrack application...

REM Start frontend server
echo Starting frontend server on port %FRONT_PORT%...
cd frontend
start /B python -m http.server %FRONT_PORT% --bind 127.0.0.1
cd ..

REM Start backend server
echo Starting backend server on port %BACKEND_PORT%...
dotnet run --project "%BACKEND_PROJECT%" --urls "http://localhost:%BACKEND_PORT%"

echo Application stopped.
pause
