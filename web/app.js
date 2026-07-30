const state = {
  runs: [],
  exclusions: [],
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
  exclusionsButton: document.querySelector('#exclusionsButton'),
  exclusionCount: document.querySelector('#exclusionCount'),
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
  exclusionsDialog: document.querySelector('#exclusionsDialog'),
  closeExclusionsButton: document.querySelector('#closeExclusionsButton'),
  exclusionList: document.querySelector('#exclusionList'),
  exclusionsPath: document.querySelector('#exclusionsPath'),
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
  'search.exclusions.applied': '검색 제외 목록 적용',
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
elements.exclusionsButton.addEventListener('click', () => {
  renderExclusionDialog();
  elements.exclusionsDialog.showModal();
  refreshIcons();
});
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
elements.closeExclusionsButton.addEventListener('click', () => {
  elements.exclusionsDialog.close();
});
elements.exclusionsDialog.addEventListener('click', event => {
  if (event.target === elements.exclusionsDialog) {
    elements.exclusionsDialog.close();
  }
});

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
    const [health, runsPayload, exclusionsPayload] = await Promise.all([
      fetchJson('/api/health'),
      fetchJson('/api/runs'),
      fetchJson('/api/exclusions'),
    ]);
    if (version !== state.requestVersion) return;
    state.health = health;
    state.runs = runsPayload.runs;
    state.exclusions = exclusionsPayload.items;
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
  elements.exclusionCount.textContent = String(state.exclusions.length);
  elements.exclusionCount.hidden = state.exclusions.length === 0;
  const runsDisplayPath = state.health
    ? '$DESIGN_INDEX_OUTPUT_DIR/.secret-mcp-runs'
    : '';
  elements.watchPath.textContent = runsDisplayPath;
  elements.watchPath.title = runsDisplayPath;
  renderRunList();
  renderRunOverview();
  renderReferenceList();
  renderViewerHeader();
  renderExclusionDialog();
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
  const exclusionCount = run.exclusions?.activeAtStart?.length ?? 0;
  elements.runOverview.innerHTML = `
    <span class="eyebrow">${escapeHtml(run.runId.slice(-8).toUpperCase())}</span>
    <h2>${escapeHtml(run.query)}</h2>
    <p>${escapeHtml(formatDateTime(run.createdAt))} · ${escapeHtml(formatRunRange(run))}</p>
    <p>작품별 독립 요청 · includeContext: ${escapeHtml(run.isolation?.includeContext || 'none')}</p>
    <p>검색 시작 시 제외 필터 ${exclusionCount}개 적용</p>
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
    const excluded = isExcluded(item.referenceId);
    return `
      <button class="reference-item${active}${excluded ? ' is-excluded' : ''}" type="button" data-reference-id="${escapeHtml(item.referenceId)}">
        <span class="reference-number">${String(index + 1).padStart(2, '0')} · ${escapeHtml(item.referenceId)}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.award || item.concept || 'GDWEB reference')}</p>
        <div class="item-meta">
          ${statusMarkup(item.status)}
          <span class="reference-side-meta">
            ${excluded ? '<span class="excluded-label">검색 제외</span>' : ''}
            <span class="run-time">${item.evidence.length}장</span>
          </span>
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

  const excluded = isExcluded(item.referenceId);
  elements.viewerHeader.innerHTML = `
    <div class="viewer-title-row">
      <div>
        <span class="eyebrow">${escapeHtml(item.referenceId.toUpperCase())}</span>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.registeredDate || '등록일 미상')} · ${escapeHtml(item.productionCompany || '제작사 미상')} · ${escapeHtml(item.model || statusLabels[item.status] || item.status)}</p>
      </div>
      <div class="viewer-actions">
        <button
          class="command-button exclusion-toggle${excluded ? ' is-active' : ''}"
          type="button"
          data-exclusion-toggle
          title="${excluded ? '다음 검색에 다시 포함' : '다음 검색에서 제외'}"
        >
          <i data-lucide="${excluded ? 'rotate-ccw' : 'list-x'}"></i>
          <span>${excluded ? '제외 해제' : '검색 제외'}</span>
        </button>
        <a class="external-link" href="${escapeAttribute(item.gdwebUrl)}" target="_blank" rel="noreferrer noopener">
          <span>GDWEB</span>
          <i data-lucide="external-link"></i>
        </a>
      </div>
    </div>
  `;
  elements.viewerHeader
    .querySelector('[data-exclusion-toggle]')
    .addEventListener('click', () => toggleExclusion(getSelectedRun(), item));
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
                ${renderEvidenceMeasurement(evidence)}
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
  if (event.code === 'search.exclusions.applied') {
    return event.detail || '제외 항목이 적용되었습니다.';
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

function isExcluded(referenceId) {
  return state.exclusions.some(item => item.referenceId === referenceId);
}

async function toggleExclusion(run, item) {
  if (!run || !item) return;
  const excluded = isExcluded(item.referenceId);
  const button = elements.viewerHeader.querySelector('[data-exclusion-toggle]');
  if (button) button.disabled = true;

  try {
    const payload = excluded
      ? await fetchJson(`/api/exclusions/${encodeURIComponent(item.referenceId)}`, {
          method: 'DELETE',
        })
      : await fetchJson('/api/exclusions', {
          method: 'POST',
          body: JSON.stringify({
            referenceId: item.referenceId,
            title: item.title,
            gdwebUrl: item.gdwebUrl,
            reason: '웹 뷰어에서 수동 제외',
            sourceRunId: run.runId,
          }),
        });
    state.exclusions = payload.items;
    elements.exclusionCount.textContent = String(state.exclusions.length);
    elements.exclusionCount.hidden = state.exclusions.length === 0;
    renderReferenceList();
    renderViewerHeader();
    renderExclusionDialog();
    refreshIcons();
    showToast(
      excluded
        ? `${item.referenceId}를 다음 검색에 다시 포함합니다.`
        : `${item.referenceId}를 다음 검색에서 제외합니다.`
    );
  } catch (error) {
    showToast(error.message);
    renderViewerHeader();
    refreshIcons();
  }
}

function renderExclusionDialog() {
  const exclusionsDisplayPath = state.health
    ? '$DESIGN_INDEX_OUTPUT_DIR/.secret-mcp/exclusions.json'
    : '';
  elements.exclusionsPath.textContent = exclusionsDisplayPath;
  elements.exclusionsPath.title = exclusionsDisplayPath;

  if (state.exclusions.length === 0) {
    elements.exclusionList.innerHTML = emptyMarkup(
      'list-checks',
      '제외한 작품이 없습니다',
      ''
    );
    refreshIcons();
    return;
  }

  elements.exclusionList.innerHTML = state.exclusions.map(item => `
    <div class="exclusion-item">
      <div class="exclusion-copy">
        <span class="eyebrow">${escapeHtml(item.referenceId.toUpperCase())}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.reason)}</p>
        <time>${escapeHtml(formatDateTime(item.createdAt))}</time>
      </div>
      <button
        class="icon-button exclusion-remove"
        type="button"
        data-exclusion-remove="${escapeAttribute(item.referenceId)}"
        title="제외 해제"
        aria-label="${escapeAttribute(`${item.title} 제외 해제`)}"
      >
        <i data-lucide="rotate-ccw"></i>
      </button>
    </div>
  `).join('');

  elements.exclusionList
    .querySelectorAll('[data-exclusion-remove]')
    .forEach(button => {
      button.addEventListener('click', async () => {
        button.disabled = true;
        try {
          const payload = await fetchJson(
            `/api/exclusions/${encodeURIComponent(button.dataset.exclusionRemove)}`,
            { method: 'DELETE' }
          );
          state.exclusions = payload.items;
          elements.exclusionCount.textContent = String(state.exclusions.length);
          elements.exclusionCount.hidden = state.exclusions.length === 0;
          renderReferenceList();
          renderViewerHeader();
          renderExclusionDialog();
          refreshIcons();
          showToast('검색 제외를 해제했습니다.');
        } catch (error) {
          button.disabled = false;
          showToast(error.message);
        }
      });
    });
  refreshIcons();
}

function renderEvidenceMeasurement(evidence) {
  if (
    evidence.cropTop === undefined ||
    !Array.isArray(evidence.representativeColors)
  ) {
    return '';
  }
  const palette = evidence.representativeColors.map(color => `
    <span
      class="palette-swatch"
      style="--swatch:${escapeAttribute(color.hex)}"
      title="${escapeAttribute(`${color.hex} · ${formatPercent(color.coverage)}`)}"
    >
      <span aria-hidden="true"></span>
      <code>${escapeHtml(color.hex)}</code>
    </span>
  `).join('');

  return `
    <div class="evidence-measurement">
      <code>canvas ${evidence.preparedCanvasWidth}x${evidence.preparedCanvasHeight} scale ${formatScale(evidence.scaleX)}x</code>
      <code>crop x:${evidence.cropLeft} y:${evidence.cropTop} w:${evidence.width} h:${evidence.height}</code>
      <code>source y:${evidence.sourceCropTop} h:${evidence.sourceCropHeight}</code>
      <div class="palette-row">${palette}</div>
    </div>
  `;
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

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
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

function formatPercent(value) {
  return `${Number((Number(value || 0) * 100).toFixed(2))}%`;
}

function formatScale(value) {
  return Number(Number(value || 0).toFixed(4));
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
