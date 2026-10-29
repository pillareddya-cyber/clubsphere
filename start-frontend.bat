@echo off
title ClubSphere React Frontend
cd /d "%~dp0frontend"
echo ===================================================
echo Starting ClubSphere Frontend on http://localhost:5173 ...
echo ===================================================
call npm.cmd run dev
pause

