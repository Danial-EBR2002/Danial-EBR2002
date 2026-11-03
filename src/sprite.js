// Hand-authored pixel sprite of the portfolio owner: dark, voluminous swept-back
// hair, full dark beard with a defined moustache, warm olive skin, and a dark
// green crew-neck tee. Heads are drawn from character grids; torso, arms and
// legs are small rects so four walk frames stay easy to read and tweak.

export const SPRITE = Object.freeze({ width: 20, height: 32, footOffset: 6, headOffsetX: 2 });

export const PALETTE = Object.freeze({
  O: "#120d0c", // outline
  H: "#251c19", // hair
  h: "#54413a", // hair highlight
  S: "#dca57f", // skin
  s: "#b9805f", // skin shadow
  K: "#1a1210", // eyebrow
  E: "#24140d", // eye
  W: "#f1e4da", // eye white
  B: "#3a2b23", // beard
  b: "#54402f", // beard highlight
  M: "#a8685a", // lips
  T: "#2f5a45", // shirt
  t: "#214133", // shirt shadow
  u: "#3f7258", // shirt highlight
  P: "#2e3548", // jeans
  p: "#222839", // jeans shadow
  F: "#e4e6ee", // sneaker
  f: "#aeb4c4", // sneaker shadow
});

// 16 x 16 heads. "." is transparent.
export const HEADS = Object.freeze({
  down: Object.freeze([
    "....OOOOOOOO....",
    "..OOHHhhHHhHOO..",
    ".OHHhHHHHhHHHHO.",
    "OHhHHHHhHHHHHhHO",
    "OHHHHHhHHHHHHHHO",
    "OHHHSSSSSSSSHHHO",
    "OHSSSSSSSSSSSSHO",
    "OSSKKKSSSSKKKSSO",
    "OSSWEESSSSWEESSO",
    "OSsssSSSSSSsssSO",
    "OBBSSSSssSSSSBBO",
    "OBBBBbBBBBbBBBBO",
    "OBBBBBMMMMBBBBBO",
    ".OBBbBBBBBBbBBO.",
    "..OOBBBBBBBBOO..",
    "....OOOOOOOO....",
  ]),
  up: Object.freeze([
    "....OOOOOOOO....",
    "..OOHHhHHhHHOO..",
    ".OHHhHHHhHHHhHO.",
    "OHhHHHHHhHHHHHHO",
    "OHHHhHHHHHHhHHHO",
    "OHHHHHHhHHHHHhHO",
    "OHhHHHHHHHHhHHHO",
    "OHHHHhHHHHHHHHHO",
    "OSHHHHHHHhHHHHSO",
    "OSsHHhHHHHHHHsSO",
    "OBBHHHHHHHHHHBBO",
    "OBBBHHhHHHhHBBBO",
    "OBBBBHHHHHHBBBBO",
    ".OBBBBBHHBBBBBO.",
    "..OOBBBBBBBBOO..",
    "....OOOOOOOO....",
  ]),
  // Faces left; the right-facing head is mirrored at draw time.
  side: Object.freeze([
    "....OOOOOOOO....",
    "..OOHHhHHhHHOO..",
    ".OHHhHHHHhHHHHO.",
    "OHhHHhHHHHHhHHHO",
    "OHHHHHHhHHHHHHHO",
    "OSHHHhHHHHHHhHHO",
    "OSSSHHHHHHHHHHHO",
    "OSSSSHHHHhHHHHHO",
    "OKKKSSHHHHHHHHHO",
    "SSEWSSSHHSSHHHHO",
    "OSSSSSBBBSsBHHHO",
    "OBBBbBBBBBBBBHHO",
    ".OMBBbBBBBBBBBO.",
    "..OBBBBbBBBBBO..",
    "...OOBBBBBBOO...",
    ".....OOOOOO.....",
  ]),
});

export function mirrorRow(row) {
  return [...row].reverse().join("");
}

function fillRow(ctx, row, x, y, mirrored) {
  const cells = mirrored ? mirrorRow(row) : row;
  let start = 0;
  while (start < cells.length) {
    const key = cells[start];
    let end = start + 1;
    while (end < cells.length && cells[end] === key) end += 1;
    const color = PALETTE[key];
    if (color) {
      ctx.fillStyle = color;
      ctx.fillRect(x + start, y, end - start, 1);
    }
    start = end;
  }
}

function box(ctx, x, y, width, height, key) {
  ctx.fillStyle = PALETTE[key];
  ctx.fillRect(x, y, width, height);
}

// Four-frame walk cycle: contact, passing, contact (other leg), passing.
export function walkFrame(time, moving, reducedMotion) {
  if (!moving || reducedMotion) return 0;
  return Math.floor(time / 110) % 4;
}

function legOffsets(frame) {
  // Positive lift raises the foot. Index 0 = left leg, 1 = right leg.
  return [[0, 0], [2, 0], [0, 0], [0, 2]][frame];
}

function armOffsets(frame) {
  // Arms swing opposite to the legs, expressed as a vertical shift.
  return [[0, 0], [-1, 1], [0, 0], [1, -1]][frame];
}

function drawFrontBack(ctx, x, y, facing, frame) {
  const [liftL, liftR] = legOffsets(frame);
  const [armL, armR] = armOffsets(frame);
  // Legs and sneakers.
  for (const [lx, lift] of [[5, liftL], [10, liftR]]) {
    box(ctx, x + lx - 1, y + 25, 6, 7 - lift, "O");
    box(ctx, x + lx, y + 25, 4, 4 - lift, "P");
    box(ctx, x + lx, y + 25, 1, 4 - lift, "p");
    box(ctx, x + lx, y + 29 - lift, 4, 2, "F");
    box(ctx, x + lx, y + 30 - lift, 4, 1, "f");
  }
  // Torso (hem at row 25).
  box(ctx, x + 3, y + 16, 14, 10, "O");
  box(ctx, x + 4, y + 16, 12, 9, "T");
  box(ctx, x + 4, y + 23, 12, 2, "t");
  box(ctx, x + 6, y + 17, 3, 1, "u");
  box(ctx, x + 12, y + 19, 2, 1, "u");
  box(ctx, x + 7, y + 16, 6, 1, "t"); // collar
  if (facing === "down") box(ctx, x + 8, y + 17, 4, 1, "t"); // crew neck dips at the front
  // Arms with hands.
  for (const [ax, shift] of [[1, armL], [17, armR]]) {
    box(ctx, x + ax, y + 17 + shift, 3, 8, "O");
    box(ctx, x + ax + 1 - (ax === 1 ? 0 : 1), y + 18 + shift, 2, 5, "T");
    box(ctx, x + ax + 1 - (ax === 1 ? 0 : 1), y + 22 + shift, 2, 1, "t");
    box(ctx, x + ax + 1 - (ax === 1 ? 0 : 1), y + 23 + shift, 2, 2, "S");
  }
}

function drawSide(ctx, x, y, frame, mirrored) {
  // Drawn facing left in local coordinates; mirrored flips the x axis.
  const px = (cx, width) => (mirrored ? SPRITE.width - cx - width : cx);
  const [liftL, liftR] = legOffsets(frame);
  const [armL] = armOffsets(frame);
  // Rear leg first, front leg second.
  for (const [lx, lift, rear] of [[8, liftR, true], [6, liftL, false]]) {
    const w = 6;
    ctx.fillStyle = PALETTE.O;
    ctx.fillRect(x + px(lx - 1, w + 1), y + 25, w + 1, 7 - lift);
    box(ctx, x + px(lx, 5), y + 25, 5, 4 - lift, rear ? "p" : "P");
    box(ctx, x + px(lx - 1 + (rear ? 0 : 0), 6), y + 29 - lift, 6, 2, "F");
    box(ctx, x + px(lx - 1, 6), y + 30 - lift, 6, 1, "f");
  }
  // Torso.
  box(ctx, x + px(4, 11), y + 16, 11, 10, "O");
  box(ctx, x + px(5, 9), y + 16, 9, 9, "T");
  box(ctx, x + px(5, 9), y + 23, 9, 2, "t");
  box(ctx, x + px(6, 3), y + 17, 3, 1, "u");
  // Near arm swings over the torso.
  box(ctx, x + px(7, 1), y + 17 + armL, 1, 8, "O");
  box(ctx, x + px(11, 1), y + 17 + armL, 1, 8, "O");
  box(ctx, x + px(8, 3), y + 17 + armL, 3, 5, "u");
  box(ctx, x + px(8, 3), y + 22 + armL, 3, 1, "T");
  box(ctx, x + px(8, 3), y + 23 + armL, 3, 2, "S");
  box(ctx, x + px(8, 3), y + 25 + armL, 3, 1, "O");
}

export function drawPlayerSprite(ctx, player, time = 0, reducedMotion = false) {
  const frame = walkFrame(time, player.moving, reducedMotion);
  const bob = reducedMotion ? 0
    : player.moving ? (frame % 2 === 1 ? -1 : 0)
      : Math.round(Math.sin(time / 700) * 0.6);
  const x = Math.round(player.x) - 3;
  const y = Math.round(player.y) + 26 - SPRITE.height + bob;

  // Ground shadow stays on the floor while the body bobs.
  ctx.fillStyle = "rgba(3, 6, 12, .55)";
  ctx.fillRect(x + 3, Math.round(player.y) + 24, 14, 3);
  ctx.fillRect(x + 5, Math.round(player.y) + 27, 10, 1);

  const facing = player.direction;
  if (facing === "left" || facing === "right") {
    drawSide(ctx, x, y, frame, facing === "right");
  } else {
    drawFrontBack(ctx, x, y, facing, frame);
  }

  const head = HEADS[facing === "left" || facing === "right" ? "side" : facing] ?? HEADS.down;
  const mirrored = facing === "right";
  const headX = x + SPRITE.headOffsetX;
  for (let row = 0; row < head.length; row += 1) {
    fillRow(ctx, head[row], headX, y + row, mirrored);
  }
}
