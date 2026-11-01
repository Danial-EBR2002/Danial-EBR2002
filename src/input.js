const KEY_DIRECTION = new Map([
  ["w", "up"], ["arrowup", "up"],
  ["a", "left"], ["arrowleft", "left"],
  ["s", "down"], ["arrowdown", "down"],
  ["d", "right"], ["arrowright", "right"],
]);

const VECTOR = Object.freeze({
  up: Object.freeze({ x: 0, y: -1 }),
  down: Object.freeze({ x: 0, y: 1 }),
  left: Object.freeze({ x: -1, y: 0 }),
  right: Object.freeze({ x: 1, y: 0 }),
});

export function createInputController(canvas, onInteract) {
  const keys = new Set();
  const pointerDirections = new Map();
  let keyboardTapDirection = null;
  let keyboardTapExpiresAt = 0;
  let disposed = false;

  function isEditable(target) {
    return target instanceof Element && Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
  }

  function onKeyDown(event) {
    if (disposed || isEditable(event.target) || document.querySelector("dialog[open]")) return;
    if (document.activeElement !== canvas) return;

    const key = event.key.toLowerCase();
    const direction = KEY_DIRECTION.get(key);
    if (direction) {
      event.preventDefault();
      keys.add(direction);
      return;
    }
    if ((key === "e" || key === "enter") && !event.repeat) {
      event.preventDefault();
      onInteract();
    }
  }

  function onKeyUp(event) {
    const direction = KEY_DIRECTION.get(event.key.toLowerCase());
    if (direction) keys.delete(direction);
  }

  function clearOnBlur() {
    keys.clear();
    pointerDirections.clear();
    keyboardTapDirection = null;
  }

  function setPointerDirection(event, direction) {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    pointerDirections.set(event.pointerId, direction);
  }

  function releasePointer(event) {
    pointerDirections.delete(event.pointerId);
  }

  function focusCanvas() {
    canvas.focus({ preventScroll: true });
  }

  function preventContextMenu(event) {
    event.preventDefault();
  }

  function directionFromButtons() {
    let x = 0;
    let y = 0;
    for (const direction of keys) {
      x += VECTOR[direction].x;
      y += VECTOR[direction].y;
    }
    for (const direction of pointerDirections.values()) {
      x += VECTOR[direction].x;
      y += VECTOR[direction].y;
    }
    if (keyboardTapDirection && performance.now() < keyboardTapExpiresAt) {
      x += VECTOR[keyboardTapDirection].x;
      y += VECTOR[keyboardTapDirection].y;
    } else {
      keyboardTapDirection = null;
    }
    return { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
  }

  const moveButtons = [...document.querySelectorAll("[data-move]")];
  const interactButtons = [...document.querySelectorAll("[data-interact]")];
  const moveButtonHandlers = new Map();
  for (const button of moveButtons) {
    const direction = button.dataset.move;
    if (!VECTOR[direction]) continue;
    const handlers = {
      pointerDown: (event) => setPointerDirection(event, direction),
      keyboardClick: (event) => {
        if (event.detail !== 0) return;
        keyboardTapDirection = direction;
        keyboardTapExpiresAt = performance.now() + 180;
      },
      pointerUp: releasePointer,
      pointerCancel: releasePointer,
      lostPointerCapture: releasePointer,
      contextMenu: preventContextMenu,
    };
    moveButtonHandlers.set(button, handlers);
    button.addEventListener("pointerdown", handlers.pointerDown);
    button.addEventListener("click", handlers.keyboardClick);
    button.addEventListener("pointerup", handlers.pointerUp);
    button.addEventListener("pointercancel", handlers.pointerCancel);
    button.addEventListener("lostpointercapture", handlers.lostPointerCapture);
    button.addEventListener("contextmenu", handlers.contextMenu);
  }
  for (const button of interactButtons) button.addEventListener("click", onInteract);
  canvas.addEventListener("pointerdown", focusCanvas);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", clearOnBlur);

  return {
    getDirection: directionFromButtons,
    dispose() {
      disposed = true;
      clearOnBlur();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearOnBlur);
      for (const [button, handlers] of moveButtonHandlers) {
        button.removeEventListener("pointerdown", handlers.pointerDown);
        button.removeEventListener("click", handlers.keyboardClick);
        button.removeEventListener("pointerup", handlers.pointerUp);
        button.removeEventListener("pointercancel", handlers.pointerCancel);
        button.removeEventListener("lostpointercapture", handlers.lostPointerCapture);
        button.removeEventListener("contextmenu", handlers.contextMenu);
      }
      for (const button of interactButtons) button.removeEventListener("click", onInteract);
      canvas.removeEventListener("pointerdown", focusCanvas);
    },
  };
}
