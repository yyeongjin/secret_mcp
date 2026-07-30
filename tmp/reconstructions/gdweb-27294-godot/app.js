const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector("#mobile-menu");
const launcherTabs = [...document.querySelectorAll(".launcher-tab")];
const launchForm = document.querySelector(".launch-form");
const projectDialog = document.querySelector("#project-dialog");
const helpDialog = document.querySelector("#help-dialog");
const topButton = document.querySelector(".top-button");
const toast = document.querySelector(".toast");
let toastTimer;

const modeCopy = {
  play: {
    button: "빌드 받기",
    status: "안정 빌드 · 2.6 GB · 세이브 호환",
    icon: "download",
  },
  builds: {
    button: "빌드 선택",
    status: "Stable 0.8.4 · Preview 0.9.0-dev · Archive 6개",
    icon: "package-open",
  },
  controls: {
    button: "조작 확인",
    status: "키보드 · Xbox 컨트롤러 · HOTAS 프리셋",
    icon: "gamepad-2",
  },
  specs: {
    button: "사양 확인",
    status: "Godot 4 · Vulkan · 8 GB RAM · 12 GB 여유 공간",
    icon: "cpu",
  },
};

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons({
      attrs: {
        "aria-hidden": "true",
        "stroke-width": 1.8,
      },
    });
  }
}

function setMenu(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  mobileMenu.hidden = !open;
  document.body.classList.toggle("menu-open", open);
  menuButton.innerHTML = `<i data-lucide="${open ? "x" : "menu"}"></i>`;
  refreshIcons();
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2800);
}

function openDialog(dialog) {
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

menuButton.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});

mobileMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenu(false);
  }
});

launcherTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const mode = tab.dataset.mode;
    const copy = modeCopy[mode];

    launcherTabs.forEach((candidate) => {
      const active = candidate === tab;
      candidate.classList.toggle("active", active);
      candidate.setAttribute("aria-selected", String(active));
    });

    const button = launchForm.querySelector(".launch-button");
    button.innerHTML = `<i data-lucide="${copy.icon}"></i>${copy.button}`;
    launchForm.querySelector(".launch-status").textContent = copy.status;
    refreshIcons();
  });
});

launchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(launchForm);
  const summary = [
    data.get("platform"),
    data.get("aircraft"),
    data.get("region"),
    data.get("weather"),
  ].join(" · ");

  projectDialog.querySelector(".dialog-summary").textContent = summary;
  openDialog(projectDialog);
});

document.querySelectorAll("[data-open-help]").forEach((button) => {
  button.addEventListener("click", () => openDialog(helpDialog));
});

document.querySelectorAll(".project-dialog").forEach((dialog) => {
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});

projectDialog.querySelector(".dialog-cancel").addEventListener("click", () => {
  projectDialog.close();
});

projectDialog.querySelector(".dialog-confirm").addEventListener("click", () => {
  projectDialog.close();
  showToast("AEROFLOW 0.8.4 다운로드 준비가 완료되었습니다.");
});

document.querySelectorAll("[data-toast]").forEach((button) => {
  button.addEventListener("click", () => showToast(button.dataset.toast));
});

topButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener(
  "scroll",
  () => {
    topButton.classList.toggle("visible", window.scrollY > 520);
  },
  { passive: true },
);

window.addEventListener("resize", () => {
  if (window.innerWidth > 1024 && menuButton.getAttribute("aria-expanded") === "true") {
    setMenu(false);
  }
});

refreshIcons();
