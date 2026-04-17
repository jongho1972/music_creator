// Music Creator — 메인 로직
// - 템플릿 렌더링, 변주, 믹싱
// - 재생/정지 상태, 볼륨, 자동재생
// - 키워드 매칭

const state = {
  currentStyle: 'ibiza',
  mixStyle: null,
  volume: 0.8,
  playing: false,
  seed: 0,
  aiPrompt: null,    // AI로 생성한 경우 원본 프롬프트 저장 (변주 시 재사용)
  djFx: {
    lpf: 20000,      // 로패스 필터 (20000 = full open)
    hpf: 0,          // 하이패스 필터 (0 = off)
    reverb: 0,       // 리버브 wet
    delay: 0,        // 딜레이 wet
    shape: 0,        // 디스토션
    swing: 0,        // 스윙 양 (0~0.3)
    tempoMul: 1.0,   // 템포 배수
    crossfade: 0.5,  // 크로스페이더 (믹스 시 A↔B, 0=A만 / 1=B만)
    sidechain: false,// 사이드체인 펌핑 (멜로디 덕킹)
    drumMute: false,
    melMute: false
  }
};

const DJ_FX_DEFAULT = {
  lpf: 20000, hpf: 0, reverb: 0, delay: 0, shape: 0,
  swing: 0, tempoMul: 1.0, crossfade: 0.5,
  sidechain: false, drumMute: false, melMute: false
};

const DJ_FX_BUILDUP = {
  lpf: 20000, hpf: 500, reverb: 0.5, delay: 0.3, shape: 0.15,
  swing: 0, tempoMul: 1.0, crossfade: 0.5,
  sidechain: false, drumMute: false, melMute: false
};

// ─── 변주 생성 ───────────────────────────────
// 시드에 따라 레이어 순서/선택을 섞어 재클릭 시마다 다른 패턴 생성
function seededPick(arr, seed, count) {
  const pool = [...arr];
  const out = [];
  let s = seed;
  for (let i = 0; i < count && pool.length > 0; i++) {
    s = (s * 9301 + 49297) % 233280;
    const idx = Math.floor((s / 233280) * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

function applyVariation(baseLayers, seed, variants) {
  // variants 배열이 있으면 먼저 시드로 base/variant 중 하나 선택
  let source = baseLayers;
  if (Array.isArray(variants) && variants.length > 0) {
    const pool = [baseLayers, ...variants];
    const idx = Math.abs(seed) % pool.length;
    source = pool[idx];
  }
  const layers = [...source];

  // 시드로 드럼은 유지하고 멜로디 레이어만 섞음
  const drumLayers = layers.filter(l => /sound\("(bd|sd|hh|cp|cr|rim|cb|oh)/.test(l));
  const melodicLayers = layers.filter(l => !/sound\("(bd|sd|hh|cp|cr|rim|cb|oh)/.test(l));

  if (melodicLayers.length <= 2 || seed === 0) {
    return [...drumLayers, ...melodicLayers];
  }

  // 멜로디 레이어 중 일부만 랜덤 선택 (변주)
  const keepCount = Math.max(2, melodicLayers.length - 1);
  const picked = seededPick(melodicLayers, seed, keepCount);
  return [...drumLayers, ...picked];
}

// ─── 코드 렌더링 ──────────────────────────────
const DRUM_RE = /sound\("(bd|sd|hh|cp|cr|rim|cb|oh)/;

function renderCode(styleKey, mixStyleKey, volume, seed, djFx) {
  const t = window.TEMPLATES[styleKey];
  if (!t) return '';

  // AI 템플릿은 Claude가 의도적으로 배치한 순서를 유지
  const effSeed = styleKey.startsWith('__') ? 0 : seed;

  let bpm = t.bpm;
  let name = t.name;
  let aLayers = applyVariation(t.layers, effSeed, t.variants);
  let bLayers = null;

  if (mixStyleKey && mixStyleKey !== styleKey && window.TEMPLATES[mixStyleKey]) {
    const t2 = window.TEMPLATES[mixStyleKey];
    bpm = Math.round((t.bpm + t2.bpm) / 2);
    name = `${t.name} × ${t2.name}`;
    const effSeed2 = mixStyleKey.startsWith('__') ? 0 : seed;
    bLayers = applyVariation(t2.layers, effSeed2, t2.variants);
  }

  // 뮤트 필터
  const muteFilter = (layers) => {
    if (djFx.drumMute) layers = layers.filter(l => !DRUM_RE.test(l));
    if (djFx.melMute) layers = layers.filter(l => DRUM_RE.test(l));
    return layers;
  };
  aLayers = muteFilter(aLayers);
  if (bLayers) bLayers = muteFilter(bLayers);

  // 크로스페이더 (믹스 시) — 등출력 곡선
  let combined;
  if (bLayers) {
    const xf = djFx.crossfade;
    const aG = Math.cos(xf * Math.PI / 2).toFixed(3);
    const bG = Math.sin(xf * Math.PI / 2).toFixed(3);
    combined = [
      ...aLayers.map(l => `${l}.gain(${aG})`),
      ...bLayers.map(l => `${l}.gain(${bG})`)
    ];
  } else {
    combined = aLayers;
  }

  // 사이드체인: 멜로디 레이어만 킥에 맞춰 덕킹
  if (djFx.sidechain) {
    combined = combined.map(l =>
      DRUM_RE.test(l) ? l : `${l}.gain(sine.range(0.35,1).fast(4))`
    );
  }

  if (combined.length === 0) combined = ['silence'];
  const body = combined.map(l => '  ' + l).join(',\n');

  const code = `// ${name} · ${bpm} BPM\ncps(${(bpm / 60 / 4).toFixed(4)})\n\nstack(\n${body}\n)${buildFxChain(volume, djFx)}`;
  return { code, bpm, name };
}

function buildFxChain(volume, djFx) {
  let fx = `.gain(${volume.toFixed(2)})`;
  if (Math.abs(djFx.tempoMul - 1) > 0.001) fx += `.fast(${djFx.tempoMul.toFixed(2)})`;
  if (djFx.lpf < 19999) fx += `.lpf(${Math.round(djFx.lpf)})`;
  if (djFx.hpf > 20) fx += `.hpf(${Math.round(djFx.hpf)})`;
  if (djFx.reverb > 0) fx += `.room(${djFx.reverb.toFixed(2)})`;
  if (djFx.delay > 0) fx += `.delay(${djFx.delay.toFixed(2)}).delaytime(0.375).delayfeedback(0.5)`;
  if (djFx.shape > 0) fx += `.shape(${djFx.shape.toFixed(2)})`;
  if (djFx.swing > 0.001) fx += `.swingBy(${djFx.swing.toFixed(2)},4)`;
  return fx;
}

// AI 코드를 파싱해 { name, bpm, layers } 템플릿으로 변환
// 변환 후 window.TEMPLATES.__ai__ 에 저장하면 기존 renderCode 파이프라인이
// 그대로 적용되어 뮤트/사이드체인/믹스/변주/DJ FX가 모두 작동한다.
function splitTopLevelCommas(s) {
  const out = [];
  let depth = 0, start = 0, inStr = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (c === '\\') { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '(' || c === '[' || c === '{') depth++;
    else if (c === ')' || c === ']' || c === '}') depth--;
    else if (c === ',' && depth === 0) {
      const part = s.slice(start, i).trim();
      if (part) out.push(part);
      start = i + 1;
    }
  }
  const last = s.slice(start).trim();
  if (last) out.push(last);
  return out;
}

function parseAiCode(code) {
  const firstLine = (code.split('\n')[0] || '').trim();
  const m = firstLine.match(/\/\/\s*(.+?)\s*·\s*(\d+)\s*BPM/);
  const name = m ? m[1] : '🤖 AI 생성';
  const bpm = m ? parseInt(m[2], 10) : 120;

  const stackIdx = code.indexOf('stack(');
  if (stackIdx < 0) return null;
  let depth = 0, inStr = null;
  const contentStart = stackIdx + 6;
  let contentEnd = -1;
  for (let i = contentStart - 1; i < code.length; i++) {
    const c = code[i];
    if (inStr) {
      if (c === '\\') { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '(') depth++;
    else if (c === ')') { depth--; if (depth === 0) { contentEnd = i; break; } }
  }
  if (contentEnd < 0) return null;
  const body = code.slice(contentStart, contentEnd);
  const layers = splitTopLevelCommas(body);
  if (layers.length === 0) return null;
  return { name, bpm, layers };
}

// ─── 재생/정지 (단일 토글) ────────────────────
function setPlayingState(playing) {
  state.playing = playing;
  const toggle = document.getElementById('playToggle');
  if (!toggle) return;
  toggle.classList.toggle('playing', playing);
  toggle.textContent = playing ? '⏸' : '▶';
  toggle.setAttribute('aria-label', playing ? '정지' : '재생');
}

function playCurrent() {
  if (!window.__strudelReady) {
    console.warn('Strudel not ready yet');
    return;
  }
  const code = document.getElementById('codeEditor').value;
  if (!code) return;
  try {
    window.evaluate(code);
    setPlayingState(true);
  } catch (e) {
    console.error('evaluate error:', e);
  }
}

function stopCurrent() {
  if (typeof window.hush === 'function') window.hush();
  setPlayingState(false);
}

function togglePlay() {
  if (state.playing) stopCurrent(); else playCurrent();
}

// ─── 생성 ─────────────────────────────────────
function generate(style, { newSeed = true, preserveAi = false } = {}) {
  state.currentStyle = style;
  if (!preserveAi) state.aiPrompt = null;
  if (newSeed) state.seed = Math.floor(Math.random() * 1000000);

  const result = renderCode(style, state.mixStyle, state.volume, state.seed, state.djFx);
  if (!result) return;

  document.getElementById('codeEditor').value = result.code;
  document.getElementById('nowPlayingName').textContent = result.name;
  document.getElementById('nowPlayingBpm').textContent = `${result.bpm} BPM`;

  // 드롭다운 선택 상태 동기화 (내부 AI 키는 드롭다운에 없으므로 무시)
  const sel = document.getElementById('genreSelect');
  if (sel && !style.startsWith('__')) sel.value = style;

  // 재생 중이면 새 코드로 즉시 재평가 (라이브 코딩 느낌)
  if (state.playing) {
    try { window.evaluate(result.code); } catch (e) { console.error(e); }
  }
}

// ─── 장르 드롭다운 ────────────────────────────
function populateGenreSelect() {
  const sel = document.getElementById('genreSelect');
  const cat = window.CATEGORIES.djtop10;
  sel.innerHTML = '';
  for (const styleKey of cat.styles) {
    const t = window.TEMPLATES[styleKey];
    if (!t) continue;
    const opt = document.createElement('option');
    opt.value = styleKey;
    opt.textContent = t.name;
    sel.appendChild(opt);
  }
}

document.getElementById('genreSelect').addEventListener('change', (e) => {
  if (e.target.value) generate(e.target.value);
});

document.getElementById('randomGenreBtn').addEventListener('click', () => {
  const all = Object.keys(window.TEMPLATES);
  const pick = all[Math.floor(Math.random() * all.length)];
  generate(pick);
});

document.getElementById('playToggle').addEventListener('click', togglePlay);

document.getElementById('copyBtn').addEventListener('click', async () => {
  const code = document.getElementById('codeEditor').value;
  if (!code) return;
  await navigator.clipboard.writeText(code);
  const btn = document.getElementById('copyBtn');
  const orig = btn.textContent;
  btn.textContent = '✓ 복사됨';
  setTimeout(() => btn.textContent = orig, 1500);
});

document.getElementById('regenBtn').addEventListener('click', () => {
  if (state.aiPrompt) {
    generateFromPrompt({ reusePrompt: true });
  } else {
    generate(state.currentStyle, { newSeed: true });
  }
});

document.getElementById('volumeSlider').addEventListener('input', (e) => {
  state.volume = parseFloat(e.target.value);
  document.getElementById('volumeValue').textContent = Math.round(state.volume * 100) + '%';
  // 재생 중이면 볼륨 변경만 반영해 재평가
  generate(state.currentStyle, { newSeed: false, preserveAi: true });
});

document.getElementById('mixSelect').addEventListener('change', (e) => {
  state.mixStyle = e.target.value || null;
  updateCrossfaderState();
  generate(state.currentStyle, { newSeed: false, preserveAi: true });
});

// 믹스가 선택되지 않으면 크로스페이더 비활성화 (시각적 비활성 + 슬라이더 disabled)
function updateCrossfaderState() {
  const xf = document.getElementById('xfSlider');
  if (!xf) return;
  const active = !!state.mixStyle;
  xf.disabled = !active;
  const row = xf.closest('.dj-slider');
  if (row) row.classList.toggle('disabled', !active);
}

// 스페이스바 재생/정지
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    e.preventDefault();
    if (state.playing) stopCurrent(); else playCurrent();
  }
});

// 믹스 드롭다운 채우기
function populateMixSelect() {
  const sel = document.getElementById('mixSelect');
  sel.innerHTML = '<option value="">(믹스 없음)</option>';
  for (const [key, t] of Object.entries(window.TEMPLATES)) {
    if (key.startsWith('__')) continue;  // 내부 가상 템플릿 제외
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = t.name;
    sel.appendChild(opt);
  }
}

// ─── DJ 컨트롤 바인딩 ─────────────────────────
function bindDjSlider(id, key, formatter) {
  const el = document.getElementById(id);
  const label = document.getElementById(id + 'Val');
  el.addEventListener('input', () => {
    state.djFx[key] = parseFloat(el.value);
    if (label) label.textContent = formatter(state.djFx[key]);
    generate(state.currentStyle, { newSeed: false, preserveAi: true });
  });
}

bindDjSlider('lpfSlider', 'lpf', v => v >= 19999 ? 'OFF' : Math.round(v) + 'Hz');
bindDjSlider('hpfSlider', 'hpf', v => v <= 20 ? 'OFF' : Math.round(v) + 'Hz');
bindDjSlider('reverbSlider', 'reverb', v => Math.round(v * 100) + '%');
bindDjSlider('delaySlider', 'delay', v => Math.round(v * 100) + '%');
bindDjSlider('shapeSlider', 'shape', v => Math.round(v * 100) + '%');
bindDjSlider('swingSlider', 'swing', v => Math.round(v * 100) + '%');
bindDjSlider('tempoSlider', 'tempoMul', v => v.toFixed(2) + 'x');
bindDjSlider('xfSlider', 'crossfade', v => {
  if (v < 0.5) return 'A ' + Math.round((1 - v * 2) * 100) + '%';
  if (v > 0.5) return 'B ' + Math.round((v * 2 - 1) * 100) + '%';
  return '50/50';
});

document.getElementById('drumMuteBtn').addEventListener('click', () => {
  state.djFx.drumMute = !state.djFx.drumMute;
  document.getElementById('drumMuteBtn').classList.toggle('muted', state.djFx.drumMute);
  generate(state.currentStyle, { newSeed: false, preserveAi: true });
});

document.getElementById('melMuteBtn').addEventListener('click', () => {
  state.djFx.melMute = !state.djFx.melMute;
  document.getElementById('melMuteBtn').classList.toggle('muted', state.djFx.melMute);
  generate(state.currentStyle, { newSeed: false, preserveAi: true });
});

document.getElementById('sidechainBtn').addEventListener('click', () => {
  state.djFx.sidechain = !state.djFx.sidechain;
  document.getElementById('sidechainBtn').classList.toggle('active', state.djFx.sidechain);
  generate(state.currentStyle, { newSeed: false, preserveAi: true });
});

// FX 슬라이더 + 라벨 + 토글 UI 상태를 djFx로부터 복원
function syncDjUI() {
  const fx = state.djFx;
  const setSlider = (id, val, labelFn) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = val;
      const lbl = document.getElementById(id + 'Val');
      if (lbl) lbl.textContent = labelFn(val);
    }
  };
  setSlider('lpfSlider', fx.lpf, v => v >= 19999 ? 'OFF' : Math.round(v) + 'Hz');
  setSlider('hpfSlider', fx.hpf, v => v <= 20 ? 'OFF' : Math.round(v) + 'Hz');
  setSlider('reverbSlider', fx.reverb, v => Math.round(v * 100) + '%');
  setSlider('delaySlider', fx.delay, v => Math.round(v * 100) + '%');
  setSlider('shapeSlider', fx.shape, v => Math.round(v * 100) + '%');
  setSlider('swingSlider', fx.swing, v => Math.round(v * 100) + '%');
  setSlider('tempoSlider', fx.tempoMul, v => v.toFixed(2) + 'x');
  setSlider('xfSlider', fx.crossfade, v => {
    if (v < 0.5) return 'A ' + Math.round((1 - v * 2) * 100) + '%';
    if (v > 0.5) return 'B ' + Math.round((v * 2 - 1) * 100) + '%';
    return '50/50';
  });
  document.getElementById('drumMuteBtn').classList.toggle('muted', fx.drumMute);
  document.getElementById('melMuteBtn').classList.toggle('muted', fx.melMute);
  document.getElementById('sidechainBtn').classList.toggle('active', fx.sidechain);
}

function flashActive(btn) {
  btn.classList.add('active');
  setTimeout(() => btn.classList.remove('active'), 320);
}

document.getElementById('buildBtn').addEventListener('click', (e) => {
  state.djFx = { ...DJ_FX_BUILDUP };
  syncDjUI();
  generate(state.currentStyle, { newSeed: false, preserveAi: true });
  flashActive(e.currentTarget);
});

document.getElementById('dropBtn').addEventListener('click', (e) => {
  // DROP: 리셋 + 일순간 크러시/킥 강조
  state.djFx = { ...DJ_FX_DEFAULT, shape: 0.25 };
  syncDjUI();
  generate(state.currentStyle, { newSeed: true, preserveAi: true });
  flashActive(e.currentTarget);
});

document.getElementById('fxResetBtn').addEventListener('click', () => {
  state.mixStyle = null;
  document.getElementById('mixSelect').value = '';
  state.djFx = { ...DJ_FX_DEFAULT };
  syncDjUI();
  updateCrossfaderState();
  generate(state.currentStyle, { newSeed: false, preserveAi: true });
});

// ─── AI 자연어 → 코드 생성 ─────────────────
async function generateFromPrompt({ reusePrompt = false } = {}) {
  const input = document.getElementById('aiPrompt');
  const btn = document.getElementById('aiGenBtn');
  const statusEl = document.getElementById('aiStatus');

  let prompt;
  if (reusePrompt && state.aiPrompt) {
    // 변주: 저장된 프롬프트에 변주 힌트 덧붙여 Claude가 다른 결과를 내도록 유도
    prompt = `${state.aiPrompt}\n\n(앞서 생성한 것과 다른 멜로디·리듬 변주로 만들어주세요)`;
  } else {
    prompt = input.value.trim();
    if (!prompt) {
      statusEl.textContent = '설명을 입력해 주세요.';
      statusEl.className = 'ai-status err';
      return;
    }
  }

  btn.disabled = true;
  statusEl.textContent = '⏳ AI가 코드를 작성 중입니다...';
  statusEl.className = 'ai-status';

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    if (!data.code) throw new Error('빈 응답');

    const parsed = parseAiCode(data.code);
    if (!parsed) throw new Error('응답 파싱 실패 — Strudel 포맷이 아닙니다');

    // AI 결과를 가상 템플릿으로 주입, 기존 renderCode 파이프라인이 처리
    window.TEMPLATES.__ai__ = parsed;
    state.aiPrompt = reusePrompt ? state.aiPrompt : prompt;
    state.currentStyle = '__ai__';

    // 현재 DJ FX 상태로 렌더 (generate → renderCode 경유)
    generate('__ai__', { newSeed: false, preserveAi: true });

    statusEl.textContent = reusePrompt ? '✓ 변주 생성 완료' : '✓ 생성 완료 — ▶ 재생 버튼을 누르세요';
    statusEl.className = 'ai-status ok';
  } catch (err) {
    console.error(err);
    statusEl.textContent = '✗ 생성 실패: ' + err.message;
    statusEl.className = 'ai-status err';
  } finally {
    btn.disabled = false;
  }
}

document.getElementById('aiGenBtn').addEventListener('click', generateFromPrompt);
document.getElementById('aiPrompt').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); generateFromPrompt(); }
});

populateGenreSelect();
populateMixSelect();
setPlayingState(false);
updateCrossfaderState();
generate('ibiza');

// 배포 일시 표시 (Netlify 빌드 시 deploy-time.txt 생성)
fetch('deploy-time.txt', { cache: 'no-store' })
  .then(r => r.ok ? r.text() : null)
  .then(t => {
    if (!t) return;
    const el = document.getElementById('deploy-time');
    if (el) el.textContent = '최종 배포: ' + t.trim();
  })
  .catch(() => {});
