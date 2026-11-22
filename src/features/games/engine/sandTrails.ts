type Point = { x: number; y: number };
function position(level: number, t: number): Point {
  if (level === 3) {
    const angle = t * Math.PI * 3.25;
    return { x: 480 + (288 - 258*t)*Math.cos(angle), y: 242 + (138 - 119*t)*Math.sin(angle) };
  }
  return { x: 165 + 620*t, y: 235 + Math.sin(t*Math.PI*(level===1?2:4))*(level===1?65:89) };
}
// Equal spacing keeps the tracing tolerance consistent around tight curves.
export function sandTrail(level: number): Point[] {
  const points = [position(level,0)];
  for (let i=1;i<900;i++) {
    const p=position(level,i/900), last=points[points.length-1];
    if (Math.hypot(p.x-last.x,p.y-last.y)>=6) points.push(p);
  }
  return [...points,position(level,1)];
}
export function traceTo(path: Point[], index: number, from: Point, to: Point) {
  const distance=Math.hypot(to.x-from.x,to.y-from.y);
  const steps=Math.max(1,Math.ceil(distance/6));
  for(let i=1;i<=steps;i++) {
    const x=from.x+(to.x-from.x)*i/steps, y=from.y+(to.y-from.y)*i/steps;
    const near=(j:number)=>Math.hypot(path[j].x-x,path[j].y-y);
    if(near(index)>38) return {index,off:true};
    while(index+1<path.length && near(index+1)<=near(index)) index++;
    if(index===path.length-2 && near(index+1)<8) index++;
  }
  return {index,off:false};
}
