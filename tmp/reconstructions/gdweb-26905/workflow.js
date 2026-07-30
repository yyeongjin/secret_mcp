const steps = [
  {
    kicker: 'STEP 01 · USER REQUEST',
    title: '자연어 요청을 MCP 작업으로 변환',
    description: '검색 주제, 연도 범위, 결과 수와 작품별 문서 생성 조건을 하나의 실행 단위로 고정합니다.',
  },
  {
    kicker: 'STEP 02 · LOCAL SEARCH',
    title: 'GDWEB 커스텀 검색엔진 실행',
    description: '브라우저 검색 없이 GDWEB 내부 결과에서 2025–2026 수상작을 찾고 제외 목록을 먼저 적용합니다.',
  },
  {
    kicker: 'STEP 03 · EVIDENCE',
    title: '작품별 시각 근거를 로컬에 저장',
    description: '긴 데스크톱 화면은 겹치는 타일로 분리하고 모바일 근거와 함께 작품 ID 아래에 격리합니다.',
  },
  {
    kicker: 'STEP 04 · ISOLATED SAMPLING',
    title: '각 작품을 별도 LLM 요청으로 분석',
    description: '한 작품의 근거만 전달하므로 다른 결과의 레이아웃과 요약이 섞이지 않고 DESIGN_INDEX도 각각 생성됩니다.',
  },
  {
    kicker: 'STEP 05 · DESIGN SPECIFICATION',
    title: '명세 본문에 픽셀과 구조를 기록',
    description: '페이지 치수, 색상 토큰, 내비게이션, 섹션별 레이아웃과 반응형 기준을 LLM이 그대로 구현할 수 있는 단위로 작성합니다.',
  },
  {
    kicker: 'STEP 06 · IMPLEMENTATION',
    title: '명세를 실제 프론트엔드로 구현',
    description: '내비게이션, 섹션 구조, 반응형 규칙과 상호작용을 HTML, CSS, JavaScript 결과물로 변환합니다.',
  },
  {
    kicker: 'STEP 07 · VISUAL QA',
    title: '근거 이미지와 결과물을 직접 비교',
    description: '섹션 순서, 전체 높이, 반응형 상태와 런타임 오류를 확인해 LLM의 결과를 사람이 검증할 수 있게 합니다.',
  },
];

const buttons = [...document.querySelectorAll('[data-step-button]')];
const panels = [...document.querySelectorAll('[data-panel]')];
const events = [...document.querySelectorAll('[data-event]')];
const query = new URLSearchParams(window.location.search);
let currentStep = Math.min(7, Math.max(1, Number(query.get('step')) || 1));

function renderStep(step) {
  currentStep = step;
  const content = steps[step - 1];
  document.querySelector('[data-step-kicker]').textContent = content.kicker;
  document.querySelector('[data-step-title]').textContent = content.title;
  document.querySelector('[data-step-description]').textContent = content.description;
  document.querySelector('[data-step-count]').textContent = `${String(step).padStart(2, '0')} / 07`;
  document.querySelector('[data-progress]').style.width = `${(step / 7) * 100}%`;

  buttons.forEach((button, index) => {
    button.classList.toggle('is-active', index + 1 === step);
    button.classList.toggle('is-complete', index + 1 < step);
  });
  panels.forEach(panel => panel.classList.toggle('is-active', Number(panel.dataset.panel) === step));
  events.forEach((event, index) => {
    event.classList.toggle('is-active', index + 1 === step);
    event.classList.toggle('is-complete', index + 1 < step);
  });
}

buttons.forEach(button => {
  button.addEventListener('click', () => renderStep(Number(button.dataset.stepButton)));
});

renderStep(currentStep);
