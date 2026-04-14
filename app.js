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
  aiPrompt: null,  // AI로 생성한 경우 원본 프롬프트 저장 (변주 시 재사용)
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

  let bpm = t.bpm;
  let name = t.name;
  let aLayers = applyVariation(t.layers, seed, t.variants);
  let bLayers = null;

  if (mixStyleKey && mixStyleKey !== styleKey && window.TEMPLATES[mixStyleKey]) {
    const t2 = window.TEMPLATES[mixStyleKey];
    bpm = Math.round((t.bpm + t2.bpm) / 2);
    name = `${t.name} × ${t2.name}`;
    bLayers = applyVariation(t2.layers, seed, t2.variants);
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

  // 스택 FX 체인
  let fx = `.gain(${volume.toFixed(2)})`;
  if (Math.abs(djFx.tempoMul - 1) > 0.001) fx += `.fast(${djFx.tempoMul.toFixed(2)})`;
  if (djFx.lpf < 19999) fx += `.lpf(${Math.round(djFx.lpf)})`;
  if (djFx.hpf > 20) fx += `.hpf(${Math.round(djFx.hpf)})`;
  if (djFx.reverb > 0) fx += `.room(${djFx.reverb.toFixed(2)})`;
  if (djFx.delay > 0) fx += `.delay(${djFx.delay.toFixed(2)}).delaytime(0.375).delayfeedback(0.5)`;
  if (djFx.shape > 0) fx += `.shape(${djFx.shape.toFixed(2)})`;
  if (djFx.swing > 0.001) fx += `.swingBy(${djFx.swing.toFixed(2)},4)`;

  const code = `// ${name} · ${bpm} BPM\ncps(${(bpm / 60 / 4).toFixed(4)})\n\nstack(\n${body}\n)${fx}`;
  return { code, bpm, name };
}

// ─── 재생/정지 ────────────────────────────────
function setPlayingState(playing) {
  state.playing = playing;
  const playBtn = document.getElementById('playBtn');
  const stopBtn = document.getElementById('stopBtn');
  playBtn.classList.toggle('active', !playing);
  stopBtn.classList.toggle('active', playing);
  playBtn.disabled = playing;
  stopBtn.disabled = !playing;
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

// ─── 생성 ─────────────────────────────────────
function generate(style, { newSeed = true, preserveAi = false } = {}) {
  // preserveAi=true: DJ FX 슬라이더 등이 호출 — AI 코드를 지키기 위해 no-op
  if (preserveAi && state.aiPrompt) return;
  state.currentStyle = style;
  if (!preserveAi) state.aiPrompt = null;
  if (newSeed) state.seed = Math.floor(Math.random() * 1000000);

  const result = renderCode(style, state.mixStyle, state.volume, state.seed, state.djFx);
  if (!result) return;

  document.getElementById('codeEditor').value = result.code;
  document.getElementById('nowPlayingName').textContent = result.name;
  document.getElementById('nowPlayingBpm').textContent = `${result.bpm} BPM`;

  // 탭 + 드롭다운 선택 상태 동기화
  const cat = findCategoryOf(style);
  if (cat) {
    document.querySelectorAll('.cat-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === cat);
    });
    if (document.getElementById('genreSelect').dataset.cat !== cat) {
      populateGenreSelect(cat);
    }
    document.getElementById('genreSelect').value = style;
  }

  updatePresetToggleLabel();

  // 재생 중이면 새 코드로 즉시 재평가 (라이브 코딩 느낌)
  if (state.playing) {
    try { window.evaluate(result.code); } catch (e) { console.error(e); }
  }
}

// ─── 카테고리 탭 + 장르 드롭다운 ──────────────
function findCategoryOf(styleKey) {
  for (const [catKey, cat] of Object.entries(window.CATEGORIES)) {
    if (cat.styles.includes(styleKey)) return catKey;
  }
  return null;
}

function populateGenreSelect(catKey) {
  const sel = document.getElementById('genreSelect');
  const cat = window.CATEGORIES[catKey];
  sel.innerHTML = '';
  sel.dataset.cat = catKey;
  for (const styleKey of cat.styles) {
    const t = window.TEMPLATES[styleKey];
    if (!t) continue;
    const opt = document.createElement('option');
    opt.value = styleKey;
    opt.textContent = t.name;
    sel.appendChild(opt);
  }
}

function buildCategoryTabs() {
  const bar = document.getElementById('categoryTabs');
  bar.innerHTML = '';
  for (const [catKey, cat] of Object.entries(window.CATEGORIES)) {
    const btn = document.createElement('button');
    btn.className = 'cat-tab';
    btn.dataset.cat = catKey;
    btn.textContent = cat.label;
    btn.addEventListener('click', () => {
      populateGenreSelect(catKey);
      const firstStyle = window.CATEGORIES[catKey].styles[0];
      if (firstStyle) generate(firstStyle);
    });
    bar.appendChild(btn);
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

document.getElementById('playBtn').addEventListener('click', playCurrent);
document.getElementById('stopBtn').addEventListener('click', stopCurrent);

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
  generate(state.currentStyle, { newSeed: false, preserveAi: true });
});

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

    document.getElementById('codeEditor').value = data.code;
    const firstLine = data.code.split('\n')[0] || '';
    const nameMatch = firstLine.match(/\/\/\s*(.+?)\s*·\s*(\d+)\s*BPM/);
    if (nameMatch) {
      document.getElementById('nowPlayingName').textContent = nameMatch[1];
      document.getElementById('nowPlayingBpm').textContent = `${nameMatch[2]} BPM`;
    } else {
      document.getElementById('nowPlayingName').textContent = 'AI 생성';
      document.getElementById('nowPlayingBpm').textContent = '- BPM';
    }

    statusEl.textContent = reusePrompt ? '✓ 변주 생성 완료' : '✓ 생성 완료 — ▶ 재생 버튼을 누르세요';
    statusEl.className = 'ai-status ok';
    // 원본 프롬프트만 저장 (변주 힌트는 제외)
    if (!reusePrompt) state.aiPrompt = prompt;
    const presetLabel = document.getElementById('presetToggleLabel');
    if (presetLabel) presetLabel.textContent = '🤖 AI 생성 (🎲 변주로 다른 버전)';

    if (state.playing) {
      try { window.evaluate(data.code); } catch (e) { console.error(e); }
    }
  } catch (err) {
    console.error(err);
    statusEl.textContent = '✗ 생성 실패: ' + err.message;
    statusEl.className = 'ai-status err';
  } finally {
    btn.disabled = false;
  }
}

// ─── 프리셋 토글 ─────────────────────────
function updatePresetToggleLabel() {
  const label = document.getElementById('presetToggleLabel');
  if (!label) return;
  const t = window.TEMPLATES[state.currentStyle];
  label.textContent = t ? `📂 프리셋: ${t.name}` : '📂 프리셋에서 선택';
}
document.getElementById('presetToggle').addEventListener('click', () => {
  const btn = document.getElementById('presetToggle');
  const panel = document.getElementById('presetPanel');
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  panel.hidden = expanded;
});

document.getElementById('aiGenBtn').addEventListener('click', generateFromPrompt);
document.getElementById('aiPrompt').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); generateFromPrompt(); }
});

buildCategoryTabs();
populateGenreSelect('edm');
populateMixSelect();
setPlayingState(false);
generate('ibiza');
