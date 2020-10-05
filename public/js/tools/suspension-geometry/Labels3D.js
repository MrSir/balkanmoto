class Labels3D {
    constructor(scene, renderer, camera, floorY, rearTire, frontTire) {
        this.scene = scene
        this.renderer = renderer
        this.camera = camera
        this.floorY = floorY
        this.rearTire = rearTire
        this.frontTire = frontTire

        this.blueMaterial = new THREE.LineBasicMaterial({
            color: 0x0000ff,
        })
    }

    calculatePoints() {
        this.wheelbasePoints = [
            new THREE.Vector3(this.rearTire.x, this.floorY + 1, 0),
            new THREE.Vector3(this.rearTire.x, this.floorY + 1, 200),
            new THREE.Vector3(this.frontTire.x, this.floorY + 1, 200),
            new THREE.Vector3(this.frontTire.x, this.floorY + 1, 0),
        ]

        return this
    }

    buildLabels() {
        let wheelbaseGeometry = new THREE.BufferGeometry().setFromPoints(
            this.wheelbasePoints
        )
        this.wheelbase = new THREE.Line(wheelbaseGeometry, this.blueMaterial)
        this.scene.add(this.wheelbase)

        return this
    }

    removeFromScene() {
        this.scene.remove(this.wheelbase)
    }

    redrawInScene() {
        this.removeFromScene()

        this.calculatePoints().buildLabels()
        this.renderer.render(this.scene, this.camera)
    }
}
