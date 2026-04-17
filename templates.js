// Music Creator — DJ Top 10 (15초 완성 프리셋)
// 각 템플릿은 8-bar phrase 구조로 설계됨:
//   bars 1-2: Intro    — 킥 + 서브 패드
//   bars 3-4: Build    — 햇/클랩 레이어 + 4마디 스네어 롤 필
//   bars 5-7: Drop     — 풀 스택 (베이스 + 리드 + 코드 + 퍼커션)
//   bar   7: Climax    — 더블킥/림 필인으로 드롭 정점
//   bar   8: Outro     — 킥 드롭, 리드/패드만 남아 숨쉬기
// mask("<1 1 1 1 1 1 1 0>") 형태로 각 레이어의 등장/퇴장 타이밍 제어.
// BPM 기준 8 cycles ≈ 11~15초 (128 BPM = 15s, 174 BPM = 11s).
// 드럼 정규식 매칭: bd|sd|hh|cp|cr|rim|cb|oh → 변주 시 드럼 레이어로 보존됨.

window.TEMPLATES = {
  ibiza: {
    name: '🏝️ 이비자 하우스',
    bpm: 128,
    description: 'DJ 15초 · 선셋 하우스 · 펌핑 베이스 · 라틴 퍼커션 훅',
    layers: [
      // Kick: 1-7 → 8에서 breakdown (어택 유지)
      `sound("bd:4*4").mask("<1 1 1 1 1 1 1 0>").gain(1.4).shape(0.4)`,
      // Bar 7 double-kick climax fill
      `sound("bd:4*8").mask("<0 0 0 0 0 0 1 0>").gain(1.1).shape(0.4)`,
      // Clap: build부터
      `sound("~ cp ~ cp").mask("<0 0 1 1 1 1 1 0>").gain(0.9).room(0.25)`,
      // Ghost snare accents (drop 후반, subtle)
      `sound("~ ~ ~ ~ ~ ~ sd ~").mask("<0 0 0 0 0 1 1 0>").gain(0.35).speed(1.3).room(0.3)`,
      // Open hat: offbeat, build 후반
      `sound("~ oh ~ oh").mask("<0 0 0 1 1 1 1 0>").gain(0.45).decay(0.2)`,
      // 16th hats: build부터
      `sound("hh*16").mask("<0 0 1 1 1 1 1 0>").gain("0.35 0.2 0.5 0.2".fast(2)).pan(sine.range(0.3, 0.7).slow(4)).degradeBy(0.1)`,
      // Rimshot polyrhythm (3 against 4) — Latin house 느낌
      `sound("rim*3").mask("<0 0 0 1 1 1 1 0>").gain(0.4).pan(0.65).decay(0.1)`,
      // Cowbell offbeat accent (drop)
      `sound("~ ~ cb ~").mask("<0 0 0 0 1 1 1 0>").gain(0.3).pan(0.35)`,
      // Snare roll fill: bar 4
      `sound("sd*16").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.3, 0.9)).room(0.4)`,
      // Crash on drop: bar 5 downbeat (강화)
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.95).room(0.55)`,
      // Drop impact kick (bar 5 다운비트 부스트)
      `sound("bd:4").struct("1 ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(1.7).shape(0.5)`,
      // Pumping bass: drop (사이드체인 펌핑)
      `note("<a1 a1 a1 [a1 ~ a1] f1 f1 g1 [g1 a1 g1]>").sound("sine").struct("1 1 1 1 1 1 1 1").mask("<0 0 0 0 1 1 1 0>").gain(1.2).attack(0.08).decay(0.12).sustain(0.15).lpf(100)`,
      // Stabby acid: drop
      `note("<a1 a1 f1 g1>").sound("sawtooth").struct("1 1 ~ 1 1 ~ 1 1").mask("<0 0 0 0 1 1 1 0>").lpf(sine.range(300, 900).slow(4)).lpq(12).gain(0.7).decay(0.06).sustain(0.15).shape(0.3)`,
      // Lead arp: drop → outro sustain
      `note("<[a3 c4 e4 a4] [f3 a3 c4 f4] [c3 e3 g3 c4] [g3 b3 d4 g4]>*2").sound("square").mask("<0 0 0 0 1 1 1 1>").decay(0.12).sustain(0).lpf(sine.range(900, 2800).slow(8)).lpq(10).delay(0.3).delaytime(0.375).delayfeedback(0.3).room(0.35).gain(0.35).pan(sine.range(0.2, 0.8).slow(3))`,
      // Sub pad: 상시 (breakdown에서 숨쉬는 공간)
      `note("<a2 f2 c3 g2>").sound("sawtooth").attack(0.3).release(0.4).lpf(sine.range(500, 1400).slow(16)).room(0.5).gain(0.22)`
    ],
    djFx: { lpf: 20000, hpf: 0, reverb: 0.28, delay: 0.12, shape: 0.05, swing: 0.10, tempoMul: 1.0, sidechain: true }
  },

  futurehouse: {
    name: '🚀 퓨처 하우스',
    bpm: 128,
    description: 'DJ 15초 · 덕킹 베이스 · 필터 스윕 훅 · 카우벨 그루브',
    layers: [
      `sound("bd:4*4").mask("<1 1 1 1 1 1 1 0>").gain(1.35).shape(0.4)`,
      // Bar 7 kick variation
      `sound("bd:4 ~ bd:4 bd:4").mask("<0 0 0 0 0 0 1 0>").gain(1.2).shape(0.4)`,
      `sound("~ cp ~ cp").mask("<0 0 1 1 1 1 1 0>").gain(0.85).room(0.3)`,
      `sound("hh*8").mask("<0 0 1 1 1 1 1 0>").gain(0.45)`,
      // Open hat offbeat
      `sound("~ oh ~ oh").mask("<0 0 0 1 1 1 1 0>").gain(0.4).decay(0.15)`,
      // Rimshot snap (offbeat syncopation)
      `sound("~ ~ rim ~ rim ~ ~ rim").mask("<0 0 0 1 1 1 1 0>").gain(0.45).pan(0.6)`,
      // Dirty Dutch cowbell offbeat hook (볼륨 다운 — 귀 피로 해소)
      `sound("~ ~ cb ~ cb ~ ~ cb").mask("<0 0 0 0 1 1 1 0>").gain(0.28).pan(0.4)`,
      `sound("sd*16").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.25, 0.85)).room(0.4)`,
      // Crash drop (강화)
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.9).room(0.55)`,
      // Drop impact kick
      `sound("bd:4").struct("1 ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(1.6).shape(0.5)`,
      // Plucky bass (signature future house — syncopated call&response)
      `note("<a1 a1 f1 g1>").sound("square").struct("1 ~ 1 1 ~ 1 ~ 1").mask("<0 0 0 0 1 1 1 0>").lpf(sine.range(500, 2000).slow(8)).gain(0.85).decay(0.08).sustain(0.15).shape(0.4)`,
      // Chord stabs (중고역 양보)
      `note("<[a3,c4,e4] [f3,a3,c4] [g3,b3,d4] [e3,g3,b3]>*2").sound("sawtooth").mask("<0 0 0 0 1 1 1 1>").attack(0.01).decay(0.15).sustain(0.1).lpf(sine.range(1000, 3500).slow(4)).room(0.25).gain(0.35)`,
      // High lead hook
      `note("<a5 ~ c6 ~ e6 ~ d6 ~>").sound("square").mask("<0 0 0 0 0 1 1 1>").decay(0.18).sustain(0.1).lpf(3500).delay(0.3).delaytime(0.375).delayfeedback(0.3).room(0.35).gain(0.4)`,
      // Sub pad
      `note("<a2 f2 c3 g2>").sound("sawtooth").attack(0.3).release(0.5).lpf(1200).room(0.5).gain(0.2)`
    ],
    djFx: { lpf: 20000, hpf: 30, reverb: 0.20, delay: 0.08, shape: 0.10, swing: 0.06, tempoMul: 1.0, sidechain: true }
  },

  techno: {
    name: '🏭 테크노',
    bpm: 132,
    description: 'DJ 15초 · 인더스트리얼 · 애시드 303 · 림샷 폴리리듬',
    layers: [
      `sound("bd:5*4").mask("<1 1 1 1 1 1 1 0>").gain(1.4).shape(0.5).lpf(150)`,
      // Sub punch (촘촘한 드라이브)
      `note("c1").sound("sine").struct("1 ~ 1 ~").mask("<0 1 1 1 1 1 1 0>").gain(1.1).decay(0.15).sustain(0.2)`,
      // Bar 7 industrial kick fill
      `sound("bd:5*8").mask("<0 0 0 0 0 0 1 0>").gain(1.2).shape(0.5)`,
      `sound("~ cp ~ cp").mask("<0 0 1 1 1 1 1 0>").gain(0.8).room(0.2)`,
      `sound("~ hh:1 ~ hh:1").mask("<0 0 1 1 0 0 0 0>").gain(0.6).decay(0.1)`,
      `sound("hh*16").mask("<0 0 0 1 1 1 1 0>").gain("0.3 0.15 0.4 0.15".fast(2)).pan(sine.range(0.3, 0.7).slow(3)).degradeBy(0.1)`,
      // Open hat offbeat (techno standard)
      `sound("~ oh ~ oh").mask("<0 0 0 1 1 1 1 0>").gain(0.5).decay(0.12)`,
      // Rimshot 16th polyrhythm (metallic industrial)
      `sound("rim*8").mask("<0 0 1 1 1 1 1 0>").gain("0.35 0.15 0.25 0.15".fast(2)).pan(sine.range(0.2, 0.8).slow(5))`,
      // Metallic rim accent (카우벨 대체 — 인더스트리얼 금속성)
      `sound("~ ~ ~ rim:1").mask("<0 0 0 0 1 1 1 0>").gain(0.4).shape(0.3).pan(0.65)`,
      // Ghost snare accent
      `sound("~ ~ sd:1 ~").mask("<0 0 0 0 1 1 1 0>").gain(0.3).speed(1.4).room(0.3)`,
      `sound("sd*16").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.25, 0.85)).room(0.35)`,
      // Crash drop (임팩트 강화)
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.9).room(0.5)`,
      // Drop sub-bomb (bar 5 터지는 맛)
      `note("c0").sound("sine").struct("1 ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(1.6).decay(0.5).sustain(0.6)`,
      // Acid 303 (연결감 강화)
      `note("<c2 c2 eb2 c2 g1 c2 f2 c2>").sound("sawtooth").struct("1 1 1 1 1 1 1 1").mask("<0 0 0 0 1 1 1 0>").lpf(sine.range(200, 1500).slow(8)).lpq(sine.range(5, 20).slow(6)).gain(0.7).decay(0.1).sustain(0.4).shape(0.5)`,
      // Dark stabs (촘촘한 드라이브 패턴)
      `note("<c4 eb4 g4 bb4>").sound("square").struct("1 ~ 1 ~ 1 ~ 1 ~").mask("<0 0 0 0 1 1 1 1>").decay(0.12).sustain(0.1).lpf(2000).lpq(8).delay(0.25).delaytime(0.375).delayfeedback(0.25).gain(0.32)`
    ],
    djFx: { lpf: 20000, hpf: 40, reverb: 0.15, delay: 0.05, shape: 0.18, swing: 0.02, tempoMul: 1.0, sidechain: false }
  },

  uplifting: {
    name: '🌟 업리프팅 트랜스',
    bpm: 138,
    description: 'DJ 15초 · 슈퍼소우 아르페지오 · 감정 빌드업 · 셰이커 그루브',
    layers: [
      `sound("bd:4*4").mask("<1 1 1 1 1 1 1 0>").gain(1.3).shape(0.4)`,
      // Bar 7 double-kick lift
      `sound("bd:4*8").mask("<0 0 0 0 0 0 1 0>").gain(1.15).shape(0.4)`,
      `sound("~ cp ~ cp").mask("<0 0 1 1 1 1 1 0>").gain(0.85).room(0.35)`,
      `sound("hh*8").mask("<0 0 0 1 1 1 1 0>").gain("0.35 0.5".fast(2))`,
      // Open hat long sustain (trance signature)
      `sound("~ oh ~ oh").mask("<0 0 0 0 1 1 1 1>").gain(0.4).decay(0.35).room(0.4)`,
      // Rimshot 16th shaker-like
      `sound("rim*8").mask("<0 0 1 1 1 1 1 0>").gain("0.3 0.2".fast(2)).pan(sine.range(0.3, 0.7).slow(4))`,
      // Ghost snare build
      `sound("~ ~ sd ~").mask("<0 0 0 0 0 1 1 0>").gain(0.3).speed(1.5).room(0.4)`,
      // 2-bar snare roll (trance signature build)
      `sound("sd*16").mask("<0 0 1 1 0 0 0 0>").gain(saw.range(0.1, 1.0).slow(2)).room(0.5)`,
      // Crash drop (감정 터지는 순간)
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(1.0).room(0.7)`,
      // Build riser (bar 4 감정 빌드업 보강)
      `sound("cr:1").struct("1 ~ ~ ~").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.1, 0.7)).shape(0.15).room(0.6)`,
      // Offbeat saw bass (outro까지 연장, 8박 숨쉬기)
      `note("a1").sound("sawtooth").struct("~ 1 ~ 1 ~ 1 ~ 1").mask("<0 0 0 0 1 1 1 1>").gain(0.9).decay(0.08).sustain(0.15).shape(0.3)`,
      // Supersaw arpeggio (signature)
      `note("<a4 c5 e5 a5 g5 e5 c5 a4>*2").sound("sawtooth").mask("<0 0 0 0 1 1 1 1>").decay(0.15).sustain(0.15).lpf(3500).delay(0.25).delaytime(0.375).delayfeedback(0.3).room(0.3).gain(0.5)`,
      // Chord pad (always on — emotional bed)
      `note("<[a3,c4,e4] [f3,a3,c4] [g3,b3,d4] [e3,g3,b3]>").sound("sawtooth").attack(0.25).release(0.5).lpf(2000).room(0.5).gain(0.3)`
    ],
    djFx: { lpf: 20000, hpf: 0, reverb: 0.35, delay: 0.18, shape: 0.03, swing: 0.04, tempoMul: 1.0, sidechain: true }
  },

  psytrance: {
    name: '🌀 사이키트랜스',
    bpm: 145,
    description: 'DJ 13초 · 16분 베이스 · 트라이벌 폴리리듬 · 트위스티 리드',
    layers: [
      `sound("bd:6*4").mask("<1 1 1 1 1 1 1 0>").gain(1.3).shape(0.3).lpf(120)`,
      // Bar 7 tribal kick burst
      `sound("bd:6*8").mask("<0 0 0 0 0 0 1 0>").gain(1.15).shape(0.3)`,
      // Clap minimal (psy에선 최소화, build만)
      `sound("~ cp ~ cp").mask("<0 0 1 1 0 0 0 0>").gain(0.7).room(0.2)`,
      `sound("hh*16").mask("<0 0 1 1 1 1 1 0>").gain("0.3 0.2 0.4 0.2".fast(2)).degradeBy(0.1)`,
      // Tribal rimshot polyrhythm (3 against 4)
      `sound("rim*3").mask("<0 0 1 1 1 1 1 0>").gain(0.45).pan(sine.range(0.25, 0.75).slow(5)).decay(0.1)`,
      // Cowbell tribal
      `sound("~ cb ~ cb").mask("<0 0 0 0 1 1 1 0>").gain(0.35).pan(0.3)`,
      // Open hat breaks
      `sound("oh ~ ~ ~").mask("<0 0 0 1 1 1 1 0>").gain(0.4).decay(0.15)`,
      // 3박 백비트 앵커 (clap 축소 대체 그루브)
      `sound("~ ~ sd ~").mask("<0 0 0 0 1 1 1 0>").gain(0.4).speed(1.3).room(0.3)`,
      `sound("sd*16").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.25, 0.85)).room(0.35)`,
      // Crash drop (강화)
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.9).room(0.5)`,
      // 16분 off-kick 타이트 덕킹 베이스 (psy 핵심)
      `note("a1").sound("sawtooth").struct("~ 1 1 1").mask("<0 0 0 0 1 1 1 0>").lpf(sine.range(400, 1800).slow(8)).lpq(18).gain(1.0).attack(0.005).decay(0.06).sustain(0.1).shape(0.4)`,
      // Catchy psy hook (반복되는 4-note motif + 트위스티 변주)
      `note("<[a4 e4 a4 c5] [a4 e4 a4 c5] [g4 e4 a3 c4] [a4 e4 a4 c5]>*2").sound("square").mask("<0 0 0 0 1 1 1 1>").decay(0.1).sustain(0).lpf(sine.range(1200, 4000).slow(8)).lpq(15).delay(0.35).delaytime(0.375).delayfeedback(0.35).room(0.3).gain(0.42)`
    ],
    djFx: { lpf: 20000, hpf: 25, reverb: 0.25, delay: 0.22, shape: 0.10, swing: 0.0, tempoMul: 1.0, sidechain: true }
  },

  hardstyle: {
    name: '🏛️ 하드스타일',
    bpm: 150,
    description: 'DJ 13초 · 디스토션 킥 · 리버스 베이스 · 하드 림샷',
    layers: [
      `sound("bd:4*4").mask("<1 1 1 1 1 1 1 0>").gain(1.5).shape(0.7).lpf(150)`,
      // Bar 7 distorted double-kick
      `sound("bd:4*8").mask("<0 0 0 0 0 0 1 0>").gain(1.3).shape(0.7)`,
      `sound("~ cp ~ cp").mask("<0 0 1 1 1 1 1 0>").gain(1.0).room(0.3).shape(0.2)`,
      `sound("hh*16").mask("<0 0 0 1 1 1 1 0>").gain(0.28).degradeBy(0.1)`,
      // Hard rimshot accents (oh offbeat와 과포화 방지 gain 축소)
      `sound("~ ~ rim ~").mask("<0 0 1 1 1 1 1 0>").gain(0.4).shape(0.3).pan(0.6)`,
      // Offbeat open hat (hardstyle 핵심)
      `sound("~ oh ~ oh").mask("<0 0 0 1 1 1 1 0>").gain(0.6).decay(0.1)`,
      // Extra crash on climax
      `sound("cr").struct("1 ~ 1 ~").mask("<0 0 0 0 0 0 1 0>").gain(0.55).room(0.4)`,
      `sound("sd*16").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.3, 0.95)).shape(0.3).room(0.3)`,
      // Crash drop (임팩트 강화)
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.95).room(0.45)`,
      // Bar 6 mini-break (숨쉬는 공간 — 질림 방지): 베이스 일시 정지 처리
      // Screech bass (offbeat — 킥과 엇박, hardstyle 필수, bar 6 skip)
      `note("<f1 f1 f1 f1 g1 g1 a1 g1>").sound("sawtooth").struct("~ 1 ~ 1 ~ 1 ~ 1").mask("<0 0 0 0 1 0 1 0>").lpf(sine.range(200, 1500).slow(4)).lpq(15).gain(0.9).decay(0.06).sustain(0.15).shape(0.5)`,
      // Epic lead (drop → outro sustain)
      `note("<f4 ~ ab4 ~ c5 ~ bb4 ~>").sound("sawtooth").mask("<0 0 0 0 1 1 1 1>").decay(0.22).sustain(0.15).lpf(2500).lpq(5).delay(0.3).delaytime(0.375).delayfeedback(0.3).room(0.3).gain(0.5)`,
      // Dark pad
      `note("<[f3,ab3,c4] [g3,bb3,d4]>").sound("sawtooth").attack(0.3).release(0.6).lpf(1500).room(0.5).gain(0.28)`
    ],
    djFx: { lpf: 20000, hpf: 30, reverb: 0.18, delay: 0.05, shape: 0.30, swing: 0.0, tempoMul: 1.0, sidechain: false }
  },

  dnb: {
    name: '⚡ 드럼앤베이스',
    bpm: 174,
    description: 'DJ 11초 · 빠른 브레이크 · 리스 베이스 · 고스트 스네어 롤',
    layers: [
      // DnB standard two-step kick: 1박·3.5박
      `sound("bd ~ ~ ~ ~ bd ~ ~").mask("<1 1 1 1 1 1 1 0>").gain(1.3).shape(0.3)`,
      // DnB standard snare: 2박·4박 백비트
      `sound("~ ~ sd ~ ~ ~ sd ~").mask("<0 0 1 1 1 1 1 0>").gain(1.0).room(0.2)`,
      // Ghost snare chops (Amen feel)
      `sound("~ sd:1 ~ sd ~ ~ sd ~").mask("<0 0 0 0 1 1 1 0>").gain(0.4).speed(1.2).room(0.25)`,
      // Hi-hat with stronger accent dynamics
      `sound("hh*16").mask("<0 0 1 1 1 1 1 0>").gain("0.55 0.15 0.35 0.2".fast(2)).pan(sine.range(0.2, 0.8).slow(3)).degradeBy(0.2)`,
      // Rimshot variation (breakbeat accent)
      `sound("rim ~ ~ rim ~ rim ~ ~").mask("<0 0 1 1 1 1 1 0>").gain(0.45).pan(0.65)`,
      // Ride-style offbeat open hat (2·4박)
      `sound("~ oh ~ oh").mask("<0 0 0 0 1 1 1 0>").gain(0.45).decay(0.15)`,
      // Cowbell accent
      `sound("cb ~ ~ ~").mask("<0 0 0 0 1 1 1 0>").gain(0.3).pan(0.35)`,
      `sound("sd*16").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.3, 0.9)).room(0.4)`,
      // Crash drop (강화)
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.9).room(0.55)`,
      // Reese bass (전면 배치 — 무게감 강화)
      `note("<d1 d1 a1 d1 f1 d1 c2 d1>").sound("sawtooth").struct("1 ~ ~ 1 ~ ~ 1 ~").mask("<0 0 0 0 1 1 1 0>").lpf(sine.range(200, 800).slow(2)).lpq(15).gain(1.5).decay(0.22).sustain(0.4).shape(0.7)`,
      // Chord stabs
      `note("<[d3 f3 a3] [c3 f3 a3] [bb2 d3 f3] [a2 c3 e3]>").sound("square").mask("<0 0 0 0 1 1 1 1>").decay(0.12).sustain(0).lpf(1500).room(0.25).delay(0.2).delaytime(0.25).delayfeedback(0.25).gain(0.4)`,
      // Sub pad
      `note("<d2 c2 bb1 a1>").sound("sawtooth").attack(0.4).release(0.5).lpf(800).room(0.5).gain(0.22)`
    ],
    djFx: { lpf: 20000, hpf: 35, reverb: 0.18, delay: 0.08, shape: 0.15, swing: 0.02, tempoMul: 1.0, sidechain: false }
  },

  jungle: {
    name: '🌴 정글',
    bpm: 170,
    description: 'DJ 11초 · 아멘 브레이크 · 서브베이스 · 팀발레스 퍼커션',
    layers: [
      // Jungle kick: syncopated + sub-punch 강조
      `sound("bd ~ bd ~ ~ bd ~ ~").mask("<1 1 1 1 1 1 1 0>").gain(1.25).shape(0.5).lpf(200)`,
      // Amen break choppy snare (16th 불규칙 + speed 변조)
      `sound("~ sd:1 ~ sd ~ sd:2 sd ~").mask("<0 0 1 1 1 1 1 0>").gain(1.0).speed("1 1.2 1 1.4").room(0.25)`,
      // Extra Amen chop (bar 7 전용, 메인 choppy와 충돌 방지)
      `sound("~ ~ sd:2 ~").mask("<0 0 0 0 0 0 1 0>").gain(0.45).speed(1.3).room(0.3)`,
      `sound("hh*16").mask("<0 0 1 1 1 1 1 0>").gain("0.35 0.15".fast(4)).degradeBy(0.25)`,
      // Timbales feel (rim polyrhythm)
      `sound("rim*6").mask("<0 0 0 1 1 1 1 0>").gain(0.45).pan(sine.range(0.3, 0.7).slow(4)).decay(0.1)`,
      // Latin cowbell
      `sound("~ ~ cb ~").mask("<0 0 0 0 1 1 1 0>").gain(0.4).pan(0.4)`,
      // Open hat shuffle
      `sound("oh ~ oh ~").mask("<0 0 0 0 1 1 1 0>").gain(0.4).decay(0.12)`,
      `sound("sd*16").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.3, 0.9)).room(0.35)`,
      // Crash drop (강화)
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.9).room(0.5)`,
      // Sub bass (전면 배치 — 드롭 무게감)
      `note("<e1 e1 g1 e1 a1 e1 d1 e1>").sound("sine").mask("<0 0 0 0 1 1 1 0>").gain(1.5).decay(0.25).sustain(0.5).lpf(180)`,
      // Offbeat stabs (공간감 추가)
      `note("<[e3,g3,b3] [a3,c4,e4]>").sound("sawtooth").struct("~ 1 ~ 1").mask("<0 0 0 0 1 1 1 1>").decay(0.1).sustain(0).lpf(1500).delay(0.35).delayfeedback(0.35).room(0.35).gain(0.38)`,
      // Pad
      `note("<e2 a1 g1 d2>").sound("sawtooth").attack(0.3).release(0.5).lpf(900).room(0.45).gain(0.2)`
    ],
    djFx: { lpf: 20000, hpf: 40, reverb: 0.22, delay: 0.10, shape: 0.12, swing: 0.06, tempoMul: 1.0, sidechain: false }
  },

  trap: {
    name: '🔥 트랩',
    bpm: 140,
    description: 'DJ 14초 · 808 베이스 · 트리플렛 하이햇 · 림샷 스낵',
    layers: [
      `sound("bd:7").struct("1 ~ ~ 1 ~ ~ 1 ~").mask("<1 1 1 1 1 1 1 0>").gain(1.3).shape(0.3)`,
      `sound("~ ~ ~ ~ cp ~ ~ ~").mask("<0 0 1 1 1 1 1 0>").gain(1.0).room(0.2)`,
      // Bar 7 double-tap clap (3박+3.5박, 모던 트랩 시그니처)
      `sound("~ ~ ~ ~ cp cp ~ ~").mask("<0 0 0 0 0 0 1 0>").gain(0.7).room(0.2)`,
      `sound("hh*16").mask("<0 0 1 1 1 1 1 0>").gain("0.4 0.2 0.5 0.2 0.4 0.6 0.3 0.2".fast(2)).pan(sine.range(0.4, 0.6).slow(2))`,
      // Triplet hihat (trap signature)
      `sound("hh*12").mask("<0 0 0 0 1 1 1 0>").gain("0.5 0.3 0.4".fast(2)).pan(0.55)`,
      // Hihat roll fill on bar 4
      `sound("hh*32").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.3, 0.7)).decay(0.05)`,
      `sound("hh:1 ~ ~ ~ ~ ~ hh:1 ~").mask("<0 0 0 0 1 1 1 0>").gain(0.5).decay(0.08)`,
      // Rimshot snack
      `sound("rim ~ ~ rim").mask("<0 0 1 1 1 1 1 0>").gain(0.45).pan(0.65).decay(0.08)`,
      // Open hat accent
      `sound("~ ~ ~ ~ oh ~ ~ ~").mask("<0 0 0 1 1 1 1 0>").gain(0.4).decay(0.2)`,
      // Crash drop (강화)
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.9).room(0.55)`,
      // 808 sub with skip + glide attack (모던 트랩 슬라이드)
      `note("<f1 f1 ab1 f1 eb1 f1 c2 f1>").sound("sine").struct("1 ~ ~ 1 ~ 1 ~ 1").mask("<0 0 0 0 1 1 1 0>").gain(1.4).attack(0.005).decay(0.25).sustain(0.4).lpf(120)`,
      // Dark lead (살짝 밝게 — lpf 1800 → 2600으로 분위기 풀기)
      `note("<f4 ab4 c5 bb4 ab4 f4 eb4 c4>").sound("square").mask("<0 0 0 0 1 1 1 1>").decay(0.22).sustain(0.1).lpf(2600).lpq(5).delay(0.25).delaytime(0.375).delayfeedback(0.3).room(0.35).gain(0.4)`,
      // Outro bright bell (분위기 전환 — 마지막 1초 희망감)
      `note("<ab5 c6 eb6 ab5>").sound("triangle").mask("<0 0 0 0 0 0 0 1>").decay(0.3).sustain(0.2).room(0.5).delay(0.3).delaytime(0.25).gain(0.35)`,
      // Low pad
      `note("<f2 eb2 db2 c2>").sound("sawtooth").attack(0.3).release(0.5).lpf(600).room(0.5).gain(0.28)`
    ],
    djFx: { lpf: 20000, hpf: 35, reverb: 0.25, delay: 0.10, shape: 0.06, swing: 0.0, tempoMul: 1.0, sidechain: false }
  },

  kpop: {
    name: '🎶 K-pop',
    bpm: 128,
    description: 'DJ 15초 · 4-on-floor + EDM 드롭 · 캐치 훅 · 핑거 스냅',
    layers: [
      `sound("bd:4*4").mask("<1 1 1 1 1 1 1 0>").gain(1.3).shape(0.3).lpf(150)`,
      // Bar 7 kick lift
      `sound("bd:4*8").mask("<0 0 0 0 0 0 1 0>").gain(1.1).shape(0.3)`,
      `sound("~ cp ~ cp").mask("<0 0 1 1 1 1 1 0>").gain(0.9).room(0.25)`,
      // 2-step ghost clap syncopation (drop만 — 볼륨 다운으로 레이어 정리)
      `sound("~ ~ ~ ~ ~ cp:1 ~ cp").mask("<0 0 0 0 1 1 1 0>").gain(0.28).room(0.3).pan(0.55)`,
      `sound("~ hh:1 ~ hh:1").mask("<0 0 1 1 1 1 1 0>").gain(0.55)`,
      `sound("hh*16").mask("<0 0 0 1 1 1 1 0>").gain("0.3 0.2 0.5 0.2".fast(2)).degradeBy(0.1)`,
      // Open hat offbeat (볼륨 다운 — 드롭 공간 확보)
      `sound("oh ~ oh ~").mask("<0 0 0 1 1 1 1 0>").gain(0.32).decay(0.15)`,
      // Finger-snap-like rim snack
      `sound("~ ~ rim ~").mask("<0 0 1 1 1 1 1 0>").gain(0.38).pan(0.6).decay(0.08)`,
      // Cowbell hook (4박 — rim과 겹침 방지)
      `sound("~ ~ ~ cb").mask("<0 0 0 0 1 1 1 0>").gain(0.35).pan(0.4)`,
      // Ghost snare accent
      `sound("~ ~ ~ ~ ~ sd ~ ~").mask("<0 0 0 0 0 1 1 0>").gain(0.35).speed(1.3).room(0.3)`,
      `sound("sd*16").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.3, 0.9)).room(0.4)`,
      // Crash drop (강화 — EDM 드롭 임팩트)
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(1.0).room(0.6)`,
      // Bass stab (간결화 — 리드 공간 확보)
      `note("<a1 a1 f1 g1>").sound("sawtooth").struct("1 ~ ~ 1 ~ 1 ~ ~").mask("<0 0 0 0 1 1 1 0>").lpf(sine.range(400, 1200).slow(4)).lpq(10).gain(0.9).decay(0.06).sustain(0.15).shape(0.3)`,
      // Catch hook lead
      `note("<a4 c5 e5 a5 g5 e5 c5 a4>*2").sound("square").mask("<0 0 0 0 1 1 1 1>").decay(0.15).sustain(0.15).lpf(2500).lpq(5).delay(0.22).delaytime(0.25).delayfeedback(0.25).room(0.3).gain(0.5)`,
      // Emotional chord pad
      `note("<[a3,c4,e4] [f3,a3,c4] [g3,b3,d4] [e3,g3,b3]>").sound("sawtooth").attack(0.2).release(0.4).lpf(1500).room(0.4).gain(0.28)`
    ],
    djFx: { lpf: 20000, hpf: 20, reverb: 0.22, delay: 0.10, shape: 0.05, swing: 0.05, tempoMul: 1.0, sidechain: true }
  }
};

// 단일 카테고리 (DJ Top 10)
window.CATEGORIES = {
  djtop10: {
    label: '🎧 DJ Top 10',
    styles: ['ibiza', 'futurehouse', 'techno', 'uplifting', 'psytrance', 'hardstyle', 'dnb', 'jungle', 'trap', 'kpop']
  }
};
