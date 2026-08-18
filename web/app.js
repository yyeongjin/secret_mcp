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
  locale: resolveInitialLocale(),
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
  languageButtons: document.querySelectorAll('[data-language]'),
};

const translations = {
  en: {
    interfaceLanguage: 'Interface language',
    exclusionList: 'Search exclusion list',
    checkingConnection: 'Checking connection',
    refresh: 'Refresh',
    generationRuns: 'Generation runs',
    perWorkDocuments: 'Per-work documents',
    workInformation: 'Work information',
    specification: 'Specification',
    evidence: 'Evidence',
    requestContract: 'Request contract',
    generationLog: 'Generation log',
    zoomOut: 'Zoom out',
    zoomIn: 'Zoom in',
    close: 'Close',
    noRuns: 'No generation runs yet',
    noRunsDescription: 'MCP runs will appear here after they start.',
    isolatedRequests: 'Independent request per work',
    exclusionsApplied: '{count} exclusion(s) applied when the search started',
    works: 'Works',
    generated: 'Generated',
    failed: 'Failed',
    progress: 'Progress {progress}%',
    waitingForResults: 'Waiting for search results',
    selectRun: 'Select a run',
    resultsDescription: 'Per-work documents appear after the GDWEB search completes.',
    excluded: 'Excluded',
    imageCount: '{count} image(s)',
    unknownRegistrationDate: 'Registration date unknown',
    unknownProductionCompany: 'Production company unknown',
    includeNextSearch: 'Include in the next search',
    excludeNextSearch: 'Exclude from the next search',
    removeExclusion: 'Remove exclusion',
    excludeFromSearch: 'Exclude from search',
    loadingDocument: 'Loading document',
    copyMarkdown: 'Copy Markdown',
    markdownCopied: 'Markdown copied.',
    enlargeEvidence: 'Enlarge {label} image {part}/{total}',
    originalGdwebImage: 'Original GDWEB image',
    worksFound: '{count} work(s) found.',
    isolatedImageRequest: 'Independent request with {count} evidence image(s).',
    exclusionsWereApplied: 'Exclusions were applied.',
    workFailed: 'Failed to process the work.',
    processing: 'Processing',
    selectDocument: 'Select a per-work document',
    separateDocuments: 'Every work has its own DESIGN_INDEX document.',
    loadFailed: 'Unable to load',
    manualExclusionReason: 'Manually excluded in the web viewer',
    includedToast: '{referenceId} will be included in the next search.',
    excludedToast: '{referenceId} will be excluded from the next search.',
    noExclusions: 'No works are excluded',
    exclusionRemoved: 'Search exclusion removed.',
    online: 'Live connection',
    offline: 'Disconnected',
    requestCount: '{count} request(s)',
    status: {
      searching: 'Searching GDWEB',
      processing: 'Generating per work',
      completed: 'Generation complete',
      completed_with_errors: 'Completed with errors',
      failed: 'Failed',
      queued: 'Queued',
      loading_evidence: 'Loading evidence',
      preparing_images: 'Preparing images',
      sampling: 'Independent LLM writing',
      writing: 'Saving file',
      generated: 'Document generated',
    },
    event: {
      'run.created': 'Run created',
      'search.exclusions.applied': 'Search exclusions applied',
      'search.completed': 'GDWEB search complete',
      'item.evidence.loading': 'Loading work evidence',
      'item.evidence.preparing': 'Splitting and compressing image evidence',
      'item.sampling.started': 'Independent LLM request started',
      'item.document.writing': 'Saving document file',
      'item.generated': 'Per-work DESIGN_INDEX generated',
      'item.failed': 'Work processing failed',
      'run.completed': 'Full run complete',
      'run.failed': 'Run failed',
    },
  },
  ko: {
    interfaceLanguage: '인터페이스 언어',
    exclusionList: '검색 제외 목록',
    checkingConnection: '연결 확인 중',
    refresh: '새로고침',
    generationRuns: '생성 작업',
    perWorkDocuments: '작품별 문서',
    workInformation: '작품 정보 보기',
    specification: '명세서',
    evidence: '근거 이미지',
    requestContract: '요청 계약',
    generationLog: '생성 기록',
    zoomOut: '축소',
    zoomIn: '확대',
    close: '닫기',
    noRuns: '생성 기록이 없습니다',
    noRunsDescription: 'MCP 작업이 시작되면 여기에 표시됩니다.',
    isolatedRequests: '작품별 독립 요청',
    exclusionsApplied: '검색 시작 시 제외 필터 {count}개 적용',
    works: '작품',
    generated: '생성',
    failed: '실패',
    progress: '진행률 {progress}%',
    waitingForResults: '검색 결과를 기다리는 중입니다',
    selectRun: '작업을 선택하세요',
    resultsDescription: 'GDWEB 검색이 완료되면 작품별 문서가 나타납니다.',
    excluded: '검색 제외',
    imageCount: '{count}장',
    unknownRegistrationDate: '등록일 미상',
    unknownProductionCompany: '제작사 미상',
    includeNextSearch: '다음 검색에 다시 포함',
    excludeNextSearch: '다음 검색에서 제외',
    removeExclusion: '제외 해제',
    excludeFromSearch: '검색 제외',
    loadingDocument: '문서를 불러오는 중입니다',
    copyMarkdown: 'Markdown 복사',
    markdownCopied: 'Markdown을 복사했습니다.',
    enlargeEvidence: '{label} 이미지 {part}/{total} 확대',
    originalGdwebImage: 'GDWEB 원본 이미지',
    worksFound: '{count}개 작품을 찾았습니다.',
    isolatedImageRequest: '{count}개 이미지 근거를 포함한 독립 요청입니다.',
    exclusionsWereApplied: '제외 항목이 적용되었습니다.',
    workFailed: '작품 처리에 실패했습니다.',
    processing: '처리 중입니다',
    selectDocument: '작품별 문서를 선택하세요',
    separateDocuments: '각 작품의 DESIGN_INDEX는 별도 문서로 표시됩니다.',
    loadFailed: '불러오지 못했습니다',
    manualExclusionReason: '웹 뷰어에서 수동 제외',
    includedToast: '{referenceId}를 다음 검색에 다시 포함합니다.',
    excludedToast: '{referenceId}를 다음 검색에서 제외합니다.',
    noExclusions: '제외한 작품이 없습니다',
    exclusionRemoved: '검색 제외를 해제했습니다.',
    online: '실시간 연결',
    offline: '연결 끊김',
    requestCount: '{count}개 요청',
    status: {
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
    },
    event: {
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
    },
  },
};

function resolveInitialLocale() {
  const queryLocale = new URLSearchParams(window.location.search).get('lang');
  if (queryLocale === 'ko' || queryLocale === 'en') return queryLocale;
  return window.localStorage.getItem('secret-mcp-locale') === 'ko' ? 'ko' : 'en';
}

function lookupTranslation(key) {
  return key.split('.').reduce((value, part) => value?.[part], translations[state.locale]);
}

function t(key, values = {}) {
  const template = lookupTranslation(key) ?? translations.en[key] ?? key;
  return String(template).replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
}

function statusLabel(status) {
  return lookupTranslation(`status.${status}`) || status;
}

function eventLabel(code) {
  return lookupTranslation(`event.${code}`) || code;
}

elements.languageButtons.forEach(button => {
  button.addEventListener('click', () => setLocale(button.dataset.language));
});
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
  applyStaticTranslations();
  renderGlobalEmpty();
  refreshIcons();
  await refresh(false);
  state.refreshTimer = window.setInterval(() => refresh(false), 2500);
}

function setLocale(locale) {
  if (locale !== 'en' && locale !== 'ko') return;
  state.locale = locale;
  state.renderedViewKey = null;
  window.localStorage.setItem('secret-mcp-locale', locale);
  const url = new URL(window.location.href);
  if (locale === 'ko') {
    url.searchParams.set('lang', 'ko');
  } else {
    url.searchParams.delete('lang');
  }
  window.history.replaceState({}, '', url);
  applyStaticTranslations();
  renderAll();
  if (state.health) setConnection(true);
}

function applyStaticTranslations() {
  document.documentElement.lang = state.locale;
  document.querySelectorAll('[data-i18n]').forEach(node => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(node => {
    node.title = t(node.dataset.i18nTitle);
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(node => {
    node.setAttribute('aria-label', t(node.dataset.i18nAriaLabel));
  });
  elements.languageButtons.forEach(button => {
    const active = button.dataset.language === state.locale;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
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
      t('noRuns'),
      t('noRunsDescription')
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
    <p>${escapeHtml(t('isolatedRequests'))} · includeContext: ${escapeHtml(run.isolation?.includeContext || 'none')}</p>
    <p>${escapeHtml(t('exclusionsApplied', { count: exclusionCount }))}</p>
    <div class="summary-grid">
      ${summaryCell(run.total, t('works'))}
      ${summaryCell(run.generated, t('generated'))}
      ${summaryCell(run.failed, t('failed'))}
    </div>
    <div class="progress-track" aria-label="${escapeAttribute(t('progress', { progress }))}">
      <div class="progress-bar" style="width:${progress}%"></div>
    </div>
  `;
}

function renderReferenceList() {
  const run = getSelectedRun();
  if (!run || run.items.length === 0) {
    elements.referenceList.innerHTML = emptyMarkup(
      'search',
      run ? t('waitingForResults') : t('selectRun'),
      run ? t('resultsDescription') : ''
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
            ${excluded ? `<span class="excluded-label">${escapeHtml(t('excluded'))}</span>` : ''}
            <span class="run-time">${escapeHtml(t('imageCount', { count: item.evidence.length }))}</span>
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
        <p>${escapeHtml(item.registeredDate || t('unknownRegistrationDate'))} · ${escapeHtml(item.productionCompany || t('unknownProductionCompany'))} · ${escapeHtml(item.model || statusLabel(item.status))}</p>
      </div>
      <div class="viewer-actions">
        <button
          class="command-button exclusion-toggle${excluded ? ' is-active' : ''}"
          type="button"
          data-exclusion-toggle
          title="${escapeAttribute(excluded ? t('includeNextSearch') : t('excludeNextSearch'))}"
        >
          <i data-lucide="${excluded ? 'rotate-ccw' : 'list-x'}"></i>
          <span>${escapeHtml(excluded ? t('removeExclusion') : t('excludeFromSearch'))}</span>
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
  elements.viewerContent.innerHTML = loadingMarkup(t('loadingDocument'));
  refreshIcons();

  try {
    const payload = await fetchJson(
      `/api/runs/${encodeURIComponent(run.runId)}/items/${encodeURIComponent(item.referenceId)}/${kind}`
    );
    if (elements.viewerContent.dataset.contentKey !== selectedKey) return;
    elements.viewerContent.innerHTML = `
      <article class="document-shell">
        <div class="document-toolbar">
          <button class="icon-button copy-button" type="button" title="${escapeAttribute(t('copyMarkdown'))}" aria-label="${escapeAttribute(t('copyMarkdown'))}">
            <i data-lucide="copy"></i>
          </button>
        </div>
        <div class="markdown-body">${payload.html}</div>
      </article>
    `;
    elements.viewerContent.querySelector('.copy-button').addEventListener('click', async () => {
      await navigator.clipboard.writeText(payload.markdown);
      showToast(t('markdownCopied'));
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
                aria-label="${escapeAttribute(t('enlargeEvidence', { label, part: evidence.part, total: evidence.totalParts }))}"
              >
                <img src="${escapeAttribute(url)}" alt="${escapeAttribute(`${item.title} ${label} ${evidence.part}/${evidence.totalParts}`)}" loading="lazy" />
              </button>
              <figcaption class="evidence-caption">
                <div class="evidence-title-row">
                  <strong>${label} · ${evidence.part}/${evidence.totalParts}</strong>
                  <a href="${escapeAttribute(evidence.sourceUrl)}" target="_blank" rel="noreferrer noopener" title="${escapeAttribute(t('originalGdwebImage'))}" aria-label="${escapeAttribute(t('originalGdwebImage'))}">
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
              <strong>${escapeHtml(eventLabel(event.code))}</strong>
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
    return t('worksFound', { count: event.detail || '0' });
  }
  if (event.code === 'item.sampling.started') {
    return t('isolatedImageRequest', { count: event.detail || '0' });
  }
  if (event.code === 'search.exclusions.applied') {
    return event.detail || t('exclusionsWereApplied');
  }
  if (event.referenceId) return event.referenceId;
  return event.detail || 'Secret MCP';
}

function pendingMarkup(item) {
  if (item.status === 'failed') {
    return errorMarkup(item.error || t('workFailed'));
  }
  return loadingMarkup(statusLabel(item.status) || t('processing'));
}

function renderGlobalEmpty() {
  state.renderedViewKey = null;
  elements.viewerContent.innerHTML = emptyMarkup(
    'file-search',
    t('selectDocument'),
    t('separateDocuments')
  );
  refreshIcons();
}

function statusMarkup(status) {
  return `
    <span class="status-line status-${escapeHtml(status)}">
      <span class="status-dot" aria-hidden="true"></span>
      <span>${escapeHtml(statusLabel(status))}</span>
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
      <strong>${escapeHtml(t('loadFailed'))}</strong>
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

function localizeExclusionReason(reason) {
  if (
    reason === translations.en.manualExclusionReason ||
    reason === translations.ko.manualExclusionReason
  ) {
    return t('manualExclusionReason');
  }
  return reason;
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
            reason: t('manualExclusionReason'),
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
        ? t('includedToast', { referenceId: item.referenceId })
        : t('excludedToast', { referenceId: item.referenceId })
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
      t('noExclusions'),
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
        <p>${escapeHtml(localizeExclusionReason(item.reason))}</p>
        <time>${escapeHtml(formatDateTime(item.createdAt))}</time>
      </div>
      <button
        class="icon-button exclusion-remove"
        type="button"
        data-exclusion-remove="${escapeAttribute(item.referenceId)}"
        title="${escapeAttribute(t('removeExclusion'))}"
        aria-label="${escapeAttribute(`${item.title} ${t('removeExclusion')}`)}"
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
          showToast(t('exclusionRemoved'));
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
    online ? t('online') : t('offline');
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
  return `${years} · ${t('requestCount', { count: run.requestedLimit })}`;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat(state.locale === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatTime(value) {
  return new Intl.DateTimeFormat(state.locale === 'ko' ? 'ko-KR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(value));
}

function formatRelativeTime(value) {
  const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat(state.locale === 'ko' ? 'ko-KR' : 'en-US', { numeric: 'auto' });
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
