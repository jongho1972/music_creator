// EDM Creator — 메인 로직
// - 템플릿 렌더링, 변주, 믹싱
// - 재생/정지 상태, 볼륨, 자동재생
// - 키워드 매칭

const state = {
  currentStyle: 'ibiza',
  mixStyle: null,
  volume: 0.8,
  autoplay: true,
  playing: false,
  seed: 0
};

// ─── 키워드 매칭 ─────────────────────────────
function matchStyle(input) {
  const lower = input.toLowerCase().trim();
  if (!lower) return 'ibiza';
  for (const [style, words] of Object.entries(window.KEYWORDS)) {
    if (words.some(w => lower.includes(w.toLowerCase()))) return style;
  }
  return 'ibiza';
}

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
function renderCode(styleKey, mixStyleKey, volume, seed) {
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
    // 드럼은 A에서, 멜로디는 B에서 가져와 섞기
    const aDrums = t.layers.filter(l => /sound\("(bd|sd|hh|cp|cr)/.test(l));
    const bMelodic = t2.layers.filter(l => !/sound\("(bd|sd|hh|cp|cr|rim|cb|oh)/.test(l));
    layers = [...aDrums, ...bMelodic];
  }

  layers = applyVariation(layers, seed);

  const body = layers.map(l => '  ' + l).join(',\n');
  const code = `// ${name} · ${bpm} BPM\ncps(${(bpm / 60 / 4).toFixed(4)})\n\nstack(\n${body}\n).gain(${volume.toFixed(2)})`;
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
function generate(style, { newSeed = true, silent = false, allowAutoplay = true } = {}) {
  state.currentStyle = style;
  if (newSeed) state.seed = Math.floor(Math.random() * 1000000);

  const result = renderCode(style, state.mixStyle, state.volume, state.seed);
  if (!result) return;

  document.getElementById('codeEditor').value = result.code;
  document.getElementById('nowPlayingName').textContent = result.name;
  document.getElementById('nowPlayingBpm').textContent = `${result.bpm} BPM`;

  document.querySelectorAll('.preset').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.style === style);
  });

  if (silent) return;

  // 재생 중이면 새 코드로 즉시 재평가 (자연스러운 라이브 코딩 느낌)
  if (state.playing) {
    try { window.evaluate(result.code); } catch (e) { console.error(e); }
  } else if (allowAutoplay && state.autoplay && window.__strudelReady) {
    playCurrent();
  }
}

// ─── 이벤트 바인딩 ────────────────────────────
document.querySelectorAll('.preset').forEach(btn => {
  btn.addEventListener('click', () => generate(btn.dataset.style, { allowAutoplay: false }));
});

document.getElementById('generateBtn').addEventListener('click', () => {
  const input = document.getElementById('customStyle').value;
  generate(matchStyle(input));
});

document.getElementById('customStyle').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('generateBtn').click();
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

document.getElementById('autoplayToggle').addEventListener('change', (e) => {
  state.autoplay = e.target.checked;
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

populateMixSelect();
setPlayingState(false);
generate('ibiza', { silent: true });
