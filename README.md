# 台南週末校園臨時停車即時定位導航

專為手機瀏覽設計的台南週末/例假日開放校園臨時停車場即時定位工具。  
開啟網頁即可透過手機 GPS 自動計算距離，即時判斷並推薦距離您最近的停車學校，並提供一鍵導航功能。

---

## 🌟 特色功能

- **即時手機 GPS 定位**：自動取得當前經緯度，毫秒級計算各校直線距離與開車預估時間。
- **最近停車場推薦**：頂部卡片即時顯示最近的學校，支援一鍵開啟 Google 地圖或 Apple 地圖語音導航。
- **100% 免費無額外費用**：採用開源 Leaflet + OpenStreetMap 圖資與瀏覽器原生定位，無需任何付費 Map API Key 或信用卡。
- **完整收錄 7 大行政區 21 所開放學校**：中西區、東區、北區、南區、安平區、永康區、新化區。
- **清單 / 互動地圖雙模式**：可自由切換卡片清單或互動式地圖，查看自身定位藍點與各校標記。
- **多維度篩選**：支援行政區快速切換、免費/收費切換、今日是否開放、關鍵字模糊搜尋。
- **貼心出發地模擬**：在室內或非台南地區時，可一鍵切換出發地（孔廟、赤崁樓、國華街、火車站、花園夜市等）進行測試。

---

## 🚀 本地開發運行

```bash
# 1. 安裝相依套件
npm install

# 2. 啟動開發伺服器
npm run dev

# 3. 建置生產環境版本
npm run build
```

---

## 📦 如何部署到 GitHub Pages（完全免費）

本專案已內建自動化 GitHub Actions 腳本（`.github/workflows/deploy.yml`）與相對路徑配置（`base: './'`），Push 到 GitHub 後即可自動發布！

### 部署步驟：
1. 將專案 Push 到您的 GitHub 儲存庫（Repository）：
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for tainan weekend school parking app"
   git branch -M main
   git remote add origin https://github.com/<您的帳號>/<您的專案名稱>.git
   git push -u origin main
   ```
2. 在 GitHub 該專案頁面點擊 **Settings** -> 左側選單選擇 **Pages**。
3. 在 **Build and deployment** 下方的 **Source**，切換為 **GitHub Actions**。
4. 稍等約 1 分鐘，GitHub Actions 完成建置後，即可在 Pages 頁面看到專屬網址（例如：`https://<您的帳號>.github.io/<專案名稱>/`）！

> 💡 **溫馨提醒（HTTPS 與手機定位）**：
> 現代手機瀏覽器（iOS Safari、Android Chrome 等）基於安全隱私考量，規定**必須在 HTTPS 安全連線下**才允許讀取 GPS 定位。
> GitHub Pages、Vercel、Netlify 預設皆會免費提供 HTTPS 憑證，手機開啟時即可正常啟用即時定位！
