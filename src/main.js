import { findNearbyInteractable, createPlayerState, stepPlayer } from "./world.js";
import { renderWorld } from "./renderer.js";
import { createInputController } from "./input.js";
import { createPortfolioUI } from "./ui.js";

const canvas = document.getElementById("game-canvas");
const context = canvas?.getContext("2d", { alpha: false });
const ui = createPortfolioUI();

if (!canvas || !context) {
  ui.announce("The pixel map is unavailable in this browser. Use Quick Navigation or the complete profile below.");
} else {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let player = createPlayerState();
  let nearby = null;
  let previousTime = 0;
  let frameId = 0;
  const input = createInputController(canvas, () => ui.openNearby());

  function animate(now) {
    const elapsed = previousTime === 0 ? 0 : Math.min(now - previousTime, 50);
    previousTime = now;
    if (ui.getMode() === "explore" && !document.querySelector("dialog[open]")) {
      player = stepPlayer(player, input.getDirection(), elapsed);
      nearby = findNearbyInteractable(player);
      ui.setNearby(nearby);
      renderWorld(context, player, nearby, now, reducedMotion.matches, ui.getVisited());
    }
    frameId = window.requestAnimationFrame(animate);
  }

  frameId = window.requestAnimationFrame(animate);
  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    window.cancelAnimationFrame(frameId);
    input.dispose();
  });
}
