# HabitTrack Startup Script for Windows PowerShell
$FRONT_PORT = 5500
$BACKEND_PORT = 5000
$BACKEND_PROJECT = "backend\HabitTrack\HabitTrack\HabitTrack.csproj"

Write-Host "Starting HabitTrack application..." -ForegroundColor Green

# Start frontend server
Write-Host "Starting frontend server on port $FRONT_PORT..." -ForegroundColor Yellow
Set-Location frontend
$frontendJob = Start-Job -ScriptBlock { 
    Set-Location $using:PWD
    python -m http.server $using:FRONT_PORT --bind 127.0.0.1 
}
Set-Location ..

# Start backend server
Write-Host "Starting backend server on port $BACKEND_PORT..." -ForegroundColor Yellow
try {
    dotnet run --project "$BACKEND_PROJECT" --urls "http://localhost:$BACKEND_PORT"
}
finally {
    # Cleanup
    Write-Host "Stopping frontend server..." -ForegroundColor Red
    Stop-Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $frontendJob -ErrorAction SilentlyContinue
    Write-Host "Application stopped." -ForegroundColor Red
}
