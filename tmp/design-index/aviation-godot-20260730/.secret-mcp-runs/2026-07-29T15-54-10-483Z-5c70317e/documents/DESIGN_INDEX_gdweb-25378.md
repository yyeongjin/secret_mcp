# DESIGN INDEX — gdweb-25378 / 파블로 항공

- OBSERVED — 계약 스키마: `secret-mcp/design-index/v2`; 등록일: 2025-07-30; 수상: WINNER PRIZE; 메타 개념: 깔끔함·신뢰감; 메타 기본색: BLACK·BLUE·WHITE.
- INFERRED — 이 문서는 시각 구조만 재현하고, 원 상표·로고·사진·영상·긴 문구는 복제하지 않는다. 구현 시 섹션 20의 항공 Godot 프로젝트 콘텐츠로 대체한다.
- MEASURED — 모든 데스크톱 좌표는 준비 캔버스 `1200×4402px`의 좌상단 `(0,0)`을 원점으로 한다. 모바일 좌표는 `243×891px` 원본의 좌상단을 원점으로 한다.

## 1. Reconstruction Goal and Scope

- OBSERVED — 참조 ID는 `gdweb-25378`, 작품명은 파블로 항공이며 증거는 데스크톱 장문 캡처 1개를 3개 타일로 자른 것과 모바일 장문 캡처 1개다.
- OBSERVED — 증거는 서로 다른 라우트의 콜라주가 아니라 Intro, Showcase, About, Solution, Industry, News, Footer가 순서대로 이어지는 단일 Home 페이지다. 데스크톱 타일의 80px 중첩은 콘텐츠 반복이 아니다.
- INFERRED — 충실도 목표는 1440px 비교 캡처에서 주요 경계 ±4px, 반복 간격 ±2px, 평면 UI 색상 `ΔE ≤ 3`, 텍스트 기준선 ±3px, 가로 오버플로 0px다. 신뢰도 HIGH, 허용 오차는 명시값을 우선한다.
- INFERRED — 지원 뷰포트는 `1440/1280/1024/768/390/360 CSS px`; 프레임워크와 무관하게 시맨틱 HTML, CSS Grid/Flex, 반응형 이미지, 키보드 내비게이션을 제공한다.
- INFERRED — 구현 대상은 `P-01 Home` 한 페이지와 페이지 내 앵커다. 증거에 보이지 않는 상세 페이지, 인증, 검색, 결제, CMS 편집 화면은 비목표다.
- UNKNOWN — 원 사이트의 실제 CSS, 웹폰트 파일, 동영상 소스, 메뉴 패널, hover 애니메이션, 캐러셀 자동 재생 간격은 정적 캡처로 알 수 없다. 각 항목은 아래의 구체적 구현 결정을 따른다.

## 2. Evidence Inventory and Coordinate System

| 판정 | Evidence ID | 종류/파트 | 원본 | 준비 이미지 | 준비 crop `(x,y,w,h)` | 원본 매핑 `(x,y,w,h)` | 배율 | 보이는 범위 | 한계 |
|---|---|---|---:|---:|---:|---:|---:|---|---|
| MEASURED | `E-D01` | desktop 1/3 | 1920×7043 | 1200×4402 | 0,0,1200,1600 | 0,0,1920,2560 | 0.625/0.625 | P01-S01~S03 상부 | S03 하부 절단 |
| MEASURED | `E-D02` | desktop 2/3 | 1920×7043 | 1200×4402 | 0,1520,1200,1600 | 0,2432,1920,2560 | 0.625/0.625 | P01-S03 하부~S06 상부 | 상·하부 80px 중첩/절단 |
| MEASURED | `E-D03` | desktop 3/3 | 1920×7043 | 1200×4402 | 0,3040,1200,1362 | 0,4864,1920,2179 | 0.625/0.625 | P01-S06 하부~S08 | 상부 80px 중첩 |
| MEASURED | `E-M01` | mobile 1/1 | 243×891 | 243×891 | 0,0,243,891 | 0,0,243,891 | 1/1 | P01-S01~S08 전체 | 작은 래스터라 텍스트/아이콘 세부 저신뢰 |

- MEASURED — 데스크톱 정규 좌표는 `canonicalY = tileLocalY + cropY`; 따라서 `E-D02 local y=0`은 `y=1520`, `E-D03 local y=0`은 `y=3040`이다.
- MEASURED — 원본 소스 좌표 복원은 준비 좌표를 `1.6`배 한다. 예: 준비 `(87,27,115,15)`는 원본 약 `(139,43,184,24)`.
- MEASURED — `E-D01/E-D02`의 준비 y=1520–1600과 `E-D02/E-D03`의 준비 y=3040–3120을 각각 한 번만 계산했다.
- INFERRED — 이후 `D:(x,y,w,h)`는 정규 데스크톱 준비 좌표, `M:(x,y,w,h)`는 모바일 좌표를 뜻한다. 픽셀 경계 판독 신뢰도는 큰 면 HIGH(±2px), 텍스트/아이콘 MEDIUM(±3px), 모바일 미세 요소 LOW(±2px)다.

## 3. Site Map and Page/Route Inventory

| 판정 | Page ID | route/name | 목적 | 증거 | shell | Desktop | Mobile | 기본/active | 신뢰도 |
|---|---|---|---|---|---|---|---|---|---|
| OBSERVED | P-01 | `/` / Home | 브랜드 인트로, 대표 프로젝트, 소개, 솔루션, 산업군, 뉴스, 연락처를 한 흐름으로 제시 | E-D01~03, E-M01 | 투명 오버레이 헤더 + 암청색 Footer | 있음 | 있음 | 기본 페이지; Home active 표시는 보이지 않음 | HIGH |

- OBSERVED — 직접 보이는 내비게이션 항목은 `Solution`, `Industry`, `Company`, `News`, `Careers`, `Contact Us`, `KR`, `MENU`다.
- INFERRED — `Solution`, `Industry`, `News`, `Contact Us`는 각각 `#solution`, `#industry`, `#news`, `#contact` 앵커로 연결한다.
- UNKNOWN — `Company`, `Careers`, 언어 선택, `MENU` 패널의 실제 대상/라우트는 보이지 않는다. 구현 결정은 `#about`, `#devlog`, locale menu, 전체 메뉴 패널이다.

## 4. Shared Application Shell

- MEASURED — 데스크톱 페이지는 폭 1200px 준비 캔버스에서 full-bleed, 높이 4402px이며 좌우 흰 여백이 없다(E-D01~03 전체). 모바일은 243×891px full-bleed다(E-M01 전체).
- INFERRED — `.AppShell`은 `width:100%; min-width:320px; overflow:clip; background:#001122`; 콘텐츠 최대폭은 데스크톱 원본 환산 `1640px`, 준비 좌표상 `1025px`; 1440px에서는 `max-width:1230px`, 기본 gutter 64px다. 신뢰도 MEDIUM, QA ±8px.
- OBSERVED — 공지 바, 쿠키 배너, 모달은 보이지 않는다. 구현에서도 초기 상태에 표시하지 않는다.
- OBSERVED — 헤더는 Intro와 Showcase에 각각 겹쳐 보이며, 본문 섹션에는 별도 고정 헤더 흔적이 없다.
- INFERRED — stacking context는 background media `z=0`, scrim `z=1`, content `z=2`, header `z=20`, carousel controls `z=10`, mobile menu overlay `z=40`, panel `z=50`, skip link `z=60`이다.
- INFERRED — 전역 focus ring은 `2px solid #66A3FF`, offset `3px`; 전역 선택색은 배경 `rgba(25,93,210,.35)`, 글자 `#FFFFFF`다.

## 5. Navigation and Header Specification

### 5.1 Desktop geometry

| 판정 | 항목 | Intro header — E-D01 | Showcase header — E-D01 | 구현값/허용오차 |
|---|---|---|---|---|
| MEASURED | total header height | D:(0,0,1200,64) | D:(0,591,1200,93) | 1440에서 76px / 112px; ±4px |
| MEASURED | utility-bar height | 0px 독립 바 없음 | 0px 독립 바 없음 | 동일 행 20px control |
| MEASURED | content width | x=87~1114, 1027px | x=87~1114, 1027px | `min(100%-2gutter,1230px)` |
| MEASURED | left/right padding | 87px / 86px | 87px / 86px | 원본 환산 139/138px; 1440 구현 64px |
| MEASURED | logo bounds | D:(87,27,115,15) | D:(87,648,115,15) | 1440: 138×18px; ±3px |
| MEASURED | primary menu start | 숨김 | x=270px, y=650px | 1440: x≈324px; ±8px |
| MEASURED | item widths | 없음 | 45,47,51,37,48,66px | 좌우 padding 10px |
| MEASURED | item gap | 없음 | 약 23px | 28px; ±4px |
| MEASURED | text baseline | 없음 | y≈660px | header top+70px; ±3px |
| MEASURED | icon size | globe 약 9×9px | globe 약 9×9px | 12px |
| MEASURED | action area | D:(1017,22,97,20) | D:(1016,643,98,21) | 118px |
| OBSERVED | border | MENU 아래 가는 흰 선 | MENU 아래 가는 흰 선 | `border-bottom:1px solid rgba(255,255,255,.55)` |
| OBSERVED | background | transparent over navy | transparent over black media | transparent |
| INFERRED | position/z | section-absolute | section-absolute | `position:absolute; inset:0 0 auto; z-index:20` |

### 5.2 Mobile geometry

| 판정 | 항목 | E-M01 좌표 | 390px 구현값 | 360px 구현값 | 신뢰/허용오차 |
|---|---|---:|---:|---:|---|
| MEASURED | bar height | 16px Intro; 20px Showcase | 48px | 46px | MEDIUM / ±3px |
| MEASURED | side padding | 17px | 20px | 18px | MEDIUM / ±2px |
| MEASURED | logo bounds | M:(17,4,22,4); M:(18,130,22,4) | 76×11px | 70×10px | LOW / ±3px |
| MEASURED | language control | M:(207,4,8,4) | 24×24px | 24×24px | LOW / ±2px |
| MEASURED | menu bounds | M:(219,4,8,5) | 24×24px | 24×24px | LOW / ±2px |
| INFERRED | touch target | 증거에서 식별 불가 | 44×44px | 44×44px | HIGH / 0px 미만 금지 |
| UNKNOWN | open panel origin | 캡처에 없음 | top:0,right:0 | top:0,right:0 | 구현 결정 |
| INFERRED | panel size | 캡처에 없음 | 351×100dvh | 324×100dvh | MEDIUM / ±4px |
| INFERRED | row height | 캡처에 없음 | 56px | 56px | HIGH / ±2px |
| INFERRED | indentation/divider | 캡처에 없음 | 24px / 1px `#223344` | 동일 | MEDIUM |
| INFERRED | overlay | 캡처에 없음 | `rgba(0,8,24,.72)` | 동일 | MEDIUM / alpha ±.05 |
| INFERRED | close/lock | 캡처에 없음 | X·Escape·overlay click; body scroll lock | 동일 | HIGH |

### 5.3 Item order and state contract

| 판정 | 순서 | 표시 | target | desktop | mobile closed |
|---|---:|---|---|---|---|
| OBSERVED | 1 | Solution | INFERRED `#solution` | 표시 | 숨김 |
| OBSERVED | 2 | Industry | INFERRED `#industry` | 표시 | 숨김 |
| OBSERVED | 3 | Company | INFERRED `#about` | 표시 | 숨김 |
| OBSERVED | 4 | News | INFERRED `#news` | 표시 | 숨김 |
| OBSERVED | 5 | Careers | UNKNOWN; 구현 `#devlog` | 표시 | 숨김 |
| OBSERVED | 6 | Contact Us | INFERRED `#contact` | 표시 | 숨김 |
| OBSERVED | 7 | KR + globe | UNKNOWN locale menu | 표시 | icon/pill |
| OBSERVED | 8 | MENU | INFERRED full menu | 표시 | icon control |

| 판정 | 상태 | 색/선/불투명도/변형 | 시간/easing | 입력 동작 |
|---|---|---|---|---|
| INFERRED | default | text `#FFF`, alpha .92; menu underline `rgba(255,255,255,.55)` | 0ms | 링크/버튼 |
| INFERRED | hover | text `#66A3FF`; underline `#195DD2`, scaleX 1 | 180ms `ease-out` | pointer만 |
| INFERRED | focus-visible | 2px `#66A3FF`, offset 3px, radius 2px | 0ms | Tab |
| INFERRED | pressed | opacity .72, translateY(1px) | 80ms `ease-out` | pointer/key down |
| UNKNOWN | active | 캡처 표시 없음; 구현 `#66A3FF` + 2px 하선 | 180ms | 현재 앵커 |
| INFERRED | disabled | `#778396`, opacity .45, pointer-events none | 0ms | `aria-disabled=true` |
| UNKNOWN | scrolled | 증거 없음; 구현 `position:fixed;height:64px;background:rgba(0,17,34,.92);backdrop-filter:blur(12px)` | 220ms | scrollY>Intro |
| INFERRED | menu-open | overlay alpha .72, panel translateX(0), icon→X | 260ms cubic-bezier(.2,.8,.2,1) | Enter/Space/click |
| INFERRED | submenu-open | chevron rotate 180°, child rows max-height 전개 | 220ms ease | Enter/Space |

## 6. Page-by-Page Specifications

### Page P-01: Home

#### 6.1 Identity and canvas

- OBSERVED — route `/`; 목적은 인트로에서 신뢰 이미지를 만든 뒤 Showcase→About→Solution→Industry→News→Contact 순으로 정보 깊이를 늘리는 것이다. 증거는 E-D01~03/E-M01 전체다.
- INFERRED — 진입점은 로고(`/`), 직접 URL, 각 앵커 링크다. shell은 투명 media-overlay header와 암청색 footer이며 active 내비게이션은 현재 교차 중인 section 링크다.
- MEASURED — 데스크톱 기준 캔버스는 1200×4402px, full-bleed, 기본 콘텐츠 gutter 62~88px다. 원본은 1920×7043px다.
- MEASURED — 모바일 기준 캔버스는 243×891px, side padding은 일반 텍스트 18~33px, full-bleed media는 0px, 가로 스크롤 없이 세로 적층된다.
- INFERRED — 구현 기준 1440px에서 페이지 예상 높이는 자산 비율 유지 시 약 5282px(준비본×1.2), 모바일 390px에서는 약 1430px(E-M01×1.605)다. 콘텐츠 길이에 따라 높이는 intrinsic으로 유지한다.

#### 6.2 Ordered section geometry

| 판정 | Section ID | Evidence/region | Bounds | 역할 | Container | Layout | Spacing/Alignment | Surface | Content | Responsive |
|---|---|---|---|---|---|---|---|---|---|---|
| MEASURED | P01-S01 | E-D01 y0–591; E-M01 y0–121 | D:(0,0,1200,591); M:(0,0,243,121) | intro/hero | full bleed | relative; centered absolute title | header 87px gutter; center/middle | navy abstract media; no border | logo header, circular motif, title | ≤768: 121/243=49.8vw; primary nav 없음 |
| MEASURED | P01-S02 | E-D01 y591–1180; E-M01 y121–238 | D:(0,591,1200,589); M:(0,121,243,117) | showcase hero | full bleed | media cover; content absolute | left 88px, bottom 69px | near-black video + dark scrim | full nav, title/body, badges, arrows, progress | ≤768: title left 18px; badges 우측; 높이 48vw |
| MEASURED | P01-S03 | E-D01 y1180–1600 + E-D02 y1520–1930; E-M01 y238–390 | D:(0,1180,1200,750); M:(0,238,243,152) | about/main section | full bleed; centered text | block; center stack | top 약 260px, gap 21px | night lake media, dark lower fade | eyebrow, H2, 2-line body, CTA | 모바일 높이 62.6vw; type/spacing 축소 |
| MEASURED | P01-S04 | E-D02 local y410–961; E-M01 y390–503 | D:(0,1930,1200,551); M:(0,390,243,113) | solution section | full bleed | 2-column 66.2/33.8% | left content x113; split x794 | left aerial media; right `#EEE` | H2/body/list, product render, tabs | 모바일 split 66.7/33.3 유지; 텍스트 축소 |
| MEASURED | P01-S05 | E-D02 local y961–1305; E-M01 y503–573 | D:(0,2481,1200,344); M:(0,503,243,70) | industry intro | full bleed | centered block | H2 y2634; body y2708 | dark navy, subtle glow | H2 + 2-line body | 높이 약 28.8vw |
| MEASURED | P01-S06 | E-D02 local y1305–1600 + E-D03 y0–376; E-M01 y573–693 | D:(0,2825,1200,591); M:(0,573,243,120) | industry gallery | full bleed | 5-column mosaic | gap 0; text near bottom/top overlay | five darkened photos | 5 category title/body | 모바일도 5열 압축, overflow 없음 |
| MEASURED | P01-S07 | E-D03 y376–1058; E-M01 y693–830 | D:(0,3416,1200,682); M:(0,693,243,137) | news/carousel | full bleed | heading row + horizontal cards | heading x163 y576(local); cards top 695(local) | `#001122`, 1px grid borders | title/body, arrows, 5 cards 일부 절단 | 모바일 4+ partial cards, 축소 carousel |
| MEASURED | P01-S08 | E-D03 y1058–1362; E-M01 y830–891 | D:(0,4098,1200,304); M:(0,830,243,61) | footer/contact | full bleed; inner 1076px | 2-column + legal row | x62~1138; top 46px; row border | deep navy, faint radial light | logo, addresses, CTA, social, legal, top | 모바일 동일 정보 다열 축소; 실구현은 적층 |

#### 6.3 Detailed section specifications

##### P01-S01 Intro

- MEASURED — E-D01 D:(0,0,1200,591), 중심 타이틀 bounds 약 D:(390,275,420,48); 중심은 `(600,299)`. 원형 선 motif는 약 D:(435,155,300,310).
- OBSERVED — 배경은 좌상단이 거의 검정이고 우하단이 밝은 navy인 추상 동심 곡면이며 제목은 대문자, 넓은 자간, 흰색이다.
- INFERRED — 배경 대체 자산은 16:9 항공 HUD/대기권 이미지를 `object-fit:cover; object-position:50% 50%`; title `font-size:50px; letter-spacing:.30em; font-weight:300`; 1440 구현 허용오차 bounds ±6px.
- INFERRED — 진입 애니메이션은 motif opacity 0→1 600ms, title opacity 0→1/translateY(8→0) 500ms 150ms 지연. reduced motion에서는 즉시 표시한다.

##### P01-S02 Showcase

- MEASURED — E-D01의 D:(0,591,1200,589). title D:(88,1025,305,48), body D:(89,1083,260,18), badge stack D:(1083,992,31,73), arrows D:(1008,1071,49,28), progress D:(0,1175,1200,5).
- OBSERVED — 야간 드론 쇼 media가 배경 전체를 채우며 헤더, 타이틀, 수상 배지, 캐러셀 제어가 그 위에 겹친다.
- INFERRED — scrim은 `linear-gradient(180deg,rgba(0,0,0,.20),rgba(0,0,0,.50))`; content bottom 72px; progress track `rgba(255,255,255,.12)`, active `#195DD2`, active 폭 75.3%(E-D01 x0–904). 신뢰 MEDIUM, ±8px.
- INFERRED — carousel은 이전/다음 버튼, pagination progress, `aria-roledescription=carousel`, 자동재생 6000ms, hover/focus 시 정지, swipe threshold 40px를 사용한다.

##### P01-S03 About

- MEASURED — E-D01/E-D02의 D:(0,1180,1200,750); E-D02 local y0에서 title 상단 일부가 중첩된다. CTA D:(525,1633,150,38), 배경 수평선 y≈1600, 섹션 종료 y=1930.
- OBSERVED — 별이 있는 푸른 밤하늘과 호수 실루엣 위에 eyebrow, 큰 제목, 2행 본문, 파란 CTA가 중앙 정렬된다.
- INFERRED — content `max-width:760px; margin:auto; padding-top:258px`; CTA 150×38px, 우측 plus icon 12px. 모바일은 `padding-top:53px`, CTA 31×8px의 증거 비율을 실제 접근성 구현에서 112×36px로 확대한다.
- INFERRED — CTA hover는 배경 `#2C73E8`, pressed `#1248A8`; 내부 label과 plus는 `justify-content:space-between`.

##### P01-S04 Solution

- MEASURED — E-D02 D:(0,1930,1200,551); 좌측 D:(0,1930,794,551), 우측 D:(800,1930,400,551), 중앙 gutter/경계 6px. 좌 H2 D:(113,2032,268,75), list 시작 y=2200; 우 제품 렌더 약 D:(884,2067,235,147), tabs D:(832,2389,336,37).
- OBSERVED — 좌측은 비행체 하향 시점 사진, 우측은 흰 배경 제품 렌더와 모델명/설명/2-tab 선택기다. 파란 원형 `View More` 제어가 split 경계에 걸친다.
- INFERRED — grid `66.25% 33.75%`; right panel `background:#EEEEEE;color:#111111`; 원형 control 92×92px, 중심 `(797,2189)`, `z-index:3`; tabs는 1fr 1fr, active `#195DD2`.
- INFERRED — 모바일 증거가 split을 유지하므로 768px까지 `2fr 1fr`; 390/360에서는 가독성을 위해 최소 우측 128/118px, 좌측 overflow clip, list는 active 1개만 표시한다.

##### P01-S05 Industry intro

- MEASURED — E-D02 D:(0,2481,1200,344), H2 약 D:(482,2630,236,64), body 약 D:(438,2705,324,36).
- OBSERVED — 단색에 가까운 짙은 navy와 중앙의 약한 푸른 광원 위에 중앙 정렬 제목과 2행 설명이 있다.
- INFERRED — `display:grid;place-content:center;text-align:center;padding:80px 24px 54px`; 배경 `radial-gradient(circle at 50% 60%,#062759 0,#001122 46%,#001022 100%)`.

##### P01-S06 Industry gallery

- MEASURED — E-D02/E-D03 D:(0,2825,1200,591); 5개 열의 x 경계는 약 `0,240,480,720,960,1200`, 각 240px. E-D03 local y0–376은 하부를 보인다.
- OBSERVED — 각 열은 서로 다른 항공/드론 사진과 어두운 scrim, 흰 제목, 회색 2행 설명을 가진다. 제목은 `Defense`, `Drone Art Show`, `Inspection`, `Drone Delivery`, `Urban ATM`.
- INFERRED — grid `repeat(5,minmax(0,1fr))`, item aspect는 데스크톱 240×591, `overflow:hidden`; image `cover center`; overlay `rgba(0,11,25,.48)`, hover `.25`; text bottom 44px, 좌우 24px.
- INFERRED — 768px 이하에서도 증거처럼 5열을 유지하되 제목 9px, 본문 숨김; 실제 터치 시 선택된 열이 `flex-grow:2`가 되지 않고 동일 폭을 유지해 레이아웃 이동을 막는다.

##### P01-S07 News

- MEASURED — E-D03 D:(0,3416,1200,682); heading row D:(0,3416,1200,299); H2 D:(163,3573,166,65); 설명 D:(355,3602,155,35); arrows D:(986,3607,50,28). card band D:(0,3715,1200,383).
- MEASURED — 카드 경계는 약 x=163,455,747,1038이며 중심 3개가 완전 노출된다. 완전 카드 폭 292px, media 약 244×158px, 내부 좌우 padding 22px.
- OBSERVED — 수평 캐러셀의 양끝 카드는 잘리고, 각 카드에 이미지, 제목, 요약, 날짜, `View More`가 있다. 카드 사이 1px 세로선이 보인다.
- INFERRED — track `display:grid;grid-auto-flow:column;grid-auto-columns:292px;overflow:hidden`; 초기 transform은 앞 카드가 163px만 보이도록 조정한다. 카드 title 2행, summary 2행, overflow hidden.
- INFERRED — 모바일은 E-M01 M:(0,693,243,137)에서 4개+부분 카드가 보이나 접근성을 위해 viewport당 1.25개 카드, horizontal scroll-snap, scrollbar 숨김을 사용한다.

##### P01-S08 Footer

- MEASURED — E-D03 D:(0,4098,1200,304). inner bounds x=62~1138, logo D:(62,4152,124,17), top control D:(1114,4137,21,26), CTA D:(62,4269,144,34), legal divider y=4369.
- OBSERVED — 왼쪽은 본사/전화/팩스/이메일/CTA/social, 오른쪽은 4개 사업장 주소, 하단은 copyright와 정책 링크다.
- INFERRED — desktop inner `max-width:1076px;margin:auto;padding:46px 0 0`; top grid `56% 44%`; legal row height 73px; border `1px solid rgba(255,255,255,.08)`.
- INFERRED — 모바일 실제 구현은 768px 이하에서 1열, 주소 accordion, legal wrap으로 전환한다. 증거의 61px 축소 footer는 정보 구조 참고용이며 최소 touch target 44px를 우선한다.

#### 6.4 Page-specific behavior, accessibility, assets, acceptance

- INFERRED — section intersection observer threshold 0.45로 active nav를 갱신하고, hash 이동은 scrolled header 64px을 뺀 위치로 `scroll-margin-top:72px`을 사용한다.
- INFERRED — P01의 heading order는 Intro title `p`, Showcase `h1`, About/Solution/Industry/News `h2`, 카드 제목 `h3`; footer는 heading 없는 address landmark다.
- INFERRED — 핵심 media는 S02만 eager/high priority, S01 background는 eager, S03 이후 lazy; 동영상 poster를 항상 제공한다.
- INFERRED — acceptance는 S01~S08의 순서·경계, S04 66/34 split, S06 5열, S07 partial-card composition, S08 2열을 각 기준 뷰포트에서 확인한다. 세부 체크리스트는 섹션 18을 따른다.

## 7. Section and Layout Deep Dives

### 7.1 P01-S01

- INFERRED — DOM: `section#intro > picture.IntroMedia + div.IntroScrim + Header--intro + div.IntroCenter > DecorativeRing + p.IntroTitle`.
- INFERRED — CSS: section `position:relative;min-height:49.25vw;max-height:710px;overflow:clip`; media `position:absolute;inset:0;width:100%;height:100%;object-fit:cover`; center `position:absolute;inset:0;display:grid;place-items:center`.
- INFERRED — desktop title max-width 620px, no wrap; tablet 42px; mobile 15px at 243 evidence equivalent and implementation 24px at 390, `white-space:nowrap`.

### 7.2 P01-S02

- INFERRED — DOM: `section#showcase > ShowcaseCarousel > article.Slide > video|picture + Scrim + Header--full + div.SlideCopy + AwardStack + CarouselControls + Progress`.
- INFERRED — CSS: section `position:relative;aspect-ratio:1200/589`; copy `position:absolute;left:7.33%;bottom:11.7%`; controls `right:7.2%;bottom:10.7%`; media is clipped.
- INFERRED — slide track uses `display:flex;width:100%;transform:translate3d(-index*100%,0,0)`; each slide `flex:0 0 100%`; no intrinsic media size may change section height.

### 7.3 P01-S03

- INFERRED — DOM: `section#about > picture + Scrim + div.AboutContent > p.Eyebrow + h2 + p.Body + ActionButton`.
- INFERRED — CSS: `position:relative;min-height:62.5vw`; content `position:relative;z-index:2;display:flex;flex-direction:column;align-items:center`; body max-width 650px; child gap 18px.
- INFERRED — desktop padding `258px 24px 80px`; 1024에서 `190px 32px 64px`; 390에서 `64px 24px 40px`. Background focal point is `50% 18%`, mobile `50% 35%`.

### 7.4 P01-S04

- INFERRED — DOM: `section#solution > div.SolutionVisual > picture + Copy + SolutionList + CircleLink`와 `aside.ProductPanel > ProductMedia + ProductMeta + ProductTabs`.
- INFERRED — CSS: parent `display:grid;grid-template-columns:minmax(0,1.985fr) minmax(0,1fr);height:551px`; visual `position:relative`; panel `display:grid;grid-template-rows:1fr auto auto`.
- INFERRED — tablet/mobile도 두 열을 유지한다: `minmax(0,2fr) minmax(118px,1fr)`. 360px에서 visual 240px/panel 120px; H2 max-width 190px; inactive list items 모바일 숨김.
- INFERRED — product image aspect `235/147=1.599`; `object-fit:contain`; tabs fixed 37px desktop, 24px evidence-mobile, 실제 36px 접근성 구현.

### 7.5 P01-S05

- INFERRED — DOM: `section#industry-intro > div.IndustryIntroContent > h2 + p`.
- INFERRED — CSS: `display:grid;place-items:center;min-height:344px`; content width 520px; row gap 18px; no overflow. 768px 이하 min-height `28.8vw`, 실제 최소 112px.

### 7.6 P01-S06

- INFERRED — DOM: `section#industry > ul.IndustryGrid > li*5 > a > picture + Scrim + div.Copy > h3 + p`.
- INFERRED — CSS: grid `repeat(5,minmax(0,1fr))`; items `min-width:0;height:591px`; text `position:absolute;left:24px;right:18px;bottom:44px`.
- INFERRED — 1024/768에서 높이 504/378px; 390/360에서 192/177px. 모바일 제목은 중앙, bottom 16px, 한 줄 ellipsis; body `display:none`.
- INFERRED — 반복 항목 수는 정확히 5개, gap 0px, 미완성 행 없음. 이미지 비율은 column width/section height에 종속되고 cover crop을 허용한다.

### 7.7 P01-S07

- INFERRED — DOM: `section#news > header.NewsHeader > h2 + p + ArrowGroup` 다음 `div.NewsViewport > ul.NewsTrack > li.NewsCard*5`.
- INFERRED — CSS: heading `height:299px;display:grid;grid-template-columns:166px 1fr auto;align-items:end;padding:0 163px 66px`; cards `grid-auto-columns:292px;height:383px`.
- INFERRED — card `display:grid;grid-template-rows:158px auto auto 1fr auto`; padding `20px 22px 23px`; image width 244px, aspect 1.544, `object-fit:cover`.
- INFERRED — 1024 이상 버튼 이동폭은 292px; 768 이하는 viewport width×0.8; `scroll-snap-type:x mandatory`, 각 card `scroll-snap-align:start`.

### 7.8 P01-S08

- INFERRED — DOM: `footer#contact > div.FooterMain > div.CompanyBlock + address.LocationList + BackToTop` 다음 `div.FooterLegal > small + nav`.
- INFERRED — CSS desktop `grid-template-columns:1.15fr 1fr`; CompanyBlock 내부 contact row는 flex wrap; LocationList는 2열 label/address; legal `display:flex;justify-content:space-between`.
- INFERRED — 모바일 `grid-template-columns:1fr`, `gap:24px`; location은 `<details>` 4개; legal은 column gap 12px. footer는 콘텐츠 기반 높이, 최소 304px desktop/420px mobile이다.

### 7.9 CSS-ready geometry sketch

```css
/* INFERRED — 증거 좌표를 반응형 구현으로 옮긴 핵심 골격 */
.home { overflow: clip; background: #001122; color: #fff; }
.intro { position: relative; aspect-ratio: 1200 / 591; min-height: 320px; }
.showcase { position: relative; aspect-ratio: 1200 / 589; }
.about { position: relative; aspect-ratio: 1200 / 750; }
.solution { display: grid; grid-template-columns: minmax(0, 1.985fr) minmax(0, 1fr); }
.industry-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); }
.news-track { display: grid; grid-auto-flow: column; grid-auto-columns: 292px; }
@media (max-width: 768px) {
  .desktop-primary-nav { display: none; }
  .solution { grid-template-columns: minmax(0, 2fr) minmax(118px, 1fr); }
  .industry-grid p { display: none; }
  .news-track { grid-auto-columns: 80vw; overflow-x: auto; scroll-snap-type: x mandatory; }
}
```

## 8. Component Abstraction

### 8.1 Complete tree

```text
AppShell
├─ SkipLink
├─ HomePage [P-01]
│  ├─ IntroSection [P01-S01]
│  │  ├─ SiteHeader variant="intro"
│  │  └─ IntroCenter
│  ├─ ShowcaseSection [P01-S02]
│  │  ├─ SiteHeader variant="full"
│  │  ├─ MediaCarousel
│  │  ├─ AwardStack
│  │  └─ CarouselControls
│  ├─ AboutSection [P01-S03]
│  ├─ SolutionSection [P01-S04]
│  │  ├─ SolutionList
│  │  ├─ CircleLink
│  │  └─ ProductPanel
│  ├─ IndustryIntro [P01-S05]
│  ├─ IndustryGrid [P01-S06]
│  │  └─ IndustryCard ×5
│  ├─ NewsSection [P01-S07]
│  │  ├─ NewsHeader
│  │  └─ NewsCarousel
│  │     └─ NewsCard ×N
│  └─ SiteFooter [P01-S08]
│     ├─ CompanyContact
│     ├─ LocationList
│     ├─ SocialLinks
│     └─ LegalNav
├─ MobileMenu
└─ LiveRegion
```

### 8.2 Component contracts

| 판정 | Component | 책임/경계 | Props와 slots | state/events/data | loading/empty/error/disabled | 접근성 | 매핑 |
|---|---|---|---|---|---|---|---|
| INFERRED | `AppShell` | 전역 token, landmarks, menu 상태 | `children:ReactNode`, `locale:string` | `menuOpen`; `onMenuChange` | 앱 오류 boundary | skip link, live region | P-01 전체 |
| INFERRED | `SiteHeader` | logo/nav/utilities 재사용 | `variant:'intro'|'full'|'scrolled'`, `activeId?:string` | menu/locale events | logo fallback text | `<header>`, labelled nav | S01,S02 |
| INFERRED | `MobileMenu` | 768 이하 전체 메뉴 | `items:NavItem[]`, `open:boolean` | focus trap, close | disabled item aria-disabled | dialog semantics, Escape | 전역 |
| INFERRED | `MediaCarousel` | showcase slide 전환 | `slides:ShowcaseSlide[]`, `intervalMs:number` | index, paused; next/prev | skeleton poster; empty hides controls; error poster | carousel labels/live off | S02 |
| INFERRED | `ActionButton` | CTA 시각/상태 통일 | `href`, `label`, `icon`, `variant` | click | busy spinner; disabled alpha .45 | accessible name | S03,S08 |
| INFERRED | `SolutionList` | solution 선택 | `items:Solution[]`, `selectedId` | select event | empty placeholder; disabled row | tablist 또는 link list | S04 |
| INFERRED | `ProductPanel` | 선택 제품 표시 | `product:Product`, `tabs:ProductVariant[]` | selected variant | image skeleton/error fallback | tab/tabpanel linkage | S04 |
| INFERRED | `IndustryGrid` | 5개 산업 카드 | `items:Industry[5]` | hover/focus | missing image neutral surface | list; descriptive alt | S06 |
| INFERRED | `NewsCarousel` | 뉴스 탐색 | `items:NewsItem[]` | index/scroll; arrows | 3 skeleton; empty text; retry | labelled region, buttons | S07 |
| INFERRED | `NewsCard` | 기사 요약 | `item`, `headingLevel:3` | link activation | image fallback | title is link name | S07 |
| INFERRED | `SiteFooter` | 연락/위치/법적 정보 | `company`, `locations`, `social`, `legal` | accordion/mobile | missing field omitted | address/nav landmarks | S08 |

### 8.3 Type definitions

```ts
// INFERRED — replaceable content model
type NavItem = { id: string; label: string; href?: string; children?: NavItem[]; disabled?: boolean };
type Media = { src: string; poster?: string; alt: string; width: number; height: number; focal?: string };
type ShowcaseSlide = { id: string; title: string; body?: string; media: Media; badges?: Media[] };
type ProductVariant = { id: string; label: string; media: Media; description?: string };
type Solution = { id: string; label: string; title: string; body: string; visual: Media; variants: ProductVariant[] };
type Industry = { id: string; title: string; body?: string; media: Media; href?: string };
type NewsItem = { id: string; title: string; summary?: string; dateISO: string; media: Media; href: string };
type Location = { id: string; label: string; address: string };
```

## 9. Design Tokens and Exact Color Specification

### 9.1 Color tokens

| 판정 | token | HEX | RGB | HSL | alpha | 역할/사용 | 근거 | 신뢰 | 허용오차 |
|---|---|---|---|---:|---|---|---|---|
| MEASURED | `--c-black` | `#111111` | rgb(17, 17, 17) | hsl(0, 0%, 7%) | 1 | S02 media dominant/검정 대체 | E-D01 palette 31.06% | HIGH | JPEG ±8 RGB; UI ΔE≤3 |
| MEASURED | `--c-navy-900` | `#001122` | rgb(0, 17, 34) | hsl(210, 100%, 7%) | 1 | App/S05/S07/S08 background | E-D02 18.23%, E-D03 36.39% | HIGH | UI ΔE≤3 |
| MEASURED | `--c-navy-850` | `#001133` | rgb(0, 17, 51) | hsl(220, 100%, 10%) | 1 | S01/S03/S05 photo blend | E-D01 5.99%, E-D02 10.85% | HIGH | photo ±10 RGB |
| MEASURED | `--c-navy-800` | `#112244` | rgb(17, 34, 68) | hsl(220, 60%, 17%) | 1 | elevated navy/surface | E-D01 9.64% | HIGH | ±8 RGB |
| MEASURED | `--c-slate-700` | `#223344` | rgb(34, 51, 68) | hsl(210, 33%, 20%) | 1 | borders/panel divider | E-D02 3.01% | MEDIUM | ΔE≤4 |
| MEASURED | `--c-surface-light` | `#EEEEEE` | rgb(238, 238, 238) | hsl(0, 0%, 93%) | 1 | S04 product panel | E-D02 8.88% | HIGH | ΔE≤2 |
| INFERRED | `--c-text` | `#FFFFFF` | rgb(255, 255, 255) | hsl(0, 0%, 100%) | 1 | primary text | E-D01 visible white text | HIGH | ΔE≤2 |
| INFERRED | `--c-text-muted` | `#A9B4C3` | rgb(169, 180, 195) | hsl(214, 17%, 71%) | 1 | body/meta/footer | E-D03 muted text visual estimate | MEDIUM | ΔE≤5 |
| INFERRED | `--c-border` | `#223344` | rgb(34, 51, 68) | hsl(210, 33%, 20%) | .65 | cards/footer divider | E-D03 x163/y695 local borders | MEDIUM | alpha ±.08 |
| INFERRED | `--c-primary` | `#195DD2` | rgb(25, 93, 210) | hsl(218, 79%, 46%) | 1 | CTA/tab/progress | E-D01 progress, E-D02 CTA/tab sampled visually | MEDIUM | ΔE≤4 |
| INFERRED | `--c-primary-hover` | `#2C73E8` | rgb(44, 115, 232) | hsl(217, 80%, 54%) | 1 | hover | 상태 미노출 구현 결정 | MEDIUM | ΔE≤4 |
| INFERRED | `--c-primary-pressed` | `#1248A8` | rgb(18, 72, 168) | hsl(218, 81%, 36%) | 1 | pressed | 상태 미노출 구현 결정 | MEDIUM | ΔE≤4 |
| INFERRED | `--c-secondary` | `#DDE5EF` | rgb(221, 229, 239) | hsl(213, 36%, 90%) | 1 | light panel secondary text | S04 대비 구현 | MEDIUM | ΔE≤4 |
| INFERRED | `--c-accent` | `#66A3FF` | rgb(102, 163, 255) | hsl(216, 100%, 70%) | 1 | focus/active | 접근성 구현 결정 | HIGH | ΔE≤3 |
| INFERRED | `--c-success` | `#2EB67D` | rgb(46, 182, 125) | hsl(155, 60%, 45%) | 1 | 성공 메시지(기본 숨김) | UNKNOWN 상태 보완 | LOW | ΔE≤5 |
| INFERRED | `--c-warning` | `#F0B429` | rgb(240, 180, 41) | hsl(42, 87%, 55%) | 1 | 경고(기본 숨김) | UNKNOWN 상태 보완 | LOW | ΔE≤5 |
| INFERRED | `--c-danger` | `#E05252` | rgb(224, 82, 82) | hsl(0, 70%, 60%) | 1 | 오류(기본 숨김) | UNKNOWN 상태 보완 | LOW | ΔE≤5 |
| INFERRED | `--c-overlay` | `#000818` | rgb(0, 8, 24) | hsl(220, 100%, 5%) | .72 | mobile menu/media scrim | 정적 이미지의 dark scrim | MEDIUM | alpha ±.05 |
| INFERRED | `--c-disabled` | `#778396` | rgb(119, 131, 150) | hsl(217, 13%, 53%) | .45 | disabled | 상태 미노출 구현 결정 | MEDIUM | alpha ±.05 |

### 9.2 Non-color tokens

| 판정 | 범주 | tokens/값 | 근거/예외 |
|---|---|---|---|
| INFERRED | spacing | `--sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:24px; --sp-6:32px; --sp-7:48px; --sp-8:64px; --sp-9:80px` | 4/8px 기반; 증거 예외 header gutter 87px, news x=163px |
| INFERRED | dimensions | `--header:76px; --header-scrolled:64px; --touch:44px; --container:1230px; --news-card:292px` | D 좌표 원본/1440 환산 |
| INFERRED | radius | `--r-0:0; --r-1:2px; --r-round:999px` | 대부분 직각; 원형 CTA만 round |
| INFERRED | border | `--line:1px solid rgba(34,51,68,.65)` | E-D03 grid/footer |
| INFERRED | shadow | `--shadow-panel:0 12px 32px rgba(0,8,24,.22)` | 캡처에 강한 shadow 없음; menu에만 |
| INFERRED | opacity | `--op-muted:.68; --op-disabled:.45; --op-scrim:.48; --op-overlay:.72` | visible overlays + 상태 결정 |
| INFERRED | z-index | `media:0;scrim:1;content:2;controls:10;header:20;overlay:40;menu:50;skip:60` | 겹침 관계 |
| INFERRED | breakpoints | `--bp-sm:390px; --bp-md:768px; --bp-lg:1024px; --bp-xl:1280px; --bp-2xl:1440px` | 계약 필수 폭 |
| INFERRED | icon | `12/16/20/24px`; touch 44px | header globe/arrows/controls |
| INFERRED | motion | `80/180/220/260/500/600ms`; easing `cubic-bezier(.2,.8,.2,1)` | 상태/진입/패널 |

```css
/* INFERRED — CSS-ready canonical token set */
:root {
  --c-black:#111111; --c-navy-900:#001122; --c-navy-850:#001133;
  --c-navy-800:#112244; --c-slate-700:#223344; --c-surface-light:#EEEEEE;
  --c-text:#FFFFFF; --c-text-muted:#A9B4C3; --c-primary:#195DD2;
  --c-primary-hover:#2C73E8; --c-primary-pressed:#1248A8; --c-accent:#66A3FF;
  --c-overlay:rgba(0,8,24,.72); --c-border:rgba(34,51,68,.65);
  --sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:24px;
  --sp-6:32px; --sp-7:48px; --sp-8:64px; --sp-9:80px;
  --container:1230px; --header:76px; --header-scrolled:64px; --touch:44px;
  --focus:2px solid #66A3FF; --ease:cubic-bezier(.2,.8,.2,1);
}
```

## 10. Typography Matrix

- UNKNOWN — 정확한 원 웹폰트는 캡처만으로 식별 불가다. 구현은 영문 `Inter, "Noto Sans KR", Arial, sans-serif`, 한글 `"Noto Sans KR", Inter, sans-serif`를 self-host WOFF2 또는 system fallback으로 쓴다.

| 판정 | role | size desktop / 390 / 360 | weight | line-height | letter spacing | case/deco | align/max/wrap | 증거 |
|---|---|---|---|---|---|---|---|---|
| INFERRED | nav label | 12px/.75rem / 14px / 14px | 400 | 18px/1.5 | 0 | 원문 case, MENU underline | left/nowrap | E-D01 y650 |
| INFERRED | utility | 10px / 12px / 12px | 500 | 16px | 0 | uppercase | center/nowrap | E-D01 x1017 |
| MEASURED | Intro title | 50px / 24px / 22px | 300 | 60px/1.2 | .30em | uppercase | center/620px/nowrap | E-D01 D:(390,275,420,48) |
| INFERRED | Showcase H1 | 46px / 24px / 22px | 300 | 54px/1.17 | 0 | title case | left/520px/2 lines max | E-D01 D:(88,1025,305,48) |
| INFERRED | hero body | 14px / 11px / 11px | 400 | 22px/1.57 | 0 | none | left/520px/2 lines | E-D01 y1083 |
| INFERRED | eyebrow | 12px / 10px / 10px | 500 | 18px | 0 | none | center/300px | E-D01 about |
| INFERRED | section H2 large | 58px / 26px / 24px | 300 | 68px/1.17 | 0 | none | center or left/720px | E-D02 Solution/Industry |
| INFERRED | section body | 14px / 11px / 11px | 400 | 23px/1.64 | 0 | none | context/650px/3 lines | E-D02 |
| INFERRED | solution list | 18px / 10px / 10px | active 600 else 400 | 30px | 0 | none | left/180px/nowrap | E-D02 y2200 |
| INFERRED | product name | 32px / 14px / 13px | 400 | 38px | .02em | mixed | center/260px | E-D02 right |
| INFERRED | industry card title | 18px / 9px / 8px | 500 | 24px | 0 | none | left→mobile center/1 line | E-D03 top |
| INFERRED | industry card body | 12px / hidden / hidden | 400 | 20px | 0 | none | left/190px/2 lines | E-D03 |
| INFERRED | News H2 | 58px / 26px / 24px | 300 | 68px | 0 | none | left/220px/nowrap | E-D03 D:(163,3573,166,65) |
| INFERRED | card title | 18px / 13px / 13px | 600 | 27px/1.5 | 0 | none | left/248px/2-line clamp | E-D03 card band |
| INFERRED | card body/meta | 12px / 10px / 10px | 400 | 20px | 0 | none | left/2-line clamp | E-D03 |
| INFERRED | control label | 12px / 12px / 12px | 500 | 16px | 0 | none | center/nowrap | E-D02 CTA/tabs |
| INFERRED | caption/date | 10px / 10px / 10px | 400 | 16px | 0 | none | left/nowrap | E-D03 |
| INFERRED | form label/error | 14px / 14px / 14px | 500 | 20px | 0 | none | left/wrap | UNKNOWN, future contact form |
| INFERRED | footer text | 10–12px / 12px / 12px | 400/600 label | 18px | 0 | none | left/wrap | E-D03 footer |

## 11. Asset and Icon Manifest

| 판정 | ID | Page/section | 역할/증거 crop | 표시 크기 D/M | source ratio/crop/focal | 처리/우선순위/형식 | alt/대체 전략 |
|---|---|---|---|---|---|---|---|
| OBSERVED | A01 | S01,S02,S08 | 흰 원 로고; E-D01 (87,27,115,15) | 115×15 / 22×4 evidence | 약 7.67:1, contain | eager, SVG 권장 | 새 Godot 프로젝트 wordmark; 원 로고 복제 금지 |
| OBSERVED | A02 | S01 | 추상 navy ring media; E-D01 (0,0,1200,591) | full bleed | 2.03:1, cover, center | eager AVIF/WebP | decorative alt="" |
| OBSERVED | A03 | S02 | 야간 드론 쇼 video/poster; E-D01 y591–1180 | 1200×589 / 243×117 | 2.04:1, cover, center 48% | poster eager, MP4/WebM optional | 대표 게임플레이 장면 설명 |
| OBSERVED | A04 | S02 | 수상 배지 2개; D:(1083,992,31,73) | 31×73 / 약 7×15 | contain | lazy PNG/WebP | 장식이면 alt="" 또는 수상명 |
| OBSERVED | A05 | S03 | 밤하늘/호수; D:(0,1180,1200,750) | full bleed | 1.6:1, cover, 50% 18% | lazy AVIF/WebP | decorative 또는 풍경 설명 |
| OBSERVED | A06 | S04 | 비행체 상면 사진; D:(0,1930,794,551) | 794×551 / 162×113의 좌 2/3 | 1.44:1, cover, 56% 50% | lazy AVIF/WebP | 선택 솔루션 설명 |
| OBSERVED | A07 | S04 | 흰 배경 제품 렌더; D:(884,2067,235,147) | 235×147 / 약 52×30 | 1.60:1, contain | lazy WebP/PNG | 제품명 기반 alt |
| OBSERVED | A08 | S06 | 산업 사진 5개; D:y2825–3416 | 각 240×591 / 약 49×120 | 0.406:1 display, cover | lazy AVIF/WebP | 각 category 기능 설명 |
| OBSERVED | A09 | S07 | 뉴스 썸네일 N개; E-D03 local y695~853 | 244×158 / 약 48×31 | 1.544:1, cover center | lazy WebP | 기사 제목 중복 피한 설명 |
| INFERRED | I01 | headers | globe `12px` | 12×12 / 16×16 | 1:1 | Lucide `Languages` 대체 | `aria-hidden`, label은 locale button |
| INFERRED | I02 | controls | menu `24px`, close `24px` | prepared 약 8×5 / 24×24 | 1:1 | Lucide `Menu`, `X` | button accessible name |
| INFERRED | I03 | S02,S07 | arrows 20px | group 50×28 | 1:1 | Lucide `ChevronLeft/Right` stroke 1.5 | 이전/다음 label |
| INFERRED | I04 | S03,S04 | plus 12px / circle dot | CTA/circle | 1:1 | Lucide `Plus` 또는 CSS dot | decorative |
| OBSERVED | I05 | S08 | top arrow; D:(1114,4137,21,26) | 21×26 / 약 5×6 | 1:1 optical | Lucide `ArrowUp`, stroke 2 | "맨 위로" |
| OBSERVED | I06 | S08 | social 4개 | 약 14×14 | 1:1 | 공식 플랫폼 아이콘 또는 text links | 플랫폼명 |

## 12. Responsive Behavior Matrix

### 12.1 Global and shell

| 판정 | 속성 | 1440 | 1280 | 1024 | 768 | 390 | 360 |
|---|---|---:|---:|---:|---:|---:|---:|
| INFERRED | content max/width | 1230 | 1104 | 896 | 704 | 350 | 324 |
| INFERRED | gutter | 64 | 48 | 40 | 32 | 20 | 18 |
| INFERRED | header mode | full | full | full compact | mobile | mobile | mobile |
| INFERRED | header height | 76 | 72 | 68 | 56 | 48 | 46 |
| INFERRED | nav gap | 28 | 22 | 14 | hidden | hidden | hidden |
| INFERRED | touch target | 44 | 44 | 44 | 44 | 44 | 44 |
| INFERRED | H2 size | 58 | 54 | 46 | 36 | 26 | 24 |

### 12.2 P-01 major sections

| 판정 | component/property | 1440 | 1280 | 1024 | 768 | 390 | 360 |
|---|---|---:|---:|---:|---:|---:|---:|
| INFERRED | S01 height | 709 | 630 | 504 | 378 | 194 | 179 |
| INFERRED | S01 title px | 50 | 48 | 42 | 34 | 24 | 22 |
| INFERRED | S02 height | 707 | 628 | 503 | 377 | 188 | 174 |
| INFERRED | S02 copy left | 106 | 93 | 72 | 48 | 20 | 18 |
| INFERRED | S03 height | 900 | 800 | 640 | 480 | 244 | 225 |
| INFERRED | S03 content top | 310 | 275 | 220 | 156 | 64 | 58 |
| INFERRED | S04 height | 661 | 588 | 470 | 353 | 181 | 168 |
| INFERRED | S04 columns | 66.2/33.8% | 66.2/33.8% | 66/34% | 66/34% | 67/33% | 67/33% |
| INFERRED | S04 panel min | 0 | 0 | 0 | 240 | 128 | 118 |
| INFERRED | S05 height | 413 | 367 | 294 | 220 | 112 | 104 |
| INFERRED | S06 height | 709 | 630 | 504 | 378 | 192 | 177 |
| INFERRED | S06 columns | 5 | 5 | 5 | 5 | 5 | 5 |
| INFERRED | S06 body | show | show | show | hidden | hidden | hidden |
| INFERRED | S07 height | 818 | 727 | 582 | 437 | 220 | 203 |
| INFERRED | S07 card columns visible | 3.55 | 3.25 | 2.7 | 2.2 | 1.25 | 1.2 |
| INFERRED | S07 card width | 350 | 311 | 249 | 230 | 280 | 267 |
| INFERRED | S08 layout | 2 col | 2 col | 2 col | 1 col | 1 col | 1 col |
| INFERRED | S08 min-height | 365 | 324 | 304 | 420 | 440 | 460 |

### 12.3 Behavioral breakpoint rules

- INFERRED — `>1024px`: full primary nav, desktop type, S07 clipped track with arrow buttons, Footer 2열.
- INFERRED — `769–1024px`: nav gaps/type 축소, S04/S06 비율 유지, News card 폭을 container의 약 28%로 유동화한다.
- INFERRED — `≤768px`: primary nav 숨김, menu button 활성, Footer 1열, S06 body 숨김, News scroll-snap. E-M01이 full nav 대신 축소 controls를 보여 주는 데 근거한다.
- INFERRED — `≤390px`: gutter 20px, 제목/CTA를 접근 가능한 실제 크기로 유지하며 증거의 극단적 축소를 그대로 복제하지 않는다.
- INFERRED — `≤360px`: gutter 18px, S04 right panel 최소 118px, footer policy links wrap; 어느 폭에서도 `min-width` 때문에 가로 오버플로가 생기지 않는다.
- UNKNOWN — 1024/768 중간 증거는 없다. 위 수치는 desktop/mobile의 동일 비율 구성과 실사용 가독성을 연결한 구현 결정이며 신뢰도 MEDIUM, 주요 경계 QA ±6px다.

## 13. Interaction and Motion State Matrix

| 판정 | 대상/상태 | trigger | 정확한 시각 변화 | duration/easing | focus/keyboard | reduced motion |
|---|---|---|---|---|---|---|
| INFERRED | text link hover | pointer enter | `color:#66A3FF`, opacity 1 | 180ms ease-out | focus-visible ring 2px | 색만 즉시 |
| INFERRED | text link pressed | pointer/key down | opacity .72, translateY(1px) | 80ms ease-out | Enter 활성 | 변형 제거 |
| INFERRED | nav active | section intersection/hash | `color:#66A3FF`, bottom border 2px | 180ms ease-out | `aria-current=location` | 즉시 |
| INFERRED | menu open | menu click/Enter/Space | overlay alpha 0→.72; panel translateX(100%→0) | 260ms cubic-bezier(.2,.8,.2,1) | 첫 link focus, trap | 즉시 표시 |
| INFERRED | menu close | X/Escape/overlay | 역변형, overlay 0 | 220ms ease-in | trigger로 focus 복원 | 즉시 숨김 |
| INFERRED | submenu open | row click/Enter/Space | chevron rotate 180°, rows opacity 0→1 | 220ms ease | `aria-expanded` 갱신 | 즉시 |
| INFERRED | primary CTA hover | pointer enter | bg `#195DD2→#2C73E8`; icon translateX 2px | 180ms ease-out | ring `#66A3FF` | icon 이동 제거 |
| INFERRED | primary CTA pressed | down | bg `#1248A8`, translateY 1px | 80ms | Space/Enter | 변형 제거 |
| INFERRED | CTA disabled/loading | prop/async | bg `#778396` alpha .45; spinner 16px | spinner 800ms linear | disabled는 focus 제외; busy는 유지 | spinner 정지/상태 text |
| INFERRED | solution tab selected | click/arrow keys | bg `#195DD2`, text `#FFF`; 이전은 `#FFF/#111` | 180ms ease | roving tabindex, arrows/Home/End | fade 없음 |
| INFERRED | solution tab hover | pointer | bg `#DDE5EF` | 150ms ease | ring 2px | 즉시 |
| INFERRED | showcase next/prev | button/swipe/timer | track translateX 100%; progress 재설정 | 500ms cubic-bezier(.2,.8,.2,1) | buttons; live 변경은 수동일 때만 | 0ms 교체 |
| INFERRED | showcase autoplay pause | hover/focus/document hidden | progress animation pause | 즉시 | focus 내부면 pause | 자동재생 비활성 |
| INFERRED | News arrow | click/Enter | track 292px desktop 또는 80vw mobile 이동 | 400ms ease | disabled 끝 버튼 `aria-disabled` | 즉시 scroll |
| INFERRED | News card hover | pointer | image scale 1→1.03, scrim alpha -.08, title `#66A3FF` | 240ms ease-out | 카드 title link ring | scale 제거 |
| INFERRED | Industry card hover/focus | pointer/focus | scrim .48→.25; image scale 1.02 | 240ms ease | link에 ring inset | scale 제거 |
| INFERRED | Footer accordion | mobile click/Enter/Space | content grid-row 0fr→1fr; chevron rotate | 220ms ease | native details 또는 aria-expanded | 즉시 |
| INFERRED | Back to top | click | smooth scroll to y=0 | 최대 600ms | 완료 후 skip target focus | `behavior:auto` |
| UNKNOWN | form states | form이 증거에 없음 | 구현 범위에서 form 없음; 향후 error `#E05252`, success `#2EB67D` | 180ms | error `aria-describedby`, live polite | 즉시 |
| UNKNOWN | modal states | modal이 증거에 없음 | 구현 범위에서 modal 없음; 상세 media는 새 route로 이동 | 0ms | 해당 없음 | 해당 없음 |
| INFERRED | media error | image/video 실패 | `#112244` surface + 24px media icon + 대체 text | 180ms opacity | 대체 text 노출 | 즉시 |

- UNKNOWN — 실제 carousel 자동재생 여부와 간격은 캡처에 없다. 구현은 Showcase만 6000ms 자동재생, News는 수동 전용으로 결정한다; 신뢰도 LOW.
- UNKNOWN — 실제 page-entry animation은 보이지 않는다. 구현은 S01에만 600ms 이하의 진입을 허용하고 나머지는 정적 배치한다.

## 14. Accessibility Contract

- INFERRED — landmarks는 `header`, `nav[aria-label="주요"]`, `main#main`, section별 labelled region, `footer`, footer legal nav다. 페이지당 `main`은 하나다.
- INFERRED — `h1`은 P01-S02 대표 프로젝트 제목 하나, P01-S03/S04/S05/S07은 `h2`, S06와 S07 cards는 `h3`다. S01 대문자 표시는 heading이 아닌 장식적 intro label이다.
- INFERRED — 첫 focusable 요소는 `본문으로 건너뛰기`; focus 시 좌상단 `(16,16)`, padding 12×16px, 배경 `#FFF`, 글자 `#001122`, z=60이다.
- INFERRED — 키보드 순서는 skip→S01 logo/utilities→S02 full nav→carousel controls→S03 CTA→S04 list/tabs→S06 links→S07 arrows/cards→footer links→top이다.
- INFERRED — focus ring은 모든 상호작용 요소에 `2px solid #66A3FF`, offset 3px; dark/light surface 모두 최소 3:1 시각 대비를 유지한다.
- INFERRED — 본문 텍스트는 WCAG AA 4.5:1, 24px 이상 또는 18.66px bold는 3:1, UI 경계/아이콘은 3:1을 목표로 한다. 사진 위 text에는 scrim을 조절해 기준을 만족한다.
- INFERRED — mobile menu button은 accessible name `"메뉴 열기"`, `aria-expanded`, `aria-controls="mobile-menu"`를 가진다. 패널은 focus containment, Escape 닫기, 닫은 뒤 trigger 복원, background inert, body scroll lock을 제공한다.
- INFERRED — active page는 logo가 아닌 현재 section link에 `aria-current="location"`을 부여한다. route 수준 active가 생기면 `aria-current="page"`를 쓴다.
- INFERRED — carousel은 region label, 이전/다음 버튼 이름, slide `aria-label="n / total"`을 제공한다. 자동재생은 pause control 또는 hover/focus pause가 있고 reduced motion에서는 꺼진다.
- INFERRED — 이미지 alt는 기능/맥락을 서술하고, 배경·scrim·장식 motif는 `alt=""`/`aria-hidden=true`; 같은 카드에서 제목이 충분하면 thumbnail alt는 빈 문자열로 중복을 피한다.
- INFERRED — 상태 공지는 `aria-live=polite`인 단일 LiveRegion을 쓰고 자동 slide 변경은 알리지 않는다. error는 해당 control과 `aria-describedby`로 연결한다.
- INFERRED — 200% zoom 및 320px reflow에서 가로 스크롤 0px; 400% zoom에서는 메뉴·footer·cards가 단일 열 또는 수평 scroll region으로 명확히 한정된다.
- INFERRED — 모든 pointer target은 최소 44×44 CSS px. 증거의 작은 arrows/tab은 투명 padding으로 hit area를 확장하며 시각 bounds는 유지한다.
- INFERRED — `prefers-reduced-motion:reduce`에서 smooth scroll, autoplay, scale, translate transition을 제거하고 opacity도 100ms 이하로 제한한다.

## 15. Data and Content Model

### 15.1 Entities

| 판정 | entity | fields | cardinality/optional | order/format/localization | loading/empty/error |
|---|---|---|---|---|---|
| INFERRED | `SiteConfig` | `projectName,logo,locales,defaultLocale,nav,downloadUrl` | 1; downloadUrl optional | locale별 label | config error면 기본 nav |
| INFERRED | `NavItem` | `id,label,href,children,disabled` | 6 primary+2 utility; children optional | 증거 순서 고정; locale string | empty면 logo/utilities만 |
| INFERRED | `ShowcaseSlide` | `id,title,body,media,badges,cta` | 1..N; body/badges optional | editorial order | poster skeleton; media fallback |
| INFERRED | `AboutContent` | `eyebrow,title,paragraphs,cta,background` | 1; paragraphs 1..2 | locale paragraphs | missing CTA 숨김 |
| INFERRED | `Solution` | `id,label,title,body,visual,variants` | 1..N; variants 1..N | curated order | panel skeleton; retry |
| INFERRED | `Industry` | `id,title,body,media,href` | 증거상 5; body/href optional | curated 5-slot | missing media neutral card |
| INFERRED | `NewsItem` | `id,title,summary,dateISO,media,href,tags` | 0..N; summary/tags optional | date desc; locale date | 3 skeleton; empty message; retry |
| INFERRED | `CompanyContact` | `email,links,locations,legal` | 1; fields optional | location curated | 없는 field 생략 |
| INFERRED | `Location` | `id,label,address` | 증거상 4 | label order | empty list 숨김 |

- OBSERVED — 증거 문구 역할은 Intro 이름, Showcase 프로젝트명/설명, About eyebrow/title/body/CTA, Solution 카테고리/제품, Industry 5종, News 기사, Footer 연락처다.
- INFERRED — 위 역할만 보존하고 실제 fixture는 Godot 프로젝트 문구로 교체한다. 원 브랜드명, 원 제품명, 기사 제목, 주소, 연락처를 production data에 넣지 않는다.
- INFERRED — 날짜 저장은 ISO `YYYY-MM-DD`, 표시는 locale의 `Intl.DateTimeFormat`; 주소는 번역하지 않고 locale별 별도 field를 허용한다.

### 15.2 Replaceable fixture shape

```json
{
  "projectName": "SKYBOUND",
  "nav": [
    {"id":"home","label":"Home","href":"/"},
    {"id":"project","label":"Game / Project","href":"#project"},
    {"id":"systems","label":"Flight Systems","href":"#flight-systems"},
    {"id":"media","label":"Media","href":"#media"},
    {"id":"devlog","label":"Devlog","href":"#devlog"}
  ],
  "showcase": [{
    "id":"first-flight",
    "title":"First Flight",
    "body":"A playable aviation project built with Godot.",
    "media":{"src":"/assets/media/hero-flight.webp","alt":"Aircraft flying above a night coastline","width":1920,"height":943}
  }],
  "industries": [
    {"id":"aero","title":"Aerodynamics","media":{"src":"/assets/systems/aero.webp","alt":"","width":720,"height":1200}},
    {"id":"controls","title":"Flight Controls","media":{"src":"/assets/systems/controls.webp","alt":"","width":720,"height":1200}},
    {"id":"navigation","title":"Navigation","media":{"src":"/assets/systems/navigation.webp","alt":"","width":720,"height":1200}},
    {"id":"weather","title":"Weather","media":{"src":"/assets/systems/weather.webp","alt":"","width":720,"height":1200}},
    {"id":"missions","title":"Missions","media":{"src":"/assets/systems/missions.webp","alt":"","width":720,"height":1200}}
  ]
}
```

- INFERRED — sample의 프로젝트명과 문구도 임시 placeholder이며 최종 프로젝트 고유명으로 교체할 수 있다. 원 증거 문구를 복제하지 않는다.

## 16. Frontend Architecture

- INFERRED — 필수 route는 `/` 하나이고 `/#project`, `/#about`, `/#flight-systems`, `/#media`, `/#devlog`, `/#download` 앵커를 지원한다. 향후 상세 route는 `/project`, `/devlog/:slug`, `/media`로 확장 가능하나 현재 범위 밖이다.
- INFERRED — framework 선택은 자유다. React/Next를 쓸 경우 정적 content는 Server Component, carousel/menu/intersection observer만 Client Component로 둔다; Astro/Svelte/Vue에서도 같은 경계를 유지한다.
- INFERRED — styling은 전역 token CSS + section-scoped CSS Modules 또는 cascade layers(`reset,tokens,base,components,utilities`)를 권장한다. runtime CSS-in-JS는 첫 paint 비용 때문에 필수가 아니다.

```text
src/
  app/
    layout
    page
  components/
    shell/AppShell
    shell/SiteHeader
    shell/MobileMenu
    shell/SiteFooter
    controls/ActionButton
    controls/CarouselControls
  features/home/
    IntroSection
    ShowcaseSection
    AboutSection
    SolutionSection
    IndustrySection
    NewsSection
  content/
    site.{locale}.json
    news.{locale}.json
  models/
    content-types
  styles/
    tokens.css
    global.css
  assets/
    brand/
    media/
    systems/
    news/
```

- INFERRED — state ownership: AppShell은 menu/locale, MediaCarousel은 slide/paused, SolutionSection은 solution/variant, NewsCarousel은 scroll index를 소유한다. content data에는 UI state를 넣지 않는다.
- INFERRED — asset 최적화는 responsive `srcset`, AVIF/WebP, explicit width/height, poster, lazy loading을 담당한다. carousel에는 검증된 접근성 패턴을 적용하되 무거운 slider library는 필수가 아니다.
- INFERRED — third-party 책임은 icon library(Lucide), optional focus trap, image pipeline로 제한한다. animation은 CSS/Web Animations로 충분하다.
- INFERRED — server는 locale/content payload를 제공하고 client는 상호작용만 hydrate한다. News가 원격 CMS면 fetch 실패를 S07 error state로 국소화한다.

## 17. Implementation Task Graph

| 판정 | Task | 의존 | 입력 | 출력/영향 | 완료 기준 | 병렬 그룹 |
|---|---|---|---|---|---|---|
| INFERRED | T01 Measurement harness | 없음 | E-D01~03,E-M01 좌표 | 1440/390 screenshot fixtures | 기준선 overlay와 viewport scripts 동작 | A |
| INFERRED | T02 Tokens/base | T01 | §9,§10 | tokens.css/global.css | color/type/spacing token snapshot 통과 | A |
| INFERRED | T03 Content schema | 없음 | §15 | typed fixtures/validators | invalid fixture 오류 검출 | A |
| INFERRED | T04 AppShell/header | T02,T03 | P01-S01/S02,§5 | AppShell/SiteHeader | desktop bounds ±4px | B |
| INFERRED | T05 Mobile menu | T04 | §5.2,§13,§14 | panel/focus lock | keyboard/Escape/restore 통과 | C |
| INFERRED | T06 S01 Intro | T02,T03 | A02,§7.1 | IntroSection | center/title/media crop 일치 | B |
| INFERRED | T07 S02 Showcase | T02,T03,T04 | A03/A04,§7.2 | accessible carousel | poster/controls/progress 일치 | C |
| INFERRED | T08 S03 About | T02,T03 | A05,§7.3 | AboutSection | content center/CTA bounds 일치 | B |
| INFERRED | T09 S04 Solution | T02,T03 | A06/A07,§7.4 | split panel/tabs | 66/34와 모바일 min track 통과 | B |
| INFERRED | T10 S05/S06 Industry | T02,T03 | A08,§7.5~7.6 | intro+5-card grid | 5열/gap0/crop 일치 | B |
| INFERRED | T11 S07 News | T02,T03 | A09,§7.7 | scroll-snap carousel | partial-card composition/keys 통과 | C |
| INFERRED | T12 S08 Footer | T02,T03 | §7.8 | footer/accordion/top | desktop 2열/mobile 1열 통과 | B |
| INFERRED | T13 Responsive integration | T04~T12 | §12 | all six viewports | overflow 0, matrix 일치 | D |
| INFERRED | T14 Interaction/motion | T05,T07,T09,T11 | §13 | complete states | reduced-motion 포함 상태 테스트 | D |
| INFERRED | T15 Accessibility | T04~T14 | §14 | semantic/focus fixes | axe critical 0, keyboard flow 통과 | E |
| INFERRED | T16 Visual QA | T13,T14 | §18 | diff reports | major ±4px, flat color ΔE≤3 | E |
| INFERRED | T17 Performance | T06~T12 | asset manifest | optimized build | CLS≤0.1,LCP≤2.5s 목표 | E |
| INFERRED | T18 Godot content swap | T03,T06~T12 | §20 assets/copy | production content | 원 브랜드/문구/자산 0건 | F |

- INFERRED — 그룹 A는 병렬, B는 shell/tokens 이후 섹션별 병렬, C는 관련 base component 후 병렬, D→E→F 순으로 통합한다.

## 18. Page-Specific Acceptance Criteria

### P-01 Home checklist

- INFERRED — `[ ]` 1440,1280,1024,768,390,360px에서 전체 페이지 screenshot을 생성하고 E-D01~03/E-M01의 section order와 비율을 비교한다.
- INFERRED — `[ ]` 1200 준비 기준 경계 S01 591, S02 1180, S03 1930, S04 2481, S05 2825, S06 3416, S07 4098, S08 4402px가 각각 ±4px 비례 환산 안에 든다.
- INFERRED — `[ ]` header logo, menu start, utility bounds는 §5 표의 준비 좌표 대비 ±4px, 반복 nav gap은 ±2px이다.
- INFERRED — `[ ]` S04 split은 794/6/400px 관계를 유지하고 S06는 정확히 5열·0px gap이며, S07은 양끝 partial card 구성을 보존한다.
- INFERRED — `[ ]` S01/S02/S03 media focal point와 S04/S06 card crop은 manifest의 object-position에서 주 피사체를 자르지 않는다.
- INFERRED — `[ ]` 평면색 `#001122`, `#EEEEEE`, `#195DD2`, `#FFFFFF`는 색차 `ΔE≤3`; JPEG photo 영역은 RGB ±10을 허용한다.
- INFERRED — `[ ]` typography는 역할별 size ±2px, line-height ±2px, 기준선 ±3px, letter spacing은 Intro `.30em` ±.02em이다.
- INFERRED — `[ ]` 모든 title/body/button이 container를 넘지 않고 의도한 line clamp를 지키며 360px에서 최장 단어도 잘리지 않는다.
- INFERRED — `[ ]` 6개 필수 폭과 200% zoom에서 document 가로 overflow는 0px; carousel 내부의 명시된 x-scroll만 허용한다.
- INFERRED — `[ ]` mobile header target은 44×44px 이상이며 panel은 focus trap, Escape, overlay close, trigger focus restoration, scroll lock을 통과한다.
- INFERRED — `[ ]` 모든 carousel/tab/accordion/CTA/card link가 Tab, Shift+Tab, Enter, Space, arrow key 계약에 맞고 focus ring이 잘리지 않는다.
- INFERRED — `[ ]` `prefers-reduced-motion`에서 autoplay/smooth-scroll/scale/translate가 꺼지고 정보 손실이 없다.
- INFERRED — `[ ]` image width/height 또는 aspect-ratio가 예약되어 CLS≤0.1, 첫 viewport 핵심 poster가 preload되어 LCP≤2.5s(일반 모바일 프로필)를 목표로 한다.
- INFERRED — `[ ]` 원 브랜드 로고, 원 제품명, 원 기사·주소·연락처, 원 사진/영상이 빌드 산출물에 포함되지 않고 §20 대체 자산만 사용된다.

## 19. Uncertainties and Decisions

| 판정 | 위치 | UNKNOWN 항목 | 선택한 구현 결정 | 기각 대안 | 신뢰 | 해결에 필요한 추가 증거 |
|---|---|---|---|---|---|---|
| UNKNOWN | 전역/type | 정확한 font family | Inter + Noto Sans KR | 이미지 기반 글자, 임의 유료 font | MEDIUM | computed CSS/font files |
| UNKNOWN | S01 | intro가 로딩 화면인지 첫 section인지 | 스크롤 가능한 첫 section | 페이지 load 후 제거 | MEDIUM | scroll video/DOM |
| UNKNOWN | Header | sticky/scrolled 변환 | Intro 이후 fixed 64px navy glass | 항상 absolute, 항상 fixed | LOW | 스크롤 중 캡처 |
| UNKNOWN | Header/menu | MENU panel 구성 | 우측 90vw panel, 모든 nav/locale | full-screen 중앙 menu | MEDIUM | 열린 menu 캡처 |
| UNKNOWN | Header | `Company/Careers` target | About/Devlog 앵커로 치환 | 보이지 않는 route 발명 | LOW | 실제 sitemap |
| UNKNOWN | S02 | media가 video인지 image | video 가능 + poster 필수 | poster 없는 autoplay video | MEDIUM | network/DOM |
| UNKNOWN | S02 | slide 수/자동재생 | fixture N개, 6000ms | 무한 빠른 autoplay | LOW | 시간축 녹화 |
| UNKNOWN | S02 | badges 의미/asset | 프로젝트 자체 badge만 선택적으로 표시 | 원 award badge 복제 | HIGH | 자산 권리/원본 |
| UNKNOWN | S03 | CTA 목적 | `#project` 또는 상세 route | 원 URL 추정 | MEDIUM | link target |
| UNKNOWN | S04 | 원형 control 동작 | 선택 project 상세 link | cursor-follow interaction | LOW | interaction video |
| UNKNOWN | S04 | tabs와 좌측 list 연동 | tablist가 panel만 갱신, list가 solution 갱신 | 모두 route 이동 | MEDIUM | 클릭 상태 캡처 |
| UNKNOWN | S06 | 카드 hover expansion | 크기 고정, scrim/scale만 변화 | 열 폭 확장 | MEDIUM | hover 캡처 |
| UNKNOWN | S07 | 전체 카드 수 | data N개, 증거 최소 5 | 정확히 5로 고정 | MEDIUM | full carousel data |
| UNKNOWN | S07 | 모바일 축소가 실제 UX인지 | 접근 가능한 1.25-card scroll | 5열 49px 카드 그대로 | HIGH | 실제 mobile interaction |
| UNKNOWN | S08 | 주소 accordion | ≤768에서 details | 모든 주소 계속 축소 표시 | HIGH | 모바일 확대 캡처 |
| UNKNOWN | 전역 | modal/form 존재 | 현재 범위에서 없음 | 보이지 않는 UI 추가 | HIGH | 열린 상태 캡처 |
| UNKNOWN | color | 원 CSS blue token | `#195DD2` | photo palette의 `#112244`를 CTA로 사용 | MEDIUM | CSS variable/source |
| UNKNOWN | responsive | 1024/768 중간 레이아웃 | §12 선형 비율+행동 breakpoint | desktop 급축소만 | MEDIUM | tablet screenshots |

- INFERRED — 모든 UNKNOWN은 production TODO로 남기지 않고 위 구현 결정을 기본값으로 채택한다. 추가 증거가 생기면 결정 행만 재검증한다.

## Completion Gate Verification

- INFERRED — PASS: §3에 모든 직접 보이는 route/page를 먼저 인벤토리화했고 P-01을 기본 페이지로 지정했다.
- INFERRED — PASS: §6에 P-01 전용 canvas, ordered geometry, 섹션별 상세, 상호작용, responsive, accessibility, assets, acceptance를 포함했다.
- INFERRED — PASS: §5에 desktop/mobile navigation bounds와 default/hover/focus/pressed/active/disabled/scrolled/menu/submenu 상태를 수치화했다.
- MEASURED — PASS: E-D01~03/E-M01과 x/y/w/h가 §2,§5,§6,§11에 연결되어 있다.
- INFERRED — PASS: §9에 HEX/RGB/HSL/alpha/근거/신뢰/허용오차와 CSS 변수를 포함했다.
- INFERRED — PASS: §12에 1440/1280/1024/768/390/360px를 모두 포함했다.
- INFERRED — PASS: §8/§13/§14/§15/§16/§17/§18/§19가 component, state, accessibility, data, architecture, task, page acceptance, uncertainty 계약을 각각 충족한다.

## 20. Godot 프로젝트 적용 매핑

### 20.1 Brand and content guardrails

- INFERRED — 원 로고·상표명·제품명·수상 배지·기사·주소·연락처·사진·영상은 사용하지 않는다. 레이아웃 비율, 정보 계층, 색 대비, 상호작용 패턴만 참조한다.
- INFERRED — 새 프로젝트는 자체 이름/wordmark, Godot로 캡처한 실제 gameplay, 자체 aircraft/system renders, 자체 devlog thumbnails를 사용한다. Godot 엔진 표장은 공식 사용 지침을 확인한 자산만 선택적으로 쓴다.
- INFERRED — 원문의 영문 headline이나 한국어 설명을 번안하지 않고, 항공 시뮬레이션의 현재 기능·빌드 상태·플레이 방법을 새로 작성한다.

### 20.2 Navigation and route replacement

| 판정 | source 역할 | Godot 구조 | target | active 규칙 | mobile panel order |
|---|---|---|---|---|---|
| INFERRED | 브랜드 logo | 프로젝트 고유 wordmark | `/` / Home | top에서 Home | 1 |
| INFERRED | 첫 카테고리 nav | Game / Project | `/#project` 또는 `/project` | S02/S03 교차 | 2 |
| INFERRED | 산업 nav | Flight Systems | `/#flight-systems` | S04~S06 교차 | 3 |
| INFERRED | 회사 nav | Media | `/#media` | gameplay gallery 교차 | 4 |
| INFERRED | 뉴스 nav | Devlog | `/#devlog` | S07 교차 | 5 |
| INFERRED | 채용 nav | Download / Play | `/#download` | CTA section 교차 | 6 |
| INFERRED | 연락 nav | Community / Contact | `/#contact` | Footer 교차 | 7 |
| INFERRED | KR utility | KO/EN locale | locale menu | 선택 locale | utility |
| INFERRED | MENU | 전체 사이트 panel | dialog panel | open일 때 menu | control |

### 20.3 P-01 section-by-section substitution

| 판정 | Section | 새 목적 | 새 콘텐츠 | 유지할 geometry | 새 CTA/interaction |
|---|---|---|---|---|---|
| INFERRED | P01-S01 | Home intro | 프로젝트명 + 항공 HUD/대기권 key art | 1200:591, 중앙 title, 얇은 ring motif | scroll cue는 optional; 원 title 금지 |
| INFERRED | P01-S02 | Game/Project hero | 실제 Godot gameplay video/poster, build codename, 한 줄 pitch | full-bleed 1200:589, 좌하단 copy, progress | `Play Trailer`, `Download Demo`; Showcase carousel |
| INFERRED | P01-S03 | Project overview | 게임 목표, Godot 버전/플랫폼, 핵심 경험 2문장 | 1200:750, 중앙 stack, night-flight backdrop | `Explore Project` → `#flight-systems` |
| INFERRED | P01-S04 | Flight Systems detail | 좌측 실제 비행 장면; 우측 aircraft/system render와 variant tabs | 66.2/33.8 split, 경계 원형 control | tabs: `Arcade/Simulation` 또는 aircraft variants |
| INFERRED | P01-S05 | Flight Systems intro | physics, controls, navigation을 묶는 새 heading/body | 1200:344 중앙 dark band | CTA 없음 |
| INFERRED | P01-S06 | Systems gallery | `Aerodynamics`, `Flight Controls`, `Navigation`, `Weather`, `Missions` | 5 equal columns, dark photo scrim | 각 card가 system detail 앵커로 이동 |
| INFERRED | P01-S07 | Media + Devlog | gameplay shots, clips, devlog posts를 날짜순 카드로 표시 | heading 299px + partial-card track 383px | filter `Media/Devlog`, arrows, card links |
| INFERRED | P01-S08 | Download/Play + Contact | 현재 build 플랫폼, 버전, 요구사항 링크, community/contact, legal | desktop 2열 + legal row; mobile 1열 | primary `Download`, secondary `Play in Browser` |

### 20.4 Concrete content slots

| 판정 | slot | 필수 값 | 길이 제한 | 자산/형식 | fallback |
|---|---|---|---|---|---|
| INFERRED | project name | 고유명 1개 | 영문 18자 또는 한글 10자 | SVG wordmark + text fallback | plain text |
| INFERRED | hero pitch | 기능 중심 1문장 | 48자/2행 | locale JSON | 숨기지 말고 짧은 기본문 |
| INFERRED | gameplay poster | 실제 게임 화면 | 1920×943 이상, 2.04:1 crop-safe | AVIF/WebP, optional MP4/WebM | static poster |
| INFERRED | aircraft render | 실제 in-engine 또는 자체 render | 1600×1000 transparent 가능 | WebP/PNG | neutral silhouette |
| INFERRED | system cards | 정확히 5개 | title 18자, body 45자 | 720×1200 각 1개 | navy surface+icon |
| INFERRED | media/devlog | 최소 5개 권장 | title 2행, summary 2행 | 16:10 thumbnail | text-only card |
| INFERRED | build CTA | 플랫폼, 버전, 파일 크기 | label 20자 | HTTPS release URL | disabled `"Build unavailable"` |
| INFERRED | contact | community/email/legal | 각 1행 | external URLs | 없는 항목 생략 |

### 20.5 Godot-specific information architecture

- INFERRED — Home은 프로젝트 정체성과 최신 playable 상태를 즉시 보여 준다. 첫 viewport의 실제 gameplay poster가 가장 큰 시각 신호여야 한다.
- INFERRED — Game/Project는 장르, 목표, 현재 build, 지원 플랫폼, input 방식을 구조화하고 marketing 문구보다 검증 가능한 상태를 우선한다.
- INFERRED — Flight Systems는 Godot scene/resource에 맞춰 `Aerodynamics`, `Controls`, `Navigation`, `Weather`, `Missions` 데이터로 구성한다. 각 항목은 status(`prototype|in-progress|stable`)를 선택적으로 노출한다.
- INFERRED — Media는 screenshot/video, Devlog는 날짜·버전·변경 요약을 가진다. 같은 S07 track에서 type filter로 분리하되 route가 필요하면 `/media`, `/devlog/:slug`로 progressive enhancement한다.
- INFERRED — Download/Play CTA는 플랫폼별 실제 상태를 반영한다. web build가 있으면 `Play in Browser`, native build가 있으면 OS별 Download, 없으면 disabled와 다음 예정 build 정보를 제공한다.

### 20.6 Final implementation acceptance

- INFERRED — `[ ]` source 상표/문구/주소/연락처/사진/영상의 filename, alt, JSON, rendered text 검색 결과가 0건이다.
- INFERRED — `[ ]` Home, Game/Project, Flight Systems, Media, Devlog, Download/Play CTA가 navigation과 section ID에서 모두 연결되고 dead link가 없다.
- INFERRED — `[ ]` S02 첫 화면은 실제 Godot 프로젝트 gameplay를 명확히 보여 주며 장식적인 stock image로 대체되지 않는다.
- INFERRED — `[ ]` 각 CTA는 현재 제공 가능한 build 상태와 일치하고, unavailable 상태는 disabled styling과 이유를 함께 제공한다.
- INFERRED — `[ ]` §18 P-01 visual/accessibility/performance 기준을 Godot 콘텐츠 교체 후 다시 통과한다.
