// lil-gui control panels: one per bike plus a shared one. Each mutates its params
// object in place and notifies via callbacks.

import GUI from 'three/addons/libs/lil-gui.module.min.js';
import { PARAM_DEFS, SHARED_DEFS } from './config.js';

const FOLDERS = {
  'Front tire': ['frontWidth', 'frontAspect', 'frontRim'],
  'Rear tire': ['rearWidth', 'rearAspect', 'rearRim'],
  'Front suspension': ['springRate', 'compression', 'rebound', 'forkOil', 'preload', 'forkHeight'],
  'Rear suspension': ['shockSpring', 'shockPreload', 'shockCompression', 'shockRebound'],
  'Load': ['bikeMass', 'riderMass', 'frontBias'],
};

function addSlider(folder, defs, params, key, onChange) {
  const def = defs[key];
  return folder.add(params, key, def.min, def.max, def.step).name(def.label).onChange(onChange);
}

/**
 * Per-bike panel, appended to `container` (the bike's screen column, below its readouts).
 * Folders start collapsed. Returns the GUI; call `refresh(gui)` after changing its params from code.
 */
export function createBikeGui(params, { title, color, container, copyLabel }, { onParamsChange, onCopy }) {
  const gui = new GUI({ title, container }); // width comes from the column (CSS)
  gui.$title.style.background = color;
  gui.$title.style.color = '#fff';

  for (const [folderTitle, keys] of Object.entries(FOLDERS)) {
    const folder = gui.addFolder(folderTitle).close();
    for (const key of keys) addSlider(folder, PARAM_DEFS, params, key, onParamsChange);
  }
  gui.add({ copy: onCopy }, 'copy').name(copyLabel);

  return gui;
}

export function refresh(gui) {
  for (const c of gui.controllersRecursive()) c.updateDisplay();
}

/** Shared panel (top-centre of `container`): drop test for both bikes and simulation speed. */
export function createSharedGui(shared, { container }, { onDrop, onReset }) {
  const gui = new GUI({ title: 'Both bikes', container, width: 220 });

  addSlider(gui, SHARED_DEFS, shared, 'dropHeight');
  gui.add({ drop: onDrop }, 'drop').name('⬇ Drop');
  gui.add({ reset: onReset }, 'reset').name('↺ Reset');
  addSlider(gui, SHARED_DEFS, shared, 'timeScale');

  return gui;
}
