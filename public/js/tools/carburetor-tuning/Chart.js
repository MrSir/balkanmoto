class Chart {
    constructor(scene, container, width, height, floorY, font) {
        this.scene = scene
        this.container = container

        this.width = width
        this.height = height
        this.floorY = floorY

        this.font = font

        this.blackMaterial = new THREE.LineBasicMaterial({color: 0x000000})

        this.textParameters = {
            font: this.font,
            size: 30,
            height: 1,
            curveSegments: 2,
            bevelEnabled: false,
        }

    }

    buildLabel(text, x, y, z, material) {
        let textGeo = new THREE.TextGeometry(text, this.textParameters)
        textGeo.computeBoundingBox()
        textGeo.computeVertexNormals()

        textGeo.textWidth = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x
        textGeo.textHeight = textGeo.boundingBox.max.y - textGeo.boundingBox.min.y

        let textMesh = new THREE.Mesh(textGeo, material)
        textMesh.position.set(x, y, z)

        return textMesh
    }

    buildPoint(x, y, z) {
        return new THREE.Vector3(x, y, z)
    }

    buildLine(points, material) {
        return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material)
    }

    drawYAxis() {
        let yAxisX = -(this.width/3)
        let yAxis = this.buildLine(
            [
                this.buildPoint(yAxisX, 0, this.floorY),
                this.buildPoint(yAxisX, this.height, this.floorY),
            ],
            this.blackMaterial
        )
        this.scene.add(yAxis)

        let yAxisLineSpace = this.height / 4
        let yAxisLineWidth = 20
        let yAxisElements = []

        const yAxisLabels = ['Just Air', 'Lean', 'Optimal', 'Rich', 'Just Fuel']
        for (let i = 0; i <= 4; i++) {
            yAxisElements.push(
                this.buildLine(
                    [
                        this.buildPoint(yAxisX - (yAxisLineWidth/2), i*yAxisLineSpace, this.floorY),
                        this.buildPoint(yAxisX + (yAxisLineWidth/2), i*yAxisLineSpace, this.floorY)
                    ],
                    this.blackMaterial
                )
            )
            yAxisElements.push(
                this.buildLabel(yAxisLabels[i], yAxisX - 200,i*yAxisLineSpace, this.floorY, this.blackMaterial)
            )
        }
        yAxisElements.forEach((element) => this.scene.add(element))
    }

    drawXAxis() {
        let xAxisY = 0
        let xAxisStartX = -(this.width/3)
        let xAxis = this.buildLine(
            [
                this.buildPoint(xAxisStartX, xAxisY, this.floorY),
                this.buildPoint(xAxisStartX + this.width, xAxisY, this.floorY),
            ],
            this.blackMaterial
        )
        this.scene.add(xAxis)

        let xAxisLineSpace = this.width / 4
        let xAxisLineHeight = 20
        let xAxisElements = []

        const xAxisLabels = ['0%', '25%', '50%', '75%', '100%']
        for (let i = 0; i <= 4; i++) {
            xAxisElements.push(
                this.buildLine(
                    [
                        this.buildPoint(xAxisStartX + (i*xAxisLineSpace), xAxisY-xAxisLineHeight, this.floorY),
                        this.buildPoint(xAxisStartX + (i*xAxisLineSpace), xAxisY+xAxisLineHeight, this.floorY)
                    ],
                    this.blackMaterial
                )
            )
            xAxisElements.push(
                this.buildLabel(xAxisLabels[i], xAxisStartX + (i*xAxisLineSpace),xAxisY - 100, this.floorY, this.blackMaterial)
            )
        }
        xAxisElements.forEach((element) => this.scene.add(element))

        let title = this.buildLabel(
            'Throttle Position',
            xAxisStartX + (2*xAxisLineSpace) - 120,
            xAxisY - 200,
            this.floorY,
            this.blackMaterial
        )
        this.scene.add(title)
    }

    drawChart() {
        this.drawYAxis()
        this.drawXAxis()
    }
}