import test from "node:test";
import assert from "node:assert/strict";
import {
  INTERACTABLES,
  PLAYER_SIZE,
  createPlayerState,
  findNearbyInteractable,
  stepPlayer,
} from "../src/world.js";
import { PANELS } from "../src/portfolio-data.js";

test("player remains inside every map boundary", () => {
  const edges = [
    { start: createPlayerState(26, 160), direction: { x: -1, y: 0 } },
    { start: createPlayerState(600, 160), direction: { x: 1, y: 0 } },
    { start: createPlayerState(320, 30), direction: { x: 0, y: -1 } },
    { start: createPlayerState(260, 346), direction: { x: 0, y: 1 } },
  ];

  for (const { start, direction } of edges) {
    let player = start;
    for (let frame = 0; frame < 20; frame += 1) {
      player = stepPlayer(player, direction, 50);
    }
    assert.ok(player.x >= 26 && player.y >= 30);
    assert.ok(player.x + PLAYER_SIZE.width <= 614);
    assert.ok(player.y + PLAYER_SIZE.height <= 372);
  }
});

test("player cannot move through the CSIO desk", () => {
  let player = createPlayerState(30, 94);
  for (let frame = 0; frame < 20; frame += 1) {
    player = stepPlayer(player, { x: 1, y: 0 }, 50);
  }
  assert.ok(player.x + PLAYER_SIZE.width <= 48);
});

test("movement works in all four directions", () => {
  const cases = [
    { direction: { x: 0, y: -1 }, facing: "up", axis: "y", sign: -1 },
    { direction: { x: 0, y: 1 }, facing: "down", axis: "y", sign: 1 },
    { direction: { x: -1, y: 0 }, facing: "left", axis: "x", sign: -1 },
    { direction: { x: 1, y: 0 }, facing: "right", axis: "x", sign: 1 },
  ];

  for (const { direction, facing, axis, sign } of cases) {
    const start = createPlayerState(320, 200);
    const moved = stepPlayer(start, direction, 50);
    assert.equal(Math.sign(moved[axis] - start[axis]), sign, `${facing} should move on the expected axis`);
    assert.equal(moved.direction, facing);
    assert.equal(moved.moving, true);
  }
});

test("diagonal movement is normalized", () => {
  const start = createPlayerState(320, 200);
  const moved = stepPlayer(start, { x: 1, y: -1 }, 50);
  const distance = Math.hypot(moved.x - start.x, moved.y - start.y);
  assert.ok(Math.abs(distance - 5.6) < 0.001);
  assert.equal(moved.direction, "up");
});

test("every world station is reachable and maps to its portfolio panel", () => {
  const directions = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
  const queue = [createPlayerState()];
  const stateKey = (player) => `${player.x.toFixed(1)},${player.y.toFixed(1)}`;
  const visited = new Set([stateKey(queue[0])]);
  const reachable = new Set();

  for (let index = 0; index < queue.length; index += 1) {
    const player = queue[index];
    const station = findNearbyInteractable(player);
    if (station) reachable.add(station.id);

    for (const direction of directions) {
      const next = stepPlayer(player, direction, 50);
      const key = stateKey(next);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push(next);
      }
    }
  }

  assert.deepEqual([...reachable].sort(), INTERACTABLES.map((station) => station.id).sort());
  for (const station of INTERACTABLES) {
    assert.equal(PANELS[station.id]?.sectionId, station.id);
  }
  assert.equal(findNearbyInteractable(createPlayerState(313, 193)), null);
});
