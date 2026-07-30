# DESIGN INDEX — gdweb-24234 / 파라타항공 브랜드 사이트

- OBSERVED — 스키마: `secret-mcp/design-index/v2`
- OBSERVED — 기준 작품: `gdweb-24234`, 등록일 `2025-03-04`, `WINNER PRIZE`
- OBSERVED — 메타데이터 콘셉트: 역동적, 모던, 신뢰적
- OBSERVED — 메타데이터 주조색: BLUE, WHITE
- INFERRED — 이 문서는 제공된 계약서와 E01–E05 증거만으로 재구현 가능한 수치 명세를 제공하며, 원 브랜드 자산과 문구는 구조 분석용으로만 식별한다.

## 1. Reconstruction Goal and Scope

- OBSERVED — 대상은 서로 다른 라우트의 콜라주가 아니라 동일한 브랜드 소개 페이지를 세로로 캡처한 한 개의 장문 페이지다. 신뢰도 HIGH.
- MEASURED — 데스크톱 기준 준비 캔버스는 `1200 × 4895px`, 원본 매핑 캔버스는 `1920 × 7832px`, 배율은 `0.625`다.
- MEASURED — 모바일 기준 준비/원본 캔버스는 `243 × 991px`, 배율은 `1`이다.
- INFERRED — 충실도 목표는 주요 섹션 외곽선 `±4px`, 반복 간격 `±2px`, 평면 UI 색상 `ΔE ≤ 3`, 이미지 초점 위치 `±2%`, 텍스트 줄바꿈 `±1줄`이다. 신뢰도 HIGH.
- INFERRED — 지원 뷰포트는 `1440`, `1280`, `1024`, `768`, `390`, `360 CSS px`이며, `1920px`은 증거 원본 검수용 보조 뷰포트다.
- INFERRED — 구현은 프레임워크에 독립적이어야 하며 시맨틱 HTML, CSS Grid/Flexbox, 반응형 이미지, 키보드 내비게이션을 요구한다.
- OBSERVED — 구현 범위는 P-01 단일 페이지, 고정 헤더, 8개 콘텐츠 구간, 푸터다.
- UNKNOWN — 실제 URL 경로, 서버 렌더링 방식, 원본 폰트 파일, 실제 동영상 여부, 스크롤 연출은 정적 증거로 확인되지 않는다.
- INFERRED — 비목표는 원 로고·상표·사진·카피의 복제, 보이지 않는 예약/로그인 기능 발명, 보이지 않는 하위 페이지 제작이다.

## 2. Evidence Inventory and Coordinate System

| 판정 | Evidence ID | 종류/파트 | 원본 크기 | 준비 크기 | 준비 crop | 원본 매핑 crop | 배율 | 보이는 범위 | 한계 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MEASURED | E01 | desktop 01/04 | 1920×7832 | 1200×4895 | x0 y0 w1200 h1600 | x0 y0 w1920 h2560 | 0.625 | P01-S01–S03 상단 | y1520–1600은 E02와 중복 |
| MEASURED | E02 | desktop 02/04 | 1920×7832 | 1200×4895 | x0 y1520 w1200 h1600 | x0 y2432 w1920 h2560 | 0.625 | P01-S03 하단–S05 | y1520–1600, y3040–3120 중복 |
| MEASURED | E03 | desktop 03/04 | 1920×7832 | 1200×4895 | x0 y3040 w1200 h1600 | x0 y4864 w1920 h2560 | 0.625 | P01-S05 하단–S08 | y3040–3120, y4560–4640 중복 |
| MEASURED | E04 | desktop 04/04 | 1920×7832 | 1200×4895 | x0 y4560 w1200 h335 | x0 y7296 w1920 h536 | 0.625 | P01-S08 하단–S09 | y4560–4640은 E03와 중복 |
| MEASURED | E05 | mobile 01/01 | 243×991 | 243×991 | x0 y0 w243 h991 | x0 y0 w243 h991 | 1 | P01-S01–S09 전체 | 축소 캡처라 작은 글자의 정확한 자형 판독 제한 |

- MEASURED — 모든 증거 좌표의 원점은 이미지 좌상단 `(0,0)`, x는 오른쪽, y는 아래쪽이다.
- MEASURED — 데스크톱 정규화 좌표는 `E01 y+0`, `E02 y+1520`, `E03 y+3040`, `E04 y+4560`으로 계산한다.
- MEASURED — 원본 데스크톱 좌표는 준비 좌표에 `1.6`을 곱한다. 예: 준비 `x120`은 원본 `x192`.
- MEASURED — 겹침은 E01/E02 `80px`, E02/E03 `80px`, E03/E04 `80px`이며 콘텐츠를 한 번만 센다.
- OBSERVED — E01 y638, E02 로컬 y349, E03 로컬 y58 부근의 헤더 재등장은 별도 섹션이 아니라 장문 캡처 과정에서 고정 헤더가 반복 기록된 흔적이다. 신뢰도 HIGH.
- INFERRED — 이후 `D(x,y,w,h)`는 데스크톱 준비 캔버스, `M(x,y,w,h)`는 E05 모바일 좌표를 뜻한다.

## 3. Site Map and Page/Route Inventory

| 판정 | Page ID | route/name | 목적 | 증거 | shared shell | Desktop | Mobile | confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OBSERVED | P-01 | `UNKNOWN` / 브랜드 소개 장문 페이지 | 철학, 서비스, 가치, 이름, 시각 자산, 문의/채용 전달 | E01–E05 | Shell-A, 투명/다크 고정 헤더 | 있음 | 있음 | HIGH |

- OBSERVED — 기본 페이지는 P-01이며 페이지 전체가 직접 보이는 유일한 라우트다.
- OBSERVED — 활성 내비게이션은 우측 챕터 라벨로 표현되며 증거에 `02. 기업 철학`, `04. 최선 여객 서비스`, `06. 브랜드 네이밍`이 보인다.
- UNKNOWN — `01`, `03`, `05` 챕터 이름과 각 라벨의 클릭 가능 여부는 보이지 않는다.
- UNKNOWN — Contact Us와 Recruit 카드의 목적지는 존재할 가능성이 높지만 URL은 보이지 않으므로 구현 범위 밖의 `UNKNOWN target`이다.

## 4. Shared Application Shell

- MEASURED — Shell-A의 데스크톱 표면은 D 전폭 `1200px`, 최대 콘텐츠 기준선은 주로 `x120–1080`(`960px`, 원본 `1536px`)이다. E01 x120/y1301 및 E03 x55/y905가 근거다.
- MEASURED — Shell-A의 모바일 표면은 M 전폭 `243px`, 기본 본문 기준선 `x24–219`(`195px`)이며 일부 미디어는 전폭 또는 50:50 분할이다.
- OBSERVED — 페이지 배경은 거의 전 구간 짙은 남청색이고, Hero는 사진 전폭, 가치 구간은 선명한 딥 블루, 서비스 구간은 좌우 분할이다.
- INFERRED — CSS 페이지는 `width:100%`, `overflow-x:clip`, 공용 컨테이너 `min(80vw,1536px)`를 기본으로 한다. 1200 준비 캔버스에서 960px와 일치한다. 신뢰도 HIGH, 허용 오차 ±4px.
- INFERRED — 전역 stacking은 콘텐츠 `z0`, 장식 포인터 `z2`, 미디어 위 텍스트 `z3`, 고정 헤더 `z50`, 포커스/skip-link `z100`, 모달 예비층 `z200`이다.
- OBSERVED — 공지 바, 쿠키 UI, 모달, 토스트는 보이지 않는다.
- INFERRED — 보이지 않는 공지/쿠키/오버레이는 렌더하지 않는다.
- OBSERVED — 작은 크림색 원형 장식이 E01 D(886,202,14,14), E02 D(907,1135,14,14), E03 D(935,848,14,14), D(928,1424,14,14) 부근에 반복된다.
- INFERRED — 장식 원은 `14px` 지름, `#EEEEDD`, `border-radius:50%`, 클릭 불가, `aria-hidden=true`로 구현한다. 신뢰도 MEDIUM, 위치 허용 오차 ±8px.

## 5. Navigation and Header Specification

### 5.1 Desktop geometry

| 판정 | 항목 | 권장 구현값 | 증거/근거 | 신뢰도/허용 오차 |
| --- | --- | --- | --- | --- |
| MEASURED | 준비 캔버스 총 높이 | 42px | E01 D(0,0,1200,42) | HIGH ±2px |
| INFERRED | 1920 CSS 기준 높이 | 67px | 42/0.625=67.2 | HIGH ±2px |
| INFERRED | 1440–1280 높이 | 64px | 원본 비례를 사용성에 맞춰 고정 | MEDIUM ±2px |
| OBSERVED | utility bar | 별도 행 없음, 0px | KOR/ENG가 동일 헤더 행 | HIGH |
| MEASURED | content width | 1200px full bleed | E01 x0–1200 | HIGH ±0px |
| MEASURED | 좌/우 준비 패딩 | 28px / 28px | E01 KOR x28, 우측 라벨 끝 x1172 | HIGH ±3px |
| INFERRED | CSS 좌/우 패딩 | 44px @1920, 32px @1440 | 준비 좌표 환산 후 유동 축소 | MEDIUM ±4px |
| MEASURED | 로고 bounds | x539 y12 w132 h18 | E01 상단 중앙 | MEDIUM ±3px |
| INFERRED | CSS 로고 bounds | w211 h29 @1920; w158 h22 @1440 | 1.6 환산 및 유동 축소 | MEDIUM ±3px |
| MEASURED | 언어 메뉴 시작 | x28 | E01 D(28,15,58,13) | HIGH ±2px |
| MEASURED | KOR/ENG 폭 | 25px / 24px | E01 D(28,15,58,13) | MEDIUM ±2px |
| MEASURED | 언어 item gap | 7px | E01 x53–60 | MEDIUM ±2px |
| MEASURED | baseline | y27px | E01 상단 텍스트 | MEDIUM ±2px |
| OBSERVED | 아이콘 크기 | 로고 심벌 내부 약 18×18px | E01 x539 y12 | MEDIUM ±2px |
| MEASURED | action area | x1118 y15 w54 h13 | E01 우측 챕터 라벨 | MEDIUM ±4px |
| MEASURED | border | y41, 1px | E01 가로선 | HIGH ±1px |
| OBSERVED | background | Hero 위 투명 청색, 다크 구간 위 `#111122` 계열 | E01/E02/E03 | HIGH |
| INFERRED | position/z-index | `position:fixed; top:0; z-index:50` | 반복 캡처 흔적 | HIGH |

### 5.2 Mobile geometry

| 판정 | 항목 | 권장 구현값 | 증거/근거 | 신뢰도/허용 오차 |
| --- | --- | --- | --- | --- |
| MEASURED | 증거상 bar 높이 | 7px | E05 M(0,0,243,7), M y131,380,629 반복 | MEDIUM ±1px |
| INFERRED | CSS bar 높이 | 52px @390/360 | 축소 증거와 접근성 보정 | MEDIUM ±2px |
| INFERRED | side padding | 20px @390, 18px @360 | 데스크톱 구조 축소 | MEDIUM ±2px |
| MEASURED | 증거상 로고 bounds | x110 y2 w25 h3 | E05 상단 중앙 | LOW ±2px |
| INFERRED | CSS 로고 bounds | x137 y17 w116 h18 @390 | 중앙 정렬, 실사용 크기 | MEDIUM ±3px |
| UNKNOWN | menu-control bounds | 보이는 컨트롤 없음 | E05 전체 | HIGH |
| INFERRED | menu touch target | 0×0px, 렌더하지 않음 | 증거 충실도 우선 | HIGH |
| UNKNOWN | open-panel origin/size | 증거 없음 | 정적 이미지 | HIGH |
| INFERRED | open-panel | x0 y52 w0 h0, 상태 비활성 | 메뉴 버튼이 없으므로 도달 불가 | HIGH |
| UNKNOWN | row height/indent/divider | 증거 없음 | 정적 이미지 | HIGH |
| INFERRED | overlay | `rgba(17,17,34,0)`, 비활성 | 패널 미구현 | HIGH |
| INFERRED | close behavior/scroll lock | 해당 없음, `overflow` 변경 없음 | 패널 미구현 | HIGH |

### 5.3 Visible items and targets

| 판정 | 순서 | 항목 | 역할/target | 활성 상태 |
| --- | --- | --- | --- | --- |
| OBSERVED | 1 | KOR | 한국어 locale, 현재 페이지 유지 | 기본 활성, 흰색 |
| OBSERVED | 2 | ENG | 영어 locale 후보, target UNKNOWN | 비활성, 70% 흰색 |
| OBSERVED | 3 | 중앙 로고 | Home 후보, target UNKNOWN | 비활성 |
| OBSERVED | 4 | 우측 chapter label | 현재 스크롤 구간 표시 | 현재 구간 활성 |

### 5.4 Navigation states

| 판정 | state | 시각값 | timing/behavior |
| --- | --- | --- | --- |
| INFERRED | default | text `#FFFFFF`, 비활성 opacity .70, border `rgba(255,255,255,.16)` | 0ms |
| INFERRED | hover | opacity 1, 밑줄 `1px #FFFFFF`, offset 4px | 160ms `ease-out` |
| INFERRED | focus-visible | outline `2px #6699CC`, offset 4px, radius 2px | 즉시 |
| INFERRED | pressed | opacity .72, `transform:translateY(1px)` | 80ms ease-out |
| OBSERVED | active | KOR 및 chapter text opacity 1, 상단/하단 파란 진행선 | E01/E03 |
| INFERRED | disabled | `#7788AA`, opacity .45, `pointer-events:none` | 0ms |
| INFERRED | scrolled | 사진 위 `rgba(17,17,34,.28)`, 다크 위 `rgba(17,17,34,.92)`, `backdrop-filter:blur(8px)` | 220ms ease |
| UNKNOWN | menu-open | 증거 없음 | 도달 불가 |
| UNKNOWN | submenu-open | 증거 없음 | 도달 불가 |
- INFERRED — scroll chapter 전환은 해당 섹션 상단이 뷰포트 `35%` 선을 통과할 때 갱신하고 `aria-current="location"`을 적용한다.

## 6. Page-by-Page Specifications

### Page P-01: 브랜드 소개 장문 페이지

#### 6.1 Route, purpose, shell, evidence

- UNKNOWN — route는 증거에 노출되지 않는다. 구현 결정은 `/`을 기본 entry point로 사용한다.
- OBSERVED — 목적은 브랜드 철학, 합리적 프리미엄, 서비스 품질, 핵심 가치, 명명, 디자인 자산, 문의/채용을 순차 전달하는 것이다.
- OBSERVED — entry point는 중앙 로고/Home 후보이며 Contact Us/Recruit는 외부 또는 하위 페이지 후보다.
- OBSERVED — shared shell은 Shell-A, 현재 활성 상태는 스크롤 위치에 따른 chapter label이다.
- MEASURED — 지원 증거는 E01–E05 전체다.

#### 6.2 Canvas models

- MEASURED — 데스크톱 준비 기준 viewport/canvas는 `1200 × 4895px`, 원본 매핑은 `1920 × 7832px`, 전폭 배경과 최대 `960px` 콘텐츠 컨테이너를 사용한다.
- MEASURED — 데스크톱 기본 gutter는 `120px` 준비 좌표, 원본 `192px`; 예외는 Hero 0, 50:50 섹션 0, Brand Assets 좌측 `55px`.
- MEASURED — 모바일 증거 canvas는 `243 × 991px`, 기본 side padding `24px`, 콘텐츠 폭 `195px`, 전폭/반폭 섹션은 padding 0이다.
- OBSERVED — 모바일 stacking 순서는 데스크톱과 동일하되 Premium의 이미지와 제목이 축소되고, 서비스와 명명 섹션은 50:50 분할을 유지한다.
- INFERRED — 모바일 overflow는 `overflow-x:clip`, 세로 자연 스크롤이며 이미지의 `object-fit:cover`를 사용한다.

#### 6.3 Ordered section geometry

| 판정 | Section ID | Evidence | Bounds | Semantic role | Container | Layout | Spacing | Alignment | Surface | Content | Responsive | 신뢰도 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MEASURED | P01-S01 | E01 D y0–42; E05 M y0–7 반복 | D(0,0,1200,42), M(0,0,243,7) | header/nav | full bleed | fixed flex 3영역 | px28 / M 증거 px6 | center, space-between | 투명→`#111122`, 1px line | locale, logo, chapter | CSS h64→52 | HIGH |
| MEASURED | P01-S02 | E01 D y0–638; E05 M y0–131 | D(0,0,1200,638), M(0,0,243,131) | hero | full bleed | image + absolute text | D px56/364; M px12/70 | 좌측 제목+중앙 제목 | cloud photo, blue wash | 대형 2분 제목, body | 제목 축소, 동일 배치 | HIGH |
| MEASURED | P01-S03 | E01/E02 D y638–1869; E05 M y131–380 | D(0,638,1200,1231), M(0,131,243,249) | main section | max 960 | block | D top12, gap54; M top4, gap10 | media center, title left | `#111122`, 사진 2장 | sunset, title, passenger photo | 52%/80% 폭 유지 | HIGH |
| MEASURED | P01-S04 | E02 D y1869–2507; E05 M y380–507 | D(0,1869,1200,638), M(0,380,243,127) | service section | full bleed | 2×1 grid | gap0 | left media/right copy | dark + bottom light strip | seat photo, heading, 2 body blocks | 50:50 유지 | HIGH |
| MEASURED | P01-S05 | E02/E03 D y2507–3098; E05 M y507–629 | D(0,2507,1200,591), M(0,507,243,122) | values list | full bleed / inner960 | 3-row grid | D row≈174, M row≈37 | 번호/제목/설명 baseline | `#001155` | 01 Essential, 02 Comfortable, 03 Authentic | 3열 행→압축 행 | HIGH |
| MEASURED | P01-S06 | E03 D y3098–3728; E05 M y629–755 | D(0,3098,1200,630), M(0,629,243,126) | naming section | full bleed | 2×1 grid | D left px40 | left copy/right image | `#111122` + cloud photo | 영문 선언, 한글 body | 50:50 유지 | HIGH |
| MEASURED | P01-S07 | E03 D y3728–4308; E05 M y755–872 | D(0,3728,1200,580), M(0,755,243,117) | media/gallery section | D x55–1200 | heading grid + collage | D top10, gap42 | heading right, label left | dark + 3 image collage | Brand Assets, heading, body, 3 visuals | 모바일 3열 축소 | MEDIUM |
| MEASURED | P01-S08 | E03/E04 D y4308–4678; E05 M y872–943 | D(0,4308,1200,370), M(0,872,243,71) | CTA/contact section | D x55–1144 | 2-column | D gap240 | left heading/right intro+cards | `#111122`, cards `#19192B` | heading, intro, 2 CTA cards | 모바일 2열 유지 축소 | MEDIUM |
| MEASURED | P01-S09 | E04 D y4678–4895; E05 M y943–991 | D(0,4678,1200,217), M(0,943,243,48) | footer | full bleed / inner1088 | grid | D px56 | logo top-left, legal bottom | `#111122`, top 1px border | logo, 회사 정보, copyright | 모바일 재배치 | HIGH |

#### 6.4 Detailed section specifications

##### P01-S01 Header

- MEASURED — DOM 역할은 `header > nav > locale-list + brand-link + chapter-output`이며 D(0,0,1200,42)에 고정된다.
- MEASURED — E01에서 파란 진행선은 x0–338, y40–42이고 전체 divider는 x0–1200, y41–42다.
- OBSERVED — E03의 naming 구간에서는 진행선이 중앙 x600–840까지 이어져 현재 chapter 진행률을 암시한다.
- INFERRED — `grid-template-columns:1fr auto 1fr`, 로고 중앙 고정, chapter 우측 정렬, locale 좌측 정렬을 사용한다.
- INFERRED — 고정 헤더가 콘텐츠 높이를 차지하지 않게 하며 각 섹션은 `scroll-margin-top:64px`를 갖는다.
- UNKNOWN — 실제 progress 계산식은 확인되지 않는다. 구현은 `sectionIndex / sectionCount` 기반 CSS custom property를 사용한다.

##### P01-S02 Hero

- MEASURED — 배경 이미지는 D(0,0,1200,638), M(0,0,243,131), aspect ratio 각각 `1.881`과 `1.855`, `object-fit:cover`.
- MEASURED — 데스크톱 좌측 제목은 E01 D(56,303,195,37), 중앙 제목은 D(364,303,468,37), body는 D(364,547,253,31) 부근이다.
- MEASURED — 모바일 좌측 제목은 E05 M(12,60,46,9), 중앙 제목은 M(75,60,96,9), body는 M(75,110,55,8) 부근이다.
- OBSERVED — 사진은 구름과 항공기 날개가 하단에 있으며 초점은 `(50%,42%)`, 하단 날개가 잘리지 않아야 한다.
- INFERRED — DOM은 `section.hero > picture + h1(two spans) + p + decorative-dot`이며 `position:relative; isolation:isolate`.
- INFERRED — 사진 위 색조는 `linear-gradient(rgba(51,102,170,.18),rgba(17,17,34,.08))`; 신뢰도 MEDIUM, 색상 허용 `ΔE≤5`는 사진 변동 때문에 완화한다.
- INFERRED — 데스크톱 제목 grid는 `grid-template-columns:250px 1fr`, gap `58px`; 모바일은 `56px 1fr`, gap `7px`.
- OBSERVED — CTA 버튼은 보이지 않는다.

##### P01-S03 Rational Premium

- MEASURED — sunset 사진은 E01 D(289,650,623,356), aspect `1.75`, 준비 컨테이너의 64.9%; M(58,135,127,67), aspect `1.90`.
- MEASURED — 제목은 E01 D(289,1061,365,116), M(58,213,91,28), 두 줄이며 좌측이 사진과 일치한다.
- MEASURED — passenger 사진은 D(120,1301,960,568)로 E02 로컬 y0–349까지 이어지고, M(24,264,195,116)이다.
- OBSERVED — passenger 사진 초점은 손과 펜이 중앙 하단, 창문이 우측이다.
- INFERRED — DOM은 `section > figure.sunset + h2 + figure.passenger`; grid가 아닌 블록 흐름으로 구현한다.
- INFERRED — D sunset margin-inline `auto`, title width `420px`, title margin-top `48px`, passenger margin-top `116px`; M 각각 `10px`, `42px`.
- INFERRED — 사진 radius, border, shadow는 모두 `0`.
- UNKNOWN — 사진 lazy-load 정책은 보이지 않는다. 구현은 sunset eager가 아닌 lazy, passenger lazy로 한다.

##### P01-S04 Service Quality

- MEASURED — 좌측 좌석 사진은 D(0,1869,600,638), M(0,380,121,127); 우측 패널은 D(600,1869,600,548), M(121,380,122,108).
- MEASURED — 우측 하단 밝은 strip은 D(600,2417,600,90), M(121,488,122,19), 색상은 대표 palette `#EEEEEE` 계열이다.
- MEASURED — 제목은 E02 로컬 D(638,539,346,73), 정규 y2059, 모바일 M(130,414,94,17).
- MEASURED — 본문은 E02 로컬 D(638,670,335,85), 정규 y2190, 모바일 M(130,447,83,20).
- INFERRED — DOM은 `section.service > figure + div.copy-panel(h2,p,p) + div.end-cap`.
- INFERRED — CSS는 `grid-template-columns:1fr 1fr`; copy panel padding D `185px 38px 80px`, M `31px 9px 12px`.
- OBSERVED — 서비스 종류보다 품질에 집중한다는 메시지 위계가 제목 2줄과 작은 본문으로 분명하다.
- INFERRED — 360px에서도 분할을 유지하되 제목 최소 `15px`, 본문 최소 `8px`로 설정하고 실제 프로젝트 치환본은 접근성을 위해 `12px` 이상을 사용한다.

##### P01-S05 Three Values

- MEASURED — 배경은 E02/E03의 `#001155` 대표 영역이며 D(0,2507,1200,591), M(0,507,243,122).
- MEASURED — 내부 좌측 기준은 D x99 번호, x286 제목; 우측 끝 x1171이며, M x22 번호, x58 제목이다.
- MEASURED — 3개 행 divider는 D y2574, 2747, 2921 부근, M y515, 554, 591 부근이다.
- MEASURED — 번호 `01/02/03`, 영문 제목 `Essential/Comfortable/Authentic`, 설명 1줄이 반복된다.
- INFERRED — DOM은 `ol.values > li > span.index + div(h3,p)`; `grid-template-columns:160px 1fr`.
- INFERRED — D inner width `1072px`, margin `64px`; row min-height `174px`, padding `28px 35px`; M inner width `211px`, margin `16px`, row `37px`, grid `36px 1fr`.
- OBSERVED — 텍스트와 divider가 배경과 낮은 대비로 의도적으로 절제되어 있다.
- INFERRED — 접근성 구현에서는 본문 대비를 최소 4.5:1까지 높이되, 시각적 계층은 opacity 차이로 유지한다.

##### P01-S06 Brand Naming

- MEASURED — 좌측 dark panel과 우측 cloud photo는 각각 D 폭 600px, M 폭 121/122px다.
- MEASURED — cloud photo는 D(600,3098,600,630), M(121,629,122,126), 초점 `(53%,42%)`.
- MEASURED — 대형 영문 제목은 E03 D(39,160,452,273) 로컬, 정규 D(39,3200,452,273), 모바일 M(8,645,97,64).
- MEASURED — 한글 본문은 정규 D(40,3470,415,44), 모바일 M(8,716,92,11).
- INFERRED — DOM은 `section.naming > div.copy(h2,p,eyebrow) + figure`.
- INFERRED — copy panel은 D padding `94px 40px`, M `14px 8px`; h2 max-width `500px`.
- OBSERVED — 대형 제목은 4줄, 마지막에 마침표가 있고 왼쪽 정렬이다.
- INFERRED — 영문 title은 `font-size:64px @1200 prepared-equivalent`, line-height `1.08`; 실제 1440 CSS에서는 `56px`.

##### P01-S07 Brand Assets

- MEASURED — 상단 label은 E03 정규 D(56,3739,90,15), 제목은 D(491,3739,302,43), body는 D(491,3803,395,39).
- MEASURED — collage는 D y3905–4268, 좌측 복합 이미지 D(55,3905,650,363), 우측 공항 사인 D(712,3905,488,363).
- MEASURED — 모바일 heading은 M(100,758,79,12), collage는 M(10,807,233,65), 세 개의 시각 패널이 한 행에 보인다.
- OBSERVED — collage는 모바일 UI mockup, 패턴/기내 그래픽, 공항 디스플레이의 세 범주다.
- INFERRED — DOM은 `section.assets > header(label,h2,p) + div.gallery(figure×3)`.
- INFERRED — D header grid `400px 1fr`, gallery grid `1.35fr .65fr`; 좌측 figure 내부는 2×2 composite 또는 하나의 대체 이미지로 처리한다.
- INFERRED — 모바일 gallery는 `grid-template-columns:1fr 1fr 1fr`, gap `1px`, 각 칸 `aspect-ratio:1.18/1`, overflow hidden.
- UNKNOWN — 원래 gallery 클릭/라이트박스 여부는 보이지 않는다. 구현은 정적 figure로 한다.

##### P01-S08 Contact / Recruit

- MEASURED — 왼쪽 큰 heading은 E03 정규 D(56,4382,316,69), 오른쪽 intro는 D(738,4380,338,44).
- MEASURED — CTA 카드 2개는 E03 D(738,4470,198,83), D(944,4470,198,83) 부근이다.
- MEASURED — 모바일은 heading M(11,882,78,18), intro M(147,879,76,13), 카드 영역 M(147,905,80,21).
- OBSERVED — 카드 라벨은 Contact Us와 Recruit이고 우상단 대각 화살표, 하단 작은 설명이 있다.
- INFERRED — DOM은 `section.cta > h2 + div.actions(intro + nav > a×2)`.
- INFERRED — D grid `1fr 1fr`, gap `120px`, padding `70px 56px 124px`; cards grid `repeat(2,1fr)`, gap `8px`.
- INFERRED — 카드 hover는 background `#222233`, 화살표 `translate(2px,-2px)`, 180ms.
- UNKNOWN — 링크 target은 확인되지 않는다. 개발 중 `href="#"`를 쓰지 말고 구성 데이터가 없으면 disabled `<span>`으로 렌더한다.

##### P01-S09 Footer

- MEASURED — top divider는 E04 local y117, 정규 y4677, 전폭 1px.
- MEASURED — footer logo는 정규 D(56,4745,158,28), company text D(56,4831,271,54), copyright D(707,4870,213,13).
- MEASURED — 모바일 footer는 M(0,943,243,48), logo M(11,950,38,6), legal M(11,970,67,14), copyright M(146,981,67,4).
- INFERRED — DOM은 `footer > brand + address + small.copyright`.
- INFERRED — D grid `1fr 1fr`, logo와 address 좌측, copyright 우측 하단; padding `66px 56px 26px`.
- INFERRED — 모바일도 좌우 분할을 유지하되 padding `8px 11px`.
- OBSERVED — 소셜 링크, 뉴스레터, sitemap은 보이지 않는다.

#### 6.5 Page-specific data, states, accessibility, assets, acceptance

- OBSERVED — 반복 데이터는 values 3개, asset visuals 3개, CTA 2개다.
- INFERRED — 페이지 로딩 시 Hero 이미지만 `fetchpriority=high`; 나머지는 `loading=lazy`, `decoding=async`.
- INFERRED — 이미지 실패 시 dark surface와 짧은 대체 텍스트를 유지해 레이아웃 높이가 변하지 않게 한다.
- INFERRED — 스크롤 chapter 상태 외 로컬 상태는 없으며 모든 장식 포인터는 `aria-hidden`.
- INFERRED — H1은 Hero의 브랜드 철학 문장 1개, 이후 S03/S04/S06/S07/S08은 H2, values 항목은 H3다.
- INFERRED — P-01은 `main` 하나, 각 section은 고유 `aria-labelledby`, footer는 `contentinfo`를 사용한다.
- INFERRED — P-01의 섹션 bounds는 18장의 1440/390 기준 visual regression 이미지로 검증하고 상세 기준은 18절을 따른다.

## 7. Section and Layout Deep Dives

### 7.1 DOM and CSS-ready geometry

```html
<body>
  <a class="skip-link" href="#main">본문으로 건너뛰기</a>
  <header class="site-header">...</header>
  <main id="main">
    <section id="hero" class="hero">...</section>
    <section id="premium" class="premium">...</section>
    <section id="service" class="split split--service">...</section>
    <section id="values" class="values">...</section>
    <section id="naming" class="split split--naming">...</section>
    <section id="assets" class="assets">...</section>
    <section id="contact" class="contact">...</section>
  </main>
  <footer class="site-footer">...</footer>
</body>
```

- INFERRED — 위 DOM은 P01-S01–S09의 시맨틱 계층을 직접 반영한다. 신뢰도 HIGH.

```css
.site-header { position: fixed; inset: 0 0 auto; height: var(--header-h); z-index: 50; }
.container { width: min(80vw, 1536px); margin-inline: auto; }
.split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
.split > * { min-width: 0; overflow: hidden; }
.premium__sunset { width: 52%; aspect-ratio: 1.75; margin-inline: auto; }
.premium__passenger { width: 80%; aspect-ratio: 1.69; margin-inline: auto; }
.values__item { display:grid; grid-template-columns: 160px minmax(0,1fr); }
.assets__gallery { display:grid; grid-template-columns: 1.35fr .65fr; gap: 7px; }
```

- INFERRED — 1440 이상은 위 geometry를 사용하고 `1024px` 이하에서 컨테이너를 `calc(100% - 96px)`, `768px` 이하에서 `calc(100% - 64px)`로 전환한다.
- INFERRED — `767px` 이하에서도 S04/S06의 2열은 증거대로 유지하되 각 패널 `min-width:0`, 본문 `clamp()`를 사용해 overflow를 막는다.
- INFERRED — S07의 모바일 gallery는 3열, S08의 카드도 2열을 유지한다. 불완전 행은 `justify-content:start`.
- INFERRED — 모든 사진은 `display:block;width:100%;height:100%;object-fit:cover`, radius `0`, shadow `none`.
- INFERRED — overflow clipping은 사진 wrapper에만 적용하고 본문 text는 `overflow-wrap:anywhere`를 허용한다.
- OBSERVED — sticky 내부 요소, carousel, accordion, form은 보이지 않는다.

### 7.2 Per-section responsive geometry

| 판정 | Section | Desktop ≥1024 | Tablet 768 | Mobile ≤390 |
| --- | --- | --- | --- | --- |
| INFERRED | P01-S02 | hero aspect 1.88, title 2-column | aspect 1.88, title gap 36 | aspect 1.85, title columns 56/1fr |
| INFERRED | P01-S03 | sunset 52%, passenger 80% | 동일 | 동일 |
| INFERRED | P01-S04 | 50/50, copy px64 | 50/50, copy px24 | 50/50, copy px14 |
| INFERRED | P01-S05 | rows 174px, columns160/1fr | rows 132px, 112/1fr | rows 60px, 54/1fr |
| INFERRED | P01-S06 | 50/50, copy px48 | 50/50, copy px24 | 50/50, copy px12 |
| INFERRED | P01-S07 | header 400/1fr, gallery 1.35/.65 | header 33/67, gallery 1.2/.8 | header 38/62, gallery 3 equal |
| INFERRED | P01-S08 | 2 columns, cards 2 columns | 2 columns | 2 columns, cards 2 columns |
| INFERRED | P01-S09 | 2-column legal | 2-column legal | 2-column legal |

## 8. Component Abstraction

### 8.1 Component tree

```text
AppShell
├─ SkipLink
├─ SiteHeader
│  ├─ LocaleSwitcher
│  ├─ BrandMark
│  ├─ ChapterIndicator
│  └─ ScrollProgress
└─ BrandStoryPage [P-01]
   ├─ HeroSection [P01-S02]
   ├─ PremiumSection [P01-S03]
   ├─ ServiceSplitSection [P01-S04]
   ├─ ValueList [P01-S05]
   │  └─ ValueRow ×3
   ├─ NamingSplitSection [P01-S06]
   ├─ AssetGallerySection [P01-S07]
   │  └─ MediaFigure ×3
   ├─ ContactSection [P01-S08]
   │  └─ ActionCard ×2
   └─ SiteFooter [P01-S09]
```

### 8.2 Component contracts

| 판정 | Component | 책임/경계 | props | state/events/data | loading/empty/error/disabled | a11y |
| --- | --- | --- | --- | --- | --- | --- |
| INFERRED | AppShell | 전역 토큰, header/footer, overflow | `children:Node`, `theme:"dark"` | scroll chapter 공유 | shell은 항상 렌더 | skip target |
| INFERRED | SiteHeader | locale/logo/chapter 배치 | `chapter:Chapter`, `progress:number` | scroll observer, locale click | chapter 없으면 빈 영역 유지 | `nav`, aria-current |
| INFERRED | LocaleSwitcher | 2개 locale | `items:Locale[2]`, `active:string` | `onChange(code)` | target 없으면 disabled | 명시 label |
| INFERRED | BrandMark | 홈 링크/대체 로고 | `src`, `alt`, `href?` | click | src 오류 시 text mark | 현재 페이지면 aria-label |
| INFERRED | HeroSection | 사진+H1+intro | `image:Media`, `titleParts:[string,string]`, `body` | 없음 | 이미지 실패 surface 유지 | decorative image면 alt="" |
| INFERRED | PremiumSection | 사진 2장+H2 | `sunset`, `passenger`, `title` | 없음 | 누락 figure placeholder | H2 |
| INFERRED | ServiceSplitSection | 미디어/카피 분할 | `image`, `title`, `paragraphs:string[]` | 없음 | body empty 허용 | section label |
| INFERRED | ValueList | 3개 가치 행 | `items:Value[3]` | 없음 | empty면 section 숨김 | `ol`, H3 |
| INFERRED | NamingSplitSection | 선언문+cloud image | `title`, `body`, `image` | 없음 | image placeholder | H2 |
| INFERRED | AssetGallerySection | 3개 media | `items:Media[3]`, `intro` | 정적 | empty면 intro만 | figure/figcaption |
| INFERRED | ContactSection | 2개 액션 | `actions:Action[2]` | hover/focus/click | href 없으면 disabled span | 링크 이름 독립적 |
| INFERRED | SiteFooter | legal/address | `brand`, `legalLines`, `copyright` | 없음 | optional line 생략 | address/contentinfo |

- INFERRED — `Chapter` 타입은 `{id:string; shortLabel:string; sectionId:string}`다.
- INFERRED — `Media` 타입은 `{src:string; width:number; height:number; alt:string; focalX:number; focalY:number; priority?:boolean}`다.
- INFERRED — 공유 상태는 현재 chapter 하나뿐이며, page-specific component는 가능하면 stateless다.

## 9. Design Tokens and Exact Color Specification

### 9.1 Color tokens

| 판정 | token | HEX | RGB | HSL | alpha | role | usage/evidence coordinate | confidence | tolerance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MEASURED | `--c-bg` | `#111122` | rgb(17, 17, 34) | hsl(240, 33.3%, 10.0%) | 1 | 기본 배경 | E01 D(20,900), E03 dark 면, palette 30.07–43.27% | HIGH | ΔE≤3 |
| MEASURED | `--c-surface` | `#222233` | rgb(34, 34, 51) | hsl(240, 20.0%, 16.7%) | 1 | 카드/상승 surface | E03/E04 palette | MEDIUM | ΔE≤3 |
| MEASURED | `--c-values` | `#001155` | rgb(0, 17, 85) | hsl(228, 100%, 16.7%) | 1 | 가치 구간 배경 | E02 D y2507–3120, palette 34.34% | HIGH | ΔE≤3 |
| MEASURED | `--c-text` | `#FFFFFF` | rgb(255, 255, 255) | hsl(0, 0%, 100%) | 1 | 제목/주요 text | E03 palette 3.99% | HIGH | ΔE≤2 |
| MEASURED | `--c-text-soft` | `#AAAABB` | rgb(170, 170, 187) | hsl(240, 10.5%, 70.0%) | 1 | 보조 text | E03 palette 1.53% | MEDIUM | ΔE≤4 |
| MEASURED | `--c-muted` | `#7788AA` | rgb(119, 136, 170) | hsl(220, 23.3%, 56.7%) | 1 | 비활성/저대비 text | E01 palette 7.73% | MEDIUM | ΔE≤4 |
| MEASURED | `--c-sky` | `#6699CC` | rgb(102, 153, 204) | hsl(210, 50.0%, 60.0%) | 1 | focus/sky 보조색 | E03 palette 3.26% | MEDIUM | ΔE≤4 |
| MEASURED | `--c-secondary` | `#3366AA` | rgb(51, 102, 170) | hsl(214.3, 53.8%, 43.3%) | 1 | 파란 보조색 | E01 palette 2.06% | MEDIUM | ΔE≤4 |
| MEASURED | `--c-light-panel` | `#EEEEEE` | rgb(238, 238, 238) | hsl(0, 0%, 93.3%) | 1 | S04 하단 strip | E02 palette 1.65%, D(600,2417,600,90) | HIGH | ΔE≤3 |
| INFERRED | `--c-accent` | `#173BFF` | rgb(23, 59, 255) | hsl(230.7, 100%, 54.5%) | 1 | progress line/그래픽 | E01 y41 청색선 | MEDIUM | ΔE≤5 |
| INFERRED | `--c-dot` | `#EEEEDD` | rgb(238, 238, 221) | hsl(60, 33.3%, 90.0%) | 1 | 장식 원 | E01 D(886,202) 시각 표본 | MEDIUM | ΔE≤5 |
| INFERRED | `--c-border` | `#FFFFFF29` | rgb(255, 255, 255) | hsl(0, 0%, 100%) | .16 | divider | E01/E04 가로선 | MEDIUM | alpha±.04 |
| INFERRED | `--c-overlay` | `#11112273` | rgb(17, 17, 34) | hsl(240, 33.3%, 10.0%) | .45 | 사진 위 overlay | Hero 가독성 보정 | LOW | alpha±.08 |
| INFERRED | `--c-focus` | `#6699CC` | rgb(102, 153, 204) | hsl(210, 50.0%, 60.0%) | 1 | focus ring | palette 기반 접근성 결정 | MEDIUM | ΔE≤4 |
| INFERRED | `--c-hover` | `#222233` | rgb(34, 34, 51) | hsl(240, 20.0%, 16.7%) | 1 | 카드 hover | dark palette | MEDIUM | ΔE≤3 |
| INFERRED | `--c-pressed` | `#001155` | rgb(0, 17, 85) | hsl(228, 100%, 16.7%) | 1 | pressed | values surface 재사용 | MEDIUM | ΔE≤3 |
| INFERRED | `--c-disabled` | `#7788AA73` | rgb(119, 136, 170) | hsl(220, 23.3%, 56.7%) | .45 | disabled | muted token | MEDIUM | alpha±.05 |
| UNKNOWN | `--c-success` | 원 증거 없음 | 원 증거 없음 | 원 증거 없음 | 원 증거 없음 | 상태 | 보이는 성공 UI 없음 | HIGH | 해당 없음 |
| INFERRED | `--c-success` | `#2E9B68` | rgb(46, 155, 104) | hsl(151.9, 54.2%, 39.4%) | 1 | 향후 상태 | 접근성 구현 결정 | LOW | ΔE≤3 |
| UNKNOWN | `--c-warning` | 원 증거 없음 | 원 증거 없음 | 원 증거 없음 | 원 증거 없음 | 상태 | 보이는 경고 UI 없음 | HIGH | 해당 없음 |
| INFERRED | `--c-warning` | `#D7A21A` | rgb(215, 162, 26) | hsl(43.2, 78.4%, 47.3%) | 1 | 향후 상태 | 접근성 구현 결정 | LOW | ΔE≤3 |
| UNKNOWN | `--c-danger` | 원 증거 없음 | 원 증거 없음 | 원 증거 없음 | 원 증거 없음 | 상태 | 보이는 오류 UI 없음 | HIGH | 해당 없음 |
| INFERRED | `--c-danger` | `#D74B5B` | rgb(215, 75, 91) | hsl(353.1, 63.6%, 56.9%) | 1 | 향후 상태 | 접근성 구현 결정 | LOW | ΔE≤3 |

### 9.2 CSS custom properties

```css
:root {
  --c-bg:#111122; --c-surface:#222233; --c-values:#001155;
  --c-text:#fff; --c-text-soft:#aaaabb; --c-muted:#7788aa;
  --c-sky:#6699cc; --c-secondary:#3366aa; --c-light-panel:#eee;
  --c-accent:#173bff; --c-dot:#eeeedd; --c-border:#ffffff29;
  --c-overlay:#11112273; --c-focus:#6699cc;
  --space-0:0px; --space-1:4px; --space-2:8px; --space-3:12px;
  --space-4:16px; --space-5:24px; --space-6:32px; --space-7:48px;
  --space-8:64px; --space-9:96px; --space-10:128px;
  --radius-0:0px; --radius-focus:2px; --border-1:1px;
  --shadow-none:none; --opacity-muted:.70; --opacity-disabled:.45;
  --z-content:0; --z-decor:2; --z-copy:3; --z-header:50; --z-skip:100; --z-modal:200;
  --bp-sm:390px; --bp-md:768px; --bp-lg:1024px; --bp-xl:1280px; --bp-2xl:1440px;
  --container-max:1536px; --header-h:64px; --icon-sm:16px; --icon-md:24px;
  --motion-fast:80ms; --motion-ui:160ms; --motion-slow:220ms;
  --ease-ui:cubic-bezier(.2,.8,.2,1);
}
```

- INFERRED — spacing scale 예외는 D gutter `120px`, S03 sunset x `289px`, S07 x `55px`, CTA gap `120px`, 모바일 기본 x `24px`이며 증거 정렬을 우선한다.
- OBSERVED — radius와 shadow는 이미지와 카드 모두 시각적으로 0에 가깝다.

## 10. Typography Matrix

- UNKNOWN — 정확한 원본 서체명/웹폰트 URL은 증거로 확인되지 않는다.
- INFERRED — 권장 family는 한국어 `"Pretendard Variable","Noto Sans KR",Arial,sans-serif`, 영문 동일 family다. font-display는 `swap`.

| 판정 | role | size D/M | weight | line-height | letter spacing | case/decor | align/max width | wrap |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| INFERRED | utility/nav | 13px/11px | 600 | 16/14px | 0 | uppercase, none | left/auto | nowrap |
| INFERRED | chapter label | 12px/10px | 600 | 16/12px | 0 | 원문 유지 | right/140px | nowrap |
| MEASURED | hero H1 | 준비 약36px/증거 9px | 700 | 1.25 | 0 | 원문 유지 | left/D 780px | 2개 span |
| INFERRED | hero H1 CSS | 48px@1440, 22px@390 | 700 | 1.25 | 0 | none | grid | 1줄씩 |
| INFERRED | hero body | 16px/11px | 500 | 1.6 | 0 | none | left/420px | 2줄 |
| INFERRED | premium H2 | 56px/26px | 700 | 1.25 | 0 | none | left/500px | 2줄 |
| INFERRED | service H2 | 38px/16px | 700 | 1.25 | 0 | none | left/430px | 2줄 |
| INFERRED | section body | 16px/12px | 500 | 1.65 | 0 | none | left/460px | 자연 줄바꿈 |
| INFERRED | value index | 64px/30px | 600 | 1 | 0 | numeric | left/120px | nowrap |
| INFERRED | value title | 38px/18px | 700 | 1.2 | 0 | title case | left | nowrap |
| INFERRED | value body | 14px/11px | 400 | 1.5 | 0 | none | left/540px | 1–2줄 |
| INFERRED | naming display | 64px/24px | 700 | 1.08 | 0 | title case | left/500px | 정확히 4줄 |
| INFERRED | assets eyebrow | 14px/10px | 600 | 1.4 | 0 | title case | left | nowrap |
| INFERRED | assets H2 | 40px/18px | 700 | 1.2 | 0 | none | left/450px | 1줄 |
| INFERRED | CTA H2 | 34px/17px | 700 | 1.35 | 0 | none | left/420px | 2줄 |
| INFERRED | card title | 15px/10px | 500 | 1.4 | 0 | title case | left | nowrap |
| INFERRED | card meta | 12px/9px | 400 | 1.5 | 0 | none | left | 1줄 |
| INFERRED | footer legal | 11px/9px | 400 | 1.5 | 0 | none | left/340px | 3줄 |

- INFERRED — 모든 letter-spacing은 `0`; 음수 자간을 사용하지 않는다.
- INFERRED — 제목은 ellipsis를 쓰지 않고 `text-wrap:balance`, body는 `overflow-wrap:anywhere`, 카드 한 줄 라벨만 nowrap이다.

## 11. Asset and Icon Manifest

| 판정 | ID | Page/section | role | evidence crop/display | source ratio | crop/focal/object-fit | responsive | loading/format/alt | replacement |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OBSERVED | A01 | P01-S01/S09 | 원형 심벌+wordmark | E01 D(539,12,132,18), E04 D(56,4745,158,28) | UNKNOWN | contain/center | header 축소, footer 확대 | SVG 권장, alt=브랜드명 | 독자 Godot 프로젝트 로고 |
| MEASURED | A02 | P01-S02 | cloud+wing hero | D(0,0,1200,638), M(0,0,243,131) | 1.88/1.85 | cover, 50% 42% | 전폭 | AVIF/WebP, eager, 의미 있으면 alt | 자체 비행 게임 스크린샷 |
| MEASURED | A03 | P01-S03 | sunset wing | D(289,650,623,356), M(58,135,127,67) | 1.75/1.90 | cover, 50% 50% | 52% 폭 | WebP, lazy | 자체 sky/time-of-day shot |
| MEASURED | A04 | P01-S03 | passenger detail | D(120,1301,960,568), M(24,264,195,116) | 1.69/1.68 | cover, 56% 55% | 80% 폭 | WebP, lazy | 조종석/개발 장면 |
| MEASURED | A05 | P01-S04 | aircraft seat/window | D(0,1869,600,638), M(0,380,121,127) | .94/.95 | cover, 42% 50% | 좌측 50% | WebP, lazy | 비행 시스템/조종석 shot |
| MEASURED | A06 | P01-S06 | cloud sea | D(600,3098,600,630), M(121,629,122,126) | .95/.97 | cover, 53% 42% | 우측 50% | WebP, lazy | 게임 내 구름층 shot |
| OBSERVED | A07 | P01-S07 | mobile UI visual | E03 gallery left, E05 x10–88 | UNKNOWN | cover, center | 1/3 mobile | WebP, lazy, 설명 alt | Godot HUD screenshot |
| OBSERVED | A08 | P01-S07 | fabric/pattern visual | E03 gallery center, E05 x89–164 | UNKNOWN | cover, center | 1/3 mobile | WebP, lazy | flight-system diagram |
| OBSERVED | A09 | P01-S07 | airport display | E03 D(712,3905,488,363), E05 x165–243 | 1.34 | cover, 50% 50% | 1/3 mobile | WebP, lazy | devlog/media still |
| OBSERVED | I01 | P01-S08 | arrow up-right | 카드 우상단 약12×12px | 1 | `ArrowUpRight` | 동일 | Lucide SVG, aria-hidden | Lucide 유지 |
| OBSERVED | D01 | 여러 section | cream dot | 14×14px D | 1 | 원형 fill | 모바일 4–6px 증거, CSS 10px | CSS, aria-hidden | 동일 추상 장식 |

- INFERRED — 로고를 제외한 사진의 원 source resolution은 표시 크기의 최소 2배로 준비한다.
- INFERRED — 원 브랜드 로고, 항공 사진, 문구가 제공되지 않으면 유사한 구조만 유지하고 저작권이 명확한 자체 제작 자산으로 교체한다.
- UNKNOWN — 영상/애니메이션 자산은 확인되지 않는다.

## 12. Responsive Behavior Matrix

### 12.1 Global and navigation

| 판정 | 항목 | 1440 | 1280 | 1024 | 768 | 390 | 360 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| INFERRED | container width | 1296px | 1152px | 928px | 704px | 342px | 320px |
| INFERRED | global gutter | 72px | 64px | 48px | 32px | 24px | 20px |
| INFERRED | header height | 64px | 64px | 60px | 56px | 52px | 52px |
| INFERRED | header side padding | 32px | 30px | 24px | 20px | 20px | 18px |
| INFERRED | logo width | 158px | 148px | 132px | 120px | 116px | 108px |
| INFERRED | nav mode | fixed 3-zone | fixed 3-zone | fixed 3-zone | fixed 3-zone | fixed 3-zone | fixed 3-zone |
| INFERRED | menu control | 숨김 0px | 숨김 0px | 숨김 0px | 숨김 0px | 숨김 0px | 숨김 0px |
| INFERRED | touch target | 44px | 44px | 44px | 44px | 44px | 44px |

### 12.2 P-01 sections

| 판정 | 항목 | 1440 | 1280 | 1024 | 768 | 390 | 360 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| INFERRED | Hero height | 766px | 681px | 545px | 409px | 210px | 194px |
| INFERRED | Hero title size | 48px | 44px | 36px | 30px | 22px | 20px |
| INFERRED | Hero image crop | 50% 42% | 동일 | 동일 | 동일 | 50% 42% | 동일 |
| INFERRED | Premium sunset width | 748px | 665px | 532px | 399px | 203px | 187px |
| INFERRED | Premium passenger width | 1152px | 1024px | 819px | 614px | 312px | 288px |
| INFERRED | Premium title size | 56px | 52px | 44px | 36px | 26px | 24px |
| INFERRED | Service columns | 720/720 | 640/640 | 512/512 | 384/384 | 195/195 | 180/180 |
| INFERRED | Service title size | 38px | 36px | 30px | 24px | 16px | 15px |
| INFERRED | Values columns | 160/1fr | 152/1fr | 128/1fr | 96/1fr | 54/1fr | 50/1fr |
| INFERRED | Values row height | 209px | 186px | 149px | 111px | 60px | 56px |
| INFERRED | Naming columns | 720/720 | 640/640 | 512/512 | 384/384 | 195/195 | 180/180 |
| INFERRED | Naming display | 64px | 60px | 50px | 38px | 24px | 22px |
| INFERRED | Assets gallery | 1.35fr/.65fr | 동일 | 1.25fr/.75fr | 1.2fr/.8fr | 3×1fr | 3×1fr |
| INFERRED | CTA layout | 2col/2cards | 2col/2cards | 2col/2cards | 2col/2cards | 2col/2cards | 2col/2cards |
| INFERRED | footer layout | 2 columns | 2 columns | 2 columns | 2 columns | 2 columns | 2 columns |
| INFERRED | min touch target | 44px | 44px | 44px | 44px | 44px | 44px |

- INFERRED — breakpoint `1024px`에서 큰 display type과 paddings가 감소하고, `768px`에서 기본 gutter 및 body type이 모바일 계열로 전환된다.
- OBSERVED — E05는 243px에서도 S04/S06의 2열, S07의 3개 미디어, S08의 2개 카드가 유지되므로 390/360에서도 쌓지 않는다.
- INFERRED — 390/360 수치는 E05의 폭 비율을 선형 투영하되, 헤더와 touch target은 접근성 때문에 독립 보정했다. 신뢰도 MEDIUM.

## 13. Interaction and Motion State Matrix

| 판정 | 대상/state | trigger | visual delta | duration/easing | keyboard/focus | reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| INFERRED | text link hover | pointer | opacity .70→1, underline 1px | 160ms ease-ui | focus ring 별도 | transition 0ms |
| INFERRED | text link pressed | pointer down | translateY(1px), opacity .72 | 80ms ease-out | Enter 동일 | transform 제거 |
| INFERRED | locale active | page locale | color white, aria-current | 0ms | Tab 가능 | 동일 |
| INFERRED | CTA hover | pointer | bg `#111122→#222233`, arrow +2,-2 | 180ms ease-ui | focus-visible 동일 | transform 제거 |
| INFERRED | CTA focus | keyboard | 2px `#6699CC`, offset 3px | 0ms | Enter 활성 | 동일 |
| INFERRED | CTA disabled | href 없음 | opacity .45, cursor default | 0ms | tab 제외 | 동일 |
| INFERRED | header scrolled | scrollY>16 | bg alpha .28→.92, blur 8px | 220ms ease | 무관 | 즉시 |
| INFERRED | chapter selected | IntersectionObserver | label 교체, progress width 변경 | 220ms ease-ui | aria-live polite 아님; aria-current 갱신 | 즉시 |
| UNKNOWN | menu open/close | 보이는 control 없음 | 없음 | 없음 | 없음 | 없음 |
| UNKNOWN | tabs/accordion/carousel/form/modal | 증거에 없음 | 렌더하지 않음 | 없음 | 없음 | 없음 |
| INFERRED | media loading | network | 고정 aspect surface→image opacity 1 | 160ms linear | alt 유지 | fade 없음 |
| INFERRED | media error | load error | `#222233` + alt text | 0ms | 비상호작용 | 동일 |
| INFERRED | success/warning/error | 향후 폼 | token 색상과 text 동시 표시 | 160ms | live region 필요 | transition 0ms |

- UNKNOWN — scroll reveal, parallax, cursor-follow 효과의 존재는 정적 증거로 확정할 수 없다.
- INFERRED — 장식 원은 정적이며 포인터 추적을 구현하지 않는다.

## 14. Accessibility Contract

- INFERRED — landmark 순서는 `banner → navigation → main → contentinfo`이고 main은 정확히 1개다.
- INFERRED — heading 순서는 Hero `h1` 1개, 각 주요 section `h2`, values 항목 `h3`; 시각 크기와 문서 위계를 분리한다.
- INFERRED — skip link는 focus 시 x16 y16, 최소 `160×44px`, `z-index:100`, `#FFFFFF` 배경/`#111122` text로 나타난다.
- INFERRED — 키보드 순서는 KOR, ENG, logo, 본문 내 CTA 2개, footer link가 있으면 그 순서다.
- INFERRED — focus ring은 `2px solid #6699CC`, offset `3–4px`, 어두운/사진 배경 모두에서 필요하면 `box-shadow:0 0 0 4px #111122`.
- INFERRED — locale switcher는 `aria-label="언어 선택"`, active item은 `aria-current="true"`.
- INFERRED — 모바일 menu button은 증거상 없으므로 생성하지 않는다. 향후 추가 시 `aria-expanded`, `aria-controls`, focus containment/restoration, Escape close, body scroll lock을 모두 구현해야 한다.
- INFERRED — 현재 chapter는 화면 낭독기용 숨김 텍스트로 “현재 섹션”을 포함하되 scroll마다 live announcement를 발생시키지 않는다.
- INFERRED — 정보 사진 alt는 내용을 80자 이내로 설명하고, 장식/중복 이미지는 `alt=""`; 로고 링크 alt는 프로젝트명이다.
- INFERRED — 텍스트 대비는 일반 4.5:1, 24px 이상 또는 18.66px bold는 3:1, UI 경계/포커스 3:1을 목표로 한다.
- INFERRED — 낮은 대비가 보이는 S05 본문은 원 시각과 가장 가까운 범위에서 4.5:1까지 밝힌다.
- INFERRED — `prefers-reduced-motion:reduce`에서 모든 비필수 transition은 0ms, transform/parallax는 제거한다.
- INFERRED — 200% zoom과 320px viewport에서 가로 overflow가 없어야 하며 텍스트는 잘리지 않아야 한다.
- INFERRED — 모든 실제 링크의 pointer/touch target은 최소 `44×44px`; 작은 글자는 pseudo-element로 hit area를 확장한다.
- UNKNOWN — form/live error UI는 보이지 않는다. 추가할 경우 `aria-describedby`, field-level error, `aria-live=polite`를 요구한다.

## 15. Data and Content Model

### 15.1 Entities

| 판정 | entity | fields | cardinality/order | optional/format/localization |
| --- | --- | --- | --- | --- |
| INFERRED | `PageContent` | `locale, hero, premium, service, values, naming, assets, actions, footer` | 1, 고정 순서 | locale `ko|en` |
| INFERRED | `HeroContent` | `titleLead,titleMain,body,image` | 1 | body optional, 문자열 |
| INFERRED | `SectionCopy` | `eyebrow?,title,body[]` | section당 1 | body 0..3 |
| OBSERVED | `Value` | `index,title,description` | 정확히 3, 01→03 | description 1줄 후보 |
| OBSERVED | `Media` | `id,src,alt,width,height,focalX,focalY` | Hero 1, Premium 2, Service 1, Naming 1, Assets 3 | alt locale별 |
| OBSERVED | `Action` | `label,description,href?` | 정확히 2, Contact→Recruit | href UNKNOWN |
| INFERRED | `FooterData` | `brand,legalLines,copyright` | 1 | legal line optional |
| INFERRED | `Chapter` | `id,label,sectionId` | 보이는 02/04/06 + 구현 전체 | label locale별 |

### 15.2 Fixture shape

```ts
type PageContent = {
  locale: "ko" | "en";
  hero: { titleLead: string; titleMain: string; body?: string; image: Media };
  premium: { title: string; images: [Media, Media] };
  service: { title: string; body: string[]; image: Media };
  values: [Value, Value, Value];
  naming: { titleLines: [string,string,string,string]; body: string; image: Media };
  assets: { eyebrow: string; title: string; body: string; items: [Media,Media,Media] };
  actions: [Action, Action];
  footer: FooterData;
};
```

- OBSERVED — 증거 카피는 구조와 줄 수를 계측하기 위한 참고이며 배포 구현에서는 권리 확보된 새 카피로 교체한다.
- INFERRED — loading은 media skeleton이 아닌 고정 dark surface, empty는 해당 section 숨김 또는 명시된 필수 수량 validation error, error는 레이아웃 보존 fallback이다.
- INFERRED — value index는 두 자리 `01` 형식, action order는 구성 파일 순서, locale fallback은 `ko`.

## 16. Frontend Architecture

- INFERRED — route는 `/` 하나이며 Shell-A와 P-01을 동일 layout에서 렌더한다.
- INFERRED — 권장 구조는 아래와 같고 프레임워크 선택과 무관하게 모듈 경계를 유지한다.

```text
src/
  app/
    AppShell
    routes
  pages/brand-story/
    BrandStoryPage
    sections/
    brand-story.data
  components/
    SiteHeader
    SiteFooter
    MediaFigure
    ActionCard
  styles/
    tokens.css
    globals.css
    layout.css
  assets/
    brand/
    hero/
    sections/
  models/
    content
  tests/
    visual/
    accessibility/
```

- INFERRED — styling은 CSS custom properties + component-scoped CSS를 사용하고 좌표 재현용 magic number는 section 모듈 근처 변수로 명명한다.
- INFERRED — 콘텐츠는 정적 typed data 또는 CMS adapter로 분리하고 component에 원문을 하드코딩하지 않는다.
- INFERRED — 현재 chapter observer만 client boundary가 필요하며 나머지 page는 정적/서버 렌더 가능하다.
- INFERRED — third-party 책임은 아이콘 `lucide`, 이미지 최적화, visual regression, axe 기반 접근성 검사로 제한한다.
- INFERRED — 애니메이션 엔진, carousel, smooth-scroll 라이브러리는 필요하지 않다.
- UNKNOWN — 원 사이트 framework/CMS는 확인되지 않으며 재구현 요구사항이 아니다.

## 17. Implementation Task Graph

| 판정 | Task | deps | inputs | outputs / affected IDs | completion criteria | group |
| --- | --- | --- | --- | --- | --- | --- |
| INFERRED | T01 증거 기준선 설정 | 없음 | E01–E05 좌표 | visual fixtures | 1200/243 기준 이미지 로드 | A |
| INFERRED | T02 토큰 구현 | T01 | §9–10 | tokens.css, 전 페이지 | 색/spacing/type snapshot 통과 | A |
| INFERRED | T03 AppShell/Header | T02 | §4–5 | P01-S01 | 3-zone 정렬, fixed 반복 재현 | B |
| INFERRED | T04 Hero | T02,T03 | A02, §6 S02 | P01-S02 | bounds/초점/줄바꿈 허용치 충족 | B |
| INFERRED | T05 Premium | T02 | A03/A04 | P01-S03 | 52%/80% 폭과 간격 충족 | B |
| INFERRED | T06 Service | T02 | A05 | P01-S04 | 50:50, light strip 충족 | B |
| INFERRED | T07 Values | T02 | values data | P01-S05 | 3행, divider, 대비 충족 | B |
| INFERRED | T08 Naming | T02 | A06 | P01-S06 | 50:50, 4줄 display 충족 | B |
| INFERRED | T09 Assets | T02 | A07–A09 | P01-S07 | D collage/M 3열 충족 | B |
| INFERRED | T10 CTA/Footer | T02 | actions/legal | P01-S08/S09 | 카드 2개, footer grid 충족 | B |
| INFERRED | T11 responsive pass | T04–T10 | §12 | 전 섹션 | 6개 viewport overflow 0 | C |
| INFERRED | T12 interactions | T03,T10 | §13 | header/links/cards | 모든 state와 reduced motion | C |
| INFERRED | T13 accessibility | T03–T12 | §14 | 전 페이지 | keyboard/axe/contrast 통과 | D |
| INFERRED | T14 visual QA | T11–T13 | E01–E05 | diff report | geometry/color tolerance 충족 | D |
| INFERRED | T15 performance | T14 | asset manifest | optimized build | LCP asset 우선, lazy media, CLS<.1 | E |
| INFERRED | T16 Godot 치환 | T02–T15 | §20 콘텐츠 | 독자 프로젝트 버전 | 원 상표/카피 0건, 구조 유지 | E |

- INFERRED — Group B의 T04–T10은 T02 이후 병렬화 가능하고, T11/T12는 구현 완료 후 부분 병렬화 가능하다.

## 18. Page-Specific Acceptance Criteria

### P-01 checklist

- INFERRED — `[ ]` 1200×4895 준비 기준과 1920×7832 매핑 기준에서 E01–E04를 overlap 제거 후 한 장으로 비교한다.
- INFERRED — `[ ]` 모바일은 243×991 E05 원본 비교와 390/360 reflow 비교를 모두 수행한다.
- INFERRED — `[ ]` P01-S02–S09의 주요 상/하단 edge는 기준 대비 `±4px`, 반복 row/카드 gap은 `±2px`다.
- INFERRED — `[ ]` header의 높이, 좌우 padding, 중앙 로고 중심은 `±2px`; 로고 중심 x는 viewport 중심에서 `±1px`다.
- INFERRED — `[ ]` S04와 S06의 중앙 분할선은 viewport 50%에서 `±1px`다.
- INFERRED — `[ ]` S03 sunset 52%, passenger 80% 폭은 `±1%`; S07 collage 경계는 `±4px`다.
- INFERRED — `[ ]` 평면 UI `#111122`, `#001155`, `#EEEEEE`는 `ΔE≤3`; 사진 영역은 압축 차이 때문에 평균 `ΔE≤8`.
- INFERRED — `[ ]` H1/H2의 font-size `±2px`, line-height `±2px`, weight 시각 등가, letter-spacing 0을 검증한다.
- INFERRED — `[ ]` Hero 2분 제목, Premium 2줄, Naming 4줄, CTA 2줄이 증거와 동일하고 텍스트가 패널을 넘지 않는다.
- INFERRED — `[ ]` 모든 이미지의 focal point가 manifest 기준 `±2%`, object-fit cover, radius 0, shadow none이다.
- INFERRED — `[ ]` 1440/1280/1024/768/390/360에서 horizontal overflow가 0px다.
- INFERRED — `[ ]` 390/360에서도 S04/S06 2열, S07 3열, S08 카드 2열이 유지되고 각 텍스트가 겹치지 않는다.
- INFERRED — `[ ]` keyboard Tab 순서, Enter activation, focus ring, skip link, disabled target 처리, active locale announcement가 §14와 일치한다.
- INFERRED — `[ ]` `prefers-reduced-motion`에서 transform과 fade가 제거된다.
- INFERRED — `[ ]` axe critical/serious violation 0, 텍스트 대비 목표 충족, 200% zoom reflow 통과다.
- INFERRED — `[ ]` Hero 외 이미지는 lazy-load, 모든 media wrapper는 고정 aspect ratio여서 CLS가 `0.1` 미만이다.
- INFERRED — `[ ]` 목표 성능은 압축 자산 기준 LCP `≤2.5s`, INP `≤200ms`, CLS `≤0.1`이며 테스트 환경을 보고서에 기록한다.

## 19. Uncertainties and Decisions

| 판정 | page/section/component | UNKNOWN | 선택한 구현 결정 | 기각 대안 | confidence | 추가 증거 |
| --- | --- | --- | --- | --- | --- | --- |
| UNKNOWN | P-01 route | 실제 URL | `/` | 임의 `/brand` | MEDIUM | 주소창/사이트맵 |
| UNKNOWN | P01-S01 | 원본 폰트/정확한 CSS 높이 | Pretendard, h64/52 | 서체 추측 고정 | MEDIUM | CSS/font network |
| UNKNOWN | P01-S01 | 모바일 menu 존재 | 렌더하지 않음, bounds 0 | hamburger 발명 | HIGH | menu-open 캡처 |
| UNKNOWN | P01-S01 | chapter 클릭 가능 여부 | 읽기 전용 output | anchor link 강제 | MEDIUM | hover/click 영상 |
| UNKNOWN | P01-S01 | 01/03/05 chapter label | 중립 섹션명으로 새 콘텐츠에 맞춤 | 원문 추정 | HIGH | 전체 원 내비게이션 |
| UNKNOWN | P01-S02 | hero video 여부 | 정적 picture | autoplay video | MEDIUM | DOM/동영상 증거 |
| UNKNOWN | P01-S02 | overlay 정확값 | `rgba(17,17,34,.45)` | overlay 없음 | LOW | 원 이미지/CSS |
| UNKNOWN | P01-S03 | 사진 source/crop 원본 | manifest focal point 사용 | center 무조건 사용 | MEDIUM | 원본 asset |
| UNKNOWN | P01-S04 | 360px에서 split 유지 의도 | E05 근거로 유지 | 세로 stack | HIGH | 실제 360 캡처 |
| UNKNOWN | P01-S05 | 저대비 text의 정확 alpha | WCAG까지 밝힘 | 증거 대비 그대로 | MEDIUM | CSS token |
| UNKNOWN | P01-S07 | collage 개별 링크/라이트박스 | 정적 figure | modal gallery | HIGH | 클릭 상태 |
| UNKNOWN | P01-S08 | Contact/Recruit URL | href 없으면 disabled span | `#` 링크 | HIGH | 실제 href |
| UNKNOWN | P01-S09 | legal copy의 정확 글자 | 새 프로젝트 legal copy | OCR 추정 복제 | HIGH | 원문 텍스트 |
| UNKNOWN | P-01 | scroll reveal/parallax | 없음 | GSAP 기반 연출 | MEDIUM | 화면 녹화 |
| UNKNOWN | P-01 | 서버/CMS/framework | 정적 typed content adapter | 특정 framework 종속 | HIGH | repository/headers |

- INFERRED — UNKNOWN은 구현 중 TODO로 숨기지 않고 위 결정값을 기본값으로 사용하며, 추가 증거가 들어오면 해당 행만 재판정한다.

## Completion Gate

- OBSERVED — `[x]` 페이지/라우트 인벤토리가 §3에 있다.
- OBSERVED — `[x]` 보이는 유일 페이지 P-01의 완전한 명세가 §6에 있다.
- OBSERVED — `[x]` 데스크톱/모바일 navigation geometry와 모든 확인 가능 상태가 §5에 있다.
- OBSERVED — `[x]` E01–E05와 연결된 픽셀 좌표가 §2, §5, §6, §11에 있다.
- OBSERVED — `[x]` HEX/RGB/HSL/alpha, 근거, 신뢰도, 허용 오차가 §9에 있다.
- OBSERVED — `[x]` 1440/1280/1024/768/390/360 반응형 수치가 §12에 있다.
- OBSERVED — `[x]` component contract, data model, architecture, task graph가 §8, §15–17에 있다.
- OBSERVED — `[x]` P-01 전용 acceptance criteria가 §18에 있다.
- OBSERVED — `[x]` 모든 정적 증거 밖의 동작은 UNKNOWN 또는 INFERRED로 표시했다.

## 20. Godot 프로젝트 적용 매핑

### 20.1 치환 원칙

- INFERRED — 원 항공사명, 로고, 슬로건, 서비스 문구, 좌석/공항 브랜딩 이미지는 복제하지 않는다.
- INFERRED — 보존 대상은 `고정 3-zone header`, `전폭 비행 Hero`, `중앙 52% media`, `80% panorama`, `50:50 시스템 split`, `3개 가치 row`, `50:50 명명 split`, `3-up media gallery`, `2-card CTA`, `legal footer`의 구성 리듬뿐이다.
- INFERRED — 모든 사진은 해당 Godot 항공 프로젝트에서 직접 캡처한 gameplay, cockpit, weather, debug, UI 화면으로 대체한다.
- INFERRED — 원 cream dot는 프로젝트의 waypoint/target reticle을 연상시키는 비상호작용 점으로 재해석하되 색과 위치만 구조적으로 유지한다.

### 20.2 Route and navigation mapping

| 판정 | 원 구조 역할 | Godot 사이트 target | route/anchor | header chapter label | content source |
| --- | --- | --- | --- | --- | --- |
| INFERRED | 중앙 로고/Home 후보 | Home | `/` / `#home` | `01. HOME` | 프로젝트명/독자 로고 |
| INFERRED | 철학 Hero/Premium | Game / Project | `/game` 또는 `#game` | `02. GAME / PROJECT` | 장르, 핵심 판타지, 개발 상태 |
| INFERRED | 서비스 품질 split | Flight Systems | `/systems` 또는 `#systems` | `03. FLIGHT SYSTEMS` | 비행 모델/기체/기상 |
| INFERRED | 3대 가치 | Flight Systems detail | `#systems-pillars` | `04. SYSTEM PILLARS` | Aerodynamics, Weather, Navigation |
| INFERRED | 브랜드 명명 split | Devlog | `/devlog` 또는 `#devlog` | `05. DEVLOG` | 개발 철학/최신 milestone |
| INFERRED | Brand Assets gallery | Media | `/media` 또는 `#media` | `06. MEDIA` | gameplay still, HUD, environment |
| INFERRED | Contact Us 카드 | Download | `/download` | `07. DOWNLOAD` | build/platform/requirements |
| INFERRED | Recruit 카드 | Play CTA | 외부 store/demo URL | `08. PLAY` | Demo/Play now |

### 20.3 Section-by-section content mapping

| 판정 | Section | Godot 재구성 | 정확한 구조 치환 | 금지되는 복제 |
| --- | --- | --- | --- | --- |
| INFERRED | P01-S01 | 프로젝트 shell | KOR/ENG→언어, 중앙 독자 로고, 우측 scroll chapter | 원 wordmark/심벌 |
| INFERRED | P01-S02 | Home | cloud/wing photo→실제 in-engine 비행 장면; 2분 H1→프로젝트명 + literal category; body→한 문장 pitch | 원 슬로건/항공사명 |
| INFERRED | P01-S03 | Game/Project | sunset shot→대표 gameplay still; 2줄 H2→게임의 핵심 비행 경험; passenger photo→cockpit/dev shot | 좌석 승객 사진 |
| INFERRED | P01-S04 | Flight Systems | 좌측 seat photo→cockpit/instrument shot; 우측 copy→비행 모델 설명; light strip→시스템 데이터 footer | 서비스 품질 문구 |
| INFERRED | P01-S05 | 3 System Pillars | `01 Aerodynamics`, `02 Dynamic Weather`, `03 Navigation & Avionics`; 각 1줄 기술 설명 | Essential/Comfortable/Authentic 원 조합 |
| INFERRED | P01-S06 | Devlog | 좌측 4줄 display→현재 milestone/dev philosophy; 우측 clouds→최신 build weather shot | 브랜드 naming 선언문 |
| INFERRED | P01-S07 | Media | 3 visual→HUD screenshot, aircraft/environment still, short dev clip poster; eyebrow→Media | 공항 signage/원 UI |
| INFERRED | P01-S08 | Download/Play CTA | 왼쪽 H2→“Take the controls”; 오른쪽 intro→platform/build 상태; 카드→Download Demo, Play Build | Contact Us/Recruit 문구 |
| INFERRED | P01-S09 | 프로젝트 footer | 독자 로고, engine credit, studio/contact, copyright, privacy/license | 원 회사 주소/법인 정보 |

### 20.4 Godot-specific component/data mapping

- INFERRED — `HeroSection.image`는 Godot `Viewport` 캡처 또는 export build screenshot의 AVIF/WebP를 사용하고 실제 게임 상태를 선명하게 보여준다.
- INFERRED — `Value` 데이터는 `{index:"01", title:"Aerodynamics", description:"..."}`처럼 기술 축 3개로 고정한다.
- INFERRED — `AssetGallerySection`의 세 항목은 `Gameplay`, `Cockpit UI`, `World/Weather` 범주를 각각 하나씩 가져 중복 없는 inspection media를 제공한다.
- INFERRED — `Action`은 `{label:"Download Demo", href:buildUrl, platform, version, fileSize}`와 `{label:"Play", href:storeUrl}`로 확장한다.
- INFERRED — build URL이 없을 때 Download 카드는 disabled 상태와 “Build unavailable” 보조문을 표시하고 가짜 링크를 만들지 않는다.
- INFERRED — Devlog는 정적 증거의 단일 intro 블록을 유지하되 최신 항목 `{title,date,summary,href}` 하나만 노출하고 목록 route는 별도 확장 가능하다.
- INFERRED — footer에는 `Made with Godot` 표기를 Godot 상표 가이드에 맞게 text 또는 허가된 자산으로 넣고, 원 항공사 법적 문구는 일절 사용하지 않는다.

### 20.5 Godot implementation acceptance

- INFERRED — `[ ]` Home, Game/Project, Flight Systems, Media, Devlog, Download/Play CTA가 header chapter와 section ID에 모두 연결된다.
- INFERRED — `[ ]` 프로젝트명은 첫 viewport의 H1 또는 중앙 로고로 명확히 보이고, Hero 아래 다음 섹션의 시각 힌트가 남는다.
- INFERRED — `[ ]` 모든 미디어는 실제 프로젝트 화면 또는 권리 확보 자산이며 원 브랜드 로고/문구/사진의 픽셀 복제는 0건이다.
- INFERRED — `[ ]` Download/Play CTA는 실제 target이 있을 때만 링크이고, 없을 때는 명시적 disabled 상태다.
- INFERRED — `[ ]` 구조적 visual diff는 §18을 따르되 콘텐츠 차이로 인한 텍스트 폭은 지정 max-width와 줄 수 기준으로 검수한다.
- INFERRED — `[ ]` Godot 프로젝트의 기술 정보, 플랫폼, 버전, 파일 크기는 data model에서 관리하며 화면에 하드코딩하지 않는다.
