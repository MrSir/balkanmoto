class FuelMap extends ChartElement{
    constructor(scene, renderer, camera, font, width, height, z, chart) {
        super(scene, renderer, camera, font)

        this.width = width
        this.height = height
        this.z = z

        this.chart = chart
    }

    buildPoints() {
        let coordinates = []

        this.chart.idleCircuit.points.forEach((point) => {
            coordinates[point.x] = point.y
        })

        this.chart.needleDiameter.points.forEach((point) => {
            coordinates[point.x] = coordinates[point.x] + point.y
        })

        this.chart.needleClipPosition.points.forEach((point) => {
            coordinates[point.x] = coordinates[point.x] + point.y
        })

        this.chart.needleTaper.points.forEach((point) => {
            coordinates[point.x] = coordinates[point.x] + point.y
        })

        this.chart.mainFuelJet.points.forEach((point) => {
            coordinates[point.x] = coordinates[point.x] + point.y
        })

        coordinates.forEach((y, x) => {
            this.points.push(
                this.buildPoint(x, y/2, this.z)
            )
        })

        return this.points
    }

    buildMeshes() {
        this.meshes.push(
            this.buildLine(this.buildPoints(), this.fusiaMaterial)
        )

        this.meshesInitialized = true
    }
}
