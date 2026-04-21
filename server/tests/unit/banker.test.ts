import { selectInitialBanker, rotateBanker } from '../../src/logic/banker';

describe('selectInitialBanker', () => {
  it('returns a valid sessionId from the list', () => {
    const sessions = ['p1', 'p2', 'p3'];
    const selected = selectInitialBanker(sessions);
    expect(sessions).toContain(selected);
  });

  it('handles single player', () => {
    expect(selectInitialBanker(['only'])).toBe('only');
  });
});

describe('rotateBanker', () => {
  it('rotates to next player in queue', () => {
    const queue = ['p1', 'p2', 'p3', 'p4'];
    expect(rotateBanker(queue, 'p1')).toBe('p2');
    expect(rotateBanker(queue, 'p2')).toBe('p3');
    expect(rotateBanker(queue, 'p3')).toBe('p4');
  });

  it('wraps around to first player', () => {
    const queue = ['p1', 'p2', 'p3'];
    expect(rotateBanker(queue, 'p3')).toBe('p1');
  });

  it('handles 2 players', () => {
    const queue = ['p1', 'p2'];
    expect(rotateBanker(queue, 'p1')).toBe('p2');
    expect(rotateBanker(queue, 'p2')).toBe('p1');
  });
});
