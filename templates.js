// Music Creator — DJ Top 10 (15초 완성 프리셋)
// 각 템플릿은 8-bar phrase 구조로 설계됨:
//   bars 1-2: Intro    — 킥 + 서브 패드
//   bars 3-4: Build    — 햇/클랩 레이어 + 4마디 스네어 롤 필
//   bars 5-7: Drop     — 풀 스택 (베이스 + 리드 + 코드)
//   bar   8: Outro     — 킥 드롭, 리드/패드만 남아 숨쉬기
// mask("<1 1 1 1 1 1 1 0>") 형태로 각 레이어의 등장/퇴장 타이밍 제어.
// BPM 기준 8 cycles ≈ 11~15초 (128 BPM = 15s, 174 BPM = 11s).

window.TEMPLATES = {
  ibiza: {
    name: '🏝️ 이비자 하우스',
    bpm: 128,
    description: 'DJ 15초 · 선셋 하우스 · 펌핑 베이스 → 브레이크다운',
    layers: [
      // Kick: 1-7 → 8에서 breakdown
      `sound("bd:4*4").mask("<1 1 1 1 1 1 1 0>").gain(1.4).shape(0.4).lpf(120)`,
      // Clap: build부터
      `sound("~ cp ~ cp").mask("<0 0 1 1 1 1 1 0>").gain(0.9).room(0.25)`,
      // Open hat: build 후반
      `sound("~ hh:1 ~ hh:1").mask("<0 0 0 1 1 1 1 0>").gain(0.55).decay(0.15)`,
      // 16th hats: build부터
      `sound("hh*16").mask("<0 0 1 1 1 1 1 0>").gain("0.35 0.2 0.5 0.2".fast(2)).pan(sine.range(0.3, 0.7).slow(4)).degradeBy(0.1)`,
      // Snare roll fill: bar 4
      `sound("sd*16").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.3, 0.9)).room(0.4)`,
      // Crash on drop: bar 5 downbeat
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.7).room(0.5)`,
      // Pumping bass: drop
      `note("<a1 a1 a1 [a1 ~ a1] f1 f1 g1 [g1 a1 g1]>").sound("sine").struct("1 ~ ~ ~ 1 ~ ~ ~").mask("<0 0 0 0 1 1 1 0>").gain(1.2).decay(0.3).sustain(0.8).lpf(100)`,
      // Stabby acid: drop
      `note("<a1 a1 f1 g1>").sound("sawtooth").struct("1 1 ~ 1 1 ~ 1 1").mask("<0 0 0 0 1 1 1 0>").lpf(sine.range(300, 900).slow(4)).lpq(12).gain(0.7).decay(0.08).sustain(0.4).shape(0.3)`,
      // Lead arp: drop → outro sustain
      `note("<[a3 c4 e4 a4] [f3 a3 c4 f4] [c3 e3 g3 c4] [g3 b3 d4 g4]>*2").sound("square").mask("<0 0 0 0 1 1 1 1>").decay(0.2).sustain(0).lpf(sine.range(900, 2800).slow(8)).lpq(10).delay(0.4).delaytime(0.375).delayfeedback(0.5).room(0.5).gain(0.35).pan(sine.range(0.2, 0.8).slow(3))`,
      // Sub pad: 상시 (breakdown에서 숨쉬는 공간)
      `note("<a2 f2 c3 g2>").sound("sawtooth").attack(0.5).release(1).lpf(sine.range(500, 1400).slow(16)).room(0.8).gain(0.25)`
    ]
  },

  futurehouse: {
    name: '🚀 퓨처 하우스',
    bpm: 128,
    description: 'DJ 15초 · 덕킹 베이스 · 필터 스윕 훅',
    layers: [
      `sound("bd:4*4").mask("<1 1 1 1 1 1 1 0>").gain(1.35).shape(0.4)`,
      `sound("~ cp ~ cp").mask("<0 0 1 1 1 1 1 0>").gain(0.85).room(0.3)`,
      `sound("hh*8").mask("<0 0 1 1 1 1 1 0>").gain(0.45)`,
      `sound("sd*16").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.25, 0.85)).room(0.4)`,
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.7).room(0.5)`,
      // Plucky bass (signature future house lead)
      `note("<a1 a1 f1 g1>").sound("square").struct("1 1 1 1 1 1 1 1").mask("<0 0 0 0 1 1 1 0>").lpf(sine.range(500, 2000).slow(8)).gain(0.85).decay(0.12).sustain(0.3).shape(0.4)`,
      // Chord stabs
      `note("<[a3,c4,e4] [f3,a3,c4] [g3,b3,d4] [e3,g3,b3]>*2").sound("sawtooth").mask("<0 0 0 0 1 1 1 1>").attack(0.01).decay(0.3).sustain(0.2).lpf(sine.range(1000, 3500).slow(4)).room(0.4).gain(0.45)`,
      // High lead hook
      `note("<a5 ~ c6 ~ e6 ~ d6 ~>").sound("square").mask("<0 0 0 0 0 1 1 1>").decay(0.3).sustain(0.2).lpf(3500).delay(0.4).delaytime(0.375).room(0.6).gain(0.4)`,
      // Sub pad
      `note("<a2 f2 c3 g2>").sound("sawtooth").attack(0.5).release(1).lpf(1200).room(0.8).gain(0.22)`
    ]
  },

  techno: {
    name: '🏭 테크노',
    bpm: 132,
    description: 'DJ 15초 · 인더스트리얼 · 애시드 303 드라이브',
    layers: [
      `sound("bd:5*4").mask("<1 1 1 1 1 1 1 0>").gain(1.4).shape(0.5).lpf(150)`,
      // Sub punch
      `note("c1").sound("sine").struct("1 ~ ~ ~").mask("<0 1 1 1 1 1 1 0>").gain(1.1).decay(0.2)`,
      `sound("~ cp ~ cp").mask("<0 0 1 1 1 1 1 0>").gain(0.8).room(0.2)`,
      `sound("~ hh:1 ~ hh:1").mask("<0 0 1 1 1 1 1 0>").gain(0.6).decay(0.1)`,
      `sound("hh*16").mask("<0 0 0 1 1 1 1 0>").gain("0.3 0.15 0.4 0.15".fast(2)).pan(sine.range(0.3, 0.7).slow(3)).degradeBy(0.1)`,
      `sound("sd*16").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.25, 0.85)).room(0.35)`,
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.65).room(0.4)`,
      // Acid 303
      `note("<c2 c2 eb2 c2 g1 c2 f2 c2>").sound("sawtooth").struct("1 1 1 1 1 1 1 1").mask("<0 0 0 0 1 1 1 0>").lpf(sine.range(200, 1500).slow(8)).lpq(sine.range(5, 20).slow(6)).gain(0.7).decay(0.08).sustain(0.2).shape(0.5)`,
      // Dark stabs (outro continues)
      `note("<c4 eb4 g4 bb4>").sound("square").mask("<0 0 0 0 1 1 1 1>").decay(0.3).sustain(0).lpf(2000).lpq(8).delay(0.3).delaytime(0.375).gain(0.3)`
    ]
  },

  uplifting: {
    name: '🌟 업리프팅 트랜스',
    bpm: 138,
    description: 'DJ 15초 · 슈퍼소우 아르페지오 · 감정 빌드업',
    layers: [
      `sound("bd:4*4").mask("<1 1 1 1 1 1 1 0>").gain(1.3).shape(0.4)`,
      `sound("~ cp ~ cp").mask("<0 0 1 1 1 1 1 0>").gain(0.85).room(0.35)`,
      `sound("hh*8").mask("<0 0 0 1 1 1 1 0>").gain("0.35 0.5".fast(2))`,
      `sound("sd*16").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.3, 0.95)).room(0.5)`,
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.75).room(0.6)`,
      // Offbeat saw bass
      `note("a1").sound("sawtooth").struct("~ 1 ~ 1 ~ 1 ~ 1").mask("<0 0 0 0 1 1 1 0>").gain(0.9).decay(0.1).sustain(0.3).shape(0.3)`,
      // Supersaw arpeggio (signature)
      `note("<a4 c5 e5 a5 g5 e5 c5 a4>*2").sound("sawtooth").mask("<0 0 0 0 1 1 1 1>").decay(0.2).sustain(0.3).lpf(3500).delay(0.35).delaytime(0.375).delayfeedback(0.45).room(0.5).gain(0.5)`,
      // Chord pad (always on — emotional bed)
      `note("<[a3,c4,e4] [f3,a3,c4] [g3,b3,d4] [e3,g3,b3]>").sound("sawtooth").attack(0.4).release(1).lpf(2000).room(0.8).gain(0.35)`
    ]
  },

  psytrance: {
    name: '🌀 사이키트랜스',
    bpm: 145,
    description: 'DJ 13초 · 16분 베이스 · 필터 스윕 리드',
    layers: [
      `sound("bd:6*4").mask("<1 1 1 1 1 1 1 0>").gain(1.3).shape(0.3).lpf(120)`,
      `sound("~ cp ~ cp").mask("<0 0 1 1 1 1 1 0>").gain(0.7).room(0.2)`,
      `sound("hh*16").mask("<0 0 1 1 1 1 1 0>").gain("0.3 0.2 0.4 0.2".fast(2)).degradeBy(0.1)`,
      `sound("sd*16").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.25, 0.85)).room(0.35)`,
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.65).room(0.4)`,
      // 16분 베이스 (offbeat)
      `note("a1").sound("sawtooth").struct("~ 1 1 1").mask("<0 0 0 0 1 1 1 0>").lpf(sine.range(400, 1800).slow(8)).lpq(18).gain(0.8).decay(0.08).sustain(0.2).shape(0.4)`,
      // Twisted melody (drop → outro)
      `note("<a3 a3 e4 a4 f4 e4 a3 c4 e4 c4 a3 g3>*2").sound("square").mask("<0 0 0 0 1 1 1 1>").decay(0.15).sustain(0).lpf(sine.range(1000, 4000).slow(8)).lpq(15).delay(0.5).delaytime(0.375).delayfeedback(0.6).room(0.5).gain(0.4)`
    ]
  },

  hardstyle: {
    name: '🏛️ 하드스타일',
    bpm: 150,
    description: 'DJ 13초 · 디스토션 킥 · 리버스 베이스',
    layers: [
      `sound("bd:4*4").mask("<1 1 1 1 1 1 1 0>").gain(1.5).shape(0.7).lpf(150)`,
      `sound("~ cp ~ cp").mask("<0 0 1 1 1 1 1 0>").gain(1.0).room(0.3).shape(0.2)`,
      `sound("hh*16").mask("<0 0 0 1 1 1 1 0>").gain(0.4).degradeBy(0.1)`,
      `sound("sd*16").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.3, 0.95)).shape(0.3).room(0.3)`,
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.8).room(0.4)`,
      // Screech bass
      `note("<f1 f1 f1 f1 g1 g1 a1 g1>").sound("sawtooth").struct("1 1 1 1 1 1 1 1").mask("<0 0 0 0 1 1 1 0>").lpf(sine.range(200, 1500).slow(4)).lpq(15).gain(0.9).decay(0.08).sustain(0.3).shape(0.5)`,
      // Epic lead (drop → outro sustain)
      `note("<f4 ~ ab4 ~ c5 ~ bb4 ~>").sound("sawtooth").mask("<0 0 0 0 1 1 1 1>").decay(0.4).sustain(0.3).lpf(2500).lpq(5).delay(0.4).delaytime(0.375).delayfeedback(0.5).room(0.5).gain(0.5)`,
      // Dark pad
      `note("<[f3,ab3,c4] [g3,bb3,d4]>").sound("sawtooth").attack(0.5).release(1.2).lpf(1500).room(0.8).gain(0.3)`
    ]
  },

  dnb: {
    name: '⚡ 드럼앤베이스',
    bpm: 174,
    description: 'DJ 11초 · 빠른 브레이크 · 리스 베이스',
    layers: [
      `sound("bd ~ ~ bd ~ ~ bd ~").mask("<1 1 1 1 1 1 1 0>").gain(1.3).shape(0.3)`,
      `sound("~ ~ sd ~ ~ sd ~ ~").mask("<0 0 1 1 1 1 1 0>").gain(1.0).room(0.2)`,
      `sound("hh*16").mask("<0 0 1 1 1 1 1 0>").gain("0.4 0.2 0.3 0.2".fast(2)).pan(sine.range(0.2, 0.8).slow(3)).degradeBy(0.2)`,
      `sound("sd*16").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.3, 0.9)).room(0.4)`,
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.7).room(0.5)`,
      // Reese bass (drop)
      `note("<d1 d1 a1 d1 f1 d1 c2 d1>").sound("sawtooth").struct("1 ~ ~ ~ 1 ~ ~ ~").mask("<0 0 0 0 1 1 1 0>").lpf(sine.range(200, 800).slow(2)).lpq(15).gain(1.2).decay(0.4).sustain(0.6).shape(0.6)`,
      // Chord stabs
      `note("<[d3 f3 a3] [c3 f3 a3] [bb2 d3 f3] [a2 c3 e3]>").sound("square").mask("<0 0 0 0 1 1 1 1>").decay(0.15).sustain(0).lpf(1500).room(0.4).delay(0.3).delaytime(0.25).gain(0.4)`,
      // Sub pad
      `note("<d2 c2 bb1 a1>").sound("sawtooth").attack(0.8).release(1).lpf(800).room(0.7).gain(0.25)`
    ]
  },

  jungle: {
    name: '🌴 정글',
    bpm: 170,
    description: 'DJ 11초 · 아멘 브레이크 · 서브베이스',
    layers: [
      `sound("bd ~ bd ~ ~ bd ~ ~").mask("<1 1 1 1 1 1 1 0>").gain(1.25).shape(0.35)`,
      `sound("~ sd ~ ~ sd ~ sd sd").mask("<0 0 1 1 1 1 1 0>").gain(1.0).room(0.25)`,
      `sound("hh*16").mask("<0 0 1 1 1 1 1 0>").gain("0.35 0.15".fast(4)).degradeBy(0.25)`,
      `sound("sd*16").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.3, 0.9)).room(0.35)`,
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.7).room(0.45)`,
      // Sub bass
      `note("<e1 e1 g1 e1 a1 e1 d1 e1>").sound("sine").mask("<0 0 0 0 1 1 1 0>").gain(1.3).decay(0.35).sustain(0.7).lpf(150)`,
      // Offbeat stabs
      `note("<[e3,g3,b3] [a3,c4,e4]>").sound("sawtooth").struct("~ 1 ~ 1").mask("<0 0 0 0 1 1 1 1>").decay(0.15).sustain(0).lpf(1500).delay(0.35).gain(0.35)`,
      // Pad
      `note("<e2 a1 g1 d2>").sound("sawtooth").attack(0.6).release(1).lpf(900).room(0.7).gain(0.22)`
    ]
  },

  trap: {
    name: '🔥 트랩',
    bpm: 140,
    description: 'DJ 14초 · 808 베이스 · 하이햇 롤',
    layers: [
      `sound("bd:7").struct("1 ~ ~ 1 ~ ~ 1 ~").mask("<1 1 1 1 1 1 1 0>").gain(1.3).shape(0.3)`,
      `sound("~ ~ ~ ~ cp ~ ~ ~").mask("<0 0 1 1 1 1 1 0>").gain(1.0).room(0.2)`,
      `sound("hh*16").mask("<0 0 1 1 1 1 1 0>").gain("0.4 0.2 0.5 0.2 0.4 0.6 0.3 0.2".fast(2)).pan(sine.range(0.4, 0.6).slow(2))`,
      // Hihat roll fill on bar 4
      `sound("hh*32").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.3, 0.7)).decay(0.05)`,
      `sound("hh:1 ~ ~ ~ ~ ~ hh:1 ~").mask("<0 0 0 0 1 1 1 0>").gain(0.5).decay(0.08)`,
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.7).room(0.5)`,
      // 808 sub
      `note("<f1 f1 ab1 f1 eb1 f1 c2 f1>").sound("sine").struct("1 ~ ~ 1 ~ ~ 1 ~").mask("<0 0 0 0 1 1 1 0>").gain(1.4).attack(0.01).decay(0.6).sustain(0.8).lpf(120)`,
      // Dark lead (drop → outro)
      `note("<f4 ab4 c5 bb4 ab4 f4 eb4 c4>").sound("square").mask("<0 0 0 0 1 1 1 1>").decay(0.4).sustain(0.2).lpf(1800).lpq(5).delay(0.3).delaytime(0.375).delayfeedback(0.4).room(0.6).gain(0.4)`,
      // Low pad
      `note("<f2 eb2 db2 c2>").sound("sawtooth").attack(0.6).release(1).lpf(600).room(0.8).gain(0.3)`
    ]
  },

  kpop: {
    name: '🎶 K-pop',
    bpm: 128,
    description: 'DJ 15초 · 4-on-floor + EDM 드롭 · 캐치 훅',
    layers: [
      `sound("bd:4*4").mask("<1 1 1 1 1 1 1 0>").gain(1.3).shape(0.3).lpf(150)`,
      `sound("~ cp ~ cp").mask("<0 0 1 1 1 1 1 0>").gain(0.9).room(0.25)`,
      `sound("~ hh:1 ~ hh:1").mask("<0 0 1 1 1 1 1 0>").gain(0.55)`,
      `sound("hh*16").mask("<0 0 0 1 1 1 1 0>").gain("0.3 0.2 0.5 0.2".fast(2)).degradeBy(0.1)`,
      `sound("sd*16").mask("<0 0 0 1 0 0 0 0>").gain(saw.range(0.3, 0.9)).room(0.4)`,
      `sound("cr").struct("1 ~ ~ ~ ~ ~ ~ ~").mask("<0 0 0 0 1 0 0 0>").gain(0.75).room(0.5)`,
      // Bass stab
      `note("<a1 a1 f1 g1>").sound("sawtooth").struct("1 ~ 1 1 ~ 1 1 1").mask("<0 0 0 0 1 1 1 0>").lpf(sine.range(400, 1200).slow(4)).lpq(10).gain(0.9).decay(0.08).sustain(0.3).shape(0.3)`,
      // Catch hook lead
      `note("<a4 c5 e5 a5 g5 e5 c5 a4>*2").sound("square").mask("<0 0 0 0 1 1 1 1>").decay(0.2).sustain(0.3).lpf(2500).lpq(5).delay(0.3).delaytime(0.25).delayfeedback(0.4).room(0.4).gain(0.5)`,
      // Emotional chord pad
      `note("<[a3,c4,e4] [f3,a3,c4] [g3,b3,d4] [e3,g3,b3]>").sound("sawtooth").attack(0.3).release(0.8).lpf(1500).room(0.6).gain(0.3)`
    ]
  }
};

// 단일 카테고리 (DJ Top 10)
window.CATEGORIES = {
  djtop10: {
    label: '🎧 DJ Top 10',
    styles: ['ibiza', 'futurehouse', 'techno', 'uplifting', 'psytrance', 'hardstyle', 'dnb', 'jungle', 'trap', 'kpop']
  }
};
