class Frame3D {
    static rearTireX = -700

    constructor(scene, renderer, camera, floorY, parameters) {
        this.scene = scene
        this.renderer = renderer
        this.camera = camera
        this.floorY = floorY

        this.backboneLength = parameters.backboneLength
        this.rake = parameters.rake
        this.parameters = parameters
        this.calculateBackboneAngle()

        this.rearTire = new Tire3D(
            floorY,
            parameters.rearTire.width,
            parameters.rearTire.aspect,
            parameters.rearTire.rimDiameterInInches
        )
        this.frontTire = new Tire3D(
            floorY,
            parameters.frontTire.width,
            parameters.frontTire.aspect,
            parameters.frontTire.rimDiameterInInches
        )
    }

    calculateBackboneAngle() {
        this.backboneAngle = Math.asin(
            (Math.cos(THREE.MathUtils.degToRad(this.rake)) *
                this.parameters.fork.length) /
                this.backboneLength
        )

        console.log(THREE.MathUtils.radToDeg(this.backboneAngle))
        return this
    }

    setBackboneLength(backboneLength) {
        this.backboneLength = backboneLength
        return this
    }

    setBackboneAngle(backboneAngle) {
        this.backboneAngle = backboneAngle
        return this
    }

    setRake(rake) {
        this.rake = rake
        return this
    }

    calculateFrontTirePosition() {
        let a = Math.cos(this.backboneAngle) * this.backboneLength
        let b = Math.sin(this.backboneAngle) * this.backboneLength
        let c =
            Math.sin(THREE.MathUtils.degToRad(this.rake)) *
            this.parameters.fork.length

        this.frontTire
            .setX(a + c)
            .calculateTorusSize()
            .setY(0)
            .buildTorus()
    }

    calculateFramePivot() {
        this.forkPivot = new THREE.Group()

        let forkPivotOffsetX =
            Math.cos(this.backboneAngle) * this.backboneLength + this.rearTire.x
        let forkPivotOffestY =
            Math.sin(this.backboneAngle) * this.backboneLength + this.rearTire.y

        let forkPivotMesh = new THREE.Mesh(
            new THREE.SphereGeometry(10),
            this.rearTire.torusMaterial
        )
        forkPivotMesh.position.set(forkPivotOffsetX, forkPivotOffestY, 0)
        this.scene.add(forkPivotMesh)

        this.forkPivot.position.set(forkPivotOffsetX, forkPivotOffestY, 0)
        this.calculateFrontTirePosition()
        this.frontTire.addToObject(this.forkPivot)
        this.forkPivot.rotateZ(THREE.MathUtils.degToRad(this.rake))
    }

    removeFromScene() {
        this.rearTire.removeFromObject(this.scene)
        this.frontTire.removeFromObject(this.scene)
        this.frontTire.removeFromObject(this.forkPivot)
        //temp

        //this.Fork.removeFromObject(this.forkPivot)

        this.scene.remove(this.forkPivot)
    }

    drawInScene() {
        this.rearTire
            .setX(Frame3D.rearTireX)
            .calculateTorusSize()
            .calculateYBasedOnWheelDiameter()
            .buildTorus()
            .addToObject(this.scene)

        //this.frontTire.calculateTorusSize().buildTorus()

        this.calculateFramePivot()
        this.scene.add(this.forkPivot)

        this.renderer.render(this.scene, this.camera)
    }

    redrawInScene() {
        this.removeFromScene()

        this.drawInScene()
    }
}
