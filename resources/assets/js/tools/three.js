import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

window.THREE = require('three')
window.THREE.OrbitControls = OrbitControls
window.THREE.GUI = GUI
window.THREE.OBJLoader = OBJLoader