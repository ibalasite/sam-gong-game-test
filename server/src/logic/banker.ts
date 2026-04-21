export function selectInitialBanker(sessionIds: string[]): string {
  if (sessionIds.length === 0) {
    throw new Error('Cannot select banker from an empty player list');
  }
  return sessionIds[Math.floor(Math.random() * sessionIds.length)];
}

export function rotateBanker(bankerQueue: string[], currentBankerId: string): string {
  const idx = bankerQueue.indexOf(currentBankerId);
  if (idx === -1) {
    throw new Error(`currentBankerId "${currentBankerId}" not found in bankerQueue`);
  }
  return bankerQueue[(idx + 1) % bankerQueue.length];
}
