[English](API.md) | **한국어**

# Secret MCP API 문서

## 개요

Secret MCP는 다섯 개의 MCP 도구를 공개합니다. 두 도구는 GDWEB 디자인 레퍼런스 워크플로 전용이며, 세 도구는 일반 웹 검색과 본문 추출을 제공합니다.

| 도구 | 사용 목적 |
| --- | --- |
| `generate-gdweb-design-indexes` | GDWEB을 검색하고 결과마다 격리된 구현 가능 `DESIGN_INDEX` 문서를 하나씩 생성 |
| `search-gdweb-designs` | 문서를 생성하지 않고 가벼운 GDWEB 레퍼런스 목록 반환 |
| `full-web-search` | 일반 웹을 검색하고 결과 페이지의 전체 본문 추출 |
| `get-web-search-summaries` | 일반 검색 제목, URL과 요약문만 반환 |
| `get-single-web-page-content` | 이미 알고 있는 웹페이지 URL 하나의 본문 추출 |

요청에 레이아웃 분석, 프론트엔드 명세, 구현 계획이나 `DESIGN_INDEX` 생성이 포함되면 `generate-gdweb-design-indexes`를 사용합니다. 이 도구를 `search-gdweb-designs`와 하나의 통합 LLM 요약으로 대체하지 않습니다.

## 전송 방식과 클라이언트 요구사항

서버는 stdio를 통해 MCP를 사용합니다. MCP 클라이언트는 `dist/index.js`를 자식 프로세스로 시작하고 stdin과 stdout을 통해 JSON-RPC 메시지를 교환합니다.

`generate-gdweb-design-indexes`는 연결된 클라이언트가 MCP sampling 지원을 알릴 것을 요구합니다. 각 작품은 `includeContext: "none"`인 별도 `sampling/createMessage` 요청으로 전달됩니다. sampling을 사용할 수 없으면 도구는 명확하게 실패하며 통합 문맥 fallback을 실행하지 않습니다.

나머지 네 도구는 MCP sampling을 요구하지 않습니다.

## 도구: `generate-gdweb-design-indexes`

### 목적

GDWEB을 내부에서 검색하고, 영구 제외 목록을 적용하고, 이미지 근거를 준비한 다음 선택된 결과마다 독립된 `DESIGN_INDEX_gdweb-<strNo>.md` 파일을 하나씩 생성합니다. 각 작품은 해당 작품의 메타데이터, 명세 계약과 준비된 근거 이미지만 포함한 자체 LLM 요청을 받습니다.

### 입력

```json
{
  "query": "항공 프로젝트 사이트",
  "limit": 3,
  "year": 2026,
  "awardOnly": true,
  "includePreviousYear": true,
  "language": "Korean",
  "outputDirectory": "/absolute/path/to/design-index",
  "maxTokens": 32000
}
```

| 필드 | 형식 | 필수 | 기본값 | 제약과 의미 |
| --- | --- | --- | --- | --- |
| `query` | 문자열 | 예 | 없음 | GDWEB에 직접 제출할 자연어 디자인 검색어 |
| `limit` | 숫자 또는 숫자 문자열 | 아니요 | `3` | 격리된 결과 요청과 출력 문서 수, 1부터 10까지의 정수 |
| `year` | 숫자 또는 숫자 문자열 | 아니요 | 실행 시점의 현재 연도 | 대상 등록 또는 수상 연도, 2000부터 2100까지의 정수 |
| `awardOnly` | 불리언 또는 불리언 문자열 | 아니요 | `true` | 비어 있지 않은 GDWEB 수상명 필드 요구 |
| `includePreviousYear` | 불리언 또는 불리언 문자열 | 아니요 | `true` | `year`와 함께 그 직전 연도를 허용 |
| `language` | `English` 또는 `Korean` | 아니요 | `English` | 실행에서 생성되는 모든 문서에 사용할 언어 |
| `outputDirectory` | 문자열 | 아니요 | 해석된 출력 디렉터리 | 이 호출에 한해 `DESIGN_INDEX_OUTPUT_DIR`을 재정의 |
| `maxTokens` | 숫자 또는 숫자 문자열 | 아니요 | `32000` | 각 독립 sampling 호출에 요청할 토큰 제한, 2,000부터 50,000까지의 정수 |

출력 디렉터리는 다음 순서로 결정합니다.

1. 도구에 전달한 `outputDirectory`
2. `DESIGN_INDEX_OUTPUT_DIR` 환경변수
3. 서버 현재 작업 디렉터리 아래의 `design-index`

### 격리 계약

선택된 결과가 `N`개이면 서버는 최대 `N`개의 sampling 요청을 순서대로 실행합니다.

- 각 요청에는 GDWEB 레퍼런스가 정확히 하나만 들어갑니다.
- 각 요청은 `includeContext: "none"`을 사용합니다.
- 이전 작품의 ID, 이미지, 계약이나 생성 문서는 다음 요청에 포함하지 않습니다.
- 한 작품을 위해 준비한 모든 타일은 해당 작품의 요청 안에 함께 유지합니다.
- 서로 다른 작품의 타일은 절대 같은 요청을 공유하지 않습니다.
- 현재 Markdown 응답을 저장한 뒤에만 다음 요청을 시작합니다.
- 바깥 호스트는 모든 문서 본문을 하나로 합친 응답이 아니라 경로와 상태를 받습니다.

### 생성 파일

```text
<output-directory>/.secret-mcp-runs/<run-id>/
├── run.json
├── contracts/
│   └── gdweb-<strNo>.md
├── evidence/
│   ├── gdweb-<strNo>_desktop_01-of-N.jpg
│   └── gdweb-<strNo>_mobile_01-of-N.jpg
└── documents/
    └── DESIGN_INDEX_gdweb-<strNo>.md
```

`run.json`에는 실행 메타데이터, 작품별 상태, 시간, 모델명, 계약 경로, 문서 경로와 근거 측정값이 들어갑니다. 생성 문서 본문을 하나로 합치지 않습니다.

### 텍스트 응답

```text
GDWEB isolated design-index generation completed for "항공 프로젝트 사이트".
Output directory: /absolute/path/to/design-index
Run ID: <run-id>
Run manifest: <absolute-manifest-path>
Viewer: http://127.0.0.1:4317/?run=<run-id>
Search results: 3
Generated: 3
Failed: 0
Active exclusions applied: 0

1. gdweb-27294 - <title>
   Status: generated
   File: <absolute-document-path>
   Model: <sampling-model>
```

선택된 작품 중 하나 이상이 실패하면 도구는 `isError: true`로 설정합니다. 같은 실행에서 성공적으로 생성된 작품은 그대로 기록됩니다.

### 오류

- 잘못된 숫자 또는 불리언 입력
- 연결된 클라이언트가 `sampling/createMessage`를 지원하지 않음
- GDWEB 검색 또는 메타데이터 로드 실패
- 근거 다운로드 또는 이미지 준비 실패
- sampling 시간 초과 또는 sampling 오류
- 독립 LLM 요청이 빈 문서를 반환함
- 출력 디렉터리 또는 파일 쓰기 실패

작품별 sampling 제한 시간 기본값은 180,000ms이며 `MCP_SAMPLING_TIMEOUT_MS`로 변경할 수 있습니다.

## 도구: `search-gdweb-designs`

### 목적

엄격한 연도, 수상 여부와 대시보드 관리 제외 필터를 적용한 뒤 가벼운 GDWEB 레퍼런스 목록을 반환합니다. 이 도구는 근거를 준비하거나 LLM을 호출하거나 `DESIGN_INDEX` 문서를 생성하지 않습니다.

### 입력

```json
{
  "query": "음식 브랜드 사이트",
  "limit": 5,
  "year": 2026,
  "awardOnly": true,
  "includePreviousYear": true
}
```

| 필드 | 형식 | 필수 | 기본값 | 제약과 의미 |
| --- | --- | --- | --- | --- |
| `query` | 문자열 | 예 | 없음 | GDWEB에 직접 제출할 자연어 검색어 |
| `limit` | 숫자 또는 숫자 문자열 | 아니요 | `5` | 결과 수, 1부터 10까지의 정수 |
| `year` | 숫자 또는 숫자 문자열 | 아니요 | 실행 시점의 현재 연도 | 대상 등록 연도, 2000부터 2100까지의 정수 |
| `awardOnly` | 불리언 또는 불리언 문자열 | 아니요 | `true` | 비어 있지 않은 GDWEB 수상명 필드 요구 |
| `includePreviousYear` | 불리언 또는 불리언 문자열 | 아니요 | `true` | 바로 직전 연도 포함 |

### 결과 필드

GDWEB이 값을 제공할 때 각 결과에는 다음 값이 들어갑니다.

| 필드 | 의미 |
| --- | --- |
| `Reference ID` | `gdweb-<strNo>` 형식의 안정적인 로컬 식별자 |
| `GDWEB URL` | GDWEB 작품 상세 페이지 |
| `Registered Date` | GDWEB 메타데이터에서 파싱한 등록일 |
| `Award` | 수상명 |
| `Concept` | 디자인 컨셉 |
| `Primary Color` | GDWEB 주색상 메타데이터 |
| `Production Company` | 제작사 메타데이터 |
| `Desktop Evidence` | GDWEB 등록 데스크톱 이미지 URL |
| `Mobile Evidence` | 사용할 수 있을 때 GDWEB 등록 모바일 이미지 URL |

### 텍스트 응답

```text
GDWEB design search for "음식 브랜드 사이트" with 2 result(s).
Filters: years=2026, 2025 (strict), awardOnly=true

Dashboard exclusions applied before result selection: 1

**1. <title>**
Reference ID: gdweb-<strNo>
GDWEB URL: <url>
Registered Date: <date>
Award: <award>
Concept: <concept>
Primary Color: <color>
Production Company: <company>
Desktop Evidence: <url>
Mobile Evidence: <url>
```

호출자에게 목록만 필요할 때 이 도구를 사용합니다. 레퍼런스를 구현 명세로 만들어야 할 때는 `generate-gdweb-design-indexes`를 사용합니다.

## 도구: `full-web-search`

### 목적

일반 웹을 검색하고, 결과 링크를 따라가고, 완전한 페이지 본문을 추출합니다. 일반 조사에 사용하는 기본 도구입니다.

### 입력

```json
{
  "query": "TypeScript MCP 서버",
  "limit": 5,
  "includeContent": true,
  "maxContentLength": 0
}
```

| 필드 | 형식 | 필수 | 기본값 | 제약과 의미 |
| --- | --- | --- | --- | --- |
| `query` | 문자열 | 예 | 없음 | 일반 웹 검색어 |
| `limit` | 숫자 또는 숫자 문자열 | 아니요 | `5` | 본문을 추출할 결과 수, 1부터 10까지의 정수 |
| `includeContent` | 불리언 또는 불리언 문자열 | 아니요 | `true` | 결과 페이지 본문을 불러올지 여부 |
| `maxContentLength` | 숫자 또는 숫자 문자열 | 아니요 | 자동 | 결과당 최대 글자 수, `0`은 명시적인 제한이 없다는 뜻 |

문자열 형식 인수가 작은 문맥 클라이언트와 관련된 것으로 감지되고 `maxContentLength`가 명시되지 않았을 때 서버는 2,000자 본문 제한을 적용할 수 있습니다. 숫자와 불리언 형식 인수는 일반적으로 클라이언트가 더 큰 응답을 처리할 수 있다는 신호로 취급합니다.

### 텍스트 응답

```text
Search completed for "TypeScript MCP 서버" with 2 results:

**1. <title>**
URL: <url>
Description: <description>

**Full Content:**
<extracted content>

---
```

전체 본문 추출이 실패하면 결과에 본문 미리보기 또는 명시적인 추출 실패 메시지가 들어갑니다.

## 도구: `get-web-search-summaries`

### 목적

일반 웹을 검색하고 링크를 따라가 완전한 페이지 본문을 추출하지 않은 채 결과 제목, URL과 설명을 반환합니다.

### 입력

```json
{
  "query": "반응형 디자인 레퍼런스",
  "limit": 5
}
```

| 필드 | 형식 | 필수 | 기본값 | 제약과 의미 |
| --- | --- | --- | --- | --- |
| `query` | 문자열 | 예 | 없음 | 일반 웹 검색어 |
| `limit` | 숫자 또는 숫자 문자열 | 아니요 | `5` | 요약 결과 수, 1부터 10까지의 정수 |

### 텍스트 응답

```text
Search summaries for "반응형 디자인 레퍼런스" with 2 results:

**1. <title>**
URL: <url>
Description: <description>

---
```

요약문만으로 충분할 때 이 도구를 사용합니다. 실제 페이지 본문이 필요하면 `full-web-search`를 사용합니다.

## 도구: `get-single-web-page-content`

### 목적

먼저 검색을 실행하지 않고 이미 알고 있는 HTTP 또는 HTTPS URL 하나에서 주요 본문을 불러와 추출합니다.

### 입력

```json
{
  "url": "https://example.com/article",
  "maxContentLength": 2000
}
```

| 필드 | 형식 | 필수 | 기본값 | 제약과 의미 |
| --- | --- | --- | --- | --- |
| `url` | URL 문자열 | 예 | 없음 | HTTP 또는 HTTPS 웹페이지 URL |
| `maxContentLength` | 숫자 또는 숫자 문자열 | 아니요 | 자동 | 추출할 최대 글자 수, `0`은 명시적인 제한이 없다는 뜻 |

이 도구는 웹페이지 추출을 위한 것이므로 PDF URL은 거부합니다.

### 텍스트 응답

```text
**Page Content from: https://example.com/article**

**Title:** <title>
**Word Count:** <count>
**Content Length:** <characters> characters

**Content:**
<extracted page content>
```

## GDWEB 검색 정책

GDWEB 도구는 Bing, Brave, DuckDuckGo나 브라우저 자동화 대신 GDWEB 자체 검색 endpoint를 사용합니다.

```text
검색어
  -> POST https://www.gdweb.co.kr/sub/search.asp
  -> Txt_word=<검색어>
  -> 결과 HTML 파싱
  -> 작품 ID와 부문 값 수집
  -> GDWEB 상세 메타데이터 로드
  -> 연도와 수상 필터 적용
  -> 영구 작품 제외 목록 적용
```

`year`를 생략하고 서버를 2026년에 실행하면 기본 허용 연도는 2026년과 2025년입니다. 2026년만 허용하려면 `includePreviousYear: false`로 설정합니다.

## 검색 제외

웹 뷰어와 두 GDWEB 도구가 같은 출력 디렉터리를 사용하면 다음 영구 파일을 공유합니다.

```text
DESIGN_INDEX_OUTPUT_DIR/.secret-mcp/exclusions.json
```

제외 목록은 이후 검색에만 영향을 줍니다. 기존 실행, 근거, 계약과 생성 문서는 삭제하지 않습니다. 제외된 작품 때문에 요청한 결과 수가 줄지 않도록 검색은 필요할 때 추가 후보를 읽으며, 충분한 적격 GDWEB 작품이 있으면 요청한 수를 유지합니다.

## 런타임 환경변수

| 변수 | 기본값 | 목적 |
| --- | --- | --- |
| `DESIGN_INDEX_OUTPUT_DIR` | `./design-index` | 생성 산출물과 제외 목록이 공유하는 디렉터리 |
| `SECRET_MCP_WEB_ORIGIN` | `http://127.0.0.1:4317` | 생성 도구가 반환할 뷰어 URL |
| `MCP_SAMPLING_TIMEOUT_MS` | `180000` | 각 격리 sampling 요청 제한 시간 |
| `MAX_CONTENT_LENGTH` | `500000` | 일반 웹페이지에서 추출할 기본 최대 본문 길이 |
| `DEFAULT_TIMEOUT` | `6000` | 일반 HTTP와 브라우저 제한 시간 |
| `MAX_BROWSERS` | `3` | 일반 추출용 최대 브라우저 풀 크기 |
| `BROWSER_TYPES` | `chromium,firefox` | 일반 추출에 사용할 브라우저 형식 |
| `BROWSER_HEADLESS` | `true` | 일반 추출 브라우저를 headless로 실행할지 여부 |
| `FORCE_MULTI_ENGINE_SEARCH` | `false` | 일반 검색에서 설정된 모든 엔진을 비교할지 여부 |
| `DEBUG_BROWSER_LIFECYCLE` | `false` | 브라우저 생명주기 이벤트를 기록할지 여부 |

## 오류 처리

MCP 도구 실패는 사람이 읽을 수 있는 메시지와 함께 도구 오류 또는 protocol 오류로 반환됩니다. 호출자는 `generate-gdweb-design-indexes`에서 부분적으로 성공한 작품을 보존하고, 작품별 상태는 실행 매니페스트에서 확인하며, 완료된 모든 작품을 하나의 통합 요청으로 다시 시도하지 않아야 합니다.

일반적인 실패 유형은 다음과 같습니다.

- 잘못된 스키마 값
- 검색 endpoint 또는 네트워크 시간 초과
- 검색 rate limit
- 페이지 접근 거부 또는 잘못된 HTML
- 본문 추출 실패
- 근거 이미지 다운로드 또는 decoding 실패
- MCP sampling 기능 없음
- sampling 시간 초과 또는 빈 sampling 결과
- 파일 시스템 권한 또는 쓰기 실패

## 권장 도구 선택

| 사용자 의도 | 도구 |
| --- | --- |
| "레퍼런스를 찾고 각각 레이아웃 명세를 작성해줘" | `generate-gdweb-design-indexes` |
| "GDWEB 링크 몇 개만 보여줘" | `search-gdweb-designs` |
| "이 주제를 조사하고 결과 페이지도 읽어줘" | `full-web-search` |
| "검색 결과 목록만 빠르게 알려줘" | `get-web-search-summaries` |
| "이 정확한 웹페이지를 읽어줘" | `get-single-web-page-content` |
