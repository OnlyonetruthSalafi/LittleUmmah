import * as THREE from "three";
import { sheet, stock, type Point } from "./stock";
import { wave } from "./sculptures";

function foldedBranch(from: Point, to: Point, base: number, tip: number, color: string) {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const branch = new THREE.Mesh(new THREE.CylinderGeometry(tip, base, a.distanceTo(b), 5), stock(color));
  branch.position.copy(a).lerp(b, .5);
  branch.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.sub(a).normalize());
  return branch;
}

/** View from the dry deck: the child looks between two walls of water. */
export function safePassage() {
  const scene = new THREE.Group();
  const rows = [
    [-1.83, -.4, 2.9, 1.7, .22], [1.72, -.87, -2.9, 1.73, -.16],
    [-2.37, .8, 1.65, 1.48, -.16], [2.38, .54, -1.77, 1.5, .18],
  ];
  for (const [x, z, width, height, angle] of rows) {
    const crest = wave();
    crest.position.set(x, .07, z);
    crest.scale.set(width, Math.abs(width) * height, Math.abs(width));
    crest.rotation.y = angle;
    scene.add(crest);
  }
  const tip: Point = [0, .56, -.72];
  // The inner grain converges at the stem, so this reads as a viewpoint aboard.
  for (let i = 0; i < 9; i++) {
    const x = -1.39 + i * .31;
    scene.add(sheet([[x, .13, 1.91], [x + .29, .13, 1.91], tip], i % 2 ? "#bea074" : "#ccb28a", false));
  }
  for (const side of [-1, 1]) {
    const near: Point = [side * 1.43, .13, 1.92];
    const top: Point = [side * 1.43, .48, 1.92];
    const prow: Point = [0, .98, -.72];
    scene.add(sheet([near, tip, prow, top], "#8e603f"));
    scene.add(foldedBranch(top, prow, .045, .035, "#e0c599"));
    for (const t of [.23, .56, .84]) {
      const x = side * 1.43 * t, z = -.72 + t * 2.64;
      scene.add(foldedBranch([x, .53 - t * .4, z], [x, .98 - t * .5, z], .045, .041, "#654a37"));
    }
  }
  scene.add(foldedBranch(tip, [0, .98, -.72], .067, .055, "#8a6148"));
  // A mooring rope coiled inside the gunwale stays below the horizon.
  for (let i = 0; i < 3; i++) {
    const rope = new THREE.Mesh(new THREE.TorusGeometry(.18 + i * .055, .025, 5, 24), stock("#866b45"));
    rope.rotation.x = -Math.PI / 2 - .16;
    rope.position.set(.49, .29 + i * .004, 1.25);
    scene.add(rope);
  }
  return scene;
}

function foliage(width: number, height: number, light: string, shade: string) {
  const crown = new THREE.Group();
  const ridge: Point = [0, height * .47, width * .23];
  const outline: Point[] = [
    [-width * .5, 0, 0], [-width * .54, height * .38, 0], [-width * .32, height * .83, 0],
    [0, height, 0], [width * .32, height * .76, 0], [width * .5, height * .33, 0], [width * .43, 0, 0],
  ];
  outline.forEach((point, i) => crown.add(sheet([point, outline[(i + 1) % outline.length], ridge], i < 3 ? light : shade)));
  return crown;
}

/** A quiet shore and a single path into shade illustrate the lesson about safety. */
export function shelteredShore() {
  const scene = new THREE.Group();
  const shore: Point[] = [[-3.25,.074,-1.95],[-2.2,.074,-1.95],[-1.38,.074,-1.22],[-1.66,.074,-.48],
    [-1.19,.074,.19],[-1.45,.074,.84],[-.59,.074,1.94],[-3.25,.074,1.94]];
  for (let i = 1; i < shore.length - 2; i++) scene.add(sheet([shore[0], shore[i], shore[i+1]], "#899fa7", false));
  scene.add(sheet([shore[0], shore[shore.length-2], shore[shore.length-1]], "#899fa7", false));
  const track = [[-.45,1.94,.62],[-.24,1.5,.55],[.35,1.05,.47],[.43,.63,.4],[.06,.22,.31],[.24,-.15,.23],[.8,-.5,.18]];
  for (let i = 1; i < track.length; i++) {
    const [x,z,r] = track[i-1], [nx,nz,nr] = track[i];
    scene.add(sheet([[x-r,.092,z],[x+r,.092,z],[nx+nr,.092,nz],[nx-nr,.092,nz]], "#dec89e", false));
  }
  const root: Point = [1.02,.12,-.62];
  const fork: Point = [.88,1.35,-.62];
  scene.add(foldedBranch(root, fork, .19, .105, "#8d6849"));
  const branches: Point[] = [[-.22,1.66,-.52],[.52,1.95,-.85],[1.29,1.86,-.94],[2.12,1.62,-.42]];
  for (const [i, end] of branches.entries()) {
    scene.add(foldedBranch(fork, end, .097, .045, "#937456"));
    const leaves = foliage(i % 2 ? 1.48 : 1.62, .74, i % 2 ? "#a4ac76" : "#91a46c", i % 2 ? "#77865f" : "#657b55");
    leaves.position.set(end[0], end[1]-.15, end[2]);
    leaves.rotation.y = (i - 1.5) * .3;
    scene.add(leaves);
  }
  for (const [x,z] of [[-1.86,-.3],[-1.47,1.45],[2,.72]]) {
    for (const dx of [-.15,.05,.16]) {
      scene.add(sheet([[x,.09,z],[x+dx,.47+Math.abs(dx),z-.05],[x+.06,.09,z]], "#788c69"));
    }
  }
  for (const [x,z,scale] of [[-1.76,.49,.2],[-1.7,.68,.12],[-2.05,-1.27,.28]]) {
    const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(1),stock("#9c9b89"));
    rock.position.set(x,.105,z);
    rock.scale.set(scale,scale*.5,scale*.78);
    scene.add(rock);
  }
  return scene;
}

/** The final invitation to praise is accompanied by the sky and earth together. */
export function skyAndEarth() {
  const scene = new THREE.Group();
  const radius = 2.45;
  const depth = (x: number) => -.87 + Math.abs(x) * .19;
  for (let i = 0; i < 24; i++) {
    const start = i * Math.PI / 24, end = (i + 1) * Math.PI / 24;
    const x = Math.cos(start) * radius, nx = Math.cos(end) * radius;
    const z = depth(x), nz = depth(nx);
    const y = .19 + Math.sin(start) * 2.35, ny = .19 + Math.sin(end) * 2.35;
    scene.add(sheet([[x,.09,z],[nx,.09,nz],[nx,ny,nz],[x,y,z]], i < 12 ? "#304362" : "#3a5173", false));
    scene.add(sheet([[x,y-.035,z+.008],[nx,ny-.035,nz+.008],[nx,ny,nz+.008],[x,y,z+.008]], "#c6ac7a", false));
  }
  const moon = new THREE.Shape();
  moon.moveTo(-.05,.58);
  moon.bezierCurveTo(-.74,.47,-.65,-.48,-.04,-.53);
  moon.bezierCurveTo(.19,-.56,.42,-.41,.51,-.2);
  moon.bezierCurveTo(.06,-.41,-.46,.09,-.05,.58);
  const crescent = new THREE.Mesh(new THREE.ExtrudeGeometry(moon, { depth:.045, bevelEnabled:false, curveSegments:20 }), stock("#ead49c"));
  crescent.position.set(-.7,1.58,depth(-.7)+.09);
  crescent.rotation.y = .17;
  scene.add(crescent);
  for (const [x,y,r] of [[-1.89,.92,.08],[-1.4,1.64,.09],[-.24,2.13,.075],[.35,1.61,.11],[1.15,1.9,.09],[1.74,1.24,.1],[.98,1.27,.055]]) {
    const z = depth(x) + .027;
    scene.add(sheet([[x-r,y,z],[x,y+r*1.6,z],[x+r,y,z],[x,y-r*1.6,z]], "#f4de9f", false));
  }
  // A second, lower fold brings the land in front of the sky.
  for (const [x,z,w,h] of [[-2.25,.12,1.45,.61],[-1.28,.16,1.85,.98],[.5,.05,1.9,.67],[1.59,.23,2.1,.96]]) {
    const top: Point = [x+.12,h,z-.14], crease: Point = [x-.12,.1,z+.39];
    scene.add(sheet([[x-w/2,.09,z],top,crease],"#718674"));
    scene.add(sheet([crease,top,[x+w/2,.09,z]],"#516856"));
  }
  for (const side of [-1,1]) {
    const sprig = new THREE.Group();
    sprig.add(foldedBranch([0,0,0],[side*.55,.95,0],.05,.023,"#8b9774"));
    for (let i = 0; i < 4; i++) {
      const base: Point = [side*i*.13,.14+i*.2,0];
      const end: Point = [base[0]+(i%2?-.38:.35),base[1]+.36,-.04];
      const mid: Point = [(base[0]+end[0])/2,(base[1]+end[1])/2,.085];
      sprig.add(sheet([base,[mid[0]-.14,mid[1]+.08,0],end,mid],"#91a179"),
        sheet([base,mid,end,[mid[0]+.14,mid[1]-.08,0]],"#688061"));
    }
    sprig.position.set(side*2.13,.09,1.04);
    scene.add(sprig);
  }
  return scene;
}
