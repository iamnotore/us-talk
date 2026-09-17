@echo off
REM 本機一鍵發佈到 Cloudflare Pages 正式站（已登入即可，免 GitHub）
REM 此檔已隨網站搬遷至 02_英語教學\03_英語會話累積，直接發佈本目錄
cd /d "%~dp0"
npx -y wrangler@latest pages deploy . --project-name=us-talk --branch=master --commit-dirty=true
pause
