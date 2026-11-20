import * as THREE from "three";

/** Flat-sawn walnut. Growth rings bend through the cut and the pores follow
 * them along the board. Make the tabletop once, outside the page-turn loop. */
export function makeTabletop(boardWidth: number, boardDepth: number) {
  const width = 1536, height = 768;
  const pixels = new Uint8Array(width * height * 4);
  const lattice = new Float32Array(256 * 256);
  let seed = 80147;
  for (let i = 0; i < lattice.length; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    lattice[i] = seed / 0xffffffff;
  }
  function noise(x: number, y: number) {
    const ix = Math.floor(x), iy = Math.floor(y);
    let u = x - ix, v = y - iy;
    u = u * u * (3 - 2 * u);
    v = v * v * (3 - 2 * v);
    const row = (iy & 255) << 8, next = ((iy + 1) & 255) << 8;
    const a = ix & 255, b = (ix + 1) & 255;
    return (lattice[row + a] * (1 - u) + lattice[row + b] * u) * (1 - v)
      + (lattice[next + a] * (1 - u) + lattice[next + b] * u) * v;
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const row = y / 178 + x * .00032;
      const board = Math.floor(row);
      const along = x / width + board * 3.68;
      const across = row - board;
      const drift = noise(along * 2.7, row * .8) * .15 + noise(along * 7, row * 1.3) * .028;
      const grain = across + drift;
      const radius = Math.hypot(grain - .47, .12 + .24 * noise(along * 3, board + .71));
      const ring = radius * 27 + noise(along * 8, grain * 11) * .24;
      const latewood = Math.exp(-5.6 * (ring - Math.floor(ring)));
      const fibre = noise(along * 40, grain * 200);
      const pore = Math.max(0, .42 - noise(along * 150, grain * 275)) * 23;
      const joint = Math.max(0, 1 - Math.min(across, 1 - across) * 126);
      const tint = 15 * noise(board + 4, 7) + 36 * noise(along * 4, grain * 5)
        + 25 * fibre - 29 * latewood - pore * 1.6 - 14 * joint;
      const i = (y * width + x) * 4;
      pixels[i] = 68 + tint;
      pixels[i + 1] = Math.max(0, 38 + tint * .75);
      pixels[i + 2] = Math.max(0, 23 + tint * .59);
      pixels[i + 3] = 255;
    }
  }
  const map = new THREE.DataTexture(pixels, width, height);
  map.colorSpace = THREE.SRGBColorSpace;
  map.minFilter = THREE.LinearMipmapLinearFilter;
  map.magFilter = THREE.LinearFilter;
  map.generateMipmaps = true;
  map.anisotropy = 4;
  map.wrapS = map.wrapT = THREE.MirroredRepeatWrapping;
  map.repeat.set(4, 4);
  map.offset.set(-1.5, -1.5);
  map.needsUpdate = true;
  const material = new THREE.MeshPhysicalMaterial({
    map, roughness: .68, specularIntensity: .38, bumpMap: map, bumpScale: .032,
  });
  // The key light casts the moving lid's shadow. Soften the ambient fill near
  // each board where light from the room cannot reach underneath the binding.
  const lid = { value: new THREE.Vector2(0, 0) };
  material.onBeforeCompile = shader => {
    shader.uniforms.uBookLid = lid;
    shader.uniforms.uBoardSize = { value: new THREE.Vector2(boardWidth, boardDepth * .5) };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec2 vTablePoint;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvTablePoint = vec2(position.x, -position.y);");
    shader.fragmentShader = shader.fragmentShader.replace("#include <common>", `#include <common>
      varying vec2 vTablePoint;
      uniform vec2 uBookLid;
      uniform vec2 uBoardSize;
      float boardOcclusion(vec2 point, float width, float lift) {
        vec2 outside = max(abs(point - vec2(width * .5, 0.)) - vec2(width * .5, uBoardSize.y), 0.);
        float gap = length(vec3(outside, lift));
        return .48 * exp(-12. * gap) + .28 * exp(-3.5 * gap);
      }`).replace("#include <opaque_fragment>", `
        // The thick binding also blocks window fill on the far side of the book.
        vec2 farSide = vTablePoint - vec2(.25, -.09);
        float baseShade = max(boardOcclusion(vTablePoint, uBoardSize.x, 0.),
                              .74 * boardOcclusion(farSide, uBoardSize.x, 0.));
        float lidHeight = clamp(-vTablePoint.x / max(uBookLid.x, .001), 0., 1.) * uBookLid.y;
        float lidShade = max(boardOcclusion(vec2(-vTablePoint.x, vTablePoint.y), uBookLid.x, lidHeight),
                             .74 * boardOcclusion(vec2(-farSide.x, farSide.y), uBookLid.x, lidHeight));
        outgoingLight *= 1. - max(baseShade, lidShade);
        #include <opaque_fragment>`);
  };
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(88, 60), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -.269;
  mesh.receiveShadow = true;
  return {
    mesh,
    open(angle: number) {
      lid.value.set(Math.max(0, -Math.cos(angle)) * boardWidth, Math.sin(angle) * boardWidth);
    },
    dispose() { map.dispose(); material.dispose(); },
  };
}
