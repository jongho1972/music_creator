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
  djFx: {
    lpf: 20000,     // 필터 (low-pass, 20000 = full open)
    reverb: 0,      // 리버브 wet
    delay: 0,       // 딜레이 wet
    shape: 0,       // 디스토션
    tempoMul: 1.0,  // 템포 배수
    drumMute: false,
    melMute: false
  }
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

function applyVariation(layers, seed) {
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

  let layers = [...t.layers];
  let bpm = t.bpm;
  let name = t.name;

  // 믹스 적용
  if (mixStyleKey && mixStyleKey !== styleKey && window.TEMPLATES[mixStyleKey]) {
    const t2 = window.TEMPLATES[mixStyleKey];
    bpm = Math.round((t.bpm + t2.bpm) / 2);
    name = `${t.name} + ${t2.name}`;
    const aDrums = t.layers.filter(l => DRUM_RE.test(l));
    const bMelodic = t2.layers.filter(l => !DRUM_RE.test(l));
    layers = [...aDrums, ...bMelodic];
  }

  layers = applyVariation(layers, seed);

  // DJ 뮤트 적용
  if (djFx.drumMute) layers = layers.filter(l => !DRUM_RE.test(l));
  if (djFx.melMute) layers = layers.filter(l => DRUM_RE.test(l));
  if (layers.length === 0) layers = ['silence']; // 방어

  const body = layers.map(l => '  ' + l).join(',\n');

  // FX 체인 조립
  let fx = `.gain(${volume.toFixed(2)})`;
  if (Math.abs(djFx.tempoMul - 1) > 0.001) fx += `.fast(${djFx.tempoMul.toFixed(2)})`;
  if (djFx.lpf < 19999) fx += `.lpf(${Math.round(djFx.lpf)})`;
  if (djFx.reverb > 0) fx += `.room(${djFx.reverb.toFixed(2)})`;
  if (djFx.delay > 0) fx += `.delay(${djFx.delay.toFixed(2)}).delaytime(0.375).delayfeedback(0.5)`;
  if (djFx.shape > 0) fx += `.shape(${djFx.shape.toFixed(2)})`;

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
function generate(style, { newSeed = true } = {}) {
  state.currentStyle = style;
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
  generate(state.currentStyle, { newSeed: true });
});

document.getElementById('volumeSlider').addEventListener('input', (e) => {
  state.volume = parseFloat(e.target.value);
  document.getElementById('volumeValue').textContent = Math.round(state.volume * 100) + '%';
  // 재생 중이면 볼륨 변경만 반영해 재평가
  generate(state.currentStyle, { newSeed: false });
});

document.getElementById('mixSelect').addEventListener('change', (e) => {
  state.mixStyle = e.target.value || null;
  generate(state.currentStyle, { newSeed: false });
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
    generate(state.currentStyle, { newSeed: false });
  });
}

bindDjSlider('lpfSlider', 'lpf', v => v >= 19999 ? 'OFF' : Math.round(v) + 'Hz');
bindDjSlider('reverbSlider', 'reverb', v => Math.round(v * 100) + '%');
bindDjSlider('delaySlider', 'delay', v => Math.round(v * 100) + '%');
bindDjSlider('shapeSlider', 'shape', v => Math.round(v * 100) + '%');
bindDjSlider('tempoSlider', 'tempoMul', v => v.toFixed(2) + 'x');

document.getElementById('drumMuteBtn').addEventListener('click', () => {
  state.djFx.drumMute = !state.djFx.drumMute;
  document.getElementById('drumMuteBtn').classList.toggle('muted', state.djFx.drumMute);
  generate(state.currentStyle, { newSeed: false });
});

document.getElementById('melMuteBtn').addEventListener('click', () => {
  state.djFx.melMute = !state.djFx.melMute;
  document.getElementById('melMuteBtn').classList.toggle('muted', state.djFx.melMute);
  generate(state.currentStyle, { newSeed: false });
});

document.getElementById('fxResetBtn').addEventListener('click', () => {
  state.mixStyle = null;
  document.getElementById('mixSelect').value = '';
  state.djFx = { lpf: 20000, reverb: 0, delay: 0, shape: 0, tempoMul: 1.0, drumMute: false, melMute: false };
  document.getElementById('lpfSlider').value = 20000;
  document.getElementById('reverbSlider').value = 0;
  document.getElementById('delaySlider').value = 0;
  document.getElementById('shapeSlider').value = 0;
  document.getElementById('tempoSlider').value = 1;
  document.getElementById('lpfSliderVal').textContent = 'OFF';
  document.getElementById('reverbSliderVal').textContent = '0%';
  document.getElementById('delaySliderVal').textContent = '0%';
  document.getElementById('shapeSliderVal').textContent = '0%';
  document.getElementById('tempoSliderVal').textContent = '1.00x';
  document.getElementById('drumMuteBtn').classList.remove('muted');
  document.getElementById('melMuteBtn').classList.remove('muted');
  generate(state.currentStyle, { newSeed: false });
});

buildCategoryTabs();
populateGenreSelect('edm');
populateMixSelect();
setPlayingState(false);
generate('ibiza');
