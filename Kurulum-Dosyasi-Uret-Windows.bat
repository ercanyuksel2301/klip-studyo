@echo off
cd /d "%~dp0"
echo Gerekli dosyalar kuruluyor...
call npm install
if errorlevel 1 goto hata
echo Kurulum dosyalari uretiliyor (birkac dakika surer)...
call npm run dist:win
if errorlevel 1 goto hata
echo.
echo BITTI. "dist" klasorunu aciyorum.
start "" "%~dp0dist"
pause
exit /b 0
:hata
echo HATA olustu, yukaridaki mesaji kontrol edin.
pause
