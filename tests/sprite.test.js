import test from "node:test";
import assert from "node:assert/strict";
import { HEADS, PALETTE, SPRITE, drawPlayerSprite, walkFrame } from "../src/sprite.js";

function draw(player, time = 0, reducedMotion = false) {
  const calls = [];
  const context = {
    fillStyle: "",
    fillRect(x, y, width, height) {
      calls.push([x, y, width, height, this.fillStyle]);
    },
  };
  drawPlayerSprite(context, player, time, reducedMotion);
  return calls;
}

const base = { x: 100, y: 100, direction: "down", moving: false };

test("every head grid is a complete 16x16 sprite that only uses palette colours", () => {
  for (const [name, rows] of Object.entries(HEADS)) {
    assert.equal(rows.length, 16, `${name} height`);
    for (const row of rows) {
      assert.equal(row.length, 16, `${name} row width: ${row}`);
      for (const key of row) assert.ok(key === "." || key in PALETTE, `${name} uses unknown key ${key}`);
    }
  }
});

test("all four facings render inside the sprite bounds", () => {
  for (const direction of ["up", "down", "left", "right"]) {
    for (const time of [0, 110, 220, 330]) {
      const calls = draw({ ...base, direction, moving: true }, time);
      assert.ok(calls.length > 20, `${direction} drew a sprite`);
      for (const [x, y, width, height] of calls) {
        assert.ok(x >= base.x - 3 - 1 && x + width <= base.x - 3 + SPRITE.width + 1, `${direction} x in bounds`);
        assert.ok(y + height <= base.y + 28 && y >= base.y + 26 - SPRITE.height - 2, `${direction} y in bounds`);
      }
    }
  }
});

test("the walk cycle has four distinct frames and stops for reduced motion", () => {
  const frames = new Set([0, 110, 220, 330].map((time) => walkFrame(time, true, false)));
  assert.equal(frames.size, 4);
  assert.equal(walkFrame(220, false, false), 0);
  assert.equal(walkFrame(220, true, true), 0);
  assert.notDeepEqual(draw({ ...base, moving: true }, 0), draw({ ...base, moving: true }, 110));
  assert.deepEqual(draw({ ...base, moving: true }, 0, true), draw({ ...base, moving: true }, 110, true));
});

test("left and right facings are mirror images and differ from front and back", () => {
  const left = draw({ ...base, direction: "left" });
  const right = draw({ ...base, direction: "right" });
  assert.notDeepEqual(left, right);
  assert.notDeepEqual(left, draw(base));
  assert.notDeepEqual(draw(base), draw({ ...base, direction: "up" }));
});
