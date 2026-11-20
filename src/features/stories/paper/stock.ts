import * as THREE from "three";

export type Point = [number, number, number];
const palette = new Map<string, THREE.MeshStandardMaterial>();
let grain: THREE.DataTexture | undefined;

/** The same fine flecks run through the paper, its raw edges and the printed inks. */
function paperGrain() {
  if (grain) return grain;
  const size = 128;
  const pixels = new Uint8Array(size * size * 4);
  let seed = 913;
  function random() {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  for (let i = 0; i < pixels.length; i += 4) {
    const value = 240 + Math.round(random() * 15);
    pixels.set([value, value, value - 2, 255], i);
  }
  // Short pressed fibres pick up light along their lip. Wrap each fibre over
  // the tile boundary so the grain stays continuous across a broad paper face.
  for (let fibre = 0; fibre < 740; fibre++) {
    const x = random() * size, y = random() * size, angle = random() * Math.PI;
    const length = 2 + Math.floor(random() * 5);
    for (let step = 0; step < length; step++) {
      const u = Math.floor(x + step * Math.cos(angle) + size) % size;
      const v = Math.floor(y + step * Math.sin(angle)) % size;
      const index = (v * size + u) * 4;
      const shade = Math.round(10 * Math.sin(Math.PI * (step + 1) / (length + 1)));
      for (let c = 0; c < 3; c++) pixels[index + c] -= shade;
    }
  }
  grain = new THREE.DataTexture(pixels, size, size);
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  grain.magFilter = THREE.LinearFilter;
  grain.minFilter = THREE.LinearMipMapLinearFilter;
  grain.generateMipmaps = true;
  grain.colorSpace = THREE.SRGBColorSpace;
  grain.needsUpdate = true;
  return grain;
}

export type Finish = "paper" | "timber" | "amber";
let timber: THREE.DataTexture | undefined;
function timberPrint() {
  if (timber) return timber;
  const width = 256, height = 128;
  const pixels = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const u = x / width * Math.PI * 2, v = y / height * Math.PI * 2;
    const whorl = .8 * Math.sin(u + Math.sin(v)) + .35 * Math.sin(u * 2 + v);
    const line = Math.sin(v * 14 + whorl * 2.4);
    const value = 244 - Math.round(23 * Math.pow((line + 1) / 2, 6) + 8 * Math.cos(v * 29 + whorl));
    pixels.set([value, value - 2, value - 4, 255], (y * width + x) * 4);
  }
  timber = new THREE.DataTexture(pixels, width, height);
  timber.wrapS = timber.wrapT = THREE.RepeatWrapping;
  timber.magFilter = THREE.LinearFilter;
  timber.minFilter = THREE.LinearMipmapLinearFilter;
  timber.generateMipmaps = true;
  timber.colorSpace = THREE.SRGBColorSpace;
  timber.needsUpdate = true;
  return timber;
}

export function stock(color: string, finish: Finish = "paper") {
  const key = color + finish;
  let material = palette.get(key);
  if (!material) {
    material = new THREE.MeshStandardMaterial({
      color, map: finish === "timber" ? timberPrint() : paperGrain(),
      bumpMap: paperGrain(), bumpScale: .007,
      roughness: finish === "amber" ? .52 : finish === "timber" ? .84 : .95,
      emissive: finish === "amber" ? "#f7ae44" : "#000000", emissiveIntensity: .22,
      side: THREE.DoubleSide, flatShading: true,
    });
    material.name = finish;
    palette.set(key, material);
  }
  return material;
}

let readers = 0;
export function retainStock() {
  readers++;
  return () => {
    if (--readers > 0) return;
    palette.forEach(material => material.dispose());
    palette.clear();
    grain?.dispose();
    timber?.dispose();
    grain = undefined;
    timber = undefined;
  };
}

/** Folded card with an inked face, reverse and exposed fibre along the cut. */
export function sheet(points: Point[], color: string, trim = true, finish: Finish = "paper") {
  const group = new THREE.Group();
  const outline = points.map(p => new THREE.Vector3(...p));
  const normal = new THREE.Vector3().crossVectors(
    outline[1].clone().sub(outline[0]), outline[2].clone().sub(outline[0]),
  ).normalize();
  const reverse = outline.map(p => p.clone().addScaledVector(normal, -.009));
  function face(rim: THREE.Vector3[], material: THREE.Material) {
    const vertices: number[] = [];
    const uv: number[] = [];
    for (let i = 1; i < rim.length - 1; i++) {
      for (const p of [rim[0], rim[i], rim[i + 1]]) {
        vertices.push(p.x, p.y, p.z);
        uv.push(p.x + p.z * .45, p.y + p.z * .84);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geometry.computeVertexNormals();
    group.add(new THREE.Mesh(geometry, material));
  }
  face(outline, stock(color, finish));
  if (trim) {
    face([...reverse].reverse(), stock(color));
    for (let i = 0; i < outline.length; i++) {
      const end = (i + 1) % outline.length;
      face([outline[end], outline[i], reverse[i], reverse[end]], stock("#e4cda7"));
    }
  }
  return group;
}
