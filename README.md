# 🎼 Music Creator

Strudel 라이브 코딩 음악 패턴을 장르별로 생성해 브라우저에서 바로 재생하는 정적 웹앱.

## 특징

- **7개 카테고리 / 80개 장르 프리셋**
  - 🎛️ EDM/Club — 하우스, 테크노, 트랜스, 하드, 베이스 (21종)
  - 🌆 Chill/Downtempo — 로파이, 칠합, 트립합, 앰비언트, 드론 (8종)
  - 🎷 Jazz/Soul/Funk — 비밥, 보사노바, 네오소울, 애시드재즈 (12종)
  - 🎤 Hip-hop/R&B — 붐뱁, 트랩, 드릴, 웨스트코스트 (7종)
  - 🎸 Rock/Pop — 인디록, 메탈, 블루스, 시티팝, J-pop (14종)
  - 🎻 Classical/Cinematic — 바로크, 미니멀리즘, 시네마틱, 호러 (7종)
  - 🌏 World/Experimental — 국악, 가믈란, 인도 라가, 플라멩코, 노이즈 (11종)
- **카테고리 탭 + 장르 드롭다운**으로 빠른 탐색
- **랜덤 장르 버튼**: 전체 프리셋 중 무작위 선택
- **DJ 콘솔**: 필터 / 리버브 / 딜레이 / 크러시 / 템포 / 뮤트 실시간 조작
- **믹스**: 두 스타일의 드럼 + 멜로디 조합
- **변주**: 시드 기반 레이어 셔플로 재생성마다 다른 패턴
- **실시간 편집**: 생성 코드 직접 수정 후 즉시 재생
- **Space 단축키**: 재생/정지 토글

## 기술 스택

- Vanilla HTML/CSS/JS (빌드 과정 없음)
- [@strudel/web](https://strudel.cc/) 1.0.3 (ESM CDN 로드)
- tidalcycles dirt-samples (기본 드럼 뱅크)

## 로컬 실행

```bash
python3 -m http.server 8000
# http://localhost:8000 접속
```

## 구조

- `index.html` — UI 쉘 (카테고리 탭 + 드롭다운 + DJ 콘솔)
- `templates.js` — 80개 장르 템플릿 + CATEGORIES 분류
- `app.js` — 렌더링, 변주, 믹싱, 재생 제어
- `styles.css` — 다크 테마

## 배포

Netlify에서 이 저장소가 자동 배포됩니다. 빌드 명령어 없음, publish 디렉토리는 루트(`/`).
