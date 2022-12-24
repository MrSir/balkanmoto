class ThrottlePosition extends ChartElement{
    constructor(scene, renderer, camera, font, height, z) {
        super(scene, renderer, camera, font)

        this.height = height
        this.z = z

        this.position = 275
    }

    buildMeshes() {
        this.meshes.push(
            this.buildLine(
                [
                    this.buildPoint(this.position, 0, this.z),
                    this.buildPoint(this.position, this.height, this.z)
                ],
                this.redMaterial
            )
        )

        this.meshesInitialized = true
    }
}
