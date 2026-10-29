@echo off
echo =======================================================
echo          Starting ClubSphere Full Stack App
echo =======================================================
start "ClubSphere-Backend" cmd /c "%~dp0start-backend.bat"
timeout /t 5 /nobreak >nul
start "ClubSphere-Frontend" cmd /c "%~dp0start-frontend.bat"
echo.
echo Both servers have been launched in separate terminal windows!
echo - Frontend URL: http://localhost:5173
echo - Backend URL:  http://localhost:8080
echo - H2 Console:   http://localhost:8080/h2-console
echo.
pause

