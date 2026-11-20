import "./parents-loader.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { Vector3 } from "three";
const { bindSpread, popUpSupport, restAngle } = await import("../src/features/stories/paper/folds.ts");

test("turning a leaf keeps both V-fold feet glued and both triangular supports rigid", () => {
  const model = popUpSupport();
  const points = [0, 2].map(index => {
    const positions = model.children[index].children[0].geometry.getAttribute("position");
    return [0, 1, 2].map(i => new Vector3().fromBufferAttribute(positions, i));
  });
  const spread = bindSpread(model);
  try {
    const left = Math.PI - restAngle;
    for (const angle of [.08, .5, 1.3, 2.5, 3.05]) {
      spread.pose(left, angle);
      const moved = points.map((triangle, side) => triangle.map(p => p.clone().applyMatrix4(spread.group.children[side].matrix)));
      moved.forEach((triangle, side) => {
        for (let i = 0; i < 3; i++) {
          const j = (i + 1) % 3;
          assert.ok(Math.abs(triangle[i].distanceTo(triangle[j]) - points[side][i].distanceTo(points[side][j])) < 1e-6);
        }
        const foot = triangle[1].clone().sub(triangle[0]);
        const leafAngle = side === 0 ? left : angle;
        assert.ok(Math.abs(foot.x * Math.sin(leafAngle) - foot.y * Math.cos(leafAngle)) < 1e-6);
      });
      assert.ok(moved[0][2].distanceTo(moved[1][2]) < 1e-6, "both sides meet along one ridge");
    }
  } finally { spread.dispose(); }
});

test("the cut-out ark retains its printed materials and nested scores at every scrub position", async () => {
  const { arkWorkshop } = await import("../src/features/stories/paper/ark-workshop.ts");
  const spread = bindSpread(arkWorkshop());
  function sample(t) {
    spread.pose(Math.PI * t, 0);
    spread.group.updateMatrixWorld(true);
    const matrices = [];
    spread.group.traverse(node => {
      if (node.userData.pick === "ark") matrices.push(node.matrixWorld.toArray());
    });
    return matrices;
  }
  try {
    const middle = sample(.48);
    const parts = [];
    spread.group.traverse(node => { if (node.userData.pick === "ark") parts.push(node); });
    assert.ok(parts.some(node => node.material.name === "amber" && node.material.emissive.r > 0));
    assert.ok(parts.some(node => node.material.name === "timber"));
    assert.ok(new Set(parts.map(node => node.matrix.elements.join(","))).size >= 4,
      "hull, cabin and both roof slopes travel on distinct scores");
    assert.notDeepEqual(sample(1), middle);
    sample(.12);
    assert.deepEqual(sample(.48), middle, "identical opening angles must yield identical geometry");
    spread.pose(Math.PI, Math.PI);
    assert.equal(spread.group.visible, false);
  } finally { spread.dispose(); }
});
