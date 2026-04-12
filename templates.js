// EDM Creator — 스타일별 Strudel 템플릿 (web 런타임 호환)
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
  }
};

