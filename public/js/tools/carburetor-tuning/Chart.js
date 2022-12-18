class Chart extends ChartElement{
    constructor(scene, renderer, camera, font, width, height, floorY) {
        super(scene, renderer, camera, font)

        this.width = width
        this.height = height
        this.floorY = floorY

        this.throttlePosition = new ThrottlePosition(scene, renderer, camera, font, this.height, floorY)
    }

    drawYAxis() {
        let yAxis = this.buildLine(
            [
                this.buildPoint(0, 0, this.floorY),
                this.buildPoint(0, this.height, this.floorY),
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
                        this.buildPoint(-yAxisLineWidth/2, i*yAxisLineSpace, this.floorY),
                        this.buildPoint(yAxisLineWidth/2, i*yAxisLineSpace, this.floorY)
                    ],
                    this.blackMaterial
                )
            )
            yAxisElements.push(
                this.buildLabel(yAxisLabels[i], - 200,i*yAxisLineSpace, this.floorY, this.blackMaterial)
            )
        }
        yAxisElements.forEach((element) => this.scene.add(element))
    }

    drawXAxis() {
        let xAxisY = 0
        let xAxis = this.buildLine(
            [
                this.buildPoint(0, xAxisY, this.floorY),
                this.buildPoint(0 + this.width, xAxisY, this.floorY),
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
                        this.buildPoint(i*xAxisLineSpace, xAxisY-xAxisLineHeight, this.floorY),
                        this.buildPoint(i*xAxisLineSpace, xAxisY+xAxisLineHeight, this.floorY)
                    ],
                    this.blackMaterial
                )
            )
            xAxisElements.push(
                this.buildLabel(xAxisLabels[i], i*xAxisLineSpace,xAxisY - 100, this.floorY, this.blackMaterial)
            )
        }
        xAxisElements.forEach((element) => this.scene.add(element))

        let title = this.buildLabel(
            'Throttle Position',
            (2*xAxisLineSpace) - 120,
            xAxisY - 200,
            this.floorY,
            this.blackMaterial
        )
        this.scene.add(title)
    }

    drawChart() {
        this.drawYAxis()
        this.drawXAxis()

        this.throttlePosition.toggleVisible(true)
    }
}