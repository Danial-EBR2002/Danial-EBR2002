import { GITHUB_PROFILE, PANELS, PROJECTS } from "./portfolio-data.js";
import { INTERACTABLES } from "./world.js";

function makeElement(tag, className, textContent) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent !== undefined) element.textContent = textContent;
  return element;
}

function renderProjectCards(container) {
  if (!container) return;
  const fragment = document.createDocumentFragment();
  for (const project of PROJECTS) {
    const card = makeElement("article", "project-card");
    const title = makeElement("h3", "", project.title);
    const description = makeElement("p", "", project.description);
    const tags = makeElement("div", "project-tags");
    tags.setAttribute("aria-label", "Technologies and topics");
    for (const technology of project.technologies) {
      tags.append(makeElement("span", "project-tag", technology));
    }
    const link = makeElement("a", "project-link", `Open ${project.repository} repository ↗`);
    link.href = project.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    card.append(title, description, tags, link);
    fragment.append(card);
  }
  container.replaceChildren(fragment);
}

function copyBody(source, destination) {
  const original = source.querySelector(".archive-panel__body");
  if (!original) return;
  const body = original.cloneNode(true);
  body.removeAttribute("id");
  for (const element of body.querySelectorAll("[id]")) element.removeAttribute("id");
  for (const link of body.querySelectorAll("a[href^='https://']")) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  destination.replaceChildren(body);
}

export function createPortfolioUI(onModeChange = () => {}) {
  const dialog = document.getElementById("info-dialog");
  const title = document.getElementById("dialog-title");
  const kicker = document.getElementById("dialog-kicker");
  const content = document.getElementById("dialog-content");
  const explore = document.getElementById("explore-mode");
  const quick = document.getElementById("quick-mode");
  const status = document.getElementById("game-status");
  const prompt = document.getElementById("interaction-prompt");
  let lastTrigger = null;
  let activeMode = "explore";
  let nearbyId = null;
  const visited = new Set();
  const progressCount = document.getElementById("file-progress-count");
  const progressBar = document.getElementById("file-progress-bar");
  const progressTrack = document.getElementById("file-progress-track");

  renderProjectCards(document.getElementById("project-grid"));

  function setStatus(message) {
    if (status && status.textContent !== message) status.textContent = message;
  }

  function setMode(mode) {
    activeMode = mode === "quick" ? "quick" : "explore";
    const quickActive = activeMode === "quick";
    if (explore) explore.hidden = quickActive;
    if (quick) quick.hidden = !quickActive;
    document.body.dataset.navigationMode = activeMode;
    for (const button of document.querySelectorAll("[data-mode]")) {
      const selected = button.dataset.mode === activeMode;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    }
    if (quickActive) {
      setStatus("Quick Navigation is ready. Choose a terminal to open its portfolio file.");
    } else {
      setStatus("Explore with WASD or arrow keys. Your full profile is available below.");
    }
    onModeChange(activeMode);
  }

  function markVisited(id) {
    if (!INTERACTABLES.some((station) => station.id === id) || visited.has(id)) return;
    visited.add(id);
    const total = INTERACTABLES.length;
    for (const button of document.querySelectorAll(`.station-list [data-open-panel="${id}"]`)) {
      button.closest("li")?.classList.add("is-visited");
    }
    if (progressCount) progressCount.textContent = `${visited.size} / ${total}`;
    if (progressBar) progressBar.style.width = `${Math.round((visited.size / total) * 100)}%`;
    progressTrack?.setAttribute("aria-valuenow", String(visited.size));
    if (visited.size === total) {
      setStatus("All six terminals opened. Thanks for exploring the whole office!");
    }
  }

  function openPanel(id, trigger = document.activeElement) {
    const panel = PANELS[id];
    const source = panel && document.getElementById(panel.sectionId);
    if (!panel || !source || !dialog || !title || !content) {
      setStatus("That portfolio file is not available. Use the complete profile below.");
      return false;
    }
    lastTrigger = trigger instanceof HTMLElement ? trigger : null;
    title.textContent = panel.title;
    if (kicker) kicker.textContent = `CSIO TERMINAL / ${panel.file}`;
    copyBody(source, content);
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    markVisited(id);
    return true;
  }

  function openNearby() {
    if (!nearbyId) {
      setStatus("No terminal in range. Move closer to a marked station or use Quick Navigation.");
      return false;
    }
    return openPanel(nearbyId);
  }

  function setNearby(station) {
    const id = station?.id ?? null;
    if (id === nearbyId) return;
    nearbyId = id;
    if (!prompt) return;
    if (station) {
      prompt.textContent = `E / ENTER  ·  ${station.label}`;
      prompt.hidden = false;
      setStatus(`${station.label} in range. Press E or Enter, or tap Interact.`);
    } else {
      prompt.hidden = true;
      if (activeMode === "explore" && !dialog?.open) {
        setStatus("Explore with WASD or arrow keys. Your full profile is available below.");
      }
    }
  }

  for (const button of document.querySelectorAll("[data-mode]")) {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  }
  document.addEventListener("click", (event) => {
    const closeButton = event.target.closest("[data-close-dialog]");
    if (closeButton && dialog?.open) {
      dialog.close();
      return;
    }
    const trigger = event.target.closest("[data-open-panel]");
    if (trigger) openPanel(trigger.dataset.openPanel, trigger);
  });
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog?.addEventListener("close", () => {
    content?.replaceChildren();
    if (lastTrigger?.isConnected) lastTrigger.focus({ preventScroll: true });
  });

  // Profile link is kept as a page anchor too, so it remains useful when JS is off.
  const profileLinks = document.querySelectorAll("[data-profile-url]");
  for (const link of profileLinks) link.href = GITHUB_PROFILE;

  return {
    openNearby,
    openPanel,
    setMode,
    setNearby,
    getMode: () => activeMode,
    getVisited: () => visited,
    announce: setStatus,
  };
}
