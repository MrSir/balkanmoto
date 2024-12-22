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

        this.forkMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333333,
            transparent: false,
            opacity: 0.5,
            depthWrite: true,
            depthTest: true,
        })

        this.tripleTreeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xc4c4c4,
            roughness: 0.5,
            metalness: 0.2,
            transparent: false,
            opacity: 0.5,
            depthWrite: true,
            depthTest: true,
            flatShading: false,
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
            opacity: 0.5,
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

    buildYoke(offset, thickness) {
        let shape = new THREE.Shape()
        let points = [
            new THREE.Vector2(0, -Fork3D.stemRadius - 15),
            new THREE.Vector2(5 - Fork3D.stemRadius, -Fork3D.stemRadius - 10),
            new THREE.Vector2(-2 - Fork3D.stemRadius, -Fork3D.stemRadius),
            new THREE.Vector2(-5 - Fork3D.stemRadius, 0),

            new THREE.Vector2(-2 - Fork3D.stemRadius, Fork3D.stemRadius),
            new THREE.Vector2(5 - Fork3D.stemRadius, Fork3D.stemRadius + 10),
            new THREE.Vector2(0, Fork3D.stemRadius + 15),
        ]

        // right fork tube mount
        for (let i = Math.PI; i >= -Math.PI / 4; i -= Math.PI / 8) {
            let x = Math.cos(i) * (this.radius + 10)
            let y = Math.sin(i) * (this.radius + 10)

            points.push(new THREE.Vector2(offset + x, this.width / 2 + y))
        }

        points.push(new THREE.Vector2(offset + this.radius, 0))

        // left fork tube mount
        for (let i = Math.PI / 4; i >= -Math.PI; i -= Math.PI / 8) {
            let x = Math.cos(i) * (this.radius + 10)
            let y = Math.sin(i) * (this.radius + 10)

            points.push(new THREE.Vector2(offset + x, -this.width / 2 + y))
        }

        shape.setFromPoints(points)

        let extrudeSettings = {
            steps: 5,
            depth: thickness,
            bevelEnabled: true,
            bevelThickness: 2,
            bevelSize: 1,
            bevelOffset: 2,
            bevelSegments: 3,
        }

        let bufferGeometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings)
        let geometry = new THREE.Geometry().fromBufferGeometry(bufferGeometry)
        geometry.computeBoundingBox()
        geometry.mergeVertices()
        geometry.computeVertexNormals()
        let mesh = new THREE.Mesh(geometry, this.tripleTreeMaterial)
        mesh.castShadow = true
        mesh.rotateX(THREE.MathUtils.degToRad(90))

        return mesh
    }

    buildTopYoke() {
        let mesh = this.buildYoke(this.parameters.tripleTree.offset, this.parameters.tripleTree.topYokeThickness)
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

        let mesh = this.buildYoke(bottomOffset, this.parameters.tripleTree.bottomYokeThickness)

        let yokeDepth = mesh.geometry.boundingBox.max.z - mesh.geometry.boundingBox.min.z
        let stemAxleLength = Math.cos(this.tripleTreeRakeInRadians) * (this.length - this.offset)
        let topDiff = this.frameStemTopHeight - stemAxleLength

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
