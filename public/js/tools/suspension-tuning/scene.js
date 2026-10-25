// Renderer, camera, lights, ground and camera controls.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createScene(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdde3e8);

  // Front view: bikes run along x (front toward +x), side by side in z. The camera sits
  // ahead of the forks on the centreline, looking back and down between the two bikes.
  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 100);
  camera.position.set(3.8, 1.8, 0);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.45, 0);
  controls.enableDamping = true;
  controls.update();

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(2, 5, 3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -3.5, right: 3.5, top: 3.5, bottom: -3.5, near: 0.5, far: 15 });
  scene.add(sun);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ color: 0x8a8f94, roughness: 0.95 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(40, 80, 0x555555, 0x6f7479);
  grid.position.y = 0.001;
  scene.add(grid);

  // Follow the container's size (small widget or full screen). The image is shifted up by
  // half the bottom inset (the graphs' height) so the bikes sit centred in the area above it.
  let bottomInset = 0;
  function resize() {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.setViewOffset(w, h, 0, bottomInset / 2, w, h);
    renderer.setSize(w, h);
  }
  resize();
  new ResizeObserver(resize).observe(container);

  return {
    scene,
    /** Height (px) covered by overlays at the bottom of the view. */
    setBottomInset(px) {
      bottomInset = px;
      resize();
    },
    render() {
      controls.update();
      renderer.render(scene, camera);
    },
  };
}
