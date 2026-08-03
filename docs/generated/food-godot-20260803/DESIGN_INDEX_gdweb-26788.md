# DESIGN_INDEX — gdweb-26788 / 요리엔

- OBSERVED | confidence HIGH | 스키마: `secret-mcp/design-index/v2`.
- OBSERVED | confidence HIGH | 레퍼런스 ID: `gdweb-26788`.
- OBSERVED | confidence HIGH | 등록일: `2026-04-01`, 수상: `WINNER PRIZE`.
- OBSERVED | confidence HIGH | 메타데이터 콘셉트: 심플함, 안정감, 자연·환경 지향, 정돈됨.
- OBSERVED | confidence HIGH | 메타데이터 주색: 기타, WHITE.
- OBSERVED | confidence HIGH | 제작사 메타데이터: 서로커뮤니케이션.
- INFERRED | confidence HIGH | 이 문서의 구현 대상은 원본 브랜드 복제가 아니라 Godot 기반 음식·요리 프로젝트에 적용할 수 있는 정보 구조와 측정 가능한 화면 규칙이다.

## 1. Reconstruction Goal and Scope

- OBSERVED | confidence HIGH | 증거는 데스크톱 4개 타일과 모바일 1개 이미지이며, 데스크톱 타일은 `y=0/1520/3040/4560px`에서 겹치는 동일 페이지 조각이다.
- MEASURED | confidence HIGH | 데스크톱 정합 캔버스는 prepared 기준 `1200×5069px`, 원본 기준 `1902×8034px`이다.
- MEASURED | confidence HIGH | 1-2, 2-3, 3-4 타일의 각 `80px` 중첩 평균 절대 픽셀 차이는 각각 `0.0208`, `0.0115`, `0.1022/255`이므로 한 장문 페이지로 판정한다.
- OBSERVED | confidence HIGH | 별도 문서 경계, 브라우저 크롬 반복, 헤더 재시작, 서로 다른 활성 메뉴가 보이지 않는다.
- INFERRED | confidence HIGH | 구현 범위는 기본 경로 `/`의 `Page P-01: 음식·요리 프로젝트 홈` 한 개다.
- UNKNOWN | confidence HIGH | About, 콘텐츠, Shop에 해당하는 목적지 페이지는 보이지 않으므로 재구현 범위에 포함하지 않는다.
- INFERRED | confidence HIGH | 목표 시각 충실도는 prepared 캔버스의 주요 모서리 `±4px`, 반복 간격 `±2px`, 평면 UI 색상 `ΔE ≤ 3`이다.
- INFERRED | confidence HIGH | 지원 뷰포트는 `1440`, `1280`, `1024`, `768`, `390`, `360 CSS px`이다.
- INFERRED | confidence HIGH | 구현은 semantic HTML/CSS와 동등한 랜드마크·키보드 접근성을 제공해야 하며, 프레임워크나 Godot 렌더러 선택과 무관하게 동일한 결과를 만족해야 한다.
- INFERRED | confidence HIGH | Godot Web export를 쓰는 경우에도 내비게이션, 링크, 상품 제어, 대체 텍스트는 접근 가능한 DOM 레이어 또는 동등한 플랫폼 접근성 노드로 노출한다.
- INFERRED | confidence HIGH | 원본 워드마크, 고유 홍보 문구, 제품명, 가격, 인물·제품·소셜 사진은 복제하지 않는다.
- INFERRED | confidence HIGH | 원본의 구조적 역할은 프로젝트 소개, 제작 과정, 업데이트, 디지털 상품, 색상 선택, 플레이테스트 후기, 개발 저널, 커뮤니티 피드로 치환한다.
- INFERRED | confidence HIGH | 비목표는 보이지 않는 상세·결제·로그인 페이지 발명, 원본 상표 사용, 원본 사진 재가공, 정적 이미지에서 확인할 수 없는 동작의 사실화다.

## 2. Evidence Inventory and Coordinate System

| 등급 | Evidence ID | 종류/파트 | 원본 | prepared | 첨부 crop `(x,y,w,h)` | 원본 mapped crop `(x,y,w,h)` | scale | 보이는 범위 | 한계 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MEASURED · HIGH | E-D01 | desktop 1/4 | `1902×8034px` | `1200×5069px` | `0,0,1200,1600px` | `0,0,1902,2536px` | `0.6309×` | 헤더, 히어로, 제작 단계, 업데이트 상단 | 업데이트 하단이 잘림 |
| MEASURED · HIGH | E-D02 | desktop 2/4 | `1902×8034px` | `1200×5069px` | `0,1520,1200,1600px` | `0,2409,1902,2536px` | `0.6309×` | 업데이트 하단, 상품, 색상, 후기 상단 | 앞·뒤 타일과 `80px` 중첩 |
| MEASURED · HIGH | E-D03 | desktop 3/4 | `1902×8034px` | `1200×5069px` | `0,3040,1200,1600px` | `0,4818,1902,2536px` | `0.6309×` | 후기, 저널, 소셜 피드 | 소셜 피드 하단이 다음 타일과 중첩 |
| MEASURED · HIGH | E-D04 | desktop 4/4 | `1902×8034px` | `1200×5069px` | `0,4560,1200,509px` | `0,7227,1902,807px` | `0.6309×` | 소셜 피드 하단, 푸터 | 세로 길이가 `509px`뿐임 |
| MEASURED · HIGH | E-M01 | mobile 1/1 | `243×1026px` | `243×1026px` | `0,0,243,1026px` | `0,0,243,1026px` | `1×` | 페이지 전체 축소 표현 | 실제 모바일 재배치 증거가 아님 |

- MEASURED | confidence HIGH | canonical prepared 원점은 정합 데스크톱 캔버스 좌상단 `(0,0)`이며, `x`는 오른쪽, `y`는 아래쪽으로 증가한다.
- MEASURED | confidence HIGH | E-D02 로컬 좌표는 `global y=local y+1520px`, E-D03은 `+3040px`, E-D04는 `+4560px`로 변환한다.
- MEASURED | confidence HIGH | 원본 좌표는 prepared 좌표를 `0.6309`로 나눈다. 허용 반올림 오차는 `±2 source px`다.
- MEASURED | confidence HIGH | 모바일과 데스크톱 정합 캔버스 비율은 가로 `243/1200=0.2025`, 세로 `1026/5069=0.2024068`이다.
- MEASURED | confidence HIGH | 데스크톱 정합본을 Lanczos로 `243×1026px` 축소했을 때 E-M01과의 MAE는 `3.565/255`, RMS는 `6.370/255`다.
- INFERRED | confidence HIGH | E-M01은 독립적인 모바일 레이아웃보다 데스크톱 전체 이미지의 축소 썸네일로 해석한다.
- INFERRED | confidence HIGH | E-M01의 직접 근거는 섹션 순서·비율·콘텐츠 동일성에 사용하고, 가독 가능한 390/360 레이아웃은 접근성에 맞춰 재배치한 구현 결정을 사용한다.
- MEASURED | confidence HIGH | 중첩 `80px`는 중복 콘텐츠이므로 한 번만 세며, E-D01 `[0,1600)`, E-D02 `[1600,3120)`, E-D03 `[3120,4640)`, E-D04 `[4640,5069)`를 최종 합성 구간으로 사용한다.
- INFERRED | confidence MEDIUM | 수동으로 판독한 내부 요소 bounds의 QA 허용치는 일반 요소 `±4px`, 흐린 사진 경계 `±8px`다.

### Evidence Palette Records

| 등급 | Evidence | 대표 샘플 | 비율 | 해석 |
| --- | --- | --- | --- | --- |
| MEASURED · HIGH | E-D01 | `#EEEEEE` | `5.67%` | 카드·밝은 이미지 픽셀 혼합 |
| MEASURED · HIGH | E-D01 | `#CCDDDD` | `4.47%` | 청회색 섹션·사진 혼합 |
| MEASURED · HIGH | E-D01 | `#DDEEEE` | `3.56%` | 청회색 하이라이트 |
| MEASURED · HIGH | E-D01 | `#442200` | `3.37%` | 히어로 사진의 갈색 영역 |
| MEASURED · HIGH | E-D02 | `#EEEEEE` | `26.33%` | 상품·색상 섹션의 밝은 면 |
| MEASURED · HIGH | E-D02 | `#FFEEEE` | `24.01%` | JPEG 정규화된 온백색 영역 |
| MEASURED · HIGH | E-D02 | `#FFFFFF` | `8.37%` | 카드·제품 이미지 배경 |
| MEASURED · HIGH | E-D03 | `#FFFFFF` | `32.20%` | 저널·소셜 배경 |
| MEASURED · HIGH | E-D03 | `#222222` | `3.86%` | 본문·사진 암부 혼합 |
| MEASURED · HIGH | E-D04 | `#4499AA` | `14.90%` | 푸터 배경 사진의 청록 |
| MEASURED · HIGH | E-D04 | `#55AABB` | `14.16%` | 푸터 배경 사진의 밝은 청록 |
| MEASURED · HIGH | E-M01 | `#FFFFFF` | `13.88%` | 축소본의 흰 영역 |
| MEASURED · HIGH | E-M01 | `#EEEEEE` | `10.97%` | 축소본의 회백색 영역 |

## 3. Site Map and Page/Route Inventory

| 등급 | Page ID | route/name | 목적 | 근거 | shared shell | desktop | mobile | confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OBSERVED | P-01 | `/` / 음식·요리 프로젝트 홈 | 프로젝트 서사, 상품, 후기, 저널, 커뮤니티를 한 흐름에 제시 | E-D01~04, E-M01 | Shell-A: 투명 오버레이 헤더 + 이미지 푸터 | 있음 | 축소 동일본 있음 | HIGH |
| UNKNOWN | — | 소개 목적지 | 상단 첫 텍스트 메뉴의 목적지 | E-D01 헤더 | 미확인 | 화면 없음 | 화면 없음 | HIGH |
| UNKNOWN | — | 콘텐츠 목적지 | 상단 둘째 텍스트 메뉴의 목적지 | E-D01 헤더 | 미확인 | 화면 없음 | 화면 없음 | HIGH |
| UNKNOWN | — | 상점 목적지 | 상단 셋째 텍스트 메뉴의 목적지 | E-D01 헤더 | 미확인 | 화면 없음 | 화면 없음 | HIGH |

- OBSERVED | confidence HIGH | 기본 페이지는 P-01이며 히어로부터 푸터까지 연속 스크롤된다.
- UNKNOWN | confidence HIGH | 상단 메뉴에 시각적으로 강조된 활성 텍스트는 없다.
- INFERRED | confidence HIGH | P-01 구현에서는 로고 홈 링크에 `aria-current="page"`를 부여하고 텍스트 메뉴는 비활성 상태로 둔다.
- OBSERVED | confidence HIGH | 푸터에 프로모션·생활 콘텐츠·FAQ 범주의 링크와 정책·문의 링크가 보이지만 해당 페이지 캔버스는 없다.

## 4. Shared Application Shell

| 등급 | primitive | exact specification | 사용 위치 | tolerance/confidence |
| --- | --- | --- | --- | --- |
| MEASURED | prepared viewport | `1200×5069px` 정합 캔버스 | P-01 전체 | `±0px`, HIGH |
| INFERRED | body background | `#F4F4F4`, 최소 폭 `320px`, `overflow-x: clip` | 전체 | `ΔE≤3`, HIGH |
| INFERRED | desktop fluid model | `width:100%`; prepared x를 `viewport/1200` 비율로 환산하되 내부 컨테이너 `max-width:1296px` at 1440 | `≥1024px` | `±4px`, MEDIUM |
| INFERRED | global container | `width:min(calc(100% - 10%),1296px)`; 1440에서 `1296px` | 헤더·카드 영역 | `±4px`, HIGH |
| INFERRED | compact container | 1440에서 `912px`, 1280에서 `810px`, 1024에서 `648px` | 상품 카드 | `±4px`, MEDIUM |
| INFERRED | mobile gutter | 390에서 `16px`, 360에서 `16px`, 768에서 `24px` | 재배치된 모든 섹션 | `±2px`, HIGH |
| OBSERVED | page chrome | 브라우저 프레임, 사이드 레일, 쿠키 배너 없음 | 전체 | HIGH |
| OBSERVED | announcement bar | 별도 공지 바 없음 | 전체 | HIGH |
| OBSERVED | modal/overlay | 열린 모달·메뉴·쿠키 UI 없음 | 전체 | HIGH |
| INFERRED | selection color | 배경 `rgba(85,170,187,.28)`, 글자 `#222222` | 문서 선택 | `ΔE≤3`, MEDIUM |
| INFERRED | stacking base | content `z=0`, section decoration `z=1`, text/media `z=2`, header `z=50`, overlay `z=60`, skip link `z=100` | 전체 | HIGH |

- OBSERVED | confidence HIGH | 헤더는 히어로 안쪽에 겹치고, 그 외 섹션은 문서 흐름에 놓인다.
- OBSERVED | confidence HIGH | 페이지 폭 전체를 사용하는 배경 밴드와 중앙 제한 컨테이너를 교차 사용한다.
- INFERRED | confidence HIGH | 각 섹션은 `section` 랜드마크가 아니라 의미에 따라 `section`, `aside`, `footer`를 사용하고, 불필요한 중첩 카드 표면을 만들지 않는다.
- UNKNOWN | confidence HIGH | 쿠키 동의, 지역 선택, 로그인 세션 배너의 존재 여부는 증거에서 확인되지 않는다.

## 5. Navigation and Header Specification

### Desktop Navigation Geometry

| 등급 | field | prepared evidence value | 1440 CSS implementation | evidence/confidence/tolerance |
| --- | --- | --- | --- | --- |
| MEASURED | total header height | `64px` | `77px` | E-D01 `(35,18)-(1163,82)`, HIGH, `±3px` |
| OBSERVED | utility-bar height | 별도 바 `0px` | `0px` | E-D01, HIGH |
| MEASURED | content width | `1128px` | `1354px`, 단 최대 `calc(100%-84px)` | E-D01, HIGH, `±4px` |
| MEASURED | left/right padding | 각 `24px` | 각 `29px` | E-D01, MEDIUM, `±3px` |
| MEASURED | logo bounds | `x=59,y=39,w=75,h=23px` | `x=71,y=47,w=90,h=28px` | E-D01, MEDIUM, `±4px` |
| MEASURED | menu start x | `516px` | `619px` | E-D01, MEDIUM, `±5px` |
| INFERRED | menu item width/padding | 최소 `54px`, 좌우 `12px` | 최소 `65px`, 좌우 `14px` | 보이는 3항목, MEDIUM, `±4px` |
| MEASURED | item gap | `15px` | `18px` | E-D01, MEDIUM, `±3px` |
| MEASURED | menu baseline | `y=52px` | `y=62px` | E-D01, MEDIUM, `±3px` |
| MEASURED | icon size | `16×16px` | `19×19px` | E-D01, MEDIUM, `±3px` |
| MEASURED | action area width | `104px` | `125px` | E-D01 x=`1038..1142`, MEDIUM, `±4px` |
| INFERRED | border | `1px solid rgba(255,255,255,.18)` | 동일 | E-D01 헤더 윤곽, LOW, `ΔE≤5` |
| INFERRED | background | `rgba(95,95,95,.52)` + `backdrop-filter:blur(10px)` | 동일 | E-D01 반투명 면, MEDIUM, `ΔE≤5` |
| OBSERVED | position mode | 히어로 위 absolute | `position:absolute;top:22px` | E-D01, HIGH, `±4px` |
| INFERRED | z-index | 직접 측정 불가 | `50` | 겹침 관계 기반, HIGH |
| MEASURED | corner radius | `8px` | `10px` | E-D01, MEDIUM, `±2px` |

### Mobile Navigation Geometry

| 등급 | field | E-M01 direct evidence | 390/360 implementation | confidence/tolerance |
| --- | --- | --- | --- | --- |
| MEASURED | bar height | 축소본 `13px` | `64px / 60px` | HIGH direct, inferred implementation `±2px` |
| MEASURED | side padding | 축소본 `5px` | `20px / 16px` | MEDIUM, `±2px` |
| MEASURED | logo bounds | 약 `12,8,15,5px` | `20,20,92,24px` / `16,18,88,23px` | MEDIUM, `±3px` |
| OBSERVED | menu-control bounds | 축소본은 데스크톱 텍스트·아이콘을 유지 | 우측 `44×44px` | direct HIGH, implementation HIGH |
| INFERRED | touch target | 축소본에서 판독 불가 | 최소 `44×44px` | WCAG 목표, HIGH |
| UNKNOWN | open-panel origin | 열린 메뉴 증거 없음 | `top:0;right:0` | UNKNOWN direct, decision MEDIUM |
| UNKNOWN | panel width/height | 열린 메뉴 증거 없음 | `min(320px,82vw) × 100dvh` | UNKNOWN direct, decision HIGH |
| UNKNOWN | row height | 메뉴 행 증거 없음 | `56px` | UNKNOWN direct, decision HIGH |
| UNKNOWN | indentation | 하위 메뉴 증거 없음 | 1단계 `20px`, 2단계 `36px` | UNKNOWN direct, decision MEDIUM |
| UNKNOWN | divider | 메뉴 패널 증거 없음 | `1px solid #DDDDDD` | UNKNOWN direct, decision HIGH |
| UNKNOWN | overlay | 메뉴 패널 증거 없음 | `rgba(17,17,0,.48)` | UNKNOWN direct, decision HIGH |
| UNKNOWN | close behavior | 정적 이미지로 판독 불가 | 닫기 버튼·Escape·오버레이 클릭 | UNKNOWN direct, decision HIGH |
| UNKNOWN | scroll locking | 정적 이미지로 판독 불가 | 열림 중 body 고정, 스크롤바 폭 보정 | UNKNOWN direct, decision HIGH |

### Visible Navigation Order and Route Mapping

| 등급 | order | visible role | adapted label | target |
| --- | --- | --- | --- | --- |
| OBSERVED | 1 | 원본 워드마크 | 프로젝트 심볼+이름 | `/` P-01 |
| OBSERVED | 2 | 소개 텍스트 항목 | `프로젝트` | UNKNOWN 목적지, 초기 구현은 `#project` |
| OBSERVED | 3 | 브랜드 콘텐츠 텍스트 항목 | `레시피` | UNKNOWN 목적지, 초기 구현은 `#journal` |
| OBSERVED | 4 | 상점 텍스트 항목 | `컬렉션` | UNKNOWN 목적지, 초기 구현은 `#items` |
| OBSERVED | 5 | 로그인 형태 아이콘 | `로그인` | UNKNOWN |
| OBSERVED | 6 | 사용자 형태 아이콘 | `프로필` | UNKNOWN |
| OBSERVED | 7 | 가방 형태 아이콘+배지 | `장바구니` | UNKNOWN |

### Navigation State Contract

| 등급 | state | exact visual/behavior | timing | keyboard/accessibility |
| --- | --- | --- | --- | --- |
| INFERRED | default | 흰 글자 `#FFFFFF`, opacity `1`, underline `0px` | `0ms` | 링크 이름 노출 |
| INFERRED | hover | 배경 `rgba(255,255,255,.12)`, opacity `1` | `160ms ease-out` | 포인터만 적용 |
| INFERRED | focus-visible | `2px #00A6C7` outline, offset `3px`, radius `4px` | `0ms` | Tab 시만 표시 |
| INFERRED | pressed | 배경 `rgba(255,255,255,.20)`, `scale(.98)` | `80ms ease-out` | Enter/Space 동등 |
| INFERRED | active | 하단 `2px solid #FFFFFF`, `aria-current=page` | `0ms` | 현재 페이지 음성 안내 |
| INFERRED | disabled | opacity `.45`, pointer 없음 | `0ms` | `aria-disabled=true`, focus 제외 |
| UNKNOWN | scrolled | 전환 증거 없음 | 권장: 배경 `.82`, `200ms` | reduced motion 시 즉시 |
| UNKNOWN | menu-open | 열린 상태 증거 없음 | 권장: 패널 `translateX(0)`, `220ms` | focus trap, `aria-expanded=true` |
| UNKNOWN | submenu-open | 하위 메뉴 증거 없음 | 권장: 행 `max-height`, `180ms` | 방향키 또는 버튼 토글 |

- UNKNOWN | confidence HIGH | 헤더가 스크롤 후 sticky/fixed로 바뀌는지는 알 수 없다.
- INFERRED | confidence MEDIUM | 데스크톱은 히어로 내부 absolute를 유지하고, `≤899px`에서는 상단 fixed 바를 사용한다.
- INFERRED | confidence HIGH | 모바일 메뉴 닫힘 후 초점은 메뉴 버튼으로 복원한다.

## 6. Page-by-Page Specifications

### Page P-01: 음식·요리 프로젝트 홈

#### 6.1 Route and Purpose

- INFERRED | confidence HIGH | route는 `/`, 페이지 목적은 Godot 음식·요리 프로젝트의 가치, 제작 과정, 최신 소식, 구매 가능 항목, 외형 선택, 사용자 후기, 개발 저널, 커뮤니티를 순차적으로 보여 주는 것이다.
- INFERRED | confidence HIGH | 진입점은 로고, 직접 URL, 푸터 홈 링크다.
- OBSERVED | confidence HIGH | shared shell은 Shell-A이고 헤더는 히어로 위에 겹치며 푸터는 청록 사진 밴드다.
- INFERRED | confidence HIGH | 활성 내비게이션은 로고 홈 링크이며 텍스트 메뉴는 활성 표시를 갖지 않는다.
- OBSERVED | confidence HIGH | 근거는 E-D01, E-D02, E-D03, E-D04, E-M01이다.

#### 6.2 Desktop Canvas Model

- MEASURED | confidence HIGH | reference viewport는 원본 `1902×8034px`, prepared 분석 캔버스는 `1200×5069px`다.
- MEASURED | confidence HIGH | full page height는 prepared `5069px`, source `8034px`다.
- INFERRED | confidence HIGH | 1440 CSS px 구현 높이 목표는 `6083px±40px`; 이미지·텍스트 대체로 인한 자연 높이는 섹션별 허용치 안에서 조정한다.
- MEASURED | confidence HIGH | 주요 일반 컨테이너는 prepared `x=58..1132`, width `1074px`, 좌우 gutter `58/68px`다.
- MEASURED | confidence HIGH | 저널은 prepared `600px + 600px` 2열, 상품 카드는 중앙 `758px` 영역 3열이다.
- INFERRED | confidence HIGH | 페이지 배경은 섹션별 full-bleed 면이며 body 기본은 `#F4F4F4`다.

#### 6.3 Mobile Canvas Model

- MEASURED | confidence HIGH | E-M01 reference는 `243×1026px`이며 prepared 데스크톱 전체의 약 `0.2025×` 축소 동일본이다.
- OBSERVED | confidence HIGH | 축소본의 섹션 순서와 가로 배열은 데스크톱과 동일하다.
- INFERRED | confidence HIGH | 실제 390/360 CSS px 구현은 `16px` side padding, 단일 열 우선, 수평 스냅이 명시된 컬렉션만 overflow를 허용한다.
- INFERRED | confidence HIGH | 모바일 stacking order는 헤더, 히어로, 제작 단계, 업데이트, 상품, 외형 선택, 후기, 저널, 커뮤니티, 푸터다.
- INFERRED | confidence HIGH | body의 수평 overflow는 `clip`; 후기·색상·소셜 트랙 내부만 `overflow-x:auto`다.

#### 6.4 Ordered Section Geometry

| 등급 | Section ID | Evidence/region | prepared bounds `(x,y,w,h)` | role | container | layout | spacing | alignment | surface | content | responsive | confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MEASURED | P01-S01 | E-D01 x35..1163 y18..82 | `35,18,1128,64px` | header | floating 94% | flex 3 zones | pad `24px`, gap `15px` | center/baseline | translucent gray, `1px`, r8 | logo, 3 links, 3 icons | `≤899px` compact bar+drawer | HIGH |
| MEASURED | P01-S02 | E-D01 x0..1200 y0..580 | `0,0,1200,580px` | hero | full bleed | relative, media cover | text inset `59px 0 69px` | left/bottom | dark food photo+overlay | headline, body, arrows, 3 dots | mobile text block, shorter crop | HIGH |
| MEASURED | P01-S03 | E-D01 y580..1160 | `0,580,1200,580px` | main section | inner `1074px` | 4-col grid | top `74px`, cards gap `11px` | centered heading | pale blue image surface | heading, body, 4 process cards | 2-col tablet, 1-col mobile | HIGH |
| MEASURED | P01-S04 | E-D01/E-D02 y1160..1740 | `0,1160,1200,580px` | section | split inner `1076px` | 40/60 grid | inset `62px`, row gap `14px` | left | blurred food photo | intro CTA, 3 update cards | intro above list at `≤899px` | HIGH |
| MEASURED | P01-S05 | E-D02 local y220..800 | `0,1740,1200,580px` | commerce section | compact `758px` | 3-col grid | top `68px`, gap `13px` | centered | `#F7F0EA` | title, CTA, 3 product cards | 1-col at `≤639px` | HIGH |
| MEASURED | P01-S06 | E-D02 local y800..1420 | `0,2320,1200,620px` | showcase section | full bleed/inner `1080px` | 3-col media | top `76px`, col gap `92px` | centered | `#F4F4F4` | title, 3 cutouts, CTA | horizontal snap at mobile | HIGH |
| MEASURED | P01-S07 | E-D02/E-D03 y2940..3565 | `0,2940,1200,625px` | reviews section | full bleed | 5-card carousel | title top `88px`, gap `84px` | centered | soft photo/neutral field | title, CTA, 3 full+2 clipped cards | 1.08 cards mobile snap | HIGH |
| MEASURED | P01-S08 | E-D03 local y525..1172 | `0,3565,1200,647px` | journal section | full bleed | 2 cols `600/600px` | right inset `64px` | stretch | left photo/right white | photo carousel, 4 article rows | stacked media then rows | HIGH |
| MEASURED | P01-S09 | E-D03/E-D04 y4212..4755 | `0,4212,1200,543px` | social aside | full bleed | heading+horizontal track | top `96px`, track gap `10px` | centered | `#FFFFFF` | follow label, handle, 8+ tiles | swipe track; no handle overflow | HIGH |
| MEASURED | P01-S10 | E-D04 local y195..509 | `0,4755,1200,314px` | footer | inner `1084px` | 4-zone grid | top `62px`, bottom `28px` | top/start | cyan food photo+overlay | logo, links, legal, contact, social, top | stacked 2-col then 1-col | HIGH |

#### 6.5 Detailed Section Specifications

##### P01-S01 Header

- OBSERVED | confidence HIGH | 로고는 좌측, 텍스트 메뉴는 중앙, 고객 관련 아이콘은 우측에 위치한다.
- MEASURED | confidence MEDIUM | 헤더 외곽은 prepared x `35px`, 우측 `37px`, 상단 `18px`다.
- INFERRED | confidence HIGH | Godot 프로젝트용 워드마크는 새 심볼과 새 프로젝트명으로 제작하며 원본 자간·글자꼴을 추적 복제하지 않는다.
- INFERRED | confidence HIGH | 장바구니 배지는 `14×14px`, 우상단 `-4px`, 배경 `#55AABB`, 흰 글자 `9px`로 구현한다.

##### P01-S02 Hero

- MEASURED | confidence HIGH | 히어로는 prepared `580px` 높이이며 헤더를 포함해 full bleed다.
- MEASURED | confidence MEDIUM | 텍스트 블록은 `x=59px`, `y=380px`, 최대폭 `355px`, 하단 여백 약 `70px`다.
- MEASURED | confidence MEDIUM | 좌우 화살표 중심은 `(34,289)`와 `(1162,289)`, 아이콘 bounds `24×34px`다.
- MEASURED | confidence MEDIUM | 페이지네이션은 중심 x 약 `600px`, y `548px`, 점 `6px`, gap `5px`, 3개다.
- INFERRED | confidence HIGH | 대체 이미지는 실제 조리 게임 화면 또는 조리 장면을 사용하고 중앙 우측을 focal point `68% 50%`로 둔다.
- INFERRED | confidence HIGH | 읽기 대비를 위해 이미지 위에 `linear-gradient(90deg,rgba(17,17,0,.60),rgba(17,17,0,.08) 70%)`를 둔다.
- UNKNOWN | confidence HIGH | 자동 재생 여부, 슬라이드 수, 루프, 드래그 동작은 정적 증거로 알 수 없다.

##### P01-S03 제작 단계

- MEASURED | confidence HIGH | 제목 블록은 prepared 중심 x `600px`, 상단 약 `657px`, 최대폭 `420px`다.
- MEASURED | confidence HIGH | 카드 bounds는 `59,806,259,282px`, `330,806,259,282px`, `601,806,260,282px`, `872,806,260,282px`다.
- MEASURED | confidence HIGH | 카드 gap은 `11/12px`, 카드 안쪽 padding은 약 `15px`, radius는 약 `8px`다.
- MEASURED | confidence MEDIUM | 카드 이미지 영역은 약 `229×123px`, aspect `1.862:1`이다.
- OBSERVED | confidence HIGH | 네 카드는 단계 라벨, 우상단 이동 아이콘, 이미지, 제목, 짧은 본문을 동일 순서로 가진다.
- INFERRED | confidence HIGH | Godot 콘텐츠는 `기획 → 재료/에셋 → 조리 시스템 → 완성/배포` 네 단계로 치환한다.

##### P01-S04 업데이트

- MEASURED | confidence MEDIUM | 좌측 소개 블록은 `x=62,y=1238,w=325px`, 우측 카드 열은 `x=530,w=609px`다.
- MEASURED | confidence MEDIUM | 우측 카드 하나는 약 `609×208px`, 이미지 `260×180px`, 텍스트 면 `349×208px`다.
- OBSERVED | confidence HIGH | 최소 3개의 업데이트 카드가 세로로 이어지고, 각 카드는 이미지 좌측·텍스트 우측이다.
- INFERRED | confidence HIGH | 배경은 대체 조리 장면을 `cover`, `filter:blur(6px) brightness(.72)`한 별도 레이어로 사용하며 콘텐츠 자체에는 blur를 적용하지 않는다.
- INFERRED | confidence HIGH | 카드 표면은 `rgba(42,35,31,.60)`, radius `8px`, 내부 gap `24px`로 구현한다.
- UNKNOWN | confidence HIGH | 카드가 자동 이동하는지, 세로 캐러셀인지, 단순 목록인지는 판독할 수 없다.

##### P01-S05 상품 카드

- MEASURED | confidence HIGH | 배경 전환은 global y `1740px`, 다음 면 전환은 `2320px`다.
- MEASURED | confidence MEDIUM | 카드 3개는 prepared x 약 `222/479/735px`, width `244px`, height `310px`, gap `13px`다.
- MEASURED | confidence MEDIUM | 카드 이미지 면은 약 `214×155px`, 구매 버튼은 `214×30px`다.
- OBSERVED | confidence HIGH | 각 카드에는 제품 컷아웃, 상품명, 가격, 우측 작은 아이콘, 가로 전체 CTA가 있다.
- INFERRED | confidence HIGH | Godot 프로젝트에서는 DLC·레시피 팩·아트북 등 디지털 상품 또는 게임 내 아이템 소개로 치환한다.
- UNKNOWN | confidence HIGH | 실제 결제, 장바구니 연동, 통화·세금 정책은 증거에 없다.

##### P01-S06 색상 선택

- MEASURED | confidence HIGH | 배경은 global y `2320..2940px`의 균일한 `#F4F4F4` 계열이다.
- MEASURED | confidence MEDIUM | 세 제품 컷아웃 중심 x는 약 `207/600/1000px`, 표시 높이는 약 `363px`다.
- OBSERVED | confidence HIGH | 같은 실루엣의 세 색상 변형이 동일 크기로 나란히 놓인다.
- INFERRED | confidence HIGH | Godot 프로젝트에서는 냄비·도구·캐릭터 스킨 3종 미리보기로 치환한다.
- INFERRED | confidence HIGH | 이미지 캔버스는 `aspect-ratio:3/4`, `object-fit:contain`, 투명 WebP/AVIF를 사용한다.
- UNKNOWN | confidence HIGH | 클릭 시 선택, 확대, 상세 이동이 발생하는지는 알 수 없다.

##### P01-S07 후기

- MEASURED | confidence HIGH | 섹션 bounds는 global `y=2940..3565px`, 높이 `625px`다.
- MEASURED | confidence MEDIUM | 중앙 카드 약 `x=467,y=3154,w=265,h=332px`, 좌우 카드는 각각 약 `±8deg` 회전한다.
- MEASURED | confidence MEDIUM | 좌측 카드 약 `x=94,y=3163,w=279,h=351px`, 우측 카드 약 `x=831,y=3165,w=267,h=358px`다.
- OBSERVED | confidence HIGH | 양끝에는 추가 카드 일부가 잘려 보여 수평 트랙임을 암시한다.
- INFERRED | confidence HIGH | 구현은 중앙 활성 카드 `rotate(0)`, 인접 카드 `rotate(±8deg) translateY(20px)`, 양끝 overflow visible을 사용한다.
- UNKNOWN | confidence HIGH | 자동 재생·드래그·화살표·페이지네이션은 보이지 않는다.

##### P01-S08 개발 저널

- MEASURED | confidence HIGH | 좌측 미디어와 우측 목록은 각각 prepared `600×647px`다.
- MEASURED | confidence MEDIUM | 우측 목록 내부는 x `664..1138px`, y 약 `3602..4152px`다.
- MEASURED | confidence MEDIUM | 기사 행은 4개, 각 약 `474×129px`, 썸네일 약 `140×99px`, 행 divider `1px`다.
- OBSERVED | confidence HIGH | 좌측 사진 하단 중앙에 3개 점이 있어 별도 미디어 슬라이더를 암시한다.
- INFERRED | confidence HIGH | 저널 행은 태그, 제목, 한 줄 설명, 썸네일 링크로 구성하고 제목은 최대 2줄로 제한한다.
- UNKNOWN | confidence HIGH | 좌측 슬라이더와 우측 기사 선택 간 연동 여부는 알 수 없다.

##### P01-S09 커뮤니티 피드

- MEASURED | confidence HIGH | 흰 배경은 global `y=4212..4755px`, 높이 `543px`다.
- MEASURED | confidence MEDIUM | 제목 중심은 `x=600px`, y 약 `4293px`; 핸들 기준선은 y 약 `4339px`다.
- MEASURED | confidence MEDIUM | 이미지 트랙 상단은 global `4442px`, 표시 높이는 약 `161px`, tile gap은 약 `10px`다.
- OBSERVED | confidence HIGH | 8개 이상의 정사각형에 가까운 미디어가 양쪽에서 잘린 무한형 가로 트랙처럼 보인다.
- INFERRED | confidence HIGH | 원본 소셜 핸들은 사용하지 않고 프로젝트 커뮤니티 주소나 `커뮤니티 갤러리` 제목으로 교체한다.
- UNKNOWN | confidence HIGH | 외부 API 실시간 연동, 자동 스크롤, 클릭 목적지는 확인되지 않는다.

##### P01-S10 Footer

- MEASURED | confidence HIGH | 푸터는 global `y=4755..5069px`, prepared height `314px`다.
- MEASURED | confidence MEDIUM | 워드마크 영역은 x `58..206px`, 링크 영역 x `326..700px`, 소셜 x 약 `913..1022px`, 연락처 x 약 `867..1138px`다.
- OBSERVED | confidence HIGH | 배경은 청록 계열 음식/액체 사진이며 모든 주요 텍스트는 흰색이다.
- MEASURED | confidence MEDIUM | 우하단 top 버튼은 약 `36×36px`, 우측 `12px`, 하단 `15px`다.
- INFERRED | confidence HIGH | 새 프로젝트 로고, 정책 링크, 제작 주체, 문의 이메일, 운영 시간으로 교체하고 원본 사업자 정보는 복제하지 않는다.
- UNKNOWN | confidence HIGH | 소셜 아이콘의 실제 서비스 목적지와 top 버튼의 부드러운 스크롤 여부는 알 수 없다.

#### 6.6 Page-Specific States, Data, Accessibility, Assets, Acceptance

- INFERRED | confidence HIGH | 페이지 상태는 `loading`, `ready`, `partial-error`, `empty-community` 네 가지를 가진다.
- INFERRED | confidence HIGH | loading에서는 히어로 poster를 우선 표시하고 아래 데이터 섹션은 고정 높이 skeleton으로 layout shift를 방지한다.
- INFERRED | confidence HIGH | partial-error는 실패한 섹션만 메시지와 재시도 버튼으로 대체하며 나머지 페이지는 유지한다.
- INFERRED | confidence HIGH | 주요 데이터는 `heroSlides`, `processSteps`, `updates`, `shopItems`, `variants`, `reviews`, `journalEntries`, `communityItems`다.
- INFERRED | confidence HIGH | 페이지 heading은 히어로의 새 프로젝트명/가치 문구를 `h1` 하나로 두고, 이후 각 섹션 제목은 `h2`, 카드 제목은 `h3`로 둔다.
- INFERRED | confidence HIGH | 모든 원본 사진은 새 게임 캡처·새 조리 사진·새 렌더로 대체하며, decorative blur만 `alt=""`를 사용한다.
- INFERRED | confidence HIGH | P-01 acceptance는 섹션 18의 단독 체크리스트를 따른다.

## 7. Section and Layout Deep Dives

### P01-S01 DOM and Layout

- INFERRED | confidence HIGH | DOM: `header.site-header > a.logo + nav.primary-nav > ul > li*3 + div.header-actions > button*3`.
- INFERRED | confidence HIGH | CSS: `display:grid;grid-template-columns:1fr auto 1fr;align-items:center`이며 우측 액션은 `justify-self:end`다.
- INFERRED | confidence HIGH | 데스크톱은 `width:94%;max-width:1788px`, mobile은 `left:0;top:0;width:100%;border-radius:0`다.

```css
.site-header{position:absolute;inset:18px 35px auto;min-height:64px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 24px;z-index:50}
@media(max-width:899px){.site-header{position:fixed;inset:0 0 auto;width:100%;min-height:64px;padding:0 16px;grid-template-columns:1fr auto}}
```

### P01-S02 DOM and Layout

- INFERRED | confidence HIGH | DOM: `section.hero > picture/img + div.overlay + div.copy(h1,p) + button.prev + button.next + div.pagination`.
- INFERRED | confidence HIGH | media는 `position:absolute;inset:0;width:100%;height:100%;object-fit:cover`다.
- INFERRED | confidence HIGH | copy는 `position:absolute;left:4.92%;bottom:11.7%;z-index:2`다.
- INFERRED | confidence HIGH | 768 이하 copy는 `left:24px;right:24px;bottom:48px;max-width:520px`, 390 이하 `left/right:16px;bottom:40px`다.
- INFERRED | confidence HIGH | 버튼은 `44×44px` hit area 안에 `16×24px` chevron을 둔다.

### P01-S03 DOM and Layout

- INFERRED | confidence HIGH | DOM: `section.process > header.section-heading + ol.process-grid > li.process-card*4`.
- INFERRED | confidence HIGH | desktop grid는 `repeat(4,minmax(0,1fr))`, gap `12px`, inner width `89.5%`다.
- INFERRED | confidence HIGH | 1024/768은 `repeat(2,minmax(0,1fr))`, 639 이하는 `1fr`다.
- INFERRED | confidence HIGH | 카드 이미지 `aspect-ratio:1.862/1`, `object-fit:cover`, body 최소 높이 `100px`다.
- INFERRED | confidence HIGH | 제목 2줄, 본문 3줄 이후 `line-clamp`하되 접근 가능한 전체 텍스트는 DOM에 유지한다.

### P01-S04 DOM and Layout

- INFERRED | confidence HIGH | DOM: `section.updates > picture.bg + div.updates-layout > header.intro + div.update-list > article*3`.
- INFERRED | confidence HIGH | desktop grid는 `grid-template-columns:38% 62%`, inner width `89.7%`, gap `42px`다.
- INFERRED | confidence HIGH | 카드 내부는 `grid-template-columns:43% 57%`, min-height `208px`다.
- INFERRED | confidence HIGH | 899 이하는 단일 열, 카드 list gap `12px`; 639 이하는 카드 내부도 단일 열이다.
- INFERRED | confidence HIGH | 배경 레이어만 `transform:scale(1.03)`로 blur 가장자리 노출을 막는다.

### P01-S05 DOM and Layout

- INFERRED | confidence HIGH | DOM: `section.shop > header + ul.product-grid > li.product-card*3`.
- INFERRED | confidence HIGH | desktop은 `repeat(3,244px)`를 중앙 정렬하고 gap `13px`를 둔다.
- INFERRED | confidence HIGH | 768은 `repeat(2,minmax(0,1fr))`, 639 이하는 `1fr`다.
- INFERRED | confidence HIGH | product media는 `aspect-ratio:214/155`, `object-fit:contain`, 카드 텍스트 영역은 고정 min-height `82px`다.
- INFERRED | confidence HIGH | 불완전 마지막 행은 `justify-content:start`가 아니라 grid 중앙 축과 정렬되도록 wrapper를 중앙 배치한다.

### P01-S06 DOM and Layout

- INFERRED | confidence HIGH | DOM: `section.variants > header + div.variant-track > figure*3 + a.cta`.
- INFERRED | confidence HIGH | desktop grid는 `repeat(3,minmax(0,1fr))`, inner width `90%`, gap `7.7%`다.
- INFERRED | confidence HIGH | figure는 `min-width:0`, image는 `width:100%;height:100%;object-fit:contain`이다.
- INFERRED | confidence HIGH | 639 이하는 `grid-auto-flow:column;grid-auto-columns:78%;overflow-x:auto;scroll-snap-type:x mandatory`다.
- INFERRED | confidence HIGH | mobile track의 좌우 scroll padding은 `16px`, item gap은 `12px`다.

### P01-S07 DOM and Layout

- INFERRED | confidence HIGH | DOM: `section.reviews > header + div.review-viewport > ul.review-track > li.review-card*5+`.
- INFERRED | confidence HIGH | desktop track는 중앙 카드 기준 absolute 또는 translate 기반이며 viewport `overflow:hidden`이다.
- INFERRED | confidence HIGH | 활성 카드 z-index `3`, 인접 `2`, 끝 카드 `1`; shadow는 `0 8px 24px rgba(34,34,34,.10)`다.
- INFERRED | confidence HIGH | mobile은 transform 회전을 `±3deg`로 줄이고 `grid-auto-columns:88%` 스냅 트랙으로 바꾼다.
- INFERRED | confidence HIGH | 후기 본문은 4줄 clamp, 작성자/역할은 마지막 행에 고정한다.

### P01-S08 DOM and Layout

- INFERRED | confidence HIGH | DOM: `section.journal > div.feature-media + div.article-list > article*4`.
- INFERRED | confidence HIGH | desktop은 `grid-template-columns:1fr 1fr`, gap `0`; 두 열의 min-height는 `647px`다.
- INFERRED | confidence HIGH | article은 `grid-template-columns:140px 1fr`, gap `24px`, align-items center다.
- INFERRED | confidence HIGH | 767 이하는 media `aspect-ratio:4/3`, 목록은 아래에 오며 article은 `grid-template-columns:96px 1fr`다.
- INFERRED | confidence HIGH | 썸네일은 `aspect-ratio:14/10`, `object-fit:cover`, focal point는 데이터 필드로 관리한다.

### P01-S09 DOM and Layout

- INFERRED | confidence HIGH | DOM: `aside.community > header + div.feed-viewport > ul.feed-track > li > a > img`.
- INFERRED | confidence HIGH | desktop track는 `grid-auto-flow:column;grid-auto-columns:160px`, gap `10px`, 중앙 정렬을 위해 양끝 spacer를 둔다.
- INFERRED | confidence HIGH | 768 이하는 item `132px`, 390은 `128px`, 360은 `116px`다.
- INFERRED | confidence HIGH | 이미지 aspect는 `1/1`, `object-fit:cover`; 포커스 링이 잘리지 않도록 viewport padding `4px`를 둔다.

### P01-S10 DOM and Layout

- INFERRED | confidence HIGH | DOM: `footer > picture.bg + div.footer-grid(brand,nav,legal,contact,social) + button.back-top`.
- INFERRED | confidence HIGH | desktop grid는 `220px 1fr 280px`, 행 gap `36px`, inner width `90.3%`다.
- INFERRED | confidence HIGH | 768은 `grid-template-columns:1fr 1fr`, 639 이하는 `1fr`로 전환한다.
- INFERRED | confidence HIGH | footer 배경은 `cover center`, 위에 `rgba(22,128,151,.50)` overlay를 둔다.
- INFERRED | confidence HIGH | back-top은 `position:absolute;right:12px;bottom:15px`이고 mobile은 `right:16px;bottom:16px`다.

## 8. Component Abstraction

### Component Tree

```text
AppShell
├── SkipLink
├── SiteHeader [P01-S01]
│   ├── ProjectLogo
│   ├── PrimaryNav
│   ├── HeaderActions
│   └── MobileNavDrawer
├── HomePage [P-01]
│   ├── HeroCarousel [P01-S02]
│   ├── ProcessSection [P01-S03]
│   │   └── ProcessCard ×4
│   ├── UpdateSection [P01-S04]
│   │   └── UpdateCard ×3
│   ├── ShopSection [P01-S05]
│   │   └── ProductCard ×3
│   ├── VariantShowcase [P01-S06]
│   │   └── VariantFigure ×3
│   ├── ReviewCarousel [P01-S07]
│   │   └── ReviewCard ×5+
│   ├── JournalSection [P01-S08]
│   │   ├── FeatureMediaCarousel
│   │   └── JournalRow ×4
│   └── CommunityFeed [P01-S09]
└── SiteFooter [P01-S10]
    └── BackToTopButton
```

### Component Contracts

| 등급 | component / mapping | responsibility | props/types and slots | state/events | data + async states | accessibility |
| --- | --- | --- | --- | --- | --- | --- |
| INFERRED | AppShell / all | global landmarks, tokens, error boundary | `page:PageModel`, `children:Node` | `route`, `theme` | fatal error fallback | document lang, skip target |
| INFERRED | SiteHeader / S01 | primary navigation | `items:NavItem[]`, `activeId?:string`, `actions:ActionItem[]` | `menuOpen`, `scrolled`; `onNavigate` | static; disabled target | nav label, current page |
| INFERRED | MobileNavDrawer / S01 | small-screen menu | `open:boolean`, `items`, `onClose` | focus trap, submenu ids | no loading | dialog/nav semantics, Escape |
| INFERRED | ProjectLogo / S01 | home identity | `src`, `alt`, `href='/'` | hover/focus | image failure→text name | meaningful alt |
| INFERRED | HeroCarousel / S02 | lead story/media | `slides:HeroSlide[]`, `initialIndex=0`, `autoplay=false` | `index`, `paused`; prev/next/select | poster loading, empty fallback | region label, status text |
| INFERRED | ProcessSection / S03 | explain 4 steps | `title`, `body`, `steps:ProcessStep[4]` | none | skeleton/empty message | ordered list |
| INFERRED | ProcessCard / S03 | one process step | `stepNo:int`, `title`, `body`, `image`, `href?` | hover/focus | broken image fallback | heading, descriptive alt |
| INFERRED | UpdateSection / S04 | latest project news | `intro`, `items:UpdateItem[3+]` | selected optional | loading/empty/error | section labelled by h2 |
| INFERRED | UpdateCard / S04 | update preview | `title`, `summary`, `image`, `href`, `date?` | hover/focus/pressed | image fallback | article + link name |
| INFERRED | ShopSection / S05 | sell/show digital items | `items:ShopItem[3]`, `currency` | cart busy/error | loading/empty/error | list, price announcement |
| INFERRED | ProductCard / S05 | item summary + CTA | `item`, `onAdd?(id)`, `disabled` | idle/loading/success/error | availability | button busy/live status |
| INFERRED | VariantShowcase / S06 | compare visual variants | `variants:Variant[3]`, `selectedId?` | selected, scroll index | image loading | radiogroup only if selectable |
| INFERRED | ReviewCarousel / S07 | player feedback track | `reviews:Review[5+]`, `initialIndex` | index, dragging | loading/empty | carousel region, controls |
| INFERRED | ReviewCard / S07 | one testimonial | `title`, `body`, `author`, `image?` | active/inactive | optional media | figure/blockquote semantics |
| INFERRED | JournalSection / S08 | feature media + articles | `featureSlides`, `entries:JournalEntry[4]` | feature index | partial loading/errors | labelled section |
| INFERRED | JournalRow / S08 | article teaser | `entry`, `compact:boolean` | hover/focus | image fallback | article heading link |
| INFERRED | CommunityFeed / S09 | community images | `items:CommunityItem[8+]`, `sourceLabel` | dragging | loading/empty/error | list; external link notice |
| INFERRED | SiteFooter / S10 | secondary nav/legal/contact | `groups`, `legal`, `contact`, `socials` | none | static | contentinfo, list semantics |
| INFERRED | BackToTopButton / S10 | scroll to page start | `targetId='top'` | pressed | none | label `맨 위로`, focus retained |

- INFERRED | confidence HIGH | shared state는 route, nav drawer, reduced-motion preference뿐이며 각 carousel index는 해당 컴포넌트가 소유한다.
- INFERRED | confidence HIGH | 상품 cart mutation은 page 전역 store가 아니라 commerce adapter가 소유하고 성공/오류를 ProductCard로 반환한다.
- INFERRED | confidence HIGH | empty 상태에서도 섹션 제목은 유지해 페이지 구조가 갑자기 붕괴하지 않게 한다.
- INFERRED | confidence HIGH | disabled 링크는 `a`를 흉내 낸 div가 아니라 버튼 또는 `aria-disabled` 링크로 구현한다.

## 9. Design Tokens and Exact Color Specification

### Color Tokens

| 등급 | token | HEX | RGB | HSL | alpha | role | usage | evidence source | confidence | tolerance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| INFERRED | `--c-bg` | `#F4F4F4` | `rgb(244, 244, 244)` | `hsl(0, 0%, 95.7%)` | `1` | page background | S06/body | E-D02 global y2321 direct pixel | HIGH | `ΔE≤3` |
| INFERRED | `--c-surface` | `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)` | `1` | card/white band | S03/S08/S09 | E-D03 palette 32.2% | HIGH | `ΔE≤3` |
| INFERRED | `--c-surface-warm` | `#F7F0EA` | `rgb(247, 240, 234)` | `hsl(28, 44.8%, 94.3%)` | `1` | warm commerce band | S05 | E-D02 global y1780 direct pixel | HIGH | `ΔE≤3` |
| INFERRED | `--c-text` | `#222222` | `rgb(34, 34, 34)` | `hsl(0, 0%, 13.3%)` | `1` | primary text | light sections | E-D03 palette 3.86% | HIGH | `ΔE≤3` |
| INFERRED | `--c-text-muted` | `#6B6B66` | `rgb(107, 107, 102)` | `hsl(60, 2.4%, 41%)` | `1` | body/meta | cards/footer details | visual estimate from E-D02/D03 | MEDIUM | `ΔE≤4` |
| INFERRED | `--c-border` | `#DDDDDD` | `rgb(221, 221, 221)` | `hsl(0, 0%, 86.7%)` | `1` | divider/border | S05/S08/menu | E-D01/D02/D03 palettes | HIGH | `ΔE≤3` |
| INFERRED | `--c-primary` | `#55AABB` | `rgb(85, 170, 187)` | `hsl(190, 42.5%, 53.3%)` | `1` | CTA/accent | buttons, badge | E-D04 palette 14.16% + visible CTA family | MEDIUM | `ΔE≤4` |
| INFERRED | `--c-primary-hover` | `#4499AA` | `rgb(68, 153, 170)` | `hsl(190, 42.9%, 46.7%)` | `1` | hover | CTA hover | E-D04 palette 14.90% | MEDIUM | `ΔE≤4` |
| INFERRED | `--c-primary-pressed` | `#338899` | `rgb(51, 136, 153)` | `hsl(190, 50%, 40%)` | `1` | pressed | CTA pressed | E-D04 palette 2.81% | MEDIUM | `ΔE≤4` |
| INFERRED | `--c-secondary` | `#CCDDDD` | `rgb(204, 221, 221)` | `hsl(180, 20%, 83.3%)` | `1` | pale accent | S03 atmosphere | E-D01 palette 4.47% | MEDIUM | `ΔE≤4` |
| INFERRED | `--c-success` | `#2E7D32` | `rgb(46, 125, 50)` | `hsl(123, 46.2%, 33.5%)` | `1` | success | cart/status only | not visible; accessible decision | LOW | `ΔE≤3` |
| INFERRED | `--c-warning` | `#A35C00` | `rgb(163, 92, 0)` | `hsl(34, 100%, 32%)` | `1` | warning | availability status | not visible; accessible decision | LOW | `ΔE≤3` |
| INFERRED | `--c-danger` | `#B3261E` | `rgb(179, 38, 30)` | `hsl(3, 71.3%, 41%)` | `1` | error | form/cart error | not visible; accessible decision | LOW | `ΔE≤3` |
| INFERRED | `--c-overlay` | `#111100` | `rgb(17, 17, 0)` | `hsl(60, 100%, 3.3%)` | `.48` | image overlay | hero/drawer | E-D01 palette 2.49% + visual | MEDIUM | alpha `±.04` |
| INFERRED | `--c-focus` | `#00A6C7` | `rgb(0, 166, 199)` | `hsl(190, 100%, 39%)` | `1` | focus ring | all controls | not directly visible | MEDIUM | `ΔE≤3` |
| INFERRED | `--c-disabled` | `#AAAAAA` | `rgb(170, 170, 170)` | `hsl(0, 0%, 66.7%)` | `.45` | disabled | text/control | E-D02 palette 1.61% + decision | MEDIUM | alpha `±.03` |
| INFERRED | `--c-header-glass` | `#5F5F5F` | `rgb(95, 95, 95)` | `hsl(0, 0%, 37.3%)` | `.52` | translucent header | S01 | E-D01 visible overlay estimate | LOW | `ΔE≤5`, alpha `±.05` |
| INFERRED | `--c-footer-overlay` | `#168097` | `rgb(22, 128, 151)` | `hsl(191, 74%, 33.9%)` | `.50` | footer tint | S10 | E-D04 cyan palettes | MEDIUM | `ΔE≤5`, alpha `±.05` |

- MEASURED | confidence HIGH | palette 값은 JPEG 축소 픽셀 통계이며 원 CSS 토큰의 직접 증명은 아니다.
- INFERRED | confidence HIGH | 사진의 `#442200`, `#221100` 등은 콘텐츠 이미지 색이므로 UI 토큰으로 사용하지 않는다.

### Non-Color Tokens

| 등급 | category | tokens and exact values | confidence |
| --- | --- | --- | --- |
| INFERRED | spacing | `--sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:20px; --sp-6:24px; --sp-8:32px; --sp-10:40px; --sp-12:48px; --sp-16:64px; --sp-20:80px; --sp-24:96px` | HIGH |
| INFERRED | dimensions | `--header-d:77px; --header-m:64px; --touch:44px; --container:1296px; --compact:912px` | HIGH |
| INFERRED | radius | `--r-sm:4px; --r-md:8px; --r-lg:10px; --r-pill:999px` | HIGH |
| INFERRED | border | `--border-1:1px solid var(--c-border); --focus:2px solid var(--c-focus)` | HIGH |
| INFERRED | shadows | `--shadow-card:0 8px 24px rgb(34 34 34/.10); --shadow-focus:0 0 0 4px rgb(0 166 199/.22)` | MEDIUM |
| INFERRED | opacity | `--op-muted:.72; --op-disabled:.45; --op-overlay:.48` | HIGH |
| INFERRED | z-index | `--z-content:0; --z-decoration:1; --z-media:2; --z-header:50; --z-drawer:60; --z-skip:100` | HIGH |
| INFERRED | breakpoints | `--bp-sm:640px; --bp-md:768px; --bp-nav:900px; --bp-lg:1024px; --bp-xl:1280px; --bp-2xl:1440px` | HIGH |
| INFERRED | icon sizes | `--icon-sm:16px; --icon-md:20px; --icon-lg:24px` | HIGH |
| INFERRED | motion | `--dur-fast:80ms; --dur-ui:160ms; --dur-panel:220ms; --ease-out:cubic-bezier(.2,.8,.2,1)` | HIGH |

- MEASURED | confidence MEDIUM | 예외 간격은 process card desktop gap `11px`, product grid gap `13px`, social tile gap `10px`이며 prepared 증거를 맞추기 위해 scale 외 토큰 예외로 유지한다.

```css
:root{
  --c-bg:#f4f4f4;--c-surface:#fff;--c-surface-warm:#f7f0ea;
  --c-text:#222;--c-text-muted:#6b6b66;--c-border:#ddd;
  --c-primary:#55aabb;--c-primary-hover:#4499aa;--c-primary-pressed:#338899;
  --c-secondary:#ccdddd;--c-success:#2e7d32;--c-warning:#a35c00;--c-danger:#b3261e;
  --c-overlay:rgb(17 17 0/.48);--c-focus:#00a6c7;--c-disabled:rgb(170 170 170/.45);
  --sp-1:4px;--sp-2:8px;--sp-3:12px;--sp-4:16px;--sp-6:24px;--sp-8:32px;--sp-12:48px;--sp-16:64px;
  --r-sm:4px;--r-md:8px;--r-lg:10px;--r-pill:999px;
  --shadow-card:0 8px 24px rgb(34 34 34/.10);
  --dur-fast:80ms;--dur-ui:160ms;--dur-panel:220ms;--ease-out:cubic-bezier(.2,.8,.2,1);
}
```

## 10. Typography Matrix

- UNKNOWN | confidence HIGH | 원본 웹폰트 이름과 파일은 스크린샷만으로 확인할 수 없다.
- INFERRED | confidence HIGH | 구현 family는 한국어 `Pretendard, "Noto Sans KR", system-ui, sans-serif`; 영문도 같은 스택을 사용해 혼합 지표를 안정화한다.
- INFERRED | confidence HIGH | 폰트는 self-host WOFF2, `font-display:swap`, 400/500/600/700 네 weight로 공급한다.

| 등급 | role | size px/rem desktop → mobile | weight | line-height px/unitless | letter spacing | case/decor | align/max-width | wrap | mapping/confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| INFERRED | nav label | `14/.875 → 15/.9375` | 500 | `20/1.43 → 22/1.47` | `0` | none | center/none | nowrap | S01, MEDIUM |
| INFERRED | utility text | `11/.6875 → 12/.75` | 500 | `16/1.45 → 18/1.5` | `0` | none | right/120px | nowrap | S01, LOW |
| INFERRED | hero eyebrow | `14/.875 → 13/.8125` | 600 | `20/1.43 → 18/1.38` | `0` | none | left/360px | 1 line | S02, LOW |
| INFERRED | hero title | `40/2.5 → 32/2` | 700 | `52/1.3 → 42/1.31` | `0` | none | left/430px | max 3 lines | S02, HIGH |
| INFERRED | hero body | `15/.9375 → 14/.875` | 500 | `24/1.6 → 22/1.57` | `0` | none | left/390px | max 4 lines | S02, MEDIUM |
| INFERRED | section title | `30/1.875 → 26/1.625` | 600 | `40/1.33 → 36/1.38` | `0` | none | center/620px | balanced 2 lines | S03-S09, HIGH |
| INFERRED | section body | `14/.875 → 14/.875` | 400 | `22/1.57` | `0` | none | center/520px | max 3 lines | S03/S04, MEDIUM |
| INFERRED | step label | `12/.75 → 12/.75` | 600 | `18/1.5` | `0` | uppercase only data | left/none | nowrap | S03, MEDIUM |
| INFERRED | card title | `17/1.0625 → 17/1.0625` | 600 | `24/1.41` | `0` | none | left/100% | max 2 lines | S03-S07, HIGH |
| INFERRED | card body | `13/.8125 → 14/.875` | 400 | `20/1.54 → 22/1.57` | `0` | none | left/100% | 3-4 line clamp | S03/S04/S07, MEDIUM |
| INFERRED | card meta | `12/.75 → 12/.75` | 500 | `18/1.5` | `0` | none | left/100% | 1 line ellipsis | S07/S08, MEDIUM |
| INFERRED | product name | `16/1 → 16/1` | 500 | `24/1.5` | `0` | none | left/100% | 2 lines | S05, HIGH |
| INFERRED | price | `16/1 → 16/1` | 600 | `24/1.5` | `0` | tabular nums | left/100% | nowrap | S05, HIGH |
| INFERRED | control label | `13/.8125 → 15/.9375` | 600 | `18/1.38 → 22/1.47` | `0` | none | center/100% | nowrap | CTAs, HIGH |
| INFERRED | journal tag | `11/.6875 → 11/.6875` | 600 | `16/1.45` | `0` | uppercase allowed | left/100% | nowrap | S08, MEDIUM |
| INFERRED | journal title | `18/1.125 → 16/1` | 600 | `26/1.44 → 23/1.44` | `0` | none | left/100% | max 2 lines | S08, HIGH |
| INFERRED | caption | `12/.75 → 12/.75` | 400 | `18/1.5` | `0` | none | left/100% | max 2 lines | media, MEDIUM |
| INFERRED | form label/error | `14/.875` | 500/600 | `20/1.43` | `0` | none | left/100% | wrap | unseen support, LOW |
| INFERRED | community handle | `26/1.625 → 21/1.3125` | 600 | `34/1.31 → 29/1.38` | `0` | none | center/360px | anywhere | S09, HIGH |
| INFERRED | footer nav | `13/.8125 → 14/.875` | 600 | `20/1.54 → 22/1.57` | `0` | uppercase by data | left | wrap | S10, MEDIUM |
| INFERRED | footer legal | `11/.6875 → 12/.75` | 400 | `18/1.64 → 19/1.58` | `0` | none | left/650px | normal | S10, MEDIUM |
| INFERRED | footer contact | `34/2.125 → 26/1.625` | 700 | `42/1.24 → 34/1.31` | `0` | tabular nums | right→left | nowrap | S10, HIGH |

## 11. Asset and Icon Manifest

| 등급 | asset ID | page/section | role/evidence crop | display prepared | aspect/crop/focal | responsive/loading/format | alt behavior | replacement strategy/confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OBSERVED | A-LOGO-H | P01-S01 | 원본 워드마크, E-D01 `59,39,75,23` | `75×23px` | 약 `3.26:1`, contain | eager SVG/PNG | 새 프로젝트명 | 신규 로고 필수, HIGH |
| OBSERVED | A-HERO-01 | P01-S02 | 조리 장면, E-D01 `0,0,1200,580` | `1200×580px` | `2.07:1`, cover, `68% 50%` | eager AVIF/WebP + poster | 장면 목적 설명 | 새 게임 캡처/촬영, HIGH |
| OBSERVED | A-PROCESS-01..04 | P01-S03 | 스케치·재료·제작·마감 이미지 | 각 `229×123px` | `1.862:1`, cover center | lazy WebP | 각 단계 정보 | 새 개발 과정 이미지, HIGH |
| OBSERVED | A-UPDATES-BG | P01-S04 | 흐린 음식 배경 | `1200×580px` | `2.07:1`, cover center | lazy AVIF, blur layer | empty alt | 새 조리 장면, HIGH |
| OBSERVED | A-UPDATE-01..03 | P01-S04 | 계절/사용/출시 카드 사진 | 각 약 `260×180px` | `1.44:1`, cover | lazy WebP | 카드 제목 보완 | 새 뉴스 이미지, HIGH |
| OBSERVED | A-PRODUCT-01..03 | P01-S05 | 흰 배경 제품 컷아웃 | 각 `214×155px` | contain, center | lazy transparent WebP | 상품명 | Godot 아이템 렌더, HIGH |
| OBSERVED | A-VARIANT-01..03 | P01-S06 | 대형 색상 변형 | 각 약 `250×363px` | `0.69:1`, contain | lazy WebP/AVIF | 색상·변형명 | 신규 3D/2D 렌더, HIGH |
| OBSERVED | A-REVIEW-01..05 | P01-S07 | 생활 사진이 든 후기 카드 | 약 `230×130px` | `1.77:1`, cover | lazy WebP | 후기 맥락 | 플레이테스트 스크린샷/허가 사진, HIGH |
| OBSERVED | A-JOURNAL-FEATURE | P01-S08 | 좌측 큰 조리 사진 | `600×647px` | `0.927:1`, cover, `50% 48%` | lazy AVIF | 해당 개발 기록 설명 | 새 프로젝트 장면, HIGH |
| OBSERVED | A-JOURNAL-01..04 | P01-S08 | 기사 썸네일 4개 | 각 `140×99px` | `1.414:1`, cover | lazy WebP | 빈 alt, 링크명은 제목 | 새 저널 썸네일, HIGH |
| OBSERVED | A-COMMUNITY-01..08+ | P01-S09 | 소셜 정사각 타일 | 각 약 `160×161px` | `1:1`, cover | lazy WebP | 작성자/내용 요약 | 허가된 커뮤니티 이미지, HIGH |
| OBSERVED | A-FOOTER-BG | P01-S10 | 청록 식재료/액체 배경 | `1200×314px` | `3.82:1`, cover center | lazy AVIF | empty alt | 새 수중/재료 사진, HIGH |

### Icon Mapping

| 등급 | visible icon | library equivalent | bounds/stroke | alignment | confidence |
| --- | --- | --- | --- | --- | --- |
| OBSERVED | hero 이전/다음 | Lucide `ChevronLeft/Right` | visual `16×24px`, stroke `2px`, target `44px` | optical center | HIGH |
| OBSERVED | 카드 이동 | Lucide `ArrowUpRight` | `14×14px`, stroke `1.75px` | top-right | HIGH |
| OBSERVED | 로그인 형태 | Lucide `LogIn` | `16×16px`, stroke `1.75px` | center | MEDIUM |
| OBSERVED | 사용자 | Lucide `UserRound` | `16×16px`, stroke `1.75px` | center | HIGH |
| OBSERVED | 장바구니 | Lucide `ShoppingBag` | `16×16px`, stroke `1.75px` | center+badge | HIGH |
| OBSERVED | 구매/가방 작은 아이콘 | Lucide `ShoppingBag` | `16×16px` in `28px` circle | lower-right of media | MEDIUM |
| OBSERVED | 푸터 소셜 3개 | 서비스별 공식 아이콘 또는 `Instagram/Facebook` | `20×20px` in `36px` circles | baseline center | MEDIUM |
| OBSERVED | 맨 위로 | Lucide `ArrowUp` | `16×16px` in `36px` circle | optical y `-1px` | HIGH |

- INFERRED | confidence HIGH | 원본 로고와 고유 일러스트를 SVG 트레이싱하지 않는다.
- INFERRED | confidence HIGH | LCP 히어로만 `fetchpriority=high`; 나머지는 viewport `300px` 전부터 lazy load한다.

## 12. Responsive Behavior Matrix

### Global and Navigation

| 등급 | property | 1440 | 1280 | 1024 | 768 | 390 | 360 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| INFERRED | global gutter | `72px` | `64px` | `51px` | `24px` | `16px` | `16px` |
| INFERRED | main container | `1296px` | `1152px` | `922px` | `720px` | `358px` | `328px` |
| INFERRED | header mode | overlay full nav | overlay full nav | overlay full nav | fixed compact | fixed compact | fixed compact |
| INFERRED | header height | `77px` | `72px` | `68px` | `64px` | `64px` | `60px` |
| INFERRED | visible nav | 3 text+3 icons | 동일 | 동일 | logo+menu | logo+menu | logo+menu |
| INFERRED | drawer width | n/a | n/a | n/a | `320px` | `320px` | `295px` |

### P01 Major Sections

| 등급 | component/property | 1440 | 1280 | 1024 | 768 | 390 | 360 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| INFERRED | hero height | `696px` | `619px` | `525px` | `520px` | `580px` | `560px` |
| INFERRED | hero title | `40px` | `38px` | `36px` | `34px` | `32px` | `30px` |
| INFERRED | hero image crop | `68% 50%` | `68% 50%` | `65% 50%` | `62% 50%` | `60% 50%` | `60% 50%` |
| INFERRED | process columns | `4` | `4` | `2` | `2` | `1` | `1` |
| INFERRED | process card gap | `14px` | `12px` | `16px` | `16px` | `12px` | `12px` |
| INFERRED | process section pad-y | `88/86px` | `80/80px` | `72/72px` | `64/64px` | `56/56px` | `48/48px` |
| INFERRED | updates columns | `38/62%` | `38/62%` | `36/64%` | `1` | `1` | `1` |
| INFERRED | update card layout | image/text | image/text | image/text | image/text | stacked | stacked |
| INFERRED | products columns | `3` | `3` | `3` | `2` | `1` | `1` |
| INFERRED | compact width | `912px` | `810px` | `648px` | `600px` | `358px` | `328px` |
| INFERRED | variant mode | 3-col | 3-col | 3-col | 3-col | 78% snap | 78% snap |
| INFERRED | variant image height | `436px` | `388px` | `310px` | `270px` | `350px` | `328px` |
| INFERRED | review visible | `3+2 clipped` | `3+2` | `3` | `2.3` | `1.08` | `1.08` |
| INFERRED | review card width | `318px` | `283px` | `250px` | `282px` | `315px` | `288px` |
| INFERRED | journal columns | `1fr 1fr` | `1fr 1fr` | `1fr 1fr` | `42% 58%` | `1` | `1` |
| INFERRED | journal thumb | `168×119px` | `149×105px` | `119×84px` | `112×79px` | `96×68px` | `88×62px` |
| INFERRED | social tile | `192px` | `171px` | `137px` | `132px` | `128px` | `116px` |
| INFERRED | footer columns | `220/1fr/280` | `200/1fr/250` | `180/1fr/230` | `1fr 1fr` | `1` | `1` |
| INFERRED | footer min-height | `377px` | `335px` | `300px` | `430px` | `610px` | `620px` |

- MEASURED | confidence HIGH | E-M01은 모든 요소를 약 `0.2025×` 유지하며, 사용 가능한 모바일 타입·터치 크기를 직접 제공하지 않는다.
- INFERRED | confidence HIGH | breakpoint `900px`은 내비게이션이 drawer로 바뀌는 행동 경계다.
- INFERRED | confidence HIGH | breakpoint `768px`은 업데이트 소개가 상단으로 이동하고 푸터가 2열로 바뀌는 경계다.
- INFERRED | confidence HIGH | breakpoint `640px`은 process/product가 1열, variant/review가 수평 스냅, journal이 완전 적층되는 경계다.
- INFERRED | confidence HIGH | 390/360에서 모든 본문은 최소 `14px`, 컨트롤은 최소 `44px`이므로 E-M01의 축소 크기를 그대로 구현하지 않는다.

## 13. Interaction and Motion State Matrix

| 등급 | component/state | trigger | visual delta | duration/easing | focus/keyboard | reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| INFERRED | text link hover | pointer enter | text `#55AABB`, underline offset `3px` | `160ms ease-out` | focus는 ring 추가 | 색 변화 즉시 |
| INFERRED | button hover | pointer enter | bg `#4499AA`, shadow `0 4px 12px #2222` | `160ms ease-out` | focus ring 유지 | transform 없음 |
| INFERRED | button pressed | down/Enter/Space | bg `#338899`, scale `.98` | `80ms ease-out` | Space는 click 발생 | scale 제거 |
| INFERRED | button disabled | disabled prop | opacity `.45`, cursor default | `0ms` | focus 제외, 사유 제공 | 동일 |
| INFERRED | nav drawer open | menu click | panel `translateX(100%→0)`, overlay `.48` | `220ms cubic-bezier(.2,.8,.2,1)` | focus trap, Escape | 즉시 표시 |
| INFERRED | hero prev/next | click/swipe/arrow | old opacity `1→0`, new `0→1` | `400ms ease-out` | buttons + status live polite | `0ms` crossfade |
| UNKNOWN | hero autoplay | timer | 증거 없음, 기본 `false` 결정 | n/a | 사용자가 시작하지 않음 | 항상 off |
| INFERRED | process card hover | pointer | image scale `1→1.02`, arrow bg primary | `180ms ease-out` | 전체 카드 링크 ring | scale 제거 |
| INFERRED | update card hover | pointer | bg alpha `.60→.68`, image scale `1.015` | `180ms ease-out` | 제목 링크 focus | scale 제거 |
| INFERRED | product add loading | click | label→`처리 중`, spinner `16px`, disabled | spinner `700ms linear` | `aria-busy=true` | 정적 진행 아이콘 |
| INFERRED | product success | mutation resolved | bg success `#2E7D32`, label `추가됨` | `1500ms` 유지 | polite live message | 동일 |
| INFERRED | product error | mutation reject | `2px #B3261E`, inline error | `0ms` | 오류로 focus 이동 안 함 | 동일 |
| INFERRED | variant selected | click/radio | outline `2px #55AABB`, check icon | `160ms` | arrows change radio | 즉시 |
| INFERRED | review drag | pointer/touch | track translate, snap | release `260ms ease-out` | prev/next buttons 병행 | 즉시 snap |
| INFERRED | review active | index change | rotate `0`, z3, opacity1 | `260ms ease-out` | status announces `n/N` | transform 제거 |
| INFERRED | journal row hover | pointer | title primary, thumb opacity `.92` | `160ms` | link focus ring | 즉시 |
| INFERRED | social tile hover | pointer | image scale `1.025`, overlay `.08` | `180ms` | link focus ring | scale 제거 |
| INFERRED | back to top | click | scroll to `#top` | `400ms` smooth | focus를 skip target로 이동 | `scroll:auto` |
| UNKNOWN | tabs | not visible | 컴포넌트 없음 | n/a | n/a | n/a |
| UNKNOWN | accordion | not visible | 모바일 내비 하위 메뉴 외 사용하지 않음 | n/a | n/a | n/a |
| UNKNOWN | form | not visible | 페이지 본문에 생성하지 않음 | n/a | n/a | n/a |
| UNKNOWN | modal | not visible | 초기 구현에 생성하지 않음 | n/a | n/a | n/a |

- INFERRED | confidence HIGH | 모든 hover 변화는 `(hover:hover)` 조건에서만 적용한다.
- INFERRED | confidence HIGH | 캐러셀은 키보드 사용자를 가두지 않으며 좌우 화살표 키는 해당 carousel 내부에 focus가 있을 때만 소비한다.
- UNKNOWN | confidence HIGH | 원본 easing, duration, 자동 재생 정책은 이미지로 알 수 없다.

## 14. Accessibility Contract

- INFERRED | confidence HIGH | landmark 순서는 `header`, `nav`, `main`, 섹션 7개, `aside` community, `footer`다.
- INFERRED | confidence HIGH | heading 순서는 P-01에 `h1` 1개, 각 P01-S03~S09에 `h2`, 카드·기사에 `h3`다.
- INFERRED | confidence HIGH | 첫 focusable은 `본문으로 건너뛰기`; focus 시 좌상단 `16px` 위치에 나타나고 `#main`으로 이동한다.
- INFERRED | confidence HIGH | 키보드 순서는 헤더 로고→주요 메뉴→액션→히어로 제어→문서 순서의 카드 링크→푸터 링크→맨 위로다.
- INFERRED | confidence HIGH | focus ring은 `2px solid #00A6C7`, offset `3px`, 대비가 부족한 청록 배경에서는 흰색 `2px` 외곽 링을 추가한다.
- INFERRED | confidence HIGH | 모든 아이콘 단독 버튼은 화면 이름과 동일한 `aria-label`을 가진다.
- INFERRED | confidence HIGH | 의미 있는 이미지 alt는 보이는 사물보다 카드 목적을 설명하고, 중복 썸네일·배경·blur 이미지는 `alt=""`다.
- INFERRED | confidence HIGH | hero/review carousel 변경은 `aria-live=polite` 상태 텍스트로만 알리고 전체 slide DOM을 live region에 넣지 않는다.
- INFERRED | confidence HIGH | 장바구니 결과와 partial error는 `role=status` 또는 `role=alert`를 용도에 맞게 사용한다.
- INFERRED | confidence HIGH | 입력 폼은 현재 화면에 없지만 향후 오류는 `aria-describedby`, `aria-invalid`, 텍스트 메시지를 함께 사용해야 한다.
- INFERRED | confidence HIGH | 평문 대비 목표는 `4.5:1`, 24px 이상 또는 19px bold 큰 글자는 `3:1`, UI 경계·focus는 `3:1`이다.
- INFERRED | confidence HIGH | hero/footer 사진 위 텍스트는 overlay를 조정해 실제 asset별 contrast를 자동 테스트한다.
- INFERRED | confidence HIGH | `prefers-reduced-motion:reduce`에서는 autoplay off, smooth scroll off, transform 애니메이션 제거, 상태 변경 duration `0ms`다.
- INFERRED | confidence HIGH | 200% zoom에서 360 CSS px에 수평 body overflow가 없어야 하며 모든 텍스트가 잘림 없이 reflow한다.
- INFERRED | confidence HIGH | 최소 touch target은 `44×44px`, 인접 target 간 시각 간격은 최소 `8px`다.
- INFERRED | confidence HIGH | mobile menu button은 `aria-controls`, `aria-expanded`, 이름 `메뉴 열기/닫기`를 상태에 맞춰 갱신한다.
- INFERRED | confidence HIGH | drawer가 열리면 내부 첫 링크로 focus를 이동하고 Tab을 가두며 Escape로 닫고 버튼에 focus를 복원한다.
- INFERRED | confidence HIGH | 현재 페이지 링크는 `aria-current=page`로 공지하며 색상만으로 active를 표현하지 않는다.
- INFERRED | confidence HIGH | 수평 트랙에는 보이는 이전/다음 버튼 또는 `스크롤 가능한 콘텐츠` 이름을 제공하고 scrollbar를 완전히 숨기지 않는다.

## 15. Data and Content Model

### Entities

| 등급 | entity | fields/types | cardinality/order | optional/format/localization | states |
| --- | --- | --- | --- | --- | --- |
| INFERRED | `PageModel` | `title,locale,nav,sections,footer` | 1, section order fixed | locale `ko-KR` | loading/error shell |
| INFERRED | `NavItem` | `id,label,href,children?` | header 3 visible text items | children optional | disabled unseen target |
| INFERRED | `HeroSlide` | `id,title,body,image,alt,focalPoint,href?` | 3 inferred from dots | href optional; localized strings | poster/error |
| INFERRED | `ProcessStep` | `id,order,label,title,body,image,alt,href?` | exactly 4 ascending order | href optional | skeleton/empty invalid |
| INFERRED | `UpdateItem` | `id,title,summary,image,alt,href,publishedAt?` | at least 3 newest first | ISO date optional | loading/empty/error |
| INFERRED | `ShopItem` | `id,name,description?,price,currency,image,available,href?` | 3 featured, curated order | price integer minor unit | loading/busy/error |
| INFERRED | `Variant` | `id,name,colorHex,image,alt,selected?` | exactly 3 in evidence order | selection optional | image fallback |
| INFERRED | `Review` | `id,title,body,author,role?,image?,alt?` | 5+ curated order | role/image optional | loading/empty |
| INFERRED | `JournalEntry` | `id,tag,title,summary,image,alt,href,publishedAt?` | exactly 4 visible, newest first | date optional | partial error |
| INFERRED | `CommunityItem` | `id,image,alt,author?,href?` | 8+ curated/API order | author/href optional | loading/empty/error |
| INFERRED | `FooterModel` | `groups,legalLines,contact,socials` | 1 | business fields project-specific | static fallback |

- OBSERVED | confidence HIGH | 레퍼런스에 보이는 원문은 콘텐츠 역할 확인용 증거이며 fixture에 복제하지 않는다.
- INFERRED | confidence HIGH | 가격은 `Intl.NumberFormat('ko-KR',{style:'currency',currency})`와 동등하게 출력한다.
- INFERRED | confidence HIGH | 날짜가 제공되면 `YYYY. M. D.` 화면 형식과 machine-readable ISO `datetime`을 함께 사용한다.
- INFERRED | confidence HIGH | 텍스트 길이 한도는 hero title 60자, 카드 title 42자, summary 120자, review body 220자다.
- INFERRED | confidence HIGH | 서버 필드가 없을 때 빈 문자열을 렌더하지 않고 해당 선택 요소 전체를 생략한다.

### Sample Fixture Shape

```ts
type HomeFixture = {
  heroSlides: Array<{id:string; title:string; body:string; image:string; alt:string; focalPoint:`${number}% ${number}%`}>;
  processSteps: Array<{id:string; order:1|2|3|4; label:string; title:string; body:string; image:string; alt:string}>;
  updates: Array<{id:string; title:string; summary:string; image:string; alt:string; href:string}>;
  shopItems: Array<{id:string; name:string; price:number; currency:'KRW'; image:string; available:boolean}>;
  variants: Array<{id:string; name:string; colorHex:`#${string}`; image:string; alt:string}>;
  reviews: Array<{id:string; title:string; body:string; author:string; role?:string; image?:string}>;
  journalEntries: Array<{id:string; tag:string; title:string; summary:string; image:string; alt:string; href:string}>;
  communityItems: Array<{id:string; image:string; alt:string; author?:string; href?:string}>;
};
```

### Replaceable Fixture Content

| 등급 | section | evidence role | safe placeholder intent |
| --- | --- | --- | --- |
| INFERRED | S02 | 개인 조리 준비 메시지 | 플레이어가 재료와 도구를 준비하는 프로젝트 가치 제안 |
| INFERRED | S03 | 디자인→재료→기술→마감 | 기획→에셋→조리 시스템→빌드의 제작 단계 |
| INFERRED | S04 | 새 제품·사용 경험·공식몰 소식 | 데모 업데이트·새 레시피·릴리스 소식 |
| INFERRED | S05 | 3색 물리 제품과 가격 | DLC·사운드트랙·디지털 아트북 3개 |
| INFERRED | S06 | 3색 제품 비교 | 도구·주방·캐릭터 스킨 3개 |
| INFERRED | S07 | 생활 사용 후기 | 플레이테스터/커뮤니티 후기 |
| INFERRED | S08 | 잡지형 기사 4개 | 개발 저널·조리 시스템 설명 4개 |
| INFERRED | S09 | 공식 소셜 피드 | 프로젝트 커뮤니티 갤러리 |

## 16. Frontend Architecture

- INFERRED | confidence HIGH | reconstruction requirement는 route `/` 하나와 접근 가능한 web document이며 특정 프레임워크에 종속되지 않는다.
- INFERRED | confidence HIGH | 권장 구현 A는 semantic HTML/CSS/TypeScript shell에 Godot Web export를 프로젝트 데모 media로 격리하는 방식이다.
- INFERRED | confidence MEDIUM | 권장 구현 B는 Godot 4.x `Control`/`Container` 기반 전체 UI이지만 HTML export에서 접근성 DOM bridge를 추가해야 한다.
- INFERRED | confidence HIGH | 서버는 콘텐츠 JSON과 이미지 URL을 제공하고, carousel·drawer·cart feedback만 client state로 둔다.

```text
src/
  app/
    AppShell
    routes/home
  components/
    navigation/
    hero/
    cards/
    carousels/
    footer/
  data/
    home.schema
    home.fixture.ko
  styles/
    tokens.css
    global.css
    components/
  assets/
    brand/
    hero/
    process/
    products/
    journal/
    community/
godot/
  project.godot
  scenes/demo/
  scripts/
public/
  fonts/
  godot-web/
tests/
  visual/
  accessibility/
  unit/
```

- INFERRED | confidence HIGH | Godot-only 구조를 선택하면 `scenes/app_shell.tscn`, `pages/home_page.tscn`, `components/*.tscn`, `themes/site_theme.tres`, `data/home.ko.json`으로 같은 경계를 유지한다.
- INFERRED | confidence HIGH | styling은 global token + section-scoped class 또는 Godot Theme resource로 구성하고 좌표를 개별 absolute node에 흩뿌리지 않는다.
- INFERRED | confidence HIGH | asset 폴더는 소유권 확인된 신규 파일만 허용하고 원본 GDWEB 캡처를 production asset으로 포함하지 않는다.
- INFERRED | confidence HIGH | 데이터 schema validation은 route loader 또는 Godot JSON adapter 경계에서 한 번 수행한다.
- INFERRED | confidence HIGH | drawer open, carousel index, selected variant는 local state; locale, reduced motion, cart adapter는 shared service다.
- INFERRED | confidence HIGH | third-party carousel을 쓸 경우 focus, drag, reduced motion, SSR layout 안정성을 충족하는 검증된 라이브러리만 사용한다.
- INFERRED | confidence HIGH | Godot는 조리 상호작용·미니게임을 담당하고 문서 내비게이션·SEO·결제는 web shell 책임으로 분리한다.
- INFERRED | confidence HIGH | 이미지 변환 파이프라인은 AVIF/WebP와 `srcset`을 만들며 원본 비율·focal point metadata를 보존한다.
- INFERRED | confidence HIGH | 정적 섹션은 server-render 가능하고 drawer/carousel/cart control만 hydrate한다.
- INFERRED | confidence HIGH | 성능 예산은 초기 JS `≤180KB gzip`(Godot binary 제외), LCP 이미지 `≤300KB`, 기타 tile `≤120KB`다.

## 17. Implementation Task Graph

| 등급 | task ID | dependencies | inputs | outputs | affected IDs | completion criteria | parallel group |
| --- | --- | --- | --- | --- | --- | --- | --- |
| INFERRED | T-01 measurement harness | none | E-D01~04/E-M01, bounds | visual overlay scripts/config | all | 1200×5069 baseline과 viewport 캡처 생성 | A |
| INFERRED | T-02 content/legal replacement | none | asset manifest, content model | approved placeholder copy/assets list | all | 원본 로고·문구·사진 0개 | A |
| INFERRED | T-03 tokens | T-01 | section colors/metrics | token files/theme resource | all | section 9 값과 일치 | A |
| INFERRED | T-04 data schema/fixtures | T-02 | section 15 | validated fixtures | S02-S10 | 모든 cardinality·fallback 테스트 통과 | A |
| INFERRED | T-05 AppShell | T-03 | shell spec | landmarks, containers, error boundary | P-01 | skip link·no overflow | B |
| INFERRED | T-06 header/navigation | T-03,T-05 | nav geometry/states | responsive header+drawer | S01 | desktop bounds, mobile keyboard 계약 통과 | B |
| INFERRED | T-07 hero | T-03,T-04,T-05 | hero data/assets | HeroCarousel | S02 | bounds, contrast, controls 통과 | C |
| INFERRED | T-08 process+updates | T-03,T-04,T-05 | step/update data | S03/S04 sections | S03,S04 | desktop counts·mobile stack 일치 | C |
| INFERRED | T-09 shop+variants | T-03,T-04,T-05 | item/variant data | S05/S06 sections | S05,S06 | card geometry·busy/error·snap 통과 | C |
| INFERRED | T-10 reviews+journal | T-03,T-04,T-05 | review/journal data | S07/S08 sections | S07,S08 | clipping, 2-col/stack, keyboard 통과 | C |
| INFERRED | T-11 community+footer | T-03,T-04,T-05 | feed/footer data | S09/S10 sections | S09,S10 | track/footer bounds·links 통과 | C |
| INFERRED | T-12 responsive integration | T-06..T-11 | matrix | six viewport layouts | all | 1440/1280/1024/768/390/360 pass | D |
| INFERRED | T-13 interactions/motion | T-06..T-11 | state matrix | transitions and reduced motion | controls | mouse/touch/keyboard parity | D |
| INFERRED | T-14 accessibility audit | T-12,T-13 | accessibility contract | fixes + audit report | all | automated + manual keyboard pass | E |
| INFERRED | T-15 visual QA | T-12,T-14 | baseline/captures | diff report | P-01 | edge/color/spacing tolerances pass | E |
| INFERRED | T-16 performance | T-07..T-15 | built assets/bundle | optimized release build | all | budget, CLS≤0.1, LCP target pass | E |
| INFERRED | T-17 Godot integration | T-05,T-07,T-16 | exported demo | isolated lazy Godot embed | optional S02/S08 | fallback poster·keyboard escape·load budget pass | F |

- INFERRED | confidence HIGH | A 그룹은 병렬, B는 shell 이후, C의 네 작업은 병렬, D는 C 완료 후 병렬, E는 responsive 통합 후 실행한다.
- INFERRED | confidence HIGH | 각 task는 해당 section ID의 story/screenshot test와 함께 완료되어야 한다.
- INFERRED | confidence HIGH | T-02 승인 전 원본 캡처를 crop하여 임시 production asset으로 사용하는 것도 금지한다.

## 18. Page-Specific Acceptance Criteria

### P-01 Acceptance Checklist

- INFERRED | confidence HIGH | `1440×900`, `1280×800`, `1024×768`, `768×1024`, `390×844`, `360×800`에서 전체 페이지와 주요 fold를 캡처한다.
- MEASURED | confidence HIGH | prepared 비교본은 `1200×5069px`; 데스크톱 섹션 경계 y는 `580,1160,1740,2320,2940,3565,4212,4755,5069px`다.
- INFERRED | confidence HIGH | major section edge 오차는 prepared 기준 `±4px`; 긴 페이지 누적 오차는 각 경계마다 독립적으로 판정한다.
- INFERRED | confidence HIGH | P01-S01 헤더 bounds는 prepared `35,18,1128,64px`에 `±4px`로 맞춘다.
- INFERRED | confidence HIGH | 로고·메뉴·액션 세 영역의 중심 y 차이는 `≤2px`, 메뉴 baseline 편차는 `≤2px`다.
- INFERRED | confidence HIGH | P01-S02 hero height는 prepared `580px±4px`, copy left edge는 `59px±4px`, pagination 중심은 `600px±4px`다.
- INFERRED | confidence HIGH | P01-S03 네 카드 left edges는 `59/330/601/872px±4px`, gap rhythm은 `±2px`다.
- INFERRED | confidence HIGH | P01-S04 split은 좌측 intro와 우측 card list 관계를 유지하고 right list x는 `530px±6px`다.
- INFERRED | confidence HIGH | P01-S05 세 카드 width는 `244px±4px`, gap은 `13px±2px`, CTA 높이는 `30px±2px`다.
- INFERRED | confidence HIGH | P01-S06 세 cutout은 동일 시각 높이 `±6px`, 중심 x `207/600/1000px±8px`다.
- INFERRED | confidence HIGH | P01-S07 중앙 카드가 가장 높은 z-index이고 양 인접 카드 회전 방향이 대칭이며 양끝 카드 일부가 보인다.
- INFERRED | confidence HIGH | P01-S08 column boundary는 prepared x `600px±4px`, 기사 행은 정확히 4개이고 divider rhythm은 `±2px`다.
- INFERRED | confidence HIGH | P01-S09 track top은 global y `4442px±6px`, tile gap `10px±2px`, 정사각 비율 오차 `≤1%`다.
- INFERRED | confidence HIGH | P01-S10 top은 global y `4755px±4px`, footer height `314px±6px`, top button은 우하단 inset `12/15px±3px`다.
- INFERRED | confidence HIGH | 평면 UI 색상은 section 9 토큰 대비 `ΔE≤3`; 사진·JPEG 영역은 구조 비교에서 제외하고 평균 luminance `±8%`만 확인한다.
- INFERRED | confidence HIGH | heading/font size/line-height는 typography matrix 대비 size `±1px`, line-height `±2px`, weight는 사용 가능한 정확 weight로 일치시킨다.
- INFERRED | confidence HIGH | 모든 제목·버튼·가격·푸터 연락처는 360px에서 부모 밖으로 넘치거나 앞뒤 콘텐츠를 가리지 않는다.
- INFERRED | confidence HIGH | body/document에 horizontal overflow가 없고, 허용된 variant/review/community track만 자체 overflow를 갖는다.
- INFERRED | confidence HIGH | 390/360에서 process/product는 1열, update card는 적층, journal은 feature media 다음 목록, footer는 1열이다.
- INFERRED | confidence HIGH | 모든 새 asset은 manifest aspect/object-fit/focal point를 만족하고 원본 로고·사진·고유 문구와 픽셀 또는 파일 중복이 없다.
- INFERRED | confidence HIGH | Tab만으로 모든 interactive control에 도달하고 focus가 항상 보이며 drawer/캐러셀에서 갇히지 않는다.
- INFERRED | confidence HIGH | mobile drawer는 Escape·close·overlay click으로 닫히고 focus가 trigger로 돌아간다.
- INFERRED | confidence HIGH | carousel 상태 변화는 screen reader에 중복 낭독 없이 현재 index를 알린다.
- INFERRED | confidence HIGH | `prefers-reduced-motion`에서 자동 이동·smooth scroll·scale/rotate transition이 제거된다.
- INFERRED | confidence HIGH | 200% zoom과 한국어 장문 fixture에서 clipping·겹침·가로 스크롤이 없다.
- INFERRED | confidence HIGH | 초기 shell CLS는 `≤0.1`, web shell LCP는 권장 `≤2.5s`(일반 모바일 네트워크), image width/height가 예약된다.
- INFERRED | confidence HIGH | Godot binary가 있으면 사용자 행동 전 eager download하지 않고 poster와 문서 탐색이 먼저 가능해야 한다.
- UNKNOWN | confidence HIGH | 원본의 실제 모바일 CSS와 상호작용은 비교 대상이 없으므로, 390/360 acceptance는 이 문서의 INFERRED 재배치 계약을 기준으로 한다.

## 19. Uncertainties and Decisions

| 등급 | ID | page/section/component | UNKNOWN item | selected implementation decision | rejected alternative | confidence | resolving evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UNKNOWN | U-01 | P-01/global | E-M01이 실제 모바일 viewport 캡처인지 여부 | 픽셀 유사도에 따라 desktop 축소 썸네일로 취급 | 243px에 4열을 실제 CSS로 유지 | HIGH | 실제 390/360 브라우저 캡처 |
| UNKNOWN | U-02 | S01/header | scroll 시 sticky/fixed 전환 | desktop absolute, mobile fixed | desktop 무조건 sticky | MEDIUM | 스크롤 녹화/연속 캡처 |
| UNKNOWN | U-03 | S01/nav | 메뉴 목적지 | 초기 anchor `#project/#journal/#items` | 보이지 않는 route 생성 | HIGH | 실제 sitemap/링크 href |
| UNKNOWN | U-04 | S01/nav | mobile drawer 디자인 | 우측 `320px` drawer+overlay | 데스크톱 메뉴 축소 유지 | MEDIUM | 열린 모바일 메뉴 캡처 |
| UNKNOWN | U-05 | S02/hero | slide autoplay/interval | autoplay false | 무음 자동 5초 재생 | HIGH | 동영상/실행 페이지 |
| UNKNOWN | U-06 | S02/hero | 정확한 slide 수 | 보이는 dot 기준 fixture 3개 | 임의 5개 | MEDIUM | DOM 또는 추가 슬라이드 캡처 |
| UNKNOWN | U-07 | S04/updates | 카드 목록이 carousel인지 여부 | 정적 목록, mobile 수직 stack | 자동 세로 carousel | MEDIUM | 상호작용 녹화 |
| UNKNOWN | U-08 | S05/shop | 결제·장바구니 백엔드 | adapter interface와 disabled demo CTA | 가짜 성공 결제 | HIGH | commerce 요구사항/API |
| UNKNOWN | U-09 | S06/variants | variant 선택 가능 여부 | 데이터에 `selected`가 있을 때만 radiogroup | 항상 selectable처럼 표현 | MEDIUM | 클릭 상태 캡처 |
| UNKNOWN | U-10 | S07/reviews | carousel controls/drag | drag+접근 가능한 prev/next 제공 | 장식용 고정 카드만 사용 | MEDIUM | 영상/DOM |
| UNKNOWN | U-11 | S08/journal | 좌측 media와 우측 기사 연동 | 서로 독립 | 기사 hover로 큰 사진 교체 | LOW | hover/click 녹화 |
| UNKNOWN | U-12 | S09/community | 실시간 소셜 API | 정적 CMS feed | 외부 API를 필수 의존 | HIGH | 데이터 계약/API 키 정책 |
| UNKNOWN | U-13 | S10/footer | 정확한 background 원색/overlay | 신규 asset별 `.50` cyan overlay 조정 | 캡처 색을 평면 배경으로 복제 | MEDIUM | 원 asset/CSS |
| UNKNOWN | U-14 | typography | 원 font family/metrics | Pretendard/Noto Sans KR 스택 | 스크린샷 글자를 벡터 추적 | HIGH | CSS/font files |
| UNKNOWN | U-15 | all | 원 animation easing/duration | `80/160/220/400ms` 체계 | 모든 전환 제거 | MEDIUM | 실행 영상/CSS |
| UNKNOWN | U-16 | assets | 원 사진의 source aspect와 focal metadata | 표시 crop을 기준으로 새 asset metadata 작성 | 캡처에서 원 사진 crop 추출 | HIGH | 소유권 있는 원 asset |
| UNKNOWN | U-17 | footer | 정책·사업 정보의 실제 내용 | 새 프로젝트 법적 정보만 표시 | 원 사업자 문구 복사 | HIGH | 프로젝트 법무/운영 정보 |
| UNKNOWN | U-18 | Godot integration | 전체 사이트를 Godot canvas로 만들지 여부 | semantic web shell + 선택적 Godot embed 권장 | 접근성 없는 단일 canvas | MEDIUM | 배포·SEO·접근성 요구사항 |
| UNKNOWN | U-19 | P-01/page height | 대체 콘텐츠로 인한 최종 자연 높이 | 섹션 경계 tolerance 우선, 텍스트는 clamp+responsive stack | 전체를 이미지처럼 강제 scale | HIGH | 승인된 최종 콘텐츠 fixture |
