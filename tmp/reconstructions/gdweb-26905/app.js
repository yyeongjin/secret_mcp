const state = {
  feedIndex: 0,
};

const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const searchInput = document.querySelector('#portalSearch');
const searchStatus = document.querySelector('[data-search-status]');
const progress = document.querySelector('[data-progress]');
const feedItems = [...document.querySelectorAll('.feed-item')];

if (window.lucide) {
  window.lucide.createIcons({
    attrs: {
      'aria-hidden': 'true',
    },
  });
}

menuButton.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  menuButton.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}"></i>`;
  window.lucide?.createIcons();
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.innerHTML = '<i data-lucide="menu"></i>';
    window.lucide?.createIcons();
  });
});

document.querySelector('[data-search-focus]').addEventListener('click', () => {
  searchInput.focus();
});

document.querySelector('[data-language]').addEventListener('click', event => {
  const label = event.currentTarget.querySelector('span');
  label.textContent = label.textContent === 'KR' ? 'EN' : 'KR';
});

document.querySelector('[data-search-form]').addEventListener('submit', event => {
  event.preventDefault();
  applySearch(searchInput.value);
});

document.querySelectorAll('[data-keyword]').forEach(button => {
  button.addEventListener('click', () => {
    searchInput.value = button.dataset.keyword;
    applySearch(button.dataset.keyword);
  });
});

document.querySelectorAll('[data-summary-toggle]').forEach(button => {
  button.addEventListener('click', () => {
    const row = button.closest('.news-row');
    const collapsed = row.classList.toggle('is-collapsed');
    button.innerHTML = `요약보기 <i data-lucide="chevron-${collapsed ? 'down' : 'up'}"></i>`;
    window.lucide?.createIcons();
  });
});

document.querySelector('[data-more-news]').addEventListener('click', event => {
  const extra = document.querySelector('.news-row.is-extra');
  const visible = extra.classList.toggle('is-visible');
  event.currentTarget.querySelector('span').textContent =
    visible ? '접기' : '더 보기';
  event.currentTarget.querySelector('svg')?.remove();
  event.currentTarget.insertAdjacentHTML(
    'afterbegin',
    `<i data-lucide="${visible ? 'minus' : 'plus'}"></i>`
  );
  window.lucide?.createIcons();
});

document.querySelector('[data-feed-prev]').addEventListener('click', () => {
  state.feedIndex = (state.feedIndex - 1 + feedItems.length) % feedItems.length;
  updateFeed();
});

document.querySelector('[data-feed-next]').addEventListener('click', () => {
  state.feedIndex = (state.feedIndex + 1) % feedItems.length;
  updateFeed();
});

window.setInterval(() => {
  const clock = document.querySelector('[data-clock]');
  const now = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul',
  }).format(new Date());
  clock.innerHTML = `${now} <small>(Seoul)</small>`;
}, 1000);

function updateFeed() {
  feedItems.forEach((item, index) => {
    item.classList.toggle('is-featured', index === state.feedIndex);
  });
  progress.style.width = `${((state.feedIndex + 1) / feedItems.length) * 100}%`;
}

function applySearch(rawQuery) {
  const query = rawQuery.trim().toLocaleLowerCase('ko-KR');
  const targets = [...document.querySelectorAll('[data-searchable]')];
  let count = 0;

  targets.forEach(target => {
    const matched =
      query.length === 0 ||
      target.dataset.searchable.toLocaleLowerCase('ko-KR').includes(query) ||
      target.textContent.toLocaleLowerCase('ko-KR').includes(query);
    target.classList.toggle('is-search-match', matched && query.length > 0);
    target.classList.toggle('is-search-dimmed', !matched && query.length > 0);
    if (matched && query.length > 0) count += 1;
  });

  searchStatus.textContent =
    query.length > 0 ? `"${rawQuery.trim()}" 관련 콘텐츠 ${count}건` : '';
  searchStatus.classList.toggle('is-visible', query.length > 0);
  if (count > 0) {
    document.querySelector('.is-search-match')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
}

updateFeed();
