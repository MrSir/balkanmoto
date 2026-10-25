// Tire sizing and cross-section profile (pure, no three.js dependency).
//
// Size follows the usual marking, e.g. 90/90-21: section width (mm) / aspect
// ratio (% of width) – rim diameter (in). The profile is a closed loop in the
// (radius, lateral) plane, ready to be spun around the axle by a lathe.

import { TIRE, WHEEL } from './config.js';

const INCH = 0.0254;

/** Tire dimensions (m) from width (mm), aspect ratio (%) and rim diameter (in). */
export function tireSize(width, aspect, rim) {
  const w = width / 1000;
  const sectionHeight = w * aspect / 100;
  const rimRadius = rim * INCH / 2;
  return { width: w, sectionHeight, rimRadius, outerRadius: rimRadius + sectionHeight };
}

function cubic(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const k0 = u * u * u, k1 = 3 * u * u * t, k2 = 3 * u * t * t, k3 = t * t * t;
  return {
    r: k0 * p0.r + k1 * p1.r + k2 * p2.r + k3 * p3.r,
    z: k0 * p0.z + k1 * p1.z + k2 * p2.z + k3 * p3.z,
  };
}

/**
 * Outer surface of the right half (z ≥ 0), from the top of the bead face to the
 * crown centre: a sidewall bulging out to full width, then a round crown.
 */
function outerHalf({ width, sectionHeight: H, rimRadius: Rr, outerRadius: Ro }, segments) {
  const bead = (TIRE.beadSpacing * width) / 2;
  const flangeTop = { r: Rr + Math.min(TIRE.flangeHeight, 0.2 * H), z: bead };
  const widest = { r: Rr + TIRE.maxWidthAt * H, z: width / 2 };
  const rise = widest.r - flangeTop.r;

  const pts = [];
  // Sidewall: leaves the rim flange angled outward, meets full width travelling radially.
  for (let i = 0; i <= segments; i++) {
    pts.push(cubic(
      flangeTop,
      { r: flangeTop.r + rise * 0.35, z: bead + (widest.z - bead) * 0.7 },
      { r: widest.r - rise * 0.35, z: widest.z },
      widest,
      i / segments,
    ));
  }
  // Crown: quarter ellipse from full width round to the centreline.
  for (let i = 1; i <= segments; i++) {
    const v = (i / segments) * (Math.PI / 2);
    pts.push({ r: widest.r + (Ro - widest.r) * Math.sin(v), z: (width / 2) * Math.cos(v) });
  }
  return pts;
}

/** `pts` offset inward (into the tire's hollow) by the carcass thickness. */
function insetCurve(pts) {
  const last = pts.length - 1;
  const mirror = (p) => ({ r: p.r, z: -p.z });
  return pts.map((p, i) => {
    // The crown centre's neighbour beyond the centreline is the mirror image of the one before it.
    const a = pts[Math.max(i - 1, 0)], b = i === last ? mirror(pts[last - 1]) : pts[i + 1];
    const dr = b.r - a.r, dz = b.z - a.z;
    const len = Math.hypot(dr, dz);
    // Walking toward the crown centre, the hollow lies on the (dz, −dr) side of the tangent.
    return { r: p.r + (TIRE.carcass * dz) / len, z: p.z - (TIRE.carcass * dr) / len };
  });
}

/**
 * Closed cross-section loop as { r, z } points. Order: left bead seat → left
 * sidewall → crown → right sidewall → right bead seat, then back along the inner
 * surface. This order keeps the outside as the front face of a lathe.
 */
export function tireProfile(size, segments = 16) {
  const outer = outerHalf(size, segments);
  const inner = insetCurve(outer);
  const heel = { r: size.rimRadius, z: outer[0].z };
  const toe = { r: size.rimRadius, z: outer[0].z - TIRE.beadWidth };
  const right = [toe, heel, ...outer]; // outside, toe → crown centre
  const mirror = (p) => ({ r: p.r, z: -p.z });

  const loop = [
    ...right.map(mirror),                  // left: toe → bead → sidewall → crown centre
    ...[...right].reverse().slice(1),      // right: crown centre → toe
    ...inner,                              // right inside: bead → crown centre
    ...inner.map(mirror).reverse().slice(1), // left inside: crown centre → bead
  ];
  loop.push(loop[0]); // close at the left toe
  return loop;
}

/**
 * Closed rim cross-section loop as { r, z } points, sized to seat `size`'s beads: a drop
 * centre, bead seats out to the tire's bead heels, flanges outside them, and the spoke bed
 * underneath. Order: top centre → right flange → spoke bed centre → left flange → top centre.
 */
export function rimProfile(size) {
  const Rr = size.rimRadius;
  const bead = (TIRE.beadSpacing * size.width) / 2;
  const flange = Math.min(TIRE.flangeHeight, 0.2 * size.sectionHeight);
  const wall = WHEEL.flangeWall;
  const seat = bead - TIRE.beadWidth;
  const well = Math.max(seat - 0.006, 0.003);
  const right = [
    { r: Rr - WHEEL.wellDepth, z: 0 },
    { r: Rr - WHEEL.wellDepth, z: well },
    { r: Rr, z: Math.max(seat, well) },
    { r: Rr, z: bead },                          // bead heel
    { r: Rr + flange, z: bead },
    { r: Rr + flange + wall / 2, z: bead + wall / 2 }, // rolled flange lip
    { r: Rr + flange, z: bead + wall },
    { r: Rr - WHEEL.rimDepth / 2, z: bead + wall },
    { r: Rr - WHEEL.rimDepth, z: 0.6 * bead },
    { r: Rr - WHEEL.rimDepth, z: 0 },           // spoke bed
  ];
  const mirror = (p) => ({ r: p.r, z: -p.z });
  return [...right, ...right.map(mirror).reverse().slice(1)];
}
