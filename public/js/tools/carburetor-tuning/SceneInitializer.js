class SceneInitializer {
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
        this.camera.position.set(200, 500, 2500)

        return this
    }

    addRenderer() {
        this.renderer = new THREE.WebGLRenderer(
            {
                antialias: true,
                powerPreference: 'high-performance',
                shadows: false
            }
        )
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight)
        this.renderer.shadowMap.enabled = false
        this.container.appendChild(this.renderer.domElement)

        return this
    }

    initializeScene() {
        this.scene.background = new THREE.Color(0xCCCCCC)
        // this.scene.fog = new THREE.Fog(0xa0a0a0, 2500, 8000)

        this.addCamera()
            .addRenderer()
            // .addOrbitalControls()
            // .addLights()
            // .addFloor()
            // .addOrigin()
    }
}
