class Frame3D {
    static rearTireX = -700

    blueMaterial
    redMaterial
    greenMaterial

    backboneLength = 0
    parameters = {}

    showGeometry = true
    transparentObjects = true

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

    setShowGeometry(toggle) {
        this.showGeometry = toggle
        return this
    }

    setTransparentObjects(toggle) {
        this.transparentObjects = toggle
        return this
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

    drawCircle(center, radius) {
        let points = []

        // 360 full circle will be drawn clockwise
        for (let i = 0; i <= 360; i++) {
            points.push(
                new THREE.Vector3(
                    center.x + Math.sin(i * (Math.PI / 180)) * radius,
                    center.y + Math.cos(i * (Math.PI / 180)) * radius,
                    center.z + 0
                )
            )
        }

        let geometry = new THREE.BufferGeometry().setFromPoints(points)
        let mesh = new THREE.Line(geometry, this.blueMaterial)

        this.lines.push(mesh)
    }

    degToRad(deg) {
        return THREE.MathUtils.degToRad(deg)
    }

    radToDeg(rad) {
        return THREE.MathUtils.radToDeg(rad)
    }

    calculate3rdSideFrom2Sides1Angle(a, b, angle) {
        return Math.sqrt(
            Math.pow(a, 2) + Math.pow(b, 2) - 2 * a * b * Math.cos(angle)
        )
    }

    calculateAngleFrom3Sides(a, b, c) {
        let nominatorACB = Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)
        let denominatorACB = 2 * b * a

        return Math.abs(Math.acos(nominatorACB / denominatorACB))
    }

    calculate3rdSideInRightAngleTriangle(side, hypotenuse) {
        return Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(side, 2))
    }

    calculateAdjFromHypAndAngle(hypotenuse, angle) {
        return Math.cos(angle) * hypotenuse
    }

    calculateOpFromHypAndAngle(hypotenuse, angle) {
        return Math.sin(angle) * hypotenuse
    }

    calculateTriangleAreaFrom3Sides(a, b, c) {
        return (
            Math.sqrt((a + b + c) * (-a + b + c) * (a - b + c) * (a + b - c)) /
            4
        )
    }

    calculateTriangleHeightFromArea(area, base) {
        return (2 * area) / base
    }

    initialCalculate() {
        let DFE = this.degToRad(this.parameters.fork.tripleTreeRake)
        let FE = this.parameters.fork.length
        let BC = FE
        if (DFE > 0) {
            BC = this.calculateAdjFromHypAndAngle(FE, DFE)
        }

        let DC = Math.sin(this.rakeInRadians) * BC
        let BD = Math.cos(this.rakeInRadians) * BC
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

        let AB = A.distanceTo(B)
        let ABE = Math.acos(BE / AB)

        this.setBackboneLength(AB)
        this.setFrameStemAngle(ABE)
    }

    calculateFrontTirePosition() {
        this.rearTire
            .setX(Frame3D.rearTireX)
            .calculateTorusSize()
            .calculateYBasedOnWheelDiameter()

        this.frontTire.calculateTorusSize().calculateYBasedOnWheelDiameter()

        let AB = this.backboneLength
        let DFE = this.degToRad(this.parameters.fork.tripleTreeRake)
        let FE = this.parameters.fork.length
        let BC = FE
        let DE = 0

        if (DFE > 0) {
            BC = this.calculateAdjFromHypAndAngle(FE, DFE)
            DE = this.calculateOpFromHypAndAngle(FE, DFE)
        }

        let ABC = this.frameStemAngle + this.rakeInRadians
        let CD = this.parameters.fork.offset
        let CE = CD + DE

        let AC = this.calculate3rdSideFrom2Sides1Angle(AB, BC, ABC)
        let ACB = this.calculateAngleFrom3Sides(AC, BC, AB)
        let BCE = this.degToRad(90)
        let ACE = ACB + BCE

        let AE = this.calculate3rdSideFrom2Sides1Angle(AC, CE, ACE)

        let frontTireX =
            this.calculate3rdSideInRightAngleTriangle(
                Math.abs(this.rearTire.y - this.frontTire.y),
                AE
            ) + this.rearTire.x

        this.frontTire.setX(frontTireX).buildTorus()

        let A = new THREE.Vector3(this.rearTire.x, this.rearTire.y, 0)
        let E = new THREE.Vector3(frontTireX, this.frontTire.y, 0)
        let G = new THREE.Vector3(frontTireX, this.floorY, 0)

        // Compute C
        let EG = E.distanceTo(G)
        let CG = this.calculate3rdSideInRightAngleTriangle(CE, EG)
        let areaCEG = this.calculateTriangleAreaFrom3Sides(CE, EG, CG)

        let IG = this.calculateTriangleHeightFromArea(areaCEG, EG)
        let IC = this.calculate3rdSideInRightAngleTriangle(IG, CG)
        let C = new THREE.Vector3(this.frontTire.x - IG, this.floorY + IC, 0)

        let D = C

        if (CE !== 0) {
            // Compute D
            let CEG = this.calculateAngleFrom3Sides(EG, CE, CG)
            let DG = this.calculate3rdSideFrom2Sides1Angle(DE, EG, CEG)
            let areaDEG = this.calculateTriangleAreaFrom3Sides(DE, EG, DG)
            let DM = this.calculateTriangleHeightFromArea(areaDEG, EG)
            let EM = this.calculate3rdSideInRightAngleTriangle(DM, DE)
            D = new THREE.Vector3(frontTireX - DM, this.frontTire.y - EM, 0)
        }

        // Compute B
        let AL = this.rearTire.y - C.y
        let LCA = Math.asin(AL / AC)
        let CAB = this.calculateAngleFrom3Sides(AB, AC, BC)
        let KAB = CAB - LCA
        let AK = Math.cos(KAB) * AB
        let KB = Math.sin(KAB) * AB
        let B = new THREE.Vector3(this.rearTire.x + AK, this.rearTire.y + KB, 0)

        let F = B

        if (CD > 0) {
            F = new THREE.Vector3(
                B.x + Math.abs(D.x - C.x),
                B.y + Math.abs(D.y - C.y),
                0
            )
        }

        // calculate stem ground point
        // f(x) = [(C.y - B.y)/(C.x - B.x)]X + B.y
        // this.floorY - B.y = [(C.y - B.y)/(C.x - B.x)])X
        //
        let X = (this.floorY - B.y) / ((C.y - B.y) / (C.x - B.x))
        let trailX = B.x + X
        let trailPoint = new THREE.Vector3(trailX, this.floorY, 0)

        if (this.showGeometry) {
            this.drawLineWithVectors(A, B, this.greenMaterial)
            this.drawLineWithVectors(A, C, this.greenMaterial)
            this.drawLineWithVectors(B, C, this.greenMaterial)
            this.drawLineWithVectors(C, trailPoint, this.greenMaterial)

            this.drawLineWithVectors(A, E, this.blueMaterial)

            this.drawLineWithVectors(C, E, this.redMaterial)
            this.drawLineWithVectors(E, G, this.redMaterial)
            this.drawLineWithVectors(C, G, this.redMaterial)

            this.drawLineWithVectors(E, D, this.redMaterial)
            this.drawLineWithVectors(C, D, this.redMaterial)

            this.drawLineWithVectors(B, F, this.blueMaterial)
            this.drawLineWithVectors(F, D, this.blueMaterial)
            this.drawLineWithVectors(F, E, this.blueMaterial)
        }

        //this.drawCircle(this.rearTire, AC)
        //this.drawCircle(this.rearTire, AE)

        //console.log('wheelbase: ' + (frontTireX - this.rearTire.x))
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
        this.rearTire
            .buildTorus()
            .setTransparency(this.transparentObjects)
            .addToObject(this.scene)

        this.calculateFrontTirePosition()

        this.frontTire
            .setTransparency(this.transparentObjects)
            .addToObject(this.scene)

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
