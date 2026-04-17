# 🎼 Music Creator

DJ 관점에서 엄선한 10개 장르 프리셋을 Strudel 라이브 코딩으로 15초 완성형 재생하는 정적 웹앱.

**Live:** https://strudel-creator.netlify.app

## 특징

- **DJ Top 10 프리셋** — 이비자·퓨처하우스·테크노·업리프팅 트랜스·사이키트랜스·하드스타일·드럼앤베이스·정글·트랩·K-pop
- **15초 완성 8-bar phrase 구조** — 모든 프리셋이 `.mask("<1 1 1 1 1 1 1 0>")` 형태 8비트 패턴으로 intro(2) → build(2) → drop(3) → outro(1) 흐름을 자동 전개 (bar 4 스네어 롤 필 + bar 5 크래시 + bar 8 킥 드롭)
- **🤖 AI 생성** — 자연어(장르·분위기·BPM·악기)로 묘사하면 Claude Haiku가 동일한 15초 완성 구조의 Strudel 코드를 작성 (Netlify Functions + Anthropic API)
- **🎛️ 라이브 DJ 컨트롤**
  - BUILD / DROP 퍼포먼스 버튼
  - 믹스 (A ↔ B 두 장르 동시 재생) + 크로스페이더 + 변주
  - LPF · HPF · 리버브 · 딜레이 · 스윙 · 크러시 · 템포 · 볼륨 슬라이더 (FX 호버 툴팁)
  - 사이드체인 · 드럼/멜로디 뮤트 · 리셋
- **단일 재생 토글** (▶ ↔ ⏸) + Space 단축키
- **코드 에디터** 접힘 상태로 고급 사용자에게만 노출, 편집 후 즉시 재평가

## 기술 스택

- Vanilla HTML / CSS / JS (빌드 과정 없음)
- [@strudel/web](https://strudel.cc/) 1.0.3 (ESM CDN 로드)
- tidalcycles dirt-samples (기본 드럼 뱅크)
- Netlify Functions (AI 생성 서버리스) + Anthropic Claude Haiku 4.5

## 로컬 실행

정적 페이지만 확인 (AI 생성 제외):
```bash
python3 -m http.server 8000
# http://localhost:8000 접속
```

AI 생성까지 테스트하려면 Netlify CLI:
```bash
export ANTHROPIC_API_KEY=sk-ant-...
netlify dev   # http://localhost:8888
```

## 구조

- `index.html` — UI 쉘 (now-playing + 프리셋 + AI 생성 + DJ 콘솔 + 코드 details)
- `templates.js` — 10개 장르 템플릿 + `CATEGORIES.djtop10`
- `app.js` — 렌더링, 변주, 믹싱, 재생/정지 토글, 크로스페이더 활성화 로직
- `styles.css` — 다크 테마 + 호버 툴팁 + 모바일 대응
- `netlify/functions/generate.js` — AI 생성 엔드포인트 (8-bar phrase 강제 프롬프트)
- `netlify.toml` — `TZ=Asia/Seoul date` 출력으로 `deploy-time.txt` 생성 (footer 표시용)

## 배포

Netlify가 GitHub `main` 푸시마다 자동 배포. 빌드 단계에서 `deploy-time.txt`를 생성해 클라이언트가 fetch로 "최종 배포: YYYY년 MM월 DD일 HH:MM"을 footer에 표시.
