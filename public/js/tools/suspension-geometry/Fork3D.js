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
        rake,
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
        this.rake = rake
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
        this.setY(this.length / 2)

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
        this.forkLeftCylinder.position.set(0, this.y, -this.width / 2)

        this.forkRightCylinder = new THREE.Mesh(
            this.forkCylinderGeometry,
            this.forkTubeMaterial
        )
        this.forkRightCylinder.castShadow = true
        this.forkRightCylinder.position.set(0, this.y, this.width / 2)

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
        this.wheelAxle.rotateX(THREE.MathUtils.degToRad(90))
        this.wheelAxle.position.set(0, this.y - this.length / 2, 0)

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
            -this.offset,
            this.length - this.stemHeight / 2,
            0
        )

        this.pivot = new THREE.Group()
        this.pivot.position.set(this.x, this.frontTire.y, 0)
        this.pivot.add(this.forkLeftCylinder)
        this.pivot.add(this.forkRightCylinder)
        this.pivot.add(this.wheelAxle)
        this.pivot.add(this.forkStem)
        this.pivot.rotateZ(THREE.MathUtils.degToRad(this.rake))

        this.scene.add(this.pivot)

        return this
    }

    removeFromScene() {
        this.pivot.remove(this.forkLeftCylinder)
        this.pivot.remove(this.forkRightCylinder)
        this.pivot.remove(this.wheelAxle)
        this.pivot.remove(this.forkStem)
        this.scene.remove(this.pivot)
    }

    redrawInScene() {
        this.removeFromScene()

        this.calculateFork().buildFork()
        this.renderer.render(this.scene, this.camera)
    }
}
