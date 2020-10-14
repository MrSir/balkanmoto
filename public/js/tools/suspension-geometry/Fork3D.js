class Fork3D {
    x = 0
    y = 0
    radius = 37
    static radiusSegments = 32
    static heightSegments = 1

    constructor(
        floorY,
        diameter,
        width,
        length,
        offset,
        stemLength,
        tripleTreeRake
    ) {
        this.floorY = floorY
        this.radius = diameter / 2
        this.width = width
        this.length = length
        this.offset = offset
        this.stemLength = stemLength
        this.tripleTreeRake = tripleTreeRake

        this.forkMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333333,
            depthWrite: true,
            transparent: false,
            opacity: 0.25,
        })

        this.forkTubeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffd700,
            emissive: 0x000000,
            metalness: 0.7,
            flatShading: false,
            roughness: 0.5,
            reflectivity: 1,
            clearcoat: 0.7,
            transparent: false,
            opacity: 0.25,
        })
    }

    get tripleTreeRakeInRadians() {
        return THREE.MathUtils.degToRad(this.tripleTreeRake)
    }

    setTransparency(toggle) {
        this.forkTubeMaterial.transparent = toggle
        this.forkMaterial.transparent = toggle

        return this
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

    setStemLength(stemLength) {
        this.stemLength = stemLength
        return this
    }

    setTripleTreeRake(tripleTreeRake) {
        this.tripleTreeRake = tripleTreeRake
        return this
    }

    setParameters(parameters) {
        this.setRadius(parameters.fork.diameter / 2)
            .setLength(parameters.fork.length)
            .setOffset(parameters.fork.offset)
            .setWidth(parameters.fork.width)
            .setStemLength(parameters.stemLength)
            .setTripleTreeRake(parameters.fork.tripleTreeRake)

        return this
    }

    setVerticalStemAngle(verticalStemAngle) {
        this.verticalStemAngle = verticalStemAngle
        return this
    }

    setForkTripleTreeBaseOffset(forkTripleTreeBaseOffset) {
        this.forkTripleTreeBaseOffset = forkTripleTreeBaseOffset
        return this
    }

    setFrameStemTopHeight(frameStemTopHeight) {
        this.frameStemTopHeight = frameStemTopHeight
        return this
    }

    calculateFork(frame) {
        this.setX(frame.frontTire.x)
            .setY(frame.frontTire.y)
            .setVerticalStemAngle(frame.verticalStemAngle)
            .setForkTripleTreeBaseOffset(frame.forkTripleTreeBaseOffset)
            .setFrameStemTopHeight(frame.frameStemTopHeight)

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
        this.forkLeftCylinder.position.set(0, this.length / 2, -this.width / 2)
        //this.forkLeftCylinder.rotateZ(this.tripleTreeRakeInRadians)

        this.forkRightCylinder = new THREE.Mesh(
            this.forkCylinderGeometry,
            this.forkTubeMaterial
        )
        this.forkRightCylinder.castShadow = true
        this.forkRightCylinder.position.set(0, this.length / 2, this.width / 2)

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
        this.wheelAxle.position.set(0, 0, 0)

        this.forkStemGeometry = new THREE.CylinderGeometry(
            this.radius,
            this.radius,
            this.stemLength,
            Fork3D.radiusSegments,
            Fork3D.heightSegments
        )
        this.forkStem = new THREE.Mesh(this.forkStemGeometry, this.forkMaterial)
        this.forkStem.castShadow = true

        let stemAxleLength =
            Math.cos(this.tripleTreeRakeInRadians) * this.length
        let YBasedOnDimensions = stemAxleLength - this.stemLength / 2
        let topDiff = this.frameStemTopHeight - YBasedOnDimensions
        this.forkStem.position.set(
            0 - (this.offset + this.forkTripleTreeBaseOffset),
            this.frameStemTopHeight - topDiff,
            0
        )

        this.pivot = new THREE.Group()
        this.pivot.position.set(this.x, this.y, 0)
        //this.pivot.add(this.forkLeftCylinder)
        //this.pivot.add(this.forkRightCylinder)
        this.pivot.add(this.wheelAxle)
        this.pivot.add(this.forkStem)
        this.pivot.rotateZ(this.verticalStemAngle)

        this.pivot2 = new THREE.Group()
        this.pivot2.position.set(this.x, this.y, 0)
        this.pivot2.add(this.forkLeftCylinder)
        this.pivot2.add(this.forkRightCylinder)
        this.pivot2.add(this.wheelAxle)
        //this.pivot2.add(this.forkStem)
        this.pivot2.rotateZ(
            this.verticalStemAngle + this.tripleTreeRakeInRadians
        )

        return this
    }

    removeFromObject(object) {
        // object.remove(this.forkLeftCylinder)
        // object.remove(this.forkRightCylinder)
        // object.remove(this.wheelAxle)
        // object.remove(this.forkStem)
        object.remove(this.pivot)
        object.remove(this.pivot2)
    }

    addToObject(object) {
        // object.add(this.forkLeftCylinder)
        // object.add(this.forkRightCylinder)
        // object.add(this.wheelAxle)
        //object.add(this.forkStem)
        object.add(this.pivot)
        object.add(this.pivot2)
    }
}
