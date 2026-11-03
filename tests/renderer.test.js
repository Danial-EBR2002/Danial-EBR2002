import test from "node:test";
import assert from "node:assert/strict";
import { renderWorld } from "../src/renderer.js";
import { INTERACTABLES, createPlayerState } from "../src/world.js";

function recordingContext() {
  const calls = [];
  const labels = [];
  const context = {
    fillStyle: "",
    save() {},
    restore() {},
    fillRect(x, y, width, height) {
      calls.push([x, y, width, height, this.fillStyle]);
    },
    strokeRect() {},
    fillText(value) {
      labels.push(value);
    },
  };
  return { context, calls, labels };
}

function render(options = {}) {
  const { time = 0, reducedMotion = false, visited = new Set(), player = createPlayerState(300, 200) } = options;
  const recorded = recordingContext();
  renderWorld(recorded.context, player, null, time, reducedMotion, visited);
  return recorded;
}

test("idle sprite animates and reduced motion keeps it still", () => {
  // Compare the sprite region only: the last calls are the character, which
  // is drawn after every animated environment object.
  const tail = (recorded) => recorded.calls.slice(-80);
  assert.notDeepEqual(tail(render({ time: 0 })), tail(render({ time: 1100 })));
  assert.deepEqual(render({ time: 0, reducedMotion: true }).calls, render({ time: 1100, reducedMotion: true }).calls);
});

test("the character carries a name tag and the file counter reflects opened stations", () => {
  const none = render();
  assert.ok(none.calls.some((call) => call[4] === "rgba(11, 17, 29, .85)" && call[3] === 9), "name tag plate");
  assert.ok(none.labels.includes(`FILES 0/${INTERACTABLES.length}`));

  const all = render({ visited: new Set(INTERACTABLES.map((station) => station.id)) });
  assert.ok(all.labels.includes(`FILES ${INTERACTABLES.length}/${INTERACTABLES.length}`));
  // Each visited station adds a check mark on its marker.
  assert.ok(all.calls.length > none.calls.length);
});

test("walking leaves dust behind unless reduced motion is requested", () => {
  const walking = { ...createPlayerState(300, 200), moving: true };
  const idle = { ...walking, moving: false };
  const dust = (recorded) => recorded.calls.filter((call) => call[4].startsWith("rgba(170, 184, 208"));
  assert.ok(dust(render({ player: walking, time: 200 })).length > 0);
  assert.equal(dust(render({ player: idle, time: 200 })).length, 0);
  assert.equal(dust(render({ player: walking, time: 200, reducedMotion: true })).length, 0);
});
