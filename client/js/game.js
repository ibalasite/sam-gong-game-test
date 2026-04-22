/**
 * Sam Gong (三公) — Game Client v3
 * Fixed: chat_message type, handler race, floating overlay UI
 */
'use strict';

const WS_HOST = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'localhost:2567' : location.hostname + ':2567';
const API_HOST = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'localhost:3000' : location.hostname + ':3000';

const PHASE_NAMES = {
  waiting:'等待玩家', dealing:'發牌中',
  'banker-bet':'莊家下注', 'player-bet':'玩家下注',
  showdown:'開牌', settled:'結算完成'
};

// ── State ─────────────────────────────────────────────────
let _client = null, _room = null, _myId = '', _nick = '';

// ── Tiny helpers ──────────────────────────────────────────
const $ = id => document.getElementById(id);
function toast(msg, cls='', ms=3000) {
  const c = $('toasts'); if (!c) return;
  const d = document.createElement('div');
  d.className = 'toast ' + cls; d.textContent = msg;
  c.appendChild(d); setTimeout(() => d.remove(), ms);
}
function addLog(msg, cls='') {
  const b = $('chat-log'); if (!b) return;
  const p = document.createElement('p');
  p.className = cls; p.textContent = msg;
  b.appendChild(p);
  if (b.children.length > 100) b.removeChild(b.children[0]);
  b.scrollTop = b.scrollHeight;
}
function mapEach(m, fn) {
  if (!m) return;
  typeof m.forEach === 'function' ? m.forEach(fn) : Object.entries(m).forEach(([k,v]) => fn(v,k));
}
function esc(s) { return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function setConn(ok) {
  const d = $('cdot'), l = $('clbl');
  if (d) d.className = 'cdot ' + (ok ? 'on' : 'off');
  if (l) l.textContent = ok ? '已連線' : '已斷線';
}

// ── Card helpers ──────────────────────────────────────────
function cardHTML(str, back) {
  if (back || !str) return '<div class="card back">🂠</div>';
  const m = String(str).match(/^(.+?)(♠|♥|♦|♣)$/);
  if (!m) return `<div class="card">${esc(str)}</div>`;
  const [,rank,suit] = m;
  const red = suit==='♥'||suit==='♦';
  return `<div class="card ${red?'r':'b'}"><span>${rank}</span><span>${suit}</span></div>`;
}
function handHTML(cards, reveal) {
  const list = Array.isArray(cards) ? cards : [];
  let h = '';
  for (let i=0; i<3; i++) h += cardHTML(list[i]||null, !reveal||!list[i]);
  return h;
}

// ── Login ─────────────────────────────────────────────────
async function joinGame() {
  _nick = ($('nick').value||'').trim() || '玩家'+(Math.random()*9000+1000|0);
  const btn = $('joinbtn');
  btn.disabled = true; btn.textContent = '連線中...';
  $('errmsg').textContent = '';
  try {
    if (!window.Colyseus) throw new Error('Colyseus SDK 未載入');
    _client = new Colyseus.Client('ws://'+WS_HOST);
    _room   = await _client.joinOrCreate('sam_gong', { nickname:_nick, token:'dev' });
    _myId   = _room.sessionId;  // use directly, don't wait for my_session_info msg

    // Register ALL handlers immediately after join (before showing UI)
    _room.onMessage('my_session_info', d => { _myId = d.session_id; });
    _room.onMessage('chat_message',    d => addLog((d.display_name||'玩家')+': '+d.text, 'chat'));
    _room.onMessage('send_message_rejected', () => toast('訊息被拒絕','red'));
    _room.onMessage('game_started',    () => { addLog('🃏 新一局開始！','sys'); toast('新局開始','gold'); $('result').style.display='none'; });
    _room.onMessage('settlement',      d => onSettlement(d));
    _room.onMessage('anti_addiction_warning', d => { toast('⚠️ '+(d.message||'防沉迷提示'),'red',6000); addLog('⚠️ 防沉迷警告','sys'); });
    _room.onMessage('error',           d => { toast('❌ '+(d.message||'錯誤'),'red'); addLog('❌ '+(d.message||''),'sys'); });
    _room.onMessage('showdown_reveal', d => { if(d) addLog('開牌！','sys'); });
    _room.onStateChange(s => renderState(s));
    _room.onLeave(code => { setConn(false); addLog('已離線 ('+code+')','sys'); if(code!==1000) toast('已斷線','red'); });
    _room.onError((c,m) => { toast('WS錯誤 '+c,'red'); addLog('WS錯誤: '+m,'sys'); });

    // Show game screen
    $('login').style.display = 'none';
    $('game').style.display  = 'block';
    setConn(true);
    $('roomid').textContent = _room.id;
    addLog('✅ 已連線，歡迎 '+_nick,'sys');
    addLog('等待其他玩家加入...','sys');
  } catch(e) {
    $('errmsg').textContent = '❌ '+( e?.message||String(e));
    btn.disabled = false; btn.textContent = '🎴 進入遊戲';
  }
}

// ── Render state ──────────────────────────────────────────
function renderState(s) {
  if (!s) return;
  const phase    = s.phase || 'waiting';
  const bankerSid= s.banker_session_id || '';
  const pot      = s.pot || 0;
  const tierName = s.tier_config?.tier_name || '青銅廳';

  // Center info
  setText('c-phase', PHASE_NAMES[phase]||phase);
  setText('c-pot',   pot.toLocaleString());
  setText('c-hall',  tierName);

  // Collect players into array, me first
  const all = [];
  mapEach(s.players, (p,_k) => all.push(p));
  const me     = all.find(p => p.session_id === _myId);
  const others = all.filter(p => p.session_id !== _myId);
  const ordered = [me, ...others];

  // 6 seats
  const positions = ['s-bot','s-bl','s-tl','s-top','s-tr','s-br'];
  for (let i=0; i<6; i++) {
    const box = $(positions[i]);
    if (!box) continue;
    const p = ordered[i];
    if (!p) { box.innerHTML = '<div class="av empty">💺</div><div class="sname muted">空位</div>'; continue; }
    const isMe     = p.session_id === _myId;
    const isBanker = p.session_id === bankerSid;
    const reveal   = phase==='showdown'||phase==='settled'||isMe;
    const cards    = (p.hand && p.hand.length>0) ? Array.from(p.hand) : [];

    let badge = '';
    if (p.folded)    badge = '<span class="bdg fold">棄牌</span>';
    else if(p.called)badge = '<span class="bdg call">跟注</span>';
    else if(isBanker)badge = '<span class="bdg bnk">莊</span>';

    box.innerHTML = `
      <div class="av${isBanker?' bnkav':''}${isMe?' meav':''}">${isBanker?'👑':isMe?'😊':'👤'}</div>
      <div class="sname">${esc(p.display_name||p.nickname||'玩家')}</div>
      <div class="schips">${(p.chip_balance||0).toLocaleString()} 籌</div>
      <div class="hand">${handHTML(cards,reveal)}</div>
      <div class="sbdg">${badge}</div>`;
  }

  // Action panel
  renderActions(s, me);
}

function setText(id, txt) { const e=$(id); if(e) e.textContent=txt; }

// ── Action panel ──────────────────────────────────────────
function renderActions(s, me) {
  const box = $('actions'); if (!box) return;
  box.innerHTML = '';
  const phase    = s.phase||'waiting';
  const isBanker = s.banker_session_id === _myId;
  const minBet   = s.min_bet||100;
  const maxBet   = s.max_bet||5000;

  if (!me || me.folded) {
    box.innerHTML = `<p class="hint">${me?.folded?'已棄牌，等待下一局':'觀看中'}</p>`;
    return;
  }

  if (phase==='waiting') {
    const cnt = countPlayers(s.players);
    if (cnt < 2) {
      box.innerHTML = `<p class="hint">等待更多玩家 (${cnt}/6)</p>`;
    } else {
      box.innerHTML = `<p class="hint">${cnt} 名玩家就緒</p>`;
      addBtn(box,'🎯 開始遊戲','primary',() => _room?.send('ready'));
    }
    return;
  }

  if (phase==='banker-bet' && isBanker) {
    box.innerHTML = `<p class="hint gold">您是莊家，請下注</p>
      <input type="number" id="betval" value="${minBet}" min="${minBet}" max="${maxBet}" step="100" style="width:100%;margin:6px 0">
      <div id="qbets" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px"></div>`;
    // quick bets
    const qbox = $('qbets');
    let quickBets = [];
    if (s.tier_config?.quick_bet_amounts) {
      mapEach(s.tier_config.quick_bet_amounts, v => quickBets.push(v));
    } else { quickBets = [minBet, minBet*2, minBet*5]; }
    quickBets.forEach(amt => {
      const b = document.createElement('button');
      b.className='btn sec'; b.style='flex:1;min-width:44px;font-size:.76rem;padding:4px';
      b.textContent = amt>=1000?(amt/1000)+'K':amt;
      b.onclick=()=>{ const i=$('betval'); if(i) i.value=amt; };
      qbox.appendChild(b);
    });
    addBtn(box,'✅ 確認下注','pri',() => {
      const amt=parseInt($('betval')?.value||minBet);
      _room?.send('banker_bet',{amount:amt});
    });
    return;
  }

  if (phase==='player-bet' && !isBanker && !me.called) {
    box.innerHTML = `<p class="hint">請選擇操作</p>
      <input type="number" id="betval" value="${minBet}" min="${minBet}" max="${maxBet}" step="100" style="width:100%;margin:6px 0 10px">`;
    addBtn(box,'💰 跟注','pri',() => {
      const amt=parseInt($('betval')?.value||minBet);
      _room?.send('call',{amount:amt});
    });
    addBtn(box,'👁 看牌','sec',() => _room?.send('see_cards'));
    addBtn(box,'✋ 棄牌','danger',() => { if(confirm('確定棄牌？')) _room?.send('fold'); });
    return;
  }

  if (phase==='showdown'||phase==='settled') {
    box.innerHTML='<p class="hint">本局結束，等待下一局</p>';
    return;
  }

  box.innerHTML=`<p class="hint">${PHASE_NAMES[phase]||phase}</p>`;
}

function addBtn(parent, label, cls, fn) {
  const b = document.createElement('button');
  b.className='btn '+cls; b.style='width:100%;margin-bottom:7px';
  b.textContent=label; b.onclick=fn; parent.appendChild(b);
}
function countPlayers(players) {
  let n=0; mapEach(players,()=>n++); return n;
}

// ── Chat ──────────────────────────────────────────────────
function sendChat() {
  const inp = $('chatinp'); if (!inp) return;
  const txt = inp.value.trim(); if (!txt) return;
  if (!_room) { toast('尚未連線','red'); return; }
  _room.send('send_chat',{text:txt});
  addLog(_nick+': '+txt,'chat');  // local echo
  inp.value=''; inp.focus();
}

// ── Settlement ────────────────────────────────────────────
function onSettlement(r) {
  if (!r) return;
  const me = r.players?.[_myId];
  if (me) {
    const net = me.net_chips||0;
    addLog('💰 結算：'+(net>=0?'+':'')+net+' 籌碼', net>=0?'win':'lose');
    const ro=$('result'), rt=$('rtitle'), rd=$('rdetail');
    if(ro && rt) {
      rt.className='rtitle '+(net>0?'win':net<0?'lose':'tie');
      rt.textContent = net>0?'🏆 勝利！':net<0?'💸 敗北':'🤝 平局';
      rd.textContent = (net>=0?'+':'')+net.toLocaleString()+' 籌碼';
      ro.style.display='flex';
    }
  }
  if (r.rake) addLog('抽水：'+r.rake+' 籌碼','sys');
}

// ── Leave ─────────────────────────────────────────────────
function leaveGame() {
  if (!confirm('確定離開房間？')) return;
  _room?.leave(); _room=null;
  $('game').style.display='none';
  $('login').style.display='flex';
  setConn(false);
  $('joinbtn').disabled=false; $('joinbtn').textContent='🎴 進入遊戲';
  $('errmsg').textContent='已離開房間';
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  fetch('http://'+API_HOST+'/api/v1/health')
    .then(r=>r.json()).then(()=>{ $('apistatus').textContent='✅ 伺服器正常'; })
    .catch(()=>{ $('apistatus').textContent='⚠️ API無回應（port-forward是否開啟？）'; });

  $('nick').addEventListener('keydown', e => { if(e.key==='Enter') joinGame(); });
  $('joinbtn').addEventListener('click', joinGame);

  // chat send — bind once after game screen is shown (not dynamic)
  document.addEventListener('click', e => {
    if (e.target && e.target.id === 'chatsend') sendChat();
  });
  document.addEventListener('keydown', e => {
    if (e.target && e.target.id === 'chatinp' && e.key === 'Enter') sendChat();
  });
});
