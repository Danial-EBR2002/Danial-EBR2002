export const WORLD = Object.freeze({ width: 640, height: 400, tileSize: 16 });
export const PLAYER_SIZE = Object.freeze({ width: 14, height: 26 });
export const PLAYER_SPEED = 112;
export const MAX_FRAME_MS = 50;

export const SOLID_OBJECTS = Object.freeze([
  Object.freeze({ x: 48, y: 84, width: 88, height: 40 }),
  Object.freeze({ x: 198, y: 55, width: 104, height: 50 }),
  Object.freeze({ x: 454, y: 48, width: 72, height: 92 }),
  Object.freeze({ x: 42, y: 265, width: 116, height: 42 }),
  Object.freeze({ x: 286, y: 246, width: 104, height: 62 }),
  Object.freeze({ x: 526, y: 253, width: 70, height: 44 }),
]);

export const INTERACTABLES = Object.freeze([
  Object.freeze({ id: "command-center", label: "CSIO Office", x: 92, y: 74 }),
  Object.freeze({ id: "tech-inventory", label: "Developer Workstation", x: 250, y: 115 }),
  Object.freeze({ id: "server-room", label: "Server Room", x: 490, y: 151 }),
  Object.freeze({ id: "research-lab", label: "Research Laboratory", x: 100, y: 324 }),
  Object.freeze({ id: "quest-log", label: "Project Terminal", x: 338, y: 326 }),
  Object.freeze({ id: "communication-terminal", label: "Communication Terminal", x: 561, y: 322 }),
]);

const SAFE_BOUNDS = Object.freeze({ left: 26, top: 30, right: 614, bottom: 372 });

export function createPlayerState(x = 313, y = 193) {
  return { x, y, direction: "down", moving: false };
}

function overlaps(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
    a.y < b.y + b.height && a.y + a.height > b.y;
}

function isBlocked(x, y) {
  const playerBox = { x, y, width: PLAYER_SIZE.width, height: PLAYER_SIZE.height };
  if (x < SAFE_BOUNDS.left || y < SAFE_BOUNDS.top ||
      x + PLAYER_SIZE.width > SAFE_BOUNDS.right ||
      y + PLAYER_SIZE.height > SAFE_BOUNDS.bottom) {
    return true;
  }
  return SOLID_OBJECTS.some((solid) => overlaps(playerBox, solid));
}

export function stepPlayer(player, direction, elapsedMs) {
  const dxInput = Number.isFinite(direction?.x) ? direction.x : 0;
  const dyInput = Number.isFinite(direction?.y) ? direction.y : 0;
  const magnitude = Math.hypot(dxInput, dyInput);
  const normalizedX = magnitude > 1 ? dxInput / magnitude : dxInput;
  const normalizedY = magnitude > 1 ? dyInput / magnitude : dyInput;
  const delta = Number.isFinite(elapsedMs) ? Math.min(Math.max(elapsedMs, 0), MAX_FRAME_MS) : 0;
  const distance = PLAYER_SPEED * delta / 1000;
  let x = player.x;
  let y = player.y;

  const nextX = x + normalizedX * distance;
  if (!isBlocked(nextX, y)) x = nextX;
  const nextY = y + normalizedY * distance;
  if (!isBlocked(x, nextY)) y = nextY;

  let facing = player.direction;
  if (Math.abs(normalizedX) > Math.abs(normalizedY) && normalizedX !== 0) {
    facing = normalizedX < 0 ? "left" : "right";
  } else if (normalizedY !== 0) {
    facing = normalizedY < 0 ? "up" : "down";
  } else if (normalizedX !== 0) {
    facing = normalizedX < 0 ? "left" : "right";
  }

  return { x, y, direction: facing, moving: x !== player.x || y !== player.y };
}

export function findNearbyInteractable(player, radius = 38) {
  const centerX = player.x + PLAYER_SIZE.width / 2;
  const centerY = player.y + PLAYER_SIZE.height / 2;
  const radiusSquared = radius * radius;
  let nearest = null;
  let nearestDistanceSquared = radiusSquared;

  for (const station of INTERACTABLES) {
    const dx = station.x - centerX;
    const dy = station.y - centerY;
    const distanceSquared = dx * dx + dy * dy;
    if (distanceSquared <= nearestDistanceSquared) {
      nearest = station;
      nearestDistanceSquared = distanceSquared;
    }
  }
  return nearest;
}
