export function selectInitialBanker(sessionIds: string[]): string {
  return sessionIds[Math.floor(Math.random() * sessionIds.length)];
}

export function rotateBanker(bankerQueue: string[], currentBankerId: string): string {
  const idx = bankerQueue.indexOf(currentBankerId);
  return bankerQueue[(idx + 1) % bankerQueue.length];
}
