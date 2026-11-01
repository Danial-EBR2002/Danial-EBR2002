import test from "node:test";
import assert from "node:assert/strict";
import { renderWorld } from "../src/renderer.js";
import { createPlayerState } from "../src/world.js";

function playerPixels(time, reducedMotion = false) {
  const calls = [];
  const context = {
    fillStyle: "",
    save() {},
    restore() {},
    fillRect(x, y, width, height) {
      calls.push([x, y, width, height, this.fillStyle]);
    },
    strokeRect() {},
    fillText() {},
  };

  renderWorld(context, createPlayerState(300, 200), null, time, reducedMotion);
  return calls.slice(-16);
}

test("idle sprite animates and reduced motion keeps it still", () => {
  assert.notDeepEqual(playerPixels(0), playerPixels(700));
  assert.deepEqual(playerPixels(0, true), playerPixels(700, true));
});
