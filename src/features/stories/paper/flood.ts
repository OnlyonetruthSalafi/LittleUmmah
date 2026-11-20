import * as THREE from 'three';
import { ark, mountain, wave } from './sculptures';
import { sheet, stock } from './stock';
import { paperPerson } from './cutouts';
import { score } from './folds';

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

/** The ark and the son occupy opposite leaves, with a breaking wave in the gutter. */
export function dividedMountain(): THREE.Group {
  const g = new THREE.Group(); g.name = 'wave-divides-the-mountain';
  const vessel = ark();
  vessel.scale.setScalar(2.73);
  vessel.rotation.y = -.27;
  put(g, ellipse(1.40, .48, '#7895ab'), -1.85, .076, .78);
  const keel = new THREE.Box3().setFromObject(vessel).min.y;
  put(g, vessel, -1.85, .078 - keel, .78);

  // Cut a level shelf into the crag so both the figure and its folded support touch rock.
  const base: Point[] = [[.64,.08,-.70],[1.06,.08,-1.64],[2.23,.08,-1.91],
    [3.09,.08,-1.23],[3.12,.08,-.13],[2.55,.08,.55],[1.45,.08,.46]];
  const shelfHeight = 1.46;
  const shelf: Point[] = base.map(([x, , z]) => [2.08 + (x-1.92)*.45, shelfHeight, -.67 + (z+.67)*.40]);
  const rock = ['#999782','#b1a18c','#909287','#bbb09a','#a79e8c','#8c8c80','#c0ad94'];
  for (let i = 0; i < base.length; i++) {
    const j = (i+1) % base.length;
    g.add(sheet([base[i], base[j], shelf[j]], rock[i], false));
    g.add(sheet([base[i], shelf[j], shelf[i]], rock[j], false));
  }
  g.add(sheet(shelf, '#dfc9a4'));
  const spur = mountain();
  spur.scale.set(1.31, 1.37, 1.43);
  put(g, spur, 2.72, .08, .07);
  const son = paperPerson({ color: '#ac4d39', shoulder: .20, hem: .23, height: 1 });
  son.scale.setScalar(.82);
  son.rotation.y = -.31;
  put(g, score(son, 0, 0, -.78, .22, .88), 2.12, shelfHeight, -.54);

  const barrier = wave();
  barrier.scale.set(2.68, 4.35, 1.30);
  barrier.rotation.y = -.79;
  put(g, barrier, .04, .08, -.02);
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
