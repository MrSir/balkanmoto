import * as THREE from 'three';
import * as Tire3D from 'tire3D';
import * as Fork3D from 'fork3D';

export class Frame {
    constructor(floorY, parameters, x = 0) {
        this.rearTireX = -1000
        this.showGeometry = true
        this.showLabels =false
        this.transparentObjects = true

        this.floorY = floorY
        this.parameters = parameters
        this.x = x

        this.rearTire = new Tire3D.Tire(
            floorY,
            parameters.rearTire.width,
            parameters.rearTire.aspect,
            parameters.rearTire.rimDiameterInInches,
            this.rearTireX,
            0,
            Math.PI / 2
        )

        this.frontTire = new Tire3D.Tire(
            floorY,
            parameters.frontTire.width,
            parameters.frontTire.aspect,
            parameters.frontTire.rimDiameterInInches,
            this.rearTire.x + this.parameters.wheelbase,
            0,
            Math.PI / 2
        )

        this.fork = new Fork3D.Fork(
            floorY,
            0, 0,
            parameters.fork.diameter,
            parameters.fork.stanchionTubeLength,
            parameters.fork.outerTubeLength,
            parameters.fork.length,
            parameters.fork.offset,
            parameters.fork.width,
            parameters.fork.travel,
            parameters.tripleTree,
            parameters.fork.spring,
            parameters.fork.preload,
            parameters.fork.compressionDamping,
            parameters.fork.reboundDamping,
            parameters.fork.compression
        )

        this.pivot = new THREE.Group()

        // this.labels = new Labels3D(floorY, this)

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

        this.blackMaterial = new THREE.LineBasicMaterial({
            color: 0x000000,
        })

        this.initialCalculate()
    }

    setBackboneLength(backboneLength) {
        this.backboneLength = backboneLength
        return this
    }

    setFrameStemAngle(frameStemAngle) {
        this.frameStemAngle = frameStemAngle
        return this
    }

    get rakeInRadians() {
        return this.degToRad(this.parameters.fork.rake)
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
        let geometry = new THREE.BufferGeometry().setFromPoints([vector1, vector2])
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
        return (deg * Math.PI) / 180
    }

    radToDeg(rad) {
        return (rad * 180) / Math.PI
    }

    calculate3rdSideFrom2Sides1Angle(a, b, angle) {
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) - 2 * a * b * Math.cos(angle))
    }

    calculateAngleFrom3Sides(a, b, c) {
        let nominatorACB = Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)
        let denominatorACB = 2 * b * a

        return Math.abs(Math.acos(nominatorACB / denominatorACB))
    }

    calculate3rdSideInRightAngleTriangle(side, hypotenuse) {
        return Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(side, 2))
    }

    calculateHypotenuseInRightAngleTriangle(a, b) {
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
    }

    calculateAdjFromHypAndAngle(hypotenuse, angle) {
        return Math.cos(angle) * hypotenuse
    }

    calculateOpFromHypAndAngle(hypotenuse, angle) {
        return Math.sin(angle) * hypotenuse
    }

    calculateTriangleAreaFrom3Sides(a, b, c) {
        return Math.sqrt((a + b + c) * (-a + b + c) * (a - b + c) * (a + b - c)) / 4
    }

    calculateTriangleHeightFromArea(area, base) {
        return (2 * area) / base
    }

    isAtEquilibrium() {
        if (this.fork.stroke === 100) {
            return true
        }

        let weightOnFork = (this.parameters.load.motorcycleWeight + this.parameters.load.riderWeight) * 0.48
        let Fn = weightOnFork * 9.81
        let F = Fn / Math.cos(this.verticalStemAngle)

        let k = this.fork.spring.rate * 2 * 1000 // convert from N/mm to N/m
        let length = this.fork.spring.length
        let x = (F / k)
        let springStroke = ((x * 1000) / length) * 100

        let result = springStroke <= this.fork.stroke

        if (result) {
            this.restingStroke = springStroke
        }

        return result
    }

    initialCalculate() {
        this.rearTire.calculateWheelDimensions().calculateYBasedOnWheelDiameter()
        this.frontTire.calculateWheelDimensions().calculateYBasedOnWheelDiameter()

        let A = new THREE.Vector3(this.rearTire.x, this.rearTire.y, 0)
        let E = new THREE.Vector3(this.frontTire.x, this.frontTire.y, 0)

        let AE = A.distanceTo(E)
        let FE = this.parameters.fork.length - this.parameters.fork.offset - this.fork.compression
        let DFE = this.degToRad(0)
        let CD = this.parameters.tripleTree.offset
        let WBC = this.degToRad(this.parameters.rake)
        let BC = FE
        let DE = 0
        if (DFE > 0) {
            BC = this.calculateAdjFromHypAndAngle(FE, DFE)
            DE = this.calculateOpFromHypAndAngle(FE, DFE)
        }
        let CE = CD + DE
        let BE = this.calculateHypotenuseInRightAngleTriangle(BC, CE)

        let CBE = Math.acos(BC / BE)
        let WBE = CBE + WBC
        let BW = this.calculateAdjFromHypAndAngle(BE, WBE)
        let WE = this.calculateOpFromHypAndAngle(BE, WBE)

        let B = new THREE.Vector3(E.x - WE, E.y + BW, 0)
        let AB = A.distanceTo(B)

        this.setBackboneLength(AB)

        let ABE = this.calculateAngleFrom3Sides(BE, AB, AE)
        let ABR = ABE - WBE

        this.setFrameStemAngle(ABR)

        return this
    }

    calculateFrontTirePosition() {
        this.rearTire.calculateWheelDimensions().calculateYBasedOnWheelDiameter()
        this.frontTire.calculateWheelDimensions().calculateYBasedOnWheelDiameter()
        this.fork.offset = this.parameters.fork.offset
        this.fork.spring = this.parameters.fork.spring
        this.fork.preload = this.parameters.fork.preload
        this.fork.compressionDamping = this.parameters.fork.compressionDamping
        this.fork.reboundDamping = this.parameters.fork.reboundDamping

        let AB = this.backboneLength
        let DFE = this.degToRad(0)
        let FE = this.parameters.fork.length - this.parameters.fork.offset - this.fork.compression
        let BC = FE
        let DE = 0

        if (DFE > 0) {
            BC = this.calculateAdjFromHypAndAngle(FE, DFE)
            DE = this.calculateOpFromHypAndAngle(FE, DFE)
        }

        let ABC = this.frameStemAngle + this.degToRad(this.parameters.rake)

        let CD = this.parameters.tripleTree.offset
        let CE = CD + DE

        let AC = this.calculate3rdSideFrom2Sides1Angle(AB, BC, ABC)
        let ACB = this.calculateAngleFrom3Sides(AC, BC, AB)
        let BCE = this.degToRad(90)
        let ACE = ACB + BCE

        let AE = this.calculate3rdSideFrom2Sides1Angle(AC, CE, ACE)
        let LE = this.calculate3rdSideInRightAngleTriangle(Math.abs(this.rearTire.y - this.frontTire.y), AE)

        this.frontTire.setX(LE + this.rearTire.x).buildTire()

        let A = new THREE.Vector3(this.rearTire.x, this.rearTire.y, 0)
        let E = new THREE.Vector3(LE + this.rearTire.x, this.frontTire.y, 0)

        // Compute B
        let AL = this.rearTire.y - E.y
        let LEA = Math.asin(AL / AC)
        let BE = this.calculateHypotenuseInRightAngleTriangle(BC, CE)
        let EAB = this.calculateAngleFrom3Sides(AB, AE, BE)
        let RAB = EAB - LEA
        let AR = Math.cos(RAB) * AB
        let BR = Math.sin(RAB) * AB
        let B = new THREE.Vector3(this.rearTire.x + AR, this.rearTire.y + BR, 0)

        this.frameStemTopPoint = B

        // Compute C
        let M = new THREE.Vector3(E.x, B.y, 0)
        let BM = B.distanceTo(M)
        let EBM = Math.acos(BM / BE)
        let CBE = Math.acos(BC / BE)
        let CBN = CBE + EBM
        let BN = this.calculateAdjFromHypAndAngle(BC, CBN)
        let CN = this.calculateOpFromHypAndAngle(BC, CBN)
        let C = new THREE.Vector3(B.x + BN, B.y - CN, 0)

        let D = C

        let X = new THREE.Vector3(E.x, this.floorY, 0)
        if (CD !== 0) {
            // Compute D
            let EX = E.distanceTo(X)
            let CX = C.distanceTo(X)
            let CEX = this.calculateAngleFrom3Sides(EX, CE, CX)
            let DG = this.calculate3rdSideFrom2Sides1Angle(DE, EX, CEX)
            let areaDEG = this.calculateTriangleAreaFrom3Sides(DE, EX, DG)
            let DO = this.calculateTriangleHeightFromArea(areaDEG, EX)
            let EO = this.calculate3rdSideInRightAngleTriangle(DO, DE)
            D = new THREE.Vector3(E.x - DO, E.y - EO, 0)
        }

        let F = B

        if (CD > 0) {
            F = new THREE.Vector3(B.x + Math.abs(D.x - C.x), B.y + Math.abs(D.y - C.y), 0)
        }

        this.tripleTreeCenterOfForkTubesPoint = F

        let TrailOffsetFromB = (this.floorY - B.y) / ((C.y - B.y) / (C.x - B.x))
        let trailX = B.x + TrailOffsetFromB
        let G = new THREE.Vector3(trailX, this.floorY, 0)

        let LCA = Math.asin((A.y - C.y) / AC)
        let LCB = LCA + ACB

        this.verticalStemAngle = Math.PI / 2 - LCB
        this.forkTripleTreeBaseOffset = DE
        this.frameStemTopHeight = B.y

        let RX = new THREE.Vector3(this.rearTire.x, this.floorY, 0)

        this.drawLineWithVectors(A, B, this.blackMaterial)
        this.drawLineWithVectors(A, C, this.blackMaterial)
        this.drawLineWithVectors(B, C, this.blackMaterial)

        this.drawLineWithVectors(E, G, this.blackMaterial)
        this.drawLineWithVectors(C, G, this.blackMaterial)
        this.drawLineWithVectors(C, D, this.blackMaterial)

        this.drawLineWithVectors(A, RX, this.blackMaterial)
        this.drawLineWithVectors(E, X, this.blackMaterial)

        if (CD > 0) {
            this.drawLineWithVectors(B, F, this.blackMaterial)
            this.drawLineWithVectors(F, E, this.blackMaterial)
        }

        if (DE > 0) {
            this.drawLineWithVectors(F, D, this.blackMaterial)
            this.drawLineWithVectors(E, D, this.blackMaterial)
        }

        this.trailMM = G.x - E.x
        this.trailPoint = G
    }

    removeFromObject(object) {
        this.rearTire.removeFromObject(this.pivot)
        this.frontTire.removeFromObject(this.pivot)
        this.fork.removeFromObject(this.pivot)

        this.lines.forEach((line) => this.pivot.remove(line))
        this.lines = []

        object.remove(this.pivot)

        // this.labels.removeFromObject(object)
    }

    addToObject(object) {
        this.rearTire.buildTire().addToObject(this.pivot)

        this.calculateFrontTirePosition()

        this.frontTire.buildTire().addToObject(this.pivot)

        this.fork.tire = this.frontTire
        this.fork.setTransparency(this.transparentObjects).buildFork().addToObject(this.pivot)
        this.fork.pivot.rotateZ(this.verticalStemAngle + this.degToRad(0))

        if (this.showGeometry) {
            this.lines.forEach((line) => this.pivot.add(line))
        }

        this.pivot.rotation.y = -Math.PI / 2
        this.pivot.position.x = this.x

        object.add(this.pivot)

        // if (this.showLabels) {
        //     this.labels.calculateLabelValues().calculatePoints().buildLabels().addToObject(object)
        // }
    }

    redrawInScene(scene) {
        this.removeFromObject(scene)

        this.addToObject(scene)
    }
}

export default {}