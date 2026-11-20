import * as THREE from "three";
import { popUpSupport, score } from "./folds";
import { sheet, stock, type Finish, type Point } from "./stock";

function strip(a: Point, b: Point, width: number, thickness: number, color: string, finish: Finish = "paper") {
  const start = new THREE.Vector3(...a);
  const delta = new THREE.Vector3(...b).sub(start);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(delta.length(), thickness, width), stock(color, finish));
  mesh.position.copy(start).addScaledVector(delta, .5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), delta.normalize());
  return mesh;
}

function cutout(shape: THREE.Shape, color: string, thickness = .024) {
  return new THREE.Mesh(new THREE.ExtrudeGeometry(shape, {
    depth: thickness, bevelEnabled: false, curveSegments: 5,
  }), [stock(color), stock("#ddccab")]);
}

function roof(width: number, depth: number, rise: number) {
  const assembly = new THREE.Group();
  const rows = 5, columns = 13;
  const inks = ["#b64f31", "#bf5735", "#a7462e", "#c7603b", "#b85435"];
  for (const side of [-1, 1]) {
    const slope = new THREE.Group();
    const point = (x: number, t: number, offset = 0): Point =>
      [x, rise * t + offset, side * depth * .5 * (1 - t)];
    slope.add(sheet([point(-width/2, 0), point(width/2, 0), point(width/2, 1), point(-width/2, 1)], "#93442d"));
    for (let row = 0; row < rows; row++) {
      const stagger = (row % 2) / 2;
      for (let col = -1; col < columns; col++) {
        const x0 = Math.max(0, col + stagger) / columns * width - width / 2;
        const x1 = Math.min(columns, col + 1 + stagger) / columns * width - width / 2;
        if (x1 - x0 < .01) continue;
        const low = row / rows - .015, high = (row + 1) / rows;
        const k = Math.min(.018, (x1-x0) * .1);
        const tint = inks[(row * 13 + (col + 1) * 17) % inks.length];
        slope.add(sheet([point(x0 + k, low, .027), point(x1 - k, low, .027),
          point(x1 - .003, low + .02, .025), point(x1 - .003, high, .007),
          point(x0 + .003, high, .007), point(x0 + .003, low + .02, .025)], tint, false));
      }
    }
    assembly.add(score(slope, rise, 0, side * .62, .56, .96));
  }
  assembly.add(strip([-width/2, rise+.015, 0], [width/2, rise+.015, 0], .062, .025, "#e4ca9f"));
  return assembly;
}

function cabin(width: number, depth: number, height: number) {
  const house = new THREE.Group();
  const wall = new THREE.Shape();
  wall.moveTo(-width/2, 0); wall.lineTo(width/2, 0); wall.lineTo(width/2, height);
  wall.lineTo(-width/2, height); wall.closePath();
  const front = new THREE.Group();
  for (const x of [-width * .32, 0, width * .32]) {
    const w = width * .085, bottom = height * .18, top = height * .68;
    const hole = new THREE.Path();
    hole.moveTo(x-w/2, bottom); hole.lineTo(x-w/2, top); hole.lineTo(x+w/2, top);
    hole.lineTo(x+w/2, bottom); hole.closePath(); wall.holes.push(hole);
    const light = new THREE.Mesh(new THREE.BoxGeometry(w*1.15, top-bottom+.02, .015), stock("#d19438", "amber"));
    light.position.set(x, (bottom+top)/2, -.04); front.add(light);
    const reveal = new THREE.Mesh(new THREE.BoxGeometry(w*.17, top-bottom, .016), stock("#8e662e"));
    reveal.position.set(x-w*.40, (bottom+top)/2, -.029); front.add(reveal);
    const glint = new THREE.Mesh(new THREE.BoxGeometry(w*.12, (top-bottom)*.91, .008), stock("#f4cd72","amber"));
    glint.position.set(x+w*.29, (bottom+top)/2, -.026); front.add(glint);
    front.add(strip([x-w*.65,bottom-.012,.03],[x+w*.65,bottom-.012,.03],.06,.024,"#b79b70"));
  }
  front.add(cutout(wall, "#cfb891"));
  front.position.z = depth/2;
  house.add(front);
  house.add(sheet([[-width/2,0,-depth/2],[width/2,0,-depth/2],[width/2,height,-depth/2],[-width/2,height,-depth/2]], "#cfb38a"));
  const rise = depth * .46;
  for (const s of [-1,1]) {
    const x = s * width/2;
    house.add(sheet([[x,0,-depth/2],[x,0,depth/2],[x,height,depth/2],[x,height+rise,0],[x,height,-depth/2]], "#d6bf97"));
  }
  const tiles = roof(width+.16, depth+.16, rise+.045);
  tiles.position.y = height;
  house.add(tiles);
  return house;
}

function ark() {
  const boat = new THREE.Group();
  boat.userData.pick = "ark";
  const xs = [-2.07,-1.76,-1.28,-.72,.72,1.28,1.76,2.07];
  const widths = [.035,.42,.63,.70,.70,.63,.42,.035];
  const bands = ["#7e4f32","#905d3e","#925e3e","#a16844","#a96e48"];
  function ring(i: number, t: number, s: number): Point {
    const end = Math.abs(xs[i]/2.07);
    return [xs[i]*(.77+.23*t), .08+.85*t+.27*end**3, s*widths[i]*(.37+.63*t**.74)];
  }
  for (const s of [-1,1]) {
    for (let i=0; i<xs.length-1; i++) {
      for (let row=0; row<bands.length; row++) {
        const lo=row/bands.length, hi=(row+1)/bands.length;
        const a=ring(i,lo,s), b=ring(i+1,lo,s), c=ring(i+1,hi,s), d=ring(i,hi,s);
        boat.add(sheet([a,b,c,d],bands[row],false,"timber"));
        boat.add(strip(d,c,.013,.012,row===4?"#e0cb9e":"#bd9472"));
      }
      const a=ring(i,1,s), b=ring(i+1,1,s);
      const top=(p:Point):Point=>[p[0],p[1]+.20,p[2]];
      boat.add(strip(a,top(a),.024,.021,"#5a684a"));
      boat.add(strip(top(a),top(b),.033,.073,"#365e47"));
      boat.add(sheet([a,b,[b[0],b[1],0],[a[0],a[1],0]],"#dec69f",false));
    }
  }
  for (let i = 0; i < xs.length - 1; i++) {
    boat.add(sheet([ring(i, 0, -1), ring(i + 1, 0, -1), ring(i + 1, 0, 1), ring(i, 0, 1)], "#785035", true, "timber"));
  }
  for(let i=1;i<24;i++) {
    const x=-2+i/6;
    const index=xs.findIndex(v=>v>=x);
    const t=(x-xs[index-1])/(xs[index]-xs[index-1]);
    const a=ring(index-1,1,1), b=ring(index,1,1);
    const w=THREE.MathUtils.lerp(a[2],b[2],t), y=THREE.MathUtils.lerp(a[1],b[1],t)+.006;
    boat.add(strip([x,y,-w],[x,y,w],.011,.005,"#ad9371"));
  }
  const house=score(cabin(2.03,.86,.57),0,-.43,-.82,.28,.80);
  house.position.set(-.06,.935,-.04); boat.add(house);
  return boat;
}

function shrubs(width: number, height: number, color: string, grassy = false) {
  const layers = new THREE.Group();
  layers.userData.pick = "shrub";
  for (let layer=0;layer<2;layer++) {
    const shape = new THREE.Shape();
    const w = width * (1-layer*.16), h = height * (1-layer*.28);
    shape.moveTo(-w/2,0);
    const count = grassy ? 11 : 5;
    for(let i=0;i<count;i++) {
      const x=-w/2+w*i/count, dx=w/count;
      const y=h*(.32+.68*Math.sin(Math.PI*(i+.6)/count))*(.86+.14*Math.cos(i*4));
      if(grassy) { shape.lineTo(x+dx*(.12+.85*Math.sin(i*2)),y); shape.quadraticCurveTo(x+dx*.95,y*.64,x+dx,y*.27); }
      else shape.bezierCurveTo(x-dx*.30,y*.97,x+dx*.77,y*1.52,x+dx,y*(.66+.12*Math.cos(i)));
    }
    shape.lineTo(w/2,0); shape.closePath();
    const card=cutout(shape,layer?color:"#50683c");
    card.position.z=layer*.055; layers.add(card);
    if (!grassy && layer === 1) {
      for(let i=0;i<13;i++) {
        const x=w*(i/13-.46), stem=h*(.24+.43*Math.sin((i+1)*Math.PI/15));
        layers.add(strip([x,.02,.083],[x*1.12,stem*(.7+.14*Math.cos(i*4)),.083],.003,.008,"#627940"));
      }
    }
  }
  return score(layers,0,0,-1.04,.34,.88);
}

function clouds(width: number) {
  const group=new THREE.Group(), shape=new THREE.Shape();
  shape.moveTo(-.5,0);
  shape.bezierCurveTo(-.63,.20,-.47,.38,-.33,.29);
  shape.bezierCurveTo(-.28,.62,-.02,.57,.06,.36);
  shape.bezierCurveTo(.17,.52,.29,.45,.34,.29);
  shape.bezierCurveTo(.55,.36,.64,.11,.50,0); shape.closePath();
  group.add(cutout(shape,"#f0e9dc",.022));
  group.scale.setScalar(width); group.userData.pick="cloud";
  return score(group,0,0,-1.26,.39,.98);
}

function ground() {
  const terrain = new THREE.Group();
  // Soft contact darkening printed onto the two receiving surfaces. Sampling
  // in book space keeps the shadow attached to its page throughout the fold.
  const shade = (x: number, z: number) => 1
    - .39 * Math.exp(-((x/1.46)**2 + ((z+.37)/.51)**2) * 1.8)
    - .21 * Math.exp(-(((x+1.72)/.70)**2 + ((z-1.32)/.23)**2) * 1.6)
    - .24 * Math.exp(-(((x-2.30)/.35)**2 + ((z+.43)/.29)**2) * 1.5);
  const corners: Point[] = [[-3.38,0,-2.15],[-3.38,0,2.15],[3.38,0,2.15],[3.38,0,-2.15]];
  corners.forEach((a, i) => {
    const b = corners[(i + 1) % corners.length];
    terrain.add(sheet([a,b,[b[0],-.024,b[2]],[a[0],-.024,a[2]]],"#d5bd97",false));
  });
  const base = new THREE.PlaneGeometry(6.76,4.30,44,30);
  base.rotateX(-Math.PI/2);
  const page = new THREE.Mesh(base,stock("#e4cfac"));
  page.userData.toneAt = shade; terrain.add(page);
  const dune: Point[] = [];
  for(let i=0;i<=22;i++) {
    const x=-3.38+i*6.76/22;
    dune.push([x,.003,1.80+.15*Math.sin(x*1.2)+.05*Math.cos(x*2.6)]);
    if(i>0) {
      const prev=dune[i-1];
      terrain.add(sheet([prev,dune[i],[x,.003,2.15],[prev[0],.003,2.15]],"#e1c49a",false));
    }
  }
  const mound = new THREE.CircleGeometry(1, 48, 0, Math.PI*2);
  const pos=mound.getAttribute("position");
  for(let i=0;i<pos.count;i++) {
    const x=pos.getX(i), z=pos.getY(i);
    pos.setXYZ(i,x*(1.71+.10*Math.sin(z*4)),.016+.034*(1+Math.cos(x*4+z*6)),z*.92-.31);
  }
  mound.computeVertexNormals();
  const sand=new THREE.Mesh(mound,stock("#d9ba86"));
  sand.userData.toneAt=shade; terrain.add(sand);
  return terrain;
}

function miniatureProps() {
  const props=new THREE.Group();
  const hut=score(cabin(.56,.43,.34),0,0,-1.02,.25,.78);
  hut.position.set(2.30,.014,-.43); hut.userData.pick="house"; props.add(hut);
  const pile=new THREE.Group();
  for(let row=0;row<3;row++) for(let col=0;col<3-row%2;col++) {
    const timber=strip([-.67,0,0],[.67,0,0],.14,.045,
      ["#ba7641","#c3834e","#a66b40"][(row+col)%3],"timber");
    timber.position.set(col*.035+(row%2)*.11,row*.052+.028,col*.147+(row%2)*.06);
    timber.rotation.y=.06*Math.sin(row*4+col);
    if(row===2 && col===2) { timber.rotation.y=-.65; timber.scale.x=.50; timber.position.x=.43; }
    pile.add(timber);
  }
  pile.userData.pick="timber"; pile.position.set(-1.75,.015,1.15); pile.rotation.y=-.12;
  props.add(score(pile,0,0,-.40,.16,.76));
  return props;
}

export function arkWorkshop() {
  const group=new THREE.Group();
  group.position.y=.052;
  group.add(ground(),miniatureProps());
  const ship=ark(); ship.position.set(0,.012,-.37); group.add(ship);
  group.add(popUpSupport());
  for (const [x,z,w,h,color,grass] of [
    [-2.52,-1.48,1.30,.77,"#55763e",false], [2.23,-1.53,1.40,.72,"#426841",false],
    [-2.64,-.80,1.02,.40,"#849347",false], [2.91,-1.10,.60,.24,"#849548",true],
    [-2.48,.23,.87,.28,"#788e48",true], [1.83,1.04,.86,.26,"#788d43",true],
  ] as const) {
    const bush=shrubs(w,h,color,grass); bush.position.set(x,.015,z); group.add(bush);
  }
  for (const [x,w] of [[-2.32,1.13],[1.65,1.44]]) {
    const cloud=clouds(w); cloud.position.set(x,.54,-1.69);
    // Glued rear strut behind the shrub holds the cloud above the crown.
    const stand=new THREE.Group(); stand.position.set(x,.01,-1.69);
    stand.add(strip([0,0,0],[0,.55,0],.048,.036,"#d4c39e"));
    cloud.position.set(0,.53,0); stand.add(cloud); group.add(score(stand,0,0,-.65,.28,.76));
  }
  for(let i=0;i<5;i++){
    const stone=new THREE.Mesh(new THREE.DodecahedronGeometry(.064+(i%3)*.023),stock(i%2?"#988672":"#aaa08b"));
    stone.position.set(1.30+i*.13,.048+.011*(i%3),1.20+.05*Math.cos(i*3));
    stone.scale.y=.75; group.add(stone);
  }
  return group;
}
