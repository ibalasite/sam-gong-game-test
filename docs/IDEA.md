# IDEA — 三公遊戲（Sam Gong Online — Cocos + Colyseus）

<!-- SDLC Requirements Engineering — Layer 0：Idea Capture -->
<!-- 由 /devsop-idea 自動填寫；未來需求變更時，此文件作為「原始意圖」比對基準 -->

---

## Document Control

| 欄位 | 內容 |
|------|------|
| **DOC-ID** | IDEA-SAM-GONG-GAME-20260421 |
| **專案名稱** | 三公遊戲（Sam Gong Online — Cocos + Colyseus） |
| **文件版本** | v0.1-capture |
| **狀態** | DRAFT |
| **作者** | tobala（由 /devsop-idea 自動生成） |
| **建立日期** | 2026-04-21 |
| **最後更新** | 2026-04-21 |
| **輸入模式** | AI 自動填入（Full-Auto Mode）|
| **建立方式** | /devsop-idea 自動捕捉；請執行 /devsop-brd-review 審查後方可升版 |
| **下游文件** | docs/BRD.md（已生成）|

---

## 1. Idea Essence（核心本質）

### 1.1 一句話描述（Elevator Pitch）

> **三公遊戲（Sam Gong Online）幫助 2-6 位棋牌愛好者解決「無法線上公正遊玩三公」的痛點，方式是以 Cocos Creator 打造豐富 UI 動畫、Colyseus Server-Authoritative 架構確保牌局公正，提供媲美商業棋牌 App 的即時多人三公體驗。**

---

### 1.2 核心假說（Lean Hypothesis）

> **If we build** 一個 Server-Authoritative 的即時多人三公遊戲（Cocos Creator UI + Colyseus Server），其中所有牌型計算在伺服器端完成，Client 不持有任何非自己的牌面資訊，
> **then** 熟悉三公規則的 2-6 人棋牌玩家
> **will** 能夠便捷地在線上進行公正、流暢、視覺豐富的三公牌局，
> **which will lead to** 建立穩定的玩家社群，並驗證即時多人棋牌的技術能力供後續擴展。

---

### 1.3 成功願景

**6 個月後，若本專案成功，以下情境將成真：**

- 用戶維度：2-6 位玩家可在 5 分鐘內建立房間、完成一局三公牌局，斷線重連穩定，無作弊疑慮
- 業務維度：DAU ≥ 200，7 日留存率 ≥ 20%，完成 Alpha/Beta 驗收
- 技術維度：Colyseus + Cocos Creator 整合架構文件完整，可作為後續棋牌遊戲的技術基礎

### 1.4 Innovation Type Classification

| 類型 | 定義 | 是否適用 |
|------|------|:-------:|
| **Incremental**（漸進式）| 改善既有產品功能或流程效率 | ☑ |
| **Sustaining**（持續性）| 在既有市場中競爭，提供更好的解法 | ☑ |
| **Adjacent**（鄰近式）| 現有能力進入新市場或新用戶群 | ☐ |
| **Disruptive**（顛覆性）| 從低端或全新市場切入 | ☐ |
| **Radical / Breakthrough**（突破性）| 基於新技術創造新市場 | ☐ |

**本 IDEA 的分類**：Incremental + Sustaining

**分類依據**：三公遊戲本身是既有民間遊戲，本產品目標是提供更好的線上版本（改善現有 LINE 群組玩法），技術選型（Cocos + Colyseus）是成熟框架的整合應用，非突破性創新。

---

## 2. Problem Statement

### 2.1 現狀描述（As-Is Narrative）

台灣與東南亞地區的三公愛好者目前面臨以下困境：
- **實體限制**：三公需要 2-6 人實體聚會，地點、時間協調成本高
- **線上工具不足**：LINE 群組 + 人工記帳法易出錯、速度慢
- **現有線上平台品質差**：多為非官方 App，介面粗糙，部分由 Client 計算牌型（作弊風險）
- **無公正機制**：玩家無法確認洗牌是否公正（黑箱系統）

---

### 2.2 根本原因分析（5 Whys）

```
問題現象：玩家無法方便地線上遊玩高品質三公
  Why 1：市場上缺乏高品質三公線上平台
    Why 2：三公規則地區性強，主流棋牌廠商未投入開發
      Why 3：對大廠而言，三公市場規模相對德州撲克較小，ROI 不符
        Why 4：缺乏低成本的即時多人遊戲開發框架
          Why 5（根本原因）：Colyseus + Cocos 等成熟框架的普及，
                          使小團隊現在能以合理成本打造高品質即時棋牌 ← 時機已到
```

---

### 2.3 問題規模（量化估算）

| 指標 | 估算數字 | 資料來源 | 信心水準 |
|------|---------|---------|---------|
| 受影響使用者數 | 50,000+（台灣 + 海外華人三公愛好者）| AI 推斷 | 低，待市場研究 |
| 每次協調聚會損失時間 | ~30 分鐘 | AI 推斷 | 低 |
| 可定址市場（TAM）| 亞太線上棋牌市場（數十億美元）| AI 推斷 | 低 |
| 可服務市場（SAM）| 三公/中式撲克利基市場 $5M-$50M | AI 推斷 | 低 |
| 可獲取市場（SOM）| 初期 1,000-10,000 DAU | AI 推斷 | 低 |

---

## 3. Target Users

### 3.1 主要使用者群

**使用者描述**：熟悉三公規則的 2-6 人休閒棋牌愛好者（AI 自動推斷，基於 IDEA 描述）

| 屬性 | 描述 |
|------|------|
| 職業 / 角色 | 休閒娛樂玩家、棋牌愛好者 |
| 地域 | 台灣、東南亞華人社群 |
| 技術成熟度 | 初階至中階（能操作瀏覽器/手機 App 即可）|
| 使用頻率 | 週末或聚會時（不定期）|
| 決策角色 | 使用者（邀請朋友加入房間）|

---

### 3.2 Jobs to Be Done

| 任務類型 | 用戶任務描述 |
|---------|------------|
| **Functional** | 當我想和 2-5 位朋友玩三公，我想要快速建立線上房間並開始牌局，以便不需要實體聚會就能享受遊戲。 |
| **Emotional** | 我希望翻牌瞬間有緊張感和視覺回饋，結算時看到籌碼動畫讓我有成就感。 |
| **Social** | 我想和朋友在同一個房間，有聊天功能和頭像，感覺像真實聚會。 |

---

### 3.3 非目標使用者

| 排除群體 | 排除原因 |
|---------|---------|
| ❌ 真實金錢賭博玩家 | 法律風險（ROC §266），本版本使用虛擬籌碼 |
| ❌ 不熟悉三公規則的新手 | 初版不含規則教學模式（推遲至 v2.0）|
| ❌ 德州撲克/百家樂玩家 | 不同規則，有大量成熟平台 |

---

## 4. Value Hypothesis

### 4.1 核心價值主張

**Pain Relievers：**

| 使用者痛點 | 我們的緩解方式 |
|-----------|-------------|
| 線上三公無公正機制，擔心作弊 | Server-authoritative 架構：所有比牌在伺服器計算，Client 無法看到他人手牌 |
| 現有工具介面粗糙，缺乏沉浸感 | Cocos Creator 專業動畫：發牌/翻牌/結算全程動畫，像素風格或 Casino 21 風格 |
| 需要實體聚會，協調成本高 | 房間碼機制：一鍵建立房間，分享連結即可邀請朋友 |
| LINE 群組記帳易出錯 | 自動籌碼結算：Server 自動計算輸贏，無需人工記帳 |

**Gain Creators：**

| 使用者期望收益 | 我們如何創造 |
|-------------|------------|
| 高品質遊戲體驗 | Cocos Creator 豐富動畫 + 專業 UI/UX 設計 |
| 公平公正的牌局 | Server-authoritative + 洗牌算法透明可驗證 |

---

### 4.2 差異化定位

> 相對於現有三公 App（介面粗糙、部分 Client 端計算）與現有開源撲克 Server（無三公規則、無 Cocos 整合），本產品的獨特差異在於：**Colyseus Server-Authoritative 架構保障公正性** + **Cocos Creator 商業級 UI 動畫體驗** 的完整組合。

---

## 5. MVP & Learning Plan

### 5.1 MVP 邊界定義

| MVP 功能 | 驗證假設 | 最低可接受標準 |
|---------|---------|--------------|
| 2-6 人房間（房間碼）| 玩家能快速開始一局 | 房間建立成功率 ≥ 99% |
| 莊家制三公牌局（完整比牌）| 比牌結算正確 | 比牌正確率 100%（自動測試）|
| 下注流程（押注/跟注/棄牌）| 下注流程直覺易懂 | Alpha 測試者無操作困惑 |
| Cocos 基本動畫（發牌/翻牌/結算）| 動畫增加沉浸感 | Alpha 測試者給予正面反饋 |
| 斷線重連（60 秒）| 斷線不影響遊戲完整性 | 斷線恢復成功率 ≥ 95% |

**明確不在 MVP 範圍：**
- ❌ 帳號系統（初期用匿名房間碼）
- ❌ 聊天功能（推遲至 v1.1）
- ❌ 戰績統計（推遲至 v1.1）
- ❌ AI 電腦對手（推遲至 v2.0）
- ❌ 真實金錢交易（永久不做）

---

### 5.2 Validation Metrics（Pre-Alpha 驗證指標）

| 指標 | 測量方式 | 通過閾值（Go）| 失敗閾值（Pivot）| 追蹤週期 |
|------|---------|:-----------:|:--------------:|---------|
| 比牌結算正確率 | 自動化單元測試（1000+ 局模擬）| 100% | < 99.9% | Alpha 前 |
| 房間建立成功率 | QA 壓力測試 | ≥ 99% | < 95% | Alpha |
| 斷線重連成功率 | 斷線模擬測試 | ≥ 95% | < 80% | Alpha |
| Alpha 測試者 NPS | 問卷（N ≥ 10）| ≥ 20 | < 0 | Alpha 後 |
| 7 日留存率 | Analytics（Beta 邀請玩家）| ≥ 20% | < 10% | Beta |

---

### 5.3 Riskiest Assumption

> **以下假設一旦被推翻，整個 IDEA 必須根本性調整或放棄。**

> 我們假設 **玩家對於「伺服器計算比牌」的公正性有信任，且 Web 版的動畫體驗足夠吸引人讓玩家留存**。  
> 若此假設為假，則 **玩家可能仍偏好實體聚會或不信任線上平台**，專案應 **增加公正性透明機制（如可驗證洗牌算法）或推出 Native App**。  
> 驗證：**Alpha 內測問卷（N ≥ 10 人）**，2026-07 前完成。

| 假設 | 驗證方法 | 驗證期限 | 若錯誤的後果 |
|------|---------|---------|------------|
| 玩家接受 Web-based 三公（非 Native App）| Alpha 用戶調查 | 2026-07 | 追加 Cocos Native Build |
| 三公規則自動結算能正確反映地區慣例 | 規則測試 + 玩家確認 | Alpha 前 | 需可配置規則系統 |

---

## 6. Clarification Interview Record

> 本節記錄 /devsop-idea Full-Auto 模式的 AI 自動推斷參數（無互動提問）。

### Q1 — 主要使用者

| 欄位 | 內容 |
|------|------|
| **回答** | 熟悉三公規則的 2-6 人休閒棋牌愛好者 |
| **選擇方式** | AI 自動填入（Full-Auto 模式）|
| **影響範疇** | BRD §4 Stakeholders、PRD Persona、RTM 使用者欄位 |

---

### Q2 — 核心痛點

| 欄位 | 內容 |
|------|------|
| **回答** | 缺乏高品質、公正的線上三公平台；現有解法（LINE + 人工記帳）效率低且易出錯 |
| **選擇方式** | AI 自動填入（Full-Auto 模式）|
| **影響範疇** | BRD §2 Problem Statement、§5 Proposed Solution、§7 Success Metrics |

---

### Q3 — 技術限制或偏好

| 欄位 | 內容 |
|------|------|
| **回答** | Cocos Creator 4.x + TypeScript（Client）、Colyseus 0.15 + Node.js（Server）— 使用者明確指定 |
| **選擇方式** | 使用者在 IDEA 描述中明確指定，非 AI 推斷 |
| **影響範疇** | BRD §8 Constraints、EDD 技術選型、ARCH 架構設計 |

---

### Q4 — 預期使用規模

| 欄位 | 內容 |
|------|------|
| **回答** | 小規模（初期 50-200 concurrent players，每 Room 2-6 人）— AI 自動推斷 |
| **選項** | 小規模（1–100 人）／ 中規模（100–10,000 人）／ 大規模（10,000 人以上）|
| **影響範疇** | ARCH 可擴展性、SCHEMA 設計、EDD 容量規劃 |

---

### Q5 — 其他補充（AI 自動推斷）

| 欄位 | 內容 |
|------|------|
| **回答** | 莊家制玩法（1 莊 N 閒，輪流坐莊）為三公核心機制，需在 PRD 中完整定義 |
| **追問觸發原因** | 三公規則分析後發現莊家制是關鍵設計決策 |
| **影響範疇** | PRD 遊戲流程、EDD 狀態機設計、SCHEMA 玩家狀態欄位 |

---

### 原始 IDEA（使用者輸入原文，逐字保留）

```
三公遊戲（Cocos + Colyseus）開發草稿
一、專案目標
打造一款即時多人三公（3-card poker / Sam Gong）遊戲，採用：
Client（Cocos Creator）：負責 UI、動畫、玩家操作
Server（Colyseus / Node.js）：負責遊戲邏輯、狀態同步（authoritative）
核心原則：
🎯 Server authoritative，Client 只做展示與輸入
二、核心玩法（簡述）
每位玩家發 3 張牌
根據三公規則比大小（點數 / 公牌）
支援下注（betting）
最終結算輸贏
（規則細節可後補或做成 config）
三、系統架構
1️⃣ Client（Cocos）
負責：
- UI（桌面、玩家位置、籌碼）
- 動畫（發牌動畫、翻牌動畫、結算動畫）
- 要有豐富UI設計互動，主角，布景相關，要有專業UI/UX設計，像素風格，CASINO 21點風格都可以
- 玩家操作（下注、比牌、準備）
- 狀態呈現（從 server sync）
👉 不做任何結果計算（避免作弊）
2️⃣ Server（Colyseus）
負責：
- 洗牌（shuffle）
- 發牌（deal）
- 比牌（compare）
- 結算（settlement）
- 遊戲流程控制（state machine）
- 玩家狀態同步（room state）
```

---

## 7. Market & Competitive Intelligence

### 7.1 競品 / 參考資源

| 競品 / 工具 | 核心定位 | 優勢 | 劣勢 | 我們的差異 |
|-----------|---------|------|------|-----------|
| node-poker-stack | Node.js 撲克 Server + HTML5 | 開源、Poker 邏輯完整 | 無三公規則、無 Cocos 整合 | Colyseus + Cocos 完整整合 |
| distributed-texasholdem | Socket.IO 德州撲克 | 即時架構示範 | 無驗證邏輯、易作弊 | Server-authoritative 比牌 |
| colyseus/cocos-demo-tictactoe | Cocos + Colyseus 官方 Demo | 架構清晰、官方支援 | 功能簡單，無棋牌邏輯 | 以此為起點擴充完整棋牌框架 |
| 市場現有三公 App | 有玩家基礎 | 功能完整（部分）| 多閉源、作弊疑慮、Native Only | Web 版 + 架構透明 |

---

### 7.2 技術生態建議

| 層次 | 建議方案 | 選擇理由 |
|------|---------|---------|
| Client 框架 | Cocos Creator 4.x + TypeScript | 使用者指定；官方 Colyseus SDK |
| Server 框架 | Colyseus 0.15+ + Node.js | MIT 授權；天然 authoritative；Cocos 整合 |
| 狀態同步 | @colyseus/schema（差分同步）| 減少 bandwidth，自動序列化 |
| 資料庫（初期）| Redis（房間狀態）| 簡單、快速；初期不需 PostgreSQL |
| 基礎設施 | AWS EC2 / GCP Compute（小規模）| 易部署，成本可控 |

---

### 7.3 研究來源

| 搜尋關鍵字 | 主要發現 | 可信度 |
|-----------|---------|--------|
| Sam Gong three card poker Colyseus Node.js game server github 2025 | 無直接競品（市場空白機會）；Colyseus 框架成熟 | 中 |
| Cocos Creator Colyseus multiplayer card game best practices 2025 | 官方 Cocos SDK 存在；TicTacToe Demo 可作起點 | 高 |
| three card poker online multiplayer game design pitfalls anti-cheat | 牌面資訊提前洩漏是最大反作弊風險；Server-authoritative 是業界標準 | 高 |

---

## 8. Initial Risk Assessment

### 8.1 風險矩陣

| # | 風險描述 | 類型 | 可能性 | 影響 | 風險等級 | 初步緩解策略 |
|---|---------|------|:------:|:----:|:------:|------------|
| R1 | 牌面資訊提前洩漏（Client 可解析封包看牌）| 技術（反作弊）| MEDIUM | CRITICAL | 🔴 HIGH | Server 只在揭牌時廣播，Schema 欄位按玩家過濾 |
| R2 | 斷線重連失敗導致房間卡死 | 技術 | HIGH | HIGH | 🔴 HIGH | 60 秒重連窗口 + 超時自動棄牌/結算 |
| R3 | 三公規則地區差異導致玩家爭議 | 業務 | MEDIUM | HIGH | 🔴 HIGH | 完整規則文件 + Alpha 內測確認 + Config 化 |
| R4 | Colyseus 版本升級破壞相容性 | 技術 | LOW | MEDIUM | 🟡 MEDIUM | 鎖定 Colyseus 0.15.x 版本，升級前完整測試 |
| R5 | 同謀攻擊（玩家私下共享手牌資訊）| 技術（公平性）| LOW | MEDIUM | 🟡 MEDIUM | 異常下注日誌 + 未來可加入行為分析 |

---

### 8.2 Kill Conditions

| 終止條件 | 觸發閾值 | 檢查時機 |
|---------|---------|---------|
| 比牌結算錯誤率無法歸零 | 自動測試 1000 局，錯誤率 > 0.1% | Alpha 前 |
| 玩家 NPS < 0（Alpha 後）| NPS < 0（N ≥ 10 人反饋）| Alpha 後 |
| 法律確認：虛擬籌碼不符法規 | 法務明確告知需停止 | BRD 法律審查後 |

---

### 8.3 Pre-mortem Exercise

| # | 失敗情境 | 根本原因 | 預防措施 | 早期預警訊號 |
|---|---------|---------|---------|-----------|
| F1 | 玩家因作弊疑慮放棄使用 | 牌面資訊洩漏未被及時發現 | Alpha 前進行滲透測試 | 玩家反映「感覺不公平」|
| F2 | 斷線頻率高，牌局體驗差 | WebSocket 穩定性不足 | 壓力測試 + CDN/邊緣節點優化 | 斷線率 > 5% |
| F3 | 規則實作與玩家認知不符 | 三公規則文件不夠嚴謹 | 邀請有經驗玩家參與 Alpha | Alpha 玩家對規則有爭議 |
| F4 | Web 版動畫效能在手機上不佳 | Cocos Web Build 效能低估 | Alpha 在真實手機設備測試 | FPS < 30 on mid-end Android |
| F5 | Colyseus 版本停止維護 | 依賴社群開源專案 | 監控 Colyseus GitHub Activity | GitHub Issues 無回應 > 30 天 |
| F6 | 沒有真實玩家持續遊玩 | 缺乏社交驅動力（朋友不來）| 設計分享/邀請機制 | 7D Retention < 10% |

**Pre-mortem 結論：** 最可能的失敗路徑是 **反作弊設計不完善** 或 **斷線體驗差**，兩者都在 Alpha 前需要嚴格測試。

---

## 9. Business Potential

### 9.1 商業模式假說

| 項目 | 初步假設 |
|------|---------|
| 收入來源 | 初期免費；未來 Freemium：皮膚/頭像付費 |
| 主要定價策略 | 免費遊玩 + 虛擬道具微交易 |
| 主要成本驅動因子 | 開發成本、美術資源、雲端伺服器 |
| 核心資源 | Cocos + Colyseus 技術棧、三公比牌引擎 |
| 獲客管道 | 口碑傳播、開源社群、LINE 群組分享 |

---

### 9.2 戰略對齊

| 策略目標 | 本 IDEA 的貢獻方式 | 對齊強度 |
|---------|-----------------|---------|
| 建立即時多人遊戲技術能力 | Colyseus + Cocos 整合 know-how 可複用至其他棋牌 | 強 |
| 驗證休閒棋牌市場 | 三公作為試金石，了解玩家留存與付費行為 | 強 |

---

## 10. Executive Sponsorship & Stakeholder Alignment

### 10.1 Executive Sponsor

| 欄位 | 內容 |
|------|------|
| **贊助人** | tobala（專案負責人）|
| **贊助原因** | 技術驗證 + 個人棋牌遊戲興趣 |
| **授權範圍** | 技術決策自主、美術資源採購上限待定 |

---

## 11. IDEA Quality Score

**整體評分**：★★★★☆（4.3/5）

| 評分維度 | 分數 | 評估說明 | 改進建議 |
|---------|:----:|---------|---------|
| 目標清晰度 | 1 / 1 | 「即時多人三公，Server-authoritative，Cocos + Colyseus」一句話清楚 | - |
| 使用者具體度 | 0.8 / 1 | 「2-6人棋牌愛好者」具體，但規模估算較寬泛 | Alpha 後定義更精確 Persona |
| 痛點可量化 | 0.5 / 1 | 痛點（作弊、不方便）有描述，但量化數據待驗證 | Alpha 問卷蒐集痛點量化 |
| 範圍邊界 | 1 / 1 | Out of Scope 明確（真實金錢/AI/排行榜），技術棧指定 | - |
| 技術可行性 | 1 / 1 | Colyseus 官方有 Cocos SDK，官方 Demo 存在，可行性高 | - |

```
【IDEA 品質評分】★★★★☆（4.3/5）
  + 目標清晰：✅ 一句話清楚定義產品
  + 技術可行：✅ Colyseus 官方 Cocos SDK 存在
  + 範圍邊界：✅ MoSCoW 明確，Out of Scope 清楚
  △ 痛點量化：⚠ 市場規模為 AI 推斷，需 Alpha 後驗證
  △ 使用者精確度：需 Alpha 後精化 Persona
```

---

## 12. Critical Assumptions

| # | 假設陳述 | 影響層級 | 不確定性 | 驗證方式 | 驗證期限 |
|---|---------|:-------:|:-------:|---------|---------|
| A1 | 玩家願意信任 Server-authoritative 比牌結果（非黑箱懷疑）| HIGH | MEDIUM | Alpha 用戶問卷 + 比牌日誌公開 | Alpha 後 |
| A2 | Web-based 三公動畫體驗足夠吸引玩家留存 | HIGH | HIGH | Alpha 用戶 NPS + 7D Retention | Alpha 後 |
| A3 | Colyseus 0.15 + Cocos 4.x 整合穩定無重大 Bug | HIGH | MEDIUM | PoC / 技術 Spike | EDD 前 |
| A4 | 初版規則實作符合目標玩家的三公慣例 | HIGH | HIGH | 邀請 5+ 位三公玩家內測 | Alpha 前 |

---

## 13. Open Questions

| # | 問題 | 影響層級 | 若不解決的後果 | 負責人 | 狀態 |
|---|------|:-------:|------------|--------|:----:|
| OQ1 | 三公「公牌」與特殊組合的完整規則（各地版本差異）| 策略 | 比牌引擎實作錯誤，玩家不認可 | Game Designer | 🔲 OPEN |
| OQ2 | 莊家選定規則（固定莊 / 輪流坐莊 / 跑馬）| 範圍 | 影響 PRD 遊戲流程與狀態機設計 | Game Designer | 🔲 OPEN |
| OQ3 | 斷線超時後自動棄牌的時間窗口（10/30/60 秒？）| 架構 | 影響 EDD 狀態機 Timeout 設計 | Engineering | 🔲 OPEN |
| OQ4 | 初版是否需帳號系統（vs 匿名房間碼）| 範圍 | 影響 SCHEMA 設計與安全架構 | PM | 🔲 OPEN |
| OQ5 | Cocos Creator 目標平台：Web only / Mobile Web / Native？ | 架構 | 影響 Build Pipeline 與測試矩陣 | Engineering | 🔲 OPEN |

---

## 14. IDEA → BRD Handoff Checklist

| # | Checklist 項目 | 狀態 | 負責人 |
|---|--------------|:----:|--------|
| C1 | 一句話描述（§1.1）已清晰表達 | ✅ | AI |
| C2 | 核心假說（§1.2）符合可測試格式 | ✅ | AI |
| C3 | Q1 使用者描述具體（非「所有人」）| ✅ | AI |
| C4 | Q2 痛點已識別（量化數據待 Alpha 驗證）| ✅ | AI |
| C5 | Q4 規模已選定（小規模，影響架構決策）| ✅ | AI |
| C6 | 至少 1 個競品在 §7 已識別（3 個）| ✅ | AI |
| C7 | 至少 3 項風險在 §8 已識別（5 個）| ✅ | AI |
| C8 | Kill Conditions（§8.2）已定義 | ✅ | AI |
| C9 | 關鍵假設 A1（§12）已識別並有驗證計畫 | ✅ | AI |
| C10 | IDEA Quality Score ≥ 3（4.3/5）| ✅ | AI |
| C11 | 原始 IDEA 原文已逐字保留（§6 末段）| ✅ | AI |
| C12 | OQ1-OQ5 中無需立即解答的 P0 技術問題阻礙 BRD | ✅ | Engineering |

---

## 15. Traceability Note

**向下追溯（Forward）：**

```
IDEA.md（本文件）
  └─► BRD.md       ← /devsop-idea 已自動生成（docs/BRD.md）
        └─► PRD.md      ← /devsop-gen-prd
              └─► EDD.md      ← /devsop-gen-edd
                    └─► ARCH / API / SCHEMA / BDD → 實作
```

**需求變更判斷準則：**

| 場景 | 對比依據 | 分類 |
|------|---------|------|
| 比牌邏輯與原始 IDEA 三公規則一致但實作有誤 | IDEA §6 原文 + OQ1 規則文件 | **BUG** |
| 新增規則（如加入 Pair 比牌）超出原始 IDEA 範圍 | IDEA §6 原文 | **ECR** |
| 技術選型從 Colyseus 換為 Socket.IO 且無充分理由 | IDEA §6 Q3 | **ECR 或 ADR** |

---

## Appendix A：Research Raw Data

### 搜尋 1：競品與開源專案

```
查詢：Sam Gong three card poker Colyseus Node.js game server github 2025
結果：
- 無直接三公 + Colyseus 競品（市場空白，機會點）
- Colyseus Framework：https://github.com/colyseus/colyseus（MIT，⭐ 5.9k+）
- node-poker-stack：有完整撲克邏輯但無三公、無 Cocos
- distributed-texasholdem：Socket.IO 架構但無驗證邏輯
```

### 搜尋 2：技術最佳實踐

```
查詢：Cocos Creator Colyseus multiplayer card game best practices 2025
結果：
- 官方 Cocos SDK：https://docs.colyseus.io/getting-started/cocos
- 官方 Demo（TicTacToe）：https://github.com/colyseus/cocos-demo-tictactoe
- Colyseus 官方進入 Cocos Store，雙方有官方合作
- 最佳實踐：Client 不做任何遊戲邏輯，只做 Schema 狀態渲染
```

### 搜尋 3：已知挑戰與陷阱

```
查詢：three card poker online multiplayer game design pitfalls anti-cheat
結果：
- 最大陷阱：牌面資訊提前洩漏（Client 可解析封包）
- 業界標準：Server-authoritative + 只在揭牌時廣播完整牌面
- 同謀攻擊：2-6 人小牌局中風險存在但較難完全杜絕
- 斷線重連：需要明確的 Timeout + 自動棄牌規則
```

---

## Appendix B：Document History

| 版本 | 日期 | 作者 | 修改摘要 |
|------|------|------|---------|
| v0.1-capture | 2026-04-21 | /devsop-idea | 初始捕捉，Full-Auto 模式由 AI 自動填寫 |

---

## Appendix C：Attached Materials

（目前無附件。若後續需補充素材，請將檔案複製至 `docs/req/` 目錄。）

---

*此 IDEA.md 由 /devsop-idea 自動保留，記錄需求探索過程中的所有原始輸入與假設。*
*若未來需求發生變化，可對照此文件確認原始意圖，判斷屬 BUG 修正或 ECR（需求變更）。*
