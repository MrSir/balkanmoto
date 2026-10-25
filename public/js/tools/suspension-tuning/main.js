// Entry point: builds two bike "rigs" (params, simulation, model, GUI) side by side,
// wires the shared controls and readouts, and runs a fixed-timestep loop.

import { PHYSICS, BIKES, defaultParams, defaultShared } from './config.js';
import { SuspensionSim } from './physics.js';
import { createScene } from './scene.js';
import { BikeModel } from './bikeModel.js';
import { createBikeGui, createSharedGui, refresh } from './gui.js';
import { Readouts } from './readouts.js';

const lab = document.getElementById('lab');
const view = createScene(lab.querySelector('.viewport'));
const shared = defaultShared();

const rigs = BIKES.map((bike) => {
  const params = defaultParams();
  return {
    ...bike,
    params,
    sim: new SuspensionSim(params),
    model: new BikeModel(view.scene, { offsetZ: bike.offsetZ, color: bike.color, label: bike.id }),
  };
});

// Screen columns: A on the left, B on the right, each holding readouts then GUI.
const columns = [...lab.querySelectorAll('.column')];

rigs.forEach((rig, i) => {
  const other = rigs[1 - i];
  rig.gui = createBikeGui(rig.params, {
    title: `Bike ${rig.id}`,
    color: rig.color,
    container: columns[i],
    copyLabel: `⇆ Copy ${other.id} → ${rig.id}`,
  }, {
    onParamsChange: () => rig.sim.setParams(rig.params),
    onCopy: () => {
      Object.assign(rig.params, other.params);
      refresh(rig.gui);
      rig.sim.setParams(rig.params);
    },
  });
});

const graphs = lab.querySelector('.graphs');
const readouts = new Readouts(
  columns.map((column) => column.querySelector('.readouts')),
  graphs,
  rigs,
);

createSharedGui(shared, { container: lab.querySelector('.shared') }, {
  onDrop: () => {
    rigs.forEach((rig) => rig.sim.drop(shared.dropHeight));
    readouts.resetPeaks();
  },
  onReset: () => {
    rigs.forEach((rig) => rig.sim.resetToEquilibrium());
    readouts.resetPeaks();
  },
});
// Keep the bikes in view above the graphs.
new ResizeObserver(() => view.setBottomInset(graphs.offsetHeight + 12)).observe(graphs);

// Full-screen toggle: the container expands to fill the browser window (CSS only).
const fullscreenButton = lab.querySelector('.fullscreen-toggle');
function setFullscreen(on) {
  lab.classList.toggle('fullscreen', on);
  document.body.classList.toggle('lab-fullscreen', on);
  fullscreenButton.textContent = on ? '✕ Exit full screen' : '⛶ Full screen';
}
fullscreenButton.addEventListener('click', () => setFullscreen(!lab.classList.contains('fullscreen')));
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lab.classList.contains('fullscreen')) setFullscreen(false);
});

let lastFrame = performance.now();
let accumulator = 0;

function frame(now) {
  const realDt = Math.min((now - lastFrame) / 1000, PHYSICS.maxFrameTime);
  lastFrame = now;

  // Both sims take the same substeps, so their simulated times stay identical.
  accumulator += realDt * shared.timeScale;
  while (accumulator >= PHYSICS.dt) {
    for (const rig of rigs) rig.sim.step(PHYSICS.dt);
    readouts.sample();
    accumulator -= PHYSICS.dt;
  }

  for (const rig of rigs) rig.model.update(rig.sim);
  readouts.update();
  view.render();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
