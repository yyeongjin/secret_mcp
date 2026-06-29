# Secret MCP

웹 검색, 페이지 본문 추출, GDWEB 디자인 레퍼런스 검색을 제공하는 TypeScript 기반 MCP(Model Context Protocol) 서버입니다.

카카오 MCP로 제공할 목적입니다.

기본 웹 검색은 Bing, Brave, DuckDuckGo를 순서대로 시도하고, GDWEB 전용 도구는 디자인 레퍼런스 검색에 맞춰 수상작/연도 필터와 원본 사이트 링크 추출을 제공합니다.

## 주요 기능

- `full-web-search`: 웹 검색 후 상위 결과의 본문까지 추출
- `get-web-search-summaries`: 검색 결과 제목, URL, 설명만 빠르게 반환
- `get-single-web-page-content`: 특정 URL의 본문 추출
- `search-gdweb-designs`: GDWEB 디자인 수상작 검색
- `get-gdweb-design-site`: GDWEB 상세 페이지에서 실제 디자인 사이트 URL 추출

## 문서

- [디자인 공모/어워드 사이트 목록](tmp/DESIGN_CONTEST_SITES.md)

## GDWEB 검색 정책

디자인은 시간이 지나면 트렌드성이 떨어지기 때문에 GDWEB 검색은 최신성 필터를 강하게 적용합니다.

- `year`를 생략하면 실행 시점의 현재 연도를 사용합니다.
- 기본적으로 `현재 연도 + 전년도`만 허용합니다.
- 예: 2026년에 실행하면 2026년, 2025년 결과만 통과합니다.
- `includePreviousYear: false`를 주면 해당 연도만 허용합니다.
- 허용 연도 밖 결과는 점수 감점이 아니라 완전히 제외합니다.
- `awardOnly` 기본값은 `true`이며, 수상명이 없는 결과는 제외합니다.

## 설치

요구 사항:

- Node.js 18 이상
- npm

```bash
git clone https://github.com/yyeongjin/secret_mcp.git
cd secret_mcp
npm install
npx playwright install chromium firefox
npm run build
```

Playwright 브라우저 설치는 Bing/Brave 기반 검색에 필요합니다. 설치하지 않아도 DuckDuckGo fallback은 동작할 수 있지만 검색 품질이 크게 떨어질 수 있습니다.

## MCP 설정

MCP 클라이언트 설정에 빌드된 `dist/index.js`를 등록합니다.

Windows 예시:

```json
{
  "mcpServers": {
    "secret-mcp": {
      "command": "node",
      "args": [
        "C:\\path\\to\\secret_mcp\\dist\\index.js"
      ]
    }
  }
}
```

macOS/Linux 예시:

```json
{
  "mcpServers": {
    "secret-mcp": {
      "command": "node",
      "args": [
        "/path/to/secret_mcp/dist/index.js"
      ]
    }
  }
}
```

환경변수까지 같이 넣는 예시:

```json
{
  "mcpServers": {
    "secret-mcp": {
      "command": "node",
      "args": [
        "C:\\path\\to\\secret_mcp\\dist\\index.js"
      ],
      "env": {
        "MAX_CONTENT_LENGTH": "10000",
        "BROWSER_HEADLESS": "true",
        "MAX_BROWSERS": "3",
        "BROWSER_FALLBACK_THRESHOLD": "3"
      }
    }
  }
}
```

## 도구 사용 예시

### 전체 웹 검색

```json
{
  "name": "full-web-search",
  "arguments": {
    "query": "MCP server TypeScript",
    "limit": 3,
    "includeContent": true
  }
}
```

### 검색 요약만 가져오기

```json
{
  "name": "get-web-search-summaries",
  "arguments": {
    "query": "latest web design trends",
    "limit": 5
  }
}
```

### 단일 페이지 본문 추출

```json
{
  "name": "get-single-web-page-content",
  "arguments": {
    "url": "https://example.com",
    "maxContentLength": 10000
  }
}
```

### GDWEB 디자인 검색

```json
{
  "name": "search-gdweb-designs",
  "arguments": {
    "query": "디자인 트렌드 웹사이트",
    "limit": 5,
    "awardOnly": true,
    "includePreviousYear": true
  }
}
```

2026년 기준이면 2026년과 2025년 수상작만 반환합니다.

특정 연도만 강제하려면:

```json
{
  "name": "search-gdweb-designs",
  "arguments": {
    "query": "브랜드 웹사이트",
    "year": 2026,
    "includePreviousYear": false
  }
}
```

### GDWEB 상세에서 원본 사이트 URL 추출

```json
{
  "name": "get-gdweb-design-site",
  "arguments": {
    "strNo": "26889",
    "includeContent": false
  }
}
```

GDWEB 상세 URL을 직접 넘길 수도 있습니다.

```json
{
  "name": "get-gdweb-design-site",
  "arguments": {
    "gdwebUrl": "https://www.gdweb.co.kr/sub/view.asp?Txt_fgbn=5&str_no=26889",
    "includeContent": true,
    "maxContentLength": 10000
  }
}
```

## 런타임 환경변수

MCP 클라이언트의 `env`에 넣어서 동작을 조정할 수 있습니다.

| 이름 | 기본값 | 설명 |
| --- | --- | --- |
| `MAX_CONTENT_LENGTH` | `500000` | 추출할 본문 최대 길이 |
| `DEFAULT_TIMEOUT` | `6000` | HTTP/브라우저 요청 기본 타임아웃(ms) |
| `MAX_BROWSERS` | `3` | 유지할 최대 브라우저 수 |
| `BROWSER_TYPES` | `chromium,firefox` | 사용할 Playwright 브라우저 종류 |
| `BROWSER_HEADLESS` | `true` | 브라우저를 headless로 실행할지 여부 |
| `BROWSER_FALLBACK_THRESHOLD` | `3` | axios 실패 후 브라우저 fallback을 사용할 기준 |
| `ENABLE_RELEVANCE_CHECKING` | `true` | 검색 결과 품질 점수 계산 사용 여부 |
| `RELEVANCE_THRESHOLD` | `0.3` | 검색 결과 최소 품질 점수 |
| `FORCE_MULTI_ENGINE_SEARCH` | `false` | 모든 검색엔진을 시도한 뒤 최고 결과 선택 |
| `DEBUG_BROWSER_LIFECYCLE` | `false` | 브라우저 생명주기 로그 출력 |
| `DEBUG_BING_SEARCH` | `false` | Bing 검색 디버그 로그 출력 |

## 개발 명령어

```bash
npm install
npx playwright install chromium firefox
npm run build
npm run lint
npm run dev
```

Windows PowerShell 실행 정책 때문에 `npm`이 막히면 `npm.cmd`를 사용합니다.

```powershell
npm.cmd install
npx.cmd playwright install chromium firefox
npm.cmd run build
```

## GitHub Actions

이 레포에는 세 가지 워크플로가 있습니다.

### CI

파일: `.github/workflows/ci.yml`

실행 시점:

- `main` 브랜치 push
- `main` 대상 pull request
- 수동 실행

수행 작업:

- `npm ci`
- `npm run build`
- `npm run lint`
- `npm pack --dry-run`

필요한 GitHub secret 또는 환경변수:

- 없음

### GDWEB Smoke Test

파일: `.github/workflows/gdweb-smoke.yml`

실행 시점:

- 수동 실행만 지원

수동 입력값:

| 이름 | 기본값 | 설명 |
| --- | --- | --- |
| `query` | `디자인 트렌드 웹사이트` | GDWEB 검색 쿼리 |
| `year` | 빈 값 | 대상 연도. 비워두면 현재 연도 사용 |

수행 작업:

- `npm ci`
- `npx playwright install chromium firefox`
- `npm run build`
- GDWEB 검색 smoke test 실행

필요한 GitHub secret 또는 환경변수:

- 없음

주의:

- 실제 검색엔진과 GDWEB에 접근하므로 네트워크 상태나 검색엔진 차단에 따라 실패할 수 있습니다.
- 이 워크플로는 기본 CI에 넣지 않고 수동 실행으로 분리했습니다.

### Release

파일: `.github/workflows/release.yml`

실행 시점:

- `v*` 태그 push
- 수동 실행

수동 입력값:

| 이름 | 설명 |
| --- | --- |
| `tag` | 릴리스 태그. 예: `v0.3.1` |
| `prerelease` | GitHub Release를 prerelease로 표시할지 여부 |

수행 작업:

- `npm ci`
- `npm run build`
- `npm run lint`
- `npm pack`
- GitHub Release 생성 및 `.tgz` 업로드

필요한 GitHub secret 또는 환경변수:

- 별도 secret 없음
- GitHub Actions가 자동 제공하는 `GITHUB_TOKEN` 사용

필요한 레포 설정:

- GitHub 저장소의 `Settings > Actions > General > Workflow permissions`에서 `Read and write permissions`가 필요할 수 있습니다.
- `Allow GitHub Actions to create and approve pull requests`는 현재 워크플로에는 필수는 아닙니다.

릴리스 태그 예시:

```bash
git tag v0.3.1
git push origin v0.3.1
```

## Dependabot

파일: `.github/dependabot.yml`

대상:

- npm 의존성
- GitHub Actions 버전

주기:

- 매주

필요한 secret:

- 없음

## 다른 컴퓨터에서 사용하는 절차

```bash
git clone https://github.com/yyeongjin/secret_mcp.git
cd secret_mcp
npm install
npx playwright install chromium firefox
npm run build
```

그 다음 MCP 클라이언트 설정에서 `dist/index.js`를 지정하면 됩니다.

## 주의사항

- `workflow/` 폴더는 다른 레포에서 가져온 이식용 원본이라 `.gitignore` 처리되어 있습니다.
- `dist/`는 빌드 산출물이라 git에는 올라가지 않습니다.
- npm 패키지 tarball에는 `dist`, `docs`, `README.md`, `LICENSE`, `mcp.json`만 포함되도록 `package.json`의 `files` 필드로 제한했습니다.
- GDWEB은 `robots.txt` 정책상 대량 크롤링보다는 검색 결과로 발견된 상세 페이지를 최소 파싱하는 방식이 안전합니다.
