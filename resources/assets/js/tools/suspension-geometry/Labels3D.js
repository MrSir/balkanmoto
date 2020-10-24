class Labels3D {
    constructor(floorY, frame) {
        this.lineMeshes = []
        this.textMeshes = []
        this.floorY = floorY
        this.frame = frame
        this.rearTire = frame.rearTire
        this.frontTire = frame.frontTire

        this.textParameters = {
            font: this.frame.font,
            size: 30,
            height: 1,
            curveSegments: 2,
            bevelEnabled: false,
        }

        this.redMaterial = new THREE.LineBasicMaterial({
            color: 0xff0000,
        })
        this.greenMaterial = new THREE.LineBasicMaterial({
            color: 0x00ff00,
        })
        this.blueMaterial = new THREE.LineBasicMaterial({
            color: 0x0000ff,
        })
        this.yellowMaterial = new THREE.LineBasicMaterial({
            color: 0xffff00,
        })
        this.aquaMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff,
        })
        this.fusiaMaterial = new THREE.LineBasicMaterial({
            color: 0xff00ff,
        })
    }

    calculateAngleFrom3Sides(a, b, c) {
        let nominatorACB = Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)
        let denominatorACB = 2 * b * a

        return Math.abs(Math.acos(nominatorACB / denominatorACB))
    }

    convertMMtoIN(mm) {
        return mm / 25.4
    }

    convertRADtoDEG(rad) {
        return THREE.MathUtils.radToDeg(rad)
    }

    calculateLabelValues() {
        this.wheelbaseMM = this.frontTire.x - this.rearTire.x
        this.trailMM = this.frame.trailMM

        let A = new THREE.Vector3(this.frame.frameStemTopPoint.x, this.floorY + 1, 0)
        let B = this.frame.frameStemTopPoint
        let C = this.frame.trailPoint

        let AB = A.distanceTo(B)
        let BC = B.distanceTo(C)
        let AC = A.distanceTo(C)

        this.rakeRAD = this.calculateAngleFrom3Sides(AB, BC, AC)

        return this
    }

    calculatePoints() {
        this.wheelbasePoints = [
            new THREE.Vector3(this.rearTire.x, this.floorY + 1, 0),
            new THREE.Vector3(this.rearTire.x, this.floorY + 1, 200),
            new THREE.Vector3(this.frontTire.x, this.floorY + 1, 200),
            new THREE.Vector3(this.frontTire.x, this.floorY + 1, 0),
        ]

        this.trailPoints = [
            new THREE.Vector3(this.frontTire.x, this.floorY + 1, 200),
            new THREE.Vector3(this.frontTire.x, this.floorY + 1, 250),
            new THREE.Vector3(this.frame.trailPoint.x, this.floorY + 1, 250),
            new THREE.Vector3(this.frame.trailPoint.x, this.floorY + 1, 0),
        ]

        this.rakePoints = [
            new THREE.Vector3(this.frame.frameStemTopPoint.x, this.floorY + 1, 0),
            this.frame.frameStemTopPoint,
            this.frame.trailPoint,
        ]

        let forkLengthXLabelOffset =
            Math.cos(this.frame.fork.verticalStemAngle + this.frame.fork.tripleTreeRakeInRadians) * 100
        let forkLengthYLabelOffset =
            Math.sin(this.frame.fork.verticalStemAngle + this.frame.fork.tripleTreeRakeInRadians) * 100

        this.forkLengthPoints = [
            this.frame.tripleTreeCenterOfForkTubesPoint,
            new THREE.Vector3(
                this.frame.tripleTreeCenterOfForkTubesPoint.x + forkLengthXLabelOffset,
                this.frame.tripleTreeCenterOfForkTubesPoint.y + forkLengthYLabelOffset,
                0
            ),
            new THREE.Vector3(this.frontTire.x + forkLengthXLabelOffset, this.frontTire.y + forkLengthYLabelOffset, 0),
            new THREE.Vector3(this.frontTire.x, this.frontTire.y, 0),
        ]

        return this
    }

    buildLine(points, material) {
        let line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material)
        this.lineMeshes.push(line)

        return line
    }

    buildLabel(text, material) {
        let textGeo = new THREE.TextGeometry(text, this.textParameters)
        textGeo.computeBoundingBox()
        textGeo.computeVertexNormals()

        textGeo.textWidth = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x
        textGeo.textHeight = textGeo.boundingBox.max.y - textGeo.boundingBox.min.y

        let textMesh = new THREE.Mesh(textGeo, material)

        this.textMeshes.push(textMesh)

        return textMesh
    }

    buildDistanceLabel(title, valueMM, material) {
        let text = title + ': ' + valueMM.toFixed(0) + 'mm (' + this.convertMMtoIN(valueMM).toFixed(2) + '")'

        return this.buildLabel(text, material)
    }

    buildAngleLabel(title, valueDeg, material) {
        let text = title + ': ' + valueDeg.toFixed(1) + '°'

        return this.buildLabel(text, material)
    }

    buildWheelbaseLabel() {
        this.buildLine(this.wheelbasePoints, this.blueMaterial)
        let wheelbaseText = this.buildDistanceLabel('WHEELBASE', this.wheelbaseMM, this.blueMaterial)
        wheelbaseText.position.set(
            this.rearTire.x + this.wheelbaseMM / 2 - wheelbaseText.geometry.textWidth / 2,
            this.floorY,
            260
        )
        wheelbaseText.rotateX(-Math.PI / 2)

        return this
    }

    buildTrailLabel() {
        this.buildLine(this.trailPoints, this.redMaterial)
        let trailText = this.buildDistanceLabel('TRAIL', this.trailMM, this.redMaterial)
        trailText.rotateX(-Math.PI / 2)
        trailText.rotateZ(-Math.PI / 2)
        trailText.position.set(
            this.frontTire.x + (this.frame.trailPoint.x - this.frontTire.x) / 2 - trailText.geometry.textHeight / 2,
            this.floorY,
            260
        )

        return this
    }

    buildRakeLabel() {
        this.buildLine(this.rakePoints, this.greenMaterial)
        let rakeText = this.buildAngleLabel('RAKE', this.convertRADtoDEG(this.rakeRAD), this.greenMaterial)
        rakeText.rotateZ(-Math.PI / 2)
        rakeText.position.set(this.frame.frameStemTopPoint.x + rakeText.geometry.textHeight / 2, 0, 0)

        return this
    }

    buildForkLengthLabel() {
        this.buildLine(this.forkLengthPoints, this.yellowMaterial)
        let forkLengthText = this.buildDistanceLabel(
            'FORK LENGTH',
            this.frame.fork.length - this.frame.fork.offset,
            this.yellowMaterial
        )
        forkLengthText.rotateZ(
            -Math.PI / 2 + this.frame.fork.verticalStemAngle + this.frame.fork.tripleTreeRakeInRadians
        )
        let forkLengthXLabelOffset =
            Math.cos(this.frame.fork.verticalStemAngle + this.frame.fork.tripleTreeRakeInRadians) * 110
        let forkLengthYLabelOffset =
            Math.sin(this.frame.fork.verticalStemAngle + this.frame.fork.tripleTreeRakeInRadians) * 110

        forkLengthText.position.set(
            this.frame.tripleTreeCenterOfForkTubesPoint.x + forkLengthXLabelOffset,
            this.frame.tripleTreeCenterOfForkTubesPoint.y + forkLengthYLabelOffset,
            0
        )

        return true
    }

    buildLabels() {
        this.buildWheelbaseLabel().buildTrailLabel().buildRakeLabel().buildForkLengthLabel()

        return this
    }

    removeFromObject(object) {
        this.lineMeshes.forEach((lineMesh) => object.remove(lineMesh))
        this.lineMeshes = []

        this.textMeshes.forEach((textMesh) => object.remove(textMesh))
        this.textMeshes = []
    }

    addToObject(object) {
        this.lineMeshes.forEach((lineMesh) => object.add(lineMesh))

        this.textMeshes.forEach((textMesh) => object.add(textMesh))
    }
}
