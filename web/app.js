const state = {
  runs: [],
  selectedRunId: new URLSearchParams(window.location.search).get('run'),
  selectedReferenceId: null,
  activeTab: 'document',
  health: null,
  refreshTimer: null,
  requestVersion: 0,
  renderedViewKey: null,
  zoom: 1,
};

const elements = {
  connection: document.querySelector('#connectionState'),
  refreshButton: document.querySelector('#refreshButton'),
  runCount: document.querySelector('#runCount'),
  runList: document.querySelector('#runList'),
  watchPath: document.querySelector('#watchPath'),
  runOverview: document.querySelector('#runOverview'),
  referenceList: document.querySelector('#referenceList'),
  viewerHeader: document.querySelector('#viewerHeader'),
  viewerTabs: document.querySelector('#viewerTabs'),
  viewerContent: document.querySelector('#viewerContent'),
  imageDialog: document.querySelector('#imageDialog'),
  dialogImage: document.querySelector('#dialogImage'),
  dialogTitle: document.querySelector('#dialogTitle'),
  zoomValue: document.querySelector('#zoomValue'),
  zoomOutButton: document.querySelector('#zoomOutButton'),
  zoomInButton: document.querySelector('#zoomInButton'),
  closeDialogButton: document.querySelector('#closeDialogButton'),
  toast: document.querySelector('#toast'),
};

const statusLabels = {
  searching: 'GDWEB 검색 중',
  processing: '작품별 생성 중',
  completed: '생성 완료',
  completed_with_errors: '일부 실패',
  failed: '실패',
  queued: '대기 중',
  loading_evidence: '근거 불러오는 중',
  preparing_images: '이미지 준비 중',
  sampling: '독립 LLM 작성 중',
  writing: '파일 저장 중',
  generated: '문서 생성 완료',
};

const eventLabels = {
  'run.created': '작업 생성',
  'search.completed': 'GDWEB 검색 완료',
  'item.evidence.loading': '작품 근거 불러오기',
  'item.evidence.preparing': '이미지 근거 분할 및 압축',
  'item.sampling.started': '독립 LLM 요청 시작',
  'item.document.writing': '문서 파일 저장',
  'item.generated': '작품별 DESIGN_INDEX 생성 완료',
  'item.failed': '작품 처리 실패',
  'run.completed': '전체 작업 완료',
  'run.failed': '작업 실패',
};

elements.refreshButton.addEventListener('click', () => refresh(true));
elements.viewerTabs.addEventListener('click', event => {
  const button = event.target.closest('[data-tab]');
  if (!button) return;
  state.activeTab = button.dataset.tab;
  state.renderedViewKey = null;
  updateTabState();
  renderActiveView();
});

elements.closeDialogButton.addEventListener('click', () => {
  elements.imageDialog.close();
});
elements.zoomOutButton.addEventListener('click', () => setZoom(state.zoom - 0.2));
elements.zoomInButton.addEventListener('click', () => setZoom(state.zoom + 0.2));
elements.imageDialog.addEventListener('click', event => {
  if (event.target === elements.imageDialog) elements.imageDialog.close();
});
elements.imageDialog.addEventListener('close', () => setZoom(1));

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) refresh(false);
});

await initialize();

async function initialize() {
  renderGlobalEmpty();
  refreshIcons();
  await refresh(false);
  state.refreshTimer = window.setInterval(() => refresh(false), 2500);
}

async function refresh(userInitiated) {
  const version = ++state.requestVersion;
  if (userInitiated) {
    elements.refreshButton.classList.add('is-spinning');
  }

  try {
    const [health, runsPayload] = await Promise.all([
      fetchJson('/api/health'),
      fetchJson('/api/runs'),
    ]);
    if (version !== state.requestVersion) return;
    state.health = health;
    state.runs = runsPayload.runs;
    ensureSelection();
    renderAll();
    setConnection(true);
  } catch (error) {
    if (version !== state.requestVersion) return;
    setConnection(false);
    if (userInitiated) showToast(error.message);
  } finally {
    elements.refreshButton.classList.remove('is-spinning');
  }
}

function ensureSelection() {
  if (!state.runs.some(run => run.runId === state.selectedRunId)) {
    state.selectedRunId = state.runs[0]?.runId ?? null;
  }

  const run = getSelectedRun();
  if (!run?.items.some(item => item.referenceId === state.selectedReferenceId)) {
    state.selectedReferenceId =
      run?.items.find(item => item.status === 'generated')?.referenceId ??
      run?.items[0]?.referenceId ??
      null;
  }

  const url = new URL(window.location.href);
  if (state.selectedRunId) {
    url.searchParams.set('run', state.selectedRunId);
  } else {
    url.searchParams.delete('run');
  }
  window.history.replaceState({}, '', url);
}

function renderAll() {
  elements.runCount.textContent = String(state.runs.length);
  elements.watchPath.textContent = state.health?.runsDirectory ?? '';
  elements.watchPath.title = state.health?.runsDirectory ?? '';
  renderRunList();
  renderRunOverview();
  renderReferenceList();
  renderViewerHeader();
  updateTabState();
  renderActiveView();
  refreshIcons();
}

function renderRunList() {
  if (state.runs.length === 0) {
    elements.runList.innerHTML = emptyMarkup(
      'inbox',
      '생성 기록이 없습니다',
      'MCP 작업이 시작되면 여기에 표시됩니다.'
    );
    return;
  }

  elements.runList.innerHTML = state.runs.map(run => {
    const active = run.runId === state.selectedRunId ? ' is-active' : '';
    return `
      <button class="run-item${active}" type="button" data-run-id="${escapeHtml(run.runId)}">
        <strong>${escapeHtml(run.query)}</strong>
        <p>${escapeHtml(formatRunRange(run))}</p>
        <div class="run-meta">
          ${statusMarkup(run.status)}
          <span class="run-time">${escapeHtml(formatRelativeTime(run.updatedAt))}</span>
        </div>
      </button>
    `;
  }).join('');

  elements.runList.querySelectorAll('[data-run-id]').forEach(button => {
    button.addEventListener('click', () => {
      state.selectedRunId = button.dataset.runId;
      state.selectedReferenceId = null;
      state.renderedViewKey = null;
      ensureSelection();
      renderAll();
    });
  });
}

function renderRunOverview() {
  const run = getSelectedRun();
  if (!run) {
    elements.runOverview.innerHTML = '';
    return;
  }

  const finished = run.generated + run.failed;
  const progress = run.total > 0 ? Math.round((finished / run.total) * 100) : 0;
  elements.runOverview.innerHTML = `
    <span class="eyebrow">${escapeHtml(run.runId.slice(-8).toUpperCase())}</span>
    <h2>${escapeHtml(run.query)}</h2>
    <p>${escapeHtml(formatDateTime(run.createdAt))} · ${escapeHtml(formatRunRange(run))}</p>
    <p>작품별 독립 요청 · includeContext: ${escapeHtml(run.isolation?.includeContext || 'none')}</p>
    <div class="summary-grid">
      ${summaryCell(run.total, '작품')}
      ${summaryCell(run.generated, '생성')}
      ${summaryCell(run.failed, '실패')}
    </div>
    <div class="progress-track" aria-label="진행률 ${progress}%">
      <div class="progress-bar" style="width:${progress}%"></div>
    </div>
  `;
}

function renderReferenceList() {
  const run = getSelectedRun();
  if (!run || run.items.length === 0) {
    elements.referenceList.innerHTML = emptyMarkup(
      'search',
      run ? '검색 결과를 기다리는 중입니다' : '작업을 선택하세요',
      run ? 'GDWEB 검색이 완료되면 작품별 문서가 나타납니다.' : ''
    );
    return;
  }

  elements.referenceList.innerHTML = run.items.map((item, index) => {
    const active =
      item.referenceId === state.selectedReferenceId ? ' is-active' : '';
    return `
      <button class="reference-item${active}" type="button" data-reference-id="${escapeHtml(item.referenceId)}">
        <span class="reference-number">${String(index + 1).padStart(2, '0')} · ${escapeHtml(item.referenceId)}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.award || item.concept || 'GDWEB reference')}</p>
        <div class="item-meta">
          ${statusMarkup(item.status)}
          <span class="run-time">${item.evidence.length}장</span>
        </div>
      </button>
    `;
  }).join('');

  elements.referenceList
    .querySelectorAll('[data-reference-id]')
    .forEach(button => {
      button.addEventListener('click', () => {
        state.selectedReferenceId = button.dataset.referenceId;
        state.renderedViewKey = null;
        renderReferenceList();
        renderViewerHeader();
        renderActiveView();
        refreshIcons();
      });
    });
}

function renderViewerHeader() {
  const item = getSelectedItem();
  if (!item) {
    elements.viewerHeader.innerHTML = '';
    return;
  }

  elements.viewerHeader.innerHTML = `
    <div class="viewer-title-row">
      <div>
        <span class="eyebrow">${escapeHtml(item.referenceId.toUpperCase())}</span>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.registeredDate || '등록일 미상')} · ${escapeHtml(item.productionCompany || '제작사 미상')} · ${escapeHtml(item.model || statusLabels[item.status] || item.status)}</p>
      </div>
      <a class="external-link" href="${escapeAttribute(item.gdwebUrl)}" target="_blank" rel="noreferrer noopener">
        <span>GDWEB</span>
        <i data-lucide="external-link"></i>
      </a>
    </div>
  `;
}

function updateTabState() {
  elements.viewerTabs.querySelectorAll('[data-tab]').forEach(button => {
    const active = button.dataset.tab === state.activeTab;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-current', active ? 'page' : 'false');
  });
}

async function renderActiveView() {
  const run = getSelectedRun();
  const item = getSelectedItem();
  if (!run || !item) {
    renderGlobalEmpty();
    return;
  }
  const viewKey = `${run.runId}:${item.referenceId}:${state.activeTab}:${run.updatedAt}:${item.status}`;
  if (state.renderedViewKey === viewKey) return;
  state.renderedViewKey = viewKey;

  if (state.activeTab === 'evidence') {
    renderEvidence(run, item);
    return;
  }
  if (state.activeTab === 'events') {
    renderEvents(run, item);
    return;
  }
  if (state.activeTab === 'document') {
    if (!item.documentPath) {
      elements.viewerContent.innerHTML = pendingMarkup(item);
      refreshIcons();
      return;
    }
    await renderMarkdown(run, item, 'document');
    return;
  }
  if (state.activeTab === 'contract') {
    if (!item.contractPath) {
      elements.viewerContent.innerHTML = pendingMarkup(item);
      refreshIcons();
      return;
    }
    await renderMarkdown(run, item, 'contract');
  }
}

async function renderMarkdown(run, item, kind) {
  const selectedKey = `${run.runId}:${item.referenceId}:${kind}:${run.updatedAt}`;
  elements.viewerContent.dataset.contentKey = selectedKey;
  elements.viewerContent.innerHTML = loadingMarkup('문서를 불러오는 중입니다');
  refreshIcons();

  try {
    const payload = await fetchJson(
      `/api/runs/${encodeURIComponent(run.runId)}/items/${encodeURIComponent(item.referenceId)}/${kind}`
    );
    if (elements.viewerContent.dataset.contentKey !== selectedKey) return;
    elements.viewerContent.innerHTML = `
      <article class="document-shell">
        <div class="document-toolbar">
          <button class="icon-button copy-button" type="button" title="Markdown 복사" aria-label="Markdown 복사">
            <i data-lucide="copy"></i>
          </button>
        </div>
        <div class="markdown-body">${payload.html}</div>
      </article>
    `;
    elements.viewerContent.querySelector('.copy-button').addEventListener('click', async () => {
      await navigator.clipboard.writeText(payload.markdown);
      showToast('Markdown을 복사했습니다.');
    });
    refreshIcons();
  } catch (error) {
    state.renderedViewKey = null;
    elements.viewerContent.innerHTML = errorMarkup(error.message);
    refreshIcons();
  }
}

function renderEvidence(run, item) {
  if (item.evidence.length === 0) {
    elements.viewerContent.innerHTML = pendingMarkup(item);
    refreshIcons();
    return;
  }

  elements.viewerContent.innerHTML = `
    <div class="evidence-view">
      <div class="evidence-grid">
        ${item.evidence.map(evidence => {
          const filename = evidence.relativePath.split('/').pop();
          const url = `/api/runs/${encodeURIComponent(run.runId)}/evidence/${encodeURIComponent(filename)}`;
          const label = evidence.sourceKind === 'desktop' ? 'Desktop' : 'Mobile';
          return `
            <figure class="evidence-card">
              <button
                class="evidence-button"
                type="button"
                data-image-url="${escapeAttribute(url)}"
                data-image-title="${escapeAttribute(`${label} ${evidence.part}/${evidence.totalParts}`)}"
                aria-label="${escapeAttribute(`${label} 이미지 ${evidence.part}/${evidence.totalParts} 확대`)}"
              >
                <img src="${escapeAttribute(url)}" alt="${escapeAttribute(`${item.title} ${label} ${evidence.part}/${evidence.totalParts}`)}" loading="lazy" />
              </button>
              <figcaption class="evidence-caption">
                <div class="evidence-title-row">
                  <strong>${label} · ${evidence.part}/${evidence.totalParts}</strong>
                  <a href="${escapeAttribute(evidence.sourceUrl)}" target="_blank" rel="noreferrer noopener" title="GDWEB 원본 이미지" aria-label="GDWEB 원본 이미지">
                    <i data-lucide="external-link"></i>
                  </a>
                </div>
                <div class="evidence-meta">
                  <span>${evidence.width} × ${evidence.height}</span>
                  <span>${formatBytes(evidence.byteLength)}</span>
                </div>
              </figcaption>
            </figure>
          `;
        }).join('')}
      </div>
    </div>
  `;

  elements.viewerContent.querySelectorAll('[data-image-url]').forEach(button => {
    button.addEventListener('click', () => {
      openImageDialog(
        button.dataset.imageUrl,
        button.dataset.imageTitle
      );
    });
  });
}

function renderEvents(run, item) {
  const events = run.events.filter(event =>
    !event.referenceId || event.referenceId === item.referenceId
  );
  elements.viewerContent.innerHTML = `
    <div class="events-view">
      <ol class="timeline">
        ${events.map(event => `
          <li class="timeline-item">
            <time class="timeline-time">${escapeHtml(formatTime(event.at))}</time>
            <span class="timeline-marker" aria-hidden="true"></span>
            <div class="timeline-copy">
              <strong>${escapeHtml(eventLabels[event.code] || event.code)}</strong>
              <span>${escapeHtml(eventDetail(event))}</span>
            </div>
          </li>
        `).join('')}
      </ol>
    </div>
  `;
}

function eventDetail(event) {
  if (event.code === 'search.completed') {
    return `${event.detail || '0'}개 작품을 찾았습니다.`;
  }
  if (event.code === 'item.sampling.started') {
    return `${event.detail || '0'}개 이미지 근거를 포함한 독립 요청입니다.`;
  }
  if (event.referenceId) return event.referenceId;
  return event.detail || 'Secret MCP';
}

function pendingMarkup(item) {
  if (item.status === 'failed') {
    return errorMarkup(item.error || '작품 처리에 실패했습니다.');
  }
  return loadingMarkup(statusLabels[item.status] || '처리 중입니다');
}

function renderGlobalEmpty() {
  state.renderedViewKey = null;
  elements.viewerContent.innerHTML = emptyMarkup(
    'file-search',
    '작품별 문서를 선택하세요',
    '각 작품의 DESIGN_INDEX는 별도 문서로 표시됩니다.'
  );
  refreshIcons();
}

function statusMarkup(status) {
  return `
    <span class="status-line status-${escapeHtml(status)}">
      <span class="status-dot" aria-hidden="true"></span>
      <span>${escapeHtml(statusLabels[status] || status)}</span>
    </span>
  `;
}

function summaryCell(value, label) {
  return `
    <div class="summary-cell">
      <strong>${Number(value || 0)}</strong>
      <span>${escapeHtml(label)}</span>
    </div>
  `;
}

function loadingMarkup(message) {
  return `
    <div class="loading-state">
      <i data-lucide="loader-circle"></i>
      <strong>${escapeHtml(message)}</strong>
    </div>
  `;
}

function errorMarkup(message) {
  return `
    <div class="error-state">
      <i data-lucide="circle-alert"></i>
      <strong>불러오지 못했습니다</strong>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

function emptyMarkup(icon, title, description) {
  return `
    <div class="empty-state">
      <i data-lucide="${escapeAttribute(icon)}"></i>
      <strong>${escapeHtml(title)}</strong>
      ${description ? `<p>${escapeHtml(description)}</p>` : ''}
    </div>
  `;
}

function getSelectedRun() {
  return state.runs.find(run => run.runId === state.selectedRunId) ?? null;
}

function getSelectedItem() {
  return getSelectedRun()?.items.find(
    item => item.referenceId === state.selectedReferenceId
  ) ?? null;
}

function setConnection(online) {
  elements.connection.classList.toggle('is-online', online);
  elements.connection.classList.toggle('is-offline', !online);
  elements.connection.querySelector('span:last-child').textContent =
    online ? '실시간 연결' : '연결 끊김';
}

function openImageDialog(url, title) {
  elements.dialogImage.src = url;
  elements.dialogImage.alt = title;
  elements.dialogTitle.textContent = title;
  setZoom(1);
  elements.imageDialog.showModal();
}

function setZoom(value) {
  state.zoom = Math.min(3, Math.max(0.4, value));
  elements.dialogImage.style.width = `${state.zoom * 100}%`;
  elements.zoomValue.textContent = `${Math.round(state.zoom * 100)}%`;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `HTTP ${response.status}`);
  }
  return response.json();
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('is-visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.classList.remove('is-visible');
  }, 2200);
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons({
      attrs: {
        'aria-hidden': 'true',
      },
    });
  }
}

function formatRunRange(run) {
  const years = run.allowedYears?.join(' · ') || run.targetYear;
  return `${years} · ${run.requestedLimit}개 요청`;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatTime(value) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(value));
}

function formatRelativeTime(value) {
  const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat('ko-KR', { numeric: 'auto' });
  if (Math.abs(seconds) < 60) return formatter.format(seconds, 'second');
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return formatter.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return formatter.format(hours, 'hour');
  return formatter.format(Math.round(hours / 24), 'day');
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('`', '&#096;');
}
