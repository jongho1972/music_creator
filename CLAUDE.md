# music_creator

Strudel 라이브 코딩 패턴을 스타일별로 생성해 미리보기/재생하는 정적 웹페이지.

## 구조

- `index.html` — UI (카테고리 탭 + 장르 드롭다운, DJ 콘솔, 코드 편집기)
- `app.js` — 렌더링/재생/변주/DJ FX 로직 + 카테고리 탭·드롭다운 바인딩
- `templates.js` — `TEMPLATES`(81종) + `CATEGORIES`(7개 분류) + 일부 장르의 `variants` 필드
- `styles.css` — 다크 테마 스타일링

## 카테고리 구조 (7개 / 81개 프리셋)

`templates.js`의 `window.CATEGORIES`에 정의. 탭 클릭 → 해당 카테고리 드롭다운 재구성 + 첫 장르 자동 재생성.

- **edm** 🎛️ EDM/Club (23) — 하우스(ibiza, deephouse, techhouse, futurehouse, tribalhouse), 테크노(detroit, techno), 트랜스(uplifting, progressive, psytrance, trance), 하드(hardstyle, hardcore, gabber), 베이스(dubstep, dnb, liquiddnb, jungle, breakbeat), 신규(ukgarage, phonk, amapiano, hyperpop)
- **chill** 🌆 Chill/Downtempo (8) — lofi, chillhop, downtempo, triphop, balearic, ambient, vaporwave, futuregarage
- **jazz** 🎷 Jazz/Soul/Funk (11) — smoothjazz, bebop, cooljazz, fusion, jazz, bossa, latinjazz, neosoul, funksoul, motown, disco
- **hiphop** 🎤 Hip-hop/R&B (8) — boombap, trap, drill, cloudrap, oldschool, westcoast, rnb, jerseyclub
- **rockpop** 🎸 Rock/Pop (15) — indierock, punkrock, grunge, metal, blues, reggae, ska, dub, synthwave, citypop, synthpop, kpop, jpop, disco_pop, shoegaze
- **classical** 🎻 Classical/Cinematic (5) — neoclassic, baroque, cinematic, strings, horror
- **world** 🌏 World/Experimental (11) — gugak, gamelan, raga, afrobeat, flamenco, celtic, reggaeton, bhangra, glitch, noise, generative

### 변주(variants) 시스템

`TEMPLATES[key].variants`는 선택 필드로, 대체 레이어 배열들의 배열. `🎲 변주` 버튼 클릭 시 시드로 `[기본, ...variants]` 중 하나를 먼저 선택하고 이어서 기존 멜로디 레이어 셔플을 적용한다. 현재 variants 보유: ibiza(2), lofi(2), trap(1), trance(1), synthwave(1).

## 동작 방식

1. 사용자가 프리셋 클릭 또는 자유입력 → `matchStyle()`로 키워드 매칭
2. `TEMPLATES[style]` 코드를 가져와 `<pre>`에 표시
3. UTF-8 → base64 인코딩 후 `https://strudel.cc/#{encoded}` URL로 iframe 로드
4. "Strudel에서 재생" 버튼은 새 창으로 열어 play 클릭 가능

## 로컬 실행

```bash
cd music_creator
python3 -m http.server 8000
# http://localhost:8000 접속
```

순수 정적 페이지라 빌드 불필요. Netlify drag & drop으로 배포 가능.

## 템플릿 추가 방법

`app.js`의 `TEMPLATES` 객체에 새 키-값 추가, `KEYWORDS`에 매칭어 추가, `index.html`의 `.preset-buttons`에 버튼 추가.
