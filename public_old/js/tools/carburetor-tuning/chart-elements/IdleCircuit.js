class IdleCircuit extends ChartElement {
    constructor(scene, renderer, camera, font, width, height, z) {
        super(scene, renderer, camera, font)

        this.width = width
        this.height = height
        this.z = z

        this.fuelJetSize = 17.5
        this.mixScrewTurns = 2.5
    }

    f(x) {
        if (x === 0) {
            return this.height
        }

        let y = (200000/x) * (this.fuelJetSize/17.5) * (this.mixScrewTurns/2.5)

        if (y > this.height) {
            return this.height
        }

        return y
    }

    buildPoints() {
        for (let x = 0; x <= this.width; x++) {
            this.points.push(this.buildPoint(x, this.f(x), this.z))
        }

        return this.points
    }

    buildMeshes() {
        this.meshes.push(
            this.buildLine(this.buildPoints(), this.blueMaterial)
        )

        this.meshesInitialized = true
    }
}