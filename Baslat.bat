@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Ilk kurulum yapiliyor, lutfen bekleyin...
  call npm install
)
call npm start
