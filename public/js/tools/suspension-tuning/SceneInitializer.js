import * as THREE from 'three';
import * as THREE_Addons from 'three/addons';

export class SceneInitializer {
    constructor(scene, container, floorY) {
        this.camera = null
        this.scene = scene
        this.container = container
        this.floorY = floorY
    }

    addCamera() {
        this.camera = new THREE.PerspectiveCamera(
            50,
            this.container.offsetWidth / this.container.offsetHeight,
            100,
            10000
        )
        this.camera.position.set(0, 500, 2500)
        this.camera.rotation.order = "YZX"

        return this
    }

    addRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', shadows: true })
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight)
        this.renderer.shadowMap.enabled = true
        this.container.appendChild(this.renderer.domElement)

        return this
    }

    addOrbitalControls() {
        this.controls = new THREE_Addons.OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.25
        this.controls.minDistance = 500
        this.controls.maxDistance = 100000

        return this
    }

    addLights() {
        let dirLight = new THREE.DirectionalLight(0xffffff)
        dirLight.position.set(0, 1000, 1500)
        dirLight.castShadow = true
        dirLight.shadow.camera.top = 5000
        dirLight.shadow.camera.bottom = -5000
        dirLight.shadow.camera.left = -5000
        dirLight.shadow.camera.right = 5000
        dirLight.shadow.camera.near = 0.01
        dirLight.shadow.camera.far = 100000
        this.scene.add(dirLight)

        const ambientLight = new THREE.AmbientLight( 0x000000 );
        this.scene.add( ambientLight );

        const light1 = new THREE.DirectionalLight( 0xffffff, 1 );
        light1.position.set( 0, 500, 2000 );
        this.scene.add( light1 );

        const light2 = new THREE.DirectionalLight( 0xffffff, 1 );
        light2.position.set( 1500, 500, 2000 );
        this.scene.add( light2 );

        const light3 = new THREE.DirectionalLight( 0xffffff, 1 );
        light3.position.set( - 1500, - 500, 2000 );
        this.scene.add( light3 );

        return this
    }

    addFloor() {
        let floor = new THREE.Mesh(
            new THREE.PlaneGeometry(20000, 20000),
            new THREE.MeshPhongMaterial({
                color: 0xaaaaaaaaa,
                depthWrite: false,
            })
        )
        floor.rotation.x = -Math.PI / 2
        floor.position.y = this.floorY
        floor.receiveShadow = true
        this.scene.add(floor)

        return this
    }

    initializeScene() {
        this.scene.background = new THREE.Color(0xa0a0a0)
        this.scene.fog = new THREE.Fog(0xa0a0a0, 2500, 8000)

        this.addCamera().addRenderer().addOrbitalControls().addLights().addFloor()
    }
}

export default {}