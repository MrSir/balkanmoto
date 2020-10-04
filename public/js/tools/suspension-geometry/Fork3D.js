class Fork3D {
    x = 0
    y = 0
    radius = 37
    static radiusSegments = 32
    static heightSegments = 1

    constructor(
        scene,
        renderer,
        camera,
        floorY,
        diameter,
        width,
        length,
        offset,
        stemHeight,
        frontTire
    ) {
        this.scene = scene
        this.renderer = renderer
        this.camera = camera
        this.floorY = floorY
        this.radius = diameter / 2
        this.width = width
        this.length = length
        this.offset = offset
        this.stemHeight = stemHeight
        this.frontTire = frontTire

        this.forkMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333333,
            depthWrite: true,
        })

        this.forkTubeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffd700,
            emissive: 0x000000,
            metalness: 0.7,
            flatShading: false,
            roughness: 0.5,
            reflectivity: 1,
            clearcoat: 0.7,
        })
    }

    setX(x) {
        this.x = x
        return this
    }

    setY(y) {
        this.y = y
        return this
    }

    setRadius(radius) {
        this.radius = radius
        return this
    }

    setWidth(width) {
        this.width = width
        return this
    }

    setLength(length) {
        this.length = length
        return this
    }

    setOffset(offset) {
        this.offset = offset
        return this
    }

    setRake(rake) {
        this.rake = rake
        return this
    }

    setStemHeight(stemHeight) {
        this.stemHeight = stemHeight
        return this
    }

    calculateFork() {
        this.setX(this.frontTire.x)
        this.setY(this.frontTire.y + this.length / 2)

        return this
    }

    buildFork() {
        this.forkCylinderGeometry = new THREE.CylinderGeometry(
            this.radius,
            this.radius,
            this.length,
            Fork3D.radiusSegments,
            Fork3D.heightSegments
        )

        this.forkLeftCylinder = new THREE.Mesh(
            this.forkCylinderGeometry,
            this.forkTubeMaterial
        )
        this.forkLeftCylinder.castShadow = true
        this.forkLeftCylinder.position.set(this.x, this.y, -this.width / 2)

        this.forkRightCylinder = new THREE.Mesh(
            this.forkCylinderGeometry,
            this.forkTubeMaterial
        )
        this.forkRightCylinder.castShadow = true
        this.forkRightCylinder.position.set(this.x, this.y, this.width / 2)

        this.wheelAxleGeometry = new THREE.CylinderGeometry(
            10,
            10,
            this.width,
            Fork3D.radiusSegments,
            Fork3D.heightSegments
        )
        this.wheelAxle = new THREE.Mesh(
            this.wheelAxleGeometry,
            this.forkMaterial
        )
        this.wheelAxle.castShadow = true
        this.wheelAxle.rotation.x = -Math.PI / 2
        this.wheelAxle.position.set(this.x, this.y - this.length / 2, 0)

        this.forkStemGeometry = new THREE.CylinderGeometry(
            this.radius,
            this.radius,
            this.stemHeight,
            Fork3D.radiusSegments,
            Fork3D.heightSegments
        )
        this.forkStem = new THREE.Mesh(this.forkStemGeometry, this.forkMaterial)
        this.forkStem.castShadow = true
        this.forkStem.position.set(
            this.x - this.offset,
            this.y + this.length / 2 - this.stemHeight / 2,
            0
        )

        return this
    }

    removeFromScene() {
        this.scene.remove(this.forkLeftCylinder)
        this.scene.remove(this.forkRightCylinder)
        this.scene.remove(this.wheelAxle)
        this.scene.remove(this.forkStem)
    }

    addToScene() {
        this.scene.add(this.forkLeftCylinder)
        this.scene.add(this.forkRightCylinder)
        this.scene.add(this.wheelAxle)
        this.scene.add(this.forkStem)
    }

    redrawInScene() {
        this.removeFromScene()

        this.calculateFork().buildFork()

        this.addToScene()
        this.renderer.render(this.scene, this.camera)
    }
}
