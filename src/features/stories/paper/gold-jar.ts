import * as THREE from "three";
import { cottage, palm } from "./sculptures";
import { stock } from "./stock";
import { paperPerson } from "./cutouts";
import { score } from "./folds";

const clay = "#b56343", slip = "#e1a373", stone = "#dec59b", teal = "#347b77";

function place(parent: THREE.Group, part: THREE.Object3D, x: number, y: number, z: number, scale = 1, turn = 0) {
  part.position.set(x, y, z);
  part.rotation.y = turn;
  part.scale.setScalar(scale);
  parent.add(part);
  return part;
}

function box(w: number, h: number, d: number, color: string) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), stock(color));
}

function disc(radius: number, height: number, color: string, sides = 24) {
  return new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, sides), stock(color));
}

function ring(radius: number, thickness: number, color: string) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, thickness, 5, 24), stock(color));
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

// The same die and paper stock follow each person through the whole book.
const cast = {
  buyer:    { color: "#167e83", shoulder: .21, hem: .18, height: 1.04 },
  seller:   { color: "#bd7031", shoulder: .22, hem: .29, height: 1.12 },
  mediator: { color: "#605487", shoulder: .28, hem: .25, height: 1.21 },
  son:      { color: "#456b9c", shoulder: .16, hem: .15, height: .94 },
  daughter: { color: "#a74964", shoulder: .17, hem: .31, height: .98 },
} as const;

// Faceted gores narrow into a turned lip. A recessed mouth leaves the upper coins visible.
function vessel(full = true) {
  const jar = new THREE.Group();
  const profile = [[.25, 0], [.34, .08], [.53, .34], [.6, .68], [.53, .9],
    [.34, 1.05], [.33, 1.16], [.4, 1.19], [.39, 1.25], [.31, 1.25], [.29, 1.08]];
  jar.add(new THREE.Mesh(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 20), stock(clay)));
  for (const [r, y] of [[.34, .09], [.591, .63], [.59, .68], [.345, 1.1], [.39, 1.23]]) {
    place(jar, ring(r, .017, slip), 0, y, 0);
  }
  for (const side of [-1, 1]) {
    const handle = new THREE.Mesh(new THREE.TorusGeometry(.21, .05, 6, 16), stock(clay));
    handle.scale.y = 1.28;
    handle.rotation.y = side * .16;
    handle.position.set(side * .49, .89, 0);
    jar.add(handle);
  }
  place(jar, disc(.315, .02, full ? "#ad7832" : "#6c3d2d"), 0, 1.1, 0);
  if (full) for (let i = 0; i < 9; i++) {
    const a = i * 2.4, r = .18 * Math.sqrt(i / 8);
    const coin = place(jar, disc(.12, .035, i % 2 ? "#ebbb57" : "#f5d77d", 14),
      Math.cos(a) * r, 1.265 - i * .009, Math.sin(a) * r);
    coin.rotation.z = .25 * Math.cos(a);
  }
  return jar;
}

// A recessed arched doorway, projecting cornice and folded tile canopy read from either side.
function doorway() {
  const wall = new THREE.Group();
  place(wall, box(2.16, 1.75, .42, stone), 0, .875, 0);
  place(wall, box(2.28, .11, .52, slip), 0, 1.76, 0);
  const arch = new THREE.Shape();
  arch.moveTo(-.39, 0); arch.lineTo(-.39, .91);
  arch.absarc(0, .91, .39, Math.PI, 0, true);
  arch.lineTo(.39, 0); arch.closePath();
  const inset = new THREE.Mesh(new THREE.ExtrudeGeometry(arch, { depth: .035, bevelEnabled: false }), stock("#315b58"));
  place(wall, inset, 0, .04, .215);
  for (let i = 0; i < 9; i++) {
    const a = (i + .5) * Math.PI / 9;
    const voussoir = place(wall, box(.145, .13, .11, i % 2 ? "#efdbb7" : "#ccaa7e"),
      Math.cos(a) * .46, .95 + Math.sin(a) * .46, .24);
    voussoir.rotation.z = a - Math.PI / 2;
  }
  for (const side of [-1, 1]) {
    place(wall, box(.13, .94, .12, "#efdbb7"), side * .46, .49, .23);
    place(wall, box(.29, .36, .04, teal), side * .79, 1.09, .225);
  }
  place(wall, box(1.14, .07, .45, "#cfaf83"), 0, .035, .36);
  return wall;
}

// A folded corner with open lattice windows casts a real patterned shadow on the carpet.
function windowWall() {
  const panel = new THREE.Group();
  const width = 2.45;
  place(panel, box(width, .45, .13, stone), 0, .225, 0);
  place(panel, box(width, .13, .17, slip), 0, 1.55, 0);
  for (const x of [-.94, 0, .94]) {
    place(panel, box(x === 0 ? .18 : .57, 1.04, .13, stone), x, .97, 0);
  }
  for (const x of [-.38, .38]) {
    for (let i = -1; i <= 1; i++) {
      place(panel, box(.025, 1.04, .042, "#916947"), x + i * .16, .97, 0);
      place(panel, box(.58, .03, .042, "#916947"), x, .97 + i * .24, .015);
    }
  }
  place(panel, box(width, .07, .19, "#b28359"), 0, .45, .024);
  return panel;
}

function basket() {
  const basket = new THREE.Group();
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(.36, .27, .28, 14), stock("#bd9058"));
  place(basket, shell, 0, .14, 0);
  for (const [r, y] of [[.29,.07],[.32,.16],[.36,.28]]) place(basket, ring(r, .022, "#e2bb80"), 0, y, 0);
  for (let i = 0; i < 7; i++) {
    const a = i * 2.4;
    const loaf = place(basket, new THREE.Mesh(new THREE.IcosahedronGeometry(.16, 1), stock(i % 2 ? "#d2a05e" : "#eac488")),
      Math.cos(a) * .18, .31 + .04 * Math.cos(i), Math.sin(a) * .18);
    loaf.scale.set(1.15, .71, .89);
  }
  return basket;
}

function furrows(g: THREE.Group, x: number, z: number) {
  for (let i = 0; i < 9; i++) {
    const row = place(g, box(1.37, .025, .07, i % 2 ? "#8d8055" : "#a59562"), x, .063, z + i * .114);
    row.rotation.y = -.08;
  }
}

function rug(g: THREE.Group, x: number, z: number, w: number, d: number) {
  place(g, box(w, .025, d, teal), x, .076, z);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 2; i++) place(g, box(.033, .008, d * .94, "#f2d6a3"), x + side * (w / 2 - .08 - i * .07), .094, z);
  }
}

export function buildGoldJarSpread(scene: string) {
  const g = new THREE.Group();
  const indoors = scene === "p05";
  for (const side of [-1, 1]) {
    place(g, box(3.32, .034, 4.19, indoors ? "#d7be98" : scene === "p01" ? "#bdba86" : "#d6bc8c"), side * 1.67, .034, 0);
  }
  function pop(part: THREE.Group, x: number, z: number, size = 1, turn = 0) {
    place(g, score(part, 0, 0, -.72, .16, .88), x, .09, z, size, turn);
  }
  switch (scene) {
    case "p01":
      pop(cottage(), -1.96, -.86, 1.8, .19); pop(cottage(), 1.98, -1.02, 1.45, -.24);
      pop(palm(), -2.79, -.35, .83);
      furrows(g, 1.74, .55); furrows(g, -1.45, .63);
      for (let i = 0; i < 7; i++) {
        const x = -1.8 + i * .6;
        place(g, box(.08, .4, .08, "#96704b"), x, .25, -.15);
      }
      place(g, box(3.7, .07, .06, "#ba9164"), 0, .32, -.15);
      pop(paperPerson(cast.buyer), -.57, .53, 1, .22);
      pop(paperPerson(cast.seller), .56, .48, 1, -.25);
      break;
    case "p02": {
      const pit = place(g, disc(.69, .02, "#8d6649", 18), -1.5, .07, .5);
      pit.scale.z = .73;
      for (let i = 0; i < 13; i++) {
        const a = i * .48;
        const clod = place(g, new THREE.Mesh(new THREE.DodecahedronGeometry(.15 + .035 * Math.cos(i)), stock(i % 2 ? "#b7875c" : "#aa7953")),
          -1.5 + .73 * Math.cos(a), .125, .5 + .55 * Math.sin(a));
        clod.scale.y = .6;
      }
      const spade = new THREE.Group();
      place(spade, box(.09, .08, .86, "#896947"), 0, .05, -.33);
      place(spade, box(.31, .045, .39, "#707c79"), 0, .038, .24);
      place(g, spade, -2.38, .068, .34, 1, -.55);
      const discovery = vessel();
      discovery.userData.pick = "jar";
      pop(discovery, .63, -.28, 1.65);
      pop(paperPerson(cast.buyer), -1.12, -.46, 1.13, .28);
      for (let i = 0; i < 5; i++) {
        place(g, disc(.15, .034, "#dfb35d", 18), 1.1 + i * .22, .081, .9 - .2 * Math.sin(i));
      }
      furrows(g, -2.1, -1.65);
      break;
    }
    case "p03":
      pop(doorway(), .86, -.75, 1.27, -.12);
      pop(vessel(), .58, .58, .74);
      pop(paperPerson(cast.buyer), -.52, .85, 1.05, .3);
      pop(paperPerson(cast.seller), 1.51, .26, 1.05, -.22);
      for (let i = 0; i < 7; i++) place(g, box(.38, .035, .35, "#efe0bd"), -2.56 + .39 * i, .07, 1.39 - .125 * i, 1, -.21);
      pop(palm(), -2.13, -1.14, 1.04);
      break;
    case "p04":
      pop(cottage(), -2.18, -.64, 1.89, .24); pop(doorway(), 2.13, -.84, .86, -.28);
      pop(vessel(), 0, .36, 1.1);
      pop(paperPerson(cast.buyer), -1.19, .63, 1.06, .24);
      pop(paperPerson(cast.seller), 1.25, .45, 1.06, -.28);
      break;
    case "p05":
      pop(windowWall(), -1.18, -1.42, 1, .07);
      pop(windowWall(), 1.23, -1.24, 1, -.22);
      rug(g, 0, .04, 4.6, 2.56);
      for (const [x, z, turn] of [[-1.6,.16,.22],[.03,-.94,0],[1.59,.16,-.22]]) {
        const cushion = new THREE.Group();
        place(cushion, box(1.04, .17, .62, "#9a523c"), 0, .095, 0);
        place(cushion, box(1.02, .035, .61, "#dba562"), 0, .16, 0);
        const top = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 6), stock("#b96e53"));
        top.scale.set(.53, .095, .32);
        top.position.y = .17;
        cushion.add(top);
        pop(cushion, x, z, 1, turn);
      }
      pop(vessel(), 0, .47, .83);
      pop(paperPerson(cast.buyer), -1.56, .65, 1, .29);
      pop(paperPerson(cast.seller), 1.67, .65, 1, -.29);
      pop(paperPerson(cast.mediator), .57, -.68, 1, -.13);
      break;
    case "p06":
      pop(doorway(), -.87, -.96, 1.15, .14); pop(palm(), 2.19, -1.05, 1.05);
      rug(g, .75, .76, 2.68, 1.31);
      pop(basket(), .25, .53, 1.22); pop(basket(), 1.28, .79, 1.04);
      pop(vessel(false), -1.66, .35, .77);
      pop(paperPerson(cast.son), -.62, .23, 1.1, .18);
      pop(paperPerson(cast.daughter), 1.78, -.05, 1.1, -.21);
      break;
  }
  return g;
}
