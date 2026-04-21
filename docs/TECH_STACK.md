# Tech Stack Decision — 三公遊戲

## Document Control
| 欄位 | 內容 |
|------|------|
| **版本** | v1.0 |
| **決策日期** | 2026-04-21 |
| **決策方式** | Full-Auto（BRD §8 硬性限制直接確認） |

## Selected Stack

### Client
| 技術 | 版本 | 選擇理由 |
|------|------|---------|
| Cocos Creator | 4.x | BRD §8 硬性限制 |
| TypeScript | 5.x | Cocos Creator 官方支援語言 |
| @colyseus/cocos-sdk | 0.15.x | 官方 Cocos 整合 SDK |

### Server
| 技術 | 版本 | 選擇理由 |
|------|------|---------|
| Node.js | 20 LTS | Colyseus 官方支援環境 |
| Colyseus | 0.15.x | BRD §8 硬性限制，Server-Authoritative 多人框架 |
| TypeScript | 5.x | 強型別，減少牌局邏輯 bug |
| @colyseus/schema | 0.15.x | 高效差分狀態同步 |

### 資料庫
| 技術 | 環境 | 選擇理由 |
|------|------|---------|
| SQLite | Dev/Pilot | 零設定，適合小規模試驗 |
| PostgreSQL | Production | 穩定、支援 concurrent 連線 |
| Prisma ORM | Both | TypeScript 原生，migration 友善 |

### 測試
| 工具 | 用途 |
|------|------|
| Jest | Server 單元/整合測試 |
| Playwright | E2E（Web 端）|

### 基礎設施
| 工具 | 用途 |
|------|------|
| Docker + docker-compose | 本地開發環境 |
| GitHub Actions | CI/CD Pipeline |
| Nginx | 反向代理（WebSocket + HTTP）|

## Architecture Pattern
- **模式**: Server-Authoritative（服務器權威架構）
- **理由**: 防止客戶端作弊；牌局邏輯與洗牌完全在服務器執行
- **狀態同步**: @colyseus/schema 差分更新，未翻牌的牌不下發至其他玩家

## Project Structure
```
sam-gong-game/
├── client/                 # Cocos Creator 4.x 專案
│   ├── assets/
│   │   ├── scripts/        # TypeScript 遊戲腳本
│   │   ├── prefabs/        # 預製件
│   │   └── scenes/         # 場景檔
│   └── package.json
├── server/                 # Colyseus Server
│   ├── src/
│   │   ├── rooms/          # SamGongRoom.ts
│   │   ├── schema/         # SamGongState.ts (@colyseus/schema)
│   │   ├── logic/          # 三公牌局邏輯（純函數，可單元測試）
│   │   └── index.ts        # 入口
│   ├── tests/
│   └── package.json
├── shared/                 # 共用型別定義（client + server）
│   └── types.ts
├── docs/                   # 所有規格文件
├── infra/                  # Docker, k8s, CI/CD
└── docker-compose.yml
```

## Decision Log
| # | 決策 | 理由 |
|---|------|------|
| D1 | Cocos Creator 4.x (Client) | BRD §8 硬性限制 |
| D2 | Colyseus 0.15 (Server) | BRD §8 硬性限制 |
| D3 | TypeScript (both) | 強型別保護牌局邏輯 |
| D4 | Monorepo structure | 共用型別更方便 |
| D5 | SQLite for Pilot | 試驗版不需要 DB infra |
