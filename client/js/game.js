/**
 * Sam Gong (三公) — Browser Game Client v2
 */
'use strict';

// ── Config ───────────────────────────────────────────────
const WS_HOST  = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'localhost:2567' : location.host.replace(/:\d+$/, '') + ':2567';
const API_HOST = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'localhost:3000' : location.host.replace(/:\d+$/, '') + ':3000';

const PHASE_NAMES = {
  waiting: '等待玩家', dealing: '發牌中',
  'banker-bet': '莊家下注', 'player-bet': '玩家下注',
  showdown: '開牌', settled: '結算完成'
};

// ── App State ────────────────────────────────────────────
let colyseusClient = null;
let room           = null;
let mySessionId    = null;
let myNickname     = '';

// ── Helpers ──────────────────────────────────────────────
const el  = id => document.getElementById(id);
const log = (msg, cls = '') => {
  const box = el('msg-log');
  if (!box) return;
  const p = document.createElement('p');
  p.className = cls;
  p.textContent = msg;
  box.appendChild(p);
  if (box.children.length > 80) box.removeChild(box.children[0]);
  box.scrollTop = box.scrollHeight;
};
const toast = (msg, type = '', ms = 3000) => {
  const c = el('toast-container');
  if (!c) return;
  const d = document.createElement('div');
  d.className = `toast ${type}`;
  d.textContent = msg;
  c.appendChild(d);
  setTimeout(() => d.remove(), ms);
};
const setConn = state => {
  const dot = el('conn-dot'); const lbl = el('conn-label');
  if (dot) dot.className = `conn-dot ${state}`;
  if (lbl) lbl.textContent = state === 'ok' ? '已連線' : state === 'connecting' ? '連線中...' : '已斷線';
};

// ── Card rendering ───────────────────────────────────────
function makeCardEl(cardStr, faceDown) {
  const div = document.createElement('div');
  if (faceDown || !cardStr) {
    div.className = 'card face-down';
    div.textContent = '🂠';
    return div;
  }
  const m = String(cardStr).match(/^(.+?)(♠|♥|♦|♣)$/);
  if (!m) { div.className = 'card'; div.textContent = cardStr; return div; }
  const [, rank, suit] = m;
  const red = suit === '♥' || suit === '♦';
  div.className = `card ${red ? 'red' : 'black'}`;
  div.innerHTML = `<span class="rank">${rank}</span><span class="suit">${suit}</span>`;
  return div;
}

// ── MapSchema safe iterator ──────────────────────────────
// Colyseus MapSchema is NOT a plain object — use .forEach()
function mapToArray(mapSchema) {
  const arr = [];
  if (!mapSchema) return arr;
  if (typeof mapSchema.forEach === 'function') {
    mapSchema.forEach((val, key) => arr.push({ key, val }));
  } else {
    Object.entries(mapSchema).forEach(([key, val]) => arr.push({ key, val }));
  }
  return arr;
}

// ── Login / Join ─────────────────────────────────────────
async function devJoin() {
  const nick = (el('nick-input').value || '').trim() || '玩家' + (Math.random() * 9000 + 1000 | 0);
  myNickname = nick;
  const btn = el('join-btn');
  btn.disabled = true;
  btn.textContent = '連線中...';
  el('status-msg').textContent = '';
  setConn('connecting');

  try {
    if (!window.Colyseus) throw new Error('Colyseus SDK 未載入，請重新整理');
    colyseusClient = new Colyseus.Client(`ws://${WS_HOST}`);
    room = await colyseusClient.joinOrCreate('sam_gong', { nickname: nick, token: 'dev' });
    mySessionId = room.sessionId;
    setConn('ok');
    setupRoomHandlers();
    showGameScreen();
  } catch (e) {
    const msg = e?.message || String(e);
    el('status-msg').textContent = '❌ 連線失敗：' + msg;
    setConn('err');
    btn.disabled = false;
    btn.textContent = '🎴 進入遊戲';
  }
}

// ── Show game screen & build UI ──────────────────────────
function showGameScreen() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  el('game-screen').classList.add('active');
  buildTable();
}

function buildTable() {
  el('game-screen').innerHTML = `
    <span class="dev-badge">DEV</span>

    <!-- table felt -->
    <div class="table-felt">
      <div class="table-center">
        <div class="phase-label" id="phase-lbl">等待玩家</div>
        <div class="pot-amount"  id="pot-lbl">0</div>
        <div class="hall-label"  id="hall-lbl">青銅廳</div>
      </div>

      <!-- 6 seats around table -->
      <div class="seat seat-bottom"  id="seat-0"></div>
      <div class="seat seat-bl"      id="seat-1"></div>
      <div class="seat seat-tl"      id="seat-2"></div>
      <div class="seat seat-top"     id="seat-3"></div>
      <div class="seat seat-tr"      id="seat-4"></div>
      <div class="seat seat-br"      id="seat-5"></div>
    </div>

    <!-- message log -->
    <div class="side-panel left-panel">
      <div class="panel-title">💬 聊天室</div>
      <div class="msg-log" id="msg-log"></div>
      <div class="chat-row">
        <input id="chat-input" type="text" placeholder="輸入訊息..." maxlength="40">
        <button id="chat-send-btn" class="btn btn-secondary">送</button>
      </div>
    </div>

    <!-- action panel -->
    <div class="side-panel right-panel">
      <div class="panel-title">🎮 操作</div>
      <div id="action-area">
        <p style="color:#666;font-size:.85rem;text-align:center;padding:16px">等待遊戲開始...</p>
      </div>
      <div style="margin-top:auto;font-size:.75rem;color:#555;padding:8px 0">
        房間 ID: <span id="room-id-lbl">${room?.id || '—'}</span><br>
        我的 ID: <span style="font-family:monospace">${(mySessionId||'').slice(-8)}</span>
      </div>
    </div>

    <!-- result overlay -->
    <div class="result-overlay" id="result-overlay">
      <div id="result-title" class="result-title"></div>
      <div id="result-detail" class="result-detail"></div>
      <button class="btn btn-primary" id="result-ok-btn">繼續</button>
    </div>

    <!-- conn bar -->
    <div class="conn-bar">
      <span><span class="conn-dot ok" id="conn-dot"></span><span id="conn-label">已連線</span></span>
      <button class="leave-btn" id="leave-btn">離開房間</button>
    </div>

    <div class="toast-container" id="toast-container"></div>
  `;

  // init all seats to empty
  for (let i = 0; i < 6; i++) renderSeat(i, null, false);

  // bind events AFTER DOM built
  el('chat-send-btn').addEventListener('click', sendChat);
  el('chat-input').addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });
  el('leave-btn').addEventListener('click', leaveGame);
  el('result-ok-btn').addEventListener('click', () => { el('result-overlay').classList.remove('show'); });

  log('🎴 已連線！歡迎 ' + myNickname, 'sys');
  log('等待其他玩家加入...', 'sys');
}

// ── Seat rendering ───────────────────────────────────────
function renderSeat(idx, player, isMe) {
  const seat = el(`seat-${idx}`);
  if (!seat) return;

  if (!player) {
    seat.innerHTML = `
      <div class="seat-avatar empty">💺</div>
      <div class="seat-name" style="color:#444">空位</div>`;
    return;
  }

  const isBanker = room?.state?.banker_session_id === player.session_id;
  const phase    = room?.state?.phase || 'waiting';
  const showCards = (phase === 'showdown' || phase === 'settled' || isMe);
  const cards    = player.hand || [];

  let statusHtml = '';
  if (player.folded) statusHtml = '<span class="badge badge-fold">棄牌</span>';
  else if (player.called) statusHtml = '<span class="badge badge-call">跟注</span>';
  else if (isBanker) statusHtml = '<span class="badge badge-banker">莊</span>';

  let cardsHtml = '';
  for (let c = 0; c < 3; c++) {
    const cardStr = cards[c] || null;
    const div = makeCardEl(cardStr, !showCards || !cardStr);
    cardsHtml += div.outerHTML;
  }

  seat.innerHTML = `
    <div class="seat-avatar${isBanker ? ' banker' : ''}${isMe ? ' me' : ''}">
      ${isBanker ? '👑' : isMe ? '😊' : '👤'}
    </div>
    <div class="seat-name">${esc(player.display_name || player.nickname || '玩家')}</div>
    <div class="seat-chips">${(player.chip_balance || 0).toLocaleString()} 籌</div>
    <div class="hand-cards">${cardsHtml}</div>
    <div class="seat-status">${statusHtml}</div>`;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ── State update ─────────────────────────────────────────
function onStateChange(state) {
  if (!state) return;

  // Phase + hall
  const phaseLbl = el('phase-lbl');
  const potLbl   = el('pot-lbl');
  const hallLbl  = el('hall-lbl');
  if (phaseLbl) phaseLbl.textContent = PHASE_NAMES[state.phase] || state.phase || '等待中';
  if (potLbl)   potLbl.textContent   = (state.pot || 0).toLocaleString();
  if (hallLbl)  hallLbl.textContent  = state.tier_config?.tier_name || '青銅廳';

  // Build ordered player list: me at seat-0, others fill 1-5
  const players = mapToArray(state.players).map(e => e.val);
  const me       = players.find(p => p.session_id === mySessionId);
  const others   = players.filter(p => p.session_id !== mySessionId);
  const ordered  = [me, ...others];   // me always at bottom seat

  for (let i = 0; i < 6; i++) {
    const p = ordered[i] || null;
    renderSeat(i, p, i === 0);
  }

  // Action panel
  updateActions(state, me);
}

// ── Action Panel ─────────────────────────────────────────
function updateActions(state, me) {
  const area = el('action-area');
  if (!area) return;
  area.innerHTML = '';

  const phase    = state.phase || 'waiting';
  const isBanker = state.banker_session_id === mySessionId;

  if (!me) {
    area.innerHTML = '<p style="color:#555;font-size:.85rem;text-align:center;padding:16px">觀看中</p>';
    return;
  }

  if (me.folded) {
    area.innerHTML = '<p style="color:#ef9a9a;text-align:center;padding:16px">已棄牌，等待下一局</p>';
    return;
  }

  if (phase === 'waiting') {
    const playerCount = mapToArray(state.players).length;
    if (playerCount < 2) {
      area.innerHTML = `<p style="color:#aaa;text-align:center;padding:8px">等待更多玩家（${playerCount}/6）</p>`;
    } else {
      area.innerHTML = `
        <p style="color:#80cbc4;text-align:center;font-size:.85rem;margin-bottom:10px">
          已有 ${playerCount} 名玩家
        </p>`;
      addActionBtn(area, '🎯 開始遊戲', 'primary', () => room?.send('ready'));
    }
    return;
  }

  if (phase === 'banker-bet' && isBanker) {
    area.innerHTML = `
      <p style="color:#f0c040;margin-bottom:8px;font-size:.85rem">您是莊家，請下注：</p>`;
    const wrap = document.createElement('div');
    wrap.className = 'bet-wrap';
    wrap.innerHTML = `
      <label style="font-size:.8rem;color:#aaa">金額</label>
      <input type="number" id="bet-input" value="${state.min_bet || 100}"
        min="${state.min_bet || 100}" max="${state.max_bet || 5000}" step="100"
        style="width:100%;margin:6px 0">`;
    area.appendChild(wrap);

    // Quick bet buttons
    const quickBets = state.tier_config?.quick_bet_amounts;
    if (quickBets && typeof quickBets.forEach === 'function') {
      const qrow = document.createElement('div');
      qrow.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;margin:6px 0';
      quickBets.forEach(amt => {
        const b = document.createElement('button');
        b.className = 'btn btn-secondary';
        b.style.cssText = 'flex:1;min-width:48px;padding:5px;font-size:.78rem';
        b.textContent = amt >= 1000 ? (amt/1000)+'K' : amt;
        b.onclick = () => { const inp = el('bet-input'); if(inp) inp.value = amt; };
        qrow.appendChild(b);
      });
      area.appendChild(qrow);
    }

    addActionBtn(area, '✅ 確認下注', 'primary', () => {
      const amt = parseInt(el('bet-input')?.value || state.min_bet || 100);
      room?.send('banker_bet', { amount: amt });
    });
    return;
  }

  if (phase === 'player-bet' && !isBanker && !me.called) {
    area.innerHTML = `
      <p style="color:#80cbc4;margin-bottom:8px;font-size:.85rem">請選擇操作：</p>`;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <input type="number" id="bet-input" value="${state.min_bet || 100}"
        min="${state.min_bet || 100}" max="${state.max_bet || 5000}" step="100"
        style="width:100%;margin:4px 0 10px">`;
    area.appendChild(wrap);

    addActionBtn(area, '💰 跟注', 'primary', () => {
      const amt = parseInt(el('bet-input')?.value || state.min_bet || 100);
      room?.send('call', { amount: amt });
    });
    addActionBtn(area, '👁 看牌', 'secondary', () => room?.send('see_cards'));
    addActionBtn(area, '✋ 棄牌', 'danger', () => {
      if (confirm('確定棄牌？')) room?.send('fold');
    });
    return;
  }

  if (phase === 'showdown' || phase === 'settled') {
    area.innerHTML = '<p style="color:#aaa;text-align:center;padding:16px">本局結束，等待下一局...</p>';
    return;
  }

  area.innerHTML = `<p style="color:#666;text-align:center;padding:16px">${PHASE_NAMES[phase] || phase}</p>`;
}

function addActionBtn(container, label, type, onClick) {
  const b = document.createElement('button');
  b.className = `btn btn-${type}`;
  b.style.cssText = 'width:100%;margin-bottom:8px';
  b.textContent = label;
  b.onclick = onClick;
  container.appendChild(b);
}

// ── Room handlers ─────────────────────────────────────────
function setupRoomHandlers() {
  room.onStateChange(state => onStateChange(state));

  room.onMessage('my_session_info', data => {
    mySessionId = data.session_id;
    log(`✅ 已進入房間（session: ${data.session_id.slice(-6)}）`, 'sys');
  });

  room.onMessage('chat', msg => {
    log(`${msg.nickname || '玩家'}: ${msg.text}`, 'chat');
  });

  room.onMessage('send_chat', msg => {  // some servers echo with different key
    log(`${msg.nickname || '玩家'}: ${msg.text}`, 'chat');
  });

  room.onMessage('game_started', () => {
    log('🃏 新一局開始！', 'sys');
    toast('新一局開始！', 'gold');
    const o = el('result-overlay');
    if (o) o.classList.remove('show');
  });

  room.onMessage('settlement', result => {
    if (!result) return;
    const me = result.players?.[mySessionId];
    if (me) {
      const sign = me.net_chips >= 0 ? '+' : '';
      log(`💰 結算：${sign}${me.net_chips} 籌碼`, me.net_chips >= 0 ? 'win' : 'lose');
      showResult(me.net_chips);
    }
    if (result.rake) log(`抽水：${result.rake} 籌碼`, 'sys');
  });

  room.onMessage('anti_addiction_warning', msg => {
    toast('⚠️ ' + (msg.message || '防沉迷提示'), 'red', 6000);
    log('⚠️ 防沉迷警告：' + (msg.message || ''), 'sys');
  });

  room.onMessage('error', msg => {
    toast('❌ ' + (msg.message || '錯誤'), 'red');
    log('❌ ' + (msg.message || ''), 'sys');
  });

  room.onLeave(code => {
    setConn('err');
    log(`已離線 (code ${code})`, 'sys');
    if (code !== 1000) toast('已與伺服器斷線', 'red');
  });

  room.onError((code, msg) => {
    toast(`WS 錯誤 ${code}`, 'red');
    log(`WS 錯誤 ${code}: ${msg}`, 'sys');
  });
}

// ── Chat ─────────────────────────────────────────────────
function sendChat() {
  const inp = el('chat-input');
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;
  if (!room) { toast('尚未連線', 'red'); return; }
  room.send('send_chat', { text });
  // echo locally immediately
  log(`${myNickname}: ${text}`, 'chat');
  inp.value = '';
  inp.focus();
}

// ── Leave / Result ────────────────────────────────────────
function leaveGame() {
  if (!confirm('確定要離開房間嗎？')) return;
  room?.leave();
  room = null;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  el('login-screen').classList.add('active');
  setConn('err');
  el('status-msg').textContent = '已離開房間';
  el('join-btn').disabled = false;
  el('join-btn').textContent = '🎴 進入遊戲';
}

function showResult(netChips) {
  const o = el('result-overlay');
  const t = el('result-title');
  const d = el('result-detail');
  if (!o || !t) return;
  if (netChips > 0) {
    t.textContent = '🏆 勝利！'; t.className = 'result-title win';
    d.textContent = `贏得 +${netChips.toLocaleString()} 籌碼`;
  } else if (netChips < 0) {
    t.textContent = '💸 敗北'; t.className = 'result-title lose';
    d.textContent = `失去 ${Math.abs(netChips).toLocaleString()} 籌碼`;
  } else {
    t.textContent = '🤝 平局'; t.className = 'result-title tie';
    d.textContent = '本局平手';
  }
  o.classList.add('show');
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  fetch(`http://${API_HOST}/api/v1/health`)
    .then(r => r.json())
    .then(() => { el('status-msg').textContent = '✅ 伺服器連線正常'; })
    .catch(() => { el('status-msg').textContent = '⚠️ API 伺服器無回應'; });

  el('nick-input').addEventListener('keydown', e => { if (e.key === 'Enter') devJoin(); });
});

window.devJoin = devJoin;
