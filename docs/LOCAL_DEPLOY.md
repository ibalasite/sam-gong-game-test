# 本機部署手冊 — 三公線上遊戲

## 前置需求

| 工具 | 版本 | 說明 |
|------|------|------|
| Node.js | 20.x | 伺服器執行環境 |
| npm | 10.x | 套件管理 |
| Docker | 24.x+ | 容器化部署 |
| docker-compose | v2.x | 本機多服務編排 |

安裝確認：

```bash
node --version   # v20.x.x
npm --version    # 10.x.x
docker --version # Docker version 24.x.x
docker compose version # Docker Compose version v2.x.x
```

---

## 方式一：直接執行（最快速）

```bash
# 1. 進入 server 目錄
cd server

# 2. 安裝依賴
npm install

# 3. 建置 TypeScript
npm run build

# 4. 啟動伺服器
npm start
```

伺服器啟動後監聽：`ws://localhost:2567`

開發模式（熱重載）：

```bash
npm run dev
```

---

## 方式二：Docker Compose（推薦）

```bash
# 1. 複製環境變數範本
cp .env.example .env
# 依需求編輯 .env

# 2. 建置並啟動所有服務
docker compose up --build

# 或背景執行
docker compose up --build -d

# 查看日誌
docker compose logs -f sam-gong-server
```

伺服器啟動後可存取：`ws://localhost:2567`

---

## 環境變數說明

在專案根目錄建立 `.env` 檔案（參考 `.env.example`）：

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `NODE_ENV` | `development` | 執行環境 |
| `PORT` | `2567` | WebSocket 監聽埠 |
| `SQLITE_DB_PATH` | `./sam-gong.db` | SQLite 資料庫路徑 |
| `MAX_ROOMS` | `100` | 最大房間數 |
| `DATABASE_URL` | _(空)_ | PostgreSQL 連線字串（生產環境用） |
| `POSTGRES_USER` | `samgong` | PostgreSQL 使用者名稱 |
| `POSTGRES_PASSWORD` | `samgong_dev` | PostgreSQL 密碼 |
| `POSTGRES_DB` | `samgong` | PostgreSQL 資料庫名稱 |

`.env.example` 範本：

```env
NODE_ENV=development
PORT=2567
SQLITE_DB_PATH=./sam-gong.db
MAX_ROOMS=100

# PostgreSQL（本機 docker-compose 測試用）
POSTGRES_USER=samgong
POSTGRES_PASSWORD=samgong_dev
POSTGRES_DB=samgong
# DATABASE_URL=postgresql://samgong:samgong_dev@localhost:5432/samgong
```

---

## 連接 Cocos Creator 用戶端

在 Cocos Creator 專案中設定 WebSocket 伺服器 URL：

1. 開啟 `client/assets/scripts/NetworkManager.ts`（或對應設定檔）
2. 將伺服器 URL 設為：
   - 本機直接執行：`ws://localhost:2567`
   - Docker Compose：`ws://localhost:2567`
3. 在 Cocos Creator Editor 中按 **Play** 或 Build 後開啟 index.html

Colyseus 用戶端連線範例：

```typescript
import Colyseus from "colyseus.js";

const client = new Colyseus.Client("ws://localhost:2567");
const room = await client.joinOrCreate("sam_gong_room");
```

---

## 健康檢查

伺服器提供 `/health` 端點：

```bash
curl http://localhost:2567/health
# 預期回應: { "status": "ok" }
```

---

## 執行測試

### 單元測試（不需要任何外部服務）

```bash
cd server
npm run test:unit
# 或
npm test -- tests/unit
```

### 覆蓋率報告

```bash
npm run test:coverage
```

目標：分支/函式/行數覆蓋率均 ≥ 80%

### 對本機伺服器執行整合測試

需要先啟動伺服器（方式一或方式二），再執行：

```bash
# 從專案根目錄
npm test -- tests/integration
```

---

## 常見問題

### 埠口被佔用

```bash
# 查詢佔用 2567 的程序
lsof -i :2567

# 終止程序
kill -9 <PID>
```

### Docker 建置失敗

```bash
# 清除快取重建
docker compose build --no-cache sam-gong-server
```

### SQLite 權限錯誤

確認 `SQLITE_DB_PATH` 指定的目錄存在且可寫入：

```bash
mkdir -p $(dirname $SQLITE_DB_PATH)
```

---

## K8s 本機測試（使用 minikube）

```bash
# 建置並載入映像到 minikube
eval $(minikube docker-env)
docker build -t sam-gong-server:latest ./server

# 套用所有 K8s 資源
kubectl apply -f k8s/

# 查看 Pod 狀態
kubectl -n sam-gong get pods

# 轉發埠口到本機
kubectl -n sam-gong port-forward svc/sam-gong-server 2567:2567
```
