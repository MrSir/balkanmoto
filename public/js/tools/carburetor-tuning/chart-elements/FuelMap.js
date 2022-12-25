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
        let running_average_factor = 10

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

        if (this.chart.intakeMod !== null) {
            this.chart.intakeMod.points.forEach((point) => {
                coordinates[point.x] = coordinates[point.x] + (point.y) - (this.height/2)
            })
        }

        if (this.chart.exhaustMod !== null) {
            this.chart.exhaustMod.points.forEach((point) => {
                coordinates[point.x] = coordinates[point.x] + (point.y) - (this.height/2)
            })
        }

        coordinates.forEach((y, x) => {
            let computed_y = y / 2
            let average_y = y

            if (x > running_average_factor) {
                for (let i = 1; i < running_average_factor; i++) {
                    average_y += coordinates[x-i]
                }

                computed_y = (average_y / running_average_factor) / 2
            }

            if (computed_y > this.height) {
                computed_y = this.height
            } else if(computed_y < 0) {
                computed_y = 0
            }

            this.points.push(
                this.buildPoint(x, computed_y, this.z)
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
