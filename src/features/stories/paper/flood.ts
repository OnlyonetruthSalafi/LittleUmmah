import * as THREE from 'three';
import { ark, mountain, wave } from './sculptures';
import { sheet, stock } from './stock';

type Point = [number, number, number];
const cream = '#f1e7d3';

function put(g: THREE.Group, object: THREE.Object3D, x: number, y: number, z: number) {
  object.position.set(x, y, z); g.add(object); return object;
}

function cut(shape: THREE.Shape, color: string, depth = .018) {
  const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: false, curveSegments: 18,
  }), [stock(color), stock(cream)]);
  mesh.castShadow = mesh.receiveShadow = true;
  return mesh;
}

function ellipse(rx: number, rz: number, color: string) {
  const points: Point[] = [];
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * Math.PI * 2;
    points.push([Math.cos(a) * rx, 0, Math.sin(a) * rz]);
  }
  return sheet(points, color);
}

function cloudBank(width: number) {
  const shape = new THREE.Shape();
  shape.moveTo(-1.35, 0);
  shape.bezierCurveTo(-1.7, .14, -1.5, .55, -1.12, .48);
  shape.bezierCurveTo(-1.08, .87, -.55, .94, -.36, .6);
  shape.bezierCurveTo(-.12, .88, .38, .78, .43, .5);
  shape.bezierCurveTo(.8, .76, 1.28, .58, 1.23, .32);
  shape.bezierCurveTo(1.65, .35, 1.65, -.02, 1.26, -.04);
  shape.lineTo(-1.35, 0); shape.closePath();
  const cloud = new THREE.Group();
  const front = cut(shape, '#69778d'); front.scale.set(width / 3.1, .65, 1); cloud.add(front);
  const lower = cut(shape, '#8792a2'); lower.scale.set(width / 3.3, .27, 1);
  lower.position.set(.08, -.04, .028); cloud.add(lower);
  return cloud;
}

function spring() {
  const g = new THREE.Group();
  g.add(ellipse(.78, .5, '#9cafbd'));
  put(g, ellipse(.56, .31, '#526d88'), 0, .012, 0);
  // Torn earth flaps expose the deep fissure beneath the upright water ribbons.
  const flaps: Point[][] = [
    [[-.75, .01, -.18], [-.18, .2, -.23], [-.03, .03, -.04], [-.59, .02, .03]],
    [[.08, .02, -.12], [.4, .15, -.35], [.73, .01, -.13], [.31, .02, .05]],
    [[-.5, .01, .2], [-.12, .14, .1], [.09, .02, .29], [-.34, .01, .4]],
  ];
  flaps.forEach((p, i) => g.add(sheet(p, ['#a59a83', '#b7aa8c', '#c7b99d'][i])));
  // Rounded fountain crests and returning arcs read as water, not pointed leaves.
  const jet = new THREE.Shape();
  jet.moveTo(-.16, .03);
  jet.bezierCurveTo(-.22, .45, -.11, .77, -.21, 1.02);
  jet.bezierCurveTo(-.42, 1.4, -.09, 1.52, .08, 1.24);
  jet.bezierCurveTo(.26, .98, .12, .43, .24, .03);
  jet.closePath();
  put(g, cut(jet, '#749fbc'), 0, 0, .08);
  const highlight = new THREE.Shape(); highlight.moveTo(-.05, .08);
  highlight.bezierCurveTo(-.12, .48, .03, .86, -.12, 1.2);
  highlight.bezierCurveTo(.13, 1.07, .04, .48, .1, .08); highlight.closePath();
  put(g, cut(highlight, '#dce8e6', .004), 0, 0, .105);
  for (const side of [-1, 1]) {
    const spray = new THREE.Shape(); spray.moveTo(0, .05);
    spray.bezierCurveTo(.04, .85, .72, 1.05, .72, .4);
    spray.bezierCurveTo(.55, .77, .24, .72, .2, .05); spray.closePath();
    const arc = cut(spray, '#91b9cd'); arc.scale.set(side, side < 0 ? .72 : .92, 1);
    put(g, arc, side * .04, .02, .13);
  }
  return g;
}

/** p07: rain descends from low clouds while water erupts through torn earth. */
export function stormSprings(): THREE.Group {
  const g = new THREE.Group(); g.name = 'rain-and-groundwater';
  for (const side of [-1, 1]) {
    const bank = new THREE.Group();
    const cloudHeight = side < 0 ? 1.83 : 2.04;
    put(bank, cloudBank(2.7), 0, cloudHeight, 0);
    for (let i = 0; i < 7; i++) {
      const x = -1.08 + i * .34, bottom = .14 + (i % 3) * .13;
      const top = cloudHeight + .05;
      // The slanting rain is an articulated card lattice supporting the clouds.
      bank.add(sheet([[x, top, .012], [x + .055, top, .012],
        [x - .28, bottom, .08], [x - .335, bottom, .08]], i % 2 ? '#92a9bc' : '#bac9d1'));
      if (i % 2 === 0) bank.add(sheet([[x - .335, bottom, .08], [x - .28, bottom, .08],
        [x - .28, .04, .3], [x - .335, .04, .3]], '#8da6ba'));
    }
    put(g, bank, side * 1.4, .04, side < 0 ? -.85 : -1.25);
  }
  put(g, spring(), -1.6, .1, .82);
  const right = spring(); right.scale.set(.85, .78, .85); right.rotation.y = -.35;
  put(g, right, 1.68, .1, .7);
  // A new channel grows between the two sources, rather than a decorative sea.
  g.add(sheet([[-1.5, .075, .76], [-.2, .075, .62], [1.7, .075, .8],
    [.6, .075, 1.27], [-.65, .075, 1.51]], '#8faabd'));
  return g;
}

/** p08b: one inaccessible summit beyond a single wall of breaking water. */
export function dividedMountain(): THREE.Group {
  const g = new THREE.Group(); g.name = 'wave-divides-the-mountain';
  const peak = mountain(); peak.scale.set(2.15, 2.55, 1.7);
  put(g, peak, 1.15, .08, -.88);
  // Offset low foothill is fused to the same island, not another distant range.
  const buttress = mountain(); buttress.scale.set(1.15, 1.2, 1.1);
  put(g, buttress, 2.05, .08, -.7);
  put(g, ellipse(1.5, .55, '#758ca4'), 1.23, .075, -.62);
  const barrier = wave(); barrier.scale.set(4.65, 4.8, 1.25);
  barrier.rotation.y = -.08;
  put(g, barrier, -.45, .08, .92);
  // The approach vanishes under the wave. These pale tapering currents stop there.
  g.add(sheet([[-1.45, .08, 1.95], [-.94, .08, 1.95], [-.34, .08, 1.1], [-.54, .08, 1.1]], '#a9bbca'));
  g.add(sheet([[.78, .08, 1.95], [1.12, .08, 1.95], [.7, .08, 1.24], [.55, .08, 1.24]], '#91a8bc'));
  return g;
}

/** p09: rugged off-centre ridges rise around the ark's small level rock shelf. */
export function landing(): THREE.Group {
  const g = new THREE.Group(); g.name = 'al-judi-receding-water';
  const outline = [[-1, -.23], [-.76, -.8], [-.12, -1], [.61, -.78], [1, -.14], [.82, .65], [.15, 1], [-.7, .76]];
  const foot: Point[] = outline.map(([x, z]) => [x * 2.8 + .15, .08, z * 1.54 - .12]);
  const shoulder: Point[] = [[-1.78, .7, -.52], [-1.1, 1.26, -1.12], [-.38, 1.65, -1.22],
    [1.5, 1.12, -.9], [2.25, .52, -.28], [1.56, .68, .78], [.21, .84, 1.12], [-1.5, .37, .96]];
  const shelf: Point[] = outline.map(([x, z]) => [x * 1.08 + .15, 1.39, z * .56 - .12]);
  const stones = ['#949b83', '#a7a58e', '#aeb49a', '#8c987e', '#b7ae93', '#9aa28a', '#a8ad94', '#b7b29c'];
  for (let i = 0; i < outline.length; i++) {
    const j = (i + 1) % outline.length;
    // Triangles retain an irregular folded rock surface without concentric steps.
    g.add(sheet([foot[i], foot[j], shoulder[i]], stones[i], false));
    g.add(sheet([foot[j], shoulder[j], shoulder[i]], stones[j], false));
    g.add(sheet([shoulder[i], shoulder[j], shelf[i]], stones[(i + 2) % 8], false));
    g.add(sheet([shoulder[j], shelf[j], shelf[i]], stones[i], false));
    if (i >= 4) {
      const lerp = (a: Point, b: Point, t: number): Point => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + .012, a[2] + (b[2] - a[2]) * t];
      // Broken water marks appear on separate exposed rock faces, not full rings.
      for (const t of [.22, .48]) g.add(sheet([lerp(foot[i], shoulder[i], t), lerp(foot[j], shoulder[i], t),
        lerp(foot[j], shoulder[i], t + .045), lerp(foot[i], shoulder[i], t + .045)], '#d2d2bd', false));
    }
  }
  g.add(sheet(shelf, '#abb395'));
  const leftRidge = mountain(); leftRidge.scale.set(1.55, 2.15, 1.4);
  put(g, leftRidge, -1.2, .42, -.65);
  const farPeak = mountain(); farPeak.scale.set(.85, 1.45, .92);
  put(g, farPeak, .67, .85, -1.12);
  const rockLedge = sheet([[1.48, .7, .27], [2.16, .42, .28], [2.3, .38, .6], [1.53, .7, .55]], '#c3b89a');
  g.add(rockLedge);
  const vessel = ark(); vessel.scale.setScalar(1.55); vessel.rotation.y = -.09;
  const keel = new THREE.Box3().setFromObject(vessel).min.y;
  put(g, vessel, .15, 1.39 - keel, -.16);
  // Exposed pale shores and the last quiet pools below the terraces.
  put(g, ellipse(.63, .2, '#91a9b7'), -2.12, .09, 1.28);
  put(g, ellipse(.52, .13, '#9bb1bb'), 2.29, .09, .95);
  put(g, ellipse(.78, .11, '#b5c7cb'), .12, .09, 1.65);
  return g;
}
