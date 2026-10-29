@echo off
title ClubSphere Spring Boot Backend
cd /d "%~dp0backend"
echo ===================================================
echo Starting ClubSphere Backend on http://localhost:8080 ...
echo ===================================================
mvn spring-boot:run
pause

