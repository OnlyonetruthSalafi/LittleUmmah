import * as THREE from "three";
import { sheet, stock } from "./stock";

// The front and back are a single unprinted sheet. Only the cut edge shows the paper core.
function cutCard(outline: THREE.Shape, color: string) {
  const geometry = new THREE.ExtrudeGeometry(outline, { depth: .024, bevelEnabled: false, curveSegments: 10 });
  return new THREE.Mesh(geometry, [stock(color), stock("#dfcba6")]);
}

type PersonStock = { color: string; shoulder: number; hem: number; height: number };

export function paperPerson({ color, shoulder, hem, height }: PersonStock) {
  const silhouette = new THREE.Shape();
  silhouette.moveTo(-hem, 0);
  silhouette.lineTo(-shoulder, .63);
  silhouette.quadraticCurveTo(-shoulder, .73, -.058, .76);
  silhouette.lineTo(-.058, .80);
  silhouette.bezierCurveTo(-.21, .88, -.14, 1.09, 0, 1.09);
  silhouette.bezierCurveTo(.14, 1.09, .21, .88, .058, .80);
  silhouette.lineTo(.058, .76);
  silhouette.quadraticCurveTo(shoulder, .73, shoulder, .63);
  silhouette.lineTo(hem, 0);
  silhouette.closePath();
  const person = new THREE.Group();
  const cutout = cutCard(silhouette, color);
  cutout.scale.y = height;
  person.add(cutout);
  // A short triangular easel and its glue tab stay below the blank head.
  person.add(sheet([[0, 0, 0], [0, .43, 0], [0, 0, -.24]], color));
  person.add(sheet([[-.12, .002, -.24], [.12, .002, -.24], [.12, .002, .07], [-.12, .002, .07]], color));
  return person;
}

export type PaperAnimal = "rabbit" | "sheep";

export function paperAnimal(kind: PaperAnimal) {
  const shape = new THREE.Shape();
  if (kind === "rabbit") {
    // Crouched haunch, bobtail and two long ears, all on the outer cut line.
    shape.moveTo(-.42, 0);
    shape.quadraticCurveTo(-.49, .05, -.43, .15);
    shape.bezierCurveTo(-.64, .15, -.62, .37, -.43, .33);
    shape.bezierCurveTo(-.39, .62, -.08, .66, .09, .45);
    shape.quadraticCurveTo(.13, .57, .18, .60);
    shape.bezierCurveTo(.03, 1.02, .12, 1.22, .29, .69);
    shape.bezierCurveTo(.30, 1.24, .51, 1.18, .42, .65);
    shape.bezierCurveTo(.69, .52, .56, .28, .34, .29);
    shape.lineTo(.29, .10);
    shape.quadraticCurveTo(.51, .08, .45, 0);
    shape.lineTo(.16, 0);
    shape.lineTo(.10, .07);
    shape.quadraticCurveTo(.13, 0, .05, 0);
  } else {
    // A scalloped fleece, four legs and a smooth oval head.
    shape.moveTo(-.48, 0);
    shape.lineTo(-.47, .30);
    shape.bezierCurveTo(-.72, .33, -.75, .54, -.59, .54);
    shape.quadraticCurveTo(-.65, .78, -.45, .78);
    shape.quadraticCurveTo(-.41, .97, -.21, .87);
    shape.quadraticCurveTo(-.05, 1.06, .10, .89);
    shape.quadraticCurveTo(.29, 1.01, .41, .83);
    shape.bezierCurveTo(.50, .92, .77, .84, .73, .62);
    shape.bezierCurveTo(.70, .43, .52, .44, .43, .53);
    shape.lineTo(.47, .03); shape.lineTo(.36, .03); shape.lineTo(.28, .29);
    shape.lineTo(.25, 0); shape.lineTo(.12, 0); shape.lineTo(.13, .29);
    shape.quadraticCurveTo(-.04, .20, -.16, .29);
    shape.lineTo(-.15, .04); shape.lineTo(-.26, .04); shape.lineTo(-.31, .28);
    shape.lineTo(-.35, 0);
  }
  shape.closePath();
  const color = kind === "rabbit" ? "#b86849" : "#9daec0";
  const animal = new THREE.Group();
  animal.add(cutCard(shape, color));
  animal.add(sheet([[-.22, 0, 0], [-.22, .46, 0], [-.22, 0, -.22]], color));
  animal.add(sheet([[-.33, .002, -.22], [-.10, .002, -.22], [-.10, .002, .04], [-.33, .002, .04]], color));
  return animal;
}
