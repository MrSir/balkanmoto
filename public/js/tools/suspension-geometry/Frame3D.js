class Frame3D {
    static rearTireX = -700

    blueMaterial
    redMaterial
    greenMaterial

    backboneLength = 0
    parameters = {}

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
        this.rearTire
            .setX(Frame3D.rearTireX)
            .calculateTorusSize()
            .calculateYBasedOnWheelDiameter()

        this.frontTire.calculateTorusSize().calculateYBasedOnWheelDiameter()

        let AB = this.backboneLength
        let DFE = THREE.MathUtils.degToRad(this.parameters.fork.tripleTreeRake)
        let FE = this.parameters.fork.length
        let BC = Math.cos(DFE) * FE
        let DE = Math.sin(DFE) * FE

        let ABC = this.frameStemAngle + this.rakeInRadians
        let CD = this.parameters.fork.offset
        let CE = CD + DE

        let AC = Math.sqrt(
            Math.pow(AB, 2) + Math.pow(BC, 2) - 2 * AB * BC * Math.cos(ABC)
        )
        let nominatorACB = Math.pow(AC, 2) + Math.pow(BC, 2) - Math.pow(AB, 2)
        let denominatorACB = 2 * BC * AC
        let ACB = Math.abs(Math.acos(nominatorACB / denominatorACB))
        let BCE = THREE.MathUtils.degToRad(90)
        let ACE = ACB + BCE

        let AE = Math.sqrt(
            Math.pow(AC, 2) + Math.pow(CE, 2) - 2 * AC * CE * Math.cos(ACE)
        )

        let frontTireX =
            Math.sqrt(
                Math.pow(AE, 2) -
                    Math.pow(Math.abs(this.rearTire.y - this.frontTire.y), 2)
            ) + this.rearTire.x

        let A = new THREE.Vector3(this.rearTire.x, this.rearTire.y, 0)
        let E = new THREE.Vector3(frontTireX, this.frontTire.y, 0)
        let G = new THREE.Vector3(frontTireX, this.floorY, 0)

        let EG = E.distanceTo(G)
        let CG = Math.sqrt(Math.pow(EG, 2) - Math.pow(CE, 2))

        let areaCEG =
            Math.sqrt(
                (CE + EG + CG) *
                    (-CE + EG + CG) *
                    (CE - EG + CG) *
                    (CE + EG - CG)
            ) / 4

        let IG = (2 * areaCEG) / EG

        let C = new THREE.Vector3(
            this.frontTire.x - IG,
            this.floorY + Math.sqrt(Math.pow(CG, 2) - Math.pow(IG, 2)),
            0
        )

        let AL = this.rearTire.y - C.y
        let LCA = Math.asin(AL / AC)
        let nominatorCAB = Math.pow(AB, 2) + Math.pow(AC, 2) - Math.pow(BC, 2)
        let denominatorCAB = 2 * AB * AC
        let CAB = Math.abs(Math.acos(nominatorCAB / denominatorCAB))
        let KAB = CAB - LCA
        let AK = Math.cos(KAB) * AB
        let KB = Math.sin(KAB) * AB

        let B = new THREE.Vector3(this.rearTire.x + AK, this.rearTire.y + KB, 0)

        this.drawLineWithVectors(A, B, this.greenMaterial)
        this.drawLineWithVectors(A, C, this.greenMaterial)
        this.drawLineWithVectors(B, C, this.greenMaterial)

        this.drawLineWithVectors(A, E, this.blueMaterial)

        this.drawLineWithVectors(C, E, this.redMaterial)
        this.drawLineWithVectors(E, G, this.redMaterial)
        this.drawLineWithVectors(C, G, this.redMaterial)

        this.drawCircle(this.rearTire, AC)
        this.drawCircle(this.rearTire, AE)

        //console.log('wheelbase: ' + (frontTireX - this.rearTire.x))

        this.frontTire.setX(frontTireX).buildTorus()
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
