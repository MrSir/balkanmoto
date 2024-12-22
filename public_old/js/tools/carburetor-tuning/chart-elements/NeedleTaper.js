class NeedleTaper extends ChartElement {
    constructor(scene, renderer, camera, font, width, height, z) {
        super(scene, renderer, camera, font)

        this.width = width
        this.height = height
        this.z = z

        this.taper = 1

        this.mean = this.width * 0.6
        this.standardDiviation = 260
        this.multiplier = 1000**1.90
    }

    f(x) {
        let adjustedMultiplier = this.multiplier  + (100000 * (this.taper-1))

        let y = this.normalDistributionF(x, this.mean, this.standardDiviation)

        y *= adjustedMultiplier

        if (y > this.height) {
            return this.height
        } else if(y < 0) {
            return 0
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
            this.buildLine(this.buildPoints(), this.blueMediumMaterial),
        )

        this.meshesInitialized = true
    }
}