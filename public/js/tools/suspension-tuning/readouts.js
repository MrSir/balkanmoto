// Per-bike readout panels and the rolling graphs (2D canvas overlays).

import { READOUTS, PHYSICS } from './config.js';

// Dark theme matching lil-gui.
const COLORS = {
  background: '#1f1f1f',
  limit: 'rgba(255,255,255,0.3)',
  strong: 'rgba(255,255,255,0.6)',
  axis: '#b0b0b0',
};

const mm = (m) => (m * 1000).toFixed(1);
const withPct = (m, travel) => `${mm(m)} mm (${((m / travel) * 100).toFixed(0)}%)`;
const deg = (rad) => (rad * 180) / Math.PI;
const speedPair = (comp, reb) => `${comp.toFixed(2)} / ${reb.toFixed(2)} m/s`;

// A peak row shows '–' until the bike has peaks; `value`/`text` take (peaks, telemetry).
const peakRow = (label, tol, value, text) => ({
  label, tol,
  value: (t) => (t.peaks ? value(t.peaks, t) : NaN),
  text: (t) => (t.peaks ? text(t.peaks, t) : '–'),
});

/** Fold one substep of `sim` into a bike's peaks (null = start fresh). */
function updatePeaks(p, sim, dt) {
  const v = sim.graphValues();
  if (!p) {
    p = {
      front: 0, rear: 0, riderG: -Infinity, forkComp: 0, forkReb: 0, shockComp: 0, shockReb: 0,
      frontAirborne: 0, rearAirborne: 0, frontTouched: false, rearTouched: false,
    };
  }
  p.front = Math.max(p.front, sim.state.s);
  p.rear = Math.max(p.rear, sim.state.r);
  p.riderG = Math.max(p.riderG, v.riderG);
  p.forkComp = Math.max(p.forkComp, v.forkSpeed);
  p.forkReb = Math.min(p.forkReb, v.forkSpeed);
  p.shockComp = Math.max(p.shockComp, v.shockSpeed);
  p.shockReb = Math.min(p.shockReb, v.shockSpeed);
  // Airborne time only counts after a tire's first touchdown (not the free fall of a drop).
  for (const end of ['front', 'rear']) {
    const load = v[`${end}Load`];
    if (load > 0) p[`${end}Touched`] = true;
    else if (p[`${end}Touched`]) p[`${end}Airborne`] += dt;
  }
  return p;
}

// Table rows. `value` (display units, a number or an array of numbers) is what the A/B
// difference marking compares; a row's values turn green in every panel when any of them
// differ by more than max(tol, 1%). Peak rows read `t.peaks` (null until the first sample).
const SECTIONS = [
  ['Front suspension', [
    { label: 'Static sag', tol: 0.5, value: (t) => t.staticSag * 1000, text: (t) => withPct(t.staticSag, t.travel) },
    { label: 'Travel used', tol: 0.5, value: (t) => Math.max(0, t.s) * 1000, text: (t) => withPct(Math.max(0, t.s), t.travel) },
    { bottomed: 'front' },
  ]],
  ['Rear suspension', [
    { label: 'Static sag', tol: 0.5, value: (t) => t.rearStaticSag * 1000, text: (t) => withPct(t.rearStaticSag, t.rearTravel) },
    { label: 'Wheel travel used', tol: 0.5, value: (t) => Math.max(0, t.r) * 1000, text: (t) => withPct(Math.max(0, t.r), t.rearTravel) },
    { label: 'Shock stroke', tol: 0.5, value: (t) => Math.max(0, t.shockStroke) * 1000, text: (t) => `${mm(Math.max(0, t.shockStroke))} mm` },
    { label: 'Leverage ratio', tol: 0.01, value: (t) => t.leverageRatio, text: (t) => `${t.leverageRatio.toFixed(2)}:1` },
    { bottomed: 'rear' },
  ]],
  ['Chassis', [
    { label: 'Pitch', tol: 0.05, value: (t) => deg(t.pitch), text: (t) => `${deg(t.pitch).toFixed(2)}°` },
    { label: 'Wheelbase', tol: 0.5, value: (t) => t.wheelbase * 1000,
      text: (t) => `${(t.wheelbase * 1000).toFixed(0)} mm (static ${(t.staticWheelbase * 1000).toFixed(0)})` },
    { label: 'Trail', tol: 0.5, value: (t) => t.trail * 1000, text: (t) => `${(t.trail * 1000).toFixed(1)} mm` },
    { label: 'Ground clearance', tol: 0.5, value: (t) => t.groundClearance * 1000,
      text: (t) => `${(t.groundClearance * 1000).toFixed(0)} mm` },
  ]],
  ['Peaks (since drop / reset)', [
    peakRow('Max front travel', 0.5, (p) => p.front * 1000, (p, t) => withPct(p.front, t.travel)),
    peakRow('Max rear travel', 0.5, (p) => p.rear * 1000, (p, t) => withPct(p.rear, t.rearTravel)),
    peakRow('Peak rider g', 0.02, (p) => p.riderG, (p) => `${p.riderG.toFixed(2)} g`),
    peakRow('Front airborne', 2, (p) => p.frontAirborne * 1000, (p) => `${(p.frontAirborne * 1000).toFixed(0)} ms`),
    peakRow('Rear airborne', 2, (p) => p.rearAirborne * 1000, (p) => `${(p.rearAirborne * 1000).toFixed(0)} ms`),
    peakRow('Fork speed (comp / reb)', 0.01, (p) => [p.forkComp, p.forkReb], (p) => speedPair(p.forkComp, p.forkReb)),
    peakRow('Shock speed (comp / reb)', 0.01, (p) => [p.shockComp, p.shockReb], (p) => speedPair(p.shockComp, p.shockReb)),
  ]],
];

// Smallest 1, 2, 2.5 or 5 × 10ⁿ at or above v (0 when v ≤ 0).
function niceCeil(v) {
  if (!(v > 0)) return 0;
  const p = 10 ** Math.floor(Math.log10(v));
  return [1, 2, 2.5, 5, 10].find((m) => m * p >= v * (1 - 1e-9)) * p;
}

const pct = (v) => `${Math.round(v * 100)}%`;

// Rolling graphs, in display order. Each has one or more stacked sub-plots reading
// `key` from SuspensionSim.graphValues(). `range(lo, hi)` turns the extremes in the
// window into the axis; `marks` are the labelled values (`strong` draws a solid line),
// `dashed` the marks that get a dashed reference line.
const travelPlot = (key, title) => ({
  key, title, range: () => [0, 1.15], marks: () => [{ v: 0 }, { v: 1 }], dashed: [0, 1], format: pct,
});
const loadPlot = (key, title) => ({
  key, title,
  range: (lo, hi) => [0, Math.max(1.5, niceCeil(hi))],
  marks: (lo, hi) => [{ v: 0, strong: true }, { v: 1 }, { v: hi }],
  dashed: [1],
  format: pct,
});
const speedPlot = (key, title) => ({
  key, title,
  range: (lo, hi) => {
    const m = Math.max(1, niceCeil(Math.max(-lo, hi)));
    return [-m, m];
  },
  marks: (lo, hi) => [{ v: lo }, { v: 0, strong: true }, { v: hi }],
  format: (v) => `${+v.toFixed(2)}`,
});

const GRAPHS = [
  { plots: [travelPlot('front', 'Front travel'), travelPlot('rear', 'Rear wheel travel')] },
  { plots: [{
    key: 'riderG', title: 'Rider g (at the seat)',
    range: (lo, hi) => [lo < 0 ? -niceCeil(-lo) : 0, Math.max(3, niceCeil(hi))],
    marks: (lo, hi) => [...(lo < 0 ? [{ v: lo }] : []), { v: 0 }, { v: 1 }, { v: hi }],
    dashed: [1],
    format: (v) => `${+v.toFixed(1)} g`,
  }] },
  { plots: [loadPlot('frontLoad', 'Front tire load'), loadPlot('rearLoad', 'Rear tire load')] },
  { plots: [speedPlot('forkSpeed', 'Fork shaft speed (m/s)'), speedPlot('shockSpeed', 'Shock shaft speed (m/s)')] },
];

function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

export class Readouts {
  /**
   * `rigs`: [{ id, color, sim }], `panelEls`: one readout panel per rig, `graphContainer`:
   * holds the shared legend / caption and the graph grid; one line per rig in every graph.
   */
  constructor(panelEls, graphContainer, rigs) {
    this.rigs = rigs;
    this.samples = rigs.map(() => []);
    this.lastSampleTime = -Infinity;
    this.bottomedUntil = rigs.map(() => ({ front: 0, rear: 0 }));
    this.peaks = rigs.map(() => null);

    this.buildTables(panelEls);
    this.buildGraphs(graphContainer);
  }

  /** One two-column (label | value) table per rig; each row keeps its elements across all panels. */
  buildTables(panelEls) {
    const tables = this.rigs.map((rig, i) => {
      panelEls[i].style.borderLeftColor = rig.color;
      const head = el('div', 'head', `Bike ${rig.id}`);
      head.style.color = rig.color;
      const table = el('div', 'table');
      panelEls[i].replaceChildren(head, table);
      return table;
    });

    this.rows = [];
    for (const [title, rows] of SECTIONS) {
      for (const table of tables) table.append(el('h1', null, title));
      for (const row of rows) {
        const labels = row.bottomed ? [] : tables.map(() => el('span', 'label', row.label));
        const cells = tables.map(() => (row.bottomed
          ? el('span', 'bottomed', 'BOTTOMED')
          : el('span', 'value', '–')));
        tables.forEach((table, i) => table.append(...(labels[i] ? [labels[i]] : []), cells[i]));
        this.rows.push({ ...row, labels, cells });
      }
    }
  }

  /** Clear every bike's peaks; call on Drop and Reset. */
  resetPeaks() {
    this.peaks = this.rigs.map(() => null);
  }

  /** Record peaks and graph samples; call after every physics substep (all sims share one clock). */
  sample() {
    // Latch bottoming per substep so brief bump-stop contacts between frames still show.
    const holdUntil = performance.now() / 1000 + READOUTS.bottomedHoldTime;
    this.rigs.forEach(({ sim }, i) => {
      if (sim.isBottomed(sim.state.s)) this.bottomedUntil[i].front = holdUntil;
      if (sim.isRearBottomed(sim.state.r)) this.bottomedUntil[i].rear = holdUntil;
      this.peaks[i] = updatePeaks(this.peaks[i], sim, PHYSICS.dt);
    });

    const time = this.rigs[0].sim.time;
    if (time - this.lastSampleTime < READOUTS.graphSampleInterval) return;
    this.lastSampleTime = time;
    const cutoff = time - READOUTS.graphWindow;
    this.rigs.forEach(({ sim }, i) => {
      const samples = this.samples[i];
      samples.push({ time, ...sim.graphValues() });
      while (samples.length && samples[0].time < cutoff) samples.shift();
    });
  }

  /** Refresh the tables and redraw the graphs; call once per animation frame. */
  update() {
    const telemetry = this.rigs.map(({ sim }, i) => ({ ...sim.telemetry(), peaks: this.peaks[i] }));
    const now = performance.now() / 1000;

    for (const row of this.rows) {
      if (row.bottomed) {
        row.cells.forEach((cell, i) => cell.classList.toggle('active', now < this.bottomedUntil[i][row.bottomed]));
        continue;
      }
      telemetry.forEach((t, i) => { row.cells[i].textContent = row.text(t); });
      const [a, b] = telemetry.map((t) => [row.value(t)].flat());
      const differs = a.some((va, k) => {
        const vb = b[k];
        return Math.abs(va - vb) > Math.max(row.tol, 0.01 * Math.max(Math.abs(va), Math.abs(vb)));
      });
      for (const cell of row.cells) cell.classList.toggle('differs', differs);
    }

    const tEnd = telemetry[0].time;
    for (const graph of this.graphs) this.drawGraph(graph, tEnd);
  }

  /** One canvas per graph in GRAPHS order, plus the shared legend. */
  buildGraphs(container) {
    const legend = container.querySelector('.graph-legend');
    legend.replaceChildren(...this.rigs.map((rig) => {
      const item = el('span', null, `■ Bike ${rig.id}`);
      item.style.color = rig.color;
      return item;
    }));
    container.querySelector('.graph-caption').textContent = `last ${READOUTS.graphWindow} s`;

    const grid = container.querySelector('.graph-grid');
    this.graphs = GRAPHS.map((def) => {
      const canvas = el('canvas');
      grid.append(canvas);
      const graph = { def, canvas, ctx: canvas.getContext('2d'), width: 0, height: 0 };
      new ResizeObserver(() => resizeCanvas(graph)).observe(canvas);
      return graph;
    });
  }

  /** Extremes of `key` across every bike's samples in the window. */
  extent(key) {
    let lo = Infinity, hi = -Infinity;
    for (const samples of this.samples) {
      for (const s of samples) {
        if (s[key] < lo) lo = s[key];
        if (s[key] > hi) hi = s[key];
      }
    }
    return lo <= hi ? [lo, hi] : [0, 0];
  }

  drawGraph({ def, ctx, width: w, height: h }, tEnd) {
    if (!w || !h) return;
    const pad = { l: 40, r: 8, t: 16, b: 6 };
    const gap = 18;
    const n = def.plots.length;
    const pw = w - pad.l - pad.r;
    const ph = (h - pad.t - pad.b - gap * (n - 1)) / n;
    const tStart = tEnd - READOUTS.graphWindow;
    const xOf = (time) => pad.l + ((time - tStart) / READOUTS.graphWindow) * pw;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, w, h);
    ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';

    // Stacked sub-plots, each with every bike overlaid on a shared axis.
    def.plots.forEach((plot, p) => {
      const top = pad.t + p * (ph + gap);
      const [lo, hi] = plot.range(...this.extent(plot.key));
      const yOf = (v) => top + ph - ((Math.min(Math.max(v, lo), hi) - lo) / (hi - lo)) * ph;
      const marks = plot.marks(lo, hi);

      // Reference lines: dashed, or solid and brighter when emphasised.
      ctx.lineWidth = 1;
      for (const { v, strong } of marks) {
        if (!strong && !plot.dashed?.includes(v)) continue;
        ctx.strokeStyle = strong ? COLORS.strong : COLORS.limit;
        ctx.setLineDash(strong ? [] : [5, 4]);
        ctx.beginPath();
        ctx.moveTo(pad.l, yOf(v));
        ctx.lineTo(pad.l + pw, yOf(v));
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Draw B first so A stays visible where the lines coincide.
      for (let i = this.rigs.length - 1; i >= 0; i--) {
        ctx.strokeStyle = this.rigs[i].color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        this.samples[i].forEach((s, j) => {
          const x = xOf(s.time), y = yOf(s[plot.key]);
          if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }

      ctx.fillStyle = COLORS.axis;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'right';
      for (const { v } of marks) ctx.fillText(plot.format(v), pad.l - 5, yOf(v));
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'left';
      ctx.fillText(plot.title, pad.l, top - 2);
    });
  }
}

function resizeCanvas(graph) {
  const dpr = window.devicePixelRatio || 1;
  const { width, height } = graph.canvas.getBoundingClientRect();
  graph.canvas.width = width * dpr;
  graph.canvas.height = height * dpr;
  graph.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  graph.width = width;
  graph.height = height;
}
