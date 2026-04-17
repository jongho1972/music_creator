# music_creator

DJ 관점에서 선별한 10개 장르 프리셋을 Strudel 라이브 코딩으로 15초 완성형 재생하는 정적 웹페이지.

## 구조

- `index.html` — UI (장르 드롭다운, DJ 콘솔, 코드 편집기)
- `app.js` — 렌더링/재생/변주/DJ FX 로직 + 카테고리 탭·드롭다운 바인딩
- `templates.js` — `TEMPLATES`(10종) + `CATEGORIES`(단일 `djtop10`)
- `styles.css` — 다크 테마 스타일링

## DJ Top 10 프리셋

`templates.js`의 `window.CATEGORIES.djtop10.styles`에 정의된 10개 장르:

| 키 | 이름 | BPM | 특성 |
|---|---|---|---|
| `ibiza` | 🏝️ 이비자 하우스 | 128 | 4-on-floor · 펌핑 베이스 |
| `futurehouse` | 🚀 퓨처 하우스 | 128 | 덕킹 베이스 · 필터 스윕 훅 |
| `techno` | 🏭 테크노 | 132 | 인더스트리얼 · 애시드 303 |
| `uplifting` | 🌟 업리프팅 트랜스 | 138 | 슈퍼소우 · 감정 빌드업 |
| `psytrance` | 🌀 사이키트랜스 | 145 | 16분 베이스 · 트위스티 리드 |
| `hardstyle` | 🏛️ 하드스타일 | 150 | 디스토션 킥 · 리버스 베이스 |
| `dnb` | ⚡ 드럼앤베이스 | 174 | 빠른 브레이크 · 리스 베이스 |
| `jungle` | 🌴 정글 | 170 | 아멘 브레이크 · 서브베이스 |
| `trap` | 🔥 트랩 | 140 | 808 · 하이햇 롤 |
| `kpop` | 🎶 K-pop | 128 | 4-on-floor + EDM 드롭 |

### 8-bar phrase 구조 (15초 완성형)

각 프리셋은 `.mask("<1 1 1 1 1 1 1 0>")` 형태 8자리 바이너리로 레이어별 등장·퇴장 타이밍을 제어한다:

- **bars 1-2 (Intro):** 킥 + 서브 패드만
- **bars 3-4 (Build):** 클랩·하이햇 레이어 가세, bar 4에 스네어 롤 필(`sd*16`, `saw.range()` gain 램프)
- **bars 5-7 (Drop):** 크래시 시작, 베이스·리드·코드 풀 스택
- **bar 8 (Outro):** 킥 드롭 → 리드/패드만 잔향으로 숨쉬기

8 cycles ≈ 11~15초 (128 BPM=15s, 174 BPM=11s).

## 동작 방식

1. 사용자가 프리셋 클릭 또는 자유입력 → `matchStyle()`로 키워드 매칭
2. `TEMPLATES[style]` 코드를 가져와 `<pre>`에 표시
3. UTF-8 → base64 인코딩 후 `https://strudel.cc/#{encoded}` URL로 iframe 로드
4. "Strudel에서 재생" 버튼은 새 창으로 열어 play 클릭 가능

## AI 자연어 → 코드 생성

- UI 상단 "🤖 AI 생성" 입력창 → 장르/분위기/BPM/악기 묘사 → `/api/generate` 호출
- 백엔드: `netlify/functions/generate.js` — Anthropic API(claude-haiku-4-5)로 Strudel 코드 생성
- 시스템 프롬프트: 출력 포맷·사용 가능 함수·few-shot 예시(이비자, DnB) 포함
- 환경변수 필수: `ANTHROPIC_API_KEY` (Netlify 대시보드 → Site settings → Environment variables)

## 로컬 실행

정적 페이지만 확인 (AI 생성 제외):
```bash
cd music_creator
python3 -m http.server 8000
```

AI 생성까지 테스트하려면 Netlify CLI 사용:
```bash
cd music_creator
export ANTHROPIC_API_KEY=sk-ant-...
netlify dev   # http://localhost:8888
```

## 배포

- Netlify에 GitHub 연동 자동배포 (`strudel-creator.netlify.app`)
- `netlify.toml`로 functions 디렉토리 지정, `/api/generate` → `/.netlify/functions/generate` 리다이렉트
- 배포 전 Netlify 대시보드에 `ANTHROPIC_API_KEY` 환경변수 설정 필수

## 템플릿 추가 방법

`templates.js`의 `TEMPLATES` 객체에 새 키-값 추가 시:
1. 8-bar phrase 구조 유지 — 각 레이어에 `.mask("<...>")` 패턴으로 진행감 부여
2. 드럼은 `/sound\("(bd|sd|hh|cp|cr|rim|cb|oh)/` 정규식에 매칭되도록 (변주 시드 드럼/멜로디 분리용)
3. `CATEGORIES.djtop10.styles`에 키 추가
