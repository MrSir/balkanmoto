class Labels3D {
    constructor(floorY, frame) {
        this.floorY = floorY
        this.frame = frame
        this.rearTire = frame.rearTire
        this.frontTire = frame.frontTire

        this.blueMaterial = new THREE.LineBasicMaterial({
            color: 0x0000ff,
        })
    }

    calculateLabelValues() {
        this.wheelbaseLength = this.frontTire.x - this.rearTire.x
        return this
    }

    calculatePoints() {
        this.wheelbasePoints = [
            new THREE.Vector3(this.rearTire.x, this.rearTire.y, 0),
            new THREE.Vector3(this.rearTire.x, this.floorY + 1, 0),
            new THREE.Vector3(this.rearTire.x, this.floorY + 1, 200),
            new THREE.Vector3(this.frontTire.x, this.floorY + 1, 200),
            new THREE.Vector3(this.frontTire.x, this.floorY + 1, 0),
            new THREE.Vector3(this.frontTire.x, this.frontTire.y, 0),
        ]

        return this
    }

    buildLabels() {
        let wheelbaseGeometry = new THREE.BufferGeometry().setFromPoints(this.wheelbasePoints)
        this.wheelbase = new THREE.Line(wheelbaseGeometry, this.blueMaterial)

        let textGeo = new THREE.TextGeometry('WHEELBASE: ' + this.wheelbaseLength.toFixed(2), {
            font: this.frame.font,
            size: 50,
            height: 1,
            curveSegments: 2,
            bevelEnabled: false,
        })

        textGeo.computeBoundingBox()
        textGeo.computeVertexNormals()
        let textWidth = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x

        this.textMesh = new THREE.Mesh(textGeo, this.blueMaterial)
        this.textMesh.position.set(this.rearTire.x + this.wheelbaseLength / 2 - textWidth / 2, this.floorY, 260)
        this.textMesh.rotateX(-Math.PI / 2)

        return this
    }

    removeFromObject(object) {
        object.remove(this.wheelbase)
        object.remove(this.textMesh)
    }

    addToObject(object) {
        object.add(this.wheelbase)
        object.add(this.textMesh)
    }
}
