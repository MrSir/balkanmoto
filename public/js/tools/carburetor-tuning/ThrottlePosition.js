class ThrottlePosition extends ChartElement{
    constructor(scene, renderer, camera, font, height, floorY) {
        super(scene, renderer, camera, font)

        this.height = height
        this.floorY = floorY
        this.font = font

        this.position = 275
    }

    buildMeshes() {
        this.meshes.push(
            this.buildLine(
                [
                    this.buildPoint(this.position, 0, this.floorY),
                    this.buildPoint(this.position, this.height, this.floorY)
                ],
                this.redMaterial
            )
        )

        this.meshesInitialized = true
    }
}
