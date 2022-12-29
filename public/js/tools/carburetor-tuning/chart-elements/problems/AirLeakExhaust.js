class AirLeakExhaust extends ChartElement {
    constructor(scene, renderer, camera, font, width, height, z) {
        super(scene, renderer, camera, font)

        this.width = width
        this.height = height
        this.z = z
    }

    f(x) {
        let y = -(((this.height/55)*x/this.width) ** 1.55) + (this.height/2.4)

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
            this.buildLine(this.buildPoints(), this.redMaterial)
        )

        this.meshesInitialized = true
    }
}