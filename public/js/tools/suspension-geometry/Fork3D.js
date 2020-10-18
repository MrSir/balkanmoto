class Fork3D {
    static radiusSegments = 32
    static heightSegments = 1
    static stemRadius = 12

    constructor(floorY, parameters) {
        this.x = 0
        this.y = 0

        this.radius = 37
        this.floorY = floorY

        this.setParameters(parameters)

        // this.radius = diameter / 2
        // this.width = width
        // this.length = length
        // this.parameters.tripleTree.offset = offset
        // this.stemLength = stemLength
        // this.tripleTreeRake = tripleTreeRake

        this.forkMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333333,
            transparent: false,
            opacity: 0.25,
            depthWrite: true,
            depthTest: true,
        })

        this.tripleTreeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xc4c4c4,
            roughness: 0.5,
            metalness: 0.2,
            transparent: false,
            opacity: 0.25,
            depthWrite: true,
            depthTest: true,
            //wireframe: true,
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
            depthWrite: true,
            depthTest: true,
        })
    }

    get tripleTreeRakeInRadians() {
        return THREE.MathUtils.degToRad(this.parameters.tripleTree.rake)
    }

    setTransparency(toggle) {
        this.forkTubeMaterial.transparent = toggle
        this.tripleTreeMaterial.transparent = toggle
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

    setParameters(parameters) {
        this.parameters = parameters
        this.setRadius(parameters.fork.diameter / 2)
            .setLength(parameters.fork.length)
            .setOffset(parameters.fork.offset)
            .setWidth(parameters.fork.width)
            .setStemLength(parameters.stemLength)

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

    buildForkTube(zCoordinate) {
        let geometry = new THREE.CylinderGeometry(
            this.radius,
            this.radius,
            this.length,
            Fork3D.radiusSegments,
            Fork3D.heightSegments
        )

        let mesh = new THREE.Mesh(geometry, this.forkTubeMaterial)
        mesh.castShadow = true
        mesh.position.set(0, this.length / 2, zCoordinate)

        return mesh
    }

    buildWheelAxle() {
        let geometry = new THREE.CylinderGeometry(10, 10, this.width, Fork3D.radiusSegments, Fork3D.heightSegments)

        let mesh = new THREE.Mesh(geometry, this.forkMaterial)
        mesh.castShadow = true
        mesh.rotateX(THREE.MathUtils.degToRad(90))
        mesh.position.set(0, 0, 0)

        return mesh
    }

    buildForkStem() {
        let geometry = new THREE.CylinderGeometry(
            Fork3D.stemRadius,
            Fork3D.stemRadius,
            this.stemLength,
            Fork3D.radiusSegments,
            Fork3D.heightSegments
        )
        let mesh = new THREE.Mesh(geometry, this.forkMaterial)
        mesh.castShadow = true

        let stemAxleLength = Math.cos(this.tripleTreeRakeInRadians) * (this.length - this.offset)
        let YBasedOnDimensions = stemAxleLength - this.stemLength / 2
        let topDiff = this.frameStemTopHeight - YBasedOnDimensions

        mesh.position.set(
            0 - (this.parameters.tripleTree.offset + this.forkTripleTreeBaseOffset),
            this.frameStemTopHeight - topDiff,
            0
        )

        return mesh
    }

    buildTopYoke() {
        let shape = new THREE.Shape()
        shape.setFromPoints([
            new THREE.Vector2(-5 - Fork3D.stemRadius, 0),

            new THREE.Vector2(-2 - Fork3D.stemRadius, Fork3D.stemRadius),
            new THREE.Vector2(5 - Fork3D.stemRadius, Fork3D.stemRadius + 10),
            new THREE.Vector2(0, Fork3D.stemRadius + 15),
            new THREE.Vector2(-5 + this.parameters.tripleTree.offset - this.radius, this.width / 2),
            new THREE.Vector2(this.parameters.tripleTree.offset - 15, this.width / 2 + this.radius),
            new THREE.Vector2(this.parameters.tripleTree.offset, this.width / 2 + this.radius + 5),
            new THREE.Vector2(this.parameters.tripleTree.offset + 15, this.width / 2 + this.radius),
            new THREE.Vector2(this.parameters.tripleTree.offset + this.radius + 5, this.width / 2),
            new THREE.Vector2(this.parameters.tripleTree.offset + this.radius, this.width / 2 - this.radius),

            new THREE.Vector2(this.parameters.tripleTree.offset + this.radius, 0),

            new THREE.Vector2(this.parameters.tripleTree.offset + this.radius, -this.width / 2 + this.radius),
            new THREE.Vector2(this.parameters.tripleTree.offset + this.radius + 5, -this.width / 2),
            new THREE.Vector2(this.parameters.tripleTree.offset + 15, -this.width / 2 - this.radius),
            new THREE.Vector2(this.parameters.tripleTree.offset, -this.width / 2 - this.radius - 5),
            new THREE.Vector2(this.parameters.tripleTree.offset - 15, -this.width / 2 - this.radius),
            new THREE.Vector2(-5 + this.parameters.tripleTree.offset - this.radius, -this.width / 2),
            new THREE.Vector2(0, -Fork3D.stemRadius - 15),
            new THREE.Vector2(5 - Fork3D.stemRadius, -Fork3D.stemRadius - 10),
            new THREE.Vector2(-2 - Fork3D.stemRadius, -Fork3D.stemRadius),
            // new THREE.Vector2(100, 0),
            // new THREE.Vector2(100, this.width / 2),
            // new THREE.Vector2(0, 100),
            // new THREE.Vector2(-15, 100),
        ])

        let extrudeSettings = {
            steps: 1,
            depth: this.parameters.tripleTree.topYokeThickness,
            bevelEnabled: true,
            bevelThickness: 2,
            bevelSize: 1,
            bevelOffset: 2,
            bevelSegments: 1,
        }

        let geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings)
        geometry.computeBoundingBox()
        geometry.normalizeNormals()
        let mesh = new THREE.Mesh(geometry, this.tripleTreeMaterial)
        mesh.castShadow = true
        mesh.rotateX(THREE.MathUtils.degToRad(90))

        let yokeWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x
        let yokeHeight = geometry.boundingBox.max.y - geometry.boundingBox.min.y
        let yokeDepth = geometry.boundingBox.max.z - geometry.boundingBox.min.z

        let stemAxleLength = Math.cos(this.tripleTreeRakeInRadians) * (this.length - this.offset)
        let topDiff = this.frameStemTopHeight - stemAxleLength

        mesh.position.set(
            0 - (this.parameters.tripleTree.offset + this.forkTripleTreeBaseOffset),
            this.frameStemTopHeight - topDiff - 3,
            0
        )

        return mesh
    }

    buildBottomYoke() {
        let bottomOffset = this.parameters.tripleTree.offset
        if (this.tripleTreeRakeInRadians > 0) {
            bottomOffset = this.parameters.tripleTree.offset + Math.tan(this.tripleTreeRakeInRadians) * this.stemLength
        }

        let shape = new THREE.Shape()
        shape.setFromPoints([
            new THREE.Vector2(-5 - Fork3D.stemRadius, 0),

            new THREE.Vector2(-2 - Fork3D.stemRadius, Fork3D.stemRadius),
            new THREE.Vector2(5 - Fork3D.stemRadius, Fork3D.stemRadius + 10),
            new THREE.Vector2(0, Fork3D.stemRadius + 15),
            new THREE.Vector2(bottomOffset - 25, this.width / 2),
            new THREE.Vector2(bottomOffset - 15, this.width / 2 + this.radius),
            new THREE.Vector2(bottomOffset, this.width / 2 + this.radius + 5),
            new THREE.Vector2(bottomOffset + 15, this.width / 2 + this.radius),
            new THREE.Vector2(bottomOffset + this.radius + 5, this.width / 2),
            new THREE.Vector2(bottomOffset + this.radius, this.width / 2 - this.radius),

            new THREE.Vector2(bottomOffset + this.radius, 0),

            new THREE.Vector2(bottomOffset + this.radius, -this.width / 2 + this.radius),
            new THREE.Vector2(bottomOffset + this.radius + 5, -this.width / 2),
            new THREE.Vector2(bottomOffset + 15, -this.width / 2 - this.radius),
            new THREE.Vector2(bottomOffset, -this.width / 2 - this.radius - 5),
            new THREE.Vector2(bottomOffset - 15, -this.width / 2 - this.radius),
            new THREE.Vector2(bottomOffset - 25, -this.width / 2),
            new THREE.Vector2(0, -Fork3D.stemRadius - 15),
            new THREE.Vector2(5 - Fork3D.stemRadius, -Fork3D.stemRadius - 10),
            new THREE.Vector2(-2 - Fork3D.stemRadius, -Fork3D.stemRadius),
            // new THREE.Vector2(100, 0),
            // new THREE.Vector2(100, this.width / 2),
            // new THREE.Vector2(0, 100),
            // new THREE.Vector2(-15, 100),
        ])

        let extrudeSettings = {
            steps: 1,
            depth: this.parameters.tripleTree.bottomYokeThickness,
            bevelEnabled: true,
            bevelThickness: 2,
            bevelSize: 1,
            bevelOffset: 2,
            bevelSegments: 1,
        }

        let geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings)
        geometry.computeBoundingBox()
        geometry.normalizeNormals()
        let mesh = new THREE.Mesh(geometry, this.tripleTreeMaterial)
        mesh.castShadow = true
        mesh.rotateX(THREE.MathUtils.degToRad(90))

        let yokeWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x
        let yokeHeight = geometry.boundingBox.max.y - geometry.boundingBox.min.y
        let yokeDepth = geometry.boundingBox.max.z - geometry.boundingBox.min.z

        let stemAxleLength = Math.cos(this.tripleTreeRakeInRadians) * (this.length - this.offset)
        let YBasedOnDimensions = stemAxleLength
        let topDiff = this.frameStemTopHeight - YBasedOnDimensions

        mesh.position.set(
            0 - (this.parameters.tripleTree.offset + this.forkTripleTreeBaseOffset),
            this.frameStemTopHeight - topDiff - this.stemLength + yokeDepth - 1,
            0
        )

        return mesh
    }

    buildFork() {
        let forkLeftCylinder = this.buildForkTube(-this.width / 2)
        let forkRightCylinder = this.buildForkTube(this.width / 2)
        let wheelAxle = this.buildWheelAxle()
        let forkStem = this.buildForkStem()
        let topYoke = this.buildTopYoke()
        let bottomYoke = this.buildBottomYoke()

        this.pivot = new THREE.Group()
        this.pivot.position.set(this.x, this.y, 0)
        this.pivot.add(wheelAxle)
        this.pivot.add(forkStem)
        this.pivot.add(topYoke)
        this.pivot.add(bottomYoke)
        this.pivot.rotateZ(this.verticalStemAngle)

        this.pivot2 = new THREE.Group()
        this.pivot2.position.set(this.x, this.y, 0)
        this.pivot2.add(forkLeftCylinder)
        this.pivot2.add(forkRightCylinder)
        this.pivot2.rotateZ(this.verticalStemAngle + this.tripleTreeRakeInRadians)

        return this
    }

    removeFromObject(object) {
        object.remove(this.pivot)
        object.remove(this.pivot2)
    }

    addToObject(object) {
        object.add(this.pivot)
        object.add(this.pivot2)
    }
}
