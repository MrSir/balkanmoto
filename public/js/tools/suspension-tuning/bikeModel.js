// Builds the bike meshes and poses them from the simulation state.
//
// Hierarchy:
//   chassis (positioned at the CG, rotated by pitch, offset laterally per bike)
//     body  (offset so its origin is the reference rear axle — matches physics body frame)
//       label sprite
//       frame (dark grey; rebuilt when the rear tire changes — pivot plates follow its width):
//         head tube, stem, spars, down tubes, pivot plates, cross-members, subframe
//       front (rebuilt when the front tire changes — leg spacing follows its width)
//         top and bottom yokes (aluminium)
//         handlebar risers, handlebar and grips (fixed to the chassis — no steering)
//         forkOuter (slides along the fork axis with fork height)
//           outer fork tubes
//         slider (positioned at the front axle, rotated to the fork axis)
//           front wheel (tire, rim, hub, spokes), axle, stanchions
//       rear (positioned at the swingarm pivot — linkage "pivot frame")
//         swingarm (rotated by the swingarm angle; rebuilt when the rear tire changes):
//           pivot bolt, prisms, rear wheel, rear axle
//         rocker (rotated about its frame pivot)
//         dog-bones, shock body, shock shaft (re-posed every frame)

import * as THREE from 'three';
import { GEOMETRY, REAR, FRAME, WHEEL } from './config.js';
import { frontAxleBody, tripleTreeBody, steeringHeadBody, RAKE_RAD, FORK_AXIS, PIVOT_BODY, HC } from './physics.js';
import { tireProfile, rimProfile } from './tire.js';

const MATERIALS = {
  tire: new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.85 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xd4a017, metalness: 0.8, roughness: 0.3 }),
  silver: new THREE.MeshStandardMaterial({ color: 0xd0d4d8, metalness: 0.9, roughness: 0.2 }),
  frame: new THREE.MeshStandardMaterial({ color: 0x2a2a2c, metalness: 0.5, roughness: 0.45 }),
  hub: new THREE.MeshStandardMaterial({ color: 0x3a3d42, metalness: 0.6, roughness: 0.4 }),
  aluminium: new THREE.MeshStandardMaterial({ color: 0xb4bac1, metalness: 0.7, roughness: 0.45 }),
  grip: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 }),
};

function shadowed(mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** Tire lathed from its cross-section; `size` from tireSize(). */
function makeTire(size) {
  const points = tireProfile(size).map((p) => new THREE.Vector2(p.r, p.z));
  const tire = shadowed(new THREE.Mesh(new THREE.LatheGeometry(points, 96), MATERIALS.tire));
  tire.rotation.x = Math.PI / 2; // lathe axis (y) → axle (z)
  return tire;
}

/**
 * Spoked wheel centred on the axle (z lateral): tire, rim (in `rimMaterial`) sized to its beads, hub reaching
 * `hubHalf` either side, and tangentially laced spokes from the two hub flanges to the rim.
 */
function makeWheel(size, hubHalf, rimMaterial) {
  const w = WHEEL;
  const wheel = new THREE.Group();
  wheel.add(makeTire(size));
  const points = rimProfile(size).map((p) => new THREE.Vector2(p.r, p.z));
  const rim = shadowed(new THREE.Mesh(new THREE.LatheGeometry(points, 96), rimMaterial));
  rim.rotation.x = Math.PI / 2;
  wheel.add(rim);

  const z = (v) => new THREE.Vector3(0, 0, v);
  const flangeZ = hubHalf - w.hubFlangeInset;
  wheel.add(cylinder3(z(-hubHalf), z(hubHalf), w.hubRadius, MATERIALS.hub));
  for (const side of [-1, 1]) {
    const t = side * w.hubFlangeThickness / 2;
    wheel.add(cylinder3(z(side * flangeZ - t), z(side * flangeZ + t), w.hubFlangeRadius, MATERIALS.hub));
  }

  // Rim holes are evenly spaced, alternating flanges. On each flange, alternate spokes lead
  // and trail: each hub hole sits `cross` spoke spaces (per flange) round from its rim hole.
  const holeRadius = w.hubFlangeRadius - 0.008;
  const bedRadius = size.rimRadius - w.rimDepth;
  const lead = (w.cross * 4 * Math.PI) / w.spokes;
  for (let i = 0; i < w.spokes; i++) {
    const side = i % 2 ? 1 : -1;
    const alpha = (i * 2 * Math.PI) / w.spokes;
    const phi = alpha + (Math.floor(i / 2) % 2 ? lead : -lead);
    const hub = new THREE.Vector3(holeRadius * Math.cos(phi), holeRadius * Math.sin(phi), side * flangeZ);
    const nipple = new THREE.Vector3(bedRadius * Math.cos(alpha), bedRadius * Math.sin(alpha), side * 0.002);
    wheel.add(cylinder3(hub, nipple, w.spokeRadius, MATERIALS.silver, 6));
  }
  return wheel;
}

/** Lateral offset of each fork leg / swingarm prism centre so it clears a tire of `width`. */
const forkHalfSpacing = (width) => width / 2 + GEOMETRY.tireClearance + GEOMETRY.outerTubeRadius;
const swingarmHalfSpacing = (width) => width / 2 + GEOMETRY.tireClearance + REAR.swingarmWidth / 2;
/** Lateral position of each pivot plate's centre, just outside the swingarm prisms. */
const plateHalfSpacing = (width) =>
  swingarmHalfSpacing(width) + REAR.swingarmWidth / 2 + FRAME.plateGap + FRAME.plateThickness / 2;

/** Remove `group` from its parent and free its geometries (materials are shared). */
function discard(group) {
  if (!group) return;
  group.removeFromParent();
  group.traverse((o) => o.geometry?.dispose());
}

function makeAxle(length, radius = 0.012) {
  const axle = shadowed(new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, length, 12),
    MATERIALS.silver,
  ));
  axle.rotation.x = Math.PI / 2;
  return axle;
}

/** Orient a y-axis-aligned mesh so it runs from p1 to p2 (2D points in the XY plane). */
function placeBetween(mesh, p1, p2) {
  const dx = p2.x - p1.x, dy = p2.y - p1.y;
  mesh.position.set((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, mesh.position.z);
  mesh.rotation.z = Math.atan2(-dx, dy);
  return mesh;
}

/** Cylinder whose axis runs from p1 to p2 (2D points in the XY plane) at depth z. */
function cylinderBetween(p1, p2, radius, z, material) {
  const mesh = shadowed(new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, Math.hypot(p2.x - p1.x, p2.y - p1.y), 24),
    material,
  ));
  mesh.position.z = z;
  return placeBetween(mesh, p1, p2);
}

/** Rectangular prism running from p1 to p2 at depth z (thickness in-plane, width across). */
function boxBetween(p1, p2, thickness, width, z, material) {
  const mesh = shadowed(new THREE.Mesh(
    new THREE.BoxGeometry(thickness, Math.hypot(p2.x - p1.x, p2.y - p1.y), width),
    material,
  ));
  mesh.position.z = z;
  return placeBetween(mesh, p1, p2);
}

/** Tube along `curve` whose radius follows `radiusAt(z)` (z = lateral position of the centreline). */
function taperedTube(curve, radiusAt, tubular = 96, radial = 16) {
  const r0 = 1;
  const geometry = new THREE.TubeGeometry(curve, tubular, r0, radial, false);
  // TubeGeometry lays its vertices out ring by ring; scale each ring about its centre point.
  const pos = geometry.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i <= tubular; i++) {
    const c = curve.getPointAt(i / tubular);
    const k = radiusAt(c.z) / r0;
    for (let j = 0; j <= radial; j++) {
      const n = i * (radial + 1) + j;
      v.fromBufferAttribute(pos, n).sub(c).multiplyScalar(k).add(c);
      pos.setXYZ(n, v.x, v.y, v.z);
    }
  }
  return geometry;
}

/** Cylinder from p1 to p2 (Vector3s). */
function cylinder3(p1, p2, radius, material, radial = 24) {
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const mesh = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, dir.length(), radial), material));
  mesh.position.addVectors(p1, p2).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return mesh;
}

/**
 * Path through `points` (Vector3s) made of straight runs, each corner rounded by a quadratic
 * starting `fillet` before the corner and ending `fillet` after it.
 */
function filletedPath(points, fillet) {
  const path = new THREE.CurvePath();
  let from = points[0];
  for (let i = 1; i < points.length - 1; i++) {
    const corner = points[i];
    const a = corner.clone().addScaledVector(new THREE.Vector3().subVectors(from, corner).normalize(), fillet);
    const b = corner.clone().addScaledVector(new THREE.Vector3().subVectors(points[i + 1], corner).normalize(), fillet);
    path.add(new THREE.LineCurve3(from, a));
    path.add(new THREE.QuadraticBezierCurve3(a, corner, b));
    from = b;
  }
  path.add(new THREE.LineCurve3(from, points[points.length - 1]));
  return path;
}

/** Round tube along `curve`, both ends closed with flat caps. */
function cappedTube(curve, radius, material, tubular = 64) {
  const group = new THREE.Group();
  group.add(shadowed(new THREE.Mesh(new THREE.TubeGeometry(curve, tubular, radius, 16, false), material)));
  for (const [u, outward] of [[0, -1], [1, 1]]) {
    const cap = shadowed(new THREE.Mesh(new THREE.CircleGeometry(radius, 16), material));
    cap.position.copy(curve.getPointAt(u));
    cap.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), curve.getTangentAt(u).multiplyScalar(outward));
    group.add(cap);
  }
  return group;
}

/** Point on `curve` nearest to `target` (sampled). */
function nearestOn(curve, target, samples = 400) {
  let best = null, bestDistance = Infinity;
  for (let i = 0; i <= samples; i++) {
    const p = curve.getPointAt(i / samples);
    const d = p.distanceToSquared(target);
    if (d < bestDistance) [best, bestDistance] = [p, d];
  }
  return best;
}

/**
 * Outline of a yoke plate seen along the fork axis: a boss of radius `r` round each circle
 * centre, joined by slightly concave sides. Circles must be listed counter-clockwise.
 */
function yokeOutline(circles, sag = 0.006) {
  const shape = new THREE.Shape();
  const n = circles.length;
  // External tangent between consecutive circles (outward = right of the c1 → c2 direction).
  const tangents = circles.map((c1, i) => {
    const c2 = circles[(i + 1) % n];
    const dx = c2.x - c1.x, dy = c2.y - c1.y;
    const d = Math.hypot(dx, dy);
    const ux = dx / d, uy = dy / d;
    const sin = (c1.r - c2.r) / d, cos = Math.sqrt(1 - sin * sin);
    const nx = ux * sin + uy * cos, ny = uy * sin - ux * cos;
    const p1 = { x: c1.x + c1.r * nx, y: c1.y + c1.r * ny };
    const p2 = { x: c2.x + c2.r * nx, y: c2.y + c2.r * ny };
    // A quadratic's midpoint sits halfway to its control point, so pull it in by 2 × sag.
    const control = { x: (p1.x + p2.x) / 2 - 2 * sag * nx, y: (p1.y + p2.y) / 2 - 2 * sag * ny };
    return { angle: Math.atan2(ny, nx), p2, control };
  });
  shape.moveTo(tangents[n - 1].p2.x, tangents[n - 1].p2.y);
  circles.forEach((c, i) => {
    const t = tangents[i];
    // Round the boss from the incoming side's tangent to the outgoing one, then the side.
    shape.absarc(c.x, c.y, c.r, tangents[(i + n - 1) % n].angle, t.angle, false);
    shape.quadraticCurveTo(t.control.x, t.control.y, t.p2.x, t.p2.y);
  });
  return shape;
}

/** Floating label: a disc in the bike's colour with a white letter. */
function makeLabel(text, color) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(64, 64, 60, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 80px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 64, 70);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
  sprite.scale.set(0.18, 0.18, 1);
  return sprite;
}

export class BikeModel {
  constructor(scene, { offsetZ = 0, color = '#33383f', label } = {}) {
    this.offsetZ = offsetZ;
    this.rimMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0.6, roughness: 0.4, side: THREE.DoubleSide });
    this.chassis = new THREE.Group();
    this.body = new THREE.Group();
    this.chassis.add(this.body);
    scene.add(this.chassis);

    this.buildRear();
    this.tireKeys = { front: null, rear: null }; // wheels and frame are built on the first update()

    if (label) {
      const sprite = makeLabel(label, color);
      const tree = tripleTreeBody();
      sprite.position.set(tree.x, tree.y + 0.4, 0);
      this.body.add(sprite);
    }
  }

  /** Frame built round the fixed hard points; the pivot plates sit just outside the swingarm. */
  buildFrame(rearTire) {
    const g = GEOMETRY, f = FRAME, lk = REAR.linkage;
    discard(this.frame);
    this.frame = new THREE.Group();
    this.body.add(this.frame);
    const add = (mesh) => this.frame.add(mesh);

    // Points down the steering axis from the top yoke's centre.
    const head = steeringHeadBody();
    const down = (d) => ({ x: head.x - d * FORK_AXIS.x, y: head.y - d * FORK_AXIS.y });
    // Stem a little past the top face of the top yoke and the bottom face of the bottom yoke
    // (no coplanar faces); head tube centred in the gap between the yokes.
    const t = g.tripleTreeThickness;
    add(cylinderBetween(down(g.yokeSpacing + t / 2 + g.stemOvershoot), down(-t / 2 - g.stemOvershoot),
      g.stemRadius, 0, MATERIALS.aluminium));
    const mid = g.yokeSpacing / 2;
    add(cylinderBetween(down(mid + g.headTubeLength / 2), down(mid - g.headTubeLength / 2),
      g.headTubeRadius, 0, MATERIALS.frame));

    // Tube centrelines, built in dependency order so `on` points can snap to their host.
    const plateZ = plateHalfSpacing(rearTire.width);
    const curves = { [-1]: {}, [1]: {} };
    const radii = { spar: f.mainTubeRadius, downTube: f.mainTubeRadius, seatRail: f.subTubeRadius };
    const raw = (p, side, radius) => {
      const q = p.head !== undefined ? down(p.head) : p;
      const z = p.plate ? plateZ + f.plateThickness / 2 - radius : p.z;
      return new THREE.Vector3(q.x, q.y, side * z);
    };
    // Points of one tube; an `on` end is moved onto its host's centreline, then pushed further
    // in along the tube when the tube is thinner than the host (as far as it stays hidden).
    const points = (list, side, radius, neighbour = (i) => raw(list[i === 0 ? 1 : i - 1], side, radius)) =>
      list.map((p, i) => {
        if (!p.on) return raw(p, side, radius);
        const hostRadius = radii[p.on];
        const end = nearestOn(curves[side][p.on], raw(p, side, radius));
        const push = 0.8 * Math.sqrt(Math.max(hostRadius ** 2 - radius ** 2, 0));
        return end.addScaledVector(new THREE.Vector3().subVectors(end, neighbour(i)).normalize(), push);
      });
    const spline = (list, side, radius) =>
      new THREE.CatmullRomCurve3(points(list, side, radius), false, 'centripetal');
    const tube = (curve, radius, tubular) => add(cappedTube(curve, radius, MATERIALS.frame, tubular));

    for (const side of [-1, 1]) {
      const c = curves[side];
      c.spar = spline(f.spar, side, f.mainTubeRadius);
      c.downTube = spline(f.downTube, side, f.mainTubeRadius);
      tube(c.spar, f.mainTubeRadius);
      tube(c.downTube, f.mainTubeRadius);
      tube(spline(f.brace, side, f.mainTubeRadius), f.mainTubeRadius);

      // Pivot plate: extruded side-view outline, centred on its lateral position.
      const plate = new THREE.ExtrudeGeometry(yokeOutline(f.plateOutline, f.plateSag),
        { depth: f.plateThickness, bevelEnabled: false, curveSegments: 24 });
      plate.translate(0, 0, side * plateZ - f.plateThickness / 2);
      add(shadowed(new THREE.Mesh(plate, MATERIALS.frame)));
    }

    // Subframe: one U-shaped bent tube (left rail → tail → right rail), then the struts.
    const rail = (side) => points(f.seatRail, side, f.subTubeRadius);
    const seatRail = filletedPath([...rail(-1), ...rail(1).reverse()], f.railBend);
    tube(seatRail, f.subTubeRadius, 240);
    for (const side of [-1, 1]) {
      curves[side].seatRail = seatRail;
      tube(spline(f.strut, side, f.subTubeRadius), f.subTubeRadius);
    }

    // Cross-members carrying the shock top mount and the rocker pivot (ends inside the
    // plates), and one across the cradle between the down tubes' centrelines.
    const toBody = (p) => ({ x: p.x + PIVOT_BODY.x, y: p.y + PIVOT_BODY.y });
    for (const p of [toBody(lk.shockTop), toBody(lk.rockerPivot)]) {
      add(cylinder3(new THREE.Vector3(p.x, p.y, -plateZ), new THREE.Vector3(p.x, p.y, plateZ), f.crossTubeRadius, MATERIALS.frame));
    }
    const cradle = (side) => points([f.cradleCross], side, f.mainTubeRadius,
      () => raw(f.cradleCross, -side, f.mainTubeRadius))[0];
    add(cylinder3(cradle(-1), cradle(1), f.mainTubeRadius, MATERIALS.frame));
  }

  buildFront(tireSize) {
    const g = GEOMETRY;
    const tree = tripleTreeBody();
    const spacing = forkHalfSpacing(tireSize.width);
    discard(this.front);
    this.front = new THREE.Group();
    this.body.add(this.front);

    // Outer tubes: at fork height 0 their tops sit flush with the top of the triple tree.
    // The group slides along the fork axis by the fork height.
    this.forkOuter = new THREE.Group();
    this.front.add(this.forkOuter);
    const top = {
      x: tree.x + (g.tripleTreeThickness / 2) * FORK_AXIS.x,
      y: tree.y + (g.tripleTreeThickness / 2) * FORK_AXIS.y,
    };
    const bottom = {
      x: top.x - g.outerTubeLength * FORK_AXIS.x,
      y: top.y - g.outerTubeLength * FORK_AXIS.y,
    };
    for (const side of [-1, 1]) {
      this.forkOuter.add(cylinderBetween(bottom, top, g.outerTubeRadius, side * spacing, MATERIALS.gold));
    }

    // Top and bottom yokes. Each yoke's local frame: origin on the steering axis at the yoke's
    // centre, +y up the fork axis, +x forward toward the fork legs (offset ahead), z lateral.
    // The bottom one sits yokeSpacing further down the fork axis.
    const head = steeringHeadBody();
    const offset = Math.hypot(tree.x - head.x, tree.y - head.y);
    const t = g.tripleTreeThickness;
    const forkBoss = g.outerTubeRadius + g.clampWall;
    const stemBoss = g.stemBossRadius;
    const plate = new THREE.ExtrudeGeometry(yokeOutline([
      { x: 0, y: 0, r: stemBoss },
      { x: offset, y: -spacing, r: forkBoss },
      { x: offset, y: spacing, r: forkBoss },
    ]), { depth: g.yokePlateThickness, bevelEnabled: false, curveSegments: 24 });
    // Outline x → local x, outline y → z, extrusion → +y, with the top face flush at t / 2.
    plate.rotateX(-Math.PI / 2);
    plate.translate(0, t / 2 - g.yokePlateThickness, 0);
    // Clamp ring along local y with its top face flush with the plate's.
    const ring = (radius, height, x, z) => {
      const mesh = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 32), MATERIALS.aluminium));
      mesh.position.set(x, t / 2 - height / 2, z);
      return mesh;
    };
    for (const [down, clampHeight] of [[0, t], [g.yokeSpacing, g.bottomClampHeight]]) {
      const yoke = new THREE.Group();
      yoke.position.set(head.x - down * FORK_AXIS.x, head.y - down * FORK_AXIS.y, 0);
      yoke.rotation.z = RAKE_RAD;
      yoke.add(shadowed(new THREE.Mesh(plate, MATERIALS.aluminium)));
      yoke.add(ring(stemBoss, t, 0, 0));
      for (const side of [-1, 1]) yoke.add(ring(forkBoss, clampHeight, offset, side * spacing));
      this.front.add(yoke);
    }
    this.buildCockpit(offset, spacing);

    // The slider group's local +y is the fork axis, origin at the front axle.
    this.slider = new THREE.Group();
    this.slider.rotation.z = RAKE_RAD;
    this.front.add(this.slider);

    this.slider.add(makeWheel(tireSize, spacing - g.stanchionRadius - WHEEL.hubClearance, this.rimMaterial));
    this.slider.add(makeAxle(2 * spacing + 0.04));

    for (const side of [-1, 1]) {
      this.slider.add(cylinderBetween(
        { x: 0, y: 0 }, { x: 0, y: g.stanchionLength },
        g.stanchionRadius, side * spacing, MATERIALS.silver,
      ));
    }
  }

  /**
   * Handlebar risers on the top yoke, halfway between the stem and each fork tube, and the bar
   * clamped on top of them. `offset` and `spacing` place the fork tubes in the yoke's frame.
   */
  buildCockpit(offset, spacing) {
    const g = GEOMETRY;
    const head = steeringHeadBody();
    // Top yoke frame (+x forward of the steering axis, +y up the fork axis) → body frame.
    const toBody = (x, y) => ({
      x: head.x + x * Math.cos(RAKE_RAD) + y * FORK_AXIS.x,
      y: head.y + x * Math.sin(RAKE_RAD) + y * FORK_AXIS.y,
    });
    const top = g.tripleTreeThickness / 2;
    const riserBase = toBody(offset / 2, top);
    const riserTop = toBody(offset / 2, top + g.riserHeight);
    for (const side of [-1, 1]) {
      this.front.add(cylinderBetween(riserBase, riserTop, g.riserRadius, side * spacing / 2, MATERIALS.aluminium));
    }

    // Bar in the body frame (level with the chassis), centred on the riser tops: flat clamp
    // area, an S-bend up to each control area, then a straight control area rising and
    // sweeping back to the end. Corners are filleted.
    const P = (x, y, z) => new THREE.Vector3(riserTop.x + x, riserTop.y + y, z);
    const half = g.handlebarWidth / 2, clampHalf = g.handlebarClampWidth / 2;
    const bendEnd = half - g.handlebarControlWidth;
    const curve = filletedPath([
      P(-g.handlebarSweep, g.handlebarHeight, -half),
      P(0, g.handlebarRise, -bendEnd),
      P(0, 0, -clampHalf),
      P(0, 0, clampHalf),
      P(0, g.handlebarRise, bendEnd),
      P(-g.handlebarSweep, g.handlebarHeight, half),
    ], g.handlebarBendRadius);
    // Taper: full clamp diameter across the clamp area, end diameter from the control area out.
    const radiusAt = (z) => {
      const u = THREE.MathUtils.clamp((Math.abs(z) - clampHalf) / (bendEnd - clampHalf), 0, 1);
      return THREE.MathUtils.lerp(g.handlebarClampRadius, g.handlebarEndRadius, u);
    };
    this.front.add(shadowed(new THREE.Mesh(taperedTube(curve, radiusAt, 240), MATERIALS.aluminium)));

    // Grips over the outer gripLength of each end.
    const u = g.gripLength / curve.getLength();
    for (const [from, to] of [[u, 0], [1 - u, 1]]) {
      this.front.add(cylinder3(curve.getPointAt(from), curve.getPointAt(to), g.gripRadius, MATERIALS.grip));
    }
  }

  buildRear() {
    const lk = REAR.linkage;
    this.rear = new THREE.Group();
    this.rear.position.set(PIVOT_BODY.x, PIVOT_BODY.y, 0);
    this.body.add(this.rear);

    // Rocker: triangle built with the dog-bone corner along local +x; rotated about its pivot.
    this.rocker = new THREE.Group();
    this.rocker.position.set(lk.rockerPivot.x, lk.rockerPivot.y, 0);
    this.rear.add(this.rocker);
    const K = { x: 0, y: 0 };
    const B = { x: lk.rockerArmDogbone, y: 0 };
    const C = { x: lk.rockerArmShock * Math.cos(lk.rockerAngle), y: lk.rockerArmShock * Math.sin(lk.rockerAngle) };
    for (const [p1, p2] of [[K, B], [B, C], [C, K]]) {
      this.rocker.add(boxBetween(p1, p2, 0.025, 0.04, 0, MATERIALS.aluminium));
    }

    this.dogbones = [-1, 1].map((side) => {
      const mesh = boxBetween({ x: 0, y: 0 }, { x: 0, y: lk.dogboneLength }, 0.022, 0.012,
        side * REAR.dogboneHalfSpacing, MATERIALS.aluminium);
      this.rear.add(mesh);
      return mesh;
    });

    // Shock: body on top (fixed to the frame mount), shaft below (on the rocker).
    this.shockBody = cylinderBetween({ x: 0, y: 0 }, { x: 0, y: REAR.shockBodyLength },
      REAR.shockBodyRadius, 0, MATERIALS.gold);
    this.shockShaft = cylinderBetween({ x: 0, y: 0 }, { x: 0, y: REAR.shockShaftLength },
      REAR.shockShaftRadius, 0, MATERIALS.silver);
    this.rear.add(this.shockBody, this.shockShaft);
  }

  /** Swingarm built at angle 0 (pointing straight back); rotated about the pivot each frame. */
  buildSwingarm(tireSize) {
    const lk = REAR.linkage;
    const spacing = swingarmHalfSpacing(tireSize.width);
    discard(this.swingarm);
    this.swingarm = new THREE.Group();
    this.rear.add(this.swingarm);

    this.swingarm.add(makeAxle(2 * spacing + 0.08, 0.014)); // swingarm pivot bolt, through the pivot plates
    const axle = { x: -lk.swingarmLength, y: 0 };
    for (const side of [-1, 1]) {
      this.swingarm.add(boxBetween({ x: 0, y: 0 }, axle, 0.05, REAR.swingarmWidth, side * spacing, MATERIALS.aluminium));
    }
    // Dog-bone mount bracket under the arms, spanning arm centre to arm centre so it always
    // joins both arms (the spacing follows the rear tire width).
    this.swingarm.add(boxBetween(
      { x: -lk.dogboneMountAlong, y: 0 }, { x: -lk.dogboneMountAlong, y: -lk.dogboneMountBelow },
      0.03, 2 * spacing, 0, MATERIALS.aluminium,
    ));
    const wheel = makeWheel(tireSize, spacing - REAR.swingarmWidth / 2 - WHEEL.hubClearance, this.rimMaterial);
    wheel.position.set(axle.x, axle.y, 0);
    this.swingarm.add(wheel);
    const rearAxle = makeAxle(2 * spacing + 0.04);
    rearAxle.position.set(axle.x, axle.y, 0);
    this.swingarm.add(rearAxle);
  }

  /** Rebuild a wheel's parts when its tire size changes (the rear also moves the pivot plates). */
  updateTires(sim) {
    const front = JSON.stringify(sim.frontTire), rear = JSON.stringify(sim.rearTire);
    if (front !== this.tireKeys.front) this.buildFront(sim.frontTire);
    if (rear !== this.tireKeys.rear) {
      this.buildSwingarm(sim.rearTire);
      this.buildFrame(sim.rearTire);
    }
    this.tireKeys = { front, rear };
  }

  /** Pose the meshes from the simulation's current state. */
  update(sim) {
    this.updateTires(sim);
    const { y, theta, s, r } = sim.state;
    // Keep mid-wheelbase near x = 0 regardless of where the CG sits.
    this.chassis.position.set(sim.xc - GEOMETRY.wheelbase / 2, y, this.offsetZ);
    this.chassis.rotation.z = theta;
    this.body.position.set(-sim.xc, -HC, 0);

    const axle = frontAxleBody(s, sim.h);
    this.slider.position.set(axle.x, axle.y, 0);
    this.forkOuter.position.set(sim.h * FORK_AXIS.x, sim.h * FORK_AXIS.y, 0);

    this.updateRear(sim.linkage.pose(r));
  }

  updateRear(pose) {
    this.swingarm.rotation.z = -Math.atan2(pose.axle.y, -pose.axle.x);
    this.rocker.rotation.z = Math.atan2(pose.B.y - pose.K.y, pose.B.x - pose.K.x);
    for (const mesh of this.dogbones) placeBetween(mesh, pose.D, pose.B);

    // Body hangs from the top mount toward the rocker; the shaft rises from the rocker.
    const dx = pose.C.x - pose.T.x, dy = pose.C.y - pose.T.y;
    const len = Math.hypot(dx, dy);
    const u = { x: dx / len, y: dy / len }; // top → bottom
    const along = (p, d) => ({ x: p.x + u.x * d, y: p.y + u.y * d });
    placeBetween(this.shockBody, pose.T, along(pose.T, REAR.shockBodyLength));
    placeBetween(this.shockShaft, along(pose.C, -REAR.shockShaftLength), pose.C);
  }
}
