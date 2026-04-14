// AI 생성 엔드포인트 — 자연어(장르/분위기/BPM 등) → Strudel 코드
// Anthropic API를 호출. API 키는 Netlify 환경변수 ANTHROPIC_API_KEY 사용.

const SYSTEM_PROMPT = `당신은 Strudel 라이브 코딩 전문가입니다. 사용자가 한국어 또는 영어로 장르·분위기·BPM·악기 등을 묘사하면 그에 맞는 Strudel 코드를 생성하세요.

엄격한 출력 규칙:
1. 오직 Strudel 코드 블록 하나만 반환. 설명·마크다운·주석 머리말 금지.
2. 코드 구조는 반드시 다음 형태:
   // <스타일 이름> · <BPM> BPM
   cps(<cps값>)

   stack(
     <레이어>,
     <레이어>,
     ...
   ).gain(0.8)
3. cps = BPM / 60 / 4 (소수 4자리).
4. 레이어는 6~9개. 드럼(bd/sd/hh/cp/oh) 2~4줄 + 베이스 1~2줄 + 화성/멜로디 2~4줄.
5. 사용 가능한 함수: sound, note, struct, gain, shape, lpf, hpf, lpq, room, delay, delaytime, delayfeedback, decay, sustain, attack, release, pan, degradeBy, fast, slow, range, sine. Strudel web 런타임 1.0.3 호환.
6. sound 이름은 dirt-samples 기본셋(bd, sd, hh, cp, oh, cr, rim, cb, bd:0~9 등)과 합성음(sine, sawtooth, square, triangle)만 사용.
7. 화음은 [c3,e3,g3] 또는 note("<c3 e3 g3>") 형식. 마이너/메이저/BPM·음역대가 사용자 묘사에 어울리게.
8. 안전을 위해 bd gain 1.5 이하, 전체 .gain(0.8) 권장.

예시 참고 (이비자 하우스, 128 BPM):
// 🏝️ 이비자 하우스 · 128 BPM
cps(0.5333)

stack(
  sound("bd:4*4").gain(1.4).shape(0.4).lpf(120),
  sound("~ cp ~ cp").gain(0.9).room(0.25),
  sound("hh*16").gain(0.4).pan(sine.range(0.3,0.7).slow(4)),
  note("<a1 a1 f1 g1>").sound("sine").struct("1 ~ ~ ~").gain(1.2).decay(0.3).lpf(100),
  note("<[a3,c4,e4] [f3,a3,c4] [c3,e3,g3] [g3,b3,d4]>*2").sound("square").decay(0.2).lpf(2000).delay(0.4).delaytime(0.375).room(0.5).gain(0.35),
  note("<a2 f2 c3 g2>").sound("sawtooth").attack(0.5).release(1).lpf(1000).room(0.8).gain(0.25)
).gain(0.8)

예시 참고 (드럼앤베이스, 174 BPM):
// ⚡ 다크 드럼앤베이스 · 174 BPM
cps(0.725)

stack(
  sound("bd ~ ~ bd ~ ~ bd ~").gain(1.3).shape(0.3),
  sound("~ ~ sd ~ ~ sd ~ ~").gain(1.0).room(0.2),
  sound("hh*16").gain(0.4).pan(sine.range(0.2,0.8).slow(3)).degradeBy(0.2),
  note("<d1 d1 a1 d1 f1 d1 c2 d1>").sound("sawtooth").struct("1 ~ ~ ~ 1 ~ ~ ~").lpf(sine.range(200,800).slow(2)).lpq(15).gain(1.2).decay(0.4).shape(0.6),
  note("<[d3,f3,a3] [c3,f3,a3] [bb2,d3,f3] [a2,c3,e3]>").sound("square").decay(0.15).lpf(1500).room(0.4).delay(0.3).gain(0.4),
  note("<d2 c2 bb1 a1>").sound("sawtooth").attack(0.8).release(1).lpf(800).room(0.7).gain(0.25)
).gain(0.8)`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.' }) };
  }

  let prompt;
  try {
    ({ prompt } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: '잘못된 JSON' }) };
  }
  if (!prompt || typeof prompt !== 'string' || prompt.length > 500) {
    return { statusCode: 400, body: JSON.stringify({ error: 'prompt는 1~500자 문자열이어야 합니다.' }) };
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1200,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      return { statusCode: res.status, body: JSON.stringify({ error: 'Anthropic API 오류', detail: errText }) };
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || '';
    const code = text.replace(/^```[a-z]*\n?/i, '').replace(/\n?```\s*$/, '').trim();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
