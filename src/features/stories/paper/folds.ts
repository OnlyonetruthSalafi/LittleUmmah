import * as THREE from "three";
import { sheet, type Point } from "./stock";

const anchorX = .64;
const anchorZ = 1.4;
const ridgeHeight = .8;
const ridgeZ = .38;
export const restAngle = 0;

// The two triangular gussets share their ridge. Their feet are glued to the
// leaves. Keeping the two dot products constant keeps all triangle edges rigid.
function ridgeAt(halfOpening: number) {
  const a = anchorX * Math.cos(halfOpening);
  const b = anchorZ;
  const dot = b * ridgeZ;
  const norm = a * a + b * b;
  const cross = Math.sqrt(norm * (ridgeHeight ** 2 + ridgeZ ** 2) - dot ** 2);
  return { height: (a * dot + b * cross) / norm, z: (b * dot - a * cross) / norm };
}

export function popUpSupport() {
  const group = new THREE.Group();
  for (const side of [-1, 1]) {
    const seam: Point = [0, 0, -.6];
    const ridge: Point = [0, ridgeHeight, ridgeZ - .6];
    const foot: Point = [side * anchorX, 0, anchorZ - .6];
    group.add(sheet([seam, foot, ridge], side < 0 ? "#d8b882" : "#edce97", false));
    group.add(sheet([seam, foot, [foot[0] + side * .095, 0, foot[2] - .045]], "#ecce9b", false));
  }
  return group;
}

/** A score parallel to the spine-crossing artwork's long (X) axis. Coordinates
 * are in the part's own space. A child score travels with its parent's hinge. */
export function score(part: THREE.Group, y: number, z: number, angle: number, start: number, end: number) {
  part.userData.score = { y, z, angle, start, end };
  return part;
}

type Score = { y: number; z: number; angle: number; start: number; end: number };

type Batch = {
  side: number; pivot?: THREE.Object3D; target?: THREE.Object3D;
  finish: THREE.MeshStandardMaterial; positions: number[]; colors: number[]; uv: number[];
};

// Batch the sculpture into hinged materials. Split crossing triangles exactly
// at the spine so their cut edges meet at every intermediate opening angle.
export function bindSpread(model: THREE.Group) {
  model.updateMatrixWorld(true);
  const batches = new Map<string, Batch>();
  const hinges = new Map<number, {
    settings: Score; parent?: number; pivot: THREE.Vector3; axis: THREE.Vector3;
    local: THREE.Matrix4; combined: THREE.Matrix4;
  }>();
  const sourceGeometries = new Set<THREE.BufferGeometry>();
  model.traverse(object => {
    let parent = object.parent;
    let pivot: THREE.Object3D | undefined;
    let target: THREE.Object3D | undefined;
    while (parent) {
      if (!pivot && parent.userData.score) pivot = parent;
      if (!target && parent.userData.pick) target = parent;
      parent = parent.parent;
    }
    if (object.userData.score) {
      const { y, z } = object.userData.score;
      hinges.set(object.id, { settings: object.userData.score, parent: pivot?.id, pivot: object.localToWorld(new THREE.Vector3(0, y, z)),
        axis: new THREE.Vector3(1, 0, 0).transformDirection(object.matrixWorld),
        local: new THREE.Matrix4(), combined: new THREE.Matrix4() });
    }
    if (!(object instanceof THREE.Mesh)) return;
    const geom = object.geometry as THREE.BufferGeometry;
    sourceGeometries.add(geom);
    const attr = geom.getAttribute("position");
    const index = geom.getIndex();
    const count = index?.count ?? attr.count;
    for (let i = 0; i < count; i += 3) {
      const material = Array.isArray(object.material)
        ? object.material[geom.groups.find(g => i >= g.start && i < g.start + g.count)?.materialIndex ?? 0]
        : object.material;
      const col = (material as THREE.MeshStandardMaterial).color;
      const triangle = [0, 1, 2].map(j => new THREE.Vector3()
        .fromBufferAttribute(attr, index ? index.getX(i + j) : i + j).applyMatrix4(object.matrixWorld));
      for (const [side, sign] of [[0, -1], [1, 1]]) {
        if (side === 0 && triangle.every(p => p.x === 0)) continue;
        const clipped: THREE.Vector3[] = [];
        triangle.forEach((p, k) => {
          const q = triangle[(k + 1) % 3];
          if (sign * p.x >= 0) clipped.push(p);
          if (p.x * q.x < 0) clipped.push(p.clone().lerp(q, p.x / (p.x - q.x)));
        });
        if (clipped.length < 3) continue;
        const key = [side, pivot?.id, target?.id, material.name].join("/");
        let batch = batches.get(key);
        if (!batch) {
          batch = { side, pivot, target, finish: material, positions: [], colors: [], uv: [] };
          batches.set(key, batch);
        }
        for (let j = 1; j < clipped.length - 1; j++) {
          for (const p of [clipped[0], clipped[j], clipped[j + 1]]) {
            batch.positions.push(p.x, p.y, p.z);
            const shade = object.userData.toneAt?.(p.x, p.z) ?? 1;
            batch.colors.push(col.r * shade, col.g * shade, col.b * shade);
            batch.uv.push(p.x * .7 + p.z * .34, p.y * .7 + p.z * .56);
          }
        }
      }
    }
  });
  sourceGeometries.forEach(g => g.dispose());
  const group = new THREE.Group();
  const halves = [new THREE.Group(), new THREE.Group()];
  group.add(...halves);
  const parts = [...batches.values()].map(batch => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(batch.positions, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(batch.colors, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(batch.uv, 2));
    g.computeVertexNormals();
    const material = batch.finish.clone();
    material.color.set(0xffffff);
    material.vertexColors = true;
    const mesh = new THREE.Mesh(g, material);
    mesh.userData.pick = batch.target?.userData.pick;
    mesh.userData.pickId = batch.target?.id;
    mesh.matrixAutoUpdate = false;
    mesh.castShadow = mesh.receiveShadow = true;
    halves[batch.side].add(mesh);
    return { mesh, hinge: batch.pivot && hinges.get(batch.pivot.id) };
  });
  halves.forEach(half => { half.matrixAutoUpdate = false; });
  const rotation = new THREE.Matrix4();
  const shift = new THREE.Matrix4();
  return {
    group,
    pose(left: number, right: number) {
      group.visible = left - right > .018;
      if (!group.visible) return;
      const mid = (left + right) / 2;
      const ridge = ridgeAt((left - right) / 2);
      const lift = ridge.height / ridgeHeight;
      const progress = (left - right) / Math.PI;
      for (const hinge of hinges.values()) {
        const { angle, start, end } = hinge.settings;
        const t = THREE.MathUtils.smoothstep(progress, start, end);
        const p = hinge.pivot;
        hinge.local.makeTranslation(p.x, p.y, p.z)
          .multiply(rotation.makeRotationAxis(hinge.axis, angle * (1 - t)))
          .multiply(shift.makeTranslation(-p.x, -p.y, -p.z));
        hinge.combined.copy(hinge.local);
        if (hinge.parent !== undefined) hinge.combined.premultiply(hinges.get(hinge.parent)!.combined);
      }
      for (const { mesh, hinge } of parts) if (hinge) {
        mesh.matrix.copy(hinge.combined);
        mesh.matrixWorldNeedsUpdate = true;
      }
      halves.forEach((mesh, index) => {
        const sign = index === 0 ? -1 : 1;
        const angle = index === 0 ? left : right;
        mesh.matrix.set(
          sign * Math.cos(angle), lift * Math.cos(mid), 0, 0,
          sign * Math.sin(angle), lift * Math.sin(mid), 0, .018,
          0, (ridge.z - ridgeZ) / ridgeHeight, 1, 0,
          0, 0, 0, 1,
        );
        mesh.matrixWorldNeedsUpdate = true;
      });
    },
    dispose() { parts.forEach(({ mesh }) => { mesh.geometry.dispose(); mesh.material.dispose(); }); },
  };
}
