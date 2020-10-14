class SceneInitializer {
    camera

    constructor(scene, container, floorY) {
        this.scene = scene
        this.container = container
        this.floorY = floorY
    }

    addCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.offsetWidth / this.container.offsetHeight,
            0.01,
            100000
        )
        this.camera.position.set(0, 500, 2500)

        return this
    }

    addRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight)
        this.renderer.shadowMap.enabled = true
        this.container.appendChild(this.renderer.domElement)

        return this
    }

    addOrbitalControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.25
        this.controls.minDistance = 1000
        this.controls.maxDistance = 100000

        return this
    }

    addLights() {
        let hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
        hemiLight.position.set(0, 20, 0)
        this.scene.add(hemiLight)

        let dirLight = new THREE.DirectionalLight(0xffffff)
        dirLight.position.set(200, 500, 1500)
        dirLight.castShadow = true
        dirLight.shadow.camera.top = 5000
        dirLight.shadow.camera.bottom = -5000
        dirLight.shadow.camera.left = -5000
        dirLight.shadow.camera.right = 5000
        dirLight.shadow.camera.near = 0.01
        dirLight.shadow.camera.far = 100000
        this.scene.add(dirLight)

        return this
    }

    addFloor() {
        let floor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(100000, 100000),
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

    addOrigin() {
        let axisGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-100, 0, 0),
            new THREE.Vector3(100, 0, 0),
        ])
        let axisMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
        let xAxis = new THREE.Line(axisGeometry, axisMaterial)
        let yAxis = new THREE.Line(axisGeometry, axisMaterial)
        let zAxis = new THREE.Line(axisGeometry, axisMaterial)

        yAxis.rotateZ(Math.PI / 2)
        zAxis.rotateY(Math.PI / 2)

        this.scene.add(xAxis, yAxis, zAxis)

        return this
    }

    initializeScene() {
        this.scene.background = new THREE.Color(0xa0a0a0)
        this.scene.fog = new THREE.Fog(0xa0a0a0, 0.01, 10000)

        this.addCamera().addRenderer().addOrbitalControls().addLights().addFloor()
        //.addOrigin()
    }
}
