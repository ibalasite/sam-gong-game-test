# IDEA — 三公遊戲（Sam Gong 3-Card Poker）即時多人線上平台

<!-- SDLC Requirements Engineering — Layer 0：Idea Capture -->
<!-- 由 /devsop-idea 自動填寫；未來需求變更時，此文件作為「原始意圖」比對基準 -->

---

## Document Control

| 欄位 | 內容 |
|------|------|
| **DOC-ID** | IDEA-SAM-GONG-GAME-20260421 |
| **專案名稱** | 三公遊戲（Sam Gong 3-Card Poker）即時多人線上平台 |
| **文件版本** | v0.1-capture |
| **狀態** | DRAFT |
| **作者** | Evans Tseng（由 /devsop-idea 自動生成） |
| **建立日期** | 2026-04-21 |
| **最後更新** | 2026-04-21 |
| **輸入模式** | AI 自動填入（使用者於 Step -0.5 選擇） |
| **建立方式** | /devsop-idea 自動捕捉；請執行 /devsop-brd-review 審查後方可升版 |
| **下游文件** | docs/BRD.md（由本文件產生） |

---

## 1. Idea Essence（核心本質）

### 1.1 一句話描述（Elevator Pitch）

> **三公 Online 幫助華人休閒撲克玩家解決「擔心既有三公 App 作弊/不公平」的痛點，方式是以 Server-authoritative 架構（Cocos Creator Client + Colyseus Server）打造一款跨平台即時多人三公遊戲。**

### 1.2 核心假說（Lean Hypothesis）

> **If we build** 一款 Server-authoritative、伺服器完全掌控洗牌/發牌/比牌/結算的即時多人三公遊戲，搭配像素/賭場風格專業 UI,  
> **then** 華人 25-55 歲休閒撲克玩家  
> **will** 選擇本產品作為主要三公娛樂平台並願意購買虛擬籌碼,  
> **which will lead to** Peak CCU ≥ 500、付費率 ≥ 3%、並建立可複製至其他撲克品類的 authoritative server 基礎能力.

### 1.3 成功願景（Success Vision）

**12 個月後，若本專案成功，以下情境將成真：**

- 用戶維度：華人三公玩家社群口碑推薦「最公平的三公 App」，7 日留存 ≥ 35%，公平性 NPS ≥ 70。
- 業務維度：DAU ≥ 2,000、Peak CCU ≥ 500、ARPPU ≥ USD 10，年收益達 NT$ 800 萬以上。
- 技術維度：Cocos + Colyseus 技術棧沉澱為公司 multiplayer 基礎能力，可於 3 個月內複製至其他撲克品類（大老二、21 點）。

### 1.4 Innovation Type Classification（創新類型分類）

| 類型 | 定義 | 是否適用 |
|------|------|:-------:|
| **Incremental**（漸進式） | 改善既有產品功能或流程效率 | ☐ |
| **Sustaining**（持續性） | 在既有市場中競爭，提供更好的解法 | ☑ |
| **Adjacent**（鄰近式） | 現有能力進入新市場或新用戶群 | ☐ |
| **Disruptive**（顛覆性） | 從低端或全新市場切入，重塑現有市場 | ☐ |
| **Radical / Breakthrough**（突破性） | 基於新技術或商業模式，創造新市場 | ☐ |

**本 IDEA 的分類**：**Sustaining（持續性創新）**

**分類依據**：既有華人三公 App 市場已存在，但品質良莠不齊。本產品在相同市場中以「Server-authoritative 公平性 + 專業美術 + 跨平台」差異化競爭，屬於「更好的解法」而非創造新市場。資源投入策略走「快速 ROI + 精準行銷」路徑。

---

## 2. Problem Statement（問題陳述）

### 2.1 現狀描述（As-Is Narrative）

華人玩家（35-55 歲為主力）熱愛傳統三公遊戲，目前仰賴三條路徑滿足需求：（1）線下實體聚會，受空間時間限制；（2）Google Play / App Store 上數十款既有三公 App，但多為 Client-side 計算、美術粗糙、公平性不透明；（3）通訊軟體自建群組配合線下籌碼，門檻高且易生糾紛。玩家對「可信、即時、跨平台、美術精緻」的三公多人遊戲有強烈未被滿足需求。

### 2.2 根本原因分析（5 Whys）

```
問題現象：玩家擔心既有三公 App 作弊或發牌不公平
  Why 1：既有 App 多為 Client-side 計算或 P2P 架構
    Why 2：開發團隊多為小團隊/個人，缺乏後端 authoritative server 能力
      Why 3：authoritative server 需要專業後端框架與持續維運成本
        Why 4：過去幾年 authoritative 多人框架（如 Colyseus）成熟度不足且學習曲線陡
          Why 5（根本原因）：缺乏「易用、成熟、支援 Cocos Creator」的 authoritative server 生態，使小團隊無法負擔此類產品開發
```

### 2.3 問題規模（量化估算）

| 指標 | 估算數字 | 資料來源 | 信心水準 |
|------|---------|---------|---------|
| 受影響使用者數（全球華人三公潛在玩家） | 500 萬+ | AI 推斷 | 低 |
| 每人每週娛樂時間（可轉移至本產品） | 3-5 小時 | AI 推斷 | 低 |
| 每人每年願付娛樂費用 | USD 20-50 | AI 推斷 | 低 |
| 可定址市場規模（TAM） | USD 8 億/年（華人休閒博弈類全球） | AI 推斷 | 低 |
| 可服務市場規模（SAM） | USD 1 億/年（繁中市場）| AI 推斷 | 低 |
| 可獲取市場規模（SOM） | USD 500 萬-1,000 萬/年 | AI 推斷 | 低 |

---

## 3. Target Users（目標使用者）

### 3.1 主要使用者群（Q1 澄清結果）

**使用者描述**：華人休閒撲克遊戲玩家（主群 35-55 歲；次群 25-34 歲上班族；海外華人社群）

| 屬性 | 描述 |
|------|------|
| 職業 / 角色 | 主群：中生代專業工作者、自營業者、退休族；次群：上班族 |
| 行業 / 情境 | 碎片時間娛樂、社交聚會線上替代、懷舊紙牌遊戲愛好 |
| 技術成熟度 | 中階：使用 LINE / Facebook / 手遊 App 無障礙 |
| 使用頻率 | 每週 3-5 次，每次 20-60 分鐘 |
| 決策角色 | 使用者即決策者（C2C 消費產品） |

### 3.2 Jobs to Be Done（用戶核心任務）

| 任務類型 | 用戶任務描述 |
|---------|------------|
| **Functional** | 當我想玩三公放鬆時，我想要快速配對真人對手、公平對戰，以便獲得娛樂與勝負滿足感 |
| **Emotional** | 贏牌的刺激感、懷舊感、無作弊疑慮的安心感 |
| **Social** | 與朋友組桌炫耀手氣、在群組中建立「牌技好手」聲望、融入華人文化社群 |

### 3.3 非目標使用者（Not Our Users）

| 排除群體 | 排除原因 |
|---------|---------|
| ❌ 未成年玩家（18 歲以下） | 法規要求、道德考量，必須年齡驗證閘門 |
| ❌ 尋求真實金錢賭博的玩家 | 本產品僅虛擬籌碼，不可兌換現金 |
| ❌ 非華人市場國際用戶 | 首版聚焦繁中；英/簡中待 v2 |
| ❌ 硬核撲克職業玩家 | 三公為休閒品類，非職業競技 |

---

## 4. Value Hypothesis（價值假說）

### 4.1 核心價值主張（Value Proposition Canvas）

**Pain Relievers（痛點緩解）：**

| 使用者痛點 | 我們的緩解方式 |
|-----------|-------------|
| 擔心既有 App 作弊 / 發牌不公平 | Server-authoritative 架構，所有計算在伺服器；可公開洗牌審計 |
| 美術粗糙、體驗廉價 | 專業像素/賭場風格 UI + 完整發牌/翻牌/結算動畫 |
| 跨裝置不連通（手機/網頁）| Cocos Creator 跨平台，帳號跨端同步 |
| 缺乏真人對戰 | Colyseus Matchmaking + 即時 Room State 同步 |

**Gain Creators（增益創造）：**

| 使用者期望收益 | 我們如何創造 |
|-------------|------------|
| 進度感、成就感 | 虛擬籌碼等級（青銅→鑽石）、每日任務、排行榜 |
| 社交連結 | 好友系統、房間內聊天、組桌邀請 |
| 免費即可入門 | 遊客登入、每日贈送基礎籌碼 |
| 勝負刺激 | 即時結算動畫、籌碼累積視覺化 |

### 4.2 差異化定位

> 相對既有三公 App（Client-side 計算、美術粗糙、P2P 連線）與國際撲克品牌（德撲為主、非華人原生），本產品的獨特差異是**華人市場首款 Server-authoritative 的三公專業級多人遊戲**，以公平性為核心賣點，搭配華人市場原生玩法與本土化美術風格。

---

## 5. MVP & Learning Plan（最小可行驗證計畫）

### 5.1 MVP 邊界定義

| MVP 功能 | 驗證假設 | 最低可接受標準 |
|---------|---------|--------------|
| 三公核心玩法 + Server authoritative 計算 | 玩家認可「公平性」差異化價值 | Beta 封測公平性 NPS ≥ 4/5 |
| 大廳 + 快速配對 | Matchmaking 可吸引足夠同時在線 | 平均配對時間 ≤ 30 秒 |
| 虛擬籌碼系統 + 每日贈送 | 籌碼經濟足以支撐持續遊玩 | 7 日留存 ≥ 25% |
| 像素 or 賭場風 UI（擇一完整）| 美術質感可接受 | 封測主觀評分 ≥ 4/5 |
| 帳號系統（遊客 / 社群登入）| 註冊門檻不阻礙轉換 | 註冊完成率 ≥ 80% |

**明確不在 MVP 範圍（Non-MVP）：**
- ❌ 虛擬籌碼 IAP 購買（推遲至 Launch + 3M，優先驗證留存）
- ❌ VIP 訂閱（推遲至 Launch + 6M）
- ❌ 多語系（首版僅繁中）
- ❌ 其他撲克品類（v2 規劃）
- ❌ 觀戰模式（v1.1 視用戶需求評估）

### 5.2 Validation Metrics（驗證指標，Pre-BRD 階段）

| 指標 | 測量方式 | 通過閾值（Go）| 失敗閾值（Kill/Pivot）| 追蹤週期 |
|------|---------|:-----------:|:------------------:|---------|
| 法務風險可控 | 律師意見書 | 明確建議虛擬籌碼不可兌換模式合法 | 明確指出無可行合規路徑 | BRD 核准前 |
| 技術 PoC 可行性 | Cocos + Colyseus 原型 | 2 週內完成 1 桌 4 人對戰 | 2 週未能跑通 | Discovery Week 3 |
| 使用者訪談確認痛點 | 華人玩家訪談 N ≥ 10 | ≥ 70% 表達「公平性」為選擇因素 | < 40% | BRD 審查前 |
| 付費意願調查 | 問卷 / 訪談 | ≥ 30% 表達願意付費買籌碼 | < 15% | Beta 前 |
| 封測留存 | Analytics | 7 日留存 ≥ 25% | < 10% | Beta 週 4 |

**驗證計畫時程：**

```
Week 1-2：法律意見書 + 技術 PoC 啟動
Week 2-3：使用者訪談（N ≥ 10）+ 付費意願調查
Week 3：Go/Kill/Pivot 決策
Week 4+：進入 PRD / EDD 階段
```

### 5.3 Riskiest Assumption（最高風險假設，Leap of Faith）

> **以下假設一旦被推翻，整個 IDEA 必須根本性調整或放棄。**

> 我們假設 **以「虛擬籌碼不可兌換娛樂產品」形式運營的三公遊戲在台灣法律框架下可合法上架並持續運營**。  
> 若此假設為假，則 **整個商業模式不成立**，專案應 **停止或根本性調整（如改為純休閒益智遊戲去除籌碼元素）**。  
> 我們將透過 **正式法律意見書 + 向平台（Google/Apple）預審** 在 **BRD 核准前 4 週** 驗證此假設。

| 假設 | 驗證方法 | 驗證期限 | 若錯誤的後果 |
|------|---------|---------|------------|
| 虛擬籌碼模式在台灣合法 | 律師意見書 + 平台預審 | BRD 前 4 週 | 商業模式重建或專案停止 |
| Cocos Creator 3.x + Colyseus SDK 整合無重大阻塞 | 2 週 PoC | Discovery Week 3 | 換技術棧（延期 4-8 週）|
| 華人玩家確實重視公平性 > 方便性 | 訪談 N ≥ 10 | BRD 前 | 差異化失效，需重新定位 |

---

## 6. Clarification Interview Record（澄清訪談記錄）

> 本節記錄 /devsop-idea Step 2 的完整結果。本次採「AI 自動填入」模式，未執行互動式提問；以下所有欄位為 AI 根據使用者草稿原文推斷。

### Q1 — 主要使用者

| 欄位 | 內容 |
|------|------|
| **回答** | 華人休閒撲克玩家（主群 35-55 歲中生代，次群 25-34 歲上班族，海外華人社群） |
| **選擇方式** | AI 自動填入（使用者草稿未明示，AI 依「三公」為華人傳統撲克玩法推斷） |
| **影響範疇** | BRD §4 Stakeholders、PDD Persona、RTM 使用者欄位 |

### Q2 — 核心痛點

| 欄位 | 內容 |
|------|------|
| **回答** | 既有三公 App 多為 Client-side 計算或 P2P 連線，存在作弊疑慮；美術粗糙、公平性不透明；無跨平台即時多人專業體驗 |
| **選擇方式** | AI 自動填入（從使用者草稿「Server authoritative，Client 只做展示與輸入」反推痛點） |
| **影響範疇** | BRD §2 Problem Statement、§5 Proposed Solution、§7 Success Metrics |

### Q3 — 技術限制或偏好

| 欄位 | 內容 |
|------|------|
| **回答** | **使用者明確指定**：Client 必須為 Cocos Creator；Server 必須為 Colyseus（Node.js）；架構必須 Server-authoritative |
| **選擇方式** | 使用者草稿明示（非 AI 推斷） |
| **影響範疇** | BRD §8 Constraints、EDD 技術選型、ARCH 架構設計 |

### Q4 — 預期使用規模

| 欄位 | 內容 |
|------|------|
| **回答** | 中規模：100-10,000 人同時使用（目標 Peak CCU ≥ 500） |
| **選項** | 小規模（1-100）/ **中規模（100-10,000）** / 大規模（10,000+） |
| **影響範疇** | ARCH 可擴展性設計、SCHEMA 分表策略、EDD 容量規劃、Colyseus 單/多節點決策 |

### Q5 — 其他補充說明（動態追問）

| 欄位 | 內容 |
|------|------|
| **回答** | 使用者草稿額外指定：UI 風格可為「像素風」或「CASINO 21點風」，需有主角、布景、豐富互動 |
| **追問觸發原因** | 使用者已主動提供 UI/UX 風格偏好 |
| **影響範疇** | Art Direction、§4.4 RACI Art、§5.3 MVP UI 範圍、Beta A/B 測試計畫 |

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

*保留原文供未來 ECR（Engineering Change Request）審查時比對，確認需求變更屬 BUG 修正還是範圍擴充。*

---

## 7. Market & Competitive Intelligence（市場與競品情報）

### 7.1 競品 / 參考資源

| 競品 / 工具 | 核心定位 | 優勢 | 劣勢 | 我們的差異 |
|-----------|---------|------|------|-----------|
| colyseus-2d-multiplayer-card-game-templates（GitHub） | Colyseus 卡牌模板（Unity/Phaser/Defold/Godot） | 可直接參考 room state 設計 | 無 Cocos Creator 範例；非三公專用 | 以 Cocos + 三公玩法補足生態 |
| Colyseus 官方 UNO 範例 | Turn-based 卡牌官方範例 | 完整 Schema + Command Pattern 示範 | 英文 UI、非三公 | 本土化 + 品類差異 |
| Riffle（GitHub） | Angular + Colyseus web 卡牌 | Web client 整合實例 | Web only、非三公 | 跨平台 + 三公 |
| 既有三公手機 App（數十款） | 單機或 P2P 三公 | 已有華人用戶認知 | Client-side 計算、美術差、作弊疑慮 | Server authoritative + 專業美術 |
| Zynga Poker / PokerStars | 國際撲克 App | 成熟變現、強社交 | 非三公、華人親切度低 | 聚焦華人原生玩法 |

### 7.2 技術生態建議

| 層次 | 建議方案 | 選擇理由 |
|------|---------|---------|
| Client 引擎 | Cocos Creator 3.x（使用者指定） | 華人開發社群成熟、跨平台能力完整 |
| Client 語言 | TypeScript | 與 Colyseus SDK 一致、型別安全 |
| Server 框架 | Colyseus 0.15+（使用者指定） | 官方 Cocos SDK、Schema-based sync、MIT license |
| Server 語言 | Node.js + TypeScript | 與 Client 共用 Schema type |
| 持久層 | PostgreSQL + Redis | PG 存玩家/牌局；Redis 做 matchmaking queue + presence |
| 部署 | Colyseus Cloud（省維運）或自建 k8s（彈性高）| EDD 階段決策 |
| 反作弊 | Server 速率限制 + Schema 變更審計 | Schema 改動只發生 Server 端，天然防 Client 作弊 |

### 7.3 研究來源

| 搜尋關鍵字 | 主要發現 | 可信度 |
|-----------|---------|--------|
| "sam gong 3-card poker multiplayer colyseus github" | 未找到 Sam Gong 專屬實作；找到多款 Colyseus 卡牌模板 | 高 |
| "Colyseus Cocos Creator best practices 2026" | 官方已提供 Cocos SDK；Schema Class 應只含欄位、邏輯走 Command Pattern | 高 |
| "online card game anti-cheat gambling regulation Taiwan" | 台灣《刑法》賭博罪；《詐欺犯罪危害防制條例》規管線上遊戲；罰鍰 NT$10 萬-200 萬 | 高 |

---

## 8. Initial Risk Assessment（初始風險評估）

### 8.1 風險矩陣

| # | 風險描述 | 類型 | 可能性 | 影響 | 風險等級 | 初步緩解策略 |
|---|---------|------|:------:|:----:|:------:|------------|
| R1 | 台灣刑法賭博罪定位 | 法規 | MEDIUM | HIGH | 🔴 HIGH | 虛擬籌碼不可兌換 + 律師意見書 |
| R2 | Client 外掛 / 自動化作弊 | 安全 | HIGH | MEDIUM | 🟡 MEDIUM | Server 速率限制 + 異常偵測 |
| R3 | Colyseus 單節點承載不足 | 技術 | MEDIUM | HIGH | 🔴 HIGH | Redis Presence 水平擴展 PoC |
| R4 | 美術雙軌（像素/賭場）成本超支 | 產品 | MEDIUM | MEDIUM | 🟡 MEDIUM | 先做一套主打，另一套做關鍵畫面 |
| R5 | Google Play / App Store 審查駁回 | 商業 | MEDIUM | HIGH | 🔴 HIGH | 強調娛樂性 + 預審 |
| R6 | 籌碼經濟通膨 / 崩盤 | 遊戲設計 | MEDIUM | HIGH | 🔴 HIGH | 發放/回收曲線模擬 + 每日上限 |

### 8.2 Kill Conditions（專案終止條件）

| 終止條件 | 觸發閾值 | 檢查時機 |
|---------|---------|---------|
| 法務風險無解 | 律師明確指出無合規路徑 | BRD 核准前 |
| 技術不可行 | 2 週 PoC 無法跑通 1 桌 4 人基本對戰 | Discovery Week 3 |
| 使用者不關心公平性 | 訪談 < 40% 視為選擇因素 | BRD 審查前 |
| Beta 留存崩壞 | 7 日留存 < 10% | Beta Week 4 |
| 平台雙拒 | Google / Apple 均駁回上架 | Pre-launch |

### 8.3 Pre-mortem Exercise（失敗前情境模擬）

> **想象 12 個月後，這個專案已徹底失敗。最可能的失敗原因：**

| # | 失敗情境 | 根本原因 | 預防措施 | 早期預警訊號 |
|---|---------|---------|---------|-----------|
| F1 | 被平台下架或遭政府調查 | 被認定觸犯賭博罪 | 早期律師意見書 + 虛擬籌碼不可兌換 + 平台預審 | 律師回覆保留、平台初審拒絕 |
| F2 | 同時在線數 < 100，配對失敗率高 | 獲客成本過高或美術未達預期 | Beta 封測質感驗收 + FB/Google 小額廣告測 CAC | Beta 留存 < 15% |
| F3 | 競品（大廠）2-3 個月內跟進推出 | 技術門檻其實不高 | 建立品牌認知護城河 + 快速迭代新品類 | 大廠公告進入華人撲克市場 |
| F4 | Client 被外掛 / 反編譯破解自動化下注 | Server 速率限制與異常偵測不足 | 反作弊系統早期介入 + 關鍵邏輯 Server 驗證 | 異常帳號投訴激增 |
| F5 | Cocos + Colyseus 整合遇 SDK Bug 延期 | 技術選型冒險 | 2 週 PoC + 備案（自研 WebSocket） | PoC 超 2 週仍未完成 |
| F6 | 籌碼經濟崩盤（通膨或通縮）| 發放/回收曲線未測試 | Game Designer 模擬 + 每日上限 + 回收機制 | 玩家抱怨「沒籌碼玩」或「籌碼太多沒用」 |

**Pre-mortem 結論：** 最可能的失敗路徑是 **F1（法規風險）**，需在 BRD 階段優先設計合規邊界與律師意見書；次要風險是 **F4（作弊）**，需在 EDD 階段納入反作弊設計。

---

## 9. Business Potential（初步商業潛力）

### 9.1 商業模式假說

| 項目 | 初步假設 |
|------|---------|
| 收入來源 | 虛擬籌碼 IAP（主）+ VIP 訂閱（次）+ 獎勵廣告（免費用戶觀看）|
| 主要定價策略 | Freemium：免費遊玩 + 每日贈送 + 付費加速 / 桌限擴大 |
| 主要成本驅動因子 | 一次性開發 NT$ 450 萬；月維運 NT$ 20 萬；CAC NT$ 150-300/人 |
| 核心資源 | Cocos + Colyseus 技術棧、華人美術、反作弊演算法、KYC 整合 |
| 獲客管道 | Facebook 華人社團、YouTube 華人頻道贊助、Google UAC、商店 SEO |

### 9.2 戰略對齊

| 公司策略目標 | 本 IDEA 的貢獻方式 | 對齊強度 |
|-----------|-----------------|---------|
| 建立華人市場休閒遊戲 IP 組合 | 三公為首發，複製至其他撲克品類 | 強 |
| 累積多人遊戲後端能力 | Colyseus + Cocos 可複用 | 強 |
| 合規營運模式探索 | 建立可跨境複製的合規 playbook | 中 |

---

## 10. Executive Sponsorship & Stakeholder Alignment

### 10.1 Executive Sponsor

| 欄位 | 內容 |
|------|------|
| **贊助人** | （待指定，建議 Sayyo Games 創辦人或 CPO） |
| **贊助原因** | 華人休閒博弈市場驗證 + 多人遊戲能力建設 |
| **授權範圍** | 預算 NT$ 450 萬開發 + NT$ 240 萬首年維運；法規邊界不可妥協 |
| **核可日期** | （待填） |
| **升級路徑** | 法務或技術重大阻塞 → 升級至董事會 |

### 10.2 Stakeholder Pre-alignment Matrix

| 利害關係人 | 角色 | 對本 IDEA 的態度 | 主要顧慮 | 對齊策略 | 對齊期限 |
|-----------|------|:--------------:|---------|---------|---------|
| Product Lead | PM | 支持 | 玩家留存、變現 | BRD 審查會議 | BRD 前 |
| Engineering Lead | Tech | 中立→支持 | Cocos+Colyseus 整合風險 | 2 週 PoC | Discovery Week 3 |
| Legal | 法務 | 謹慎 | 賭博罪風險 | 提早意見書 | BRD 前 |
| Art Director | 美術 | 興奮 | 雙軌成本 | 擇一主打 | PRD 時 |
| Game Designer | 設計 | 支持 | 規則/平衡 | 早期籌碼模擬 | EDD 前 |

### 10.3 Communication Plan

| 里程碑 | 溝通對象 | 溝通形式 | 期限 |
|--------|---------|---------|------|
| IDEA 核准 | Executive Sponsor | 1-pager + 簡報 | BRD 前 |
| BRD 完成 | All Stakeholders | 文件分享 + 審查會議 | BRD 完成後 |
| PoC 結果 | Eng + PM | Demo + 技術報告 | Discovery Week 3 |
| Beta 結果 | All Stakeholders | Data Review | Beta 結束 |

---

## 11. IDEA Quality Score（構想品質評分）

**整體評分**：★★★☆☆（3/5）

| 評分維度 | 分數 | 評估說明 | 改進建議 |
|---------|:----:|---------|---------|
| 目標清晰度 | 1.0 / 1 | 核心目標明確：Server-authoritative 三公多人遊戲 | — |
| 使用者具體度 | 0.5 / 1 | 使用者草稿未明示目標玩家，AI 推斷華人市場 | 訪談 N ≥ 10 確認目標玩家輪廓 |
| 痛點可量化 | 0.3 / 1 | 草稿聚焦技術架構，未量化玩家痛點 | 問卷量化作弊疑慮、美術偏好 |
| 範圍邊界明確 | 0.5 / 1 | Client/Server 分工清楚，但 Out of Scope 未明示 | 明確列出本版不做項目 |
| 技術可行性初判 | 1.0 / 1 | Cocos + Colyseus 技術棧成熟，官方 SDK 可用 | — |

```
【IDEA 品質評分】★★★☆☆（3/5）
  + 目標清晰：✅ Server-authoritative 三公多人遊戲
  + 可行性：✅ 技術棧成熟（Cocos + Colyseus 官方整合）
  △ 使用者具體度：AI 推斷華人市場，需訪談確認
  △ 範圍邊界：AI 已補齊 Out of Scope，建議 PRD 階段細化
  - 痛點量化：草稿聚焦技術而非玩家行為，建議訪談量化
```

---

## 12. Critical Assumptions（關鍵假設清單）

| # | 假設陳述 | 影響層級 | 不確定性 | 驗證方式 | 驗證期限 |
|---|---------|:-------:|:-------:|---------|---------|
| A1 | 虛擬籌碼不可兌換模式在台灣合法 | HIGH | HIGH | 律師意見書 | BRD 前 4 週 |
| A2 | Cocos + Colyseus SDK 整合無重大阻塞 | HIGH | MEDIUM | 2 週 PoC | Discovery Week 3 |
| A3 | 華人玩家重視公平性 > 方便性 | HIGH | MEDIUM | 訪談 N ≥ 10 | BRD 前 |
| A4 | 單節點 Colyseus 可承載 500 CCU + <100ms latency | MEDIUM | MEDIUM | 壓測 | EDD 後 |
| A5 | 付費率 3% 為華人休閒博弈合理預期 | MEDIUM | HIGH | Benchmark + 封測 | Beta |
| A6 | 像素 or 賭場風格被華人玩家接受 | MEDIUM | MEDIUM | Beta A/B | Beta |
| A7 | Google Play / App Store 審查可通過 | HIGH | MEDIUM | 平台預審 + 文案審查 | Pre-launch |

---

## 13. Open Questions（待解問題）

| # | 問題 | 影響層級 | 若不解決的後果 | 負責人 | 狀態 |
|---|------|:-------:|------------|--------|:----:|
| OQ1 | 虛擬籌碼是否可由玩家用現金購買？定位如何釐清？ | 策略 | 商業模式鎖不住 | Legal | 🔲 OPEN |
| OQ2 | 三公「公牌」規則採用哪一地區版本？ | 範圍 | 規則不確定性影響開發 | Game Designer | 🔲 OPEN |
| OQ3 | 是否需要實名 KYC？還是簡訊驗證即可？ | 法規 | 影響註冊轉換與合規 | Legal + Product | 🔲 OPEN |
| OQ4 | 美術風格最終採一套或雙主題？ | 產品 | 影響美術預算與上線時程 | Art + PM | 🔲 OPEN |
| OQ5 | Colyseus Cloud vs 自建 k8s？ | 技術 | 影響月維運成本與彈性 | Eng Lead | 🔲 OPEN |
| OQ6 | 是否支援觀戰模式？ | 範圍 | 影響 Schema 複雜度與社交 | PM | 🔲 OPEN |

---

## 14. IDEA → BRD Handoff Checklist

| # | Checklist 項目 | 狀態 | 負責人 |
|---|--------------|:----:|--------|
| C1 | 一句話描述（§1.1）已清晰表達，無模糊詞 | ✅ | PM |
| C2 | 核心假說（§1.2）符合可測試格式 | ✅ | PM |
| C3 | Q1 使用者描述具體（非「所有人」） | ✅ | PM |
| C4 | Q2 痛點已量化（或有驗證計畫） | 🔲 待訪談 | PM |
| C5 | Q4 規模已選定（影響架構決策） | ✅ | PM |
| C6 | 至少 1 個競品在 §7 已識別 | ✅ | PM |
| C7 | 至少 3 項風險在 §8 已識別 | ✅ | PM |
| C8 | Kill Conditions（§8.2）已定義 | ✅ | PM |
| C9 | 關鍵假設 A1（§12）已識別並有驗證計畫 | ✅ | PM |
| C10 | IDEA Quality Score ≥ 3 | ✅（3/5） | AI |
| C11 | 原始 IDEA 原文已逐字保留（§6 末段） | ✅ | AI |
| C12 | Open Questions 中無 P0 級別未解技術問題 | ✅ | Engineering |

---

## 15. Traceability Note（溯源說明）

*此文件是需求鏈的起點，扮演「原始意圖記錄者」的角色。*

**向下追溯（Forward）：**

```
IDEA.md （本文件）
  └─► BRD.md       ← /devsop-idea 已自動生成
        └─► PRD.md      ← /devsop-gen-prd 待生成
              └─► PDD.md      ← /devsop-gen-pdd
                    └─► EDD.md      ← /devsop-gen-edd
                          └─► ARCH / API / SCHEMA / BDD → 實作
```

**需求變更判斷準則：**

| 場景 | 對比依據 | 分類 |
|------|---------|------|
| 功能行為與原始 IDEA Q1/Q2/Q3 一致但實作有誤 | IDEA §6 原文 | **BUG**（修正，不需 ECR） |
| 功能需求超出原始三公玩法或 Client/Server 分工描述 | IDEA §6 原文 | **ECR**（需 /devsop-change） |
| Client 開始做結果計算（違反 Server authoritative） | IDEA §6 「👉 不做任何結果計算」 | **嚴重 ECR**（違反核心原則） |
| 技術棧偏離 Cocos + Colyseus | IDEA §6 Q3 | **ECR 或 ADR**（需決策依據） |
| 新增「真實金錢兌換」功能 | IDEA §5.3 Out of Scope | **法務阻擋 + 嚴重 ECR** |

---

## Appendix A：Research Raw Data（研究原始資料）

### 搜尋 1：競品與開源專案

```
查詢：sam gong 3-card poker 三公 multiplayer card game colyseus open source github
結果摘要：
- 無 Sam Gong / 三公 專屬的 Colyseus 開源實作
- sominator/colyseus-2d-multiplayer-card-game-templates：4 引擎卡牌模板
- Ronan-H/riffle：Angular + Colyseus Web 卡牌
- Colyseus 官方 UNO 範例
- Colyseus Cocos Creator 官方 SDK 已就緒
結論：有成熟 framework 與參考實作，但無 Sam Gong 專屬範本，需自行實作
```

### 搜尋 2：技術最佳實踐

```
查詢：Colyseus Cocos Creator multiplayer card game server authoritative state sync best practices 2026
結果摘要：
- Colyseus 使用 Schema-based state sync，Server 負責 mutate，Client 訂閱變更
- Best practice：Schema class 僅含欄位定義；遊戲邏輯走 Command Pattern，獨立於 Schema
- patchRate 優化：Colyseus 追蹤 property-level 變動，只發送最新值降低頻寬
- Cocos Creator SDK 使用方式與 JS/TS SDK 一致
- Colyseus UNO 範例為 turn-based 卡牌官方實作參考
結論：架構路線清楚，Command Pattern 管遊戲流程，Schema 管同步
```

### 搜尋 3：合規與反作弊

```
查詢：online multiplayer card game anti-cheat server authoritative pitfalls gambling regulation Taiwan
結果摘要：
- 台灣《刑法》第 266 條：凡以財物或可兌換財物之物為賭注即違法
- 《詐欺犯罪危害防制條例》明確將線上遊戲經營者納入規管，罰鍰 NT$10 萬-200 萬
- 數位部為主管機關，須配合身份驗證、可疑交易通報
- 反作弊：Server-authoritative 為基本功，但 Client 仍可能有自動化外掛
- 研究：SecureTCG（P2P 卡牌反作弊協定）可參考思路
結論：法規風險為最高風險；技術上 Server-authoritative 足以擋 Client 直接作弊，但需補強行為分析
```

---

## Appendix B：Document History

| 版本 | 日期 | 作者 | 修改摘要 |
|------|------|------|---------|
| v0.1-capture | 2026-04-21 | /devsop-idea | 初始捕捉，AI 自動填入模式 |

---

## Appendix C：Attached Materials（附件與素材）

*以下素材由使用者於 /devsop-idea 呼叫時提供，已自動存入 `docs/req/` 目錄。*

（目前無附件。若後續需補充素材——例如三公詳細規則文件、美術風格參考圖、競品截圖——請將檔案複製至 `docs/req/` 目錄，更新此清單後，gen-* skills 即可自動讀取。）

---

*此 IDEA.md 由 /devsop-idea 自動保留，記錄需求探索過程中的所有原始輸入與假設。*
*若未來需求發生變化，可對照此文件確認原始意圖，判斷屬 BUG 修正或 ECR（需求變更）。*
