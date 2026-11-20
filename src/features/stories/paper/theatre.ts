import * as THREE from "three";
import { buildSpread } from "./spreads";
import { bindSpread, restAngle } from "./folds";
import { retainStock, stock } from "./stock";
import { makeCoverArt } from "./cover-art";
import { makeTabletop } from "./tabletop";

const pageWidth = 3.57;
const pageDepth = 4.64;
const boardWidth = 3.72, boardDepth = 4.92;
const leftAngle = Math.PI - restAngle;
const views = {
  viewOverview: [.25, .57],
  viewFront: [0, .46],
  viewLeft: [-.82, .48],
  viewRight: [.86, .48],
  viewAbove: [0, 1.24],
} as const;
export type PaperView = keyof typeof views;

function pageBoard(width: number, depth: number, thickness: number, color: string) {
  const shape = new THREE.Shape();
  const corner = .075;
  const z = depth / 2;
  shape.moveTo(0, -z);
  shape.lineTo(width - corner, -z);
  shape.quadraticCurveTo(width, -z, width, -z + corner);
  shape.lineTo(width, z - corner);
  shape.quadraticCurveTo(width, z, width - corner, z);
  shape.lineTo(0, z);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false, curveSegments: 4 });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, -thickness, 0);
  const mesh = new THREE.Mesh(geometry, stock(color));
  mesh.castShadow = mesh.receiveShadow = true;
  return mesh;
}

function hardcoverBook() {
  const book = new THREE.Group();
  const hinge = new THREE.Group();
  const coverMaterial = makeCoverArt();
  const radius = .266;
  const segments = 16;
  const spineGeometry = new THREE.PlaneGeometry(1, 4.91, segments, 1);
  const spine = new THREE.Mesh(spineGeometry, stock("#283548"));
  spine.frustumCulled = false;
  spine.castShadow = spine.receiveShadow = true;
  book.add(spine);
  let lastAngle = -1;
  for (const side of [-1, 1]) {
    const pile = new THREE.Group();
    pile.rotation.y = side < 0 ? Math.PI : 0;
    pile.rotation.z = side > 0 ? restAngle : 0;
    function add(width: number, depth: number, thick: number, y: number, color: string) {
      const mesh = pageBoard(width, depth, thick, color);
      mesh.position.y = y;
      pile.add(mesh);
    }
    add(boardWidth, boardDepth, .085, -.18, "#283548");
    add(3.70, 4.90, .014, -.167, "#a6895e");
    add(3.67, 4.85, .024, -.145, "#435363");
    for (let layer = 0; layer < 8; layer++) {
      const edge = layer % 3 === 0 ? "#d0c4ae" : "#ece3cf";
      add(pageWidth - .016 * Math.cos(layer * 1.7), pageDepth + (layer % 3) * .009,
        .018, -.126 + layer * .018, edge);
    }
    add(pageWidth, pageDepth, .009, .009, "#f5eedf");
    if (side > 0) {
      book.add(pile);
    } else {
      // The outside of the front board lies underneath the left pile when open.
      const cloth = new THREE.Mesh(new THREE.PlaneGeometry(3.695, 4.885), coverMaterial);
      cloth.rotation.x = Math.PI / 2;
      cloth.position.set(1.86, -.266, 0);
      cloth.receiveShadow = true;
      pile.add(cloth);
      hinge.add(pile);
      book.add(hinge);
    }
  }
  return {
    book,
    open(angle: number) {
      if (angle === lastAngle) return;
      lastAngle = angle;
      hinge.rotation.z = angle - Math.PI;
      hinge.position.y = .025 * (leftAngle - angle) / (leftAngle - restAngle);
      // Wrap the cloth from the back board, around the sewn signatures, onto the front.
      const positions = spineGeometry.getAttribute("position");
      for (let i = 0; i <= segments; i++) {
        const u = i / segments;
        const a = -Math.PI / 2 - (Math.PI - angle) * u;
        const y = radius * Math.sin(a) + u * hinge.position.y;
        positions.setXYZ(i, radius * Math.cos(a), y, -2.455);
        positions.setXYZ(i + segments + 1, radius * Math.cos(a), y, 2.455);
      }
      positions.needsUpdate = true;
      spineGeometry.computeVertexNormals();
      spine.visible = angle < Math.PI - .002;
    },
    dispose() {
      const textures = new Set(Object.values(coverMaterial).filter(value => value instanceof THREE.Texture));
      textures.forEach(texture => texture.dispose());
      coverMaterial.dispose();
    },
  };
}

export function createTheatre(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "low-power" });
  const releaseStock = retainStock();
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMappingExposure = 1.04;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#76604e");
  // A broad window and dim walls give the foil a moving reflection as the lid lifts.
  const studio = new Uint16Array(128 * 64 * 4);
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 128; x++) {
      const pane = Math.exp(-(((x - 35) / 20) ** 4 + ((y - 44) / 11) ** 4));
      const light = .14 + .27 * y / 64 + 3.3 * pane;
      const index = (y * 128 + x) * 4;
      [light, light * .99, light * .96, 1].forEach((v, c) => { studio[index + c] = THREE.DataUtils.toHalfFloat(v); });
    }
  }
  const environment = new THREE.DataTexture(studio, 128, 64, THREE.RGBAFormat, THREE.HalfFloatType);
  environment.mapping = THREE.EquirectangularReflectionMapping;
  environment.needsUpdate = true;
  scene.environment = environment;
  scene.environmentIntensity = .42;
  const camera = new THREE.PerspectiveCamera(29, 5 / 3, .1, 80);
  const target = new THREE.Vector3(0, .64, 0);
  let yaw = .25, pitch = .57, focus = 0;
  let cameraFrame = 0;
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let turnLift = 0;
  let coverOpening = 0;
  let turnedLeafAngle = 0;

  scene.add(new THREE.HemisphereLight("#e8edff", "#ab8565", .90));
  const key = new THREE.SpotLight("#ffead2", 198, 32, 1.12, .96, 2);
  key.position.set(-4.7, 6.8, 2.0);
  key.target.position.set(-1.7, 0, -.5);
  scene.add(key.target);
  key.castShadow = true;
  const shadowSize = canvas.clientWidth < 600 ? 1024 : 2048;
  key.shadow.mapSize.set(shadowSize, shadowSize);
  Object.assign(key.shadow.camera, { near: 1, far: 21 });
  key.shadow.focus=.80;
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.normalBias = .005;
  key.shadow.bias = -.00014;
  key.shadow.radius = 3;
  scene.add(key);
  const rim = new THREE.DirectionalLight("#d6e3f1", .46);
  rim.position.set(3, 4, 4);
  scene.add(rim);

  const table = makeTabletop(boardWidth, boardDepth);
  const bindingModel = hardcoverBook();
  scene.add(table.mesh, bindingModel.book);

  const leaf = pageBoard(pageWidth, pageDepth, .018, "#f5eedf");
  leaf.position.y = .016;
  scene.add(leaf);
  const cache = new Map<string, ReturnType<typeof bindSpread>>();
  function spread(name: string) {
    let part = cache.get(name);
    if (!part) {
      const model = buildSpread(name);
      part = bindSpread(model);
      scene.add(part.group);
      cache.set(name, part);
    }
    return part;
  }
  function draw() { renderer.render(scene, camera); }
  const ray = new THREE.Raycaster();
  const cursor = new THREE.Vector2();
  let highlighted: number | undefined;
  function pick(x: number, y: number) {
    ray.setFromCamera(cursor.set(x, y), camera);
    const roots = [...cache.values()].filter(part => part.group.visible).map(part => part.group);
    return ray.intersectObjects(roots)[0]?.object.userData;
  }
  function highlight(id?: number) {
    if (id === highlighted) return;
    for (const part of cache.values()) part.group.traverse(child => {
      if (child instanceof THREE.Mesh && child.userData.pickId !== undefined) {
        const material = child.material as THREE.MeshStandardMaterial;
        material.color.setScalar(child.userData.pickId === id ? 1.17 : 1);
      }
    });
    highlighted = id;
    draw();
  }
  const arkTarget = new THREE.Vector3(0, .96, -.36);
  const eye = new THREE.Vector3();
  const horizontal = new THREE.Vector3();
  const vertical = new THREE.Vector3();
  const point = new THREE.Vector3();
  let aspect = 5 / 3;
  function frameBook() {
    camera.aspect = aspect;
    camera.setFocalLength(50);
    camera.updateProjectionMatrix();
    target.set((1 - coverOpening) * pageWidth / 2, .16 + coverOpening * .30 + turnLift * .72, .15);
    target.lerp(arkTarget, focus * coverOpening);
    const elevation = pitch + .13 * (1 - coverOpening);
    eye.set(Math.sin(yaw) * Math.cos(elevation), Math.sin(elevation), Math.cos(yaw) * Math.cos(elevation));
    horizontal.crossVectors(camera.up, eye).normalize();
    vertical.crossVectors(eye, horizontal);
    const slope = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    let distance = 3.5;
    // Fit the moving board as well as the fore-edge nearest the lens.
    function include(x: number, y: number, z: number) {
      point.set(x, y, z).sub(target);
      const extent = Math.max(Math.abs(point.dot(horizontal)) / aspect, Math.abs(point.dot(vertical)));
      distance = Math.max(distance, point.dot(eye) + extent / (.93 * slope));
    }
    const lid = Math.PI * coverOpening;
    for (const z of [-2.46, 2.46]) {
      include(0, -.27, z);
      include(3.72, -.27, z);
      include(3.72 * Math.cos(lid), 3.72 * Math.sin(lid) + .27 * Math.cos(lid), z);
      if (leaf.visible) include(pageWidth * Math.cos(turnedLeafAngle), pageWidth * Math.sin(turnedLeafAngle), z);
    }
    include(0, 2.8 * coverOpening, 0);
    camera.position.copy(eye).multiplyScalar(distance * (1 - .32 * focus * coverOpening)).add(target);
    camera.lookAt(target);
  }
  function resize() {
    // The reader can be quarter-turned inside a portrait screen.
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (!width || !height) return;
    aspect = width / height;
    const ratio = Math.min(window.devicePixelRatio, width < 520 ? 1.5 : 1.75);
    if (renderer.getPixelRatio() !== ratio) renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    frameBook();
    draw();
  }
  function moveCamera(endYaw: number, endPitch: number, endFocus: number) {
    cancelAnimationFrame(cameraFrame);
    if (yaw === endYaw && pitch === endPitch && focus === endFocus) return;
    const start = performance.now(), a = yaw, b = pitch, c = focus;
    function tick(now: number) {
      const t = reduced() ? 1 : THREE.MathUtils.smoothstep((now - start) / 400, 0, 1);
      yaw = THREE.MathUtils.lerp(a, endYaw, t);
      pitch = THREE.MathUtils.lerp(b, endPitch, t);
      focus = THREE.MathUtils.lerp(c, endFocus, t);
      frameBook(); draw();
      if (t < 1) cameraFrame = requestAnimationFrame(tick);
    }
    tick(start);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  return {
    pose(current: string, next: string | undefined, amount: number, backward: boolean) {
      // One physical leaf is the old spread's right page AND the new one's left page.
      const from = backward && next ? next : current;
      const to = backward ? current : next;
      amount = THREE.MathUtils.clamp(amount, 0, 1);
      const t = backward ? 1 - amount : amount;
      const angle = restAngle + (leftAngle - restAngle) * t;
      cache.forEach(part => { part.group.visible = false; });
      coverOpening = from === "cover" ? (next ? t : 0) : 1;
      const coverAngle = restAngle + (leftAngle - restAngle) * coverOpening;
      bindingModel.open(coverAngle);
      table.open(coverAngle);
      if (from === "cover") {
        if (next && to && coverOpening > .006) spread(to).pose(angle, restAngle);
      } else if (next && to) {
        spread(from).pose(leftAngle, angle);
        spread(to).pose(angle, restAngle);
      } else {
        spread(current).pose(leftAngle, restAngle);
      }
      leaf.visible = Boolean(next) && from !== "cover";
      leaf.rotation.z = angle;
      turnedLeafAngle = angle;
      turnLift = next ? Math.sin(Math.PI * amount) : 0;
      frameBook();
      // Retain only the two spreads straddling the page to bound GPU memory.
      for (const [name, part] of cache) {
        if (name === current || name === next) continue;
        scene.remove(part.group);
        part.dispose();
        cache.delete(name);
      }
      draw();
    },
    camera(view: PaperView, closeUp: boolean) {
      const [angle, elevation] = views[view];
      if (closeUp) moveCamera(.29, .49, 1);
      else moveCamera(angle, elevation, 0);
    },
    hover(x?: number, y?: number) { highlight(x === undefined || y === undefined ? undefined : pick(x, y)?.pickId); },
    hitArk(x: number, y: number) { return pick(x, y)?.pick === "ark"; },
    dispose() {
      cancelAnimationFrame(cameraFrame);
      observer.disconnect();
      cache.forEach(part => { scene.remove(part.group); part.dispose(); });
      scene.traverse(node => { if (node instanceof THREE.Mesh) node.geometry.dispose(); });
      bindingModel.dispose();
      table.dispose();
      environment.dispose();
      key.shadow.dispose();
      renderer.dispose();
      releaseStock();
    },
  };
}
