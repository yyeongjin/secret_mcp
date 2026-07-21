const viewButtons = [...document.querySelectorAll('[data-view-button]')];
const views = [...document.querySelectorAll('[data-view]')];

viewButtons.forEach(button => {
  button.addEventListener('click', () => {
    const selectedView = button.dataset.viewButton;

    viewButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-selected', String(selected));
    });

    views.forEach(view => {
      view.classList.toggle('is-active', view.dataset.view === selectedView);
    });
  });
});
