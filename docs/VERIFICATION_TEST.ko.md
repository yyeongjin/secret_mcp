[English](VERIFICATION_TEST.md) | **한국어**

# Secret MCP 재검증 기록

## 목적

공개 저장소를 새로 clone한 환경에서도 다음 동작이 재현되는지 확인한다.

- 의존성 설치와 보안 감사
- TypeScript 빌드와 ESLint 검사
- GDWEB 검색 결과 제외 처리
- 검색 결과마다 서로 분리된 MCP sampling 요청 생성
- 결과별 `DESIGN_INDEX` 문서, 요청 계약, 근거 이미지와 실행 매니페스트 저장
- Design Index Viewer 기동과 브라우저 표시

## 검증 기준

- 검증일: 2026-08-03 KST
- 기준 브랜치: `main`
- 기준 커밋: `ac8523041ad3a556498a2341b36f02c990bba561`
- 작업 브랜치: `test/verification-20260803`
- 운영체제: Darwin 25.4.0 arm64
- Node.js: `v24.11.1`
- npm: `11.6.2`

## 새 clone 절차

```bash
git clone https://github.com/yyeongjin/secret_mcp.git
cd secret_mcp
git switch -c test/verification-20260803
npm ci
```

첫 `npm ci`는 설치에는 성공했지만 `sanitize-html 2.13.1`의 중간 위험도 취약점 1건을 보고했다. 해당 문제는 불완전한 URI scheme 검증과 관련된 [GHSA-vccv-cmxp-4j9h](https://github.com/advisories/GHSA-vccv-cmxp-4j9h)이다.

`sanitize-html 2.17.6`은 Node.js 22.12 이상을 요구하므로 이 프로젝트의 Node.js 20.19 지원 범위와 맞지 않는다. 취약점이 수정됐고 별도의 상향된 Node.js engine 제약이 없는 `2.17.5`를 정확한 버전으로 고정했다.

```bash
npm install --save-exact sanitize-html@2.17.5
```

## 수행 결과

| 검사 | 명령 또는 대상 | 결과 |
| --- | --- | --- |
| 의존성 재현 | `npm ci` | 성공 |
| 보안 감사 | `npm audit` | 취약점 0건 |
| TypeScript | `npm run build` | 성공 |
| ESLint | `npm run lint` | 오류 0건, 경고 0건 |
| MCP 격리 | `npm run smoke:gdweb-isolation` | 성공 |
| Viewer API | `GET /api/health` | HTTP 200, `ok: true` |
| Viewer 화면 | `http://127.0.0.1:4318/` | 제목과 주요 영역 렌더링 성공 |
| 브라우저 콘솔 | Viewer 최초 로드 | 오류 0건, 경고 0건 |

## MCP 격리 테스트 근거

최종 스모크 테스트 실행 ID는 `2026-08-03T07-13-43-930Z-a5137d93`이다.

- 검색어 `금융`으로 GDWEB 검색을 수행했다.
- `gdweb-26905`를 실행 시작 전 제외 목록에 추가했다.
- 제외된 작품은 sampling 요청에 포함되지 않았다.
- `gdweb-26522`와 `gdweb-24516`을 서로 다른 두 요청으로 처리했다.
- 각 요청은 `includeContext: none`을 사용했다.
- 각 요청에는 해당 작품의 이미지 근거만 각각 5장, 4장 포함됐다.
- 다른 작품의 Reference ID가 요청 문맥에 섞이지 않는지 검사했다.
- 결과 문서 `DESIGN_INDEX_gdweb-26522.md`와 `DESIGN_INDEX_gdweb-24516.md`가 각각 생성됐다.
- 실행 매니페스트에 작품별 문서, 계약, 이미지 근거, crop 좌표와 대표 색상이 기록됐는지 검사했다.

이 스모크 테스트는 실제 GDWEB 검색과 이미지 근거 준비를 사용한다. LLM 응답은 테스트 클라이언트의 `isolated-smoke-model` fixture로 생성하므로, 외부 LLM의 디자인 분석 품질이 아니라 MCP 요청 격리와 산출물 계약을 검증한다.

## Viewer 검증 절차

```bash
SECRET_MCP_WEB_PORT=4318 npm run web
curl --fail http://127.0.0.1:4318/api/health
```

브라우저에서 다음 항목을 확인했다.

- 문서 제목: `Secret MCP Design Index Viewer`
- 상단 제목: `Secret MCP`
- 생성 작업, 작품별 문서, 명세서, 근거 이미지, 요청 계약, 생성 기록 영역 표시
- 초기 실행 데이터가 없을 때 빈 상태 문구 표시
- 브라우저 콘솔 오류 및 경고 없음

## 실제 음식 레퍼런스 시나리오

사용자 시나리오에 따라 2025~2026 GDWEB 수상작에서 음식 도메인 레퍼런스 세 개를 준비하고, 작품마다 서로 다른 독립 LLM 작업으로 분석했다.

| Reference ID | 작품 | 근거 이미지 | DESIGN_INDEX | 독립 작업 결과 |
| --- | --- | ---: | ---: | --- |
| `gdweb-26387` | 영커피 | 데스크톱 3장 | 1,020줄 | 다른 Reference ID 없음 |
| `gdweb-26788` | 요리엔 | 데스크톱 4장, 모바일 1장 | 869줄 | 다른 Reference ID 없음 |
| `gdweb-26853` | 꾸블랙치킨 | 데스크톱 7장, 모바일 1장 | 1,690줄 | 다른 Reference ID 없음 |

세 작업에는 각각 자기 작품의 요청 계약과 이미지 근거만 전달했다. 각 문서는 페이지/route 인벤토리, 공유 shell, 내비게이션, 페이지별 좌표, 섹션 deep dive, 컴포넌트, HEX/RGB/HSL 색상, 타이포그래피, 자산, `1440/1280/1024/768/390/360px` 반응형 행렬, 인터랙션, 접근성, 데이터 모델, 아키텍처, 작업 그래프, 페이지별 QA와 불확실성까지 19개 필수 섹션을 포함한다.

큰 근거 이미지를 포함한 `gdweb-26853` 준비 과정에서 MCP SDK의 sampling 기본 제한 60초가 확인됐다. `MCP_SAMPLING_TIMEOUT_MS`는 처음 `180000ms`로 추가됐다. 현재 런타임 기본값은 엄격한 다중 페이지 `DESIGN_INDEX`가 작품마다 `131072`토큰 출력 예산을 요청하는 점을 반영해 `1800000ms`다.

생성된 문서:

- [영커피 DESIGN_INDEX](generated/food-godot-20260803/DESIGN_INDEX_gdweb-26387.md)
- [요리엔 DESIGN_INDEX](generated/food-godot-20260803/DESIGN_INDEX_gdweb-26788.md)
- [꾸블랙치킨 DESIGN_INDEX](generated/food-godot-20260803/DESIGN_INDEX_gdweb-26853.md)

## 다시 실행하기

```bash
npm ci
npm audit
npm run build
npm run lint
npm run smoke:gdweb-isolation
SECRET_MCP_WEB_PORT=4318 npm run web
```

다른 터미널에서 Viewer 상태를 확인한다.

```bash
curl --fail http://127.0.0.1:4318/api/health
```

## 합격 조건

검증은 다음 조건을 모두 만족할 때 통과한다.

1. `npm audit`이 취약점 0건을 반환한다.
2. TypeScript와 ESLint가 종료 코드 0으로 끝난다.
3. 제외된 Reference ID가 sampling 요청에 포함되지 않는다.
4. 작품 수와 독립 sampling 요청 수와 `DESIGN_INDEX` 문서 수가 같다.
5. 각 요청에 다른 작품의 Reference ID가 포함되지 않는다.
6. Viewer health API와 첫 화면이 정상 응답한다.
7. Viewer 브라우저 콘솔에 오류와 경고가 없다.
8. 각 문서에는 자기 Reference ID만 존재하고 다른 작품 ID가 섞이지 않는다.
