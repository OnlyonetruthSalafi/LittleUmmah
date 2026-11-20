import * as THREE from 'three';
import { sheet, stock } from './stock';
type Point = [number, number, number];
const ivory = '#f2e8d5';
function block(w: number, h: number, d: number, color: string, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),stock(color));
  m.position.set(x,y,z); m.castShadow = m.receiveShadow = true; return m;
}
function beam(a: Point, b: Point, width: number, color: string) {
  const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
  const m = block(width,start.distanceTo(end),width,color);
  m.position.copy(start).add(end).multiplyScalar(.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize()); return m;
}
function arch(x: number, bottom: number, width: number, height: number) {
  const p = new THREE.Path(), r = width/2;
  p.moveTo(x-r,bottom); p.lineTo(x-r,bottom+height-r);
  p.absarc(x,bottom+height-r,r,Math.PI,0,true); p.lineTo(x+r,bottom); p.closePath(); return p;
}
// True die cuts with visible chipboard reveal and recessed amber paper behind them.
function wall(w: number,h: number, openings: Array<[number,number,number,number]>, color: string) {
  const g = new THREE.Group(), s = new THREE.Shape();
  s.moveTo(-w/2,0); s.lineTo(w/2,0); s.lineTo(w/2,h); s.lineTo(-w/2,h); s.closePath();
  for(const o of openings) s.holes.push(arch(...o));
  const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.006,bevelEnabled:false,curveSegments:10}),[stock(color),stock(ivory)]);
  m.castShadow = m.receiveShadow = true; g.add(m);
  for(const [x,y,width,height] of openings) {
    g.add(block(width+.012,height+.012,.006,'#d8a64e',x,y+height/2,-.018));
    if(height<.2) g.add(block(.009,height-width/2,.008,ivory,x,y+(height-width/2)/2,.009));
  }
  return g;
}
function roof(w: number,d: number,base: number,rise: number,color: string) {
  const g = new THREE.Group();
  for(const side of [-1,1]) {
    g.add(sheet([[-w/2,base,side*d/2],[w/2,base,side*d/2],[w/2,base+rise,0],[-w/2,base+rise,0]],color));
    for(let row=1;row<=3;row++) {
      const t=row/4;
      g.add(beam([-w/2,base+rise*t+.003,side*d/2*(1-t)],[w/2,base+rise*t+.003,side*d/2*(1-t)],.006,'#c79864'));
    }
    for(let col=1;col<9;col++) {
      const x=-w/2+w*col/9;
      g.add(beam([x,base+.004,side*d/2],[x,base+rise+.004,0],.003,'#a7744e'));
    }
  }
  g.add(beam([-w/2-.006,base+rise+.006,0],[w/2+.006,base+rise+.006,0],.014,ivory)); return g;
}
/** Original folded-card ark; long axis X, bow and boarding ramp face +X. */
export function ark(frame=false,openDoor=false): THREE.Group {
  const g=new THREE.Group(), xs=[-.5,-.39,-.22,.22,.39,.5], widths=[.012,.145,.195,.195,.145,.012];
  const ring=(i:number,level:number,side:number):Point => {
    const t=level/4; return [xs[i]*(.86+.14*t),.018+t*.225+Math.abs(xs[i])**4*1.8,side*widths[i]*(.08+.92*Math.sin(t*Math.PI/2))];
  };
  const colors=['#79513c','#986b4c','#b3875e','#a47651'];
  for(const side of [-1,1]) {
    for(let i=0;i<xs.length-1;i++) for(let level=0;level<4;level++) {
      if(frame&&level>0) continue;
      const a=ring(i,level,side),b=ring(i+1,level,side),c=ring(i+1,level+1,side),d=ring(i,level+1,side);
      g.add(sheet([a,b,c],colors[level],false),sheet([a,c,d],colors[level],false));
      g.add(beam(d,c,.004,level===3?ivory:'#dfbc85'));
    }
    for(let i=1;i<xs.length-1;i++) for(let level=0;level<4;level++) g.add(beam(ring(i,level,side),ring(i,level+1,side),frame?.013:.006,frame?ivory:'#d6b582'));
  }
  for(let i=0;i<xs.length-1;i++){const a=ring(i,0,1),b=ring(i+1,0,1);g.add(beam([a[0],a[1],0],[b[0],b[1],0],.012,ivory));}
  if(frame) return g;
  const deck:Point[]=xs.map((x,i)=>[x,.247,widths[i]]);
  deck.push(...xs.map((x,i):Point=>[x,.247,-widths[i]]).reverse()); g.add(sheet(deck,'#ead6ad'));
  for(let z=-.15;z<.16;z+=.035) g.add(beam([-.36,.251,z],[.36,.251,z],.002,'#c5aa7a'));
  for(const side of [-1,1]) {
    const sideWall=wall(.43,.16,[[-.14,.045,.052,.078],[0,.045,.052,.078],[.14,.045,.052,.078]],'#d6ac72');
    sideWall.position.set(0,.25,side*.125); if(side<0) sideWall.rotation.y=Math.PI; g.add(sideWall);
    const end=wall(.25,.16,[[0,.005,.082,.145]],'#e9d4ac');
    end.rotation.y=side*Math.PI/2; end.position.set(side*.215,.25,0); g.add(end);
    g.add(sheet([[side*.215,.41,-.125],[side*.215,.41,.125],[side*.215,.49,0]],'#717f70'));
  }
  g.add(roof(.51,.31,.405,.09,'#a96d52'));
  for(const side of [-1,1]) {
    for(let i=0;i<xs.length-1;i++){const a=ring(i,4,side),b=ring(i+1,4,side);g.add(beam([a[0],a[1]+.035,a[2]],[b[0],b[1]+.035,b[2]],.014,'#646e57'));}
    for(let i=1;i<xs.length-1;i++){const a=ring(i,4,side);g.add(beam(a,[a[0],a[1]+.035,a[2]],.009,ivory));}
  }
  if(openDoor) g.add(sheet([[.22,.257,-.047],[.45,.08,-.047],[.45,.08,.047],[.22,.257,.047]],'#b88956'));
  return g;
}
export function cottage():THREE.Group {
  const g=new THREE.Group();
  for(const side of [-1,1]) {
    const front=wall(.78,.56,[[0,.01,.19,.37],[-.255,.24,.1,.15],[.255,.24,.1,.15]],'#e7d4ac');
    front.position.z=side*.29; if(side<0) front.rotation.y=Math.PI; g.add(front);
    g.add(sheet([[side*.39,0,-.29],[side*.39,0,.29],[side*.39,.56,.29],[side*.39,.79,0],[side*.39,.56,-.29]],'#d4bd90'));
  }
  g.add(roof(.94,.73,.55,.26,'#b18065'),block(.84,.035,.64,ivory,0,.018),block(.25,.025,.15,'#cbb58c',0,.0125,.34)); return g;
}
export function lantern():THREE.Group {
  const g=new THREE.Group(), radius=.34;
  for(let i=0;i<6;i++) {
    const angle=i*Math.PI*2/6,next=(i+1)*Math.PI*2/6;
    const a:Point=[Math.cos(angle)*radius,.15,Math.sin(angle)*radius],b:Point=[Math.cos(next)*radius,.15,Math.sin(next)*radius];
    g.add(sheet([a,b,[b[0],.78,b[2]],[a[0],.78,a[2]]],i%2?'#eacb81':'#ffe7aa'));
    g.add(beam(a,[a[0],.8,a[2]],.027,'#947146'));
    g.add(sheet([[a[0],.79,a[2]],[b[0],.79,b[2]],[0,1.02,0]],'#b18951'));
    g.add(sheet([a,b,[b[0]*.72,0,b[2]*.72],[a[0]*.72,0,a[2]*.72]],'#a77d43'));
  }
  const handle=new THREE.Mesh(new THREE.TorusGeometry(.085,.013,4,20),stock('#937447'));
  handle.position.y=1.075; g.add(handle); return g;
}
export function mountain():THREE.Group {
  const g=new THREE.Group();
  const base:Point[]=[[-.5,0,-.2],[-.2,0,-.38],[.3,0,-.28],[.5,0,.12],[.18,0,.38],[-.38,0,.3]], peak:Point=[.035,.94,-.02];
  const colors=['#9da594','#b2b39d','#cbc5ad','#929c89','#808f82','#acaf98'];
  for(let i=0;i<base.length;i++) {
    g.add(sheet([base[i],base[(i+1)%base.length],peak],colors[i]));
    const a=new THREE.Vector3(...base[i]).lerp(new THREE.Vector3(...peak),.74),b=new THREE.Vector3(...base[(i+1)%base.length]).lerp(new THREE.Vector3(...peak),i%2?.79:.71);
    g.add(sheet([[a.x,a.y+.004,a.z],[b.x,b.y+.004,b.z],[peak[0],peak[1]+.004,peak[2]]],'#f6ecd4'));
  } return g;
}
/** Split every printed triangle at the center score before bending the card. */
function foldedPrint(shape: THREE.Shape, color: string, offset = 0, scale = 1) {
  const geometry = new THREE.ShapeGeometry(shape, 28).toNonIndexed();
  const input = geometry.getAttribute('position');
  const vertices: number[] = [];
  for(let i=0;i<input.count;i+=3) {
    const triangle = [0,1,2].map(j=>new THREE.Vector2(input.getX(i+j)*scale,input.getY(i+j)*scale));
    for(const sign of [-1,1]) {
      const polygon: THREE.Vector2[] = [];
      for(let j=0;j<3;j++) {
        const a=triangle[j],b=triangle[(j+1)%3],inside=a.x*sign>=0,next=b.x*sign>=0;
        if(inside) polygon.push(a);
        if(inside!==next) polygon.push(a.clone().lerp(b,-a.x/(b.x-a.x)));
      }
      for(let j=1;j<polygon.length-1;j++) for(const p of [polygon[0],polygon[j],polygon[j+1]]) vertices.push(p.x,p.y,-Math.abs(p.x)*.38+offset);
    }
  }
  geometry.dispose();
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(vertices.flatMap((_,i)=>i%3===0?[vertices[i],vertices[i+1]]:[]),2));
  geo.computeVertexNormals();const m=new THREE.Mesh(geo,stock(color));m.castShadow=m.receiveShadow=true;return m;
}
/** An illustrated curling crest, cream die-cut border and a real V-fold foot. */
export function wave():THREE.Group {
  const g=new THREE.Group(),outline=new THREE.Shape();
  outline.moveTo(-.5,.018);outline.bezierCurveTo(-.35,.08,-.27,.12,-.16,.25);
  outline.bezierCurveTo(-.04,.42,.15,.48,.29,.39);
  outline.bezierCurveTo(.39,.32,.34,.23,.25,.23);
  outline.bezierCurveTo(.30,.29,.25,.34,.18,.32);
  outline.bezierCurveTo(.02,.26,.17,.07,.50,.018);
  outline.lineTo(-.5,.018);outline.closePath();
  g.add(foldedPrint(outline,ivory),foldedPrint(outline,'#526f93',.006,.955),foldedPrint(outline,'#526f93',-.006,.955));
  const foam=new THREE.Shape();foam.moveTo(-.17,.265);
  foam.bezierCurveTo(-.04,.425,.16,.447,.278,.378);
  foam.bezierCurveTo(.355,.327,.32,.269,.273,.263);
  foam.bezierCurveTo(.305,.323,.24,.37,.166,.348);
  foam.bezierCurveTo(.025,.32,-.015,.291,-.17,.265);foam.closePath();
  const stroke=new THREE.Shape();stroke.moveTo(-.37,.065);
  stroke.bezierCurveTo(-.18,.10,-.07,.24,.035,.28);
  stroke.bezierCurveTo(-.02,.14,.19,.057,.36,.04);
  stroke.bezierCurveTo(.10,.075,-.12,.08,-.37,.065);stroke.closePath();
  for(const face of [-1,1]) {
    g.add(foldedPrint(foam,ivory,face*.012));
    g.add(foldedPrint(stroke,'#9eb5c7',face*.013));
  }
  for(const side of [-1,1]) {
    g.add(sheet([[0,.018,0],[side*.5,.018,-.19],[side*.5,0,-.32],[0,.05,-.12]],'#829daf'));
    g.add(sheet([[0,.05,-.12],[side*.5,0,-.32],[side*.5,0,-.39],[0,0,-.20]],'#b6c4cd'));
  }
  return g;
}
export function palm():THREE.Group {
  const g=new THREE.Group(),trunk=new THREE.Mesh(new THREE.CylinderGeometry(.029,.052,.76,6),stock('#b59665'));
  trunk.position.y=.38; trunk.castShadow=true; g.add(trunk);
  for(let i=1;i<10;i++) {
    const band=new THREE.Mesh(new THREE.CylinderGeometry(.053-i*.0024,.053-i*.0024,.011,6),stock('#dcc39a')); band.position.y=i*.072;g.add(band);
  }
  for(let i=0;i<7;i++) {
    const leaf=new THREE.Group(),root:Point=[0,.76,0],tip:Point=[.48,.64+(i%2)*.07,0],fold:Point=[.22,.87,0];
    // Four planar facets make the leaf fold visibly along its raised central vein.
    leaf.add(sheet([root,[.18,.83,-.085],fold],'#788b65'),sheet([[.18,.83,-.085],tip,fold],'#788b65'));
    leaf.add(sheet([root,fold,[.18,.83,.085]],'#a4b18a'),sheet([fold,tip,[.18,.83,.085]],'#a4b18a'));
    leaf.add(beam(root,fold,.005,'#d6d3a0'),beam(fold,tip,.004,'#d6d3a0'));leaf.rotation.y=i*Math.PI*2/7;g.add(leaf);
  }return g;
}
