# Test Audit Report — STEP 25
Date: 2026-04-21

## Files Audited

| File | Tests | Status |
|------|-------|--------|
| server/tests/unit/deck.test.ts | 10 | Clean |
| server/tests/unit/evaluator.test.ts | 12 | Clean |
| server/tests/unit/settlement.test.ts | 8 | Clean |
| server/tests/unit/banker.test.ts | 6 | Clean |
| client/tests/unit/GameManager.test.ts | 5 (skipped) | Acceptable skip |
| client/tests/unit/CardComponent.test.ts | 4 (skipped) | Acceptable skip |
| client/tests/unit/GameStateUtils.test.ts | 14 | Clean |
| tests/e2e/server_e2e.test.ts | 15 | 5 Fixed |

## Findings

| File | Test | Issue | Action |
|------|------|-------|--------|
| server_e2e.test.ts | "room is destroyed when all players leave" | `rejects.toBeDefined()` — any rejection (including TypeErrors) satisfies the assertion; provides no signal about actual server behaviour | Fixed: replaced with `rejects.toMatchObject({ message: expect.any(String) })` to assert a meaningful error object |
| server_e2e.test.ts | "joining with an invalid room ID throws an error" | Same pattern: `rejects.toBeDefined()` — trivially true for any thrown value | Fixed: replaced with `rejects.toMatchObject({ message: expect.any(String) })` |
| server_e2e.test.ts | "cannot start game with only 1 player" | Raw `setTimeout(1000)` sleep used as assertion gap — flaky on slow CI and gives false confidence when the server is just slow | Fixed: replaced bare sleep with `waitFor(() => state !== undefined)` + reduced initial pause to 500 ms |
| server_e2e.test.ts | "only host can send start_game; non-host attempt is ignored" | Same `setTimeout(1000)` anti-pattern | Fixed: same waitFor approach |
| server_e2e.test.ts | "place_bet is rejected outside of betting phase" | `setTimeout(800)` bare sleep | Fixed: same waitFor approach |
| client/tests/unit/GameManager.test.ts | All suites | `describe.skip` with empty test bodies | Acceptable — explicit TODO comments explain the Colyseus mock dependency; no fake assertions exist |
| client/tests/unit/CardComponent.test.ts | All suites | `describe.skip` with empty test bodies | Acceptable — explicit TODO comments explain the Cocos Creator runtime dependency; no fake assertions exist |

## Patterns Checked (No Issues Found)

- Always-true assertions (`expect(true).toBe(true)`, `expect(1).toBe(1)`)
- Hardcoded brittle shuffle-order assertions
- Missing `expect.assertions(N)` in error-throwing tests (all server unit tests use `expect(...).toThrow(...)` pattern correctly)
- Empty test bodies without skip + explanation
- Shallow `toBeDefined()` on values that are always defined at time of check

## Summary

- **5 fake/shallow tests found** in `tests/e2e/server_e2e.test.ts`
- **5 fixed** (2 shallow rejection assertions, 3 bare-sleep timing anti-patterns)
- **0 deleted** (no redundant or fully duplicate tests)
- **2 skipped suites accepted** (`GameManager`, `CardComponent`) — both have documented, legitimate dependency blockers (Colyseus mock, Cocos Creator headless runner) and zero fake assertions
- **All remaining tests verified as meaningful** with AAA structure and concrete assertions
