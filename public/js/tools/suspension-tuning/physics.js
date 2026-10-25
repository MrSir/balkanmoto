// Pure physics for the suspension simulation (no three.js dependency).
//
// Planar model with four generalized coordinates:
//   y  — chassis CG height (m)
//   θ  — chassis pitch (rad, positive = nose up)
//   s  — fork compression along the fork axis (m, 0 = fully extended)
//   r  — rear wheel travel, vertical relative to the chassis (m, 0 = fully extended)
//
// Positions use the small-angle approximation with the fork axis fixed at the
// rake angle, which makes the mass matrix constant:
//   front axle height  yw = y + a·θ + (s − sRef + h)·cosRake − hc
//   rear axle height   yr = y + b·θ + (r − rRef) − hc
// where a / b are the horizontal distances from the CG to the front / rear axle,
// h is the fork height (tube protrusion above the clamp) and hc is the CG height
// above the axles. Each tire's outer radius comes from its size (width / aspect /
// rim), so bigger tires lift that end of the bike. The shock acts on the rear wheel through the linkage's
// leverage ratio; the axle's small fore-aft movement along the swingarm arc is
// ignored here (the renderer draws it exactly).
//
// Body-frame coordinates (used by the renderer) have their origin at the rear
// axle at the reference rear travel, x pointing forward and y up.
//
// The reference positions sRef / rRef are the unladen static state (default
// parameters, no rider), so the spec-sheet wheelbase and trail hold exactly there;
// see the calibration at the end of this file.

import { GRAVITY, GEOMETRY, PHYSICS, REAR, defaultParams, forkOilFactor } from './config.js';
import { RearLinkage } from './linkage.js';
import { tireSize } from './tire.js';

const RAKE = GEOMETRY.rakeDeg * Math.PI / 180;
const COS_RAKE = Math.cos(RAKE);
const SIN_RAKE = Math.sin(RAKE);
const L = GEOMETRY.wheelbase;
export const HC = GEOMETRY.cgAboveAxles;

// Fork axis unit vector in the body frame, pointing up the fork (direction the
// wheel moves when the fork compresses).
export const FORK_AXIS = { x: -SIN_RAKE, y: COS_RAKE };
export const RAKE_RAD = RAKE;

export const rearLinkage = new RearLinkage(REAR.linkage);

// Set by the calibration at the end of this file (unladen static state):
let S_REF = 0;  // m, fork compression + fork height at which the front axle sits at (L, 0)
let R_REF = 0;  // m, rear wheel travel at which the rear axle sits at the body origin
let OFFSET = 0; // m, triple-clamp offset: fork axis ahead of the steering axis

/** Front axle position in the body frame for fork compression s and fork height h. */
export function frontAxleBody(s, h = 0) {
  return { x: L + (S_REF - s - h) * SIN_RAKE, y: (s - S_REF + h) * COS_RAKE };
}

/**
 * Triple tree centre (on the fork axis) in the body frame; fixed to the chassis.
 * At fork height 0 the outer tubes' tops sit flush with its top face.
 */
export function tripleTreeBody() {
  const a0 = frontAxleBody(0);
  const d = GEOMETRY.forkLength - GEOMETRY.tripleTreeThickness / 2;
  return { x: a0.x + d * FORK_AXIS.x, y: a0.y + d * FORK_AXIS.y };
}

/** Where the steering axis passes through the triple tree (body frame), `offset` behind the fork axis. */
export function steeringHeadBody() {
  const tree = tripleTreeBody();
  return { x: tree.x - OFFSET * COS_RAKE, y: tree.y - OFFSET * SIN_RAKE };
}

/** Gauss–Jordan inverse of a small square matrix. */
function invert(m) {
  const n = m.length;
  const a = m.map((row, i) => [...row, ...row.map((_, j) => (i === j ? 1 : 0))]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let i = col + 1; i < n; i++) if (Math.abs(a[i][col]) > Math.abs(a[pivot][col])) pivot = i;
    [a[col], a[pivot]] = [a[pivot], a[col]];
    const p = a[col][col];
    for (let j = 0; j < 2 * n; j++) a[col][j] /= p;
    for (let i = 0; i < n; i++) {
      if (i === col) continue;
      const f = a[i][col];
      for (let j = 0; j < 2 * n; j++) a[i][j] -= f * a[col][j];
    }
  }
  return a.map((row) => row.slice(n));
}

/**
 * Spring + end stops + asymmetric damping for one suspension element, along its
 * own stroke coordinate x (positive pushes its two ends apart).
 */
function elementForce(e, x, v) {
  let f = e.k * (x + e.preload);
  if (x < PHYSICS.topOutZone) f -= PHYSICS.topOutStiffness * (PHYSICS.topOutZone - x);
  const bumpStart = e.travel - PHYSICS.bumpZone;
  if (x > bumpStart) {
    const d = x - bumpStart;
    // Progressive: stiffness rises linearly to bumpStiffnessFactor·k at full travel.
    f += (PHYSICS.bumpStiffnessFactor * e.k / 2) * d * d / PHYSICS.bumpZone;
    // Metal-to-metal limit past full travel.
    if (x > e.travel) f += PHYSICS.hardStopStiffness * (x - e.travel);
  }
  f += (v > 0 ? e.cComp : e.cReb) * v;
  return f;
}

function bisect(fn, target, lo, hi) {
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (fn(mid) < target) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

export class SuspensionSim {
  constructor(params) {
    this.state = { y: 0, theta: 0, s: 0, r: 0, vy: 0, vtheta: 0, vs: 0, vr: 0 };
    this.time = 0;
    this.linkage = rearLinkage;
    this.setParams(params);
    this.resetToEquilibrium();
  }

  /** Recompute derived quantities from GUI parameters (GUI units). */
  setParams(p) {
    const mu = PHYSICS.unsprungMass;
    const mr = PHYSICS.rearUnsprungMass;
    const total = p.bikeMass + p.riderMass;
    const bias = p.frontBias / 100;

    this.mu = mu;
    this.mr = mr;
    this.M = total - mu - mr;                         // chassis (sprung) mass
    this.I = this.M * PHYSICS.radiusOfGyration ** 2;  // pitch inertia
    this.h = p.forkHeight / 1000;
    this.frontTire = tireSize(p.frontWidth, p.frontAspect, p.frontRim);
    this.rearTire = tireSize(p.rearWidth, p.rearAspect, p.rearRim);
    const oil = forkOilFactor(p.forkOil);
    this.fork = {
      k: 2 * p.springRate * 1000,                     // two legs, N/m
      preload: p.preload / 1000,
      travel: GEOMETRY.forkTravel,
      cComp: p.compression * oil,                     // sliders are the 10W values
      cReb: p.rebound * oil,
    };
    this.shock = {
      k: p.shockSpring * 1000,
      preload: p.shockPreload / 1000,
      travel: this.linkage.stroke,
      cComp: p.shockCompression,
      cReb: p.shockRebound,
    };
    this.travel = this.fork.travel;
    this.rearTravel = this.linkage.travel;

    // Raising the fork tubes moves the front axle up the fork axis, shortening the wheelbase.
    this.frontX = L - this.h * SIN_RAKE;
    // Place the CG so the static front tire load is exactly `bias` of the total
    // (moments about the rear axle; the rear unsprung mass sits on it).
    this.xc = this.frontX * (bias * total - mu) / this.M;
    this.a = this.frontX - this.xc;
    this.b = -this.xc;

    const { M, I, a, b } = this;
    const c = COS_RAKE;
    this.massInv = invert([
      [M + mu + mr,    mu * a + mr * b,                 mu * c,         mr],
      [mu * a + mr * b, I + mu * a * a + mr * b * b,    mu * a * c,     mr * b],
      [mu * c,         mu * a * c,                      mu,             0],
      [mr,             mr * b,                          0,              mr],
    ]);

    this.staticLoads = this.staticTireLoads();
    this.staticState = this.solveEquilibrium();
  }

  /** Fork force along the axis (positive pushes wheel and chassis apart). */
  forkForce(s, vs) {
    return elementForce(this.fork, s, vs);
  }

  /** Shock force transmitted to the rear wheel through the linkage (vertical, N). */
  rearWheelForce(r, vr) {
    const lr = this.linkage.leverageRatio(r);
    return elementForce(this.shock, this.linkage.shockCompression(r), vr / lr) / lr;
  }

  isBottomed(s) {
    return s > this.fork.travel - PHYSICS.bumpZone;
  }

  isRearBottomed(r) {
    return this.linkage.shockCompression(r) > this.shock.travel - PHYSICS.bumpZone;
  }

  /** Static tire loads (N) from moment balance about the rear axle. */
  staticTireLoads() {
    const g = GRAVITY;
    const total = this.M + this.mu + this.mr;
    const front = (this.mu * g * this.frontX + this.M * g * this.xc) / this.frontX;
    return { front, rear: total * g - front };
  }

  /** Static equilibrium solved directly (no dynamics). */
  solveEquilibrium() {
    const g = GRAVITY;
    const { front: frontLoad, rear: rearLoad } = this.staticLoads;

    // Each suspension carries the chassis share of its tire load.
    const s = bisect((x) => this.forkForce(x, 0), (frontLoad - this.mu * g) * COS_RAKE,
      -0.02, this.fork.travel + 0.1);
    const r = bisect((x) => this.rearWheelForce(x, 0), rearLoad - this.mr * g,
      -0.02, this.rearTravel + 0.1);

    const yw = this.frontTire.outerRadius - frontLoad / PHYSICS.tireStiffness;
    const yr = this.rearTire.outerRadius - rearLoad / PHYSICS.tireStiffness;
    const frontRel = (s - S_REF + this.h) * COS_RAKE;
    const rearRel = r - R_REF;
    const theta = (yw - yr - frontRel + rearRel) / this.frontX;
    const y = yr + HC - theta * this.b - rearRel;
    return { y, theta, s, r, vy: 0, vtheta: 0, vs: 0, vr: 0 };
  }

  get staticSag() {
    return this.staticState.s;
  }

  get rearStaticSag() {
    return this.staticState.r;
  }

  resetToEquilibrium() {
    Object.assign(this.state, this.staticState);
  }

  /** Place the bike level with its lowest tire `height` m above the ground, at rest. */
  drop(height) {
    const { s, r } = this.staticState;
    // Axle heights relative to the level-chassis datum.
    const frontRel = (s - S_REF + this.h) * COS_RAKE;
    const rearRel = r - R_REF;
    Object.assign(this.state, {
      y: height + HC - Math.min(frontRel - this.frontTire.outerRadius, rearRel - this.rearTire.outerRadius),
      theta: 0,
      s, r,
      vy: 0, vtheta: 0, vs: 0, vr: 0,
    });
  }

  axleHeights(st = this.state) {
    return {
      front: st.y + this.a * st.theta + (st.s - S_REF + this.h) * COS_RAKE - HC,
      rear: st.y + this.b * st.theta + (st.r - R_REF) - HC,
    };
  }

  tireForce(radius, axleHeight, axleVel) {
    const defl = radius - axleHeight;
    if (defl <= 0) return 0;
    return Math.max(0, PHYSICS.tireStiffness * defl - PHYSICS.tireDamping * axleVel);
  }

  /** Advance one fixed substep with semi-implicit Euler. */
  step(dt) {
    const st = this.state;
    const g = GRAVITY;
    const { mu, mr, M, a, b } = this;
    const c = COS_RAKE;

    const { front: yw, rear: yr } = this.axleHeights(st);
    const vw = st.vy + a * st.vtheta + c * st.vs;
    const vrAxle = st.vy + b * st.vtheta + st.vr;

    const Nf = this.tireForce(this.frontTire.outerRadius, yw, vw);
    const Nr = this.tireForce(this.rearTire.outerRadius, yr, vrAxle);
    const Ff = this.forkForce(st.s, st.vs);
    const Fr = this.rearWheelForce(st.r, st.vr);
    const frontVertical = Nf - mu * g; // net vertical external force on each wheel
    const rearVertical = Nr - mr * g;

    const Q = [
      -M * g + frontVertical + rearVertical,
      frontVertical * a + rearVertical * b,
      frontVertical * c - Ff,
      rearVertical - Fr,
    ];
    const Mi = this.massInv;
    const acc = Mi.map((row) => row[0] * Q[0] + row[1] * Q[1] + row[2] * Q[2] + row[3] * Q[3]);

    st.vy += acc[0] * dt;
    st.vtheta += acc[1] * dt;
    st.vs += acc[2] * dt;
    st.vr += acc[3] * dt;
    st.y += st.vy * dt;
    st.theta += st.vtheta * dt;
    st.s += st.vs * dt;
    st.r += st.vr * dt;
    this.time += dt;

    this.lastForces = { front: Nf, rear: Nr, fork: Ff, shock: Fr };
    this.lastAcc = { y: acc[0], theta: acc[1] };
  }

  /**
   * Values for the rolling graphs, from the last substep: felt vertical acceleration at
   * the seat (g, 1 at rest), tire loads as a fraction of static, and damper shaft speeds
   * (m/s, compression positive).
   */
  graphValues() {
    const { s, r, vs, vr } = this.state;
    const acc = this.lastAcc ?? { y: 0, theta: 0 };
    const forces = this.lastForces ?? this.staticLoads;
    return {
      front: s / this.travel,
      rear: r / this.rearTravel,
      riderG: 1 + (acc.y + (GEOMETRY.seatX - this.xc) * acc.theta) / GRAVITY,
      frontLoad: forces.front / this.staticLoads.front,
      rearLoad: forces.rear / this.staticLoads.rear,
      forkSpeed: vs,
      shockSpeed: vr / this.linkage.leverageRatio(r),
    };
  }

  /** Rear axle position in the body frame (exact, along the swingarm arc). */
  rearAxleBody(r) {
    const axle = this.linkage.pose(r).axle;
    return { x: PIVOT_BODY.x + axle.x, y: PIVOT_BODY.y + axle.y };
  }

  /** Horizontal distance between the axle centres (exact rendered geometry, m). */
  wheelbase(st = this.state) {
    const f = frontAxleBody(st.s, this.h);
    const r = this.rearAxleBody(st.r);
    const dx = f.x - r.x, dy = f.y - r.y;
    return dx * Math.cos(st.theta) - dy * Math.sin(st.theta);
  }

  /** Exact world height of a body-frame point, matching the renderer's chassis transform. */
  worldHeight(p, st = this.state) {
    return st.y + (p.x - this.xc) * Math.sin(st.theta) + (p.y - HC) * Math.cos(st.theta);
  }

  /**
   * Trail (m): from the front contact patch (directly below the axle) forward to where
   * the steering axis — parallel to the fork axis, `offset` behind it — meets the ground.
   */
  trail(st = this.state) {
    const axleHeight = this.worldHeight(frontAxleBody(st.s, this.h), st);
    const angle = RAKE + st.theta;
    return axleHeight * Math.tan(angle) - OFFSET / Math.cos(angle);
  }

  /** Height (m) of the lowest chassis point: the lowest joint of the rear linkage. */
  groundClearance(st = this.state) {
    const { K, B, C, D } = this.linkage.pose(st.r);
    return Math.min(...[K, B, C, D].map((p) =>
      this.worldHeight({ x: p.x + PIVOT_BODY.x, y: p.y + PIVOT_BODY.y }, st)));
  }

  /** Snapshot of quantities the readouts need. */
  telemetry() {
    const { s, r, theta } = this.state;
    return {
      time: this.time,
      s,
      travel: this.fork.travel,
      staticSag: this.staticSag,
      r,
      rearTravel: this.rearTravel,
      rearStaticSag: this.rearStaticSag,
      shockStroke: this.linkage.shockCompression(r),
      leverageRatio: this.linkage.leverageRatio(r),
      pitch: theta,
      wheelbase: this.wheelbase(),
      staticWheelbase: this.wheelbase(this.staticState),
      trail: this.trail(),
      groundClearance: this.groundClearance(),
      bottomed: this.isBottomed(s),
      rearBottomed: this.isRearBottomed(r),
    };
  }
}

// --- Calibration ---------------------------------------------------------------
// Static compressions don't depend on the reference positions, so solve the unladen
// static state once, make it the reference, then re-solve for the pitch and axle
// height that fix the triple-clamp offset giving the spec trail.
const unladenParams = { ...defaultParams(), riderMass: 0 };
const unladen = new SuspensionSim(unladenParams);
S_REF = unladen.staticState.s + unladen.h;
R_REF = unladen.staticState.r;
unladen.setParams(unladenParams);
{
  const st = unladen.staticState;
  const angle = RAKE + st.theta;
  OFFSET = unladen.worldHeight(frontAxleBody(st.s, unladen.h), st) * Math.sin(angle)
    - GEOMETRY.trail * Math.cos(angle);
}

/** Swingarm pivot in the body frame (puts the rear axle at the origin at r = rRef). */
export const PIVOT_BODY = (() => {
  const axle = rearLinkage.pose(R_REF).axle;
  return { x: -axle.x, y: -axle.y };
})();
