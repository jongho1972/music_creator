# 🎵 EDM Creator

Strudel 라이브 코딩 음악 패턴을 스타일별로 생성해 브라우저에서 바로 재생하는 정적 웹앱.

## 특징

- **19가지 프리셋 스타일**: 이비자 하우스, 테크노, DnB, 로파이, 트랩, 트랜스, 앰비언트, 신스웨이브, 딥하우스, 디스코펑크, 펑크소울, 레게, 재즈, 하드스타일, 사이키트랜스, 브레이크비트, 네오클래식, 글리치/IDM, K-pop
- **자유입력**: 한국어/영어 키워드로 스타일 매칭 ("몽환적인 신스웨이브" → ambient)
- **믹스**: 두 스타일의 드럼 + 멜로디 조합
- **변주**: 시드 기반 레이어 셔플로 재생성마다 다른 패턴
- **실시간 볼륨/편집**: 슬라이더와 코드 편집 즉시 반영
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

- `index.html` — UI 쉘
- `templates.js` — 19개 스타일 템플릿 + 키워드 매칭
- `app.js` — 렌더링, 변주, 믹싱, 재생 제어
- `styles.css` — 다크 테마

## 배포

Netlify에서 이 저장소를 Import하면 자동 배포됩니다. 빌드 명령어 없음, publish 디렉토리는 루트(`/`).
