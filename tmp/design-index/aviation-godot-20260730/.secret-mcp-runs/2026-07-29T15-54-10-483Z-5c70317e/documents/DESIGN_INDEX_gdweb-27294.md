# DESIGN_INDEX — gdweb-27294 / 대한항공

- OBSERVED 문서 스키마: `secret-mcp/design-index/v2`
- OBSERVED 기준 작품: `gdweb-27294`, 제목 `대한항공`, GDWEB 등록일 `2026-07-15`, 수상 `WINNER PRIZE`
- OBSERVED 시각 콘셉트: 깔끔한 항공 서비스 포털, 메타데이터 주조색 `BLUE`
- INFERRED 재구현 원칙: 원 브랜드 로고, 상표, 사진, 인증 마크, 앱 배지와 문구는 복제하지 않고 동일한 정보 구조와 측정 가능한 레이아웃만 재현한다.

## 1. Reconstruction Goal and Scope

- OBSERVED 목표: 제공된 증거만으로 한 개의 장문 홈 페이지를 프레임워크와 무관하게 재구현할 수 있는 완전한 명세를 만든다.
- OBSERVED 지원 페이지: `P-01 홈/항공 서비스 포털` 한 개다. E-D01과 E-D02는 한 페이지의 세로 타일이며, E-M01은 같은 페이지의 모바일 축소 증거다.
- MEASURED 기준 뷰포트: 데스크톱 원본 `1920×2675px`, 준비 이미지 `1200×1672px`; 모바일 `243×339px`.
- INFERRED 구현/QA 뷰포트: `1440`, `1280`, `1024`, `768`, `390`, `360px`; 데스크톱 기준 좌표는 준비 이미지의 `1200px` 폭을 1:1 디자인 좌표로 사용하고 실제 CSS에서는 유동 컨테이너로 환산한다.
- INFERRED 충실도 목표: 주요 경계 ±4px, 반복 간격 ±2px, 평면 UI 색상 `deltaE ≤ 3`, 텍스트 베이스라인 ±2px, 가로 오버플로 0px.
- OBSERVED 전역 요구: 흰 헤더, 청색 이미지 히어로, 흰 예약 패널, 중앙 `900px` 콘텐츠, 카드/공지/퀵링크/다단 푸터 순서를 보존한다.
- INFERRED 비목표: 실제 항공권 검색, 회원 로그인, 결제, 마일리지, 외부 국가 사이트, 원본 챗봇 백엔드 구현은 범위 밖이다.
- UNKNOWN 정적 이미지에 없는 실제 URL, 폰트 파일, 호버 애니메이션, 메뉴 패널 내용, 캐러셀 자동재생, 서버 응답은 확인할 수 없다.

## 2. Evidence Inventory and Coordinate System

| 상태 | 증거 ID | 종류/파트 | 원본 | 준비 이미지 | 준비 crop | 원본 매핑 crop | 배율 | 보이는 범위 | 한계 |
|---|---|---|---:|---:|---|---|---|---|---|
| MEASURED | E-D01 | desktop 1/2 | 1920×2675 | 1200×1672 | x0 y0 w1200 h1600 | x0 y0 w1920 h2560 | x0.625/y0.625 | 헤더부터 푸터 소셜 행 | 하단 법인/인증 영역 일부 잘림 |
| MEASURED | E-D02 | desktop 2/2 | 1920×2675 | 1200×1672 | x0 y1520 w1200 h152 | x0 y2432 w1920 h243 | x0.625/y0.625 | 푸터 하단과 고정 버튼 | E-D01과 준비 y1520–1600이 80px 중복 |
| MEASURED | E-M01 | mobile 1/1 | 243×339 | 243×339 | x0 y0 w243 h339 | x0 y0 w243 h339 | x1/y1 | 같은 홈 전체 | 낮은 해상도로 텍스트/상태 판독 제한 |

- MEASURED 정규 좌표 원점은 각 준비 캔버스의 좌상단 `(0,0)`이며 x는 오른쪽, y는 아래 방향이다.
- MEASURED 데스크톱 완성 캔버스는 E-D01의 y0–1600과 E-D02의 로컬 y80–152를 합쳐 준비 좌표 y0–1672로 구성한다.
- MEASURED E-D02 로컬 좌표를 완성 캔버스로 바꾸는 식은 `y_full = y_local + 1520`; 중복 y0–80은 한 번만 센다.
- MEASURED 원본 좌표 환산은 데스크톱에서 `x_source=x_prepared/0.625`, `y_source=y_prepared/0.625`다.
- INFERRED 이후 `E-D01 x150 y360 w900 h114` 표기는 준비 이미지 픽셀이다. 별도 언급이 없으면 모든 데스크톱 측정은 이 좌표계를 따른다.
- OBSERVED 사진 내부 색은 디자인 토큰이 아니라 콘텐츠 픽셀로 취급한다.

## 3. Site Map and Page/Route Inventory

| 상태 | Page ID | route/name | 목적 | 증거 | shared shell | Desktop | Mobile | 신뢰도 |
|---|---|---|---|---|---|---|---|---|
| OBSERVED | P-01 | `/` / 홈 | 예약 진입, 프로모션, 공지, 부가 서비스 탐색 | E-D01, E-D02, E-M01 | Shell-A | 있음 | 있음 | HIGH |
| UNKNOWN | U-01 | 예약 | 상단 `예약` 항목의 대상 | E-D01 x347 y35 | Shell 미확인 | 링크만 보임 | 판독 제한 | LOW |
| UNKNOWN | U-02 | 여행 준비 | 상단 `여행 준비` 항목의 대상 | E-D01 x443 y35 | Shell 미확인 | 링크만 보임 | 판독 제한 | LOW |
| UNKNOWN | U-03 | 스카이패스 | 상단 `스카이패스` 항목의 대상 | E-D01 x536 y35 | Shell 미확인 | 링크만 보임 | 판독 제한 | LOW |

- OBSERVED 기본 페이지는 P-01이다.
- OBSERVED P-01에서 예약 위젯의 `항공권 예매` 탭은 활성이고, 글로벌 메뉴의 활성 밑줄은 보이지 않는다.
- INFERRED 재구현 라우트 범위에는 `/`만 포함하고 U-01–U-03은 안전한 placeholder 링크 또는 향후 라우트로 둔다.

## 4. Shared Application Shell

- MEASURED 뷰포트 배경은 E-D01 x0 y0 및 본문 다수 지점의 `#FFFFFF`; 콘텐츠 전체 폭은 `1200px`.
- MEASURED 데스크톱 공통 컨테이너는 x150–1050, `900px`이고 좌우 거터는 각각 `150px`.
- MEASURED 모바일 공통 컨테이너는 E-M01 x29–213, `184px`; 이미지 폭 대비 `75.72%`, 좌우 거터 `29/30px`.
- INFERRED CSS 컨테이너는 `width:min(75%, 900px)`로 잡되, 접근 가능한 실제 구현에서는 768px 이하 `width:calc(100% - 32px)`를 권장한다. 증거 재현 모드에서는 `75.72%`를 사용한다.
- OBSERVED 페이지 크롬은 흰 헤더, 흰 본문, 청색 전폭 히어로/퀵링크 밴드, 흰 푸터다.
- OBSERVED 공지 바, 쿠키 UI, 전역 모달은 보이지 않는다.
- MEASURED 고정 오버레이는 데스크톱 챗 액션 E-D01 x1087 y611 w82 h42와 위로 가기 E-D01 x1133 y1563 w40 h37, E-D02 x1132 y41 w41 h42다.
- MEASURED E-D02의 원형 챗 액션은 x1131 y89 w42 h43이며 화면 우측 `27px`에 고정된 것으로 보인다.
- INFERRED stacking: header `z=30`, 메뉴 overlay `z=40`, 메뉴 panel `z=50`, floating actions `z=60`, modal `z=80`, skip link `z=100`.
- UNKNOWN 헤더 sticky 여부는 스크린샷으로 확인되지 않는다. P-01 구현 결정은 `position:static`; 상단 이동 버튼만 fixed다.

## 5. Navigation and Header Specification

### 5.1 Desktop geometry

| 상태 | 항목 | 값 | 증거/근거 | 신뢰도/허용 오차 |
|---|---|---|---|---|
| MEASURED | 총 헤더 높이 | 75px | E-D01 x0 y0 w1200 h75 | HIGH / ±2px |
| MEASURED | utility bar 높이 | 27px | E-D01 y0–27 | MEDIUM / ±3px |
| MEASURED | content width | 900px | E-D01 x150–1050 | HIGH / ±2px |
| MEASURED | 좌/우 padding | 0px/0px 내부, 뷰포트 gutter 150px | E-D01 | HIGH / ±2px |
| MEASURED | logo bounds | x153 y34 w176 h26 | E-D01 | MEDIUM / ±4px |
| MEASURED | main menu start | x347 y35 | E-D01 | HIGH / ±3px |
| MEASURED | 메뉴 항목 폭 | 예약 39px, 여행 준비 68px, 스카이패스 70px | E-D01 | MEDIUM / ±5px |
| MEASURED | 메뉴 gap | 57px, 56px | E-D01 항목 좌측 간격 | MEDIUM / ±5px |
| MEASURED | 메뉴 baseline | y52px | E-D01 | MEDIUM / ±2px |
| MEASURED | utility icon | 12×12px | E-D01 y10 부근 | LOW / ±3px |
| MEASURED | action area | x761 y7 w289 h55 | 검색/로그인 군 | MEDIUM / ±5px |
| MEASURED | search bounds | x836 y38 w139 h25 | E-D01 | MEDIUM / ±4px |
| MEASURED | login bounds | x981 y38 w69 h25 | E-D01 | MEDIUM / ±3px |
| OBSERVED | border | 하단 경계 없음 또는 1px 이하 | E-D01 y74 | LOW |
| MEASURED | background | #FFFFFF | E-D01 x10 y20 | HIGH / deltaE≤3 |
| INFERRED | position/z-index | static / 30 | transition 증거 없음 | MEDIUM |

### 5.2 Mobile geometry

| 상태 | 항목 | 값 | 증거/근거 | 신뢰도/허용 오차 |
|---|---|---|---|---|
| MEASURED | bar height | 15px | E-M01 x0 y0 w243 h15 | MEDIUM / ±2px |
| MEASURED | side padding | 29px | E-M01 공통 컨테이너 | MEDIUM / ±2px |
| MEASURED | logo bounds | x31 y6 w27 h4 | E-M01 | LOW / ±2px |
| MEASURED | menu-control bounds | x203 y5 w10 h6 | E-M01 우측 캡슐 | LOW / ±2px |
| INFERRED | 실제 CSS bar/side padding | 56px / 16px | 390·360px 접근성 구현 결정 | MEDIUM / ±2px |
| INFERRED | 실제 CSS logo bounds | x16 y16 w118 h24 | 원본 비율 6.77:1을 단순 복제하지 않고 프로젝트 워드마크 사용 | MEDIUM / ±4px |
| INFERRED | touch target | 44×44px | 접근성 결정 | HIGH / -0/+4px |
| UNKNOWN | open-panel 원본 | 정적 증거 없음 | 메뉴 열린 장면 없음 | LOW |
| INFERRED | open-panel geometry | x0 y56 w100vw h`calc(100dvh - 56px)` | 구현 결정 | MEDIUM / ±2px |
| INFERRED | row/indent/divider | 52px / 16px / 1px `#DDE5EE` | 구현 결정 | MEDIUM / ±2px |
| INFERRED | overlay | `rgba(0,20,55,.42)` | 구현 결정 | MEDIUM / alpha ±.05 |
| INFERRED | close/scroll lock | X, Escape, overlay click로 닫고 `body{overflow:hidden}` | 구현 결정 | HIGH |

### 5.3 Visible navigation order

| 상태 | 순서 | 라벨/역할 | 대상 |
|---|---:|---|---|
| OBSERVED | 1 | 예약 | UNKNOWN U-01 |
| OBSERVED | 2 | 여행 준비 | UNKNOWN U-02 |
| OBSERVED | 3 | 스카이패스 | UNKNOWN U-03 |
| OBSERVED | 4 | 이벤트 | UNKNOWN |
| OBSERVED | 5 | 자주 묻는 질문 | UNKNOWN |
| OBSERVED | 6 | 언어/지역 | UNKNOWN |
| OBSERVED | 7 | 회원가입 | UNKNOWN |
| OBSERVED | 8 | 검색 | 검색 입력/UNKNOWN 결과 |
| OBSERVED | 9 | 로그인 | UNKNOWN |

### 5.4 Navigation states

| 상태 | trigger | 시각값 | motion/keyboard |
|---|---|---|---|
| INFERRED default | 없음 | text `#101F4D`, bg transparent, border transparent, opacity 1 | 0ms |
| INFERRED hover | pointer | text `#0064A8`, 하단 2px `#0064A8` | 160ms ease-out |
| INFERRED focus-visible | keyboard | outline 2px `#1B78C5`, offset 3px, radius 4px | 즉시, Tab 유지 |
| INFERRED pressed | pointer/key down | text `#00467A`, opacity .88, translateY(1px) | 80ms ease-out |
| INFERRED active | 현재 route | text `#00256C`, 하단 2px `#00256C` | `aria-current=page` |
| INFERRED disabled | 비활성 | text `#718096`, opacity .45, pointer-events none | focus 제외 |
| UNKNOWN scrolled | 원본 전환 미확인 | 구현은 흰 bg, 1px `#DDE5EE`, shadow `0 2px 8px rgba(0,37,108,.08)` | sticky 채택 시 160ms |
| INFERRED menu-open | 모바일 버튼 | panel opacity 1, 버튼 `aria-expanded=true`, 배경 overlay .42 | 220ms cubic-bezier(.2,.8,.2,1) |
| UNKNOWN submenu-open | 원본 미확인 | 구현은 행 아래 48px 하위행, bg `#F5FAFD`, chevron 180deg | 180ms ease |

## 6. Page-by-Page Specifications

### Page P-01: 홈

#### 6.1 Identity and canvas

- OBSERVED route/name: `/`, 홈. 목적은 예약 검색을 첫 행동으로 제시하고 프로모션, 공지, 앱, 부가 서비스로 연결하는 것이다.
- OBSERVED entry points: 직접 URL, 로고, 상단 내비게이션; shared shell은 Shell-A이며 예약 위젯의 `항공권 예매`가 활성이다.
- MEASURED supporting evidence: E-D01 전체, E-D02 전체(중복 제거), E-M01 전체.
- MEASURED desktop canvas: 준비 기준 `1200×1672px`, 원본 `1920×2675px`, 기본 max-content `900px`, gutter `150px`, 배경 `#FFFFFF`.
- MEASURED mobile canvas: `243×339px`, side gutter `29/30px`, 공통 콘텐츠 `184px`; 콘텐츠 순서는 desktop과 같다.
- INFERRED 실사용 모바일 stacking: 예약 패널 내부만 세로 재배치하고 프로모션/퀵링크는 증거의 다열 인상을 유지하는 가로 scroll-snap으로 구현한다.
- INFERRED overflow: 페이지 x축 `hidden`; 카드 scroller만 `overflow-x:auto`; 본문 y축 자연 스크롤.

#### 6.2 Ordered section geometry

| 상태 | Section ID | Evidence | Bounds | role/container | layout/spacing/alignment | surface/content | responsive | 신뢰도 |
|---|---|---|---|---|---|---|---|---|
| MEASURED | P01-S01 | E-D01 x0 y0–75 | x0 y0 w1200 h75 | header / max900 | utility+main 2행, 좌우 정렬 | #FFF, 로고·메뉴·검색·로그인 | E-M01 x0 y0 w243 h15, compact | HIGH |
| MEASURED | P01-S02 | E-D01 x0 y75–335 | x0 y75 w1200 h260 | hero/search / full bleed+900 | panel x150 y124, h162; 상단 4탭+폼 | 청색 이미지, 흰 panel radius10 | E-M01 x0 y15 w243 h53 | HIGH |
| MEASURED | P01-S03 | E-D01 x150 y360–474 | x150 y360 w900 h114 | announcement / max900 | centered block; padding 28px | pale blue image, 문장+outline CTA | E-M01 x29 y74 w184 h34 | HIGH |
| MEASURED | P01-S04 | E-D01 x151 y536–760 | x151 y536 w898 h224 | promotions / max900 | 3-col `288 288 288`, gap16 | 3 image cards, white, shadow | E-M01 x29 y110 w184 h45 | HIGH |
| MEASURED | P01-S05 | E-D01 x150 y825–1050 | x150 y825 w900 h225 | news/apps / max900 | heading+2-col `558 312`, gap30 | 4 rows+1 app media | E-M01 x29 y164 w184 h63 | HIGH |
| MEASURED | P01-S06 | E-D01 x0 y1111–1301 | x0 y1111 w1200 h190 | quick links / full bleed+900 | heading; 8-col, gap14 | #DDEEFF 계열, 8 tiles | E-M01 x0 y228 w243 h35 | HIGH |
| MEASURED | P01-S07 | E-D01/E-D02 y1301–1672 | x0 y1301 w1200 h371 | footer / max900 | 5-col links+social/legal/badges | #FFF, dark text | E-M01 x29 y263 w184 h76 | HIGH |
| MEASURED | P01-S08 | E-D01/E-D02 right edge | x1087 y611 w86 h43 등 | complementary / fixed | right 27–31px, bottom variants | 챗/상단이동 원형·캡슐 | E-M01 x219 y125 및 x232 y330 | MEDIUM |

#### 6.3 Detailed section specifications

**P01-S01 Header**

- MEASURED DOM 역할: `header > utility-nav + (logo + primary-nav + search + login)`.
- MEASURED 데스크톱 콘텐츠 x150–1050; 로고 x153–329, 메뉴 x347–606, 검색/로그인 x836–1050.
- OBSERVED utility는 우측 정렬 4개 항목이며 y8–20, main row는 y28–75다.
- INFERRED 모바일에서는 `logo + menu button` 한 행으로 단순화하고 utility/search/login은 열린 패널 내부로 이동한다.
- INFERRED 접근성: 첫 focus는 skip link, 다음 logo, nav 항목, search, login 순서다.

**P01-S02 Hero/Search**

- MEASURED 전폭 hero bounds `x0 y75 w1200 h260`; 배경은 하늘색 사진/추상 항공 이미지이며 중심의 밝은 대각 띠가 x480–760을 지난다.
- MEASURED 검색 panel `x150 y124 w900 h162`, radius 약 `10px`, 배경 `rgba(255,255,255,.94)`.
- MEASURED top tab row h55: 네 항목은 각각 약 `225px`; 첫 탭 x150–375가 활성 흰 surface, 나머지는 반투명.
- MEASURED form row y179–286 h107; 내부 좌우 padding `22px`; 유형 pill y182–205, 필드 baseline y239.
- OBSERVED 예약/마일리지 토글, 왕복/편도/다구간, 출발지, 도착지, 날짜, 승객, 좌석 등급, 가까운 날짜 체크, 청색 검색 CTA가 있다.
- INFERRED field grid: desktop `140px 44px 140px 1fr 110px 120px 102px`, gap `12px`; 세로 divider `1px`.
- INFERRED 768px 이하: 탭은 4열 유지, form은 `repeat(2,minmax(0,1fr))`; CTA와 날짜는 full-span; panel 높이 `auto`, padding `16px`.
- UNKNOWN 달력, 공항 선택기, 승객/좌석 팝오버의 실제 내용. 구현은 modal/dialog 또는 anchored popover로 제공한다.

**P01-S03 Announcement**

- MEASURED x150 y360 w900 h114, top margin 25px, radius 약 4px.
- OBSERVED 중앙 제목 한 줄과 작은 outline CTA 한 개이며, 좌우에 매우 연한 추상 항공 장식이 있다.
- INFERRED inner layout `display:grid; place-items:center; align-content:center; gap:14px`; 제목 16px, 버튼 h28.
- INFERRED 모바일 제목 12px, CTA h28; 장식은 `background-size:cover`, 핵심 문구를 가리지 않는다.

**P01-S04 Promotions**

- MEASURED 카드 bounds: C1 x151 y536 w288 h224, C2 x456 y536 w288 h224, C3 x762 y536 w287 h224; gap `17px/18px`.
- MEASURED 각 이미지 h162px, aspect 약 `1.78:1`; 텍스트 영역 h62px, padding `14px`.
- OBSERVED 사진은 제주 돌상, 프로모션 카드 묶음, 해변의 기프트카드이며 각 카드 제목은 1–2행이다.
- INFERRED 카드 shadow `0 2px 8px rgba(16,31,77,.10)`, border `1px solid #EEF2F6`, radius `4px`.
- OBSERVED 세 번째 카드 우측에는 캐러셀 다음 화살표가 겹쳐 있다.
- INFERRED desktop 3열, 768px 이하 `grid-auto-columns:calc((100% - 16px)/2.35)` 가로 scroll-snap; 390px에서 1.15장 노출을 권장하되 243px 증거 재현 모드에서는 3개 축소 열을 사용한다.
- UNKNOWN 카드 링크 대상과 캐러셀 페이지 수. 구현 fixture는 3개, 자동재생 없음.

**P01-S05 News and app promo**

- MEASURED section heading x151 y826, baseline 약 y842; 우측 `목록보기` x1016 y837.
- MEASURED news list x150 y866 w558 h185, 4행 각각 약 `46px`; app promo x738 y866 w311 h184.
- OBSERVED 각 news row는 왼쪽 제목과 오른쪽 날짜, 1px divider를 가진다.
- OBSERVED app media는 연한 청색 배경, 좌측 카피, 우측 스마트폰 crop이다.
- INFERRED desktop grid `minmax(0,558px) 312px`, gap30; 모바일은 heading→list→app 순서의 1열.
- INFERRED 긴 제목은 desktop 1행 ellipsis, mobile 2행 line-clamp; 날짜는 `white-space:nowrap`.
- UNKNOWN 실제 공지 API. fixture 4개를 최신 날짜 내림차순으로 정렬한다.

**P01-S06 Quick links**

- MEASURED full band y1111–1301 h190; inner x150–1050; heading y1148; tiles y1187–1270 h83.
- MEASURED 8개 tile 폭 약 101px, gap14px; radius 4px; 각 tile은 label 상단과 24px line icon 하단.
- OBSERVED visible roles: 이벤트, 카드, 기프트카드, 호텔, 렌터카, 면세점, 보험, 여행 상품.
- INFERRED desktop `repeat(8,1fr)`; 1024px 4열×2행; 768px 이하 4열 또는 수평 scroller; min touch 44px.
- INFERRED hover는 tile bg를 `#FFFFFF`에서 `#F5FAFD`로, 아이콘을 `#0064A8`로 변경한다.

**P01-S07 Footer**

- MEASURED links area x150 y1344 w900 h169; 5열은 약 130–150px이며 column gap 약 45px.
- OBSERVED 열 제목 5개와 다수 텍스트 링크, 앱 스토어 배지 2개, 소셜 원형 아이콘 5개, 법인 정보, 저작권, 인증 배지 4개가 있다.
- MEASURED divider x150 y1545 w900 h1; social/app row y1565–1590; E-D02에서 legal local y96–138(완성 y1616–1658).
- INFERRED 768px 이하 링크 그룹은 accordion 1열로 재배치하되 E-M01 fidelity 모드에서는 5개 축소 열을 유지한다.
- INFERRED 원 브랜드 앱 배지와 인증 마크는 generic 텍스트 링크/프로젝트 상태 배지로 교체한다.

**P01-S08 Floating actions**

- MEASURED 데스크톱 중간 챗 pill x1087 y611 w82 h42; 하단 top button x1133 y1563 w40 h37; E-D02 챗 circle x1131 y89 w42 h43.
- OBSERVED E-M01에는 우측 x219 y125 부근 pill과 x232 y330 원형 버튼이 보인다.
- INFERRED 실제 구현은 `right:24px; bottom:24px` 48×48px 챗 버튼, top 버튼은 그 위 `gap:12px`; 768px 이하 44×44px, right12px.
- UNKNOWN 챗 open state. 구현은 닫힌 상태만 제공하거나 프로젝트 도움말 dialog에 연결한다.

#### 6.4 Page-specific states, assets, accessibility, acceptance

- INFERRED loading: 예약 CTA에 16px spinner와 `aria-busy=true`; 카드/공지에는 고정 aspect skeleton을 사용해 layout shift를 막는다.
- INFERRED empty: 프로모션/공지 영역에 각각 한 줄 안내를 보이되 section 높이를 유지한다.
- INFERRED error: 검색 panel 상단에 role alert, border `#C53B3B`; 실패 필드에 `aria-describedby`.
- INFERRED assets: hero 1, announcement 1, promo 3, app promo 1, logo 1, UI icon 약 30, footer badge 대체 자산.
- INFERRED P-01 acceptance: 1200px 기준 각 section y 경계 ±4px, container x150/1050 ±3px, 카드 gap ±2px, 키보드 전체 도달, 360px 가로 overflow 0px.

## 7. Section and Layout Deep Dives

### P01-S01/S02 CSS-ready geometry

```css
.shell__inner { width: min(75%, 900px); margin-inline: auto; }
.header { height: 75px; background: #fff; position: static; z-index: 30; }
.hero { min-height: 260px; padding-top: 49px; background: var(--hero-image) center/cover; }
.booking { min-height: 162px; border-radius: 10px; background: rgba(255,255,255,.94); }
.booking__tabs { display: grid; grid-template-columns: repeat(4, 1fr); height: 55px; }
.booking__form { display: grid; grid-template-columns: 140px 44px 140px 1fr 110px 120px 102px; gap: 12px; }
```

- INFERRED tablet `769–1024px`: shell `calc(100% - 64px)`, header 72px, booking form `repeat(4,1fr)`, hero min-height 340px.
- INFERRED mobile `≤768px`: shell `calc(100% - 32px)`, header 56px, hero padding 16px 0 24px, booking form 2열, field min-width 0, CTA min-height 44px.
- INFERRED fidelity mode `[data-evidence-scale=compact]`: `.shell__inner{width:75.72%}`와 desktop 구조 축소를 허용한다.

### P01-S03/S04

```css
.announcement { min-height: 114px; display: grid; place-content: center; gap: 14px; overflow: hidden; }
.promo-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 17px; }
.promo-card { min-width: 0; overflow: hidden; border-radius: 4px; }
.promo-card__media { aspect-ratio: 16 / 9; object-fit: cover; object-position: center; }
.promo-card__title { margin: 0; padding: 12px 14px; min-height: 62px; display: -webkit-box; -webkit-line-clamp: 2; overflow: hidden; }
```

- MEASURED 반복 카드 수는 3, desktop 한 행 완성 정렬이다.
- INFERRED 768px 이하 scroller는 `grid-auto-flow:column`, `grid-auto-columns:min(78vw,288px)`, gap12px, 마지막 카드 뒤 padding16px다.
- INFERRED 사진 focal point: C1 `50% 50%`, C2 `50% 46%`, C3 `50% 50%`.

### P01-S05

```css
.news-layout { display:grid; grid-template-columns:minmax(0, 558px) 312px; gap:30px; }
.news-list { display:grid; grid-template-rows:repeat(4, 46px); }
.news-row { display:grid; grid-template-columns:minmax(0,1fr) max-content; gap:16px; align-items:center; border-bottom:1px solid var(--c-border); }
.app-promo { min-height:184px; overflow:hidden; position:relative; }
```

- INFERRED 768px 이하 `grid-template-columns:1fr`, row gap24px; app promo aspect `311/184`.
- INFERRED app phone media는 absolute `right:-2%; bottom:0; width:52%`, z1; copy z2.

### P01-S06

```css
.quick-band { min-height:190px; padding-block:34px 31px; }
.quick-grid { display:grid; grid-template-columns:repeat(8,minmax(0,1fr)); gap:14px; }
.quick-item { min-height:83px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; }
```

- INFERRED 1024px에서는 4열, row-gap12px, band 높이 276px; 768px 이하 4열 또는 horizontal auto-flow.
- INFERRED 아이콘은 24×24px, stroke 1.8px, `flex:none`; 라벨 영역 min-height20px로 hover 시 layout shift를 막는다.

### P01-S07/S08

```css
.footer__links { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:45px; padding-block:42px 30px; }
.floating { position:fixed; right:24px; bottom:24px; z-index:60; display:grid; gap:12px; }
@media (max-width:768px) {
  .footer__links { grid-template-columns:1fr; gap:0; }
  .floating { right:12px; bottom:12px; }
}
```

- INFERRED footer link overflow는 clamp하지 않고 줄바꿈 허용; column min-width 0.
- INFERRED top 버튼은 scrollY 480px 이상에서 opacity 1, 그 전 opacity 0/pointer-events none.
- INFERRED reduced motion에서 smooth scroll과 transform transition을 제거한다.

## 8. Component Abstraction

### 8.1 Component tree

```text
AppShell
├─ SkipLink
├─ SiteHeader [P01-S01]
│  ├─ BrandMark
│  ├─ UtilityNav
│  ├─ PrimaryNav
│  ├─ SiteSearch
│  └─ MobileMenu
├─ HomePage [P-01]
│  ├─ BookingHero [P01-S02]
│  │  ├─ BookingTabs
│  │  └─ BookingForm
│  ├─ AnnouncementBanner [P01-S03]
│  ├─ PromotionCarousel [P01-S04]
│  │  └─ PromotionCard ×3
│  ├─ NewsAndApp [P01-S05]
│  │  ├─ NoticeList
│  │  └─ AppPromo
│  └─ QuickLinkBand [P01-S06]
├─ SiteFooter [P01-S07]
└─ FloatingActions [P01-S08]
```

### 8.2 Contracts

| 상태 | Component | 책임/재사용 | props/slots | state/events/data | loading/empty/error/disabled | a11y |
|---|---|---|---|---|---|---|
| INFERRED | AppShell | 전역 shell | `children:Node`, `activeNav?:string` | scrollY | N/A | landmarks, skip target |
| INFERRED | SiteHeader | nav/header | `items:NavItem[]`, `variant:'default'` | `menuOpen`, `searchOpen`; `onNavigate` | disabled item | nav label, focus restore |
| INFERRED | BookingHero | 검색 진입 | `modes:Mode[]`, `initial:SearchDraft` | activeMode, fields; `onSubmit` | loading/error/disabled CTA | form labels, alert |
| INFERRED | BookingTabs | 서비스 모드 | `items`, `value` | `onChange(id)` | disabled tab | tablist/tab/tabpanel |
| INFERRED | AnnouncementBanner | 단일 공지 | `title`, `cta`, `media?` | click | missing CTA 허용 | section label |
| INFERRED | PromotionCarousel | 카드 모음 | `items:Promotion[3+]` | index; next/prev | skeleton/empty/error | region, carousel status |
| INFERRED | PromotionCard | 반복 링크 | `title`, `image`, `href` | activate | image fallback | alt or decorative |
| INFERRED | NoticeList | 최신 공지 4개 | `items:Notice[]`, `limit=4` | select | skeleton/empty/error | list, time datetime |
| INFERRED | AppPromo | media CTA | `title`, `body`, `image`, `href` | activate | image fallback | descriptive link |
| INFERRED | QuickLinkBand | 8개 바로가기 | `items:QuickLink[]` | activate | disabled tile | list semantics |
| INFERRED | SiteFooter | 링크/법인정보 | `groups`, `social`, `legal`, `badges` | accordion open | missing group | contentinfo |
| INFERRED | FloatingActions | help/top | `showTop:boolean` | openHelp, scrollTop | disabled help | labels, dialog control |

- INFERRED 데이터 의존성은 HomePage loader가 소유하고, 단순 hover/tab/메뉴 상태는 각 컴포넌트 로컬 state다.
- INFERRED 실패가 다른 section을 막지 않도록 프로모션/공지/퀵링크 데이터 경계를 분리한다.

## 9. Design Tokens and Exact Color Specification

### 9.1 Color tokens

| 상태 | token | HEX | RGB | HSL | alpha | role/usage | evidence | 신뢰도 | 허용 오차 |
|---|---|---|---|---|---:|---|---|---|---|
| MEASURED | `--c-white` | #FFFFFF | rgb(255, 255, 255) | hsl(0, 0%, 100%) | 1 | header/body/card/footer | E-D01 palette 54.78% | HIGH | deltaE≤2 |
| MEASURED | `--c-sky-100` | #CCEEEE | rgb(204, 238, 238) | hsl(180, 50%, 86.7%) | 1 | hero/quick band 대표 | E-D01 palette 8.14% | HIGH | deltaE≤3 |
| MEASURED | `--c-blue-050` | #DDEEFF | rgb(221, 238, 255) | hsl(210, 100%, 93.3%) | 1 | pale surface/band | E-D01 palette 6.68% | HIGH | deltaE≤3 |
| MEASURED | `--c-indigo-025` | #EEEEFF | rgb(238, 238, 255) | hsl(240, 100%, 96.7%) | 1 | card tint | E-D01 palette 3.08% | MEDIUM | deltaE≤3 |
| MEASURED | `--c-cyan-025` | #EEFFFF | rgb(238, 255, 255) | hsl(180, 100%, 96.7%) | 1 | announcement highlight | E-D01 palette 2.52% | MEDIUM | deltaE≤3 |
| MEASURED | `--c-gray-100` | #EEEEEE | rgb(238, 238, 238) | hsl(0, 0%, 93.3%) | 1 | border/divider | E-D01 palette 2.16% | HIGH | deltaE≤3 |
| MEASURED | `--c-sky-300` | #99DDFF | rgb(153, 221, 255) | hsl(200, 100%, 80%) | 1 | hero photo highlight | E-D01 palette 1.55% | MEDIUM | deltaE≤4 |
| MEASURED | `--c-bluegray-200` | #CCDDEE | rgb(204, 221, 238) | hsl(210, 50%, 86.7%) | 1 | muted border/surface | E-D01 palette 1.53% | HIGH | deltaE≤3 |
| INFERRED | `--c-text` | #101F4D | rgb(16, 31, 77) | hsl(225, 65.6%, 18.2%) | 1 | primary text/nav | E-D01 dark text visual sample | MEDIUM | deltaE≤4 |
| INFERRED | `--c-muted` | #5F6B7A | rgb(95, 107, 122) | hsl(213, 12.4%, 42.5%) | 1 | meta/footer | visible muted text | MEDIUM | deltaE≤4 |
| INFERRED | `--c-primary` | #0064A8 | rgb(0, 100, 168) | hsl(204.3, 100%, 32.9%) | 1 | CTA/links | hero CTA visual | MEDIUM | deltaE≤4 |
| INFERRED | `--c-primary-dark` | #00256C | rgb(0, 37, 108) | hsl(219.4, 100%, 21.2%) | 1 | active/nav/icon | visible navy | MEDIUM | deltaE≤4 |
| INFERRED | `--c-secondary` | #67C7E5 | rgb(103, 199, 229) | hsl(194.3, 70%, 65.1%) | 1 | CTA fill | search button visual | MEDIUM | deltaE≤5 |
| INFERRED | `--c-accent` | #6B45C6 | rgb(107, 69, 198) | hsl(257.7, 52.9%, 52.4%) | 1 | help action gradient edge | E-D01 x1087 y611 | LOW | deltaE≤6 |
| INFERRED | `--c-success` | #27865F | rgb(39, 134, 95) | hsl(155.4, 54.9%, 33.9%) | 1 | success feedback | screenshot-invisible | LOW | deltaE≤5 |
| INFERRED | `--c-warning` | #B76800 | rgb(183, 104, 0) | hsl(34.1, 100%, 35.9%) | 1 | warning | screenshot-invisible | LOW | deltaE≤5 |
| INFERRED | `--c-danger` | #C53B3B | rgb(197, 59, 59) | hsl(0, 54.3%, 50.2%) | 1 | errors | screenshot-invisible | LOW | deltaE≤5 |
| INFERRED | `--c-overlay` | #001437 | rgb(0, 20, 55) | hsl(218.2, 100%, 10.8%) | .42 | mobile menu overlay | screenshot-invisible | LOW | alpha±.05 |
| INFERRED | `--c-focus` | #1B78C5 | rgb(27, 120, 197) | hsl(207.2, 75.9%, 43.9%) | 1 | focus ring | accessibility decision | HIGH | deltaE≤4 |
| INFERRED | `--c-hover` | #F5FAFD | rgb(245, 250, 253) | hsl(202.5, 66.7%, 97.6%) | 1 | hover surface | screenshot-invisible | LOW | deltaE≤4 |
| INFERRED | `--c-pressed` | #00467A | rgb(0, 70, 122) | hsl(205.6, 100%, 23.9%) | 1 | pressed | screenshot-invisible | LOW | deltaE≤4 |
| INFERRED | `--c-disabled` | #718096 | rgb(113, 128, 150) | hsl(215.7, 15.6%, 51.6%) | .45 | disabled | screenshot-invisible | LOW | alpha±.05 |

### 9.2 CSS custom properties

```css
:root {
  --c-white:#fff; --c-sky-100:#cceeee; --c-blue-050:#ddeeff;
  --c-indigo-025:#eeeeff; --c-cyan-025:#eeffff; --c-gray-100:#eeeeee;
  --c-bluegray-200:#ccddee; --c-text:#101f4d; --c-muted:#5f6b7a;
  --c-primary:#0064a8; --c-primary-dark:#00256c; --c-secondary:#67c7e5;
  --c-accent:#6b45c6; --c-success:#27865f; --c-warning:#b76800;
  --c-danger:#c53b3b; --c-focus:#1b78c5;
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-5:20px; --space-6:24px; --space-8:32px; --space-10:40px;
  --space-12:48px; --space-16:64px;
  --radius-sm:4px; --radius-md:8px; --radius-panel:10px; --radius-pill:999px;
  --border:1px; --shadow-card:0 2px 8px rgba(16,31,77,.10);
  --container:900px; --header-h:75px; --icon-sm:16px; --icon-md:24px;
  --z-header:30; --z-overlay:40; --z-panel:50; --z-float:60; --z-modal:80;
  --bp-sm:390px; --bp-md:768px; --bp-lg:1024px; --bp-xl:1280px;
  --motion-fast:80ms; --motion-base:160ms; --motion-panel:220ms;
  --ease-standard:cubic-bezier(.2,.8,.2,1);
}
```

- MEASURED spacing exceptions: promo gap `17px`, news grid gap `30px`, footer grid gap `45px`, desktop gutter `150px`.
- INFERRED radii: 카드 4px, 일반 control 8px, booking panel 10px, pill 999px.
- INFERRED border `1px`, card shadow 위 값, disabled opacity `.45`.

## 10. Typography Matrix

- UNKNOWN 원본 폰트 파일은 증거에 없다.
- INFERRED family: `"Pretendard","Noto Sans KR","Apple SD Gothic Neo",Arial,sans-serif`; 로컬/웹폰트는 Korean subset을 preload하고 `font-display:swap`.

| 상태 | 역할 | size/모바일 | weight | line-height | letter-spacing | case/deco | align/max/wrap |
|---|---|---:|---:|---:|---:|---|---|
| INFERRED | utility | 10px/10px | 400 | 14px/1.4 | 0 | none | right/no-wrap |
| INFERRED | primary nav | 14px/15px panel | 600 | 20px/1.43 | 0 | none | left/no-wrap |
| INFERRED | booking tab | 13px/12px | 600 | 20px | 0 | none | center/no-wrap |
| INFERRED | field main | 22px/18px | 400 | 28px | 0 | none | left/no-wrap |
| INFERRED | field label/meta | 11px/11px | 400 | 16px | 0 | none | left |
| INFERRED | hero title 해당 없음 | 0px/0px | 400 | 0 | 0 | none | 예약 패널이 hero 핵심 |
| INFERRED | announcement title | 16px/12px | 600 | 24px/18px | 0 | none | center/max560px |
| INFERRED | section heading | 18px/17px | 600 | 26px | 0 | none | left/no-wrap |
| INFERRED | card title | 13px/13px | 500 | 19px | 0 | none | left/2-line clamp |
| INFERRED | notice title | 11px/13px | 400 | 18px | 0 | none | left/1→2-line |
| INFERRED | notice date/meta | 10px/11px | 400 | 16px | 0 | none | right/no-wrap |
| INFERRED | control/button | 11px/14px | 600 | 16px/20px | 0 | none | center/no-wrap |
| INFERRED | quick label | 11px/12px | 400 | 16px | 0 | none | center/2-line allowed |
| INFERRED | footer heading | 12px/14px | 600 | 18px | 0 | none | left |
| INFERRED | footer link | 10px/13px | 400 | 24px/20px | 0 | none | left/wrap |
| INFERRED | form error | 11px/12px | 500 | 16px | 0 | none | left/full row |
| INFERRED | caption | 10px/11px | 400 | 15px | 0 | none | left |

## 11. Asset and Icon Manifest

| 상태 | ID | page/section | 역할/crop | 표시 크기 | ratio/crop/focal | responsive/loading/format | alt/replacement |
|---|---|---|---|---|---|---|---|
| OBSERVED | A-01 | P01-S01 | 원 워드마크 E-D01 x153 y34 w176 h26 | 176×26 | 6.77:1/contain/left | shrink, eager, SVG 권장 | 프로젝트 워드마크로 교체 |
| OBSERVED | A-02 | P01-S02 | hero image E-D01 x0 y75 w1200 h260 | 1200×260 | 4.62:1/cover/center | responsive, eager, AVIF/WebP | decorative empty alt |
| OBSERVED | A-03 | P01-S03 | pale illustration x150 y360 w900 h114 | 900×114 | 7.89:1/cover/center | lazy, WebP | decorative |
| OBSERVED | A-04 | P01-S04 C1 | 제주 사진 x151 y536 w288 h162 | 288×162 | 16:9/cover/50% 50% | lazy, AVIF | 원 사진 복제 금지, 대체 항공 scene |
| OBSERVED | A-05 | P01-S04 C2 | 카드 묶음 x456 y536 w288 h162 | 288×162 | 16:9/cover/50% 46% | lazy, WebP | 프로젝트 미디어 대체 |
| OBSERVED | A-06 | P01-S04 C3 | 해변 카드 x762 y536 w287 h162 | 287×162 | 16:9/cover/center | lazy, AVIF | 프로젝트 미디어 대체 |
| OBSERVED | A-07 | P01-S05 | app phone x738 y866 w311 h184 | 311×184 | 1.69:1/cover/right | lazy, WebP | 게임 화면/조종석 대체 |
| OBSERVED | A-08 | P01-S06 | quick icons ×8 | 24×24 each | 1:1/contain/center | inline SVG/lucide | 텍스트와 중복이면 hidden |
| OBSERVED | A-09 | P01-S07 | store badges ×2 | 약 70×20 each | contain | lazy, SVG/PNG | 일반 Download 링크로 교체 |
| OBSERVED | A-10 | P01-S07 | social icons ×5 | 22×22 each | circle/center | SVG | 각 서비스 label |
| OBSERVED | A-11 | P01-S07 | certification ×4 | 약 35×35 | contain | lazy | 프로젝트 상태 badge로 교체 |
| OBSERVED | A-12 | P01-S08 | sparkle/chat/top icons | 20–24px | center | Lucide `Sparkles`, `ChevronUp` | button accessible name |

- INFERRED identifiable UI icon equivalents: `Gift`, `CreditCard`, `BedDouble`, `Car`, `ShoppingBasket`, `ShieldCheck`, `Ticket`, `Plane`, `CalendarDays`, `Users`, `Search`, `LogIn`, `Menu`, `X`, `ChevronRight`, `ChevronUp`.
- INFERRED 비표준 로고는 새 텍스트 워드마크와 24px Godot/항공 프로젝트 심볼로 제작하며 원 형상을 트레이싱하지 않는다.

## 12. Responsive Behavior Matrix

| 상태 | 항목 | 1440 | 1280 | 1024 | 768 | 390 | 360 |
|---|---|---:|---:|---:|---:|---:|---:|
| INFERRED | P-01 container | 900px | 900px | 960px | 704px | 358px | 328px |
| INFERRED | gutter | 270px | 190px | 32px | 32px | 16px | 16px |
| INFERRED | header h | 75px | 75px | 72px | 56px | 56px | 56px |
| INFERRED | nav mode | full | full | full compact | menu button | menu button | menu button |
| INFERRED | logo w | 176px | 176px | 150px | 118px | 118px | 118px |
| INFERRED | hero h | 312px | 280px | 340px | auto≥420px | auto≥520px | auto≥540px |
| INFERRED | booking columns | 7 tracks | 7 tracks | 4 tracks | 2 tracks | 1 track | 1 track |
| INFERRED | booking panel padding | 22px | 22px | 20px | 16px | 16px | 16px |
| INFERRED | announcement h | 114px | 114px | 108px | 104px | 112px | 118px |
| INFERRED | promo columns | 3 | 3 | 3 | horizontal 2.35 visible | horizontal 1.15 visible | horizontal 1.08 visible |
| INFERRED | promo gap | 17px | 17px | 16px | 12px | 12px | 12px |
| INFERRED | news layout | 558/312 | 558/312 | 60/40% | 1 col | 1 col | 1 col |
| INFERRED | quick grid | 8 col | 8 col | 4×2 | 4×2 | 2×4 | 2×4 |
| INFERRED | footer links | 5 col | 5 col | 5 col | accordion | accordion | accordion |
| INFERRED | section heading size | 18px | 18px | 18px | 17px | 17px | 17px |
| INFERRED | card image crop | 16:9 center | 16:9 center | 16:9 center | 16:9 center | 16:9 center | 16:9 center |
| INFERRED | min touch target | 40px | 40px | 40px | 44px | 44px | 44px |
| INFERRED | page x overflow | 0px | 0px | 0px | 0px | 0px | 0px |

- MEASURED E-M01의 243px 증거는 75.72% 컨테이너, 동일 순서, 3열 프로모션, 8열 퀵링크, 5열 푸터를 축소해 보인다.
- INFERRED 390/360 값은 낮은 해상도 증거를 접근 가능한 CSS viewport로 해석한 구현 결정이며, 직접 증거가 아니므로 MEDIUM 신뢰도다.
- INFERRED breakpoint 행동: `>1024` desktop full; `769–1024` compact desktop; `≤768` mobile menu/stack; `≤390` single-column booking과 2열 quick links.

## 13. Interaction and Motion State Matrix

| 상태 | 대상/state/trigger | visual delta | duration/easing | focus/keyboard | reduced motion |
|---|---|---|---|---|---|
| INFERRED | link hover | color `#0064A8`, underline offset3px | 160ms ease-out | Enter activate | color만 |
| INFERRED | button hover | brightness .96, shadow `0 2px 6px rgba(0,37,108,.18)` | 160ms ease-out | Space/Enter | transform 없음 |
| INFERRED | button pressed | bg `#00467A`, translateY(1px) | 80ms ease-out | keyup activate | translate 제거 |
| INFERRED | focus-visible | 2px `#1B78C5`, offset3px | 0ms | Tab 순서 유지 | 동일 |
| INFERRED | booking tab selected | bg `#FFF`, text `#00256C`, icon opacity1 | 160ms | arrows/Home/End | 즉시 |
| INFERRED | field popover open | panel opacity1, translateY0 | 180ms standard | focus trap, Escape | opacity만 |
| INFERRED | mobile menu open | overlay .42, panel translateX0 | 220ms standard | trap/restore/Escape | 즉시 표시 |
| INFERRED | submenu open | chevron rotate180, rows expand | 180ms ease | button aria-expanded | 즉시 |
| INFERRED | carousel next | scroll by one card | 260ms standard | arrows/buttons | instant scroll |
| INFERRED | card hover | translateY(-2px), shadow 증가 | 160ms ease-out | link focus ring | transform 제거 |
| INFERRED | accordion open | content grid rows 0fr→1fr | 180ms ease | button semantics | 즉시 |
| INFERRED | form loading | CTA opacity .75, spinner rotate | 800ms linear loop | disabled while pending | static spinner icon |
| INFERRED | error | border/text `#C53B3B`, alert | 0ms | focus first invalid | 동일 |
| INFERRED | success | inline status `#27865F` | 0ms | polite live region | 동일 |
| INFERRED | disabled | opacity .45, cursor not-allowed | 0ms | native disabled 제외 | 동일 |
| INFERRED | top action | opacity0→1 after 480px | 160ms | scroll to main top | instant scroll |
| UNKNOWN | 원 carousel autoplay | 증거 없음; 구현은 off | 0ms | 사용자 제어 | off |
| UNKNOWN | 원 chatbot dialog | 증거 없음; 구현은 도움말 modal | 180ms | dialog trap | 즉시 |

## 14. Accessibility Contract

- INFERRED landmarks: `header`, `nav[aria-label=주요]`, `main#main`, 각 section, `footer`; 예약 위젯은 `form`.
- INFERRED heading order: P-01 숨김 `h1` 1개 → section `h2` 공지/프로모션/알려드립니다/경험 → footer group `h2` 또는 accordion button.
- INFERRED skip link는 첫 DOM 노드이며 focus 시 x16 y16, padding 12×16px, z100으로 표시된다.
- INFERRED focus 순서: skip → logo → primary nav → utility/search/login → booking tabs/fields/CTA → announcement → cards → notices/app → quick links → footer → floating actions.
- INFERRED focus ring은 `2px #1B78C5`, offset `3px`; 모든 focusable 요소에서 배경 대비 3:1 이상을 목표로 한다.
- INFERRED body text 대비 WCAG AA 4.5:1, 18px 이상 큰 텍스트 3:1, UI 경계/아이콘 3:1을 충족한다.
- INFERRED 모바일 menu button은 `aria-controls`, `aria-expanded`, accessible name을 갖고, open 시 focus containment, Escape close, 이전 trigger focus 복원, body scroll lock을 적용한다.
- INFERRED 현재 페이지 링크는 `aria-current="page"`와 시각 active를 함께 제공한다.
- INFERRED 모든 폼 control은 visible label 또는 programmatic label, error id 연결, 예약 처리 결과 `aria-live=polite`를 가진다.
- INFERRED 사진 alt는 링크 목적을 설명하고, 같은 카드 제목과 중복되는 장식 이미지는 빈 alt다.
- INFERRED carousel 상태는 polite live region으로 `3개 중 2번째`를 알리고 autoplay는 기본 off다.
- INFERRED zoom/reflow: 200%에서 정보 손실 없음, 320 CSS px에서 body 가로 스크롤 없음; 카드 scroller는 명시적 영역 내에서만 허용한다.
- INFERRED touch target은 모바일 최소 44×44px; 요소 사이 최소 8px.
- INFERRED `prefers-reduced-motion:reduce`에서 모든 비필수 motion을 0ms로 하고 smooth scroll을 해제한다.

## 15. Data and Content Model

### 15.1 Entities

| 상태 | entity | fields/type | cardinality/order | optional/format | fallback |
|---|---|---|---|---|---|
| INFERRED | `NavItem` | `id,label,href,children?,disabled?` | 3 primary + utility | children optional | disabled placeholder |
| INFERRED | `SearchDraft` | `mode,tripType,origin,destination,departDate,returnDate?,passengers,cabin,nearby` | 1 | returnDate optional; ISO date | validation message |
| INFERRED | `Announcement` | `id,title,ctaLabel,href,media?` | 1 | media optional | solid pale bg |
| INFERRED | `Promotion` | `id,title,image,href,alt?` | 3 visible; editorial order | alt optional | neutral media |
| INFERRED | `Notice` | `id,title,publishedAt,href` | 4 visible; date desc | ISO→locale date | empty message |
| INFERRED | `QuickLink` | `id,label,icon,href,disabled?` | 8 ordered | disabled optional | omit broken icon |
| INFERRED | `FooterGroup` | `title,links[]` | 5 groups | links 0+ | hide empty group |
| INFERRED | `ProjectBadge` | `label,image?,href?` | 0–4 | image/href optional | text badge |

- OBSERVED 증거 문구는 레이아웃 길이의 근거일 뿐이며 콘텐츠 모델에서는 모두 교체 가능하다.
- INFERRED locale 기본값 `ko-KR`; 날짜 표시는 `YYYY년 MM월 DD일`, 숫자는 `Intl.NumberFormat`.
- INFERRED 프로모션/공지 로딩은 section별 병렬; 하나의 실패가 전체 페이지를 막지 않는다.

### 15.2 Sample fixture shape

```json
{
  "announcement": {"id":"service-update","title":"새로운 비행 경험을 한눈에","ctaLabel":"자세히 보기","href":"/devlog"},
  "promotions": [
    {"id":"p1","title":"새로운 월드와 비행하기","image":"/media/p1.webp","href":"/project"},
    {"id":"p2","title":"항공 시스템 개발 기록","image":"/media/p2.webp","href":"/systems"},
    {"id":"p3","title":"최신 영상과 스크린샷","image":"/media/p3.webp","href":"/media"}
  ],
  "notices": [{"id":"n1","title":"개발 빌드 업데이트","publishedAt":"2026-07-30","href":"/devlog/n1"}]
}
```

## 16. Frontend Architecture

- INFERRED 요구 라우트는 `/` 한 개이며 20절 치환 구현에서는 `/project`, `/systems`, `/media`, `/devlog`, `/download`를 추가한다.
- INFERRED framework-neutral layout: `AppShell`이 header/footer/floating을 소유하고 route page가 main section을 제공한다.
- INFERRED 추천 구조:

```text
src/
  app/AppShell.*
  pages/home/HomePage.*
  components/navigation/{SiteHeader,MobileMenu}.*
  components/booking/{BookingHero,BookingForm}.*
  components/content/{Announcement,PromotionCarousel,NoticeList,QuickLinks}.*
  components/footer/SiteFooter.*
  styles/{tokens,global,responsive}.css
  data/{home,nav,footer}.*
  models/content.*
public/media/{hero,promotions,project,icons}/
tests/{visual,a11y,unit}/
```

- INFERRED styling은 CSS custom properties + component-scoped classes; geometry token과 color token을 분리한다.
- INFERRED state ownership: route loader는 content, BookingForm은 draft/validation, SiteHeader는 menu/search, Carousel은 index를 소유한다.
- INFERRED server/client boundary: 정적 home 콘텐츠는 server/static render, form/menu/carousel만 client enhancement.
- INFERRED third-party 책임: 날짜 선택은 검증된 accessible date-picker, carousel은 native scroll-snap 우선, icons는 Lucide, 이미지 최적화는 framework adapter가 담당한다.
- UNKNOWN 원 기술 스택은 증거로 확인 불가하며 재구현 요구사항과 무관하다.

## 17. Implementation Task Graph

| 상태 | ID | deps | 입력 | 출력/대상 | 완료 기준 | 병렬 그룹 |
|---|---|---|---|---|---|---|
| INFERRED | T01 | - | E-D01/D02/M01 좌표 | visual baseline | 1200/243 overlay grid | A |
| INFERRED | T02 | T01 | 9절 | tokens.css | 모든 token/색 형식 반영 | A |
| INFERRED | T03 | T02 | 4–5절 | AppShell/Header | desktop bounds ±4px | B |
| INFERRED | T04 | T03 | P01-S02 | BookingHero/Form | panel/tabs/form 완료 | C |
| INFERRED | T05 | T02 | P01-S03/S04 | announcement/promos | 3 cards/geometry 완료 | C |
| INFERRED | T06 | T02 | P01-S05 | notices/app | 4 rows+media 완료 | C |
| INFERRED | T07 | T02 | P01-S06 | quick links | 8 items/반응형 완료 | C |
| INFERRED | T08 | T03 | P01-S07/S08 | footer/floating | full footer/고정버튼 완료 | C |
| INFERRED | T09 | T04–T08 | 12절 | responsive CSS | 6 viewport 통과 | D |
| INFERRED | T10 | T04–T08 | 13절 | interactions | keyboard/pointer states | D |
| INFERRED | T11 | T03–T10 | 14절 | accessibility pass | axe critical 0, focus pass | E |
| INFERRED | T12 | T09–T11 | evidence | visual tests | edges/colors tolerance 통과 | F |
| INFERRED | T13 | T12 | assets | performance pass | LCP≤2.5s, CLS≤0.1 | F |
| INFERRED | T14 | T12–T13 | 20절 | Godot content mapping | 원 자산/문구 0건 | G |

## 18. Page-Specific Acceptance Criteria

### P-01 Home checklist

- [ ] MEASURED 1200px screenshot의 전체 페이지 높이가 1672px ±8px이며 E-D01/E-D02 중복 80px을 반복 렌더링하지 않는다.
- [ ] MEASURED header y0–75, hero y75–335, announcement y360–474, promotions y536–760, news y825–1050, quick band y1111–1301, footer y1301–1672 경계가 각각 ±4px다.
- [ ] MEASURED desktop container 좌우 edge x150/x1050가 ±3px이고 카드 3개 width 287–288px, gap 17–18px가 ±2px다.
- [ ] MEASURED header logo x153 y34 w176 h26, menu start x347, search x836 y38 w139 h25, login x981 y38 w69 h25가 허용 오차 내다.
- [ ] INFERRED 평면 UI 색상은 9절 token 대비 `deltaE≤3`; 사진은 pixel color gate에서 제외한다.
- [ ] INFERRED typography size ±1px, line-height ±2px, baseline ±2px이며 카드 제목은 최대 2행이다.
- [ ] INFERRED 1440/1280/1024/768/390/360px에서 텍스트 clipping과 body 가로 overflow가 0px다.
- [ ] INFERRED 768px 이하 menu button target 44×44px, open/close/Escape/focus restore/scroll lock이 동작한다.
- [ ] INFERRED booking form label, error, loading, success 상태를 screen reader가 인식한다.
- [ ] INFERRED 모든 링크/버튼이 keyboard로 도달되고 focus ring이 가려지지 않는다.
- [ ] INFERRED 이미지 aspect ratio와 focal point가 11절과 일치하고 lazy asset이 layout shift를 만들지 않는다.
- [ ] INFERRED visual regression은 1200×1672와 243×339 증거 모드, 실사용 390×844와 360×800에서 수행한다.
- [ ] INFERRED 성능은 mobile 기준 LCP≤2.5s, CLS≤0.1, INP≤200ms, 초기 이미지 hero만 eager다.
- [ ] INFERRED 원 브랜드 로고, 문구, 사진, 앱 배지, 인증 마크가 결과물에 포함되지 않는다.

## 19. Uncertainties and Decisions

| 상태 | page/section | UNKNOWN | 선택한 구현 결정 | 기각 대안 | 신뢰도 | 해결 증거 |
|---|---|---|---|---|---|---|
| UNKNOWN | P01-S01 | 실제 sticky 동작 | static header | 근거 없는 fixed header | MEDIUM | scroll video/CSS |
| UNKNOWN | P01-S01 | mobile open menu | full-height drawer | 작은 dropdown | LOW | menu-open screenshot |
| UNKNOWN | P01-S01 | nav URL/active | `/`만 실제, 나머지 placeholder | unseen route 발명 | HIGH | sitemap/live DOM |
| UNKNOWN | P01-S02 | hero 원 asset/gradient | 새 항공 프로젝트 hero WebP | 원 이미지 복제 | HIGH | 승인된 asset |
| UNKNOWN | P01-S02 | popover 내용 | accessible date/airport dialogs | 비기능 control | MEDIUM | interaction capture |
| UNKNOWN | P01-S04 | carousel autoplay/page 수 | 3개, autoplay off | 자동 전환 | HIGH | video/DOM |
| UNKNOWN | P01-S05 | notice API | static fixture + 독립 error boundary | 전역 실패 | HIGH | API contract |
| UNKNOWN | P01-S06 | tile link 목적 | Godot 섹션으로 매핑 | 원 서비스 URL | HIGH | 프로젝트 IA |
| UNKNOWN | P01-S07 | mobile footer 동작 | accordion | 5열 축소 고정 | MEDIUM | 390px 원본 screenshot |
| UNKNOWN | P01-S08 | chatbot content | 프로젝트 도움말 modal | 외부 AI 서비스 | MEDIUM | open-state evidence |
| UNKNOWN | P-01 | 정확한 font | Pretendard/Noto Sans KR | 유사도 낮은 system only | MEDIUM | CSS/font file |
| UNKNOWN | P-01 | 243px mobile이 CSS viewport인지 thumbnail인지 | 실사용 mobile reflow + evidence fidelity mode 분리 | 읽기 어려운 전면 비례축소만 사용 | MEDIUM | 원 device metadata |
| UNKNOWN | P-01 | 사진 저작권/소유권 | 모두 신규 Godot 항공 asset | 원본 crop 재사용 | HIGH | 사용 허가 |

## Completion Gate

- [x] OBSERVED page/route inventory가 있고 보이는 페이지 P-01을 별도 완전 명세했다.
- [x] MEASURED desktop/mobile navigation geometry와 모든 필수 상태를 수치화했다.
- [x] MEASURED 모든 주요 section이 evidence ID와 x/y/w/h에 연결되었다.
- [x] MEASURED/INFERRED 색상에 HEX, RGB, HSL, alpha, 근거, 신뢰도, tolerance가 있다.
- [x] INFERRED 1440/1280/1024/768/390/360px responsive matrix가 있다.
- [x] INFERRED component props/state/events/data/loading/empty/error/a11y contract가 있다.
- [x] INFERRED P-01 전용 acceptance checklist와 UNKNOWN 결정 기록이 있다.
- [x] OBSERVED/INFERRED/UNKNOWN을 구분하여 누락된 동작을 사실처럼 단정하지 않았다.

## 20. Godot 프로젝트 적용 매핑

### 20.1 Information architecture substitution

| 상태 | 원 구조의 시각 역할 | Godot 항공 프로젝트 치환 | route | 구현 위치/행동 |
|---|---|---|---|---|
| INFERRED | 로고 홈 링크 | 프로젝트명 워드마크 | `/` Home | P01-S01, 새 심볼+텍스트 |
| INFERRED | 예약 | Game/Project | `/project` | 프로젝트 개요, 목표, 세계관 |
| INFERRED | 여행 준비 | Flight Systems | `/systems` | 비행 모델, 항전, 물리, 입력 |
| INFERRED | 스카이패스 | Media | `/media` | 영상, 스크린샷, GIF |
| INFERRED | 이벤트/FAQ utility | Devlog | `/devlog` | 최신 빌드와 변경 기록 |
| INFERRED | 로그인/action | Download/Play CTA | `/download` | 플랫폼 선택, 빌드 다운로드 |
| INFERRED | 예약 검색 hero | Play Configuration | `/download#builds` | 플랫폼/빌드/조작 방식 선택 후 Play CTA |
| INFERRED | 서비스 공지 banner | Latest Release Banner | `/devlog/latest` | 버전 문구+release notes CTA |
| INFERRED | 3개 프로모션 카드 | Project/System/Media featured cards | 각 route | 신규 Godot gameplay asset |
| INFERRED | 알려드립니다 | Devlog latest 4 | `/devlog/:slug` | 제목+날짜 목록 |
| INFERRED | 앱 promo | Download build promo | `/download` | 게임 화면+다운로드 문구 |
| INFERRED | 8개 quick links | Home, Project, Systems, Media, Devlog, Controls, Roadmap, Download | 각 route | Lucide 아이콘, 8 tile |
| INFERRED | 기업 footer | 프로젝트/개발/지원/라이선스/커뮤니티 | 내부/외부 | 원 법인·국가 링크 제거 |
| INFERRED | 챗봇 | Help/Controls | dialog | 조작법과 FAQ, 외부 AI 없음 |

### 20.2 P-01 content mapping

- INFERRED P01-S01은 `Home`, `Game/Project`, `Flight Systems`, `Media`, `Devlog`를 주요 nav로 두고 우측의 가장 강한 action을 `Download / Play`로 바꾼다.
- INFERRED P01-S02의 네 탭은 `Play`, `Builds`, `Controls`, `Requirements`로 치환한다. 첫 화면은 플랫폼, 버전, 그래픽 preset, 입력 장치, 언어를 선택하고 `Download / Play` CTA로 끝난다.
- INFERRED P01-S03은 `Current Build vX.Y`와 한 줄 release 상태를 표시하고 `View Devlog`로 연결한다.
- INFERRED P01-S04의 3개 카드는 `Explore the Game`, `Flight Systems`, `Watch Media` 순서로 두며 실제 Godot 게임플레이, cockpit/system diagram, 영상 thumbnail을 사용한다.
- INFERRED P01-S05의 공지 4행은 Devlog의 `title`, `publishedAt`, `version`을 사용하고 우측 media는 최신 playable build와 지원 플랫폼을 보여준다.
- INFERRED P01-S06의 8개 바로가기는 `Game`, `Flight Model`, `Avionics`, `Media`, `Devlog`, `Controls`, `Roadmap`, `Download`로 구성한다.
- INFERRED P01-S07은 `Project`, `Development`, `Support`, `License`, `Community`의 5그룹으로 바꾸고 저장소/영상/커뮤니티 링크만 노출한다.
- INFERRED P01-S08의 도움말은 `Controls & Troubleshooting` dialog, 위로 가기는 동일 기능으로 유지한다.

### 20.3 Brand-safe asset and copy rules

- INFERRED 원 항공사명, 로고, 태극 심볼, 제휴 서비스명, 앱 이름, 프로모션 문구, 법인 정보, 국가 링크, 앱스토어 배지, 인증 마크는 복제하지 않는다.
- INFERRED 색/레이아웃은 작품의 구조적 인상만 참고하고 프로젝트 고유 팔레트로 조정할 수 있다. 단, 본 명세의 밝은 흰 surface, pale cyan band, navy text, cyan CTA 대비 관계는 유지한다.
- INFERRED 모든 사진은 실제 Godot 프로젝트 캡처 또는 새로 제작한 항공 시뮬레이션 이미지로 교체한다. 원 증거 이미지를 crop하거나 trace하지 않는다.
- INFERRED copy는 기능 중심으로 새로 작성한다. 예: `Build 0.8 is ready`, `Explore the flight model`, `Watch the latest test flight`, `Download for your platform`.
- INFERRED Godot 상표/로고를 사용할 경우 공식 상표 지침과 라이선스를 확인하고, 불명확하면 텍스트 `Built with Godot`와 라이선스 고지를 footer에만 둔다.
- INFERRED 최종 구조는 Home에서 프로젝트를 즉시 체험하게 하고, Game/Project → Flight Systems → Media → Devlog의 정보 탐색과 Download/Play CTA가 모든 주요 section에서 일관되게 수렴하도록 한다.
