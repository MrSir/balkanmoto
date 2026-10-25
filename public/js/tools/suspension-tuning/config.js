// Central place for every fixed constant and every GUI parameter definition.
// All physics values are SI (m, kg, N, s) unless the name says otherwise.

export const GRAVITY = 9.81;

// --- Geometry -------------------------------------------------------------
// Modelled on a 2025 Yamaha Ténéré 700. Spec-sheet values (wheelbase, trail, ground
// clearance) hold in the "unladen static state": default parameters with no rider,
// at static equilibrium. physics.js calibrates the reference positions and the
// triple-clamp offset so they come out exactly.
export const GEOMETRY = {
  rakeDeg: 27,            // fork angle from vertical
  wheelbase: 1.595,       // m, axle to axle, unladen static state
  trail: 0.105,           // m, unladen static state (sets the triple-clamp offset)
  cgAboveAxles: 0.30,     // m, CG height above the reference axle line (tire size lifts the whole bike)
  forkLength: 0.927,      // m, axle centre to top of the outer tube, fully extended
  outerTubeLength: 0.562, // m, gold upper tube (clamped in triple tree)
  outerTubeRadius: 0.027,
  stanchionLength: 0.561, // m, silver lower tube (moves with the wheel), bottom at the axle
  stanchionRadius: 0.0215, // 43 mm
  tireClearance: 0.015,   // m, gap between the tire's side and each fork leg / swingarm prism
  tripleTreeThickness: 0.05, // m, along the fork axis: top yoke clamp height (tube tops flush with its top)
  yokeSpacing: 0.21,      // m, top to bottom yoke, centre to centre along the fork axis
  yokePlateThickness: 0.025, // m, yoke plate, flush with the clamp rings' top faces
  bottomClampHeight: 0.08, // m, bottom yoke fork clamp rings (grip a longer length of tube)
  clampWall: 0.01,        // m, clamp ring wall round each tube / the stem
  forkTravel: 0.21,       // m, fixed (KYB 43 mm USD)
  stemRadius: 0.0175,     // m, aluminium steering stem through the head tube
  stemBossRadius: 0.04,   // m, stem clamp ring on each yoke
  stemOvershoot: 0.003,   // m, stem protrudes past the top yoke's top face and the bottom yoke's bottom face
  headTubeRadius: 0.035,  // m, frame head tube between the yokes…
  headTubeLength: 0.15,   // …centred between them, clear of both
  riserRadius: 0.0175,    // m, handlebar risers, halfway between the stem and each fork tube
  riserHeight: 0.04,      // m, above the top yoke, along the fork axis (bar centreline at the top)
  // Handlebar, all on the bar centreline: flat clamp area, an S-bend up to the control area,
  // then a straight control area rising and sweeping back to the ends.
  handlebarWidth: 0.78,   // m, end to end
  handlebarClampWidth: 0.157, // m, flat centre section
  handlebarRise: 0.057,   // m, top of each S-bend above the clamp centreline
  handlebarHeight: 0.079, // m, bar ends above the clamp centreline
  handlebarSweep: 0.052,  // m, bar ends behind the clamp centreline (swept along the control area)
  handlebarControlWidth: 0.226, // m, straight control area at each end, measured across the bike
  handlebarBendRadius: 0.03,    // m, fillet length either side of each bend corner
  handlebarClampRadius: 0.0143, // 28.6 mm tapered bar at the clamp…
  handlebarEndRadius: 0.011,    // …22 mm at the ends
  gripLength: 0.13,       // m, rubber grip over each bar end
  gripRadius: 0.016,
  seatX: 0.60,            // m, rider's seat ahead of the reference rear axle (rider g measured here)
};

// --- Rear suspension geometry --------------------------------------------
// Linkage points are in the "pivot frame": origin at the swingarm pivot, x forward,
// y up, fixed to the chassis. See linkage.js for the layout. Solved numerically
// around the Ténéré 700 shock (371 mm eye-to-eye, 101 mm stroke) for 200 mm wheel
// travel, the leverage ratio falling from 2.3:1 at full extension to 1.75:1 at full
// compression (rising rate), and the linkage's lowest point 240 mm above the ground
// in the unladen static state.
export const REAR = {
  linkage: {
    swingarmLength: 0.58,
    phiExtended: -0.23083,    // rad, swingarm angle (above horizontal, rearward) at full extension
    shockStroke: 0.101,
    dogboneMountAlong: 0.21077, // swingarm dog-bone mount: distance behind the pivot along the arm
    dogboneMountBelow: 0.07427, // ... and below the arm
    rockerPivot: { x: -0.02646, y: -0.12098 },
    rockerArmDogbone: 0.08048, // rocker pivot → dog-bone corner
    rockerArmShock: 0.12950,   // rocker pivot → shock corner
    rockerAngle: -0.67891,     // rad, from the dog-bone arm to the shock arm
    dogboneLength: 0.15322,
    shockTop: { x: -0.07366, y: 0.17895 },
    branch: 1,                // which circle-intersection solution the rocker uses
  },
  swingarmWidth: 0.03,        // m, lateral width of each swingarm prism (spacing follows rear tire width)
  dogboneHalfSpacing: 0.045,  // m, lateral offset of each dog-bone
  shockBodyLength: 0.20,      // m, red body (top)
  shockBodyRadius: 0.028,
  shockShaftLength: 0.20,     // m, chrome shaft (bottom), slides into the body
  shockShaftRadius: 0.010,
};

// --- Frame -----------------------------------------------------------------
// Steel double cradle with a bolt-on subframe, in the body frame (origin at the reference
// rear axle, x forward, y up; the ground is ~0.333 m below). Tubes are splines through
// { x, y, z } points, mirrored to both sides (z ≥ 0 given). Points tagged `head` are
// distances down the steering axis from the top yoke's centre (on the head tube's axis);
// `plate: true` points sit against a pivot plate, the tube's outer side flush with the
// plate's outer face (the plates' lateral position follows the rear tire width).
// Points tagged `on` are snapped to the nearest point on that tube's centreline, so the
// joining tube's end is buried in it (welded look).
// Everything stays above y = −0.045 so the rear linkage remains the lowest chassis point
// (its lowest joint never rises above y = −0.053) and clears the default front tire at
// full fork travel.
export const FRAME = {
  mainTubeRadius: 0.016,   // 32 mm spars, down tubes and braces
  subTubeRadius: 0.0125,   // 25 mm subframe
  crossTubeRadius: 0.014,  // cross-members carrying the shock top mount and rocker pivot
  plateThickness: 0.008,
  plateGap: 0.003,         // between each swingarm prism and its pivot plate
  // Pivot plate outline (side view): bosses joined by concave sides, counter-clockwise.
  plateOutline: [
    { x: 0.545, y: -0.023, r: 0.022 }, // rocker pivot
    { x: 0.64, y: 0.12, r: 0.035 },
    { x: 0.66, y: 0.33, r: 0.03 },     // spar junction
    { x: 0.498, y: 0.277, r: 0.03 },   // shock top mount
  ],
  plateSag: 0.012,
  spar: [
    { head: 0.055, z: 0 }, { x: 1.0, y: 0.63, z: 0.12 }, { x: 0.80, y: 0.50, z: 0.135 },
    { x: 0.66, y: 0.33, plate: true },
  ],
  downTube: [
    { head: 0.155, z: 0 }, { x: 1.17, y: 0.36, z: 0.06 }, { x: 1.08, y: 0.06, z: 0.08 },
    { x: 0.96, y: -0.012, z: 0.09 }, { x: 0.72, y: -0.018, z: 0.11 }, { x: 0.565, y: 0.02, plate: true },
  ],
  brace: [{ x: 1.04, y: 0.645, z: 0.105, on: 'spar' }, { x: 1.16, y: 0.43, z: 0.055, on: 'downTube' }],
  cradleCross: { x: 0.85, y: -0.016, z: 0.10, on: 'downTube' }, // across under the (absent) engine
  // Subframe: one bent tube, front end on the left spar, back along the left rail, across
  // the tail, forward along the right rail to the right spar. Given as the right rail
  // (front → tail corner); bends filleted over `railBend`.
  seatRail: [
    { x: 0.78, y: 0.488, z: 0.13, on: 'spar' }, { x: 0.45, y: 0.48, z: 0.10 },
    { x: 0.05, y: 0.50, z: 0.085 }, { x: -0.10, y: 0.51, z: 0.07 },
  ],
  railBend: 0.04,
  strut: [{ x: 0.52, y: 0.30, plate: true }, { x: 0.25, y: 0.40, z: 0.11 }, { x: 0.02, y: 0.497, z: 0.085, on: 'seatRail' }],
};

// --- Wheels -----------------------------------------------------------------
// Spoked rims sized from the tire: bead seat at the rim diameter, flanges either side
// of the tire's bead spacing. Hub width follows the fork / swingarm spacing.
export const WHEEL = {
  spokes: 36,              // per wheel, half on each hub flange
  cross: 3,                // tangential lacing, each spoke crosses three others
  spokeRadius: 0.002,
  flangeWall: 0.004,       // m, rim flange thickness
  wellDepth: 0.012,        // m, drop centre below the bead seat
  rimDepth: 0.024,         // m, bead seat to the spoke bed
  hubRadius: 0.032,
  hubFlangeRadius: 0.048,  // spoke holes at hubFlangeRadius − 0.008
  hubFlangeThickness: 0.004,
  hubFlangeInset: 0.016,   // m, each flange inboard of the hub end
  hubClearance: 0.008,     // m, hub end to the inner face of each fork leg / swingarm prism
};

// --- Tire cross-section -------------------------------------------------
// Size comes from the GUI (width / aspect ratio / rim); these shape the profile.
export const TIRE = {
  carcass: 0.010,          // m, constant wall thickness (inner surface follows the outer one)
  beadSpacing: 0.6,        // bead heel-to-heel distance as a fraction of tire width
  beadWidth: 0.015,        // m, bead seat width (toe to heel)
  flangeHeight: 0.015,     // m, bead face height (max 20% of section height)
  maxWidthAt: 0.55,        // fraction of section height where the sidewall reaches full width
};

// --- Fixed physical constants --------------------------------------------
export const PHYSICS = {
  dt: 0.001,               // s, fixed integration substep
  maxFrameTime: 0.05,      // s, cap on real time consumed per animation frame
  unsprungMass: 15,        // kg, front wheel + brakes + lower fork
  rearUnsprungMass: 20,    // kg, rear wheel + brake + share of swingarm and linkage
  radiusOfGyration: 0.5,   // m, chassis pitch inertia = M * k^2
  tireStiffness: 200000,   // N/m (200 N/mm)
  tireDamping: 700,        // N·s/m, ~7% of critical for the rear
  // End stops, applied to fork travel and to shock stroke alike.
  bumpZone: 0.010,         // m, bump stop engages over the last 10 mm of travel
  bumpStiffnessFactor: 20, // bump stiffness at full compression = factor * main spring rate
  topOutZone: 0.005,       // m, top-out spring acts over the first 5 mm of travel
  topOutStiffness: 200000, // N/m
  hardStopStiffness: 5e6,  // N/m, beyond full travel
};

// --- Fork oil -------------------------------------------------------------
// Representative kinematic viscosity (cSt at 40 °C) per fork-oil weight. "W" ratings
// aren't standardised across brands, so these are typical values. The fork damping
// sliders are the coefficients with 10W oil; other weights scale both by cSt(W) / cSt(10W).
export const FORK_OIL_VISCOSITY = {
  2.5: 10, 5: 17, 7.5: 24, 10: 32, 12.5: 38, 15: 45, 17.5: 52, 20: 63,
};
export const forkOilFactor = (weight) =>
  FORK_OIL_VISCOSITY[Math.round(weight / 2.5) * 2.5] / FORK_OIL_VISCOSITY[10];

// --- Readouts -----------------------------------------------------------
export const READOUTS = {
  graphWindow: 3,          // s of simulated time shown in the graphs
  graphSampleInterval: 0.005, // s between graph samples
  bottomedHoldTime: 1.0,   // s (real time) the BOTTOMED indicators stay lit
};

// --- Bikes -----------------------------------------------------------------
// Two bikes side by side for comparison. From the default front view A is on the
// viewer's left (+z) and B on the right (−z).
export const BIKES = [
  { id: 'A', color: '#2f6fe4', offsetZ: 0.6 },
  { id: 'B', color: '#d7263d', offsetZ: -0.6 },
];

// --- GUI parameters -------------------------------------------------------
// `value` is the default; units are what the user sees.
// Per-bike parameters:
export const PARAM_DEFS = {
  frontWidth:  { label: 'Width (mm)',                  min: 60,  max: 240,   step: 5,   value: 90 },
  frontAspect: { label: 'Aspect ratio (%)',            min: 30,  max: 100,   step: 5,   value: 90 },
  frontRim:    { label: 'Rim diameter (in)',           min: 16,  max: 21,    step: 1,   value: 21 },
  rearWidth:   { label: 'Width (mm)',                  min: 60,  max: 240,   step: 5,   value: 150 },
  rearAspect:  { label: 'Aspect ratio (%)',            min: 30,  max: 100,   step: 5,   value: 70 },
  rearRim:     { label: 'Rim diameter (in)',           min: 16,  max: 21,    step: 1,   value: 18 },
  springRate:  { label: 'Spring rate (N/mm/leg)',      min: 5,   max: 10,    step: 0.1, value: 5.8 },
  compression: { label: 'Compression damping (N·s/m)', min: 0,   max: 6000,  step: 50,  value: 1000 },
  rebound:     { label: 'Rebound damping (N·s/m)',     min: 0,   max: 10000, step: 50,  value: 2000 },
  forkOil:     { label: 'Fork oil weight (W)',         min: 2.5, max: 20,    step: 2.5, value: 10 },
  preload:     { label: 'Preload (mm)',                min: 0,   max: 19,    step: 0.5, value: 0 }, // T7 stock: 19
  forkHeight:  { label: 'Fork height (mm above clamp)', min: 1,  max: 20,    step: 1,   value: 1 },
  shockSpring: { label: 'Shock spring rate (N/mm)',    min: 30,  max: 80,    step: 0.5, value: 70 },
  shockPreload: { label: 'Shock preload (mm)',         min: 0,   max: 25,    step: 0.5, value: 10 },
  shockCompression: { label: 'Shock compression (N·s/m)', min: 0, max: 25000, step: 100, value: 5100 },
  shockRebound: { label: 'Shock rebound (N·s/m)',      min: 0,   max: 35000, step: 100, value: 10200 },
  bikeMass:    { label: 'Motorcycle weight (kg)',      min: 100, max: 300,   step: 1,   value: 208 },
  riderMass:   { label: 'Rider weight (kg)',           min: 40,  max: 150,   step: 1,   value: 70 },
  frontBias:   { label: 'Front weight bias (%)',       min: 40,  max: 60,    step: 0.5, value: 50 },
};

// Parameters shared by both bikes:
export const SHARED_DEFS = {
  dropHeight:  { label: 'Drop height (m)',             min: 0,   max: 1.5,   step: 0.01, value: 0.3 },
  timeScale:   { label: 'Time scale (×)',              min: 0.1, max: 1,     step: 0.05, value: 1 },
};

function defaultsOf(defs) {
  const params = {};
  for (const [key, def] of Object.entries(defs)) params[key] = def.value;
  return params;
}

export const defaultParams = () => defaultsOf(PARAM_DEFS);
export const defaultShared = () => defaultsOf(SHARED_DEFS);
