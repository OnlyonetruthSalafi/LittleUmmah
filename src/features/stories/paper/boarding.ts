import * as THREE from 'three';
import { sheet, stock, type Point } from './stock';
import { lantern } from './sculptures';
import { paperAnimal } from './cutouts';
import { score } from './folds';

const cream = '#f0ddb3';
function timber(w:number,h:number,d:number,color:string,x:number,y:number,z:number) {
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),stock(color));
  mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;return mesh;
}
function line(a:Point,b:Point,width:number,color:string) {
  const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b);
  const mesh=timber(width,start.distanceTo(end),width,color,0,0,0);
  mesh.position.copy(start).add(end).multiplyScalar(.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize());return mesh;
}
function ink(shape:THREE.Shape,color='#65483d') {
  const mesh=new THREE.Mesh(new THREE.ShapeGeometry(shape,16),stock(color));
  mesh.position.z=.016;return mesh;
}
function oval(x:number,y:number,rx:number,ry:number) {
  const shape=new THREE.Shape();shape.absellipse(x,y,rx,ry,0,Math.PI*2,false,0);return shape;
}
/** Tracks printed on the ramp underneath the standing paper animals. */
function footprint(kind: 'rabbit' | 'sheep') {
  const g = new THREE.Group();
  if (kind === 'rabbit') {
    for (const side of [-1, 1]) {
      g.add(ink(oval(side * .105, .08, .046, .12)));
      g.add(ink(oval(side * .05, -.10 + side * .03, .037, .052)));
    }
  } else {
    for (const side of [-1, 1]) {
      const hoof = new THREE.Shape();
      hoof.moveTo(side * .024, -.12);
      hoof.lineTo(side * .024, .14);
      hoof.bezierCurveTo(side * .13, .14, side * .17, -.07, side * .10, -.12);
      hoof.closePath();
      g.add(ink(hoof, '#795240'));
    }
  }
  return g;
}

/** The paired cutouts are glued to the incline, so their feet follow it as the book folds. */
export function boardingPairs():THREE.Group {
  const scene=new THREE.Group(),ramp=new THREE.Group(),length=3.42;
  ramp.position.set(0,.085,1.65);ramp.rotation.x=-Math.PI/2+Math.atan(.38);
  ramp.add(sheet([[-1.65,0,0],[1.65,0,0],[1.35,length,0],[-1.35,length,0]],'#d6ad76'));
  // Printed long grain and exposed cream cut edges do not compete with the bold tracks.
  for(const x of [-1.1,-.55,0,.55,1.1]) ramp.add(line([x,0,.006],[x,length,.006],.009,'#b68553'));
  ramp.add(line([-1.65,0,.009],[-1.35,length,.009],.045,cream),line([1.65,0,.009],[1.35,length,.009],.045,cream));
  for (const [kind, distance, size] of [['rabbit', .88, .73], ['sheep', 2.61, .89]] as const) {
    for (const side of [-1, 1]) {
      for (const step of [0, 1]) {
        const print = footprint(kind);
        print.scale.setScalar(.69);
        print.position.set(side * .85 + (step ? .06 : -.06), distance + side * .13 - .66 + step * .23, .013);
        ramp.add(print);
      }
      const foot = new THREE.Group();
      foot.position.set(side * .85, distance + side * .13, .024);
      foot.rotation.x = Math.PI / 2;
      const animal = score(paperAnimal(kind), 0, 0, -.82, .20, .85);
      animal.rotation.y = .70 + side * .09;
      animal.scale.setScalar(size);
      foot.add(animal);
      ramp.add(foot);
    }
  }
  scene.add(ramp);
  const topY=.085+length*Math.sin(Math.atan(.38)),topZ=1.65-length*Math.cos(Math.atan(.38));
  // Genuine folded supports touch the page; the upper rail is only a fragment of the ship.
  for(const side of [-1,1]) {
    scene.add(sheet([[side*1.28,0,topZ],[side*1.28,topY,topZ],[side*1.55,.08,1.48]],'#ab744e'));
    scene.add(sheet([[side*1.28,0,topZ],[side*1.60,0,topZ+.30],[side*1.28,topY,topZ]],'#c69460'));
    scene.add(timber(.11,topY+.40,.13,'#926447',side*1.38,(topY+.40)/2,topZ));
    scene.add(timber(1.1,.12,.16,'#467f79',side*1.91,topY+.38,topZ));
    scene.add(timber(.09,topY+.40,.13,'#926447',side*2.43,(topY+.40)/2,topZ));
    scene.add(timber(1.1,.045,.18,cream,side*1.91,topY+.46,topZ));
    for(let i=0;i<3;i++) scene.add(timber(1.05,.17,.035,i%2?'#ad754e':'#bb8758',side*1.91,topY-.16-i*.20,topZ));
  }
  scene.add(timber(2.78,.08,.38,'#c89a63',0,topY-.035,topZ-.09));
  return scene;
}

function doorLeaf(width:number,height:number,direction:number) {
  const leaf=new THREE.Group();
  leaf.add(timber(width,height,.07,'#b77f52',direction*width/2,height/2,0));
  for(let i=1;i<6;i++) leaf.add(timber(.015,height,.01,'#8c5d3e',direction*width*i/6,height/2,.041));
  for(const y of [.24,height-.26]) leaf.add(timber(width-.10,.11,.045,'#d5b17b',direction*width/2,y,.06));
  leaf.add(line([direction*.12,.37,.074],[direction*(width-.12),height-.38,.074],.075,'#d4ac72'));
  for(const y of [.25,height-.25]) leaf.add(timber(.28,.085,.035,'#54766c',direction*.13,y,.083));
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.075,.014,5,18),stock('#765e3d'));
  ring.position.set(direction*(width-.18),height*.48,.10);leaf.add(ring);
  return leaf;
}

/** The viewer is just inside the timber threshold, looking through open leaves to water. */
export function embarkation():THREE.Group {
  const scene=new THREE.Group(),z=-.24,height=2.27,half=1.53;
  // Broad foreground floor and threshold anchor the near interior to the open paper page.
  scene.add(sheet([[-2.66,.086,1.95],[2.66,.086,1.95],[2.66,.086,z],[-2.66,.086,z]],'#c9a375'));
  for(let x=-2.27;x<2.5;x+=.38) scene.add(line([x,.095,z],[x,.095,1.95],.015,'#a77c52'));
  scene.add(timber(3.33,.13,.32,'#e0bf87',0,.08,z));
  for(const side of [-1,1]) {
    scene.add(timber(.20,height,.19,'#956442',side*half,height/2,z));
    scene.add(timber(.047,height,.035,cream,side*(half-.045),height/2,z+.115));
    // Splayed fragments of interior wall frame the view without becoming another ark.
    scene.add(sheet([[side*1.65,0,z],[side*2.53,0,z+.32],[side*2.53,1.80,z+.32],[side*1.65,2.27,z]],'#bc895d'));
    scene.add(sheet([[side*2.53,0,z+.32],[side*2.73,0,z+.64],[side*2.53,1.80,z+.32]],'#9d724f'));
    for(let y=.35;y<1.8;y+=.32) scene.add(line([side*1.68,y,z+.015],[side*2.52,y,z+.335],.016,'#d5af7c'));
  }
  scene.add(timber(3.31,.20,.23,'#a7764e',0,height,z),timber(3.40,.045,.25,cream,0,height+.12,z));
  const left=doorLeaf(1.41,2.08,1);left.position.set(-half,.13,z);left.rotation.y=1.30;scene.add(left);
  const right=doorLeaf(1.41,2.08,-1);right.position.set(half,.13,z);right.rotation.y=-1.03;scene.add(right);
  // Low, distant water ribbons preserve the open sightline through the doorway.
  for(const [x,waterZ,width] of [[-.55,-1.30,1.6],[.40,-1.76,2.0]] as const) {
    scene.add(sheet([[x-width/2,.06,waterZ],[x-width/2+.35,.11,waterZ-.12],[x+width/2,.06,waterZ-.12],[x+width/2-.3,.065,waterZ+.03]],'#b6d5c7'));
  }
  const lamp=lantern();lamp.scale.setScalar(.47);lamp.position.set(-2.05,.20,.54);scene.add(lamp);
  scene.add(timber(.67,.12,.55,'#a67a4e',-2.05,.13,.54));
  return scene;
}
