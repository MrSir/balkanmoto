import * as THREE from 'three';
import * as THREE_Addons from 'three/addons';
import {Tire} from 'tire';
import {Fork} from 'fork';

export class Geometry {
    constructor(parameters, floorY, font, xOffset = 0, pivotXOffset = 0, pivotYRotation = 0) {
        this.parameters = parameters
        this.floorY = floorY
        this.font = font
        this.xOffset = xOffset
        this.pivotXOffset = pivotXOffset
        this.pivotYRotation = pivotYRotation

        this.blueLineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff})
        this.redLineMaterial = new THREE.LineBasicMaterial({color: 0xff0000})
        this.greenLineMaterial = new THREE.LineBasicMaterial({color: 0x00ff00})
        this.blackLineMaterial = new THREE.LineBasicMaterial({color: 0x000000})
        this.grayLineMaterial = new THREE.LineBasicMaterial({color: 0xcccccc})

        this.frame = {}
        this.rider = {}
        this.rearTire = {}
        this.frontTire = {}
        this.fork = {}
        this.spring = {}
        this.tripleTree = {}

        this.textParameters = {
            font: this.font,
            size: 30,
            depth: 1,
            curveSegments: 2,
            bevelEnabled: true,
            bevelThickness: 0.125,
            bevelSize: 0.025,
            bevelOffset: 0,
            bevelSegments: 4
        }

        this.lines = []
        this.pointLabels = []

        this.pivot = new THREE.Group()
    }

    in2mm(inches) {
        return inches * 25.4
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

    calculateFrameDimensions() {
        return {
            rake: this.parameters.rake,
            wheelbase: this.parameters.wheelbase,
            // backbone: this.parameters.backbone,
            // stemAngle: this.parameters.stemAngle,
            weight: this.parameters.weight,
        }
    }

    calculateRiderDimensions() {
        return {
            weight: this.parameters.rider.weight,
            gearWeight: this.parameters.rider.gearWeight,
        }
    }

    calculateWheelDimensions(width, aspect, rimDiameterInInches) {
        const tireHeight = width * (aspect / 100)
        const rimDiameterInMillimeters = this.in2mm(rimDiameterInInches)
        const diameter = rimDiameterInMillimeters + 2 * tireHeight

        return {
            tire: {
                width: width,
                aspect: aspect,
                height: tireHeight,
            },
            rim: {
                diameterInInches: rimDiameterInInches,
                diameterInMillimeters: rimDiameterInMillimeters,
                radius: rimDiameterInMillimeters / 2,
            },
            diameter: diameter,
            radius: diameter / 2
        }
    }

    calculateForkDimensions() {
        return {
            diameter: this.parameters.fork.diameter,
            radius: this.parameters.fork.diameter / 2,
            stanchionTubeLength: this.parameters.fork.stanchionTubeLength,
            outerTubeLength: this.parameters.fork.outerTubeLength,
            length: this.parameters.fork.length,
            offset: this.parameters.fork.offset,
            travel: (this.parameters.fork.spring.length - this.parameters.fork.spring.preload) / 2,
            compressionDamping: this.parameters.fork.compressionDamping,
            reboundDamping: this.parameters.fork.reboundDamping,
            oilWeight: this.parameters.fork.oilWeight,
            stroke: 0
        }
    }

    calculateSpringDimensions() {
        return {
            rate: this.parameters.fork.spring.rate,
            length: this.parameters.fork.spring.length,
            preload: this.parameters.fork.spring.preload
        }
    }

    get forkCompression() {
        return this.fork.dimensions.travel * this.fork.dimensions.stroke / 100
    }

    calculateTripleTreeDimensions() {
        return {
            rake: this.parameters.tripleTree.rake,
            width: this.parameters.tripleTree.width,
            offset: this.parameters.tripleTree.offset,
            stemLength: this.parameters.tripleTree.stemLength,
            topYokeThickness: this.parameters.tripleTree.topYokeThickness,
            bottomYokeThickness: this.parameters.tripleTree.bottomYokeThickness,
        }
    }

    initialCalculate() {
        this.frame.dimensions = this.calculateFrameDimensions()
        this.rearTire.dimensions = this.calculateWheelDimensions(
            this.parameters.rearTire.width,
            this.parameters.rearTire.aspect,
            this.parameters.rearTire.rimDiameterInInches
        )
        this.rearTire.position = {
            x: this.xOffset,
            y: this.floorY + this.rearTire.dimensions.radius
        }
        this.frontTire.dimensions = this.calculateWheelDimensions(
            this.parameters.frontTire.width,
            this.parameters.frontTire.aspect,
            this.parameters.frontTire.rimDiameterInInches
        )
        this.frontTire.position = {
            x: this.rearTire.position.x + this.frame.dimensions.wheelbase,
            y: this.floorY + this.frontTire.dimensions.radius
        }
        this.tripleTree.dimensions = this.calculateTripleTreeDimensions()
        this.fork.dimensions = this.calculateForkDimensions()
        this.spring.dimensions = this.calculateSpringDimensions()
        this.rider.dimensions = this.calculateRiderDimensions()

        this.A = new THREE.Vector3(this.rearTire.position.x, this.rearTire.position.y, 0)
        this.E = new THREE.Vector3(this.frontTire.position.x, this.frontTire.position.y, 0)

        let AE = this.A.distanceTo(this.E)
        let FE = this.fork.dimensions.length - this.fork.dimensions.offset - this.forkCompression
        let DFE = this.degToRad(this.tripleTree.dimensions.rake)
        let CD = this.tripleTree.dimensions.offset
        let ZBC = this.degToRad(this.frame.dimensions.rake)
        let BC = FE
        this.DE = 0

        if (DFE > 0) {
            BC = this.calculateAdjFromHypAndAngle(FE, DFE)
            this.DE = this.calculateOpFromHypAndAngle(FE, DFE)
        }
        let CE = CD + this.DE
        let BE = this.calculateHypotenuseInRightAngleTriangle(BC, CE)

        let CBE = Math.acos(BC / BE)
        let ZBE = CBE + ZBC
        let BZ = this.calculateAdjFromHypAndAngle(BE, ZBE)
        let ZE = this.calculateOpFromHypAndAngle(BE, ZBE)

        this.B = new THREE.Vector3(this.E.x - ZE, this.E.y + BZ, 0)
        this.Z = new THREE.Vector3(this.B.x, this.B.y - BZ, 0)
        let AB = this.A.distanceTo(this.B)
        let ABE = this.calculateAngleFrom3Sides(BE, AB, AE)

        this.frame.dimensions.backbone = AB
        this.frame.dimensions.stemAngle = ABE - ZBE
    }

    calculate() {
        // this.frame.dimensions = this.calculateFrameDimensions()
        this.rearTire.dimensions = this.calculateWheelDimensions(
            this.parameters.rearTire.width,
            this.parameters.rearTire.aspect,
            this.parameters.rearTire.rimDiameterInInches
        )
        this.rearTire.position = {
            x: this.xOffset,
            y: this.floorY + this.rearTire.dimensions.radius
        }
        this.frontTire.dimensions = this.calculateWheelDimensions(
            this.parameters.frontTire.width,
            this.parameters.frontTire.aspect,
            this.parameters.frontTire.rimDiameterInInches
        )
        this.frontTire.position = {
            x: this.rearTire.position.x + this.frame.dimensions.wheelbase,
            y: this.floorY + this.frontTire.dimensions.radius
        }
        this.tripleTree.dimensions = this.calculateTripleTreeDimensions()
        this.fork.dimensions = this.calculateForkDimensions()
        this.spring.dimensions = this.calculateSpringDimensions()
        this.rider.dimensions = this.calculateRiderDimensions()

        let AB = this.frame.dimensions.backbone
        let DFE = this.degToRad(this.tripleTree.dimensions.rake)
        let FE = this.fork.dimensions.length - this.fork.dimensions.offset - this.forkCompression
        let BC = FE
        let DE = 0

        if (DFE > 0) {
            BC = this.calculateAdjFromHypAndAngle(FE, DFE)
            DE = this.calculateOpFromHypAndAngle(FE, DFE)
        }

        let ABC = this.frame.dimensions.stemAngle + this.degToRad(this.frame.dimensions.rake)

        let CD = this.tripleTree.dimensions.offset
        let CE = CD + DE

        let AC = this.calculate3rdSideFrom2Sides1Angle(AB, BC, ABC)
        let ACB = this.calculateAngleFrom3Sides(AC, BC, AB)
        let BCE = this.degToRad(90)
        let ACE = ACB + BCE

        let AE = this.calculate3rdSideFrom2Sides1Angle(AC, CE, ACE)
        let LE = this.calculate3rdSideInRightAngleTriangle(Math.abs(this.rearTire.position.y - this.frontTire.position.y), AE)
        this.frontTire.position.x = LE + this.rearTire.position.x

        this.A = new THREE.Vector3(this.rearTire.position.x, this.rearTire.position.y, 0)
        this.E = new THREE.Vector3(LE + this.rearTire.position.x, this.frontTire.position.y, 0)

        // Compute B
        let AL = this.rearTire.position.y - this.E.y
        let LEA = Math.asin(AL / AC)
        let BE = this.calculateHypotenuseInRightAngleTriangle(BC, CE)
        let EAB = this.calculateAngleFrom3Sides(AB, AE, BE)
        let RAB = EAB - LEA
        let AR = Math.cos(RAB) * AB
        let BR = Math.sin(RAB) * AB
        this.B = new THREE.Vector3(this.rearTire.position.x + AR, this.rearTire.position.y + BR, 0)

        // Compute C
        this.M = new THREE.Vector3(this.E.x, this.B.y, 0)
        let BM = this.B.distanceTo(this.M)
        let EBM = Math.acos(BM / BE)
        let CBE = Math.acos(BC / BE)
        let CBM = CBE + EBM
        let BN = this.calculateAdjFromHypAndAngle(BC, CBM)
        let CN = this.calculateOpFromHypAndAngle(BC, CBM)
        this.C = new THREE.Vector3(this.B.x + BN, this.B.y - CN, 0)

        this.D = this.C

        this.X = new THREE.Vector3(this.E.x, this.floorY, 0)
        if (CD !== 0) {
            // Compute D
            let EX = this.E.distanceTo(this.X)
            let CX = this.C.distanceTo(this.X)
            let CEX = this.calculateAngleFrom3Sides(EX, CE, CX)
            let DG = this.calculate3rdSideFrom2Sides1Angle(this.DE, EX, CEX)
            let areaDEG = this.calculateTriangleAreaFrom3Sides(this.DE, EX, DG)
            let DO = this.calculateTriangleHeightFromArea(areaDEG, EX)
            let EO = this.calculate3rdSideInRightAngleTriangle(DO, this.DE)
            this.D = new THREE.Vector3(this.E.x - DO, this.E.y - EO, 0)
        }

        this.F = this.B

        if (CD > 0) {
            this.F = new THREE.Vector3(this.B.x + Math.abs(this.D.x - this.C.x), this.B.y + Math.abs(this.D.y - this.C.y), 0)
        }

        this.tripleTreeCenterOfForkTubesPoint = this.F

        let TrailOffsetFromB = (this.floorY - this.B.y) / ((this.C.y - this.B.y) / (this.C.x - this.B.x))
        let trailX = this.B.x + TrailOffsetFromB
        this.G = new THREE.Vector3(trailX, this.floorY, 0)

        let LCA = Math.asin((this.A.y - this.C.y) / AC)
        let LCB = LCA + ACB

        this.verticalStemAngle = Math.PI / 2 - LCB
        this.forkTripleTreeBaseOffset = this.DE
        this.frameStemTopHeight = this.B.y

        this.Y = new THREE.Vector3(this.rearTire.position.x, this.floorY, 0)

        this.trailMM = this.G.x - this.E.x
        this.trailPoint = this.G
    }

    initialize() {
        this.initialCalculate()
        this.calculate()
        this.buildGeometry()
    }

    drawLineWithVectors(name, vector1, vector2, color) {
        let g = new THREE.BufferGeometry().setFromPoints([vector1, vector2])
        g.name = name

        let mesh = new THREE.Line(g, color)

        this.lines.push(mesh)
    }

    drawPointLabel(label, vector, material, xOffset = 0, yOffset = 0) {
        let g = new THREE_Addons.TextGeometry(label, this.textParameters)
        g.name = label
        g.computeBoundingBox()
        g.computeVertexNormals()

        g.textWidth = g.boundingBox.max.x - g.boundingBox.min.x
        g.textHeight = g.boundingBox.max.y - g.boundingBox.min.y

        let mesh = new THREE.Mesh(g, material)
        mesh.position.set(vector.x - (g.textWidth / 2) + xOffset, vector.y + yOffset, vector.z)

        this.pointLabels.push(mesh)
    }

    buildGeometry() {
        // GEOMETRY
        this.drawPointLabel("A", this.A, this.grayLineMaterial)
        this.drawPointLabel("B", this.B, this.grayLineMaterial)
        this.drawPointLabel("C", this.C, this.grayLineMaterial)
        this.drawPointLabel("D", this.D, this.grayLineMaterial, 15, 15)
        this.drawPointLabel("E", this.E, this.grayLineMaterial, -15)
        this.drawPointLabel("F", this.F, this.grayLineMaterial)
        this.drawPointLabel("G", this.G, this.grayLineMaterial)
        this.drawPointLabel("M", this.M, this.grayLineMaterial)
        this.drawPointLabel("X", this.X, this.grayLineMaterial)
        this.drawPointLabel("Y", this.Y, this.grayLineMaterial)
        this.drawPointLabel("Z", this.Z, this.grayLineMaterial)

        this.drawLineWithVectors("AB", this.A, this.B, this.blackLineMaterial)
        this.drawLineWithVectors("AC", this.A, this.C, this.blackLineMaterial)
        this.drawLineWithVectors("BC", this.B, this.C, this.blackLineMaterial)

        this.drawLineWithVectors("BZ", this.B, this.Z, this.blackLineMaterial)
        this.drawLineWithVectors("ZE", this.Z, this.E, this.blackLineMaterial)

        this.drawLineWithVectors("EG", this.E, this.G, this.blackLineMaterial)
        this.drawLineWithVectors("CG", this.C, this.G, this.blackLineMaterial)
        this.drawLineWithVectors("CD", this.C, this.D, this.blackLineMaterial)

        this.drawLineWithVectors("AY", this.A, this.Y, this.blackLineMaterial)
        this.drawLineWithVectors("EX", this.E, this.X, this.blackLineMaterial)

        this.drawLineWithVectors("BM", this.B, this.M, this.blackLineMaterial)
        this.drawLineWithVectors("ME", this.M, this.E, this.blackLineMaterial)
        this.drawLineWithVectors("BE", this.B, this.E, this.blackLineMaterial)

        this.drawLineWithVectors("BF", this.B, this.F, this.blackLineMaterial)
        this.drawLineWithVectors("FE", this.F, this.E, this.blackLineMaterial)
        this.drawLineWithVectors("FD", this.F, this.D, this.blackLineMaterial)
        this.drawLineWithVectors("ED", this.E, this.D, this.blackLineMaterial)

        this.lines.forEach(line => {
            this.pivot.add(line)
        })
        this.pointLabels.forEach(label => {
            this.pivot.add(label)
        })

        // TIRES
        this.rearTire.geometry = new Tire(this.rearTire)
        this.rearTire.geometry.buildGeometry().updateGeometry()
        this.pivot.add(this.rearTire.geometry.lathe)

        this.frontTire.geometry = new Tire(this.frontTire)
        this.frontTire.geometry.buildGeometry().updateGeometry()
        this.pivot.add(this.frontTire.geometry.lathe)

        // FORK
        this.fork.geometry = new Fork(this)
        this.fork.geometry.buildGeometry().updateGeometry()
        this.pivot.add(this.fork.geometry.pivot)

        this.pivot.rotation.y = this.pivotYRotation
        this.pivot.position.x = this.pivotXOffset
    }

    updateLine(name, vector1, vector2) {
        let line = this.lines.find((line) => line.geometry.name === name)
        line.geometry.attributes.position.setXYZ(0, vector1.x, vector1.y, vector1.z)
        line.geometry.attributes.position.setXYZ(1, vector2.x, vector2.y, vector2.z)
        line.geometry.attributes.position.needsUpdate = true;
        line.geometry.computeBoundingSphere();
    }

    updatePointLabel(name, vector, xOffset = 0, yOffset = 0) {
        let label = this.pointLabels.find((line) => line.geometry.name === name)
        label.position.set(vector.x - (label.geometry.textWidth / 2) + xOffset, vector.y + yOffset, vector.z)
    }

    updateGeometry() {
        this.updatePointLabel("A", this.A)
        this.updatePointLabel("B", this.B)
        this.updatePointLabel("C", this.C)
        this.updatePointLabel("D", this.D, 15, 15)
        this.updatePointLabel("E", this.E, -15)
        this.updatePointLabel("F", this.F)
        this.updatePointLabel("G", this.G)
        this.updatePointLabel("M", this.M)
        this.updatePointLabel("X", this.X)
        this.updatePointLabel("Y", this.Y)
        this.updatePointLabel("Z", this.Z)

        this.updateLine("AB", this.A, this.B)
        this.updateLine("AC", this.A, this.C)
        this.updateLine("BC", this.B, this.C)

        this.updateLine("BZ", this.B, this.Z)
        this.updateLine("ZE", this.Z, this.E)

        this.updateLine("EG", this.E, this.G)
        this.updateLine("CG", this.C, this.G)
        this.updateLine("CD", this.C, this.D)

        this.updateLine("AY", this.A, this.Y)
        this.updateLine("EX", this.E, this.X)

        this.updateLine("BM", this.B, this.M)
        this.updateLine("ME", this.M, this.E)
        this.updateLine("BE", this.B, this.E)

        this.updateLine("BF", this.B, this.F)
        this.updateLine("FE", this.F, this.E)
        this.updateLine("FD", this.F, this.D)
        this.updateLine("ED", this.E, this.D)

        this.rearTire.geometry.updateGeometry()
        this.frontTire.geometry.updateGeometry()

        this.fork.geometry.updateGeometry()
    }
}

export default {}