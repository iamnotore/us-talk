# US Talk・美加日常會話發佈包

位置：`02_英語教學\03_英語會話累積`（2026-09 由 `site-us-talk` 搬遷至此）

GitHub 連動 Cloudflare Pages 自動發佈用。push 到 `master` 即自動發佈。

## 目錄

- `index.html` — 互動練習頁（首頁，含訪客計數顯示）
- `slides.html` — 簡報投影版（含訪客計數顯示）
- `slides.pdf` — 簡報 PDF
- `functions/api/visits.js` — 訪客計數 API（Pages Functions + KV）
- `audio/` — 真人發音檔

## 自動發佈（已設定）

`.github/workflows/deploy-cloudflare-pages.yml`：每次 push 到 master 就執行
`wrangler pages deploy 02_英語教學/03_英語會話累積 --project-name=us-talk`。

需要先在 GitHub repo 設定 2 個 Secrets（只做一次）：

1. `CLOUDFLARE_API_TOKEN` — Cloudflare 後台 → My Profile → API Tokens → Create Token → 用 `Edit Cloudflare Workers` 範本（Pages 需要 Account + Workers/Pages 權限）
2. `CLOUDFLARE_ACCOUNT_ID` — Cloudflare 後台右下角 Account ID

## 手動發佈（備用）

第一次或想立刻發佈（在本目錄執行）：

```
npx -y wrangler@latest login
npx -y wrangler@latest pages deploy . --project-name=us-talk
```

Windows 直接點兩下 `deploy.bat` 也可以。

## 內容原則（2026-09 修訂）

每組 3 問同義、3 答同義，9 種組合（A-D～C-F）都要通順。情境從日常生活出發，另有「🏫 課室英語加油站」補充庫。

## 待錄真人音檔（25 個）

改版後的新句子先用裝置發音代替（網站會自動 fallback，不影響練習）。錄好後放進 `audio/`，檔名如下即自動升級為真人發音：

- T3-D2：`t3d2-a3.mp3`
- T4-D2：`t4d2-q3.mp3`
- T6-D2：`t6d2-q1/q2/q3.mp3`、`t6d2-a1/a2/a3.mp3`
- T7-D2：`t7d2-q2/q3.mp3`、`t7d2-a2/a3.mp3`
- T8-D2：`t8d2-q2/q3.mp3`、`t8d2-a2/a3.mp3`（Q1/A1 已把舊 q2/a2 改名沿用，免重錄）
- T9-D1：`t9d1-a3.mp3`
- T9-D2：`t9d2-q2/q3.mp3`、`t9d2-a2/a3.mp3`
- T10-D1：`t10d1-q3.mp3`
- T10-D2：`t10d2-q1/q3.mp3`、`t10d2-a1.mp3`（Q2/A2/A3 沿用舊檔，免重錄）

換下來的舊音檔備份在 `audio/retired/`。`slides.pdf` 改版後需重匯：開 `slides.html` 按「列印/PDF」另存即可。

## 訪客計數功能（Cloudflare KV + Pages Functions）

前台顯示「總訪客 + 今日」，同一瀏覽器一天只 +1（localStorage 日期去重）。

只做一次設定：

1. 建立 KV：
   ```
   npx -y wrangler@latest kv namespace create VISITS_KV
   ```
2. Cloudflare 後台 → Workers & Pages → `us-talk` → Settings → Functions → KV namespace bindings → Add：
   - Variable name：`VISITS_KV`
   - KV namespace：選上一步建立的 `VISITS_KV`
3. 重新發佈一次（點 `deploy.bat` 或 push），前台頁尾即顯示數字。
   - API：`GET /api/visits?inc=1`（今日首次）／`GET /api/visits`（不累加）
   - 未綁定 KV 前會回 `501 KV_NOT_BOUND`，前台自動改用本機備援計數（不影響瀏覽）。
