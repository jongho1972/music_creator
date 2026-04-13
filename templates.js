// Music Creator — 장르별 Strudel 템플릿 (web 런타임 호환)
// 각 템플릿: { name, bpm, description, layers: [pattern string, ...] }
// layers는 stack()에 들어갈 개별 패턴 식. app.js가 이를 조합해 실행 가능한 코드로 변환.

window.TEMPLATES = {
  ibiza: {
    name: '🏝️ 이비자 하우스',
    bpm: 128,
    description: '선셋 하우스 · 4-on-floor + 펌핑 베이스',
    layers: [
      `sound("bd:4*4").gain(1.4).shape(0.4).lpf(120)`,
      `sound("~ cp ~ cp").gain(0.9).room(0.25).shape(0.2)`,
      `sound("~ hh:1 ~ hh:1").gain(0.55).decay(0.15)`,
      `sound("hh*16").gain("0.35 0.2 0.5 0.2".fast(2)).pan(sine.range(0.3, 0.7).slow(4)).degradeBy(0.15)`,
      `note("<a1 a1 a1 [a1 ~ a1] f1 f1 g1 [g1 a1 g1]>").sound("sine").struct("1 ~ ~ ~ 1 ~ ~ ~").gain(1.2).decay(0.3).sustain(0.8).lpf(100)`,
      `note("<a1 a1 f1 g1>").sound("sawtooth").struct("1 1 ~ 1 1 ~ 1 1").lpf(sine.range(300, 900).slow(4)).lpq(12).gain(0.7).decay(0.08).sustain(0.4).shape(0.3)`,
      `note("<[a3 c4 e4 a4] [f3 a3 c4 f4] [c3 e3 g3 c4] [g3 b3 d4 g4]>*2").sound("square").decay(0.2).sustain(0).lpf(sine.range(900, 2800).slow(8)).lpq(10).delay(0.4).delaytime(0.375).delayfeedback(0.5).room(0.5).gain(0.35).pan(sine.range(0.2, 0.8).slow(3))`,
      `note("<a2 f2 c3 g2>").sound("sawtooth").attack(0.5).release(1).lpf(sine.range(500, 1400).slow(16)).room(0.8).gain(0.25)`
    ]
  },

  techno: {
    name: '🏭 테크노',
    bpm: 132,
    description: '인더스트리얼 · 애시드 303 베이스',
    layers: [
      `sound("bd:5*4").gain(1.4).shape(0.5).lpf(150)`,
      `note("c1").sound("sine").struct("1 ~ ~ ~").gain(1.1).decay(0.2)`,
      `note("<c2 c2 eb2 c2 g1 c2 f2 c2>").sound("sawtooth").struct("1 1 1 1 1 1 1 1").lpf(sine.range(200, 1500).slow(8)).lpq(sine.range(5, 20).slow(6)).gain(0.7).decay(0.08).sustain(0.2).shape(0.5)`,
      `sound("~ cp ~ cp").gain(0.8).room(0.2)`,
      `sound("~ hh:1 ~ hh:1").gain(0.6).decay(0.1)`,
      `sound("hh*16").gain("0.3 0.15 0.4 0.15".fast(2)).pan(sine.range(0.3, 0.7).slow(3)).degradeBy(0.1)`,
      `note("<c4 eb4 g4 bb4>").sound("square").decay(0.3).sustain(0).lpf(2000).lpq(8).delay(0.3).delaytime(0.375).gain(0.3)`
    ]
  },

  dnb: {
    name: '⚡ 드럼앤베이스',
    bpm: 174,
    description: '빠른 브레이크 · 리스베이스',
    layers: [
      `sound("bd ~ ~ bd ~ ~ bd ~").gain(1.3).shape(0.3)`,
      `sound("~ ~ sd ~ ~ sd ~ ~").gain(1.0).room(0.2)`,
      `note("<d1 d1 a1 d1 f1 d1 c2 d1>").sound("sawtooth").struct("1 ~ ~ ~ 1 ~ ~ ~").lpf(sine.range(200, 800).slow(2)).lpq(15).gain(1.2).decay(0.4).sustain(0.6).shape(0.6)`,
      `sound("hh*16").gain("0.4 0.2 0.3 0.2".fast(2)).pan(sine.range(0.2, 0.8).slow(3)).degradeBy(0.2)`,
      `sound("~ ~ ~ ~ ~ ~ hh:1 ~").gain(0.5).decay(0.08)`,
      `note("<[d3 f3 a3] [c3 f3 a3] [bb2 d3 f3] [a2 c3 e3]>").sound("square").decay(0.15).sustain(0).lpf(1500).room(0.4).delay(0.3).delaytime(0.25).gain(0.4)`,
      `note("<d2 c2 bb1 a1>").sound("sawtooth").attack(0.8).release(1).lpf(800).room(0.7).gain(0.25)`
    ]
  },

  lofi: {
    name: '☕ 로파이',
    bpm: 85,
    description: '칠 · 재즈 코드 · 먹먹한 드럼',
    layers: [
      `sound("bd:2 ~ ~ bd:2 ~ ~ bd:2 ~").gain(0.9).lpf(300)`,
      `sound("~ ~ sd:3 ~ ~ ~ sd:3 ~").gain(0.7).lpf(2000).room(0.3)`,
      `sound("hh*8").gain(0.4).pan(sine.range(0.4, 0.6).slow(4)).degradeBy(0.3).lpf(5000)`,
      `note("<[c3,e3,g3,b3] [a2,c3,e3,g3] [f2,a2,c3,e3] [g2,b2,d3,f3]>").sound("sawtooth").attack(0.2).release(0.8).lpf(1200).gain(0.35).room(0.6)`,
      `note("<c2 a1 f1 g1>").sound("sine").attack(0.05).decay(0.2).sustain(0.6).gain(0.7).lpf(400)`
    ]
  },

  trap: {
    name: '🔥 트랩',
    bpm: 140,
    description: '808 베이스 · 하프타임 스네어 · 하이햇 롤',
    layers: [
      `sound("bd:7").struct("1 ~ ~ 1 ~ ~ 1 ~").gain(1.3).shape(0.3)`,
      `note("<f1 f1 ab1 f1 eb1 f1 c2 f1>").sound("sine").struct("1 ~ ~ 1 ~ ~ 1 ~").gain(1.4).attack(0.01).decay(0.6).sustain(0.8).lpf(120)`,
      `sound("~ ~ ~ ~ cp ~ ~ ~").gain(1.0).room(0.2)`,
      `sound("hh*16").gain("0.4 0.2 0.5 0.2 0.4 0.6 0.3 0.2".fast(2)).pan(sine.range(0.4, 0.6).slow(2))`,
      `sound("hh:1 ~ ~ ~ ~ ~ hh:1 ~").gain(0.5).decay(0.08)`,
      `note("<f4 ab4 c5 bb4 ab4 f4 eb4 c4>").sound("square").decay(0.4).sustain(0.2).lpf(1800).lpq(5).delay(0.3).delaytime(0.375).delayfeedback(0.4).room(0.6).gain(0.4)`,
      `note("<f2 eb2 db2 c2>").sound("sawtooth").attack(0.6).release(1).lpf(600).room(0.8).gain(0.3)`
    ]
  },

  trance: {
    name: '🌌 트랜스',
    bpm: 138,
    description: '에픽 아르페지오 · 슈퍼쏘 리드',
    layers: [
      `sound("bd:4*4").gain(1.3).shape(0.4).lpf(130)`,
      `note("a1").sound("sine").struct("1 ~ ~ ~").gain(1.1).decay(0.2)`,
      `note("a1").sound("sawtooth").struct("~ 1 1 1").lpf(500).lpq(8).gain(0.7).decay(0.1).sustain(0.3).shape(0.3)`,
      `sound("~ cp ~ cp").gain(0.8).room(0.3)`,
      `sound("~ hh:1 ~ hh:1").gain(0.55)`,
      `sound("hh*16").gain(0.3).degradeBy(0.1)`,
      `note("<[a3 c4 e4 a4 e4 c4] [f3 a3 c4 f4 c4 a3] [g3 b3 d4 g4 d4 b3] [e3 g3 b3 e4 b3 g3]>*2").sound("sawtooth").decay(0.15).sustain(0).lpf(sine.range(1000, 4000).slow(16)).lpq(15).delay(0.5).delaytime(0.375).delayfeedback(0.6).room(0.6).gain(0.45).pan(sine.range(0.2, 0.8).slow(2))`,
      `note("<a4 ~ e4 ~ c5 ~ b4 ~>").sound("sawtooth").decay(0.5).sustain(0.5).lpf(sine.range(1500, 5000).slow(32)).lpq(8).delay(0.4).delaytime(0.375).delayfeedback(0.5).room(0.7).gain(0.4)`,
      `note("<[a2,c3,e3] [f2,a2,c3] [g2,b2,d3] [e2,g2,b2]>").sound("sawtooth").attack(1).release(2).lpf(sine.range(800, 2500).slow(16)).room(0.9).gain(0.3)`
    ]
  },

  ambient: {
    name: '🌊 앰비언트',
    bpm: 100,
    description: '몽환적 아르페지오 · 긴 리버브',
    layers: [
      `sound("bd:2 ~ ~ ~ bd:2 ~ ~ ~").gain(0.7).lpf(200)`,
      `note("<a3 c4 e4 a4 g4 e4 c4 e4 f3 a3 c4 f4 e4 c4 a3 c4>*2").sound("sawtooth").attack(0.01).decay(0.3).sustain(0.2).lpf(sine.range(800, 3000).slow(8)).lpq(8).delay(0.5).delaytime(0.375).delayfeedback(0.6).room(0.7).gain(0.45).pan(sine.range(0.3, 0.7).slow(4))`,
      `note("<[a2,c3,e3] [f2,a2,c3] [g2,b2,d3] [e2,g2,b2]>").sound("sawtooth").attack(1).release(2).lpf(1200).room(0.9).gain(0.35)`,
      `note("<a1 a1 f1 g1>").sound("sine").struct("1 ~ ~ ~").gain(0.9).lpf(200)`,
      `note("<a4 ~ c5 ~ e5 ~ d5 ~>").sound("square").attack(0.05).decay(0.4).sustain(0.3).lpf(2000).lpq(5).delay(0.6).delaytime(0.375).delayfeedback(0.5).room(0.6).gain(0.35)`
    ]
  },

  synthwave: {
    name: '🌃 신스웨이브 80s',
    bpm: 100,
    description: '레트로 80s · 아르페지오 베이스 · 게이티드 스네어',
    layers: [
      `sound("bd:3*4").gain(1.2).lpf(200)`,
      `sound("~ sd:2 ~ sd:2").gain(0.8).room(0.7)`,
      `sound("hh*8").gain(0.4).decay(0.1)`,
      `note("<[a2 e3 a3 e3] [f2 c3 f3 c3] [g2 d3 g3 d3] [e2 b2 e3 b2]>*2").sound("sawtooth").attack(0.005).decay(0.1).sustain(0.3).lpf(sine.range(400, 1500).slow(8)).lpq(8).gain(0.7).shape(0.2)`,
      `note("<a4 ~ c5 e5 ~ d5 b4 ~>").sound("sawtooth").attack(0.02).decay(0.5).sustain(0.4).lpf(3000).lpq(5).delay(0.4).delaytime(0.375).delayfeedback(0.5).room(0.6).gain(0.45)`,
      `note("<[a2,c3,e3] [f2,a2,c3] [g2,b2,d3] [e2,g2,b2]>").sound("sawtooth").attack(0.5).release(1).lpf(1200).room(0.8).gain(0.25)`
    ]
  },

  deephouse: {
    name: '🎹 딥하우스',
    bpm: 120,
    description: '시카고 딥하우스 · 재즈 코드 · 따뜻한 패드',
    layers: [
      `sound("bd*4").gain(1.2).shape(0.2).lpf(150)`,
      `sound("~ cp ~ cp").gain(0.7).room(0.4)`,
      `sound("~ hh ~ hh").gain(0.5)`,
      `sound("hh*16").gain(0.25).degradeBy(0.2)`,
      `note("<a1 a1 f1 g1>").sound("sine").struct("1 ~ 1 ~ 1 ~ 1 ~").gain(1.0).lpf(250).attack(0.01).decay(0.15).sustain(0.5)`,
      `note("<[a3,c4,e4,g4] [f3,a3,c4,e4] [g3,b3,d4,f4] [d3,f3,a3,c4]>").sound("sawtooth").attack(0.05).decay(0.4).sustain(0.4).lpf(sine.range(800, 2000).slow(8)).lpq(5).room(0.7).gain(0.4)`
    ]
  },

  disco: {
    name: '🎛️ 디스코펑크',
    bpm: 120,
    description: '4-on-floor · 오프비트 햇 · 슬랩 베이스',
    layers: [
      `sound("bd*4").gain(1.2).lpf(180)`,
      `sound("~ cp ~ cp").gain(0.8).room(0.2)`,
      `sound("~ hh ~ hh").gain(0.6).decay(0.1)`,
      `sound("hh*16").gain(0.3)`,
      `note("<a1 a1 e1 [a1 a1 a1] d2 d2 a1 [d2 e2 d2]>").sound("sawtooth").struct("1 1 1 1 1 1 1 1").lpf(sine.range(400, 1200).slow(4)).lpq(10).gain(0.8).decay(0.08).sustain(0.3).shape(0.3)`,
      `note("<[a3,c4,e4] [g3,b3,d4]>*4").sound("square").decay(0.05).sustain(0).lpf(2500).gain(0.4)`
    ]
  },

  funksoul: {
    name: '🎷 펑크소울',
    bpm: 110,
    description: '그루브 드럼 · 슬랩 베이스 · 와우 기타',
    layers: [
      `sound("bd ~ ~ bd bd ~ ~ ~").gain(1.1)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(0.9).room(0.15)`,
      `sound("hh*16").gain("0.3 0.2 0.5 0.2".fast(2)).degradeBy(0.15)`,
      `note("<a1 ~ a1 [c2 a1] e2 ~ a1 ~ f1 ~ f1 [a1 f1] g1 ~ f1 ~>").sound("sawtooth").lpf(600).lpq(10).gain(0.9).decay(0.1).sustain(0.3).shape(0.3)`,
      `note("<[a3,c4,e4] [d3,f3,a3]>*4").sound("square").decay(0.08).sustain(0).lpf(sine.range(600, 2500).slow(2)).lpq(10).gain(0.4)`,
      `note("<~ ~ ~ [a4 c5] ~ ~ ~ ~>").sound("sawtooth").decay(0.2).sustain(0.3).lpf(2500).room(0.3).gain(0.4)`
    ]
  },

  reggae: {
    name: '🎸 레게',
    bpm: 90,
    description: '오프비트 스카 찹 · 덥 에코',
    layers: [
      `sound("bd:2 ~ ~ ~ bd:2 ~ ~ ~").gain(1.0).lpf(200)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(0.8).room(0.3)`,
      `sound("~ hh ~ hh ~ hh ~ hh").gain(0.5)`,
      `note("<a1 a1 e1 a1 d2 d2 a1 d2>").sound("sine").struct("1 ~ ~ ~").gain(1.0).lpf(200)`,
      `note("<[a3,c4,e4] [d3,f3,a3] [e3,g3,b3] [a3,c4,e4]>").sound("square").decay(0.2).sustain(0).struct("~ 1 ~ 1").lpf(1500).delay(0.4).delaytime(0.375).delayfeedback(0.4).room(0.5).gain(0.4)`
    ]
  },

  jazz: {
    name: '🎺 재즈',
    bpm: 120,
    description: '워킹 베이스 · 재즈 코드 · 라이드 심벌',
    layers: [
      `sound("bd ~ ~ bd ~ ~ ~ ~").gain(0.9)`,
      `sound("~ ~ ~ ~ sd ~ ~ sd").gain(0.7).room(0.2)`,
      `sound("hh*12").gain(0.4)`,
      `note("<a2 c3 e3 g3 f3 d3 b2 g2>").sound("sawtooth").attack(0.005).decay(0.15).sustain(0.6).release(0.05).lpf(800).gain(0.8)`,
      `note("<[a3,c4,e4,g4] [d3,f3,a3,c4] [g3,b3,d4,f4] [c3,e3,g3,b3]>").sound("sawtooth").attack(0.01).decay(0.4).sustain(0.3).lpf(1500).gain(0.4).room(0.5)`
    ]
  },

  hardstyle: {
    name: '🏛️ 하드스타일',
    bpm: 150,
    description: '디스토션 킥 · 리버스 베이스',
    layers: [
      `sound("bd:4*4").gain(1.5).shape(0.7).lpf(150)`,
      `note("<f1 f1 f1 f1 g1 g1 a1 g1>").sound("sawtooth").struct("1 1 1 1 1 1 1 1").lpf(sine.range(200, 1500).slow(4)).lpq(15).gain(0.9).decay(0.08).sustain(0.3).shape(0.5)`,
      `sound("~ cp ~ cp").gain(1.0).room(0.3).shape(0.2)`,
      `sound("hh*16").gain(0.4).degradeBy(0.1)`,
      `note("<f4 ~ ab4 ~ c5 ~ bb4 ~>").sound("sawtooth").decay(0.4).sustain(0.3).lpf(2500).lpq(5).delay(0.4).delaytime(0.375).delayfeedback(0.5).room(0.5).gain(0.5)`
    ]
  },

  psytrance: {
    name: '🌀 사이키트랜스',
    bpm: 145,
    description: '16분 베이스라인 · 필터 스윕 리드',
    layers: [
      `sound("bd:6*4").gain(1.3).shape(0.3).lpf(120)`,
      `note("a1").sound("sawtooth").struct("~ 1 1 1").lpf(sine.range(400, 1800).slow(8)).lpq(18).gain(0.8).decay(0.08).sustain(0.2).shape(0.4)`,
      `sound("~ cp ~ cp").gain(0.7).room(0.2)`,
      `sound("hh*16").gain("0.3 0.2 0.4 0.2".fast(2)).degradeBy(0.1)`,
      `note("<a3 a3 e4 a4 f4 e4 a3 c4 e4 c4 a3 g3>*2").sound("square").decay(0.15).sustain(0).lpf(sine.range(1000, 4000).slow(8)).lpq(15).delay(0.5).delaytime(0.375).delayfeedback(0.6).room(0.5).gain(0.4)`
    ]
  },

  breakbeat: {
    name: '🥁 브레이크비트',
    bpm: 140,
    description: '아멘 브레이크 · 샘플 찹',
    layers: [
      `sound("bd ~ ~ bd ~ ~ bd ~ bd ~ ~ bd ~ ~ ~ bd").gain(1.1).shape(0.2)`,
      `sound("~ ~ sd ~ sd ~ ~ sd ~ ~ sd ~ ~ sd ~ ~").gain(0.9).room(0.2)`,
      `sound("hh*16").gain("0.4 0.2 0.5 0.2".fast(2)).degradeBy(0.2)`,
      `note("<c2 ~ ~ c2 ~ g1 ~ ~ f1 ~ ~ ~ g1 ~ ~ ~>").sound("sawtooth").lpf(500).lpq(8).gain(0.8).decay(0.2).sustain(0.4).shape(0.3)`,
      `note("<[c4,eb4,g4] ~ ~ ~>").sound("square").decay(0.15).sustain(0).lpf(2000).delay(0.3).delaytime(0.375).room(0.4).gain(0.4)`
    ]
  },

  neoclassic: {
    name: '🎻 네오클래식',
    bpm: 80,
    description: '현악 패드 · 피아노 아르페지오',
    layers: [
      `note("<[a2,c3,e3,a3] [f2,a2,c3,f3] [g2,b2,d3,g3] [e2,g2,b2,e3]>").sound("sawtooth").attack(1.5).release(2).lpf(sine.range(600, 1800).slow(16)).room(0.95).gain(0.4)`,
      `note("<[a3 c4 e4 a4 e4 c4] [f3 a3 c4 f4 c4 a3] [g3 b3 d4 g4 d4 b3] [e3 g3 b3 e4 b3 g3]>*2").sound("sine").attack(0.005).decay(0.4).sustain(0.2).gain(0.5).room(0.7)`,
      `note("<a1 f1 g1 e1>").sound("sine").struct("1").gain(0.8).lpf(250)`,
      `note("<~ ~ a5 ~ ~ e5 ~ ~ ~ c5 ~ ~ ~ ~ ~ ~>").sound("triangle").decay(1).sustain(0.2).delay(0.6).delaytime(0.5).delayfeedback(0.5).room(0.9).gain(0.3)`
    ]
  },

  glitch: {
    name: '🤖 글리치/IDM',
    bpm: 130,
    description: '불규칙 리듬 · 스터터 · 실험적',
    layers: [
      `sound("bd ~ bd ~ ~ bd ~ ~ bd ~ ~ ~ bd ~ bd ~").gain(1.2).shape(0.3)`,
      `sound("~ ~ sd ~ ~ sd ~ ~").gain(0.8).room(0.2).sometimesBy(0.4, x => x.stut(3, 0.5, 1/8))`,
      `sound("hh*16").gain(perlin.range(0.2, 0.6)).degradeBy(0.3).pan(perlin.range(0.2, 0.8))`,
      `note("<c2 ~ eb2 c2 ~ g1 c2 ~>").sound("sawtooth").lpf(sine.range(300, 1200).fast(3)).lpq(15).gain(0.7).decay(0.1).shape(0.4)`,
      `note("<c5 ~ e5 ~ g5 ~ b5 ~>").sound("square").decay(0.05).sustain(0).lpf(3000).gain(0.4).pan(perlin.range(0.1, 0.9))`
    ]
  },

  kpop: {
    name: '🎶 K-pop',
    bpm: 128,
    description: '4-on-floor + 드롭 · 캐치 훅',
    layers: [
      `sound("bd:4*4").gain(1.3).shape(0.3).lpf(150)`,
      `sound("~ cp ~ cp").gain(0.9).room(0.25)`,
      `sound("~ hh:1 ~ hh:1").gain(0.55)`,
      `sound("hh*16").gain("0.3 0.2 0.5 0.2".fast(2)).degradeBy(0.1)`,
      `note("<a1 a1 f1 g1>").sound("sawtooth").struct("1 ~ 1 1 ~ 1 1 1").lpf(sine.range(400, 1200).slow(4)).lpq(10).gain(0.9).decay(0.08).sustain(0.3).shape(0.3)`,
      `note("<a4 c5 e5 a5 g5 e5 c5 a4>*2").sound("square").decay(0.2).sustain(0.3).lpf(2500).lpq(5).delay(0.3).delaytime(0.25).delayfeedback(0.4).room(0.4).gain(0.5)`,
      `note("<[a3,c4,e4] [f3,a3,c4] [g3,b3,d4] [e3,g3,b3]>").sound("sawtooth").attack(0.3).release(0.8).lpf(1500).room(0.6).gain(0.3)`
    ]
  },

  // ──────────── EDM / Club 확장 ────────────
  techhouse: {
    name: '🕺 테크 하우스',
    bpm: 126,
    description: '그루비 하우스 · 펑키 베이스',
    layers: [
      `sound("bd:4*4").gain(1.3).shape(0.3)`,
      `sound("~ cp ~ cp").gain(0.85).room(0.2)`,
      `sound("hh*8").gain("0.4 0.2".fast(2))`,
      `sound("~ rim ~ ~ ~ ~ rim ~").gain(0.5)`,
      `note("<a1 a1 ~ a1 c2 c2 ~ g1>").sound("sawtooth").lpf(sine.range(400,1200).slow(4)).lpq(10).gain(0.9).decay(0.1).sustain(0.3).shape(0.3)`,
      `note("<[a3,c4,e4] [f3,a3,c4] [g3,b3,d4] [e3,g3,b3]>").sound("square").struct("~ 1 ~ 1").decay(0.2).sustain(0).lpf(1800).delay(0.3).delaytime(0.25).gain(0.35)`
    ]
  },

  futurehouse: {
    name: '🚀 퓨처 하우스',
    bpm: 128,
    description: '필터 스윕 · 덕킹 베이스',
    layers: [
      `sound("bd:4*4").gain(1.35).shape(0.4)`,
      `sound("~ cp ~ cp").gain(0.85).room(0.3)`,
      `sound("hh*8").gain(0.45)`,
      `note("<a1 a1 f1 g1>").sound("square").struct("1 1 1 1 1 1 1 1").lpf(sine.range(500,2000).slow(8)).gain(0.85).decay(0.12).sustain(0.3).shape(0.4)`,
      `note("<[a3,c4,e4] [f3,a3,c4] [g3,b3,d4] [e3,g3,b3]>*2").sound("sawtooth").attack(0.01).decay(0.3).sustain(0.2).lpf(sine.range(1000,3500).slow(4)).room(0.4).gain(0.45)`
    ]
  },

  tribalhouse: {
    name: '🥁 트라이벌 하우스',
    bpm: 124,
    description: '부족 리듬 · 콩가 타악',
    layers: [
      `sound("bd:4*4").gain(1.25).shape(0.3)`,
      `sound("cb ~ cb ~ ~ cb ~ cb").gain(0.7)`,
      `sound("~ rim rim ~ rim ~ ~ rim").gain(0.6)`,
      `sound("hh*8").gain("0.3 0.5".fast(4)).pan(sine.range(0.2,0.8).slow(3))`,
      `note("<a2 a2 e2 a2>").sound("sine").struct("1 ~ ~ 1 ~ 1 ~ ~").gain(1.0).decay(0.3)`,
      `note("<a3 c4 e4 a3>").sound("triangle").struct("1 ~ 1 ~").delay(0.35).delaytime(0.375).room(0.5).gain(0.4)`
    ]
  },

  detroit: {
    name: '🏙️ 디트로이트 테크노',
    bpm: 128,
    description: '909 킥 · 미래지향 스트링',
    layers: [
      `sound("bd:5*4").gain(1.3).shape(0.4)`,
      `sound("~ cp ~ cp").gain(0.8)`,
      `sound("hh*8").gain(0.45).decay(0.1)`,
      `note("c2").sound("sine").struct("1 ~ ~ 1 ~ ~ 1 ~").gain(1.1).decay(0.2)`,
      `note("<[c4,eb4,g4] [ab3,c4,eb4] [bb3,d4,f4] [g3,bb3,d4]>").sound("sawtooth").attack(0.3).release(0.8).lpf(1400).room(0.7).gain(0.35)`,
      `note("<c5 eb5 g5 c6>*2").sound("square").struct("1 ~ 1 1 ~ 1 ~ 1").decay(0.2).sustain(0).lpf(2500).delay(0.4).delaytime(0.375).gain(0.3)`
    ]
  },

  minimaltechno: {
    name: '◾ 미니멀 테크노',
    bpm: 130,
    description: '스파스 · 클릭 타악',
    layers: [
      `sound("bd*4").gain(1.25).shape(0.3)`,
      `sound("~ ~ rim ~ ~ rim ~ ~").gain(0.55)`,
      `sound("hh*8").gain("0.25 0.4".fast(2)).degradeBy(0.2)`,
      `note("c2").sound("sine").struct("1 ~ ~ ~ 1 ~ ~ ~").gain(1.0).decay(0.25)`,
      `note("<g2 ~ eb2 ~>").sound("square").struct("~ 1 ~ 1").lpf(1200).decay(0.15).gain(0.5).shape(0.3)`
    ]
  },

  industrial: {
    name: '⚙️ 인더스트리얼',
    bpm: 135,
    description: '디스토션 · 메탈릭 타악',
    layers: [
      `sound("bd*4").gain(1.5).shape(0.7).lpf(140)`,
      `sound("~ cr ~ cr").gain(0.6).shape(0.5).room(0.4)`,
      `sound("hh*16").gain(0.35).shape(0.3).degradeBy(0.25)`,
      `note("<c1 c1 eb1 c1 g0 c1 f1 c1>").sound("sawtooth").lpf(sine.range(200,1000).slow(6)).lpq(15).gain(1.0).decay(0.1).sustain(0.2).shape(0.7)`,
      `sound("noise*2").gain(0.25).hpf(2000).decay(0.2)`
    ]
  },

  uplifting: {
    name: '🌟 업리프팅 트랜스',
    bpm: 138,
    description: '슈퍼소우 · 아르페지오',
    layers: [
      `sound("bd:4*4").gain(1.3).shape(0.4)`,
      `sound("~ cp ~ cp").gain(0.85).room(0.35)`,
      `sound("hh*8").gain("0.35 0.5".fast(2))`,
      `note("a1").sound("sawtooth").struct("~ 1 ~ 1 ~ 1 ~ 1").gain(0.9).decay(0.1).sustain(0.3).shape(0.3)`,
      `note("<a4 c5 e5 a5 g5 e5 c5 a4>*2").sound("sawtooth").decay(0.2).sustain(0.3).lpf(3500).delay(0.35).delaytime(0.375).delayfeedback(0.45).room(0.5).gain(0.45)`,
      `note("<[a3,c4,e4] [f3,a3,c4] [g3,b3,d4] [e3,g3,b3]>").sound("sawtooth").attack(0.4).release(1).lpf(2000).room(0.8).gain(0.35)`
    ]
  },

  progressive: {
    name: '🌊 프로그레시브 트랜스',
    bpm: 132,
    description: '롤링 베이스 · 진화하는 패드',
    layers: [
      `sound("bd:4*4").gain(1.3).shape(0.35)`,
      `sound("~ cp ~ cp").gain(0.8).room(0.3)`,
      `sound("hh*8").gain(0.4)`,
      `note("<a1 a1 a2 a1 c2 c2 c3 c2>").sound("sawtooth").struct("1 ~ 1 1 1 ~ 1 1").lpf(sine.range(400,1500).slow(8)).gain(0.8).decay(0.1).sustain(0.3).shape(0.3)`,
      `note("<[a3,c4,e4] [f3,a3,c4]>").sound("sawtooth").attack(0.5).release(1.5).lpf(sine.range(800,2500).slow(16)).room(0.7).gain(0.35)`,
      `note("<a4 e5 c5 a4 g4 e5 c5 g4>").sound("triangle").struct("1 ~ 1 1 ~ 1 ~ 1").decay(0.2).sustain(0).delay(0.4).delaytime(0.375).room(0.5).gain(0.4)`
    ]
  },

  hardcore: {
    name: '💥 하드코어',
    bpm: 160,
    description: '디스토션 킥 · 극한 속도',
    layers: [
      `sound("bd*4").gain(1.5).shape(0.8).lpf(200)`,
      `sound("~ cp ~ cp").gain(0.85).shape(0.4)`,
      `sound("hh*16").gain(0.45).shape(0.3)`,
      `note("<a1 a1 c2 g1>").sound("sawtooth").struct("1 1 1 1 1 1 1 1").lpf(1200).gain(1.0).decay(0.08).sustain(0.2).shape(0.7)`,
      `note("<a4 c5 e5 a5>*2").sound("square").decay(0.15).sustain(0).lpf(3000).delay(0.3).gain(0.4)`
    ]
  },

  gabber: {
    name: '🔥 갭바',
    bpm: 180,
    description: '극한 디스토션 킥 · 네덜란드 스타일',
    layers: [
      `sound("bd*4").gain(1.55).shape(0.85).lpf(180)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(0.9).shape(0.5)`,
      `sound("hh*16").gain(0.4).shape(0.4).degradeBy(0.15)`,
      `note("<a1 c2 a1 g1>").sound("sawtooth").struct("1 1 1 1 1 1 1 1").gain(1.1).decay(0.08).sustain(0.1).shape(0.8)`,
      `note("<a4 c5 a4 g4>*4").sound("square").decay(0.1).sustain(0).lpf(2500).gain(0.4)`
    ]
  },

  dubstep: {
    name: '🤖 덥스텝',
    bpm: 140,
    description: '하프타임 · 웝베이스',
    layers: [
      `sound("bd ~ ~ ~ ~ ~ ~ ~").gain(1.4).shape(0.5)`,
      `sound("~ ~ ~ ~ sd ~ ~ ~").gain(1.1).room(0.3)`,
      `sound("hh*8").gain("0.3 0.5".fast(2))`,
      `note("<a1 a1 f1 g1 c2 a1 f1 g1>").sound("sawtooth").struct("1 ~ ~ 1 ~ 1 ~ ~").lpf(sine.range(200,1800).slow(2)).lpq(18).gain(1.2).decay(0.3).sustain(0.5).shape(0.6)`,
      `note("<[a3,c4,e4] [f3,a3,c4]>").sound("square").struct("1 ~ ~ 1").decay(0.2).sustain(0).lpf(2000).delay(0.4).delaytime(0.375).room(0.4).gain(0.35)`
    ]
  },

  liquiddnb: {
    name: '💧 리퀴드 DnB',
    bpm: 172,
    description: '재즈 코드 · 매끄러운 드럼',
    layers: [
      `sound("bd ~ ~ bd ~ ~ bd ~").gain(1.2).shape(0.2)`,
      `sound("~ ~ sd ~ ~ sd ~ ~").gain(0.95).room(0.35)`,
      `sound("hh*16").gain("0.35 0.2".fast(2)).pan(sine.range(0.3,0.7).slow(3))`,
      `note("<d1 a1 f1 c2>").sound("sine").struct("1 ~ ~ ~ 1 ~ ~ ~").gain(1.1).decay(0.3).sustain(0.6)`,
      `note("<[d3,f3,a3,c4] [c3,e3,g3,b3] [bb2,d3,f3,a3] [a2,c3,e3,g3]>").sound("triangle").attack(0.3).release(1).lpf(1800).room(0.7).gain(0.4)`,
      `note("<d5 a4 f4 c5>*2").sound("sine").struct("1 ~ 1 ~ ~ 1 ~ 1").decay(0.25).sustain(0.2).delay(0.4).delaytime(0.375).room(0.4).gain(0.3)`
    ]
  },

  jungle: {
    name: '🌴 정글',
    bpm: 170,
    description: '아멘 브레이크 · 서브 베이스',
    layers: [
      `sound("bd ~ bd ~ ~ bd ~ ~").gain(1.25).shape(0.35)`,
      `sound("~ sd ~ ~ sd ~ sd sd").gain(1.0).room(0.25)`,
      `sound("hh*16").gain("0.35 0.15".fast(4)).degradeBy(0.25)`,
      `note("<e1 e1 g1 e1 a1 e1 d1 e1>").sound("sine").gain(1.3).decay(0.35).sustain(0.7).lpf(150)`,
      `note("<[e3,g3,b3] [a3,c4,e4]>").sound("sawtooth").struct("~ 1 ~ 1").decay(0.15).sustain(0).lpf(1500).delay(0.35).gain(0.35)`
    ]
  },

  // ──────────── Chill / Downtempo 확장 ────────────
  chillhop: {
    name: '🎧 칠합',
    bpm: 85,
    description: '재즈 샘플 · 여유 비트',
    layers: [
      `sound("bd ~ ~ bd ~ ~ ~ ~").gain(1.15)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(0.85).room(0.3)`,
      `sound("hh*8").gain("0.4 0.2".fast(2)).degradeBy(0.1)`,
      `note("<a2 e2 f2 c3>").sound("sine").struct("1 ~ ~ 1 ~ 1 ~ ~").gain(1.0).decay(0.35)`,
      `note("<[a3,c4,e4,g4] [f3,a3,c4,e4] [g3,b3,d4,f4] [e3,g3,b3,d4]>").sound("triangle").attack(0.2).release(0.8).lpf(1800).room(0.6).gain(0.45)`
    ]
  },

  downtempo: {
    name: '🕰️ 다운템포',
    bpm: 90,
    description: '느린 그루브 · 공간감',
    layers: [
      `sound("bd ~ ~ ~ bd ~ ~ ~").gain(1.2)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(0.9).room(0.4)`,
      `sound("hh*8").gain(0.35).degradeBy(0.2)`,
      `note("<c2 g2 eb2 bb2>").sound("sine").struct("1 ~ ~ ~").gain(1.0).decay(0.5)`,
      `note("<[c4,eb4,g4] [ab3,c4,eb4] [bb3,d4,f4] [g3,bb3,d4]>").sound("sawtooth").attack(0.5).release(1.5).lpf(1400).room(0.8).gain(0.35)`
    ]
  },

  triphop: {
    name: '💭 트립합',
    bpm: 85,
    description: '다크 브레이크 · 스페이시 패드',
    layers: [
      `sound("bd ~ ~ bd ~ ~ ~ ~").gain(1.2).shape(0.2)`,
      `sound("~ ~ sd ~ ~ sd ~ ~").gain(0.9).room(0.35)`,
      `sound("hh*8").gain(0.4).degradeBy(0.15)`,
      `note("<d2 a2 f2 c3>").sound("sawtooth").struct("1 ~ ~ ~ 1 ~ ~ ~").lpf(600).gain(0.95).decay(0.4).sustain(0.6)`,
      `note("<[d3,f3,a3] [c3,f3,a3] [bb2,d3,f3] [a2,c3,e3]>").sound("triangle").attack(0.4).release(1.2).lpf(1500).room(0.85).delay(0.4).delaytime(0.375).gain(0.4)`
    ]
  },

  balearic: {
    name: '🌅 발레아릭',
    bpm: 112,
    description: '선셋 · 드리미 기타',
    layers: [
      `sound("bd*4").gain(1.1).shape(0.2)`,
      `sound("~ cp ~ cp").gain(0.7).room(0.3)`,
      `sound("hh*8").gain(0.4)`,
      `note("<a2 e3 a3 e3>").sound("triangle").struct("1 ~ 1 ~ 1 ~ 1 ~").decay(0.3).sustain(0.4).gain(0.6).delay(0.3).delaytime(0.375)`,
      `note("<[a3,c4,e4,a4] [f3,a3,c4,f4] [g3,b3,d4,g4] [e3,g3,b3,e4]>").sound("sine").attack(0.6).release(2).lpf(2000).room(0.9).gain(0.4)`
    ]
  },

  newage: {
    name: '🔮 뉴에이지',
    bpm: 70,
    description: '명상 · 종과 플루트',
    layers: [
      `note("<c4 e4 g4 c5>*2").sound("sine").struct("1 ~ 1 ~ ~ 1 ~ ~").attack(0.1).release(1.5).gain(0.5).delay(0.5).delaytime(0.5).delayfeedback(0.5).room(0.9)`,
      `note("<[c3,e3,g3] [a2,c3,e3] [f2,a2,c3] [g2,b2,d3]>").sound("triangle").attack(1).release(3).lpf(1800).room(0.95).gain(0.45)`,
      `note("<c2 g2 f2 e2>").sound("sine").struct("1 ~ ~ ~").attack(0.5).release(2).gain(0.5)`
    ]
  },

  drone: {
    name: '🌀 드론',
    bpm: 60,
    description: '지속음 · 배음 조작',
    layers: [
      `note("c2").sound("sawtooth").attack(3).release(4).lpf(sine.range(400,1200).slow(30)).lpq(5).gain(0.6).room(0.95)`,
      `note("c3").sound("triangle").attack(2).release(3).lpf(sine.range(600,1800).slow(20)).gain(0.4).room(0.9)`,
      `note("g2").sound("sine").attack(4).release(5).gain(0.5).room(0.9).delay(0.6).delaytime(1.5).delayfeedback(0.5)`
    ]
  },

  // ──────────── Jazz / Soul / Funk 확장 ────────────
  smoothjazz: {
    name: '🎷 스무스 재즈',
    bpm: 95,
    description: '색소폰 리드 · 부드러운 스윙',
    layers: [
      `sound("bd ~ ~ ~ bd ~ ~ ~").gain(1.0)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(0.75).room(0.3)`,
      `sound("hh*8").gain("0.3 0.45".fast(2))`,
      `note("<c2 g2 a2 e2>").sound("sine").struct("1 ~ ~ 1 ~ 1 ~ ~").gain(1.0).decay(0.4).sustain(0.5)`,
      `note("<[c4,e4,g4,b4] [a3,c4,e4,g4] [f3,a3,c4,e4] [g3,b3,d4,f4]>").sound("triangle").attack(0.3).release(1).lpf(2000).room(0.5).gain(0.4)`,
      `note("<c5 e5 g5 b5 a5 g5 e5 c5>*2").sound("sawtooth").struct("1 ~ 1 ~ ~ 1 ~ 1").decay(0.3).sustain(0.2).lpf(2500).room(0.4).gain(0.35)`
    ]
  },

  bebop: {
    name: '⚡ 비밥',
    bpm: 200,
    description: '빠른 스윙 · 워킹 베이스',
    layers: [
      `sound("bd ~ ~ bd ~ ~ bd ~").gain(0.9)`,
      `sound("~ ~ sd ~ ~ sd ~ ~").gain(0.7).room(0.2)`,
      `sound("hh*12").gain(0.5)`,
      `note("<c2 e2 g2 a2 bb2 a2 g2 e2>").sound("sawtooth").attack(0.005).decay(0.15).sustain(0.5).lpf(900).gain(0.85)`,
      `note("<c5 e5 g5 bb5 a5 g5 f5 e5 d5 c5 bb4 a4>").sound("square").decay(0.1).sustain(0.2).lpf(2500).gain(0.4)`
    ]
  },

  cooljazz: {
    name: '❄️ 쿨 재즈',
    bpm: 110,
    description: '릴랙스 스윙 · 모달',
    layers: [
      `sound("bd ~ ~ ~ bd ~ ~ ~").gain(0.95)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(0.7).room(0.25)`,
      `sound("hh*8").gain("0.3 0.4".fast(2))`,
      `note("<d2 a2 f2 c3>").sound("sine").struct("1 ~ 1 ~ 1 ~ 1 ~").gain(0.95).decay(0.3).sustain(0.6)`,
      `note("<[d4,f4,a4,c5] [g3,b3,d4,f4] [c4,e4,g4,b4] [f3,a3,c4,e4]>").sound("triangle").attack(0.2).release(0.8).lpf(1800).room(0.5).gain(0.4)`
    ]
  },

  fusion: {
    name: '🌀 재즈 퓨전',
    bpm: 120,
    description: '복합 화성 · 펑크 그루브',
    layers: [
      `sound("bd ~ bd ~ ~ bd ~ ~").gain(1.15).shape(0.2)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(0.9).room(0.2)`,
      `sound("hh*16").gain("0.35 0.2".fast(2))`,
      `note("<e2 g2 b2 d3 c3 a2 g2 e2>").sound("sawtooth").struct("1 ~ 1 1 ~ 1 ~ 1").lpf(1200).gain(0.95).decay(0.15).sustain(0.4).shape(0.3)`,
      `note("<[e3,g3,b3,d4] [a3,c4,e4,g4] [d3,f3,a3,c4] [g3,b3,d4,f4]>").sound("square").attack(0.1).release(0.5).lpf(2500).delay(0.3).gain(0.4)`
    ]
  },

  bossa: {
    name: '🌴 보사노바',
    bpm: 120,
    description: '보사 클라베 · 브러시 드럼',
    layers: [
      `sound("bd ~ ~ bd ~ ~ bd ~").gain(0.95)`,
      `sound("~ rim ~ ~ rim ~ rim ~").gain(0.6)`,
      `sound("hh*8").gain(0.35)`,
      `note("<a2 e3 c3 g2>").sound("sine").struct("1 ~ 1 ~ ~ 1 ~ 1").gain(0.95).decay(0.3).sustain(0.5)`,
      `note("<[a3,c4,e4,g4] [d3,f3,a3,c4] [g3,b3,d4,f4] [c3,e3,g3,b3]>").sound("triangle").attack(0.05).release(0.8).lpf(2000).room(0.4).gain(0.4)`
    ]
  },

  latinjazz: {
    name: '🪘 라틴 재즈',
    bpm: 115,
    description: '클라베 · 콩가',
    layers: [
      `sound("bd ~ bd ~ ~ bd ~ bd").gain(1.1)`,
      `sound("cb ~ ~ cb ~ cb ~ ~").gain(0.75)`,
      `sound("~ rim ~ rim ~ ~ rim ~").gain(0.6)`,
      `sound("hh*8").gain(0.4)`,
      `note("<c2 g2 eb2 bb2>").sound("sine").struct("1 ~ 1 ~ 1 ~ 1 ~").gain(1.0).decay(0.3).sustain(0.5)`,
      `note("<[c4,eb4,g4] [ab3,c4,eb4] [bb3,d4,f4] [g3,bb3,d4]>*2").sound("square").struct("1 ~ 1 ~").decay(0.2).sustain(0).lpf(2200).gain(0.4)`
    ]
  },

  neosoul: {
    name: '💜 네오소울',
    bpm: 90,
    description: '부드러운 코드 · 고스트 드럼',
    layers: [
      `sound("bd ~ ~ bd ~ ~ ~ ~").gain(1.2)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(0.85).room(0.3)`,
      `sound("hh*16").gain("0.3 0.2 0.45 0.15".fast(2)).degradeBy(0.1)`,
      `note("<f2 c3 ab2 eb3>").sound("sine").struct("1 ~ ~ 1 ~ 1 ~ ~").gain(1.0).decay(0.35)`,
      `note("<[f3,ab3,c4,eb4] [c3,eb3,g3,bb3] [ab2,c3,eb3,g3] [bb2,d3,f3,ab3]>").sound("triangle").attack(0.3).release(1.2).lpf(1800).room(0.6).gain(0.45)`
    ]
  },

  motown: {
    name: '🎙️ 모타운',
    bpm: 120,
    description: '60년대 소울 비트',
    layers: [
      `sound("bd ~ ~ ~ bd ~ ~ ~").gain(1.2)`,
      `sound("~ sd ~ sd ~ sd ~ sd").gain(0.9).room(0.2)`,
      `sound("hh*8").gain(0.45)`,
      `note("<g2 d3 bb2 f3>").sound("sawtooth").struct("1 1 ~ 1 1 ~ 1 1").lpf(900).gain(0.9).decay(0.12).sustain(0.3)`,
      `note("<[g3,b3,d4] [c4,e4,g4] [d4,f#4,a4] [g3,b3,d4]>").sound("square").struct("~ 1 ~ 1").decay(0.2).sustain(0).lpf(2200).gain(0.4)`
    ]
  },

  acidjazz: {
    name: '🧪 애시드 재즈',
    bpm: 100,
    description: '펑키 + 애시드 베이스',
    layers: [
      `sound("bd ~ bd ~ ~ bd ~ ~").gain(1.15).shape(0.2)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(0.85).room(0.2)`,
      `sound("hh*16").gain("0.35 0.2".fast(2))`,
      `note("<e2 e2 g2 e2 a2 g2 e2 d2>").sound("sawtooth").struct("1 1 1 1 1 1 1 1").lpf(sine.range(300,1500).slow(6)).lpq(15).gain(0.95).decay(0.1).sustain(0.3).shape(0.4)`,
      `note("<[e3,g3,b3,d4] [a3,c4,e4,g4]>").sound("square").struct("~ 1 ~ 1").decay(0.2).sustain(0).lpf(2200).gain(0.4)`
    ]
  },

  // ──────────── Hip-hop / R&B 확장 ────────────
  boombap: {
    name: '🥾 붐뱁',
    bpm: 90,
    description: '묵직한 킥/스네어 · 바이닐',
    layers: [
      `sound("bd ~ ~ bd ~ ~ ~ ~").gain(1.35).shape(0.3)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(1.05).room(0.25)`,
      `sound("hh*8").gain("0.4 0.25".fast(2)).degradeBy(0.1)`,
      `note("<c2 g2 f2 ab2>").sound("sine").struct("1 ~ ~ 1 ~ 1 ~ ~").gain(1.1).decay(0.3)`,
      `note("<[c4,eb4,g4] [ab3,c4,eb4] [f3,ab3,c4] [bb3,d4,f4]>").sound("sawtooth").attack(0.1).release(0.5).lpf(1500).room(0.4).gain(0.35)`
    ]
  },

  drill: {
    name: '🔪 드릴',
    bpm: 140,
    description: '슬라이딩 808 · 다크',
    layers: [
      `sound("bd ~ ~ bd ~ ~ ~ bd").gain(1.4).shape(0.4)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(1.1).room(0.3)`,
      `sound("hh*16").gain("0.35 0.15 0.5 0.2".fast(2))`,
      `sound("hh*32").gain(0.25).degradeBy(0.4)`,
      `note("<c1 c1 eb1 c1 bb0 c1 g0 c1>").sound("sine").struct("1 ~ 1 ~ 1 ~ 1 ~").gain(1.3).decay(0.4).sustain(0.6).lpf(120)`,
      `note("<[c4,eb4,g4] [bb3,d4,f4]>").sound("triangle").attack(0.2).release(0.8).lpf(1600).room(0.7).gain(0.3)`
    ]
  },

  cloudrap: {
    name: '☁️ 클라우드 랩',
    bpm: 72,
    description: '에어리 패드 · 느린 트랩',
    layers: [
      `sound("bd ~ ~ ~ bd ~ ~ ~").gain(1.3).shape(0.3)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(1.0).room(0.5)`,
      `sound("hh*8").gain(0.4)`,
      `sound("hh*16").gain(0.2).degradeBy(0.3)`,
      `note("<f1 c2 ab1 eb2>").sound("sine").struct("1 ~ ~ ~ 1 ~ ~ ~").gain(1.3).decay(0.5).sustain(0.7)`,
      `note("<[f3,ab3,c4,eb4] [c3,eb3,g3,bb3] [ab2,c3,eb3,g3] [bb2,d3,f3,ab3]>").sound("triangle").attack(0.5).release(2).lpf(1800).room(0.9).delay(0.5).delaytime(0.5).gain(0.4)`
    ]
  },

  oldschool: {
    name: '📻 올드스쿨 힙합',
    bpm: 95,
    description: '80년대 · 간단한 비트',
    layers: [
      `sound("bd ~ ~ bd ~ ~ bd ~").gain(1.3).shape(0.3)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(1.0).room(0.2)`,
      `sound("hh*8").gain("0.4 0.25".fast(2))`,
      `note("<e2 e2 g2 a2>").sound("sawtooth").struct("1 ~ 1 1 ~ 1 ~ 1").lpf(800).gain(0.9).decay(0.12).sustain(0.3)`,
      `note("<[e4,g4,b4] [a4,c5,e5]>*2").sound("square").decay(0.2).sustain(0).lpf(2200).gain(0.4)`
    ]
  },

  westcoast: {
    name: '🌴 웨스트코스트',
    bpm: 95,
    description: 'G-펑크 · 휘파람 신스',
    layers: [
      `sound("bd ~ ~ bd ~ ~ bd ~").gain(1.3).shape(0.3)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(1.0).room(0.25)`,
      `sound("hh*8").gain("0.35 0.2".fast(2))`,
      `note("<a1 e2 a1 d2>").sound("sine").struct("1 ~ ~ 1 ~ 1 ~ ~").gain(1.2).decay(0.3)`,
      `note("<a4 c5 e5 a4 g4 e5 c5 a4>*2").sound("square").struct("1 ~ 1 1 ~ 1 ~ 1").decay(0.25).sustain(0.3).lpf(2500).delay(0.3).delaytime(0.375).gain(0.4)`
    ]
  },

  rnb: {
    name: '💕 컨템포러리 R&B',
    bpm: 85,
    description: '느린 그루브 · 감성 코드',
    layers: [
      `sound("bd ~ ~ bd ~ ~ ~ ~").gain(1.2)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(0.9).room(0.35)`,
      `sound("hh*16").gain("0.35 0.2 0.45 0.15".fast(2))`,
      `note("<g2 d3 bb2 f3>").sound("sine").struct("1 ~ ~ 1 ~ 1 ~ ~").gain(1.0).decay(0.35)`,
      `note("<[g3,bb3,d4,f4] [d3,f3,a3,c4] [bb2,d3,f3,a3] [f3,a3,c4,eb4]>").sound("triangle").attack(0.3).release(1.2).lpf(1900).room(0.65).gain(0.45)`
    ]
  },

  // ──────────── Rock / Pop 확장 ────────────
  indierock: {
    name: '🎸 인디록',
    bpm: 120,
    description: '스트레이트 드럼 · 얼터',
    layers: [
      `sound("bd ~ ~ bd ~ ~ ~ ~").gain(1.25).shape(0.3)`,
      `sound("~ sd ~ ~ sd ~ ~ sd").gain(1.0).room(0.3)`,
      `sound("hh*8").gain(0.45)`,
      `note("<e2 b2 a2 g2>").sound("sawtooth").struct("1 1 1 1 1 1 1 1").lpf(1000).gain(0.85).decay(0.15).sustain(0.4).shape(0.3)`,
      `note("<[e3,g3,b3] [a3,c4,e4] [g3,b3,d4] [d3,f#3,a3]>").sound("square").struct("1 ~ 1 ~").decay(0.3).sustain(0.3).lpf(2000).shape(0.3).gain(0.4)`
    ]
  },

  punkrock: {
    name: '🤘 펑크록',
    bpm: 175,
    description: '빠른 파워코드 · 공격적',
    layers: [
      `sound("bd*4").gain(1.35).shape(0.4)`,
      `sound("~ sd ~ sd").gain(1.1).room(0.2)`,
      `sound("hh*8").gain(0.5)`,
      `note("<e2 e2 a2 b2>").sound("sawtooth").struct("1 1 1 1 1 1 1 1").gain(1.0).decay(0.1).sustain(0.4).shape(0.6)`,
      `note("<[e3,b3,e4] [a3,e4,a4] [b3,f#4,b4] [e3,b3,e4]>").sound("square").struct("1 1 1 1").decay(0.2).sustain(0.3).lpf(2500).shape(0.4).gain(0.45)`
    ]
  },

  grunge: {
    name: '💀 그런지',
    bpm: 100,
    description: '헤비 디스토션 · 슬로우',
    layers: [
      `sound("bd ~ bd ~ ~ bd ~ ~").gain(1.3).shape(0.4)`,
      `sound("~ sd ~ ~ sd ~ ~ sd").gain(1.05).room(0.25).shape(0.2)`,
      `sound("hh*8").gain(0.45).shape(0.2)`,
      `note("<e2 e2 g2 d2>").sound("sawtooth").struct("1 1 1 1").gain(1.0).decay(0.2).sustain(0.5).shape(0.7)`,
      `note("<[e3,g3,b3] [d3,f3,a3] [c3,e3,g3] [g3,b3,d4]>").sound("square").struct("1 ~ 1 ~").decay(0.3).sustain(0.4).lpf(1800).shape(0.5).gain(0.4)`
    ]
  },

  metal: {
    name: '🔥 메탈',
    bpm: 145,
    description: '더블 베이스 · 파워코드',
    layers: [
      `sound("bd*8").gain(1.35).shape(0.5).lpf(180)`,
      `sound("~ sd ~ sd").gain(1.1).room(0.15)`,
      `sound("hh*16").gain(0.4).shape(0.2)`,
      `sound("~ ~ ~ cr").gain(0.6).room(0.3)`,
      `note("<e1 e1 g1 f1>").sound("sawtooth").struct("1 1 1 1 1 1 1 1").gain(1.1).decay(0.1).sustain(0.3).shape(0.8)`,
      `note("<[e3,b3,e4] [g3,d4,g4] [f3,c4,f4] [d3,a3,d4]>*2").sound("square").struct("1 1").decay(0.25).sustain(0.4).lpf(2500).shape(0.5).gain(0.45)`
    ]
  },

  blues: {
    name: '🎺 블루스',
    bpm: 80,
    description: '12마디 · 셔플 리듬',
    layers: [
      `sound("bd ~ ~ bd ~ ~ ~ ~").gain(1.15)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(0.9).room(0.2)`,
      `sound("hh*8").gain("0.4 0.2 0.4 0.2".fast(2))`,
      `note("<e2 g2 a2 bb2 b2 a2 g2 e2>").sound("sawtooth").attack(0.01).decay(0.2).sustain(0.4).lpf(900).gain(0.9).shape(0.2)`,
      `note("<[e3,g3,b3] [a3,c4,e4] [b3,d4,f#4] [e3,g3,b3]>").sound("square").struct("1 ~ 1 ~").decay(0.3).sustain(0.3).lpf(1800).gain(0.4)`
    ]
  },

  ska: {
    name: '🎷 스카',
    bpm: 150,
    description: '업비트 기타 · 브라스',
    layers: [
      `sound("bd ~ bd ~ bd ~ bd ~").gain(1.2)`,
      `sound("~ sd ~ sd ~ sd ~ sd").gain(0.95).room(0.2)`,
      `sound("hh*8").gain(0.4)`,
      `note("<[c3,e3,g3] [f3,a3,c4] [g3,b3,d4] [c3,e3,g3]>").sound("square").struct("~ 1 ~ 1 ~ 1 ~ 1").decay(0.12).sustain(0).lpf(2500).gain(0.55)`,
      `note("<c2 g2 f2 c2>").sound("sawtooth").struct("1 ~ 1 ~ 1 ~ 1 ~").lpf(800).gain(0.85).decay(0.15).sustain(0.3)`
    ]
  },

  dub: {
    name: '🌬️ 덥',
    bpm: 80,
    description: '리버브·딜레이 극대화',
    layers: [
      `sound("bd ~ ~ ~ bd ~ ~ ~").gain(1.2).shape(0.2)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(0.9).room(0.6)`,
      `sound("hh*8").gain(0.4).delay(0.5).delaytime(0.375).delayfeedback(0.5)`,
      `note("<a1 e2 a1 d2>").sound("sine").struct("1 ~ ~ 1 ~ 1 ~ ~").gain(1.2).decay(0.5)`,
      `note("<[a3,c4,e4] [d3,f3,a3] [g3,b3,d4] [c3,e3,g3]>").sound("square").struct("~ 1 ~ 1").decay(0.3).sustain(0).lpf(2000).delay(0.6).delaytime(0.5).delayfeedback(0.55).room(0.8).gain(0.4)`
    ]
  },

  citypop: {
    name: '🌃 시티팝',
    bpm: 115,
    description: '80s 일본 · 재즈 코드 신스',
    layers: [
      `sound("bd ~ ~ bd ~ ~ ~ ~").gain(1.15)`,
      `sound("~ ~ sd ~ ~ ~ sd ~").gain(0.85).room(0.3)`,
      `sound("hh*16").gain("0.35 0.2".fast(2))`,
      `note("<d2 a2 f2 c3>").sound("sawtooth").struct("1 ~ 1 1 ~ 1 ~ 1").lpf(900).gain(0.9).decay(0.15).sustain(0.4)`,
      `note("<[d4,f#4,a4,c5] [g3,b3,d4,f#4] [a3,c#4,e4,g4] [d3,f#3,a3,c4]>").sound("triangle").attack(0.1).release(0.8).lpf(2200).room(0.5).gain(0.4)`,
      `note("<d5 f#5 a5 c6>*2").sound("square").struct("1 ~ 1 ~").decay(0.3).sustain(0.3).lpf(3000).delay(0.3).delaytime(0.375).gain(0.35)`
    ]
  },

  synthpop: {
    name: '🎹 신스팝',
    bpm: 120,
    description: '80s 아날로그 · 게이트 드럼',
    layers: [
      `sound("bd ~ ~ bd ~ ~ ~ ~").gain(1.3).shape(0.3)`,
      `sound("~ sd ~ ~ sd ~ ~ sd").gain(1.05).room(0.4)`,
      `sound("hh*8").gain(0.45)`,
      `note("<a1 a1 f1 e1>").sound("sawtooth").struct("1 1 1 1 1 1 1 1").lpf(900).gain(0.9).decay(0.15).sustain(0.4).shape(0.3)`,
      `note("<[a3,c4,e4] [f3,a3,c4] [e3,g3,b3] [d3,f3,a3]>").sound("square").struct("1 ~ 1 ~").decay(0.3).sustain(0.3).lpf(2500).gain(0.4)`,
      `note("<a4 c5 e5 a5>*2").sound("sawtooth").struct("1 ~ 1 1 ~ 1 ~ 1").decay(0.2).sustain(0.3).lpf(3000).delay(0.35).delaytime(0.375).gain(0.35)`
    ]
  },

  jpop: {
    name: '🌸 J-pop',
    bpm: 130,
    description: '밝은 신스 · 팝 코드',
    layers: [
      `sound("bd ~ ~ bd ~ ~ bd ~").gain(1.25).shape(0.2)`,
      `sound("~ sd ~ ~ sd ~ ~ sd").gain(1.0).room(0.3)`,
      `sound("hh*16").gain("0.35 0.2".fast(2))`,
      `note("<c2 g2 a2 e2 f2 c3 g2 a2>").sound("sawtooth").struct("1 ~ 1 1 ~ 1 ~ 1").lpf(1000).gain(0.85).decay(0.12).sustain(0.3)`,
      `note("<[c4,e4,g4] [g3,b3,d4] [a3,c4,e4] [e3,g3,b3] [f3,a3,c4] [c4,e4,g4] [g3,b3,d4] [a3,c4,e4]>").sound("triangle").attack(0.05).release(0.5).lpf(2300).room(0.4).gain(0.42)`,
      `note("<c5 e5 g5 c6>*2").sound("square").struct("1 ~ 1 ~").decay(0.2).sustain(0.3).delay(0.3).delaytime(0.375).gain(0.35)`
    ]
  },

  disco_pop: {
    name: '🪩 디스코',
    bpm: 118,
    description: '4온더플로어 · 스트링',
    layers: [
      `sound("bd*4").gain(1.3).shape(0.3)`,
      `sound("~ cp ~ cp").gain(0.9).room(0.25)`,
      `sound("hh*8").gain("0.35 0.5".fast(2))`,
      `sound("~ oh ~ oh").gain(0.4)`,
      `note("<a1 a1 e2 a1 f1 f1 c2 f1>").sound("sawtooth").struct("1 1 1 1 1 1 1 1").lpf(1000).gain(0.95).decay(0.1).sustain(0.3).shape(0.3)`,
      `note("<[a3,c4,e4] [f3,a3,c4] [g3,b3,d4] [e3,g3,b3]>*2").sound("triangle").attack(0.2).release(0.6).lpf(2500).room(0.5).gain(0.4)`
    ]
  },

  // ──────────── Classical / Cinematic 확장 ────────────
  baroque: {
    name: '🏛️ 바로크',
    bpm: 100,
    description: '아르페지오 · 대위법',
    layers: [
      `note("<c4 e4 g4 c5 e5 g4 e4 c4>*2").sound("triangle").attack(0.01).decay(0.2).sustain(0.3).lpf(2500).gain(0.5)`,
      `note("<c3 g2 a2 e2 f2 c2 f2 g2>").sound("sawtooth").attack(0.02).decay(0.3).sustain(0.4).lpf(1500).gain(0.55)`,
      `note("<e5 g5 c6 g5 f5 a5 c6 a5>").sound("sine").struct("1 1 1 1 1 1 1 1").decay(0.15).sustain(0.4).gain(0.45).room(0.4)`,
      `note("<[c4,e4,g4] [c4,f4,a4] [c4,e4,g4] [b3,d4,g4]>").sound("triangle").attack(0.3).release(1).lpf(2000).room(0.5).gain(0.3)`
    ]
  },

  minimalism: {
    name: '🔄 미니멀리즘',
    bpm: 120,
    description: '반복 패턴 · Reich/Glass',
    layers: [
      `note("<c4 e4 g4 c5 g4 e4>*3").sound("triangle").decay(0.15).sustain(0.3).lpf(2200).gain(0.5).room(0.4)`,
      `note("<e4 g4 c5 e5 c5 g4>*2").sound("sine").decay(0.2).sustain(0.4).gain(0.45).room(0.5).late(0.02)`,
      `note("<c3 g3 c4>*2").sound("sawtooth").attack(0.3).release(1).lpf(1500).gain(0.35)`,
      `note("<c2 g2>").sound("sine").attack(0.5).release(2).gain(0.4)`
    ]
  },

  cinematic: {
    name: '🎬 시네마틱',
    bpm: 80,
    description: '에픽 스트링 · 영화 음악',
    layers: [
      `sound("bd ~ ~ ~ bd ~ ~ ~").gain(1.3).shape(0.3).room(0.4)`,
      `sound("~ ~ ~ ~ sd ~ ~ ~").gain(1.1).room(0.6)`,
      `note("<d2 d2 a2 bb2>").sound("sawtooth").attack(0.3).release(1.5).lpf(800).gain(0.9).room(0.5)`,
      `note("<[d3,f3,a3] [bb2,d3,f3] [g2,bb2,d3] [a2,c3,e3]>").sound("sawtooth").attack(0.8).release(3).lpf(1800).room(0.9).gain(0.55)`,
      `note("<d5 f5 a5 d6>*2").sound("triangle").attack(0.3).release(2).lpf(3000).room(0.9).delay(0.5).delaytime(0.5).gain(0.4)`
    ]
  },

  pianosolo: {
    name: '🎹 피아노 솔로',
    bpm: 72,
    description: '서정적 · 독주',
    layers: [
      `note("<[c4,e4,g4] ~ [f3,a3,c4] ~ [g3,b3,d4] ~ [c3,e3,g3] ~>").sound("triangle").attack(0.02).decay(0.5).sustain(0.4).release(0.5).lpf(2500).gain(0.55).room(0.6)`,
      `note("<e5 g5 c5 e5 d5 f5 b4 d5 c5 e5 a4 c5 g4 b4 e4 g4>").sound("sine").decay(0.3).sustain(0.3).release(0.5).gain(0.5).room(0.5)`,
      `note("<c2 f2 g2 c3>").sound("triangle").attack(0.05).decay(0.6).sustain(0.5).gain(0.45).room(0.6)`
    ]
  },

  strings: {
    name: '🎻 스트링 앙상블',
    bpm: 75,
    description: '현악 4중주 · 느린 선율',
    layers: [
      `note("<c3 e3 g3 c4>").sound("sawtooth").attack(0.5).release(2).lpf(1800).room(0.8).gain(0.5)`,
      `note("<g3 c4 e4 g4>").sound("sawtooth").attack(0.6).release(2.5).lpf(2000).room(0.85).gain(0.45)`,
      `note("<e4 g4 c5 e5>").sound("sawtooth").attack(0.4).release(2).lpf(2500).room(0.85).gain(0.4)`,
      `note("<c2 g2 f2 c2>").sound("sawtooth").attack(0.7).release(3).lpf(1200).room(0.8).gain(0.5)`
    ]
  },

  horror: {
    name: '👻 호러/서스펜스',
    bpm: 60,
    description: '불협 · 긴장감',
    layers: [
      `note("<c2 c#2 c2 b1>").sound("sawtooth").attack(1).release(3).lpf(sine.range(300,1200).slow(20)).lpq(8).gain(0.55).room(0.95)`,
      `note("<c#5 d5 c#5 c5>*2").sound("sine").struct("1 ~ ~ ~ ~ 1 ~ ~").decay(0.3).sustain(0.5).gain(0.4).room(0.9).delay(0.6).delaytime(0.75).delayfeedback(0.6)`,
      `sound("noise").gain(0.2).hpf(3000).decay(0.5).room(0.8)`,
      `note("<g1 ab1 g1 f#1>").sound("triangle").attack(2).release(4).lpf(600).gain(0.45).room(0.95)`
    ]
  },

  // ──────────── World / Experimental 확장 ────────────
  gugak: {
    name: '🇰🇷 국악',
    bpm: 85,
    description: '계면조 · 산조 장단',
    layers: [
      `sound("bd ~ ~ bd ~ bd ~ ~").gain(1.1)`,
      `sound("~ rim ~ ~ rim ~ rim ~").gain(0.6)`,
      `note("<a3 c4 d4 e4 g4 e4 d4 c4>").sound("triangle").attack(0.05).decay(0.3).sustain(0.5).release(0.5).lpf(2200).gain(0.55).room(0.5)`,
      `note("<a2 e3 a2 d3>").sound("sine").struct("1 ~ ~ 1 ~ 1 ~ ~").gain(0.85).decay(0.5)`,
      `note("<[a3,d4,e4] [g3,c4,d4]>").sound("sawtooth").attack(0.3).release(1).lpf(1500).room(0.7).gain(0.35)`
    ]
  },

  gamelan: {
    name: '🔔 가믈란',
    bpm: 90,
    description: '슬렌드로 스케일 · 말렛',
    layers: [
      `note("<c4 eb4 f4 g4 bb4 g4 f4 eb4>").sound("sine").decay(0.4).sustain(0.2).release(0.5).gain(0.55).room(0.7)`,
      `note("<c5 eb5 f5 g5>*2").sound("triangle").struct("1 ~ 1 ~").decay(0.3).sustain(0.3).gain(0.45).room(0.6).delay(0.3).delaytime(0.375)`,
      `note("<c3 f3 g3 c4>").sound("sine").attack(0.1).decay(0.6).sustain(0.4).gain(0.5).room(0.7)`,
      `sound("cb*4").gain(0.4)`
    ]
  },

  raga: {
    name: '🕉️ 인도 라가',
    bpm: 80,
    description: '마이크로톤 · 탈라',
    layers: [
      `sound("bd ~ bd ~ ~ bd ~ bd").gain(1.1).shape(0.2)`,
      `sound("~ rim rim ~ rim ~ ~ rim").gain(0.55)`,
      `note("<c3 db3 eb3 f3 g3 ab3 bb3 c4>").sound("sawtooth").attack(0.05).decay(0.3).sustain(0.5).release(0.5).lpf(1800).gain(0.55).room(0.5)`,
      `note("c2").sound("sine").attack(0.2).release(3).gain(0.5).room(0.7)`,
      `note("<c4 db4 eb4 f4 g4 f4 eb4 db4>").sound("triangle").struct("1 ~ 1 1 ~ 1 ~ 1").decay(0.25).sustain(0.3).gain(0.45).room(0.6).delay(0.3).delaytime(0.375)`
    ]
  },

  afrobeat: {
    name: '🥁 아프로비트',
    bpm: 115,
    description: '폴리리듬 · 아프리카 타악',
    layers: [
      `sound("bd ~ ~ bd ~ bd ~ ~").gain(1.25)`,
      `sound("~ cp ~ ~ cp ~ cp ~").gain(0.85)`,
      `sound("cb*8").gain("0.4 0.2 0.5 0.2 0.3 0.5 0.2 0.4")`,
      `sound("hh*16").gain("0.3 0.15".fast(2)).pan(sine.range(0.2,0.8).slow(3))`,
      `note("<e2 e2 g2 a2 b2 g2 e2 d2>").sound("sawtooth").struct("1 ~ 1 1 ~ 1 ~ 1").lpf(900).gain(0.9).decay(0.1).sustain(0.3)`,
      `note("<[e3,g3,b3] [a3,c4,e4] [b3,d4,f#4] [g3,b3,d4]>").sound("square").struct("~ 1 ~ 1").decay(0.2).sustain(0).lpf(2200).gain(0.4)`
    ]
  },

  flamenco: {
    name: '💃 플라멩코',
    bpm: 110,
    description: '팔마스 · 프리지안 모드',
    layers: [
      `sound("cp cp cp ~ cp ~ cp cp").gain(0.85)`,
      `sound("bd ~ ~ bd ~ bd ~ ~").gain(1.1)`,
      `note("<e2 f2 g2 a2 b2 a2 g2 f2>").sound("sawtooth").attack(0.01).decay(0.2).sustain(0.4).lpf(1200).gain(0.9)`,
      `note("<[e3,g3,b3] [f3,a3,c4] [g3,b3,d4] [a3,c4,e4]>").sound("square").struct("1 ~ 1 ~ 1 ~ 1 ~").decay(0.25).sustain(0.3).lpf(2200).gain(0.45)`,
      `note("<e5 f5 g5 f5 e5 d5 c5 b4>*2").sound("triangle").struct("1 ~ 1 1 ~ 1 ~ 1").decay(0.2).sustain(0.3).gain(0.4).delay(0.3).delaytime(0.375)`
    ]
  },

  celtic: {
    name: '☘️ 켈틱',
    bpm: 120,
    description: '지그 · 펜타토닉',
    layers: [
      `sound("bd ~ bd ~ ~ bd ~ ~").gain(1.1)`,
      `sound("~ sd ~ ~ sd ~ ~ sd").gain(0.85).room(0.3)`,
      `note("<d4 e4 f#4 a4 b4 a4 f#4 e4 d4 e4 f#4 a4 d5 b4 a4 f#4>").sound("triangle").decay(0.15).sustain(0.4).lpf(2500).gain(0.5).room(0.5)`,
      `note("<d2 a2 d3 a2>").sound("sine").struct("1 ~ 1 ~").gain(0.85).decay(0.3).sustain(0.5)`,
      `note("<[d3,f#3,a3] [g3,b3,d4] [a3,c#4,e4] [d3,f#3,a3]>").sound("sawtooth").attack(0.2).release(0.8).lpf(1800).room(0.6).gain(0.35)`
    ]
  },

  noise: {
    name: '📢 노이즈',
    bpm: 90,
    description: '왜곡 · 피드백',
    layers: [
      `sound("noise*4").gain(0.5).hpf(sine.range(500,5000).slow(8)).shape(0.6)`,
      `sound("bd*2").gain(1.3).shape(0.8).lpf(200)`,
      `note("c1").sound("sawtooth").struct("1 ~ 1 ~").lpf(sine.range(200,1500).slow(4)).gain(0.7).shape(0.8)`,
      `sound("cr*4").gain(0.3).shape(0.5).room(0.6)`
    ]
  },

  generative: {
    name: '🎲 제너러티브',
    bpm: 100,
    description: '확률 기반 · 자동 생성',
    layers: [
      `sound("bd*4").gain(1.2).degradeBy(0.3)`,
      `sound("hh*16").gain(rand.range(0.2,0.5)).degradeBy(0.4)`,
      `note(choose("c3","e3","g3","a3","b3")).sound("triangle").struct("1 ~ 1 1 ~ 1 ~ 1").decay(0.2).sustain(0.4).lpf(rand.range(800,2500)).gain(0.5).room(0.5)`,
      `note(choose("c2","g2","a2","f2")).sound("sine").struct("1 ~ ~ 1 ~ 1 ~ ~").gain(0.85).decay(0.35)`,
      `note(choose("c5","e5","g5","a5","b5","d6")).sound("square").struct("~ 1 ~ 1 1 ~ 1 ~").decay(0.15).sustain(0).lpf(2500).delay(0.4).delaytime(0.375).gain(0.35).degradeBy(0.3)`
    ]
  },

  microtonal: {
    name: '🎶 마이크로톤',
    bpm: 90,
    description: '비표준 음계 · 실험적',
    layers: [
      `note("<c3 c#3 d3 eb3 e3 f3 f#3 g3>").sound("sine").decay(0.3).sustain(0.5).gain(0.55).room(0.6)`,
      `note("<c2 db2 c2 b1>").sound("sawtooth").attack(0.3).release(1.5).lpf(1200).gain(0.5).room(0.7)`,
      `note("<c5 db5 d5 eb5 e5 eb5 d5 db5>").sound("triangle").struct("1 ~ 1 1 ~ 1 ~ 1").decay(0.2).sustain(0.4).gain(0.45).delay(0.4).delaytime(0.5).room(0.6)`
    ]
  },

  concrete: {
    name: '🎞️ 뮤직 콩크레트',
    bpm: 80,
    description: '샘플 콜라주 · 역재생',
    layers: [
      `sound("bd:3 ~ sd:2 ~ hh:4 ~ cp:1 ~").rev().gain(1.1).room(0.5)`,
      `sound("<cr oh rim cb>").gain(0.6).shape(0.3).room(0.4)`,
      `sound("noise*2").gain(0.3).hpf(2000).degradeBy(0.4)`,
      `note("<c3 ~ g3 ~ e3 ~ a3 ~>").sound("square").decay(0.15).sustain(0).lpf(rand.range(500,3000)).gain(0.4).room(0.6).delay(0.45).delaytime(0.375)`
    ]
  }
};

// 카테고리 분류 — 탭 + 드롭다운 UI 용
window.CATEGORIES = {
  edm: {
    label: '🎛️ EDM / Club',
    styles: [
      'ibiza', 'deephouse', 'techhouse', 'futurehouse', 'tribalhouse',
      'detroit', 'minimaltechno', 'industrial', 'techno',
      'uplifting', 'progressive', 'psytrance', 'trance',
      'hardstyle', 'hardcore', 'gabber',
      'dubstep', 'dnb', 'liquiddnb', 'jungle', 'breakbeat'
    ]
  },
  chill: {
    label: '🌆 Chill / Downtempo',
    styles: ['lofi', 'chillhop', 'downtempo', 'triphop', 'balearic', 'ambient', 'newage', 'drone']
  },
  jazz: {
    label: '🎷 Jazz / Soul / Funk',
    styles: [
      'smoothjazz', 'bebop', 'cooljazz', 'fusion', 'jazz',
      'bossa', 'latinjazz',
      'neosoul', 'funksoul', 'motown', 'disco', 'acidjazz'
    ]
  },
  hiphop: {
    label: '🎤 Hip-hop / R&B',
    styles: ['boombap', 'trap', 'drill', 'cloudrap', 'oldschool', 'westcoast', 'rnb']
  },
  rockpop: {
    label: '🎸 Rock / Pop',
    styles: [
      'indierock', 'punkrock', 'grunge', 'metal', 'blues',
      'reggae', 'ska', 'dub',
      'synthwave', 'citypop', 'synthpop', 'kpop', 'jpop', 'disco_pop'
    ]
  },
  classical: {
    label: '🎻 Classical / Cinematic',
    styles: ['neoclassic', 'baroque', 'minimalism', 'cinematic', 'pianosolo', 'strings', 'horror']
  },
  world: {
    label: '🌏 World / Experimental',
    styles: ['gugak', 'gamelan', 'raga', 'afrobeat', 'flamenco', 'celtic', 'glitch', 'noise', 'generative', 'microtonal', 'concrete']
  }
};

