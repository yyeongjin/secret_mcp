# DESIGN_INDEX — gdweb-26387 / 영커피

- OBSERVED (confidence HIGH) 스키마는 `secret-mcp/design-index/v2`, 레퍼런스 ID는 `gdweb-26387`, 등록일은 `2026-01-13`, 수상 표기는 `WINNER PRIZE`, 제작사 표기는 `와일리`다.
- OBSERVED (confidence HIGH) 이 문서는 첨부된 이미지 3장과 요청에 포함된 좌표·팔레트 메타데이터만 사용한다.
- INFERRED (confidence HIGH) 구현 대상의 임시 제품명은 `Cafe Quest`로 두며 원 브랜드명, 로고, 캐릭터, 문구, 매장명, 상품 사진은 사용하지 않는다.
- INFERRED (confidence HIGH) 모든 가격·메뉴·이벤트 문구는 한국어 로케일용 대체 fixture이며, 공개 구현 전 권리 확인된 콘텐츠로 교체한다.

## 1. Reconstruction Goal and Scope

- OBSERVED (confidence HIGH) 증거는 하나의 실제 1200px 웹페이지가 아니라 흰 배경 위에 414px 폭 모바일 앱 화면들을 배치한 프레젠테이션 콜라주다.
- OBSERVED (confidence HIGH) 좌측에는 세 타일을 관통하는 긴 홈 화면 1개가 있고, 우측에는 상품 상세, 옵션 선택, 저장 다이얼로그, 매장 검색, 주문 확인 화면이 각각 분리되어 있다.
- INFERRED (confidence HIGH) 구현 범위는 `P-01`부터 `P-06`까지 6개 화면/상태이며, 콜라주 자체를 런타임 페이지로 재현하지 않는다.
- INFERRED (confidence HIGH) 충실도 목표는 정보 위계, 414px 기준 기하, 여백 리듬, 화면 전환 관계, 색 대비를 보존하는 것이다.
- INFERRED (confidence HIGH) 대상은 Godot 4.x `Control` 노드 기반 Web export이며 동일 명세를 HTML/CSS로 옮길 수 있게 CSS 단위도 병기한다.
- INFERRED (confidence HIGH) 기준 뷰포트는 414×896px이고 검증 폭은 1440, 1280, 1024, 768, 390, 360 CSS px다.
- INFERRED (confidence HIGH) 414px보다 넓은 뷰포트에서는 단일 앱 캔버스를 가운데 정렬하고, 414px 이하에서는 화면 폭을 100% 사용한다.
- INFERRED (confidence HIGH) 측정 허용 오차는 주요 외곽선 ±4px, 반복 간격 ±2px, 평면 UI 색상 deltaE 3 이하, 텍스트 베이스라인 ±2px다.
- INFERRED (confidence HIGH) 비목표는 원 로고 복원, 원 문구 전사, 사진 재생성, 콜라주 그림자 복제, 보이지 않는 백엔드 주문 처리, 결제 사업자 연동이다.
- UNKNOWN (confidence HIGH) 원본 서비스의 실제 라우트 URL, 서버 API, 인증 방식, 결제 흐름, 애니메이션 곡선은 정적 증거에서 확인되지 않는다.

## 2. Evidence Inventory and Coordinate System

| 근거 | Evidence ID | 종류/파트 | 원본 | prepared | 첨부 crop | source-mapped crop | scale | 보이는 범위 | 한계 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MEASURED (confidence HIGH) | E-01 | desktop 1/3 JPEG | 1536×5198px | 1200×4061px | x0 y0 w1200 h1600px | x0 y0 w1536 h2048px | x0.7813/y0.7813 | P-01 상단, P-02 전체, P-03 상단 | JPEG 정규화, 하단 절단 |
| MEASURED (confidence HIGH) | E-02 | desktop 2/3 JPEG | 1536×5198px | 1200×4061px | x0 y1520 w1200 h1600px | x0 y1946 w1536 h2048px | x0.7813/y0.7813 | P-01 중단, P-03 하단, P-04, P-05, P-06 상단 | E-01/E-03과 각 80px 중복 |
| MEASURED (confidence HIGH) | E-03 | desktop 3/3 JPEG | 1536×5198px | 1200×4061px | x0 y3040 w1200 h1021px | x0 y3891 w1536 h1307px | x0.7813/y0.7813 | P-01 하단, P-06 본문/하단 | 모바일 별도 증거 없음 |

- MEASURED (confidence HIGH) canonical prepared 원점은 전체 1200×4061 캔버스의 좌상단 `(0,0)`이며 x는 오른쪽, y는 아래로 증가한다.
- MEASURED (confidence HIGH) E-01 로컬 좌표는 canonical과 동일하고, E-02 로컬 y에는 `+1520px`, E-03 로컬 y에는 `+3040px`를 더한다.
- MEASURED (confidence HIGH) E-01/E-02의 canonical y=1520–1599와 E-02/E-03의 canonical y=3040–3119는 각각 80px 중복이며 한 번만 센다.
- MEASURED (confidence HIGH) source 역매핑은 `source_x=prepared_x/0.7813`, `source_y=prepared_y/0.7813`로 계산하고 최종 비교에서는 ±2 source px 반올림을 허용한다.
- MEASURED (confidence HIGH) 좌측 앱 캔버스 외곽은 canonical `x=137, y=137, w=414, h≈3481px`이고 하단은 `y≈3618px`다.
- MEASURED (confidence HIGH) 우측 반복 앱 캔버스의 공통 외곽은 canonical `x=634, w=414px`이며 각 화면 y 범위는 페이지별 표에서 분리한다.
- OBSERVED (confidence HIGH) 우측 화면 일부는 프레젠테이션 상 서로 겹쳐 배치되어 있으므로 y 범위 중첩은 동일 페이지 콘텐츠 반복이 아니다.
- MEASURED (confidence HIGH) 이후 `E-02/full y=2188` 표기는 E-02 로컬 y=668에 offset 1520을 더한 canonical 위치를 뜻한다.
- OBSERVED (confidence MEDIUM) 카드 모서리와 그림자 끝은 JPEG 블러 때문에 경계가 2–4px 퍼지므로 흰 실면의 윤곽을 bounds 기준으로 삼는다.
- UNKNOWN (confidence HIGH) 준비 과정에서 원본 콜라주의 벡터 레이아웃이나 개별 화면 원본이 별도 스케일링되었는지는 알 수 없다.

## 3. Site Map and Page/Route Inventory

| 근거 | Page ID | route/name | 목적 | 증거 | shell variant | desktop | mobile | confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OBSERVED (confidence HIGH) | P-01 | `/` 홈/주문 발견 | 회원 상태, 최근 주문, 이벤트, 랭킹, 추천 메뉴 탐색 | E-01, E-02, E-03 | blue-home + bottom-nav | 414px 중앙 패널 | full-width | HIGH |
| OBSERVED (confidence HIGH) | P-02 | `/menu/:menu_id` 상품 상세 | 메뉴 이미지, 가격, 매장, 수량, 주문 시작 | E-01 | white-detail | 414px 중앙 패널 | full-width | HIGH |
| OBSERVED (confidence HIGH) | P-03 | `/menu/:menu_id/options` 옵션 선택 | 온도/크기/우유 선택 | E-01, E-02 | white-sheet | 414px 중앙 패널 | full-width sheet | HIGH |
| OBSERVED (confidence HIGH) | P-04 | `/menu/:menu_id/save` 저장 다이얼로그 상태 | 커스텀 메뉴 이름 입력과 저장 | E-02 | dialog-overlay | 중앙 dialog | modal | HIGH |
| OBSERVED (confidence HIGH) | P-05 | `/stores` 매장 검색 | 검색, 거리/단골 탭, 매장 목록 | E-02 | white-search | 414px 중앙 패널 | full-width | HIGH |
| OBSERVED (confidence HIGH) | P-06 | `/checkout` 주문 확인 | 주문 내역, 요청, 쿠폰, 결제 진입 | E-02, E-03 | white-checkout | 414px 중앙 패널 | full-width | HIGH |
| UNKNOWN (confidence HIGH) | — | 인증/쿠폰/주문내역/전체메뉴 목적지 | 홈 아이콘이 암시하는 미노출 화면 | 아이콘만 관찰 | UNKNOWN | 미지원 | 미지원 | LOW |

- INFERRED (confidence HIGH) 기본 페이지는 P-01이며 상단 내비게이션의 홈 상태와 하단 `매장주문` 항목을 활성 상태로 둔다.
- INFERRED (confidence MEDIUM) P-02와 P-03은 메뉴 카드 또는 최근 주문 CTA에서 진입한다.
- INFERRED (confidence MEDIUM) P-04는 P-03의 `나만의 메뉴 저장` 명령으로 열리는 모달 상태이며 직접 북마크 시 P-03 위에 복원한다.
- INFERRED (confidence MEDIUM) P-05는 P-02/P-06의 매장 변경 컨트롤에서 진입한다.
- INFERRED (confidence MEDIUM) P-06은 P-02의 주문 버튼 또는 P-03 옵션 확정에서 진입한다.

## 4. Shared Application Shell

| 근거 | primitive | 값 | 사용 위치 | QA tolerance |
| --- | --- | --- | --- | --- |
| MEASURED (confidence HIGH) | viewport backdrop | `#F1F1F1`, canonical E-01 (590,600) | 414px 외부 데스크톱 영역 | deltaE ≤3 |
| INFERRED (confidence HIGH) | app-width | `min(414px, 100vw)` | 모든 페이지 | ±2px |
| MEASURED (confidence HIGH) | inner gutter | 기준 24px, 414−2×24=366px 내용 폭 | P-02/P-05/P-06 | ±2px |
| INFERRED (confidence HIGH) | narrow gutter | 390px에서 24px, 360px에서 20px | 모든 페이지 | ±2px |
| MEASURED (confidence HIGH) | section separator | 8px `#EEEEEE` band | P-01, P-06 | ±1px |
| MEASURED (confidence MEDIUM) | panel radius | 상단/하단 카드 20px | 독립 화면 외곽 | ±3px |
| INFERRED (confidence MEDIUM) | desktop panel shadow | `0 18px 36px rgba(0,0,0,.16)` | 414px app panel | blur ±6px |
| INFERRED (confidence HIGH) | scroll owner | 페이지당 단일 vertical `ScrollContainer` | P-01/P-05/P-06 | 중첩 스크롤 없음 |
| INFERRED (confidence HIGH) | safe area | `max(0px, env(safe-area-inset-*)))` 추가 | 모바일 상/하단 | clipping 0px |
| UNKNOWN (confidence HIGH) | announcement/cookie | 증거 없음, 구현하지 않음 | 전역 | 존재하지 않아야 함 |

- INFERRED (confidence HIGH) 루트 stacking context는 backdrop z=0, app surface z=10, sticky header z=100, bottom nav z=110, overlay z=900, dialog z=910, toast z=1000이다.
- INFERRED (confidence HIGH) 데스크톱 외부 영역은 페이지 스크롤을 허용하지만 앱 패널 자체 높이가 뷰포트를 넘는 경우 body와 내부 `ScrollContainer` 중 하나만 스크롤 주체가 되게 한다.
- INFERRED (confidence HIGH) Godot에서는 `Control(AppShell) > CenterContainer > PanelContainer(AppViewport) > VBoxContainer`로 폭을 고정하고 `clip_contents=true`를 적용한다.
- INFERRED (confidence HIGH) HTML 대응에서는 `.app-shell{width:min(414px,100vw);min-height:100dvh;margin-inline:auto;background:#fff}`를 사용한다.
- OBSERVED (confidence HIGH) 콜라주 배경에 공지 바, 쿠키 배너, 채팅 버튼, 외부 사이트 chrome은 보이지 않는다.

## 5. Navigation and Header Specification

### 5.1 Desktop/Centered-App Header Geometry

| 근거 | 필드 | P-01 blue-home | P-02/P-06 white | P-05 search | tolerance |
| --- | --- | --- | --- | --- | --- |
| MEASURED (confidence HIGH) | total header height | 62px | 62px(P-02), 116px(P-06 store row 포함) | 75px | ±3px |
| OBSERVED (confidence HIGH) | utility-bar height | 0px | 0px | 0px | 0px |
| MEASURED (confidence HIGH) | content width | 414px | 414px | 414px | ±2px |
| MEASURED (confidence HIGH) | left/right padding | 26px/24px | 22px/20px | 22px/20px | ±2px |
| MEASURED (confidence MEDIUM) | logo bounds | rel x26 y22 w122 h24px | 없음 | 없음 | ±4px |
| UNKNOWN (confidence HIGH) | menu start x | 텍스트 메뉴 없음; 0px | 텍스트 메뉴 없음; 0px | 텍스트 메뉴 없음; 0px | n/a |
| MEASURED (confidence MEDIUM) | item box/padding | icon visual 24px, box 44px | icon visual 24px, box 44px | icon visual 24px, box 44px | ±2px |
| MEASURED (confidence MEDIUM) | item gap | 8px | 10px | 6px | ±3px |
| MEASURED (confidence MEDIUM) | label baseline | 로고 baseline rel y42px | title baseline rel y39px | input baseline rel y40px | ±2px |
| MEASURED (confidence HIGH) | icon size | 24×24px | 24×24px | 22×22px | ±2px |
| MEASURED (confidence MEDIUM) | action area width | 100px | 100px | 354px(search 포함) | ±4px |
| OBSERVED (confidence HIGH) | border | 없음 | 하단 1px `#EEEEEE` | input 1px `#CCCCCC` | deltaE ≤3 |
| MEASURED (confidence HIGH) | background | sampled `#012D76` | `#FFFFFF` | `#FFFFFF` | deltaE ≤3 |
| UNKNOWN (confidence HIGH) | position mode | 정적 캡처로 판별 불가 | 정적 캡처로 판별 불가 | 정적 캡처로 판별 불가 | n/a |
| INFERRED (confidence MEDIUM) | implementation mode | sticky top 0px | sticky top 0px | sticky top 0px | top offset 0px |
| INFERRED (confidence HIGH) | z-index | 100 | 100 | 100 | 정확 일치 |

### 5.2 Mobile Header and Menu Geometry

| 근거 | 필드 | 구현 값 | 비고 |
| --- | --- | --- | --- |
| INFERRED (confidence HIGH) | bar height | 62px, P-05만 75px | 360–414px 공통 |
| INFERRED (confidence HIGH) | side padding | 24px(390/414), 20px(360) | safe area 별도 더함 |
| INFERRED (confidence MEDIUM) | logo bounds | x24 y19 w122 h24px | P-01 대체 워드마크 |
| INFERRED (confidence HIGH) | back/menu-control bounds | rel x12 y9 w44 h44px | P-02/P-05/P-06 |
| INFERRED (confidence HIGH) | touch target | 최소 44×44px | visual icon 24px |
| UNKNOWN (confidence HIGH) | drawer open-panel origin | 화면 메뉴 버튼이 없어 `(0,0)` | drawer 미구현 |
| UNKNOWN (confidence HIGH) | drawer width/height | `0×0px` | 하단 내비게이션 사용 |
| UNKNOWN (confidence HIGH) | drawer row/indent | `0px/0px` | 해당 없음 |
| UNKNOWN (confidence HIGH) | drawer divider/overlay | `none`/alpha 0 | 해당 없음 |
| INFERRED (confidence HIGH) | close behavior | modal/sheet만 Escape·back으로 닫음 | drawer 없음 |
| INFERRED (confidence HIGH) | scroll locking | P-03/P-04 overlay가 열릴 때 body lock | 나머지 화면은 unlock |

### 5.3 Visible Navigation Order and Targets

| 근거 | 순서 | 표면 | 항목 | target | active rule |
| --- | --- | --- | --- | --- | --- |
| OBSERVED (confidence HIGH) | 1 | P-01 top | 대체 로고 | `/` | P-01에서 active |
| OBSERVED (confidence HIGH) | 2 | P-01/P-02 top | 장바구니 아이콘 | UNKNOWN | active 없음 |
| OBSERVED (confidence HIGH) | 3 | P-01 top | 알림 아이콘 | UNKNOWN | unread badge 증거 없음 |
| OBSERVED (confidence HIGH) | 4 | P-02/P-05/P-06 top | 뒤로 | history back | pressed만 |
| OBSERVED (confidence HIGH) | 5 | P-02/P-05/P-06 top | 홈 | `/` | P-01 도달 시 active |
| OBSERVED (confidence HIGH) | 6 | P-01 bottom | 매장 주문 | `/` | 기본 active |
| OBSERVED (confidence MEDIUM) | 7 | P-01 bottom | 배달 주문 | UNKNOWN | 미활성 |
| OBSERVED (confidence MEDIUM) | 8 | P-01 bottom | 중앙 스캔 | UNKNOWN | 강조 action |
| OBSERVED (confidence MEDIUM) | 9 | P-01 bottom | 빠른 주문 | UNKNOWN | 미활성 |
| OBSERVED (confidence MEDIUM) | 10 | P-01 bottom | 전체 메뉴 | UNKNOWN | 미활성 |

### 5.4 Navigation States

| 근거 | state | visual delta | timing/behavior |
| --- | --- | --- | --- |
| INFERRED (confidence HIGH) | default | blue header icon `#FFFFFF`; white header icon `#111111`; opacity 1 | 0ms |
| INFERRED (confidence MEDIUM) | hover | 배경 `rgba(76,159,254,.12)`, radius 8px | 120ms ease-out |
| INFERRED (confidence HIGH) | focus-visible | 2px `#4C9FFE` ring, 2px offset | 즉시 표시 |
| INFERRED (confidence MEDIUM) | pressed | opacity .82, scale .98 | 80ms ease-out |
| INFERRED (confidence HIGH) | active | P-01 bottom icon/text `#012D76`, 상단 홈 `aria-current=page` | 지속 |
| INFERRED (confidence HIGH) | disabled | `#BBBBBB`, opacity .55, pointer/keyboard 비활성 | transition 0ms |
| INFERRED (confidence MEDIUM) | scrolled | `box-shadow:0 2px 8px rgba(0,0,0,.10)` | 160ms ease-out |
| UNKNOWN (confidence HIGH) | menu-open | drawer가 보이지 않아 미지원 | n/a |
| UNKNOWN (confidence HIGH) | submenu-open | 하위 메뉴 증거가 없어 미지원 | n/a |

## 6. Page-by-Page Specifications

### Page P-01: 홈/주문 발견

#### P-01 Context and Canvas

- OBSERVED (confidence HIGH) route는 `/`, 목적은 회원 상태 확인과 메뉴 재주문·발견이며 증거는 E-01/E-02/E-03이다.
- INFERRED (confidence HIGH) entry point는 직접 방문과 모든 홈 아이콘이며 shared shell은 `blue-home + bottom-nav`, active 항목은 `매장 주문`이다.
- MEASURED (confidence HIGH) prepared desktop 표현은 canonical `x137 y137 w414 h3481px`, 페이지 콘텐츠 하단은 y3618px다.
- INFERRED (confidence HIGH) 런타임 desktop canvas는 `w414px, min-h100dvh`, 외부 좌우 gutter는 1440에서 513px이며 배경은 `#FFFFFF`이다.
- INFERRED (confidence HIGH) mobile canvas는 390/360px full width, side padding 24/20px, vertical stacking, `overflow-x:hidden`, `overflow-y:auto`다.
- OBSERVED (confidence HIGH) 전체 긴 캡처는 헤더→캐러셀→회원→최근 주문→이벤트→랭킹→프로모션→추천→하단 내비 순서다.

#### P-01 Ordered Section Geometry

| 근거 | Section ID | Evidence/region | Bounds prepared px | role | container | layout | spacing | alignment | surface | content | responsive |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MEASURED (confidence HIGH) | P01-S01 | E-01 x137–550 y137–198 | x137 y137 w414 h62 | header | full bleed | HBox, logo + actions | px 26/24, gap 8 | center/baseline | `#012D76`, radius top 20 | 대체 로고, cart, bell | ≤414 full width |
| MEASURED (confidence MEDIUM) | P01-S02 | E-01 x137–550 y199–614 | x137 y199 w414 h416 | hero/main | full bleed clipped | horizontal carousel | py38, card gap34 | center | white, media radius 16 | 3 slides 암시, 1개 중심 | card `calc(100%-122px)` |
| MEASURED (confidence MEDIUM) | P01-S03 | E-01 x137–550 y615–884 | x137 y615 w414 h270 | section | 366px inner | VBox + 4-col grid | pt20, gap24 | start | white | 인사, 등급, 4 shortcuts | 360에서 4×1 유지 |
| MEASURED (confidence MEDIUM) | P01-S04 | E-01 x137–550 y885–1124 | x137 y885 w414 h240 | section | 366px inner | VBox, horizontal recent card | py10, gap18 | start | white | 최근 주문 1.5개, CTA | horizontal scroll 유지 |
| MEASURED (confidence HIGH) | P01-S05 | E-01 x137–550 y1132–1460 | x137 y1132 w414 h329 | section | 366px inner | VBox | p27, gap20 | start | white, radius 16 | 이벤트 제목/기간/미션 패널 | 360 패널 320px |
| MEASURED (confidence MEDIUM) | P01-S06 | E-01/E-02 y1468–2173 | x137 y1468 w414 h706 | section | 366px inner | 5-row grid, 각 row 2 rank | p27, row gap12 | baseline | white, radius 16 | 순위 1–10, 썸네일 5 | 360에서도 2 rank/row |
| MEASURED (confidence MEDIUM) | P01-S07 | E-02 full y2182–2730 | x137 y2182 w414 h549 | section | full bleed | promo art + offer card | p28, gap20 | center | `#774433/#FFEECC` | 시즌 비주얼, 할인 상품 | artwork ratio 414/549 |
| MEASURED (confidence MEDIUM) | P01-S08 | E-02/E-03 full y2738–3460 | x137 y2738 w414 h723 | section | 366px inner | chips + horizontal cards | p27, gaps12/16 | start | white, radius 16 | 칩 3+, 카드 2개 peek, 더보기 | 360 card 268px |
| MEASURED (confidence MEDIUM) | P01-S09 | E-03 full y3541–3618 | x137 y3541 w414 h78 | navigation | full bleed | 5-col grid | px12, gap0 | center/end | white, top border | 5 actions, 중앙 원형 강조 | fixed bottom, safe inset |

#### P-01 Detailed Sections

- MEASURED (confidence MEDIUM) P01-S02의 중심 슬라이드는 rel `x66 y38 w292 h357px`, 양쪽 슬라이드는 각각 32px 이상 노출되고 중심 카드 반경은 16px다.
- INFERRED (confidence HIGH) P01-S02 DOM/scene은 `HeroCarousel > HorizontalScroll > HeroSlide[3+] > TextureRect + LabelStack + PageIndicator`다.
- INFERRED (confidence HIGH) hero media는 `aspect-ratio:292/357`, `object-fit:cover`, 초점 `(50%,48%)`, overflow clip이며 이미지 내부 문구 대신 별도 텍스트 레이어를 쓴다.
- MEASURED (confidence MEDIUM) P01-S03 등급 capsule은 rel `x27 y60 w360 h83px`, shortcut 셀은 약 78×72px 네 개다.
- INFERRED (confidence HIGH) shortcut grid는 `repeat(4,1fr)`, column gap 8px, 아이콘 28px, label top gap 8px로 구현한다.
- MEASURED (confidence MEDIUM) P01-S04 CTA는 52px 원형 favorite와 `w265 h52px` 주 버튼, gap 10px로 구성한다.
- INFERRED (confidence HIGH) 최근 주문 카드는 최소 폭 286px, 한 줄 title, 한 줄 store meta, 52px thumbnail이며 incomplete row는 왼쪽 정렬한다.
- MEASURED (confidence MEDIUM) P01-S05 내부 미션 패널은 rel `x27 y115 w360 h177px`, radius 14px, 배경 `#223355` 계열이다.
- INFERRED (confidence HIGH) P01-S06 각 랭킹 row 높이는 100px, 왼쪽 rank 26px + image 80px + title flex, 오른쪽 rank 24px 구조다.
- INFERRED (confidence MEDIUM) 랭킹 목록은 5행×2열 의미 표현이지만 접근성 DOM 순서는 1→10으로 유지하고 CSS grid-area로 시각 배치한다.
- MEASURED (confidence HIGH) P01-S07 대표 배경 팔레트에는 E-02 `#774433` 3.07%, `#FFEECC` 2.11%, `#774422` 0.5%가 포함된다.
- INFERRED (confidence HIGH) P01-S07의 원 캐릭터 장식은 사용하지 않고 음식 실루엣 또는 권리 확보된 Godot 프로젝트 마스코트로 교체한다.
- INFERRED (confidence HIGH) P01-S08 chip row는 nowrap horizontal scroll, chip 높이 44px, padding 16px, gap 8px, 선택 chip `#444444/#FFFFFF`다.
- MEASURED (confidence MEDIUM) P01-S08 상품 카드 폭은 약 268px, 이미지 영역 268×260px, 본문 268×145px, 카드 gap 16px다.
- INFERRED (confidence HIGH) 카드 제목은 1줄, 설명은 2줄 line-clamp, 가격 행은 할인율/판매가/취소선 원가 순이며 모든 수치는 우측으로 넘치지 않게 wrap한다.
- INFERRED (confidence HIGH) P01-S09는 viewport bottom에 sticky/fixed, 중앙 action visual 72px 원이 nav 상단보다 18px 돌출되며 실제 target은 64×64px다.

#### P-01 Page-Specific Contract

- INFERRED (confidence HIGH) components는 `HeroCarousel`, `MembershipSummary`, `ShortcutGrid`, `RecentOrderRail`, `EventPanel`, `RankingList`, `SeasonalPromo`, `RecommendationRail`, `BottomNav`다.
- INFERRED (confidence HIGH) data는 hero 3+, shortcuts 4, recent orders 0+, ranking 정확히 10, recommendations 0+이며 API 정렬 순서를 유지한다.
- INFERRED (confidence HIGH) loading은 동일 높이 skeleton을 사용하고 empty recent/recommendation은 96px 안내 행과 메뉴 탐색 버튼으로 대체한다.
- INFERRED (confidence HIGH) carousel drag와 chip rail drag는 포인터/터치를 지원하고 키보드에서는 좌우 화살표로 현재 item을 이동한다.
- UNKNOWN (confidence HIGH) 자동 재생은 증거가 없으므로 구현하지 않는다.
- INFERRED (confidence HIGH) 접근성 heading은 h1 `메뉴 홈`, 각 카드군 h2, 카드 제목 h3이며 bottom nav는 `aria-label="주요 주문 메뉴"`다.
- INFERRED (confidence HIGH) page asset은 대체 wordmark SVG 122×24, hero WebP 584×714 이상 3개, 80px 메뉴 AVIF/WebP, 536×520 추천 사진을 사용한다.
- INFERRED (confidence HIGH) P-01 acceptance는 canonical width 414에서 모든 section 주요 y edge가 표의 연결 리듬 ±4px에 들고 bottom nav가 콘텐츠를 가리지 않는 것이다.

### Page P-02: 상품 상세

#### P-02 Context and Canvas

- OBSERVED (confidence HIGH) route 역할은 `/menu/:menu_id`, 선택 메뉴의 이미지·기본가·매장·수량·구매 명령을 보여 주며 증거는 E-01이다.
- INFERRED (confidence HIGH) entry는 P-01 메뉴 카드, shell은 `white-detail`, active top item은 없고 홈 아이콘이 `/`로 연결된다.
- MEASURED (confidence HIGH) prepared bounds는 `x634 y137 w414 h829px`, 내부 주요 폭은 368px, 배경은 `#FFFFFF`다.
- INFERRED (confidence HIGH) desktop/mobile 모델은 app-width 규칙을 따르며 360px에서 media 폭 320px, side padding 20px로 축소한다.
- INFERRED (confidence HIGH) stacking은 header→media→identity/price→store selector→quantity/CTA이고 horizontal overflow는 금지한다.

#### P-02 Ordered Section Geometry

| 근거 | Section ID | Evidence/region | Bounds prepared px | role | container/layout | spacing/alignment | surface | content | responsive |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MEASURED (confidence HIGH) | P02-S01 | E-01 x634–1047 y137–198 | x634 y137 w414 h62 | header | full, HBox | px22, center | white | back, cart, home | width fluid |
| MEASURED (confidence HIGH) | P02-S02 | E-01 x657–1024 y218–585 | x657 y218 w368 h368 | figure | inner, block | mt20 | `#F5F5F5`, r12 | product cutout | 360에서 320×320 |
| MEASURED (confidence MEDIUM) | P02-S03 | E-01 x657–1024 y612–755 | x657 y612 w368 h144 | main | VBox | gap12, start | white | badge, title, base price | title wrap 2줄 |
| MEASURED (confidence HIGH) | P02-S04 | E-01 x657–1024 y766–823 | x657 y766 w368 h58 | section/link | HBox | py14, baseline | white, border y766/823 | store + change | 360 text ellipsis |
| MEASURED (confidence HIGH) | P02-S05 | E-01 x634–1047 y824–965 | x634 y824 w414 h142 | footer/action | 2-row flex | p12/22, gaps10 | white, shadow | qty, total, favorite, cart, order | sticky bottom |

#### P-02 Detailed and Page-Specific Contract

- INFERRED (confidence HIGH) P02-S01 hierarchy는 `DetailHeader > BackButton + Spacer + CartButton + HomeButton`이며 모든 아이콘 target은 44px다.
- INFERRED (confidence HIGH) P02-S02는 `TextureRect expand_mode=FIT_WIDTH_PROPORTIONAL`, `stretch_mode=KEEP_ASPECT_CENTERED`, padding 44px를 사용한다.
- OBSERVED (confidence HIGH) 상품은 배경 제거된 음료 두 개가 밝은 회색 정사각형 중앙에 놓인다.
- INFERRED (confidence HIGH) 원 사진 대신 실제 프로젝트의 메뉴 cutout 736×736 WebP를 사용하고 alt는 메뉴명만 제공한다.
- MEASURED (confidence MEDIUM) P02-S03 badge는 38×22px 수준, title 28px line-height 36px, price 28px line-height 34px다.
- INFERRED (confidence HIGH) title과 price는 API 값이며 title 2줄 이후 ellipsis, price는 `Intl.NumberFormat('ko-KR')` 형식으로 표시한다.
- INFERRED (confidence HIGH) P02-S04 store text는 1줄 ellipsis, 변경 버튼은 최소 44×32 visual과 44×44 hit area를 갖는다.
- MEASURED (confidence MEDIUM) P02-S05 quantity row는 h48px, action row는 h64px이고 favorite 54px, cart 150px, primary 148px 폭에 가깝다.
- INFERRED (confidence HIGH) 360px에서는 action grid를 `54px minmax(112px,1fr) minmax(112px,1fr)`로 바꾸고 gap 8px를 유지한다.
- INFERRED (confidence HIGH) quantity minus는 1에서 disabled, plus는 재고 한도에서 disabled, total은 `base+options`×quantity로 즉시 계산한다.
- INFERRED (confidence HIGH) order 버튼은 P-03으로 이동하고 cart 버튼 target은 UNKNOWN route이므로 로컬 cart state 갱신 후 toast를 표시한다.
- INFERRED (confidence HIGH) loading은 media 1:1 skeleton과 텍스트 skeleton을 유지하고 unavailable은 주문 CTA disabled + 상태 문구를 노출한다.
- INFERRED (confidence HIGH) P-02 acceptance는 414px에서 media 368×368, bottom action h142, 360px에서 버튼 text clipping 0px다.

### Page P-03: 옵션 선택

#### P-03 Context and Canvas

- OBSERVED (confidence HIGH) route/state는 `/menu/:menu_id/options`, 목적은 필수 온도/크기와 선택 우유를 고르는 것이며 E-01/E-02에 걸쳐 보인다.
- MEASURED (confidence MEDIUM) prepared bounds는 `x634 y1064 w414 h≈713px`, canonical 하단은 y≈1777px다.
- INFERRED (confidence HIGH) desktop에서는 P-02 위 bottom sheet 또는 직접 route의 414px panel, mobile에서는 bottom origin sheet로 구현한다.
- INFERRED (confidence HIGH) mobile side padding은 24/20px, 최대 높이 `min(80dvh,713px)`, 내부 vertical scroll, 배경 body lock이다.

#### P-03 Ordered Section Geometry

| 근거 | Section ID | Evidence/region | Bounds prepared px | role | container/layout | spacing/alignment | surface | content | responsive |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MEASURED (confidence MEDIUM) | P03-S01 | E-01 y1064–1332 | x634 y1064 w414 h269 | section/radiogroup | 366px VBox | p28, row gap24 | white, top r20 | title, 선택제한, 3 rows | full-width sheet |
| MEASURED (confidence MEDIUM) | P03-S02 | E-01/E-02 full y1333–1777 | x634 y1333 w414 h445 | section/radiogroup | 366px VBox | p28, row gap28 | white, bottom r20 | 우유 title, 3 rows | max-height scroll |

#### P-03 Detailed and Page-Specific Contract

- INFERRED (confidence HIGH) hierarchy는 `OptionSheet > OptionGroup[temperature_size] + Divider + OptionGroup[milk] + StickyConfirmArea`이며 확인 영역은 증거 밖이므로 기본 구현에서 숨긴다.
- MEASURED (confidence MEDIUM) option row 높이는 38–44px, 그룹 내 row baseline 간격은 약 62px, 선택 원은 24×24px다.
- INFERRED (confidence HIGH) 필수 그룹은 단일 선택 radio, milk 그룹은 최대 1개 radio로 구현하고 제목 옆 제한 badge는 74×20px다.
- INFERRED (confidence HIGH) selected radio는 fill `#012D76`, check `#FFFFFF`; unselected는 1px `#BBBBBB`; row 전체 44px를 clickable target으로 둔다.
- OBSERVED (confidence HIGH) 세 번째 크기 옵션과 두 개의 대체 우유에는 우측 추가 금액이 표시된다.
- INFERRED (confidence HIGH) 추가금은 option data의 `price_delta`이며 0원은 비워 두고 양수는 `+500원` 형태로 우측 정렬한다.
- UNKNOWN (confidence HIGH) sheet의 닫기 handle, 닫기 버튼, 최종 확인 CTA는 첨부 범위에서 보이지 않는다.
- INFERRED (confidence MEDIUM) 접근 가능한 구현은 상단에 44px close button과 하단에 56px `선택 완료` 버튼을 추가하되 reference 비교 모드에서는 숨길 수 있다.
- INFERRED (confidence HIGH) Escape/back은 변경을 폐기하고 P-02로 돌아가며 완료는 가격 계산 결과와 함께 P-06으로 이동한다.
- INFERRED (confidence HIGH) P-03 components는 `OptionSheet`, `OptionGroup`, `OptionRow`, `SheetCloseButton`, `ConfirmBar`이며 P03-S01/S02에 매핑한다.
- INFERRED (confidence HIGH) P-03 data는 ordered `OptionGroup[]`와 현재 `selected_option_ids`, 상태는 pristine/dirty/invalid/submitting이다.
- INFERRED (confidence HIGH) P-03 loading은 2개 group의 고정 높이 skeleton, empty/error는 sheet 안 160px 안내와 P-02 복귀 버튼으로 처리한다.
- INFERRED (confidence HIGH) P-03 responsive는 414/390/360px에서 각각 inner 358/342/320px를 쓰고 desktop 외부 backdrop만 확장한다.
- INFERRED (confidence HIGH) P-03 accessibility는 fieldset/legend/radio, close accessible name, focus trap/restore, required error 연결을 포함한다.
- INFERRED (confidence HIGH) P-03에는 독립 사진 asset이 없고 24px radio/check vector와 제한 badge만 theme에서 그린다.
- INFERRED (confidence HIGH) 검증은 360px에서 label/price가 겹치지 않고 option row focus 순서가 시각 순서와 일치하는지 포함한다.

### Page P-04: 나만의 메뉴 저장 다이얼로그

#### P-04 Context and Canvas

- OBSERVED (confidence HIGH) P-04는 별도 전체 페이지보다 메뉴 조합 저장 dialog 상태로 보이며 E-02에 나타난다.
- MEASURED (confidence MEDIUM) prepared dialog bounds는 `x634 y1684 w414 h≈405px`; P-03과 시각적으로 일부 겹치는 것은 콜라주 배치다.
- INFERRED (confidence HIGH) route 직렬화는 `/menu/:menu_id/save`, 실제 표현은 P-03 또는 P-02 위 modal dialog다.
- INFERRED (confidence HIGH) desktop width는 414px, mobile width는 `calc(100vw - 24px)` 최대 414px, side clearance는 12px 이상이다.

#### P-04 Ordered Section Geometry

| 근거 | Section ID | Evidence/region | Bounds prepared px | role | container/layout | spacing/alignment | surface | content | responsive |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MEASURED (confidence MEDIUM) | P04-S01 | E-02 local y164–363 | x634 y1684 w414 h200 | dialog header/main | 358px VBox | p28, gap18 | white, top r20 | title, thumbnail, recipe summary | 360에서 thumbnail 84px |
| MEASURED (confidence MEDIUM) | P04-S02 | E-02 local y384–451 | x663 y1904 w356 h68 | form | full input | mt20 | white, 1px `#BBBBBB` | custom name | fluid width |
| MEASURED (confidence HIGH) | P04-S03 | E-02 local y473–540 | x663 y1993 w356 h68 | footer | 2-col grid | gap10 | white | cancel/register | 360 각각 1fr |

#### P-04 Detailed and Page-Specific Contract

- INFERRED (confidence HIGH) hierarchy는 `ModalOverlay > FocusTrap > Dialog > Header + RecipeSummary + LineEdit + ActionRow`다.
- MEASURED (confidence MEDIUM) summary thumbnail은 약 100×102px, 텍스트 column은 236px, gap 20px다.
- INFERRED (confidence HIGH) input 높이는 68px, horizontal padding 20px, maxlength 20 grapheme, placeholder는 브랜드 중립 문구를 쓴다.
- INFERRED (confidence HIGH) 취소 버튼은 white/1px `#CCCCCC`, 등록 버튼은 `#012D76/#FFFFFF`, 둘 다 radius 8px다.
- INFERRED (confidence HIGH) empty/공백-only 이름에서는 등록 disabled, 중복 이름은 field error와 `aria-describedby`로 연결한다.
- INFERRED (confidence HIGH) 저장 중에는 등록 label을 유지하고 18px spinner를 추가하며 버튼 width 변화는 0px다.
- INFERRED (confidence HIGH) 성공 시 dialog를 닫고 `나만의 메뉴에 저장됨` status toast를 4초 노출한다.
- INFERRED (confidence HIGH) overlay는 `rgba(0,0,0,.45)`, dialog 외 클릭과 Escape로 닫고 초점은 호출 버튼으로 복원한다.
- UNKNOWN (confidence HIGH) 실제 증거에는 overlay와 close icon이 없으므로 overlay 색·dismiss 정책은 구현 결정이다.
- INFERRED (confidence HIGH) P-04 components는 `SavedMenuDialog`, `RecipeSummary`, `ValidatedNameField`, `DialogActionRow`이며 S01/S02/S03에 각각 매핑한다.
- INFERRED (confidence HIGH) P-04 data는 `recipe`, `name`, `existing_names`; local states는 idle/invalid/saving/saved/error다.
- INFERRED (confidence HIGH) P-04 responsive는 dialog 414/414/414/414/366/336px, padding 28px에서 360px만 20px로 전환한다.
- INFERRED (confidence HIGH) P-04 accessibility는 dialog label을 title과 연결하고 error description, focus trap, Escape, invoker restore를 보장한다.
- INFERRED (confidence HIGH) P-04 asset은 선택 메뉴 100×102px 대체 thumbnail 하나이며 P-02와 같은 source를 재사용하고 반복 alt는 빈 값으로 둔다.
- INFERRED (confidence HIGH) P-04 acceptance는 360px에서 dialog가 viewport 안에 12px clearance를 남기고 키보드가 열려도 input/action이 스크롤로 도달 가능해야 한다.

### Page P-05: 매장 검색

#### P-05 Context and Canvas

- OBSERVED (confidence HIGH) route는 `/stores`, 검색/거리 탭과 주변 매장 목록을 제공하며 증거는 E-02다.
- MEASURED (confidence HIGH) prepared bounds는 `x634 y2188 w414 h≈797px`; 다섯 매장 row가 보인다.
- INFERRED (confidence HIGH) entry는 P-02/P-06 매장 변경, shell은 `white-search`, 현재 활성 tab은 `가까운 매장`이다.
- INFERRED (confidence HIGH) desktop/mobile은 414px max-width 단일 column이며 list가 viewport 높이를 넘으면 page scroll한다.

#### P-05 Ordered Section Geometry

| 근거 | Section ID | Evidence/region | Bounds prepared px | role | container/layout | spacing/alignment | surface | content | responsive |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MEASURED (confidence HIGH) | P05-S01 | E-02 full y2188–2263 | x634 y2188 w414 h76 | header/search | HBox | px22, gap8 | white | back, search input, home | input flex 1 |
| MEASURED (confidence HIGH) | P05-S02 | E-02 full y2274–2323 | x657 y2274 w368 h50 | tablist | 2-col grid | gap0 | `#F5F5F5`, r6 | nearby/favorites | 360 width 320px |
| MEASURED (confidence MEDIUM) | P05-S03 | E-02 full y2332–2388 | x657 y2332 w368 h57 | status | flex | py18 | white | result count | wrap 금지 |
| MEASURED (confidence MEDIUM) | P05-S04 | E-02 full y2389–2984 | x657 y2389 w368 h596 | main/list | VBox 5 rows | row h115 | white, dividers | store image/info/star | 360 row h120 |

#### P-05 Detailed and Page-Specific Contract

- INFERRED (confidence HIGH) P05-S01 hierarchy는 `StoreHeader > BackButton + SearchField(SearchIcon slot) + HomeButton`이며 submit은 Enter/search icon이다.
- MEASURED (confidence MEDIUM) search field는 약 296×45px, border 1px `#CCCCCC`, radius 4px, icon 22px다.
- INFERRED (confidence HIGH) tabs는 roving tabindex, selected tab white surface + 1px border, unselected transparent이며 `aria-selected`를 갱신한다.
- MEASURED (confidence MEDIUM) store row는 image 80×80px, info flex 약 230px, favorite 32×44px hit area로 구성된다.
- INFERRED (confidence HIGH) store name은 1줄, meta는 거리·편의시설 1줄, address는 2줄까지 허용하고 long text는 ellipsis한다.
- OBSERVED (confidence HIGH) 첫 매장 star만 노란색 filled이고 나머지는 옅은 outline이다.
- INFERRED (confidence HIGH) favorite toggle은 optimistic update, 실패 시 원상 복구와 polite live toast를 사용한다.
- INFERRED (confidence HIGH) 검색 loading은 기존 list 높이를 유지하는 5-row skeleton, empty는 160px 안내, error는 retry button을 제공한다.
- UNKNOWN (confidence HIGH) 위치 권한 요청과 실제 거리 계산 방식은 보이지 않는다.
- INFERRED (confidence MEDIUM) 첫 진입 시 권한을 즉시 강제하지 않고 검색 또는 `내 위치 사용` 명령에서만 요청한다.
- INFERRED (confidence HIGH) P-05 components는 `StoreSearchHeader`, `StoreTabs`, `ResultSummary`, `StoreList`, `StoreRow`, `FavoriteToggle`이다.
- INFERRED (confidence HIGH) P-05 data는 query, mode, ordered `Store[]`; UI states는 idle/searching/results/empty/error/permission-denied다.
- INFERRED (confidence HIGH) P-05 responsive는 414/390에서 80px thumbnail, 360에서 72px thumbnail과 120px row를 적용한다.
- INFERRED (confidence HIGH) P-05 accessibility는 search landmark, labelled input, tablist, result count live status, favorite pressed state를 포함한다.
- INFERRED (confidence HIGH) P-05 assets는 storefront WebP 80×80 display 다섯 개와 Lucide search/home/star icon이며 실패 placeholder도 1:1을 유지한다.
- INFERRED (confidence HIGH) P-05 acceptance는 414px에서 5개 row 높이 리듬 ±2px, 360px에서 주소와 star overlap 0px, keyboard tab 전환 정상이다.

### Page P-06: 주문 확인/결제 진입

#### P-06 Context and Canvas

- OBSERVED (confidence HIGH) route는 `/checkout`, 주문 내역·매장 요청·쿠폰·최종 결제 CTA를 보여 주며 E-02/E-03에 걸쳐 나타난다.
- MEASURED (confidence HIGH) prepared bounds는 `x634 y3084 w414 h≈841px`, canonical 하단은 y≈3925px다.
- INFERRED (confidence HIGH) entry는 P-02 직접 주문 또는 P-03 완료, shell은 `white-checkout`, top title은 `주문하기`에 대응하는 중립 문구다.
- INFERRED (confidence HIGH) mobile는 full width, vertical stack, 하단 CTA sticky; keyboard/input focus 시 CTA가 input을 덮지 않게 viewport inset을 반영한다.

#### P-06 Ordered Section Geometry

| 근거 | Section ID | Evidence/region | Bounds prepared px | role | container/layout | spacing/alignment | surface | content | responsive |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MEASURED (confidence HIGH) | P06-S01 | E-02/E-03 full y3084–3199 | x634 y3084 w414 h116 | header | 2-row VBox | px22, row h62/54 | white, border | back/title/home + store | 360 store ellipsis |
| MEASURED (confidence MEDIUM) | P06-S02 | E-03 local y160–483 | x634 y3200 w414 h324 | main/order summary | 366px VBox | p22, gap16 | white, bottom r16 | count, item, qty, breakdown | line items fluid |
| MEASURED (confidence HIGH) | P06-S03 | E-03 local y491–662 | x634 y3531 w414 h172 | section/form | 366px VBox | p24, gap16 | white, r16 | request label/input | input h54 |
| MEASURED (confidence HIGH) | P06-S04 | E-03 local y669–774 | x634 y3709 w414 h106 | section/link | HBox | p24 | white, r16 | coupon + select | 44px target |
| MEASURED (confidence HIGH) | P06-S05 | E-03 local y781–885 | x634 y3821 w414 h105 | footer/action | sticky block | p20/22 | white, shadow | total payment button | safe inset 포함 |

#### P-06 Detailed and Page-Specific Contract

- INFERRED (confidence HIGH) P06-S01 hierarchy는 `CheckoutHeader > Back + CenterTitle + Home`와 `StoreContext > StoreIcon + StoreName + Mode` 두 행이다.
- MEASURED (confidence MEDIUM) P06-S02 item thumbnail은 80×80px, title/price column은 200px 이상, qty capsule은 54×38px다.
- INFERRED (confidence HIGH) 가격 breakdown은 2-column definition list로 구현해 label은 왼쪽, amount는 오른쪽 정렬하고 row gap 8px를 둔다.
- INFERRED (confidence HIGH) 상품 제거/수량 수정 명령은 증거에 없으므로 checkout 화면에서는 read-only이며 back으로 돌아가 수정한다.
- MEASURED (confidence MEDIUM) P06-S03 request input은 rel `x23 y82 w368 h54px`, 1px `#CCCCCC`, radius 4px다.
- INFERRED (confidence HIGH) request는 optional, maxlength 100 grapheme, 한 줄 입력 후 390/360에서 text overflow 시 horizontal scroll이 아닌 내부 single-line caret scroll을 쓴다.
- INFERRED (confidence HIGH) P06-S04는 선택된 쿠폰이 없으면 단일 link row, 선택 후 이름과 할인액을 같은 높이에 표시한다.
- MEASURED (confidence HIGH) P06-S05 primary button은 rel `x23 y21 w368 h62px`, `#012D76`, radius 10px다.
- INFERRED (confidence HIGH) 버튼 label은 계산된 payable amount를 포함하고 loading에서는 중복 submit을 차단하며 실패 시 inline error + retry를 제공한다.
- UNKNOWN (confidence HIGH) 결제 수단 선택, 약관 동의, 외부 PG 이동 화면은 증거에 없다.
- INFERRED (confidence HIGH) 결제 CTA 이전에 서버 가격 재검증을 하고 불일치 시 assertive live region으로 알린 뒤 갱신된 합계를 확인받는다.
- INFERRED (confidence HIGH) P-06 components는 `CheckoutHeader`, `StoreContext`, `OrderSummary`, `RequestField`, `CouponSelector`, `PaymentBar`다.
- INFERRED (confidence HIGH) P-06 data는 immutable `CheckoutDraft`와 selected coupon, request; states는 loading/ready/validating/submitting/error/success다.
- INFERRED (confidence HIGH) P-06 loading은 section bounds를 유지하는 skeleton, empty cart는 P-01 복귀, unavailable item은 P-02 수정 action을 제공한다.
- INFERRED (confidence HIGH) P-06 responsive는 inner 366/342/320px와 thumbnail 80/76/72px를 사용하고 section 순서는 바꾸지 않는다.
- INFERRED (confidence HIGH) P-06 accessibility는 heading h1, 가격 definition list, request label/error, payment live status, focusable retry를 포함한다.
- INFERRED (confidence HIGH) P-06 asset은 선택 메뉴 80px thumbnail과 24px store/back/home icon이며 원 상품 사진은 권리 확보된 대체 asset으로 교체한다.
- INFERRED (confidence HIGH) P-06 acceptance는 가격 합계 수학 일치, 360px에서 label/amount overlap 0px, request focus와 CTA 접근, submit 1회 보장이다.

## 7. Section and Layout Deep Dives

### 7.1 Page/Section Scene and DOM Models

| 근거 | Section | Godot scene hierarchy | CSS layout model | desktop/tablet/mobile geometry |
| --- | --- | --- | --- | --- |
| INFERRED (confidence HIGH) | P01-S01 | `PanelContainer > HBoxContainer(Logo, Spacer, IconButton×2)` | `display:flex;align-items:center` | h62; px26/24; 360 px20 |
| INFERRED (confidence HIGH) | P01-S02 | `ClipControl > ScrollContainer(H) > HBoxContainer(HeroSlide×N)` | `grid-auto-flow:column;grid-auto-columns:292px` | card 292/276/248px at 414/390/360 |
| INFERRED (confidence HIGH) | P01-S03 | `MarginContainer > VBox(Membership, Grid(shortcuts))` | `display:grid;grid-template-columns:repeat(4,1fr)` | inner 366/342/320px; gap8 |
| INFERRED (confidence HIGH) | P01-S04 | `MarginContainer > VBox(Heading, HScroll, CTA)` | recent rail `grid-auto-columns:286px` | rail viewport 366/342/320px |
| INFERRED (confidence HIGH) | P01-S05 | `PanelContainer > MarginContainer > VBox` | block, mission panel fixed aspect | panel 360×177; 336×165; 314×154px |
| INFERRED (confidence HIGH) | P01-S06 | `PanelContainer > VBox(RankVisualRow×5)` | each visual row `grid:26px 80px 1fr 24px` | h100/100/104px |
| INFERRED (confidence HIGH) | P01-S07 | `AspectRatioContainer > TextureRect + OfferCard` | `position:relative;aspect-ratio:414/549` | full width 414/390/360px |
| INFERRED (confidence HIGH) | P01-S08 | `VBox(ChipScroll, CardScroll, MoreButton)` | horizontal grid auto-flow column | card 268/268/248px; gap16 |
| INFERRED (confidence HIGH) | P01-S09 | `PanelContainer > GridContainer(5)` | `position:fixed;grid-template-columns:repeat(5,1fr)` | h78 + safe inset; w app |
| INFERRED (confidence HIGH) | P02-S01 | `HBox(Back, Spacer, Cart, Home)` | flex | h62; icons 44 target |
| INFERRED (confidence HIGH) | P02-S02 | `PanelContainer > CenterContainer > TextureRect` | square grid place-items center | 368/342/320px square |
| INFERRED (confidence HIGH) | P02-S03 | `VBox(Badge, Title, Price)` | block | h144 min; title max 2 lines |
| INFERRED (confidence HIGH) | P02-S04 | `HBox(StoreIcon, StoreText, Spacer, Change)` | flex; min-width:0 | h58; text flex1 |
| INFERRED (confidence HIGH) | P02-S05 | `VBox(QuantityRow, ActionGrid)` | sticky grid | h142; columns 54/1fr/1fr |
| INFERRED (confidence HIGH) | P03-S01 | `OptionGroup > VBox(Heading, RadioRow×3)` | fieldset block | px28/24/20; row min44 |
| INFERRED (confidence HIGH) | P03-S02 | `OptionGroup > VBox(Heading, RadioRow×3)` | fieldset block, overflow-y auto | sheet max 80dvh |
| INFERRED (confidence HIGH) | P04-S01 | `VBox(Title, HBox(Thumb, RecipeText))` | block + 100px/1fr grid | p28; 360 p20 |
| INFERRED (confidence HIGH) | P04-S02 | `LineEdit` | width 100%; height68px | 356/326/308px |
| INFERRED (confidence HIGH) | P04-S03 | `GridContainer(Cancel, Save)` | repeat(2,1fr), gap10 | button h68/60/60px |
| INFERRED (confidence HIGH) | P05-S01 | `HBox(Back, LineEdit+Search, Home)` | grid 44px 1fr 44px | h75; gap4–8 |
| INFERRED (confidence HIGH) | P05-S02 | `TabBar` | grid repeat(2,1fr) | h50; 368/342/320px |
| INFERRED (confidence HIGH) | P05-S03 | `Label(ResultCount)` | block | h57; center-y |
| INFERRED (confidence HIGH) | P05-S04 | `VBox(StoreRow×N)` | list, each grid 80px 1fr 44px | row 115/118/120px |
| INFERRED (confidence HIGH) | P06-S01 | `VBox(HBox header, StoreContext)` | sticky block | h116; store row h54 |
| INFERRED (confidence HIGH) | P06-S02 | `Panel > VBox(Heading, ItemGrid, DlRows)` | block/grid | p22/20; min h324 |
| INFERRED (confidence HIGH) | P06-S03 | `Panel > VBox(Label, LineEdit)` | block | h172; input h54 |
| INFERRED (confidence HIGH) | P06-S04 | `Panel > HBox(Label, Spacer, Select)` | flex | h106; target44 |
| INFERRED (confidence HIGH) | P06-S05 | `Panel > PrimaryButton` | sticky bottom | h105; button h62 |

### 7.2 CSS-Ready Geometry Sketches

- INFERRED (confidence HIGH) 다음 스케치는 DOM 구현 시 app-width, rail, sticky action의 단일 수치 원본으로 사용한다.

```css
/* INFERRED, confidence HIGH: prepared 414px app geometry를 런타임에 보존한다. */
.app-shell {
  width: min(414px, 100vw);
  min-height: 100dvh;
  margin-inline: auto;
  background: var(--color-surface);
  box-shadow: var(--shadow-app);
  overflow-x: clip;
}
.inner {
  width: auto;
  margin-inline: var(--gutter-app);
}
.horizontal-rail {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: var(--rail-card-width);
  gap: var(--space-4);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.horizontal-rail > * { scroll-snap-align: start; }
.sticky-action {
  position: sticky;
  bottom: 0;
  z-index: var(--z-bottom-nav);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
@media (max-width: 374px) {
  :root { --gutter-app: 20px; --rail-card-width: 248px; }
}
```

- INFERRED (confidence HIGH) Godot root는 viewport resize 때 `app_width=min(viewport_width,414)`를 계산하고 `custom_minimum_size.x=app_width`로 설정한다.
- INFERRED (confidence HIGH) Godot `ScrollContainer`의 horizontal scrollbar는 숨기되 drag_deadzone 8px, wheel shift-horizontal을 유지한다.
- INFERRED (confidence HIGH) 고정 format 요소는 hero `292:357`, product media `1:1`, promo `414:549`, 추천 이미지 `268:260` aspect ratio로 잡아 이미지 로딩 전후 layout shift를 0으로 만든다.
- INFERRED (confidence HIGH) 모든 VBox는 `size_flags_horizontal=EXPAND_FILL`, 텍스트가 있는 HBox 자식은 `clip_text=true`가 아니라 `autowrap_mode=WORD_SMART` 또는 명시 ellipsis를 쓴다.
- INFERRED (confidence HIGH) P-01 bottom nav와 P-06 payment bar가 scroll content를 가리지 않도록 각각 content bottom padding 96px와 125px를 둔다.
- INFERRED (confidence HIGH) P-03/P-04 overlay의 sheet/dialog는 `z-index:910`, header/bottom nav보다 높고 toast보다 낮다.
- INFERRED (confidence MEDIUM) 카드 그림자는 콜라주 표현용 외곽 app shadow와 분리하며 내부 section에는 `0 1px 2px rgba(0,0,0,.06)`만 사용한다.

### 7.3 Repeated Item Rules

| 근거 | 반복군 | count/row | item size | minmax/gap | media | text limit | incomplete row |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OBSERVED (confidence HIGH) | P01 hero | 1 center + 2 peek | 292×357px | fixed, gap34 | cover 292:357 | title 2 lines | horizontal centered |
| OBSERVED (confidence HIGH) | P01 shortcuts | 4/row | 78×72px approx | repeat(4,1fr), gap8 | icon 28×28 | 1 line | left-to-right |
| OBSERVED (confidence HIGH) | P01 ranking | 2 rank entries/visual row | row 100px | 26/80/1fr/24 tracks | 80×80 contain | title 1 line | 10 items required |
| OBSERVED (confidence HIGH) | P01 recommendations | 1.35 cards visible | 268×405px approx | auto-columns 268, gap16 | 268×260 contain | title1/body2/meta1 | start aligned |
| OBSERVED (confidence HIGH) | P03 options | 1/row | min 44px | full width, gap18 | radio 24 | label 2 lines max | top aligned |
| OBSERVED (confidence HIGH) | P05 stores | 1/row, 5 visible | 368×115px | full width, gap0 | 80×80 cover | name1/meta1/address2 | vertical start |
| OBSERVED (confidence HIGH) | P06 price rows | 1/row | 22px | grid 1fr auto, gap8 | none | label1/value1 | no orphan issue |

## 8. Component Abstraction

### 8.1 Component Tree

- INFERRED (confidence HIGH) `AppShell` owns backdrop, max-width, route outlet, global overlay host, toast host, and shared theme.
- INFERRED (confidence HIGH) `AppShell > HomePage(P-01) > HomeHeader(P01-S01) + HomeScroll(P01-S02..S08) + BottomNav(P01-S09)`.
- INFERRED (confidence HIGH) `AppShell > ProductDetailPage(P-02) > DetailHeader + ProductMedia + ProductInfo + StoreSelector + PurchaseBar`.
- INFERRED (confidence HIGH) `AppShell > OptionPage(P-03) > OptionSheet > OptionGroup×2 + optional ConfirmBar`.
- INFERRED (confidence HIGH) `AppShell > ModalHost > SavedMenuDialog(P-04)`.
- INFERRED (confidence HIGH) `AppShell > StoreSearchPage(P-05) > SearchHeader + StoreTabs + ResultSummary + StoreList`.
- INFERRED (confidence HIGH) `AppShell > CheckoutPage(P-06) > CheckoutHeader + OrderSummary + RequestField + CouponSelector + PaymentBar`.
- INFERRED (confidence HIGH) shared leaf components are `IconButton`, `PrimaryButton`, `SecondaryButton`, `Price`, `MenuThumbnail`, `StoreContext`, `LoadingSkeleton`, `InlineError`, `EmptyState`, `Toast`.

### 8.2 Component Contracts

| 근거 | component / mapping | responsibility | props/types | variants/slots | state/events/data | loading/empty/error/disabled/a11y |
| --- | --- | --- | --- | --- | --- | --- |
| INFERRED (confidence HIGH) | AppShell / all | route와 overlay 조합 | `route:Route`, `locale:string` | `home/detail/search/checkout` | viewport, history | global error boundary, skip link |
| INFERRED (confidence HIGH) | AppHeader / S01 | top chrome | `title?:string`, `showBack:boolean`, `actions:Action[]` | `blue-home`, `white`, `search` | emits `back`, `home`, action | buttons 44px, aria-label 필수 |
| INFERRED (confidence HIGH) | BottomNav / P01-S09 | 5개 primary action | `items:NavItem[]`, `activeId:string` | center-emphasis | emits `navigate` | disabled opacity .55, nav landmark |
| INFERRED (confidence HIGH) | HeroCarousel / P01-S02 | 캠페인 rail | `slides:HeroSlide[]`, `index:number` | `peek` | drag/indexChange | skeleton same ratio, empty collapse, labelled region |
| INFERRED (confidence HIGH) | MembershipSummary / P01-S03 | 등급/진행률 | `tier`, `current`, `target` | tier color slot | progress computed | unknown user state shows sign-in CTA |
| INFERRED (confidence HIGH) | ShortcutGrid / P01-S03 | 4 quick links | `items:Shortcut[4]` | icon color | navigate | missing target disabled, list semantics |
| INFERRED (confidence HIGH) | RecentOrderRail / P01-S04 | 재주문 메뉴 | `orders:OrderSummary[]` | compact | favorite/reorder | skeleton, empty CTA, error retry |
| INFERRED (confidence HIGH) | EventPanel / P01-S05 | 기간/mission | `event:Event` | `mission` | opens details | expired disabled, date accessible text |
| INFERRED (confidence HIGH) | RankingList / P01-S06 | 1–10 인기 순위 | `items:Menu[10]` | medal rank 1–3 | select menu | 10 skeleton rows, ordered-list semantics |
| INFERRED (confidence HIGH) | SeasonalPromo / P01-S07 | 비주얼+offer | `campaign`, `offer` | `brown-cream` replaceable | select offer | art alt empty, offer link named |
| INFERRED (confidence HIGH) | RecommendationRail / P01-S08 | filter + product rail | `filters`, `items` | selected chip | filter/select/more | empty per filter, chip tab semantics |
| INFERRED (confidence HIGH) | ProductMedia / P02-S02 | menu visual | `src`, `alt`, `focalPoint` | `contain` | image loaded/error | placeholder, fallback plate icon |
| INFERRED (confidence HIGH) | ProductInfo / P02-S03 | badge/title/base price | `menu:Menu` | new/sold-out | none | missing price error, h1 title |
| INFERRED (confidence HIGH) | StoreSelector / P02-S04,P06-S01 | active store | `store?:Store`, `mode` | compact/full | emits `change` | empty requires select, button label includes store |
| INFERRED (confidence HIGH) | QuantityStepper / P02-S05 | 1..stock 수량 | `value,min,max` | compact | increment/decrement/change | bounds disabled, live value text |
| INFERRED (confidence HIGH) | PurchaseBar / P02-S05 | 합계/행동 | `unitPrice,quantity,status` | detail | favorite/cart/order | loading lock, unavailable disabled |
| INFERRED (confidence HIGH) | OptionGroup / P03 | 단일 옵션군 | `legend,options,value,required,max` | price-right | emits change | validation error, fieldset/radio |
| INFERRED (confidence HIGH) | SavedMenuDialog / P04 | 조합 이름 저장 | `recipe,open,initialName?` | modal | input/cancel/submit | save loading/error, focus trap |
| INFERRED (confidence HIGH) | SearchField / P05-S01 | 매장 query 입력 | `value,placeholder` | header | input/submit/clear | no-result state, search role |
| INFERRED (confidence HIGH) | StoreTabs / P05-S02 | nearby/favorite mode | `value:'nearby'|'favorite'` | two-tab | tabChange | empty favorite, tab semantics |
| INFERRED (confidence HIGH) | StoreList / P05-S04 | 매장 결과 | `stores:Store[]` | selectable | select/favorite | skeleton/empty/error, listbox optional |
| INFERRED (confidence HIGH) | StoreRow / P05-S04 | 매장 요약 | `store,selected?` | default | activate/favorite | closed disabled order, star label |
| INFERRED (confidence HIGH) | OrderSummary / P06-S02 | item/가격 breakdown | `cart:Cart` | readonly | none | invalid item error, dl markup |
| INFERRED (confidence HIGH) | RequestField / P06-S03 | 요청사항 | `value,maxLength=100` | single-line | input/blur | counter optional, label association |
| INFERRED (confidence HIGH) | CouponSelector / P06-S04 | coupon 선택 | `coupon?:Coupon`, `eligible` | row | open/select/remove | ineligible disabled, dialog relation |
| INFERRED (confidence HIGH) | PaymentBar / P06-S05 | 최종 submit | `amount,status` | sticky | emits pay | loading/error/success, duplicate guard |

### 8.3 State Ownership

- INFERRED (confidence HIGH) route state는 app router, 서버 entity cache는 repository/autoload, P-02 수량과 P-03 option draft는 `OrderDraftStore`가 소유한다.
- INFERRED (confidence HIGH) P-04 input과 P-05 search query는 component local state이며 submit/tab 변경 때 URL 또는 store에 동기화한다.
- INFERRED (confidence HIGH) favorite와 cart는 shared session state, focus index와 hover는 local UI state다.
- INFERRED (confidence HIGH) request/coupon/pay status는 checkout page state이며 결제 시작 후 draft를 immutable snapshot으로 잠근다.
- INFERRED (confidence HIGH) 모든 async component는 `idle|loading|success|empty|error` 상태를 명시적으로 갖고 이전 성공 데이터를 loading 중 유지할지 component contract로 결정한다.

## 9. Design Tokens and Exact Color Specification

### 9.1 Color Tokens

| 근거 | token | HEX | RGB | HSL | alpha | role/usage | evidence source | confidence | tolerance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MEASURED sample / INFERRED token | `--color-surface` | `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)` | 1 | 모든 panel | E-01 palette 57.96%, E-02 55.74%, E-03 71.45% | HIGH | deltaE≤2 |
| MEASURED sample / INFERRED token | `--color-canvas` | `#F1F1F1` | `rgb(241, 241, 241)` | `hsl(0, 0%, 94.5%)` | 1 | app 외부/section gap | E-01 (590,600) pixel sample | HIGH | deltaE≤3 |
| MEASURED sample / INFERRED token | `--color-surface-muted` | `#EEEEEE` | `rgb(238, 238, 238)` | `hsl(0, 0%, 93.3%)` | 1 | separator/background | E-01 palette 21.04%, E-02 21.2%, E-03 18.99% | HIGH | deltaE≤3 |
| MEASURED sample / INFERRED token | `--color-media` | `#F5F5F5` | `rgb(245, 245, 245)` | `hsl(0, 0%, 96.1%)` | 1 | product image well | E-01 (800,300) pixel sample | HIGH | deltaE≤3 |
| MEASURED sample / INFERRED token | `--color-border` | `#DDDDDD` | `rgb(221, 221, 221)` | `hsl(0, 0%, 86.7%)` | 1 | input/divider | supplied palettes 4.45–5.88% | HIGH | deltaE≤3 |
| MEASURED sample / INFERRED token | `--color-border-strong` | `#CCCCCC` | `rgb(204, 204, 204)` | `hsl(0, 0%, 80%)` | 1 | selected tab/input | supplied palettes 0.65–0.99% | MEDIUM | deltaE≤3 |
| MEASURED sample / INFERRED token | `--color-disabled` | `#BBBBBB` | `rgb(187, 187, 187)` | `hsl(0, 0%, 73.3%)` | .55 UI opacity | disabled icon/text | supplied palettes 0.37–0.70% | MEDIUM | deltaE≤4 |
| INFERRED (confidence HIGH) | `--color-text` | `#111111` | `rgb(17, 17, 17)` | `hsl(0, 0%, 6.7%)` | 1 | headings/body | visible near-black | HIGH | deltaE≤3 |
| INFERRED (confidence HIGH) | `--color-text-secondary` | `#444444` | `rgb(68, 68, 68)` | `hsl(0, 0%, 26.7%)` | 1 | body/meta | E-02 chip dark vicinity | MEDIUM | deltaE≤4 |
| INFERRED (confidence HIGH) | `--color-text-muted` | `#777777` | `rgb(119, 119, 119)` | `hsl(0, 0%, 46.7%)` | 1 | dates/address | visible gray text | MEDIUM | deltaE≤4 |
| MEASURED sample / INFERRED token | `--color-primary` | `#012D76` | `rgb(1, 45, 118)` | `hsl(217.4, 98.3%, 23.3%)` | 1 | header/primary CTA | E-01 (300,165),(900,920) | HIGH | deltaE≤3 |
| MEASURED (confidence HIGH) | `--sample-primary-normalized` | `#003377` | `rgb(0, 51, 119)` | `hsl(214.3, 100%, 23.3%)` | 1 | comparison sample only | E-01 palette 1.37%, E-03 0.78% | HIGH | not CSS authority |
| MEASURED (confidence HIGH) | `--sample-primary-deep` | `#002277` | `rgb(0, 34, 119)` | `hsl(222.9, 100%, 23.3%)` | 1 | JPEG dark blue sample | E-01 0.89%, E-03 0.32% | HIGH | not CSS authority |
| MEASURED sample / INFERRED token | `--color-secondary` | `#223355` | `rgb(34, 51, 85)` | `hsl(220, 42.9%, 23.3%)` | 1 | event mission panel | E-01 palette 0.55% | MEDIUM | deltaE≤4 |
| MEASURED sample / INFERRED token | `--color-promo-brown` | `#774433` | `rgb(119, 68, 51)` | `hsl(15, 40%, 33.3%)` | 1 | seasonal promo upper | E-02 palette 3.07% | HIGH | deltaE≤3 |
| MEASURED sample / INFERRED token | `--color-promo-cream` | `#FFEECC` | `rgb(255, 238, 204)` | `hsl(40, 100%, 90%)` | 1 | seasonal promo lower | E-02 palette 2.11% | HIGH | deltaE≤3 |
| MEASURED (confidence HIGH) | `--sample-promo-deep` | `#774422` | `rgb(119, 68, 34)` | `hsl(24, 55.6%, 30%)` | 1 | photo/art sample only | E-02 palette 0.5% | HIGH | not CSS authority |
| MEASURED sample / INFERRED token | `--color-accent` | `#F13848` | `rgb(241, 56, 72)` | `hsl(354.8, 86.9%, 58.2%)` | 1 | favorite/discount | E-01 (684,909) sample | MEDIUM | deltaE≤4 |
| INFERRED (confidence MEDIUM) | `--color-warning` | `#B75C00` | `rgb(183, 92, 0)` | `hsl(30.2, 100%, 35.9%)` | 1 | 경고 | evidence에 명시 경고 없음 | LOW | WCAG contrast 우선 |
| INFERRED (confidence HIGH) | `--color-success` | `#138A52` | `rgb(19, 138, 82)` | `hsl(151.8, 75.8%, 30.8%)` | 1 | save/payment success | 증거 밖 상태 | MEDIUM | WCAG contrast 우선 |
| INFERRED (confidence HIGH) | `--color-danger` | `#C62828` | `rgb(198, 40, 40)` | `hsl(0, 66.4%, 46.7%)` | 1 | form/payment error | 증거 밖 상태 | MEDIUM | WCAG contrast 우선 |
| INFERRED (confidence HIGH) | `--color-focus` | `#4C9FFE` | `rgb(76, 159, 254)` | `hsl(212, 98.9%, 64.7%)` | 1 | focus ring | accessibility decision | HIGH | contrast≥3:1 |
| INFERRED (confidence HIGH) | `--color-hover` | `#EAF2FF` | `rgb(234, 242, 255)` | `hsl(217.1, 100%, 95.9%)` | 1 | light hover fill | primary-derived | MEDIUM | deltaE≤4 |
| INFERRED (confidence HIGH) | `--color-pressed` | `#002277` | `rgb(0, 34, 119)` | `hsl(222.9, 100%, 23.3%)` | 1 | primary pressed | measured deep sample reused | MEDIUM | deltaE≤4 |
| INFERRED (confidence HIGH) | `--color-overlay` | `#000000` | `rgb(0, 0, 0)` | `hsl(0, 0%, 0%)` | .45 | modal backdrop | screenshot-invisible | MEDIUM | alpha±.05 |

### 9.2 CSS Custom Properties

- INFERRED (confidence HIGH) 아래 블록은 표의 제안 토큰을 그대로 구현하는 CSS source-of-truth이며 Godot Theme resource에도 같은 이름으로 매핑한다.

```css
/* INFERRED, confidence HIGH */
:root {
  --color-surface: #fff;
  --color-canvas: #f1f1f1;
  --color-surface-muted: #eee;
  --color-media: #f5f5f5;
  --color-border: #ddd;
  --color-border-strong: #ccc;
  --color-text: #111;
  --color-text-secondary: #444;
  --color-text-muted: #777;
  --color-primary: #012d76;
  --color-primary-pressed: #002277;
  --color-secondary: #223355;
  --color-accent: #f13848;
  --color-success: #138a52;
  --color-warning: #b75c00;
  --color-danger: #c62828;
  --color-focus: #4c9ffe;
  --color-overlay: rgb(0 0 0 / 45%);
  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 28px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --app-max: 414px;
  --gutter-app: 24px;
  --rail-card-width: 268px;
  --radius-control: 8px;
  --radius-media: 12px;
  --radius-section: 16px;
  --radius-shell: 20px;
  --border-1: 1px solid var(--color-border);
  --shadow-card: 0 1px 2px rgb(0 0 0 / 6%);
  --shadow-sticky: 0 -4px 14px rgb(0 0 0 / 10%);
  --shadow-app: 0 18px 36px rgb(0 0 0 / 16%);
  --opacity-disabled: .55;
  --z-base: 10;
  --z-header: 100;
  --z-bottom-nav: 110;
  --z-overlay: 900;
  --z-dialog: 910;
  --z-toast: 1000;
  --bp-narrow: 374px;
  --bp-app: 414px;
  --bp-tablet: 768px;
  --bp-desktop: 1024px;
  --motion-fast: 80ms;
  --motion-ui: 120ms;
  --motion-panel: 220ms;
  --ease-standard: cubic-bezier(.2,0,0,1);
}
```

### 9.3 Non-Color Tokens and Exceptions

| 근거 | token family | exact values | usage |
| --- | --- | --- | --- |
| INFERRED (confidence HIGH) | spacing scale | 0,4,8,12,16,20,24,28,32,40,48px | 모든 gap/padding |
| MEASURED (confidence MEDIUM) | spacing exception | hero card gap 34px | P01-S02 slide peeks |
| MEASURED (confidence MEDIUM) | spacing exception | app shell horizontal 26px left | P01-S01 logo optical align |
| MEASURED (confidence MEDIUM) | dimension | header 62px, search header 75px, bottom nav 78px | chrome |
| MEASURED (confidence MEDIUM) | icon | 20,22,24,28px visual; 44px target | chrome/shortcut |
| INFERRED (confidence HIGH) | radii | 4,6,8,10,12,16,20px | input→shell |
| INFERRED (confidence MEDIUM) | shadow | card, sticky, app values in root | depth |
| INFERRED (confidence HIGH) | breakpoints | 374,414,768,1024px | gutter/app mode |
| INFERRED (confidence HIGH) | motion | 80,120,220ms | pressed/hover/panel |
| INFERRED (confidence HIGH) | opacity | disabled .55, hover bg .12 derived, overlay .45 | states |

## 10. Typography Matrix

- INFERRED (confidence HIGH) family는 `Pretendard Variable, Noto Sans KR, Apple SD Gothic Neo, sans-serif`; 자체 호스팅 WOFF2 우선, 실패 시 system fallback이다.
- UNKNOWN (confidence HIGH) 원본 폰트 파일과 정확한 weight axis는 이미지로 확정할 수 없다.

| 근거 | text role | size px/rem | weight | line-height px/unitless | letter spacing | case/decor | align/max width | wrap/truncate | 360 responsive |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| INFERRED (confidence HIGH) | utility/meta | 12/.75 | 400 | 18/1.5 | 0 | none | start/100% | 1–2 lines | 12px |
| INFERRED (confidence HIGH) | bottom nav label | 11/.6875 | 500 | 16/1.45 | 0 | none | center/72px | 1 line | 10px |
| INFERRED (confidence HIGH) | navigation/title | 18/1.125 | 600 | 26/1.44 | 0 | none | center/240px | 1 line ellipsis | 17px |
| INFERRED (confidence HIGH) | hero eyebrow | 13/.8125 | 600 | 20/1.54 | 0 | none | center/260px | 1 line | 12px |
| INFERRED (confidence HIGH) | hero title | 30/1.875 | 800 | 38/1.27 | 0 | none | center/260px | 2 lines | 27px |
| INFERRED (confidence HIGH) | hero body | 14/.875 | 500 | 22/1.57 | 0 | none | center/260px | 2 lines | 13px |
| INFERRED (confidence HIGH) | page h1 product | 28/1.75 | 700 | 36/1.29 | 0 | none | start/368px | 2 lines | 25px |
| INFERRED (confidence HIGH) | section h2 | 22/1.375 | 700 | 30/1.36 | 0 | none | start/366px | 2 lines | 20px |
| INFERRED (confidence HIGH) | card h3 | 18/1.125 | 600 | 26/1.44 | 0 | none | start/flex | 1–2 lines | 17px |
| INFERRED (confidence HIGH) | body | 15/.9375 | 400 | 23/1.53 | 0 | none | start/100% | normal | 14px |
| INFERRED (confidence HIGH) | card body | 14/.875 | 400 | 22/1.57 | 0 | none | start/100% | clamp 2 | 13px |
| INFERRED (confidence HIGH) | price major | 28/1.75 | 700 | 34/1.21 | 0 | none | start/100% | no wrap | 25px |
| INFERRED (confidence HIGH) | price row | 16/1 | 600 | 24/1.5 | 0 | none | end/auto | no wrap | 15px |
| INFERRED (confidence HIGH) | control/button | 18/1.125 | 600 | 24/1.33 | 0 | none | center/100% | 1 line, dynamic min 15px | 16px |
| INFERRED (confidence HIGH) | chip | 14/.875 | 500 | 20/1.43 | 0 | none | center/auto | 1 line | 13px |
| INFERRED (confidence HIGH) | form label | 17/1.0625 | 600 | 24/1.41 | 0 | none | start/100% | 1 line | 16px |
| INFERRED (confidence HIGH) | form input | 17/1.0625 | 400 | 24/1.41 | 0 | none | start/100% | single-line caret scroll | 16px |
| INFERRED (confidence HIGH) | form error | 13/.8125 | 500 | 19/1.46 | 0 | none | start/100% | 2 lines | 13px |
| INFERRED (confidence HIGH) | footer/support | 12/.75 | 400 | 18/1.5 | 0 | none | start/100% | normal | 12px |

## 11. Asset and Icon Manifest

| 근거 | asset ID | page/section role | evidence crop | display/source ratio | crop/focal/object | responsive | priority/format | alt/replacement |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OBSERVED (confidence HIGH) | A-LOGO-01 | P01-S01 logo | E-01 rel x26 y22 w122 h24 | 122×24 / 5.08:1 | contain, center | 고정 122px; 360 112px | eager SVG | 원 로고 금지; Cafe Quest wordmark, alt 제품명 |
| OBSERVED (confidence HIGH) | A-HERO-N | P01-S02 campaign photos | E-01 rel x66 y38 w292 h357 | 292×357 / .818 | cover, focal 50/48 | 292→248px | first eager, rest lazy AVIF/WebP | 정보 문구는 DOM; 장식 alt empty |
| OBSERVED (confidence HIGH) | A-SHORTCUT-N | P01-S03 colored icons | E-01 y790–824 | 28×28 / 1:1 | contain | fixed 28px | SVG/icon font | action name label로 대체 |
| OBSERVED (confidence HIGH) | A-MENU-THUMB-N | P01/P02/P03/P06 | 다수 52–100px crop | source 1:1 | contain, center | display 52/80/100px | lazy WebP except LCP | alt 메뉴명 또는 반복 시 empty |
| OBSERVED (confidence HIGH) | A-EVENT-01 | P01-S05 mission graphic | E-01 x164 y1247 w360 h177 | 360×177 / 2.03 | cover | fluid 100% | lazy WebP | 핵심 수치는 DOM, art alt empty |
| OBSERVED (confidence HIGH) | A-PROMO-01 | P01-S07 pastry art | E-02 full y2182–2730 | 414×549 / .754 | cover, focal center | width 100% | lazy AVIF/WebP | 원 캐릭터 교체, 장식 alt empty |
| OBSERVED (confidence HIGH) | A-REC-N | P01-S08 food cards | E-02/E-03 268×260 | source 1.03:1 | contain on `#F5F5F5` | 268→248px | lazy WebP | 상품명 alt |
| OBSERVED (confidence HIGH) | A-PRODUCT-01 | P02-S02 main product | E-01 x657 y218 w368 h368 | source 1:1 | contain with 44px inset | 368→320px | eager WebP, LCP | 상품명 alt |
| OBSERVED (confidence HIGH) | A-STORE-N | P05-S04 storefront photo | E-02 rows 80×80 | source 1:1 recommended | cover, focal center | 80px fixed | lazy WebP | `매장명 외관` |
| OBSERVED (confidence HIGH) | I-BACK | headers | 24×24 | 1:1 | Lucide `ChevronLeft`, stroke 2 | visual 24/target44 | bundled SVG | aria-label 뒤로 |
| OBSERVED (confidence HIGH) | I-CART | P01/P02 header/action | 24×24 | 1:1 | Lucide `ShoppingCart`, stroke 2 | fixed | bundled SVG | aria-label 장바구니 |
| OBSERVED (confidence HIGH) | I-HOME | P02/P05/P06 | 24×24 | 1:1 | Lucide `House`, fill currentColor 가능 | fixed | bundled SVG | aria-label 홈 |
| OBSERVED (confidence HIGH) | I-BELL | P01 header | 24×24 | 1:1 | Lucide `Bell`, fill white 가능 | fixed | bundled SVG | aria-label 알림 |
| OBSERVED (confidence HIGH) | I-SEARCH | P05-S01 | 22×22 | 1:1 | Lucide `Search`, stroke 2 | fixed | bundled SVG | submit name 검색 |
| OBSERVED (confidence HIGH) | I-HEART | favorite | 24×24 | 1:1 | Lucide `Heart`, selected fill accent | target44–54 | bundled SVG | pressed state announce |
| OBSERVED (confidence MEDIUM) | I-STAR | P05 rows | 22×22 | 1:1 | Lucide `Star`, selected fill `#FFD54F` | target44 | bundled SVG | 단골 추가/해제 label |
| UNKNOWN (confidence HIGH) | video/audio/chart | 보이지 않음 | none | 0×0 | 미구현 | n/a | n/a | n/a |

- INFERRED (confidence HIGH) 외부 사진은 EXIF를 제거하고 AVIF quality 55 또는 WebP quality 75로 제공하며 1x/2x srcset을 둔다.
- INFERRED (confidence HIGH) 위 아이콘은 Godot에서 동일 SVG를 `Texture2D`로 import하고 색상 state는 theme/icon modulate로 적용한다.
- INFERRED (confidence HIGH) LCP 후보는 P-01 첫 hero 또는 P-02 product media이며 2x source를 preload하고 나머지는 viewport 300px 전부터 lazy load한다.

## 12. Responsive Behavior Matrix

- UNKNOWN (confidence HIGH) 첨부에는 별도 모바일/태블릿 캡처가 없으며 아래 폭별 변환은 prepared 414px 화면을 보존하기 위한 구현 결정이다.

### 12.1 Shared Shell Matrix

| 근거 | metric | 1440 | 1280 | 1024 | 768 | 390 | 360 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| INFERRED (confidence HIGH) | app width | 414px | 414px | 414px | 414px | 390px | 360px |
| INFERRED (confidence HIGH) | outer gutter each | 513px | 433px | 305px | 177px | 0px | 0px |
| INFERRED (confidence HIGH) | inner gutter | 24px | 24px | 24px | 24px | 24px | 20px |
| INFERRED (confidence HIGH) | content width | 366px | 366px | 366px | 366px | 342px | 320px |
| INFERRED (confidence HIGH) | navigation mode | app top+bottom | app top+bottom | app top+bottom | app top+bottom | full mobile | full mobile |
| INFERRED (confidence HIGH) | panel radius | 20px | 20px | 20px | 20px | 0px page/20px modal | 0px page/20px modal |
| INFERRED (confidence HIGH) | app shadow | on | on | on | on | off | off |
| INFERRED (confidence HIGH) | touch target | 44px | 44px | 44px | 44px | 44px | 44px |
| INFERRED (confidence HIGH) | header type | 18px | 18px | 18px | 18px | 18px | 17px |

### 12.2 Page/Major Component Matrix

| 근거 | page/component metric | 1440 | 1280 | 1024 | 768 | 390 | 360 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| INFERRED (confidence HIGH) | P-01 hero card w | 292px | 292px | 292px | 292px | 276px | 248px |
| INFERRED (confidence HIGH) | P-01 shortcuts | 4 cols | 4 | 4 | 4 | 4 | 4, label 10px |
| INFERRED (confidence HIGH) | P-01 ranking visual | 2 ranks/row | 2 | 2 | 2 | 2 | 2; title max 104px |
| INFERRED (confidence HIGH) | P-01 rec card/image | 268/260px | same | same | same | 268/260px | 248/240px |
| INFERRED (confidence HIGH) | P-01 bottom nav | fixed 414px | fixed | fixed | fixed | fixed 390px | fixed 360px |
| INFERRED (confidence HIGH) | P-02 media | 368×368px | same | same | same | 342×342px | 320×320px |
| INFERRED (confidence HIGH) | P-02 actions | 54/150/148px | same | same | same | 54/138/134px | 54/121/121px |
| INFERRED (confidence HIGH) | P-03 sheet width | 414px | 414px | 414px | 414px | 390px | 360px |
| INFERRED (confidence HIGH) | P-03 group padding | 28px | 28px | 28px | 28px | 24px | 20px |
| INFERRED (confidence HIGH) | P-04 dialog width | 414px | 414px | 414px | 414px | 366px | 336px |
| INFERRED (confidence HIGH) | P-04 action columns | 2 | 2 | 2 | 2 | 2 | 2; h60px |
| INFERRED (confidence HIGH) | P-05 store image/row | 80/115px | same | same | same | 80/118px | 72/120px |
| INFERRED (confidence HIGH) | P-05 address | max 2 lines | same | same | same | 2 | 2, 12px |
| INFERRED (confidence HIGH) | P-06 summary columns | thumb80 + flex | same | same | same | thumb76 | thumb72 |
| INFERRED (confidence HIGH) | P-06 CTA | 368×62px | same | same | same | 342×62px | 320×58px |
| INFERRED (confidence HIGH) | P-06 section gap | 8px | 8px | 8px | 8px | 8px | 8px |

### 12.3 Breakpoint Behavior

- INFERRED (confidence HIGH) `>414px`는 centered app mode로 폭을 더 늘리지 않아 reference density와 line length를 보존한다.
- INFERRED (confidence HIGH) `≤414px`는 shell radius/shadow를 제거하고 viewport edge까지 확장한다.
- INFERRED (confidence HIGH) `≤374px`는 gutter를 20px로 줄이고 rail card·media·button 폭을 표 값으로 축소하되 column 수는 바꾸지 않는다.
- INFERRED (confidence HIGH) 768/1024는 tablet/desktop이지만 2-column page 전환을 하지 않는다; 증거가 app-like single-column이기 때문이다.
- INFERRED (confidence HIGH) landscape 높이 480px 이하에서는 sticky header를 해제하고 P-03/P-04를 최대 100dvh scroll dialog로 바꾼다.
- INFERRED (confidence HIGH) 200% zoom 또는 320 CSS px reflow에서 horizontal scroll은 의도된 rail 내부만 허용하고 body overflow-x는 0px여야 한다.

## 13. Interaction and Motion State Matrix

| 근거 | target/state | trigger | exact visual delta | duration/easing | keyboard/focus | reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| INFERRED (confidence HIGH) | text/icon link hover | pointer enter | color primary, bg hover, radius8 | 120ms standard | focus ring 별도 | 0ms color change |
| INFERRED (confidence HIGH) | primary button hover | pointer enter | bg `#003377` | 120ms standard | Enter/Space activate | 0ms |
| INFERRED (confidence HIGH) | primary pressed | pointer/key down | bg `#002277`, scale .98 | 80ms ease-out | Space keyup activate | scale 제거 |
| INFERRED (confidence HIGH) | focus-visible | keyboard focus | 2px `#4C9FFE`, offset2 | 0ms | DOM/scene 순서 유지 | 동일 |
| INFERRED (confidence HIGH) | disabled | business rule | opacity .55, no shadow | 0ms | tab 제외, reason text | 동일 |
| INFERRED (confidence MEDIUM) | hero drag | touch/pointer swipe >8px | translateX + snap | 220ms standard | arrow changes slide | 즉시 snap |
| UNKNOWN (confidence HIGH) | hero autoplay | timer | 증거 없음; 미구현 | n/a | n/a | n/a |
| INFERRED (confidence HIGH) | chip selected | click/Enter/Space | bg `#444`, text white | 120ms | aria-selected true | 0ms |
| INFERRED (confidence HIGH) | radio selected | row activate | circle primary + white check | 120ms | arrows within group | 0ms |
| INFERRED (confidence HIGH) | favorite selected | toggle | heart/star fill accent/yellow | 120ms | pressed state announce | 0ms |
| INFERRED (confidence MEDIUM) | option sheet open | order CTA | translateY 24→0, opacity .96→1 | 220ms standard | focus close/first option | fade 0ms, no translate |
| INFERRED (confidence MEDIUM) | modal open | save command | overlay 0→.45, dialog scale .98→1 | 220ms standard | trap, Escape close | instant display |
| INFERRED (confidence HIGH) | modal close | cancel/Escape/outside | reverse | 160ms standard | restore invoker | instant hide |
| INFERRED (confidence HIGH) | quantity loading | add/cart/pay | 18px spinner, label stable | 600ms linear loop | control disabled | static progress glyph |
| INFERRED (confidence HIGH) | form error | blur/submit | border danger 2px, message | 0ms | focus first invalid | 동일 |
| INFERRED (confidence HIGH) | success toast | save/cart/pay success | bottom 24px, surface + success icon | 160ms in, 4s hold | polite live region | instant, 4s hold |
| UNKNOWN (confidence HIGH) | accordion/carousel dots | static evidence | accordion 없음; dots 일부 미확정 | n/a | n/a | n/a |

- INFERRED (confidence HIGH) 모든 navigation은 activation 후 route heading으로 focus를 이동하되 browser back은 이전 focus 대상 복원을 우선한다.
- INFERRED (confidence HIGH) drag 가능한 rail은 click threshold 8px를 넘으면 child card activation을 취소한다.
- INFERRED (confidence HIGH) 결제·저장 submit은 idempotency key를 사용하고 loading 동안 같은 action의 pointer/keyboard 입력을 차단한다.

## 14. Accessibility Contract

- INFERRED (confidence HIGH) 각 route는 `header`, `nav`(해당 시), `main`, `footer/action` landmark를 한 번씩 사용하고 P-04는 `role=dialog aria-modal=true`다.
- INFERRED (confidence HIGH) 모든 페이지 첫 heading은 h1 하나이며 P-01 section은 h2, 반복 카드 title은 h3; P-02 제품명이 h1, P-06 주문 확인이 h1이다.
- INFERRED (confidence HIGH) skip link는 app shell 첫 focusable element이며 focus 시 top 8px/left 8px, z1000, 2px focus ring으로 나타난다.
- INFERRED (confidence HIGH) focus 순서는 화면의 시각적 top-to-bottom/left-to-right 순서와 일치하고 sticky bar는 본문 뒤에 온다.
- INFERRED (confidence HIGH) focus ring은 `#4C9FFE` 2px + offset2px, 최소 3:1 인접 대비를 충족한다.
- INFERRED (confidence HIGH) 모든 icon-only button은 한국어 accessible name을 갖고 장식 icon은 `aria-hidden=true` 또는 Godot accessibility description 비움 처리한다.
- INFERRED (confidence HIGH) product/store 이미지는 구체적 alt를 갖고 hero/promo 장식은 빈 alt; 이미지 안의 필수 문구는 DOM/Label로 중복 제공한다.
- INFERRED (confidence HIGH) P-03 option은 `fieldset/legend/radio`, P-05 tabs는 `tablist/tab`, P-06 가격표는 `dl/dt/dd` 의미를 사용한다.
- INFERRED (confidence HIGH) P-04/P-06 error는 field와 `aria-describedby`로 연결하고 submit failure는 `role=alert`, 일반 상태는 `aria-live=polite`다.
- INFERRED (confidence HIGH) loading skeleton은 `aria-hidden=true`, 영역에는 `aria-busy=true`와 한 번의 상태 문구를 둔다.
- INFERRED (confidence HIGH) modal menu-button semantics 대신 dialog invoker가 `aria-haspopup=dialog`, `aria-expanded`, `aria-controls`를 가진다.
- UNKNOWN (confidence HIGH) 증거에 hamburger menu가 없으므로 menu button/focus containment 계약은 drawer에 적용하지 않고 P-04 dialog/P-03 sheet에 적용한다.
- INFERRED (confidence HIGH) P-03/P-04 open 시 focus를 내부로 이동하고 Tab을 순환, Escape로 닫고 invoker로 복원하며 background는 inert 처리한다.
- INFERRED (confidence HIGH) P-01 active page는 `aria-current=page`와 보이는 색상으로, 스크린리더 route 변경은 page title live announcement로 알린다.
- INFERRED (confidence HIGH) 일반 text 대비는 4.5:1, 24px 이상 또는 19px bold는 3:1, UI boundary/focus는 3:1을 목표로 한다.
- INFERRED (confidence HIGH) 최소 target은 44×44px, target 간 시각 gap은 4px 이상, inline text link는 예외로 둔다.
- INFERRED (confidence HIGH) `prefers-reduced-motion:reduce` 또는 Godot OS 접근성 설정에서 translate/scale을 제거하고 duration 0ms, progress spinner는 정적 label로 바꾼다.
- INFERRED (confidence HIGH) 200% zoom과 320px reflow에서 body horizontal overflow는 없어야 하고 text가 control 밖으로 잘리면 15px까지 단계 축소 후 wrap한다.

## 15. Data and Content Model

### 15.1 Entities

| 근거 | entity | fields and types | cardinality/order | optional/format/localization | states |
| --- | --- | --- | --- | --- | --- |
| INFERRED (confidence HIGH) | `Menu` | `id,title,description,base_price,image,badges,available` | page당 1 또는 list 0+; API order | description/badges optional; KRW integer | loading/empty/error/sold-out |
| INFERRED (confidence HIGH) | `HeroSlide` | `id,title,body,image,cta,target` | P-01 3+; editorial order | body/cta optional; ko-KR | loading/empty/error |
| INFERRED (confidence HIGH) | `Membership` | `tier,stamp_count,next_tier_at` | user당 0..1 | unauthenticated null | loading/signed-out/error |
| INFERRED (confidence HIGH) | `OrderSummary` | `id,menu,store,quantity,total,created_at` | recent 0+ newest first | store optional; datetime ko-KR | loading/empty/error |
| INFERRED (confidence HIGH) | `Event` | `id,title,start_at,end_at,mission_count,reward_count,image` | 0+ active first | date `YYYY.MM.DD` display | upcoming/active/expired |
| INFERRED (confidence HIGH) | `RankingItem` | `rank,menu_id,title,image,score?` | 정확히 10; rank asc | score hidden optional | loading/error |
| INFERRED (confidence HIGH) | `Campaign` | `id,title,body,art,offer` | P-01 0..1 | all copy replaceable | loading/hidden/expired |
| INFERRED (confidence HIGH) | `OptionGroup` | `id,label,required,max_select,options` | menu당 1+ ordered | max_select default1 | valid/invalid/unavailable |
| INFERRED (confidence HIGH) | `Option` | `id,label,price_delta,available` | group당 1+ | price delta signed KRW | selected/disabled |
| INFERRED (confidence HIGH) | `SavedRecipe` | `id,name,menu_id,option_ids` | user당 0+ | name 1..20 grapheme | saving/saved/duplicate/error |
| INFERRED (confidence HIGH) | `Store` | `id,name,distance_km,facilities,address,image,is_favorite,is_open` | search 0+ distance asc | image/distance optional | loading/empty/error/closed |
| INFERRED (confidence HIGH) | `CartItem` | `menu,options,quantity,unit_total` | cart 1+ | options 0+ | valid/price-changed/unavailable |
| INFERRED (confidence HIGH) | `Coupon` | `id,name,discount_type,value,eligible,expires_at` | 0..1 selected | expiry optional | none/selected/ineligible |
| INFERRED (confidence HIGH) | `CheckoutDraft` | `store,items,request,coupon,subtotal,discount,payable` | session당 1 | request/coupon optional | dirty/validating/ready/submitting/error/success |

### 15.2 Formatting and Content Rules

- INFERRED (confidence HIGH) 모든 가격은 정수 KRW로 저장하고 display는 `new Intl.NumberFormat('ko-KR').format(value)+'원'`; Godot에서는 locale-aware formatter adapter를 둔다.
- INFERRED (confidence HIGH) 거리는 10km 미만에서 소수점 한 자리 `2.4km`, 이상은 정수 또는 한 자리로 표시하며 source unit은 meter다.
- INFERRED (confidence HIGH) 날짜는 machine value ISO-8601, 보이는 이벤트 기간은 `2026.08.03 – 2026.09.01` 형식의 대체 fixture다.
- INFERRED (confidence HIGH) 메뉴 title 40, description 120, store name 60, address 120, request 100, saved recipe name 20 grapheme 제한을 둔다.
- OBSERVED (confidence HIGH) 증거의 원 브랜드 인사, 메뉴명, 매장명, 이벤트 문구는 구조 증거일 뿐 fixture로 복사하지 않는다.
- INFERRED (confidence HIGH) 대체 fixture 예시는 메뉴 `별빛 고구마 라떼`, 매장 `카페 퀘스트 중앙광장점`, 이벤트 `여름 탐험 미션`처럼 새 문구를 사용한다.
- INFERRED (confidence HIGH) 빈 상태 문구는 행동 가능한 다음 단계 한 개를 포함하고 error 문구는 원인 추정 대신 재시도/뒤로 가기 선택을 제공한다.

### 15.3 Sample Fixture Shapes

- INFERRED (confidence HIGH) 다음 fixture는 필드 구조 예시이며 evidence copy가 아니다.

```ts
// INFERRED, confidence HIGH
const menu: Menu = {
  id: "menu_sweet_potato_01",
  title: "별빛 고구마 라떼",
  description: "고구마와 오트 음료를 조합한 시즌 음료",
  base_price: 4400,
  image: "/assets/menu/sweet-potato.webp",
  badges: ["NEW"],
  available: true
};
const optionGroups: OptionGroup[] = [
  { id: "temp_size", label: "온도와 크기", required: true, max_select: 1,
    options: [
      { id: "hot", label: "HOT", price_delta: 0, available: true },
      { id: "ice", label: "ICE", price_delta: 0, available: true },
      { id: "ice_large", label: "ICE LARGE", price_delta: 2500, available: true }
    ] },
  { id: "milk", label: "음료 베이스", required: false, max_select: 1,
    options: [
      { id: "dairy", label: "우유", price_delta: 0, available: true },
      { id: "low_fat", label: "저지방 우유", price_delta: 500, available: true },
      { id: "soy", label: "두유", price_delta: 500, available: true }
    ] }
];
```

## 16. Frontend Architecture

- INFERRED (confidence HIGH) reconstruction requirement는 route/state/geometry/token 계약이며 Godot는 권장 구현체일 뿐 데이터 API와 콘텐츠 소스는 교체 가능해야 한다.
- INFERRED (confidence HIGH) Godot 4.x에서는 한 route를 한 `.tscn` page scene으로, reusable component를 독립 scene으로, theme/tokens를 `.tres`와 generated constants로 둔다.

```text
# INFERRED, confidence HIGH
res://
  app/app_shell.tscn
  app/router.gd
  pages/home/home_page.tscn
  pages/product/product_detail_page.tscn
  pages/product/option_page.tscn
  pages/stores/store_search_page.tscn
  pages/checkout/checkout_page.tscn
  components/navigation/app_header.tscn
  components/navigation/bottom_nav.tscn
  components/menu/menu_card.tscn
  components/menu/option_group.tscn
  components/store/store_row.tscn
  components/dialogs/saved_menu_dialog.tscn
  components/feedback/loading_skeleton.tscn
  theme/design_tokens.gd
  theme/cafe_quest_theme.tres
  data/models/
  data/repositories/
  state/order_draft_store.gd
  assets/brand/ assets/menu/ assets/store/ assets/icons/
  tests/visual/ tests/unit/ tests/accessibility/
```

- INFERRED (confidence HIGH) routes는 `Router`가 `/`, `/menu/:id`, `/menu/:id/options`, `/stores`, `/checkout`를 page scene으로 매핑하고 P-04는 `ModalHost` state로 연다.
- INFERRED (confidence HIGH) scene tree shell은 `Control > ColorRect(backdrop) > CenterContainer > PanelContainer(app) > RouteOutlet + OverlayLayer + ToastLayer`다.
- INFERRED (confidence HIGH) styling source는 `design_tokens.gd`와 `cafe_quest_theme.tres`; HTML wrapper가 필요하면 동일 값으로 생성한 `tokens.css`를 쓴다.
- INFERRED (confidence HIGH) assets는 brand/menu/store/icons로 분리하고 파일명에 원 브랜드 문자열을 넣지 않는다.
- INFERRED (confidence HIGH) repositories는 `MenuRepository`, `StoreRepository`, `OrderRepository`, `ProfileRepository`; scene은 interface만 의존하고 fixture/HTTP 구현을 교체한다.
- INFERRED (confidence HIGH) state ownership은 `OrderDraftStore` autoload만 cross-route, search query/modal input은 local, entity cache는 repository다.
- INFERRED (confidence HIGH) Web export의 server boundary는 JSON API이며 price validation/payment intent는 서버에서 수행하고 클라이언트 계산은 display preview로만 쓴다.
- INFERRED (confidence HIGH) third-party 책임은 Lucide SVG source, 이미지 codec, 선택적 localization formatter에 한정하고 carousel/router core는 Godot container와 작은 adapter로 구현한다.
- INFERRED (confidence HIGH) 테스트는 GUT 또는 프로젝트 표준 unit runner, Playwright Web export screenshot, axe 기반 DOM wrapper 검사 또는 동등한 accessibility bridge를 사용한다.
- UNKNOWN (confidence HIGH) 실제 호스팅, API protocol, analytics, authentication vendor는 계약 밖이다.

## 17. Implementation Task Graph

| 근거 | Task | depends on | inputs | outputs | affected IDs | completion criteria | parallel group |
| --- | --- | --- | --- | --- | --- | --- | --- |
| INFERRED (confidence HIGH) | T-01 evidence baseline | none | E-01..03, coordinate map | 414px overlay guides | all | canonical bounds annotated ±2px | A |
| INFERRED (confidence HIGH) | T-02 token source | T-01 | section/color tables | theme.tres, token constants/CSS | all | flat colors deltaE≤3 | B |
| INFERRED (confidence HIGH) | T-03 fixture/models | none | section 15 | typed models, fixtures | P-01..06 | all states serializable | A |
| INFERRED (confidence HIGH) | T-04 AppShell/router | T-02 | routes, shell geometry | shell scene, router | all | 6 routes/state reachable | C |
| INFERRED (confidence HIGH) | T-05 shared header | T-02,T-04 | section 5 | header variants | all S01 | h62/75/116 rules pass | D |
| INFERRED (confidence HIGH) | T-06 bottom nav | T-02,T-04 | P01-S09 | bottom nav scene | P01-S09 | 5 targets, safe inset, active | D |
| INFERRED (confidence HIGH) | T-07 P-01 upper | T-03,T-04,T-05 | P01-S02..S06 | home upper scene | P01-S02..06 | y rhythm ±4px | E |
| INFERRED (confidence HIGH) | T-08 P-01 lower | T-03,T-04,T-06 | P01-S07..S09 | home lower scene | P01-S07..09 | rail/nav no overlap | E |
| INFERRED (confidence HIGH) | T-09 P-02 detail | T-03,T-04,T-05 | P02 spec | detail scene | P02-S01..05 | media/action exact | E |
| INFERRED (confidence HIGH) | T-10 P-03 options | T-03,T-04,T-05 | P03 spec | sheet/route | P03-S01..02 | radio/price/scroll pass | F |
| INFERRED (confidence HIGH) | T-11 P-04 dialog | T-03,T-04 | P04 spec | modal scene | P04-S01..03 | focus trap/save states pass | F |
| INFERRED (confidence HIGH) | T-12 P-05 stores | T-03,T-04,T-05 | P05 spec | search/list scene | P05-S01..04 | 5-row geometry/tabs pass | E |
| INFERRED (confidence HIGH) | T-13 P-06 checkout | T-03,T-04,T-05 | P06 spec | checkout scene | P06-S01..05 | total/sticky CTA pass | E |
| INFERRED (confidence HIGH) | T-14 responsive pass | T-07..T-13 | section 12 | width overrides | all | 6 widths no body overflow | G |
| INFERRED (confidence HIGH) | T-15 interaction pass | T-07..T-13 | section 13 | state machines | all interactive | pointer/keyboard parity | G |
| INFERRED (confidence HIGH) | T-16 accessibility pass | T-14,T-15 | section 14 | labels/focus/live regions | all | automated + manual checks pass | H |
| INFERRED (confidence HIGH) | T-17 visual QA | T-14,T-16 | prepared crops | diffs/screenshots | P-01..06 | major edges ±4px, colors ≤3 | I |
| INFERRED (confidence HIGH) | T-18 performance | T-07..T-17 | asset manifest | optimized build | all | LCP asset eager, CLS≈0 | I |
| INFERRED (confidence HIGH) | T-19 content rights audit | T-03,T-18 | all copy/assets | signed manifest | all | 원 브랜드 자산 0건 | J |

- INFERRED (confidence HIGH) groups A/D/E/F 내부 task는 의존성이 충족되면 병렬화할 수 있고 visual QA는 페이지별로 분할할 수 있다.
- INFERRED (confidence HIGH) 완료 gate는 6개 페이지 route/state, 19개 계약 section, 6개 폭 screenshot, keyboard flow, rights audit가 모두 통과하는 것이다.

## 18. Page-Specific Acceptance Criteria

### 18.1 P-01 Acceptance

- INFERRED (confidence HIGH) 1440/1280/1024/768 screenshot에서 app 폭은 414±2px로 중앙 정렬되고 outer backdrop은 `#F1F1F1` deltaE≤3이다.
- INFERRED (confidence HIGH) canonical 414px capture에서 P01-S01..S09 주요 prepared 높이 비율과 edge는 ±4px, 반복 ranking row 간격은 ±2px다.
- INFERRED (confidence HIGH) header는 h62±3px, logo 122×24±4px, icons 24±2px, bottom nav h78±3px다.
- INFERRED (confidence HIGH) hero center card는 292×357±4px, 양쪽 peek가 모두 보이고 drag 전후 layout shift는 0px다.
- INFERRED (confidence HIGH) section colors는 token 기준 deltaE≤3, 사진/illustration 영역은 구조 비교에서 제외하되 crop/focal 오차는 5% 이하다.
- INFERRED (confidence HIGH) h2/card typography는 size/line-height ±1px/±2px, 360px에서 긴 한국어 title이 이웃 요소를 가리지 않는다.
- INFERRED (confidence HIGH) body horizontal overflow는 0px이고 rail만 내부 horizontal scroll을 갖는다.
- INFERRED (confidence HIGH) Tab 순서는 header→content actions→bottom nav, carousel/chips는 arrow 조작 가능, active nav가 접근성 API로 노출된다.
- INFERRED (confidence HIGH) 첫 hero는 적절한 크기로 preload되고 lazy image가 reserve box를 유지해 CLS가 발생하지 않는다.

### 18.2 P-02 Acceptance

- INFERRED (confidence HIGH) 414px에서 prepared section h는 62/368/144/58/142px에 각각 ±4px 이내다.
- INFERRED (confidence HIGH) content 좌우 edge는 rel x23/391px에 ±2px, media는 368×368±3px 정사각형이다.
- INFERRED (confidence HIGH) product title 2줄, price 1줄, store 1줄 ellipsis이고 360px에서 overlap/clipping이 없다.
- INFERRED (confidence HIGH) quantity 1에서 minus disabled, 최대치에서 plus disabled, total 계산 fixture가 unit test와 일치한다.
- INFERRED (confidence HIGH) 모든 3개 하단 action target은 44px 이상이며 focus ring이 sticky container에 잘리지 않는다.
- INFERRED (confidence HIGH) sold-out/loading/error fixture screenshot에서 action bar 높이 변화는 0px다.
- INFERRED (confidence HIGH) 1440부터 360까지 body horizontal overflow는 0px, 360 primary label은 최소 15px 이상이다.
- INFERRED (confidence HIGH) main product asset은 2x density에서 깨짐이 없고 LCP budget을 위해 eager decode된다.

### 18.3 P-03 Acceptance

- INFERRED (confidence HIGH) sheet는 414px 기준 w414±2px, visible h713±6px, top/bottom radius 20±3px다.
- INFERRED (confidence HIGH) option row baseline rhythm은 ±2px, radio visual은 24±2px, row hit target은 44px 이상이다.
- INFERRED (confidence HIGH) 필수 그룹은 동시에 하나만 선택되고 선택 가격 delta가 P-02/P-06 합계에 즉시 반영된다.
- INFERRED (confidence HIGH) 360px에서 가장 긴 option label과 우측 price 사이 gap이 8px 이상이고 text overlap은 0px다.
- INFERRED (confidence HIGH) keyboard arrow/Space, Escape/back, focus return을 모두 수동 검증한다.
- INFERRED (confidence HIGH) sheet scroll lock 중 background scroll delta는 0px이고 sheet 내부는 작은 높이에서 끝까지 도달 가능하다.
- INFERRED (confidence HIGH) reduced motion에서 translate/scale이 없고 state 변화는 즉시 인지된다.

### 18.4 P-04 Acceptance

- INFERRED (confidence HIGH) 414 desktop dialog는 w414±2px, prepared S01/S02/S03 edge는 ±4px, mobile 360 dialog는 w336px다.
- INFERRED (confidence HIGH) input/action 폭은 available width 100%, 두 button은 같은 폭/높이이며 label clipping이 없다.
- INFERRED (confidence HIGH) empty, whitespace, duplicate, loading, success, server-error fixture를 모두 실행한다.
- INFERRED (confidence HIGH) focus는 open 시 input, Tab은 dialog 안에 갇히고 Escape 후 invoker로 복원된다.
- INFERRED (confidence HIGH) overlay contrast와 dialog focus ring이 명확하고 background는 pointer/keyboard 모두 inert다.
- INFERRED (confidence HIGH) mobile virtual keyboard와 200% zoom에서 input/error/actions가 scroll로 모두 도달 가능하다.
- INFERRED (confidence HIGH) 성공 submit은 한 번만 저장하고 polite toast를 4초 표시한다.

### 18.5 P-05 Acceptance

- INFERRED (confidence HIGH) 414px에서 header 76±3px, tabs 50±2px, five row 각 115±2px다.
- INFERRED (confidence HIGH) 모든 row image는 80×80±2px, info 시작 x는 반복 row마다 ±2px 이내 정렬된다.
- INFERRED (confidence HIGH) selected tab surface/border와 favorite filled/outline 상태가 색상+shape 두 방식으로 구분된다.
- INFERRED (confidence HIGH) search Enter/icon submit, tab arrows, store activation, favorite Space 동작이 pointer와 동일하다.
- INFERRED (confidence HIGH) 0/1/5/20개 결과와 loading/error fixture에서 list container overflow와 heading count가 정확하다.
- INFERRED (confidence HIGH) 360px에서 store name/meta/address/star가 겹치지 않고 body horizontal overflow가 0px다.
- INFERRED (confidence HIGH) 이미지 실패 시 동일 80px placeholder를 유지하고 row 높이는 변하지 않는다.
- INFERRED (confidence HIGH) 위치 권한 거부 시 search는 계속 작동하고 재시도 가능한 중립 안내를 제공한다.

### 18.6 P-06 Acceptance

- INFERRED (confidence HIGH) 414px에서 section h는 116/324/172/106/105px에 각각 ±4px 이내이며 8px separator rhythm은 ±1px다.
- INFERRED (confidence HIGH) order item thumbnail/title/qty와 definition-list amount가 동일 baseline grid에 놓이고 amount는 우측 edge ±2px다.
- INFERRED (confidence HIGH) subtotal+option−discount=payable fixture가 모두 맞고 server revalidation mismatch가 사용자 확인 없이 submit되지 않는다.
- INFERRED (confidence HIGH) request 100 grapheme 제한과 coupon none/selected/ineligible 상태가 layout shift 4px 이내다.
- INFERRED (confidence HIGH) sticky payment button은 414에서 368×62±3px, 360에서 320×58±3px이고 safe-area를 침범하지 않는다.
- INFERRED (confidence HIGH) keyboard focus 시 request field와 payment CTA가 모두 보이며 sticky bar가 error message를 가리지 않는다.
- INFERRED (confidence HIGH) payment loading은 duplicate activation을 막고 error는 focusable retry와 assertive message를 제공한다.
- INFERRED (confidence HIGH) 1440/1280/1024/768/390/360 모두 body horizontal overflow 0px, flat color deltaE≤3, 주요 edge ±4px다.

## 19. Uncertainties and Decisions

| 근거 | page/section/component | UNKNOWN item | selected decision | rejected alternative | confidence | resolving evidence |
| --- | --- | --- | --- | --- | --- | --- |
| UNKNOWN (confidence HIGH) | all | 실제 CSS/폰트 | Pretendard/Noto Sans KR와 token 표 사용 | 이미지에서 font 추측 복제 | MEDIUM | 원 CSS/font manifest |
| UNKNOWN (confidence HIGH) | all | 원 route URL | 문서의 semantic route 5개 + modal state | 아이콘마다 미노출 route 발명 | HIGH | 원 sitemap/router |
| UNKNOWN (confidence HIGH) | all headers | sticky/static | header sticky top 0 | 모든 header fixed overlay | MEDIUM | scroll video 또는 연속 캡처 |
| UNKNOWN (confidence HIGH) | collage | 우측 화면 중첩 의미 | 독립 화면/state로 분리 | 한 장문 페이지로 연결 | HIGH | 원 presentation layer file |
| UNKNOWN (confidence HIGH) | P01-S02 | hero autoplay | autoplay 없음 | 5초 자동 전환 | HIGH | interaction recording |
| UNKNOWN (confidence HIGH) | P01-S02 | 정확 slide count | fixture 3개 이상 | 보이는 중심 1개만 구현 | MEDIUM | carousel 전체 데이터 |
| UNKNOWN (confidence HIGH) | P01-S06 | 랭킹 DOM 순서 | 접근성 순서 1→10, 시각 5행×2 | DOM을 1/6,2/7 순으로 둠 | HIGH | 접근성 tree |
| UNKNOWN (confidence HIGH) | P01-S09 | 5 nav target | P-01만 실제, 나머지 disabled/feature flag | unseen page 발명 | HIGH | 각 target screenshot |
| UNKNOWN (confidence HIGH) | P02-S05 | cart destination | local cart+toast | 미노출 cart route 생성 | MEDIUM | 장바구니 화면 |
| UNKNOWN (confidence HIGH) | P03 | close/confirm controls | accessible close/confirm 추가, visual compare mode optional | 닫을 수 없는 sheet | MEDIUM | sheet 전체 높이 screenshot |
| UNKNOWN (confidence HIGH) | P03 | overlay/sheet 관계 | P-02 위 sheet + direct route fallback | 완전히 별도 영구 page만 구현 | MEDIUM | 전환 영상/URL |
| UNKNOWN (confidence HIGH) | P04 | backdrop/dismiss | alpha .45, Escape/outside dismiss | modal 아닌 inline card | MEDIUM | dialog open screenshot |
| UNKNOWN (confidence HIGH) | P04 | 이름 validation | 1–20 grapheme, duplicate error | 무제한 자유 입력 | HIGH | product requirements/API schema |
| UNKNOWN (confidence HIGH) | P05 | 위치 권한 timing | 명시 action에서 요청 | 첫 load 즉시 prompt | HIGH | permission UX recording |
| UNKNOWN (confidence HIGH) | P05 | 거리 산식 | server-provided meters 표시 | client가 임의 직선거리 계산 | HIGH | API contract |
| UNKNOWN (confidence HIGH) | P05 | store row click outcome | 선택 후 호출 route로 복귀 | 새 store detail route 생성 | MEDIUM | 클릭 후 화면 |
| UNKNOWN (confidence HIGH) | P06 | 결제 수단/약관 | 범위 밖, CTA 뒤 server flow | 미증거 payment form 발명 | HIGH | checkout 후속 screenshot |
| UNKNOWN (confidence HIGH) | P06 | 요청 input multiline | 100자 single-line 증거 근접 구현 | 기본 textarea h120 | MEDIUM | focus/typing recording |
| UNKNOWN (confidence HIGH) | all | desktop expansion | 414px centered app 고정 | 1024에서 2-column 재배치 | HIGH | 실제 desktop product screenshot |
| UNKNOWN (confidence HIGH) | all | mobile evidence | 414 기준 비례 축소 규칙 | 모든 값을 viewport 비율로 scale | HIGH | 390/360 원본 screenshot |
| UNKNOWN (confidence HIGH) | assets | 원 이미지 source/crop | 새 권리 확보 asset과 명세 focal point | 원 사진 추출/복제 | HIGH | 권리 문서와 원 asset |
| UNKNOWN (confidence HIGH) | performance | API latency/asset weight | skeleton reserved size + lazy loading | spinner-only blank page | MEDIUM | production telemetry |

- INFERRED (confidence HIGH) 추가 증거가 들어오면 MEASURED 좌표와 token만 갱신하고 Page ID, Section ID, component API는 안정적으로 유지한다.
- INFERRED (confidence HIGH) 결정 충돌 우선순위는 접근성/결제 무결성 → 직접 관찰된 위계 → prepared geometry → 추정 motion/decoration 순이다.
- INFERRED (confidence HIGH) 구현자는 UNKNOWN을 사실로 승격하지 말고 해당 decision을 feature flag 또는 adapter 경계 안에 둔다.
