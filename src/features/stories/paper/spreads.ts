import * as THREE from 'three';
import { ark, cottage, lantern, palm, wave } from './sculptures';
import { sheet, stock } from './stock';
import { boardingPairs, embarkation } from './boarding';
import { stormSprings, dividedMountain, landing } from './flood';
import { safePassage, shelteredShore, skyAndEarth } from './reflections';
import { arkWorkshop } from './ark-workshop';
import { popUpSupport } from './folds';

// All illustrations are original solid paper constructions. No people, animals,
// prophetic figures, text textures, or scenery billboards are used.
const C = { sand: '#d5c3a2', grass: '#9ca78a', teal: '#5f8091', sea: '#6f91ab',
  deep: '#364d71', cream: '#f3ead7', gold: '#d4ad62', wood: '#a67955', night: '#36435d' };

function place(g: THREE.Group, item: THREE.Object3D, x: number, z: number, size = 1, y = .035, turn = 0) {
  item.position.set(x, y, z); item.scale.setScalar(size); item.rotation.y = turn;
  g.add(item); return item;
}

function block(w: number, h: number, d: number, color: string) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), stock(color));
  mesh.castShadow = mesh.receiveShadow = true; return mesh;
}

function patch(rx: number, rz: number, color: string, height = .018) {
  const points: [number, number, number][] = [];
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6;
    points.push([Math.cos(a) * rx, height, Math.sin(a) * rz]);
  }
  return sheet(points, color);
}

function land(g: THREE.Group, color = C.sand) {
  pagePrint(g, color, color === C.sand ? '#ddceb2' : color === C.night ? '#3e4d68' : color === '#626f80' ? '#707d8e' : '#a7af96');
}

function sea(g: THREE.Group, storm = false) {
  pagePrint(g, storm ? '#3e5578' : '#7895ad', storm ? '#50698a' : '#8fa9bb', true);
}

/** Subtle printed currents or broad earth contours continue through the gutter. */
function pagePrint(g: THREE.Group, base: string, ink: string, water = false) {
  for (const side of [-1, 1]) {
    const leaf = new THREE.Group();
    leaf.add(sheet([[-1.65, 0, -2.08], [1.65, 0, -2.08], [1.65, 0, 2.08], [-1.65, 0, 2.08]], base));
    for (let row = 0; row < (base === C.night ? 0 : 3); row++) {
      const z = [-1.42, .24, 1.42][row];
      const bend = (u: number) => Math.sin((u + side * 1.65) * .72 + row * 1.7) * (water ? .21 : .35);
      const width = (u: number) => water
        ? .012 + .065 * Math.pow(Math.sin((u + 3.3 + side * 1.65) / 6.6 * Math.PI), 2)
        : .16 + .18 * Math.pow(Math.sin(u * .63 + row), 2);
      for (let i = 0; i < 24; i++) {
        const x = -1.65 + i * .1375, next = x + .1375;
        leaf.add(sheet([[x, .012, z + bend(x)], [next, .012, z + bend(next)],
          [next, .012, z + width(next) + bend(next)], [x, .012, z + width(x) + bend(x)]], ink, false));
      }
    }
    place(g, leaf, side * 1.65, 0, 1, .035);
  }
}

/** Die-cut skyline on two folded card wings, with visible cream cut margins. */
function horizon(g: THREE.Group, mood: 'dawn' | 'storm' | 'night' | 'land' = 'dawn') {
  const storm = mood === 'storm', night = mood === 'night';
  for (const side of [-1, 1]) {
    const wing = new THREE.Group();
    const peaks = storm ? [.55, .75, .94, .85, 1.12, .8, .64] : [.38, .6, .45, .95, .55, .74, .38];
    const z = (x: number) => -.26 * x;
    for (let i = 0; i < 6; i++) {
      const a = i * .51, b = (i + 1) * .51;
      wing.add(sheet([[side * a, 0, z(a)], [side * b, 0, z(b)],
        [side * b, peaks[i + 1], z(b)], [side * a, peaks[i], z(a)]], C.cream));
      const color = night ? '#34445e' : storm ? '#6e7c92' : mood === 'land' ? '#8e9a80' : '#a2afa4';
      wing.add(sheet([[side * a, .025, z(a) + .012], [side * b, .025, z(b) + .012],
        [side * b, Math.max(.1, peaks[i + 1] - .065), z(b) + .012],
        [side * a, Math.max(.1, peaks[i] - .065), z(a) + .012]], color, false));
    }
    // Folded gussets support the wing at its crease, and visibly meet the page.
    wing.add(sheet([[side * 1.2, 0, z(1.2)], [side * 1.2, .5, z(1.2)], [side * 1.2, 0, z(1.2) + .45]], '#d3c39e'));
    place(g, wing, side * .015, -1.24, 1, .075);
    const cloud = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const x = -.65 + i * .31, radius = i % 2 ? .3 : .23;
      const points: [number, number, number][] = [];
      for (let j = 0; j <= 10; j++) {
        const a = j / 10 * Math.PI;
        points.push([x + Math.cos(a) * radius, Math.sin(a) * radius + .08, 0]);
      }
      cloud.add(sheet(points, storm ? '#8993a3' : night ? '#7f8ca3' : '#eee8db'));
    }
    cloud.add(sheet([[-.88, 0, 0], [.88, 0, 0], [.88, .13, 0], [-.88, .13, 0]], storm ? '#8993a3' : night ? '#7f8ca3' : '#eee8db'));
    place(g, cloud, side * 1.9, -1.75, 1, .8, side * .17);
    // Slender folded braces keep the cloud cutout visibly attached to the book.
    const support = sheet([[-.035, 0, 0], [.035, 0, 0], [.035, .83, 0], [-.035, .83, 0]], '#d6c9a6');
    place(g, support, side * 1.9, -1.75, 1, .07);
  }
  if (storm) {
    for (const x of [-2.9, -2.5, -1.9, 1.7, 2.25, 2.8]) {
      // Raindrops are printed relief on the page, not disconnected floating props.
      const drop = sheet([[0, 0, -.17], [.075, 0, .03], [.045, 0, .1], [-.04, 0, .1], [-.075, 0, .03]], '#afc2d0', false);
      place(g, drop, x, -.75 + Math.sin(x * 3) * .25, 1, .09, -.3);
    }
  }
}

function waves(g: THREE.Group, storm = false) {
  // Alternate foreground and background rows leave the hull clearly readable.
  const rows = [[-2.1, -.8, 1.25, -.2], [.8, -.95, 1.6, .23], [2.45, -.35, .85, -.55],
    [-2.35, .8, 1.1, .55], [-.5, 1.1, 1.9, -.12], [1.7, 1.15, 1.25, -.35]];
  rows.forEach(([x, z, s, turn], i) => {
    const w = place(g, wave(), x, z, s, .075, turn);
    w.scale.y *= (storm ? 1.5 : .65) * (i % 3 === 0 ? .7 : 1);
  });
}

function sun(g: THREE.Group, x: number, z: number, radius = .55) {
  // A semicircular folded card, with a real triangular support behind it.
  const points: [number, number, number][] = [];
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI * i / 12; points.push([Math.cos(a) * radius, Math.sin(a) * radius, 0]);
  }
  const s = sheet(points, C.gold);
  s.add(sheet([[0, 0, 0], [0, radius * .6, 0], [0, 0, -radius * .5]], '#d39b48'));
  place(g, s, x, z);
}

function star(g: THREE.Group, x: number, z: number, s = .18) {
  // Gold ink / paper inlay on the horizontal page, never unsupported in the air.
  const a = sheet([[0, 0, -s], [s * .45, 0, 0], [0, 0, s], [-s * .45, 0, 0]], C.gold);
  const b = sheet([[-s, .003, 0], [0, .003, -s * .45], [s, .003, 0], [0, .003, s * .45]], C.gold);
  a.add(b); place(g, a, x, z, 1, .11);
}

function path(g: THREE.Group, night = false) {
  for (let i = 0; i < 12; i++) {
    const x = -2.6 + i * .45;
    place(g, patch(.25, .18, night ? '#c5b79b' : '#f4e4bd'), x, .6 + Math.sin(i * .5) * .5, 1, .09);
  }
}

function timbers(g: THREE.Group, x: number, z: number) {
  for (let i = 0; i < 4; i++) {
    const plank = block(1.05 - i * .07, .045, .13, i % 2 ? '#d6ab70' : '#bd894f');
    place(g, plank, x + i * .04, z + i * .15, 1, .11 + i * .018, -.12);
  }
  const mallet = new THREE.Group();
  mallet.add(block(.11, .07, .55, '#986c48'));
  const head = block(.38, .14, .16, '#d8b477'); head.position.z = -.2; mallet.add(head);
  place(g, mallet, x + .6, z + .4, 1, .15, -.6);
}

/** Builds one complete physical pop-up tableau, in book-local coordinates. */
export function buildSpread(scene: string): THREE.Group {
  const g = new THREE.Group();
  const key = scene.split('/').pop()?.replace(/\.[^.]+$/, '') ?? scene;
  g.name = `paper-${key}`;
  switch (key) {
    case 'p01':
      land(g); path(g);
      place(g, cottage(), -1.65, -.65, 1.35, .08, .15);
      place(g, cottage(), .7, -.8, 1.1, .08, -.15);
      place(g, cottage(), 2.15, .15, .85, .08, -.3);
      place(g, palm(), -2.65, .05, .7); place(g, palm(), 2.5, -1.05, .65);
      place(g, lantern(), -.6, .8, .3); sun(g, -2.15, -1.45, .4);
      break;
    case 'p02':
      land(g); place(g, patch(1.4, 1.6, C.night), 1.65, 0, 1, .085); path(g, true);
      sun(g, -2.1, -.85, .8);
      place(g, cottage(), -.85, -1, .8);
      [-1.6, -.3, 1, 2.3].forEach((x, i) => place(g, lantern(), x, .2 - i * .15, .35 + i * .04, .12));
      [[1.4, -1.3], [2.4, -.8], [2.7, 1.3], [.6, 1.4]].forEach(([x, z]) => star(g, x, z));
      break;
    case 'p03':
      land(g, C.grass); place(g, ark(true), .3, -.3, 3.65, .12, -.08);
      timbers(g, -1.9, .9); timbers(g, 1.75, .85);
      place(g, palm(), -2.6, -.9, .75); break;
    case 'p04':
      g.add(arkWorkshop()); return g;
    case 'p05':
      land(g, C.grass);
      g.add(boardingPairs());
      return g;
    case 'p06':
      sea(g);
      g.add(embarkation());
      return g;
    case 'p07':
      land(g, '#827e70');
      g.add(stormSprings());
      return g;
    case 'p08':
      sea(g, true);
      g.add(safePassage());
      return g;
    case 'p08b':
      sea(g, true);
      g.add(dividedMountain());
      return g;
    case 'p09':
      sea(g);
      g.add(landing());
      return g;
    case 'p10':
      land(g, C.grass);
      g.add(shelteredShore());
      return g;
    case 'p11':
      land(g, C.night);
      g.add(skyAndEarth());
      return g;
    case 'cover':
      // Cover: hull physically meets the inked sea; layers fan out from its keel.
      sea(g); waves(g);
      place(g, ark(), .15, -.08, 3.95, .075, -.13);
      sun(g, -2.35, -1.45, .88);
      place(g, wave(), -2.45, .15, 1.1, .09, .3);
      place(g, wave(), 2.5, .2, 1.05, .09, -.2);
      break;
    default:
      return g;
  }
  g.add(popUpSupport());
  horizon(g, key === 'cover' ? 'dawn' : 'land');
  return g;
}
