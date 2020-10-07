class Frame3D {
    static rearTireX = -700

    constructor(scene, renderer, camera, floorY, parameters) {
        this.scene = scene
        this.renderer = renderer
        this.camera = camera
        this.floorY = floorY

        this.rake = parameters.rake
        this.parameters = parameters

        this.rearTire = new Tire3D(
            floorY,
            parameters.rearTire.width,
            parameters.rearTire.aspect,
            parameters.rearTire.rimDiameterInInches
        )
            .setX(Frame3D.rearTireX)
            .calculateTorusSize()
            .calculateYBasedOnWheelDiameter()

        this.frontTire = new Tire3D(
            floorY,
            parameters.frontTire.width,
            parameters.frontTire.aspect,
            parameters.frontTire.rimDiameterInInches
        )
            .setX(Frame3D.rearTireX + this.parameters.wheelbase)
            .calculateTorusSize()
            .calculateYBasedOnWheelDiameter()

        this.lines = []

        this.blueMaterial = new THREE.LineBasicMaterial({
            color: 0x0000ff,
        })
        this.redMaterial = new THREE.LineBasicMaterial({
            color: 0xff0000,
        })
        this.greenMaterial = new THREE.LineBasicMaterial({
            color: 0x00ff00,
        })

        this.initialCalculate()
    }

    setBackboneLength(backboneLength) {
        this.backboneLength = backboneLength
        return this
    }

    setRake(rake) {
        this.rake = rake
        return this
    }

    setFrameStemAngle(frameStemAngle) {
        this.frameStemAngle = frameStemAngle
        return this
    }

    get rakeInRadians() {
        return THREE.MathUtils.degToRad(this.rake)
    }

    drawLine(x1, y1, x2, y2, color) {
        let geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x1, y1, 0),
            new THREE.Vector3(x2, y2, 0),
        ])
        let mesh = new THREE.Line(geometry, color)

        this.lines.push(mesh)
    }

    drawLineWithVectors(vector1, vector2, color) {
        let geometry = new THREE.BufferGeometry().setFromPoints([
            vector1,
            vector2,
        ])
        let mesh = new THREE.Line(geometry, color)

        this.lines.push(mesh)
    }

    initialCalculate() {
        let DC = Math.sin(this.rakeInRadians) * this.parameters.fork.length
        let BD = Math.cos(this.rakeInRadians) * this.parameters.fork.length
        let ED = Math.abs(
            this.rearTire.wheelRadius - this.frontTire.wheelRadius
        )
        let BE = BD - ED

        let A = new THREE.Vector3(this.rearTire.x, this.rearTire.y, 0)
        let B = new THREE.Vector3(
            this.frontTire.x - DC,
            this.frontTire.y + BD,
            0
        )
        let E = new THREE.Vector3(this.frontTire.x - DC, this.rearTire.y, 0)

        this.drawLineWithVectors(B, E, this.greenMaterial)

        let AB = A.distanceTo(B)
        let ABE = Math.acos(BE / AB)

        this.setBackboneLength(AB)
        this.setFrameStemAngle(ABE)
    }

    calculateFrontTirePosition() {
        this.drawLine(0, 0, 0, 500, this.redMaterial)
        this.rearTire
            .setX(Frame3D.rearTireX)
            .calculateTorusSize()
            .calculateYBasedOnWheelDiameter()

        this.frontTire.calculateTorusSize().calculateYBasedOnWheelDiameter()

        let frameToForkAngle = this.frameStemAngle + this.rakeInRadians
        let axleToAxleLength = Math.sqrt(
            Math.pow(this.backboneLength, 2) +
                Math.pow(this.parameters.fork.length, 2) -
                2 *
                    this.backboneLength *
                    this.parameters.fork.length *
                    Math.cos(frameToForkAngle)
        )

        let frontTireX =
            Math.sqrt(
                Math.pow(axleToAxleLength, 2) -
                    Math.pow(Math.abs(this.rearTire.y - this.frontTire.y), 2)
            ) + this.rearTire.x

        let CAE = Math.abs(
            Math.acos((frontTireX - this.rearTire.x) / axleToAxleLength)
        )
        console.log(THREE.MathUtils.radToDeg(CAE))
        let nominator =
            Math.pow(this.backboneLength, 2) +
            Math.pow(axleToAxleLength, 2) -
            Math.pow(this.parameters.fork.length, 2)
        let denominator = 2 * this.backboneLength * axleToAxleLength

        let CAB = Math.abs(Math.acos(nominator / denominator))

        console.log(THREE.MathUtils.radToDeg(CAB))

        let BAE = Math.abs(CAB - CAE)
        let AE = Math.cos(BAE) * this.backboneLength
        let BE = Math.sin(BAE) * this.backboneLength

        let A = new THREE.Vector3(this.rearTire.x, this.rearTire.y, 0)
        let B = new THREE.Vector3(this.rearTire.x + AE, this.rearTire.y + BE, 0)
        let C = new THREE.Vector3(frontTireX, this.frontTire.y, 0)

        this.drawLineWithVectors(A, B, this.blueMaterial)
        this.drawLineWithVectors(B, C, this.blueMaterial)
        this.drawLineWithVectors(A, C, this.blueMaterial)

        //console.log('wheelbase: ' + (frontTireX - this.rearTire.x))

        this.frontTire.setX(frontTireX).buildTorus()
    }

    calculateFramePivot() {
        // this.forkPivot = new THREE.Group()
        //
        // let forkPivotOffsetX =
        //     Math.cos(this.backboneAngle) * this.backboneLength + this.rearTire.x
        // let forkPivotOffestY =
        //     Math.sin(this.backboneAngle) * this.backboneLength + this.rearTire.y
        //
        // let forkPivotMesh = new THREE.Mesh(
        //     new THREE.SphereGeometry(10),
        //     this.rearTire.torusMaterial
        // )
        // forkPivotMesh.position.set(forkPivotOffsetX, forkPivotOffestY, 0)
        // this.scene.add(forkPivotMesh)
        //
        // this.forkPivot.position.set(forkPivotOffsetX, forkPivotOffestY, 0)
        //
        // //this.frontTire.addToObject(this.forkPivot)
        // this.forkPivot.rotateZ(THREE.MathUtils.degToRad(this.rake))
    }

    removeFromScene() {
        this.rearTire.removeFromObject(this.scene)
        this.frontTire.removeFromObject(this.scene)
        //this.frontTire.removeFromObject(this.forkPivot)
        //temp

        //this.Fork.removeFromObject(this.forkPivot)

        //this.scene.remove(this.forkPivot)

        this.lines.forEach((line) => this.scene.remove(line))
        this.lines = []
    }

    drawInScene() {
        this.rearTire.buildTorus().addToObject(this.scene)

        this.calculateFrontTirePosition()

        this.frontTire.addToObject(this.scene)

        this.lines.forEach((line) => this.scene.add(line))
        //this.calculateFramePivot()
        //this.scene.add(this.forkPivot)

        this.renderer.render(this.scene, this.camera)
    }

    redrawInScene() {
        this.removeFromScene()

        this.drawInScene()
    }
}
