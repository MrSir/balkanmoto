// Rear linkage kinematics (pure, no three.js dependency).
//
// Monocross rising-rate layout, all points in the "pivot frame": origin at the
// swingarm pivot, x forward, y up, fixed to the chassis.
//
//   swingarm   pivot → rear axle, angle φ above horizontal (rearward); φ grows on compression
//   dog-bones  swingarm mount D → rocker corner B (fixed length)
//   rocker     pivots on the frame at K; corners B (dog-bones) and C (shock bottom)
//   shock      frame mount T (top) → rocker corner C (bottom)
//
// The loop is solved exactly for each swingarm angle and tabulated against rear
// wheel travel r (vertical axle rise from full extension). At runtime the table
// gives shock compression and leverage ratio for the physics, and the swingarm
// angle for the renderer.

const TABLE_SIZE = 600;

function circleIntersect(p0, r0, p1, r1, sign) {
  const dx = p1.x - p0.x, dy = p1.y - p0.y;
  const d = Math.hypot(dx, dy);
  const a = (r0 * r0 - r1 * r1 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r0 * r0 - a * a));
  const mx = p0.x + (a * dx) / d, my = p0.y + (a * dy) / d;
  return { x: mx - (sign * h * dy) / d, y: my + (sign * h * dx) / d };
}

/** Every linkage joint position (pivot frame) for swingarm angle `phi`. */
export function linkagePose(phi, g) {
  const u = { x: -Math.cos(phi), y: Math.sin(phi) };  // along the arm, rearward
  const n = { x: -Math.sin(phi), y: -Math.cos(phi) }; // perpendicular, below the arm
  const axle = { x: g.swingarmLength * u.x, y: g.swingarmLength * u.y };
  const D = {
    x: g.dogboneMountAlong * u.x + g.dogboneMountBelow * n.x,
    y: g.dogboneMountAlong * u.y + g.dogboneMountBelow * n.y,
  };
  const K = g.rockerPivot;
  const B = circleIntersect(K, g.rockerArmDogbone, D, g.dogboneLength, g.branch);
  const psi = Math.atan2(B.y - K.y, B.x - K.x);
  const C = {
    x: K.x + g.rockerArmShock * Math.cos(psi + g.rockerAngle),
    y: K.y + g.rockerArmShock * Math.sin(psi + g.rockerAngle),
  };
  const T = g.shockTop;
  return { pivot: { x: 0, y: 0 }, axle, D, K, B, C, T, shockLength: Math.hypot(T.x - C.x, T.y - C.y) };
}

/** Linear interpolation into a uniformly sampled table, extrapolating at both ends. */
function interp(table, step, r) {
  const last = table.length - 1;
  const i = Math.min(Math.max(Math.floor(r / step), 0), last - 1);
  const f = r / step - i;
  return table[i] + (table[i + 1] - table[i]) * f;
}

export class RearLinkage {
  constructor(geometry) {
    this.g = geometry;
    const { phiExtended, shockStroke } = geometry;
    const base = linkagePose(phiExtended, geometry);
    this.shockLengthExtended = base.shockLength;
    this.stroke = shockStroke;

    // March the swingarm up until the shock reaches full stroke.
    const raw = [{ phi: phiExtended, r: 0, x: 0 }];
    const dPhi = 0.0005;
    for (let phi = phiExtended + dPhi; phi < phiExtended + 1.2; phi += dPhi) {
      const p = linkagePose(phi, geometry);
      const r = p.axle.y - base.axle.y;
      const x = this.shockLengthExtended - p.shockLength;
      raw.push({ phi, r, x });
      if (x >= shockStroke) break;
    }
    const end = raw.at(-1), prev = raw.at(-2);
    const f = (shockStroke - prev.x) / (end.x - prev.x);
    this.travel = prev.r + (end.r - prev.r) * f; // rear wheel travel at full shock stroke

    // Resample uniformly in r.
    this.step = this.travel / TABLE_SIZE;
    this.phiTable = [];
    this.xTable = [];
    let j = 0;
    for (let i = 0; i <= TABLE_SIZE; i++) {
      const r = i * this.step;
      while (j < raw.length - 2 && raw[j + 1].r < r) j++;
      const a = raw[j], b = raw[j + 1];
      const t = (r - a.r) / (b.r - a.r);
      this.phiTable.push(a.phi + (b.phi - a.phi) * t);
      this.xTable.push(a.x + (b.x - a.x) * t);
    }
    // Leverage ratio = wheel travel per unit shock travel (dr/dx).
    this.lrTable = this.xTable.map((_, i) => {
      const i0 = Math.max(0, i - 1), i1 = Math.min(TABLE_SIZE, i + 1);
      return ((i1 - i0) * this.step) / (this.xTable[i1] - this.xTable[i0]);
    });
  }

  /** Shock compression (m) at rear wheel travel r. */
  shockCompression(r) { return interp(this.xTable, this.step, r); }

  /** Leverage ratio (wheel travel / shock travel) at rear wheel travel r. */
  leverageRatio(r) {
    return interp(this.lrTable, this.step, Math.min(Math.max(r, 0), this.travel));
  }

  swingarmAngle(r) { return interp(this.phiTable, this.step, r); }

  /** All joint positions (pivot frame) at rear wheel travel r. */
  pose(r) { return linkagePose(this.swingarmAngle(r), this.g); }
}
