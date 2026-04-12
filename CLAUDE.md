# music_creator

Strudel 라이브 코딩 패턴을 스타일별로 생성해 미리보기/재생하는 정적 웹페이지.

## 구조

- `index.html` — UI (프리셋 버튼, 자유입력, 코드 출력, Strudel iframe)
- `app.js` — 스타일별 Strudel 템플릿 7종 + 키워드 매칭 + base64 인코딩 로드
- `styles.css` — 다크 테마 스타일링

## 지원 스타일

이비자 하우스 / 테크노 / 드럼앤베이스 / 로파이 / 트랩 / 트랜스 / 앰비언트

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
