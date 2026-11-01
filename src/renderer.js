import { INTERACTABLES, PLAYER_SIZE, WORLD } from "./world.js";

const COLOR = Object.freeze({
  floor: "#18233a",
  floorLight: "#1c2942",
  floorDark: "#151f33",
  wall: "#27334d",
  wallLight: "#3a4968",
  ink: "#0b111d",
  purple: "#aa91ff",
  cyan: "#65e1e3",
  green: "#9ae7a7",
  gold: "#f2cc60",
  white: "#e7edf7",
  skin: "#e7b393",
  hair: "#262638",
  shirt: "#846bd4",
  pants: "#40587f",
});

function rect(ctx, x, y, width, height, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
}

function outline(ctx, x, y, width, height, color, lineWidth = 2) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(x + lineWidth / 2, y + lineWidth / 2, width - lineWidth, height - lineWidth);
}

function text(ctx, value, x, y, color = COLOR.white, size = 8) {
  ctx.fillStyle = color;
  ctx.font = `700 ${size}px monospace`;
  ctx.textBaseline = "top";
  ctx.fillText(value, x, y);
}

function drawFloor(ctx) {
  rect(ctx, 0, 0, WORLD.width, WORLD.height, COLOR.floorDark);
  for (let y = 16; y < WORLD.height - 16; y += 32) {
    for (let x = 16; x < WORLD.width - 16; x += 32) {
      rect(ctx, x + 1, y + 1, 30, 30, ((x / 32 + y / 32) % 2 === 0) ? COLOR.floor : COLOR.floorLight);
      rect(ctx, x + 2, y + 2, 1, 1, "#283650");
    }
  }
  // Luminous floor seams connect the work areas without blocking movement.
  rect(ctx, 16, 188, 608, 2, "#293652");
  rect(ctx, 188, 30, 2, 342, "#293652");
  rect(ctx, 418, 30, 2, 342, "#293652");
  rect(ctx, 188, 188, 232, 2, COLOR.cyan);
  rect(ctx, 298, 188, 2, 4, COLOR.cyan);
  rect(ctx, 70, 187, 28, 3, COLOR.purple);
  rect(ctx, 510, 187, 28, 3, COLOR.green);
}

function drawWalls(ctx) {
  rect(ctx, 0, 0, WORLD.width, 16, COLOR.wall);
  rect(ctx, 0, WORLD.height - 16, WORLD.width, 16, COLOR.wall);
  rect(ctx, 0, 16, 16, WORLD.height - 32, COLOR.wall);
  rect(ctx, WORLD.width - 16, 16, 16, WORLD.height - 32, COLOR.wall);
  for (let x = 0; x < WORLD.width; x += 16) {
    rect(ctx, x + 2, 2, 12, 3, COLOR.wallLight);
    rect(ctx, x + 2, WORLD.height - 6, 12, 2, "#35435f");
  }
  for (let y = 16; y < WORLD.height - 16; y += 16) {
    rect(ctx, 2, y + 2, 3, 12, COLOR.wallLight);
    rect(ctx, WORLD.width - 5, y + 2, 3, 12, "#35435f");
  }
  // A few dark wall screens and ceiling conduits give the room a clear silhouette.
  rect(ctx, 224, 4, 54, 8, "#111827");
  rect(ctx, 230, 6, 40, 2, COLOR.cyan);
  rect(ctx, 346, 4, 76, 8, "#111827");
  rect(ctx, 352, 6, 24, 2, COLOR.purple);
  rect(ctx, 384, 6, 31, 2, COLOR.green);
  rect(ctx, 28, 19, 105, 2, "#596781");
  rect(ctx, 302, 19, 108, 2, "#596781");
  rect(ctx, 510, 19, 100, 2, "#596781");
}

function drawZone(ctx, x, y, width, height, title, color) {
  rect(ctx, x, y, width, height, "rgba(11, 17, 29, .17)");
  outline(ctx, x, y, width, height, "#34415c", 1);
  rect(ctx, x + 8, y + 8, 4, 8, color);
  text(ctx, title, x + 17, y + 8, "#c0cbe0", 8);
  rect(ctx, x + 8, y + 22, Math.min(width - 18, title.length * 5), 1, color);
}

function drawDesk(ctx, x, y, width, height, accent, screenOn = true) {
  // Cabinet, shadow, slab, edge, monitor, keyboard: all shapes stay on the 16-bit grid.
  rect(ctx, x + 5, y + height - 2, width - 1, 7, "#0e1522");
  rect(ctx, x + 9, y + height - 1, 7, 8, "#33415c");
  rect(ctx, x + width - 18, y + height - 1, 7, 8, "#33415c");
  rect(ctx, x, y + 9, width, height - 4, "#3b4964");
  rect(ctx, x + 2, y + 5, width - 4, height - 10, "#6a7891");
  rect(ctx, x + 4, y + 3, width - 8, 3, "#96a3b7");
  const monitorX = x + Math.round(width / 2) - 12;
  rect(ctx, monitorX + 8, y - 5, 8, 6, "#45516a");
  rect(ctx, monitorX, y - 27, 25, 22, "#0b111d");
  rect(ctx, monitorX + 2, y - 25, 21, 17, "#27334a");
  if (screenOn) {
    rect(ctx, monitorX + 4, y - 22, 11, 2, accent);
    rect(ctx, monitorX + 4, y - 18, 16, 2, "#8594ae");
    rect(ctx, monitorX + 4, y - 14, 8, 2, accent);
  }
  rect(ctx, x + 8, y + 8, width - 16, 2, "#b5c1d4");
  rect(ctx, x + 8, y + 12, Math.max(14, width - 30), 3, "#27334a");
  rect(ctx, x + width - 15, y + 11, 5, 5, accent);
}

function drawServerRacks(ctx, time) {
  const positions = [456, 492];
  for (const x of positions) {
    rect(ctx, x + 3, 140, 29, 8, "#0c121d");
    rect(ctx, x, 49, 31, 91, "#303d55");
    rect(ctx, x + 3, 52, 25, 85, "#111a2a");
    rect(ctx, x + 5, 55, 21, 4, "#465570");
    for (let row = 0; row < 5; row += 1) {
      const y = 62 + row * 14;
      rect(ctx, x + 5, y, 21, 10, row % 2 ? "#25334b" : "#202c42");
      rect(ctx, x + 8, y + 3, 10, 2, "#66748c");
      const pulse = Math.floor(time / 380 + row + x) % 3;
      rect(ctx, x + 21, y + 3, 2, 2, pulse === 0 ? COLOR.gold : COLOR.green);
    }
    rect(ctx, x + 2, 45, 27, 4, "#8190a8");
  }
  rect(ctx, 452, 149, 77, 2, COLOR.green);
}

function drawKiosk(ctx, x, y, width, accent) {
  rect(ctx, x + 4, y + 62, width + 10, 7, "#0e1522");
  rect(ctx, x + 10, y + 44, width - 3, 18, "#34415c");
  rect(ctx, x + 4, y + 3, width + 9, 43, "#4d5b75");
  rect(ctx, x + 7, y, width + 3, 43, "#697894");
  rect(ctx, x + 11, y + 4, width - 5, 29, "#0b111d");
  rect(ctx, x + 14, y + 7, width - 11, 23, "#1c2942");
  rect(ctx, x + 17, y + 10, 26, 3, accent);
  rect(ctx, x + 17, y + 16, width - 25, 2, "#c4cee0");
  rect(ctx, x + 17, y + 21, width - 31, 2, accent);
  rect(ctx, x + 14, y + 36, width - 12, 3, "#242f45");
  rect(ctx, x + 18, y + 38, 5, 2, COLOR.green);
  rect(ctx, x + 28, y + 38, 5, 2, COLOR.gold);
}

function drawPlant(ctx, x, y) {
  rect(ctx, x + 4, y + 14, 14, 10, "#765c44");
  rect(ctx, x + 2, y + 12, 18, 4, "#a67b54");
  rect(ctx, x + 9, y + 5, 4, 9, "#4d936d");
  rect(ctx, x + 3, y + 4, 8, 6, "#77c790");
  rect(ctx, x + 12, y, 8, 7, "#62a87c");
  rect(ctx, x + 15, y + 8, 7, 5, "#89d79c");
}

function drawTerminalObjects(ctx, time) {
  drawZone(ctx, 24, 32, 156, 144, "COMMAND / CSIO", COLOR.purple);
  drawZone(ctx, 196, 32, 132, 144, "ENGINEERING", COLOR.cyan);
  drawZone(ctx, 430, 32, 178, 144, "INFRASTRUCTURE", COLOR.green);
  drawZone(ctx, 24, 198, 164, 174, "RESEARCH LAB", COLOR.gold);
  drawZone(ctx, 208, 210, 212, 162, "PROJECT TERMINAL", COLOR.purple);
  drawZone(ctx, 430, 210, 178, 162, "COMMUNICATIONS", COLOR.cyan);

  drawDesk(ctx, 48, 84, 88, 40, COLOR.purple, true);
  drawPlant(ctx, 153, 137);
  // A brass lamp and chair give the leadership office a different silhouette.
  rect(ctx, 146, 68, 10, 3, COLOR.gold);
  rect(ctx, 150, 71, 2, 16, "#b18c53");
  rect(ctx, 144, 87, 14, 3, "#d5b367");
  rect(ctx, 84, 130, 22, 8, "#27334a");
  rect(ctx, 88, 137, 3, 5, "#3b4964");
  rect(ctx, 99, 137, 3, 5, "#3b4964");

  drawDesk(ctx, 198, 55, 104, 50, COLOR.cyan, true);
  rect(ctx, 210, 119, 42, 3, "#8490a6");
  rect(ctx, 212, 122, 37, 4, "#34415c");
  rect(ctx, 265, 117, 20, 5, "#2b3750");
  rect(ctx, 283, 114, 3, 7, COLOR.cyan);

  drawServerRacks(ctx, time);
  rect(ctx, 544, 73, 54, 36, "#111a2a");
  outline(ctx, 544, 73, 54, 36, "#3d4b65", 2);
  rect(ctx, 550, 79, 42, 2, COLOR.green);
  rect(ctx, 550, 85, 26, 2, "#8897ad");
  rect(ctx, 550, 91, 35, 2, "#8897ad");

  // Research bench, microscope, sample tray, and two small beakers.
  rect(ctx, 42, 265, 116, 42, "#4b5a70");
  rect(ctx, 46, 268, 108, 4, "#8390a6");
  rect(ctx, 49, 307, 7, 10, "#33415a");
  rect(ctx, 144, 307, 7, 10, "#33415a");
  rect(ctx, 68, 250, 5, 15, "#c6d0de");
  rect(ctx, 72, 250, 13, 4, "#c6d0de");
  rect(ctx, 81, 253, 4, 11, "#8b9bb2");
  rect(ctx, 65, 262, 20, 4, COLOR.gold);
  rect(ctx, 105, 257, 20, 8, "#3a6780");
  rect(ctx, 108, 254, 14, 4, COLOR.cyan);
  rect(ctx, 111, 259, 8, 3, "#9ce4e1");
  rect(ctx, 89, 276, 29, 3, "#c6d0de");
  rect(ctx, 90, 279, 2, 11, "#c6d0de");
  rect(ctx, 114, 279, 2, 11, "#c6d0de");

  drawKiosk(ctx, 286, 246, 104, COLOR.purple);
  // Stools and a floor power junction are small landmarks, not colliders.
  rect(ctx, 313, 319, 18, 5, "#38445d");
  rect(ctx, 320, 324, 4, 6, "#59677e");
  rect(ctx, 238, 300, 30, 15, "#131d2e");
  outline(ctx, 238, 300, 30, 15, "#465571", 1);
  rect(ctx, 243, 305, 20, 2, COLOR.cyan);
  rect(ctx, 243, 309, 11, 2, COLOR.purple);

  // Communication wall console and a distinct email indicator.
  rect(ctx, 526, 253, 70, 44, "#485773");
  rect(ctx, 530, 256, 62, 37, "#687891");
  rect(ctx, 535, 260, 52, 22, "#0b111d");
  rect(ctx, 538, 263, 46, 16, "#1b2940");
  rect(ctx, 541, 266, 39, 2, COLOR.cyan);
  rect(ctx, 541, 271, 28, 2, "#9eabc0");
  rect(ctx, 541, 276, 34, 2, COLOR.cyan);
  rect(ctx, 542, 285, 8, 4, COLOR.gold);
  rect(ctx, 554, 285, 8, 4, COLOR.green);
  rect(ctx, 566, 285, 8, 4, COLOR.purple);
  const blink = Math.floor(time / 600) % 2 === 0;
  rect(ctx, 577, 261, 4, 4, blink ? COLOR.green : "#43604c");

  // Cables and floor lamps finish the open command-centre layout.
  rect(ctx, 25, 184, 160, 2, "#40506d");
  rect(ctx, 430, 184, 177, 2, "#40506d");
  rect(ctx, 202, 189, 130, 1, "#4a5470");
  rect(ctx, 338, 189, 78, 1, "#4a5470");
  for (const x of [34, 177, 434, 604]) {
    rect(ctx, x, 354, 4, 10, "#c3a967");
    rect(ctx, x - 3, 364, 10, 3, "#584a37");
    rect(ctx, x - 5, 345, 14, 2, "#6e6149");
  }
}

function drawStationMarker(ctx, station, nearby, time, reducedMotion) {
  const selected = nearby?.id === station.id;
  const pulse = reducedMotion ? 0 : Math.floor(time / 260) % 2;
  const color = station.id === "server-room" ? COLOR.green :
    station.id === "research-lab" ? COLOR.gold :
      station.id === "tech-inventory" || station.id === "communication-terminal" ? COLOR.cyan : COLOR.purple;
  const y = station.y - 16 - (selected && pulse ? 2 : 0);
  rect(ctx, station.x - 4, y - 2, 8, 1, selected ? COLOR.gold : "#71809a");
  rect(ctx, station.x - 5, y - 1, 10, 7, selected ? COLOR.gold : color);
  rect(ctx, station.x - 3, y + 1, 6, 3, "#101724");
  rect(ctx, station.x - 1, y + 2, 2, 1, selected ? COLOR.gold : color);
}

function drawPlayer(ctx, player, time, reducedMotion) {
  const x = Math.round(player.x - 1);
  const bounce = reducedMotion ? 0 : player.moving
    ? (Math.floor(time / 115) % 2 ? 1 : 0)
    : Math.round(Math.sin(time / 700));
  const y = Math.round(player.y - 1 + bounce);
  const dark = "#171a2b";
  const eye = player.direction === "left" ? 0 : player.direction === "right" ? 3 : 2;
  rect(ctx, x + 2, y + 17, 12, 3, "rgba(3, 6, 12, .55)");
  // Hair / head / skin / shirt are hand-drawn as a compact original sprite.
  rect(ctx, x + 4, y + 1, 8, 2, dark);
  rect(ctx, x + 2, y + 3, 12, 4, dark);
  rect(ctx, x + 3, y + 6, 10, 5, COLOR.skin);
  rect(ctx, x + 2, y + 4, 3, 4, dark);
  rect(ctx, x + 12, y + 4, 2, 4, dark);
  rect(ctx, x + 5 + eye, y + 7, 2, 2, "#293148");
  rect(ctx, x + 5, y + 11, 8, 2, "#d29a7d");
  rect(ctx, x + 2, y + 13, 12, 6, COLOR.shirt);
  rect(ctx, x + 1, y + 14, 3, 5, COLOR.shirt);
  rect(ctx, x + 5, y + 14, 6, 2, COLOR.cyan);
  rect(ctx, x + 3, y + 19, 10, 5, COLOR.pants);
  const stride = player.moving && !reducedMotion && Math.floor(time / 115) % 2;
  if (stride) {
    rect(ctx, x + 2, y + 22, 5, 3, COLOR.pants);
    rect(ctx, x + 9, y + 20, 5, 3, COLOR.pants);
    rect(ctx, x + 1, y + 24, 5, 2, "#d7d9e2");
    rect(ctx, x + 10, y + 23, 5, 2, "#d7d9e2");
  } else {
    rect(ctx, x + 3, y + 23, 4, 3, COLOR.pants);
    rect(ctx, x + 9, y + 23, 4, 3, COLOR.pants);
    rect(ctx, x + 2, y + 25, 5, 2, "#d7d9e2");
    rect(ctx, x + 9, y + 25, 5, 2, "#d7d9e2");
  }
}

export function renderWorld(ctx, player, nearby, time = 0, reducedMotion = false) {
  if (!ctx) return;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  rect(ctx, 0, 0, WORLD.width, WORLD.height, COLOR.ink);
  drawFloor(ctx);
  drawWalls(ctx);
  drawTerminalObjects(ctx, reducedMotion ? 0 : time);
  for (const station of INTERACTABLES) drawStationMarker(ctx, station, nearby, time, reducedMotion);
  drawPlayer(ctx, player, time, reducedMotion);
  ctx.restore();
}
